// lib/actions.js
"use server"
import prisma from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createPost(formData) {
  // Get the current authenticated user
  const session = await getServerSession(authOptions);
  if (!session) {
    return { 
      success: false, 
      message: "You must be logged in to create a post" 
    };
  }

  try {
    let imageUrl = null;

    // Upload image if provided
    if (formData.image) {
      imageUrl = await uploadImageToCloudinary(formData.image);
    }

    // Create post in database
    const newPost = await prisma.post.create({
      data: {
        content: formData.caption,
        image: imageUrl,
        userId: session.user.id, // Adjust based on your session structure
      },
    });

    // Revalidate the path to refresh the page
    revalidatePath('/profile');
    revalidatePath('/');

    return {
      success: true,
      post: newPost
    };
  } catch (error) {
    console.error('Error creating post:', error);
    return {
      success: false,
      message: 'Failed to create post'
    };
  }
}

export async function uploadImageToCloudinary(base64Image) {
  try {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64Data}`, {
      folder: 'posts',
      transformation: [
        { width: 800, crop: "limit" }
      ]
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

export async function updatePost(formData) {
  // Get the current authenticated user
  const session = await getServerSession(authOptions);
  if (!session) {
    return { 
      success: false, 
      message: "You must be logged in to edit a post" 
    };
  }

  try {
    // Validate that the user owns the post
    const existingPost = await prisma.post.findUnique({
      where: { 
        id: formData.postId,
        userId: session.user.id 
      }
    });

    if (!existingPost) {
      return {
        success: false,
        message: 'Post not found or you do not have permission to edit'
      };
    }

    let imageUrl = existingPost.image;

    // Upload new image if provided
    if (formData.image) {
      imageUrl = await uploadImageToCloudinary(formData.image);
    }

    // Update post in database
    const updatedPost = await prisma.post.update({
      where: { 
        id: formData.postId,
        userId: session.user.id // Ensure user can only edit their own posts
      },
      data: {
        content: formData.caption,
        image: imageUrl, // Use new image or keep existing
      },
    });

    // Revalidate the paths to refresh the page
    revalidatePath('/profile');
    revalidatePath('/');

    return {
      success: true,
      post: updatedPost
    };
  } catch (error) {
    console.error('Error updating post:', error);
    return {
      success: false,
      message: 'Failed to update post'
    };
  }
}

export async function deletePost(postId) {
  // Get the current authenticated user
  const session = await getServerSession(authOptions);
  if (!session) {
    return { 
      success: false, 
      message: "You must be logged in to delete a post" 
    };
  }

  try {
    // Validate that the user owns the post
    const existingPost = await prisma.post.findUnique({
      where: { 
        id: postId,
        userId: session.user.id 
      }
    });

    if (!existingPost) {
      return {
        success: false,
        message: 'Post not found or you do not have permission to delete'
      };
    }

    // Delete the post from the database
    await prisma.post.delete({
      where: { 
        id: postId,
        userId: session.user.id // Ensure user can only delete their own posts
      }
    });

    // Revalidate the paths to refresh the page
    revalidatePath('/profile');
    revalidatePath('/');

    return {
      success: true,
      message: 'Post deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting post:', error);
    return {
      success: false,
      message: 'Failed to delete post'
    };
  }
}

export async function getComments(postId) {
  try {
    const comments = await prisma.comment.findMany({
      where: { 
        postId: postId 
      },
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function createComment(formData) {
  // Get the current authenticated user
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return { 
      success: false, 
      message: "You must be logged in to add a comment" 
    };
  }

  try {
    // Create comment in database
    const newComment = await prisma.comment.create({
      data: {
        postId: formData.postId,
        userId: session.user.id,
        content: formData.content
      },
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
        }
      }
    });

    // Revalidate the path to refresh the page
    revalidatePath('/');

    return {
      success: true,
      comment: newComment
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    return {
      success: false,
      message: 'Failed to add comment'
    };
  }
}

 export async function getExplorePosts() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return redirect('/login');
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: {
          not: session.user.id
        }
      },
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
    console.error('Error fetching explore posts:', error);
    return [];
  }
}