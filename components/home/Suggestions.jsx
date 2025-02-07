"use client";

import { useState, useTransition } from "react";
import { toggleFollow } from "@/lib/home";
import toast from "react-hot-toast";
import Link from "next/link";

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
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Suggestions for You
        </h2>
        <Link 
          href="/discover"
          className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
        >
          See All
        </Link>
      </div>

      <div className="space-y-5">
        {suggestions.map((user) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.profile?.profilePic || "/default-profile.png"}
                alt={`${user.username}'s profile`}
                className="w-11 h-11 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-gray-300 transition-all"
              />
              <div>
                <Link 
                  href={`/profile/${user.username}`}
                  className="font-semibold text-sm text-gray-800 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                >
                  {user.username}
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Suggested for you
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleFollow(user.id)}
              disabled={isPending}
              className="text-sm font-medium text-blue-600 dark:text-blue-500 
                         hover:text-blue-700 dark:hover:text-blue-400 
                         bg-blue-50 dark:bg-blue-900/20 
                         px-3 py-1.5 rounded-lg 
                         transition-all 
                         disabled:opacity-50 disabled:cursor-not-allowed"
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