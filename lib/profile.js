"use server"
import prisma from "@/lib/prisma";  // Ensure correct import path
import { cloudinary } from "@/lib/cloudinary";

export async function getProfile(username) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
        posts: true,
        followers: true,
        following: true,
        
      },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      postsCount: user.posts.length,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function getUserFollowers(username) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
      },
    });

    if (!user) {
      return {
        error: true,
        message: "User not found"
      };
    }

    const followers = await prisma.follow.findMany({
      where: { followingId: user.id },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                profilePic: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      followers: followers.map(follow => ({
        id: follow.follower.id,
        username: follow.follower.username,
        profilePic: follow.follower.profile?.profilePic || '/default-profile.png',
      })),
    };
  } catch (error) {
    console.error('Error fetching followers:', error);
    return {
      error: true,
      message: "Failed to fetch followers"
    };
  }
}

export async function getUserFollowing(username) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
      },
    });

    if (!user) {
      return {
        error: true,
        message: "User not found"
      };
    }

    const following = await prisma.follow.findMany({
      where: { followerId: user.id },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                profilePic: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      following: following.map(follow => ({
        id: follow.following.id,
        username: follow.following.username,
        profilePic: follow.following.profile?.profilePic || '/default-profile.png',
      })),
    };
  } catch (error) {
    console.error('Error fetching following:', error);
    return {
      error: true,
      message: "Failed to fetch following"
    };
  }
}

export async function toggleFollow(currentUserId, targetUsername) {
  try {
    const targetUser = await prisma.user.findUnique({
      where: { username: targetUsername },
      select: { id: true },
    });

    if (!targetUser) {
      return {
        error: true,
        message: "Target user not found"
      };
    }

    // Cek apakah sudah follow
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: currentUserId,
        followingId: targetUser.id,
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });

      return {
        success: true,
        action: 'unfollowed',
      };
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: targetUser.id,
        },
      });

      return {
        success: true,
        action: 'followed',
      };
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    return {
      error: true,
      message: "Failed to toggle follow"
    };
  }
}


export async function editProfile(username, data) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return {
        error: true,
        message: "User not found"
      };
    }

    // Upload profile picture if provided
    let profilePicUrl = data.profilePic;
    if (data.profilePic && data.profilePic.startsWith('data:image')) {
      profilePicUrl = await uploadImageToCloudinary(data.profilePic);
    }

    // Upload cover picture if provided
    let coverPicUrl = data.coverPic;
    if (data.coverPic && data.coverPic.startsWith('data:image')) {
      coverPicUrl = await uploadImageToCloudinary(data.coverPic);
    }

    // Update profile with provided data
    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        bio: data.bio || undefined,
        location: data.location || undefined,
        website: data.website || undefined,
        profilePic: profilePicUrl || undefined,
        coverPic: coverPicUrl || undefined
      }
    });

    // Optionally update username if changed
    if (data.username && data.username !== username) {
      await prisma.user.update({
        where: { id: user.id },
        data: { username: data.username }
      });
    }

    return {
      success: true,
      profile: updatedProfile
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      error: true,
      message: error.message || "Failed to update profile"
    };
  }
}

export async function uploadImageToCloudinary(base64Image) {
  try {

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64Data}`, {
      folder: 'profile',
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Detailed Upload Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}