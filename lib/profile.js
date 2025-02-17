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


export async function editProfile(username, formData) {
  try {
    // First, get the current user to verify existence
    const currentUser = await prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });

    if (!currentUser) {
      return { success: false, message: "User not found" };
    }

    // Handle image uploads if present
    let profilePicUrl = formData.profilePic;
    let coverPicUrl = formData.coverPic;

    // Only upload if the image is a base64 string (new upload)
    if (formData.profilePic && formData.profilePic.startsWith('data:image')) {
      profilePicUrl = await uploadImageToCloudinary(formData.profilePic);
    }

    if (formData.coverPic && formData.coverPic.startsWith('data:image')) {
      coverPicUrl = await uploadImageToCloudinary(formData.coverPic);
    }

    // Update user and profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update username if changed
      if (username !== formData.username) {
        const existingUser = await tx.user.findUnique({
          where: { username: formData.username },
        });

        if (existingUser) {
          throw new Error("Username already taken");
        }

        await tx.user.update({
          where: { id: currentUser.id },
          data: { username: formData.username },
        });
      }

      // Update or create profile
      if (currentUser.profile) {
        await tx.profile.update({
          where: { userId: currentUser.id },
          data: {
            bio: formData.bio || null,
            location: formData.location || null,
            website: formData.website || null,
            profilePic: profilePicUrl || null,
            coverPic: coverPicUrl || null,
          },
        });
      } else {
        await tx.profile.create({
          data: {
            userId: currentUser.id,
            bio: formData.bio || null,
            location: formData.location || null,
            website: formData.website || null,
            profilePic: profilePicUrl || null,
            coverPic: coverPicUrl || null,
          },
        });
      }

      return { success: true };
    });

    return { 
      success: true, 
      message: "Profile updated successfully",
      newUsername: formData.username 
    };

  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error.message === "Username already taken") {
      return { 
        success: false, 
        message: "This username is already taken. Please choose another one." 
      };
    }

    return { 
      success: false, 
      message: "Failed to update profile. Please try again." 
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