"use client";

import { useState, useTransition } from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import PostDetailModal from "@/components/CreatePostModal/PostDetailModal";
import { togglePostLike } from "@/lib/home";
import toast from "react-hot-toast";
import Link from "next/link";

const HomeFeed = ({ initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handlePostSelect = (post, user) => {
    setSelectedPost(post);
    setSelectedUser(user);
  };

  const handleLike = (postId) => {
    startTransition(async () => {
      try {
        const result = await togglePostLike(postId);
        
        if (result.success) {
          // Update posts state to reflect like/unlike
          const updatedPosts = posts.map(post => 
            post.id === postId 
              ? {
                  ...post,
                  likes: result.action === 'liked'
                    ? [...post.likes, { userId: 'current_user' }]
                    : post.likes.filter(like => like.userId !== 'current_user')
                }
              : post
          );
          
          setPosts(updatedPosts);

          // Show toast notification
          toast(result.action === 'liked' 
            ? 'Post liked!' 
            : 'Post unliked', 
            { icon: result.action === 'liked' ? '❤️' : '💔' }
          );
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Failed to toggle like');
      }
    });
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="bg-white border rounded-lg overflow-hidden"
        >
          {/* Post Header */}
          <div className="flex items-center p-4">
            <Link href={`profile/${post.user.username}`} className="flex items-center">
            <img
              src={post.user.profile?.profilePic || "/default-profile.png"}
              alt={`${post.user.username}'s profile`}
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="font-semibold">{post.user.username}</span>
            </Link>
          </div>

          {/* Post Image */}
          <div 
            onClick={() => handlePostSelect(post, post.user)}
            className="cursor-pointer"
          >
            <img
              src={post.image || "/default-post.png"}
              alt="Post"
              className="w-full aspect-square object-cover"
            />
          </div>

          {/* Post Interactions */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleLike(post.id)}
                  disabled={isPending}
                  className={`hover:text-gray-600 ${
                    post.likes.some(like => like.userId === 'current_user') 
                      ? 'text-red-500' 
                      : ''
                  }`}
                >
                  <Heart 
                    className={`w-6 h-6 ${
                      post.likes.some(like => like.userId === 'current_user') 
                        ? 'fill-current' 
                        : ''
                    }`} 
                  />
                </button>
                <button 
                  onClick={() => handlePostSelect(post, post.user)}
                  className="hover:text-gray-600"
                >
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button className="hover:text-gray-600">
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <button className="hover:text-gray-600">
                <Bookmark className="w-6 h-6" />
              </button>
            </div>

            {/* Likes and Caption */}
            <div>
              <p className="font-semibold mb-1">
                {post.likes.length} likes
              </p>
              <p>
                <span className="font-semibold mr-2">{post.user.username}</span>
                {post.content}
              </p>
              {post.comments.length > 0 && (
                <button 
                  onClick={() => handlePostSelect(post, post.user)}
                  className="text-gray-500 mt-1"
                >
                  View {post.comments.length} comments
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Post Detail Modal */}
      {selectedPost && selectedUser && (
        <PostDetailModal 
          user={selectedUser}
          post={selectedPost}
          onClose={() => {
            setSelectedPost(null);
            setSelectedUser(null);
          }} 
        />
      )}
    </div>
  );
};

export default HomeFeed;