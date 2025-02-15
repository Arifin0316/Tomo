"use client";

import { useState } from "react";
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

  // Instagram-style grid pattern
  const getPostSize = (index) => {
    // Setiap kelompok 3 post: 1 tinggi dan 2 kecil
    const groupPosition = index % 3;
    return groupPosition === 0 ? 'tall' : 'small';
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        No posts to display
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1 md:gap-2 auto-rows-[minmax(100px,auto)]">
        {posts.map((post, index) => {
          const size = getPostSize(index);
          
          return (
            <div 
              key={post.id} 
              onClick={() => handlePostSelect(post, post.user)}
              className={`
                relative overflow-hidden group cursor-pointer
                transform transition-all duration-300 
                hover:scale-[1.02] hover:z-10
                ${size === 'tall' ? 'row-span-2' : 'aspect-square'}
              `}
            >
              {/* Post Image */}
              <img
                src={post.image || "/default-post.png"}
                alt="Explore Post"
                className={`
                  w-full h-full object-cover
                  ${size === 'tall' ? 'object-center' : ''}
                `}
                loading="lazy"
              />
              
              {/* Hover Overlay - Instagram Style */}
              <div className="absolute inset-0 
                bg-black/40 opacity-0
                group-hover:opacity-100 
                transition-opacity duration-200
                flex items-center justify-center">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-6 h-6 text-white" />
                    <span className="text-white font-semibold">
                      {post.likes?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-6 h-6 text-white" />
                    <span className="text-white font-semibold">
                      {post.comments?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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