"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle } from "lucide-react";
import PostDetailModal from "@/components/CreatePostModal/PostDetailModal";

const ExploreGrid = ({ initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handlePostSelect = (post, user) => {
    setSelectedPost(post);
    setSelectedUser(user);
  };

  // Handle case when no posts
  if (posts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        No posts to display
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {posts.map((post) => (
          <div 
            key={post.id} 
            onClick={() => handlePostSelect(post, post.user)}
            className="relative aspect-square overflow-hidden group cursor-pointer 
              transform transition-transform duration-300 
              hover:scale-[1.02] hover:z-10 
              rounded-lg shadow-sm hover:shadow-xl"
          >
            {/* Post Image */}
            <img
              src={post.image || "/default-post.png"}
              alt="Explore Post"
              className="w-full h-full object-cover 
                transition-transform duration-300 
                group-hover:scale-105 
                brightness-90 group-hover:brightness-75"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 
              bg-black bg-opacity-0 
              group-hover:bg-opacity-30 
              transition-all duration-300 
              flex items-center justify-center">
              <div className="flex items-center space-x-6 text-white 
                opacity-0 group-hover:opacity-100 
                transition-opacity duration-300 
                transform group-hover:scale-105">
                <div className="flex items-center space-x-2">
                  <Heart className="w-7 h-7 fill-current text-white drop-shadow-lg" />
                  <span className="text-lg font-semibold drop-shadow-lg">
                    {post.likes?.length || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-7 h-7 text-white drop-shadow-lg" />
                  <span className="text-lg font-semibold drop-shadow-lg">
                    {post.comments?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
    </>
  );
};

export default ExploreGrid;