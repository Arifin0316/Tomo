// components/Search/SearchResults.js
import React from 'react';
import Link from 'next/link';

const SearchResults = ({ results }) => {
  if (!results.length) {
    return (
      <div className="text-center text-gray-500 mt-4">
        No users found.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      {results.map((user) => (
        <Link
          key={user.id}
          href={`/profile/${user.username}`}
          className="flex items-center p-2 hover:bg-gray-100 rounded-lg"
        >
          <img
            src={user.profile?.profilePic || "/default-profile.png"}
            alt={user.username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-semibold">{user.username}</p>
            <p className="text-sm text-gray-500">{user.profile?.bio || "No bio"}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchResults;