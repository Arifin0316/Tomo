"use client";

import { useState } from "react";
import PostDetailModal from "@/components/CreatePostModal/PostDetailModal";
import { Heart, MessageCircle } from "lucide-react";

const ProfilePosts = ({ user }) => {
  const [post, setPost] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-3 gap-1 mt-4">
        {user.posts.map((post) => (
          <div 
            key={post.id} 
            onClick={() => { setSelectedPost(user); setPost(post); }}
            className="relative aspect-square overflow-hidden group cursor-pointer"
          >
            {/* Post Image */}
            <img
              src={post.image || "/default-post.png"}
              alt="Post"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 dark:group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
              <div className="flex items-center space-x-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center space-x-1">
                  <Heart className="w-6 h-6 fill-current text-white" />
                  <span className="text-lg font-semibold">
                    {post.likes?.length || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-6 h-6 text-white" />
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
      {selectedPost && (
        <PostDetailModal 
          user={selectedPost}
          post={post}
          onClose={() => setSelectedPost(null)} 
        />
      )}
    </div>
  );
};

export default ProfilePosts;