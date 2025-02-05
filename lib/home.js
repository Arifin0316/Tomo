"use server"
import prisma from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
 
 export async function fetchHomePosts() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return redirect('/login');
  }

  try {
    // Fetch posts from users the current user follows
    const followedUserIds = await prisma.follow.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true }
    });

    const userIds = [
      ...followedUserIds.map(follow => follow.followingId),
      session.user.id // Include current user's posts
    ];

    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                profilePic: true
              }
            }
          }
        },
        likes: true,
        comments: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    return posts;
  } catch (error) {
    console.error('Error fetching home posts:', error);
    return [];
  }
}

 export async function fetchSuggestions() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return [];
  }

  try {
    // Fetch users not followed by current user
    const followedUserIds = await prisma.follow.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true }
    });

    const suggestedUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: [
            ...followedUserIds.map(follow => follow.followingId),
            session.user.id
          ]
        }
      },
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            profilePic: true
          }
        }
      },
      take: 5
    });

    return suggestedUsers;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}

export async function togglePostLike(postId) {
  // Get the current authenticated user
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { 
      success: false, 
      message: "You must be logged in to like a post" 
    };
  }

  try {
    // Check if the user has already liked the post
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: session.user.id,
        postId: postId
      }
    });

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: { id: existingLike.id }
      });

      revalidatePath('/');
      return {
        success: true,
        action: 'unliked'
      };
    } else {
      // Like the post
      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId: postId
        }
      });

      revalidatePath('/');
      return {
        success: true,
        action: 'liked'
      };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return {
      success: false,
      message: 'Failed to toggle like'
    };
  }
}

export async function toggleFollow(targetUserId) {
  // Get the current authenticated user
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { 
      success: false, 
      message: "You must be logged in to follow" 
    };
  }

  // Prevent self-following
  if (session.user.id === targetUserId) {
    return {
      success: false,
      message: "You cannot follow yourself"
    };
  }

  try {
    // Check if already following
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: session.user.id,
        followingId: targetUserId
      }
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: { id: existingFollow.id }
      });

      revalidatePath('/');
      revalidatePath('/explore');
      
      return {
        success: true,
        action: 'unfollowed'
      };
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: session.user.id,
          followingId: targetUserId
        }
      });

      revalidatePath('/');
      revalidatePath('/explore');

      return {
        success: true,
        action: 'followed'
      };
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    return {
      success: false,
      message: 'Failed to toggle follow'
    };
  }
}

export async function checkFollowStatus(targetUserId) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { 
      success: false, 
      isFollowing: false 
    };
  }

  try {
    const followRelation = await prisma.follow.findFirst({
      where: {
        followerId: session.user.id,
        followingId: targetUserId
      }
    });

    return {
      success: true,
      isFollowing: !!followRelation
    };
  } catch (error) {
    console.error('Error checking follow status:', error);
    return {
      success: false,
      isFollowing: false
    };
  }
}