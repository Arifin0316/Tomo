// components/Search/SearchResults.js
import React from 'react';
import Link from 'next/link';

const SearchResults = ({ results }) => {
  if (!results.length) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-6">
        No users found
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {results.map((user) => (
        <Link
          key={user.id}
          href={`/profile/${user.username}`}
          className="flex items-center p-4 
            hover:bg-gray-50 dark:hover:bg-gray-700 
            transition-colors group 
            border-b last:border-b-0 
            border-gray-100 dark:border-gray-700"
        >
          <img
            src={user.profile?.profilePic || "/default-profile.png"}
            alt={user.username}
            className="w-11 h-11 rounded-full mr-4 object-cover 
              ring-2 ring-gray-200 dark:ring-gray-700 
              group-hover:ring-gray-300 dark:group-hover:ring-gray-600 
              transition-all"
          />
          <div className="flex-grow">
            <p className="font-semibold text-sm text-gray-800 dark:text-white 
              group-hover:text-gray-600 dark:group-hover:text-gray-300 
              transition-colors">
              {user.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.profile?.bio || "No bio available"}
            </p>
          </div>
          <div className="pl-4 text-gray-400 dark:text-gray-500 
            group-hover:text-gray-600 dark:group-hover:text-white 
            transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchResults;