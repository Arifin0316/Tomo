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
      <div className="text-center py-10 text-gray-500">
        Tidak ada postingan untuk ditampilkan
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <div 
            key={post.id} 
            onClick={() => handlePostSelect(post, post.user)}
            className="relative aspect-square overflow-hidden group cursor-pointer"
          >
            {/* Post Image */}
            <img
              src={post.image || "/default-post.png"}
              alt="Explore Post"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <div className="flex items-center space-x-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center space-x-1">
                  <Heart className="w-6 h-6 fill-current text-white" />
                  <span className="text-lg font-semibold">
                    {post.likes?.length || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-lg font-semibold">
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