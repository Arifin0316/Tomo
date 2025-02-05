"use client";

import { useState, useTransition } from "react";
import { toggleFollow } from "@/lib/home";
import toast from "react-hot-toast";

const Suggestions = ({ initialSuggestions }) => {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [isPending, startTransition] = useTransition();

  const handleFollow = (userId) => {
    startTransition(async () => {
      try {
        const result = await toggleFollow(userId);
        
        if (result.success) {
          // Remove the followed user from suggestions
          const updatedSuggestions = suggestions.filter(user => user.id !== userId);
          setSuggestions(updatedSuggestions);

          // Show toast notification
          toast(result.action === 'followed' 
            ? 'User followed!' 
            : 'User unfollowed', 
            { icon: result.action === 'followed' ? '👥' : '🚶' }
          );
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Failed to toggle follow');
      }
    });
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Suggestions for You</h2>
        <button className="text-sm text-blue-500 hover:text-blue-600">
          See All
        </button>
      </div>

      <div className="space-y-4">
        {suggestions.map((user) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <img
                src={user.profile?.profilePic || "/default-profile.png"}
                alt={`${user.username}'s profile`}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold text-sm">{user.username}</p>
                <p className="text-xs text-gray-500">Suggested for you</p>
              </div>
            </div>
            <button 
              onClick={() => handleFollow(user.id)}
              disabled={isPending}
              className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;