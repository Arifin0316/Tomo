// components/Profile/ProfileStats.js
import React from 'react';

const ProfileStats = ({ postsCount, followersCount, followingCount }) => {
  return (
    <div className="flex justify-around py-4 border-b">
      <div className="text-center">
        <span className="font-bold">{postsCount}</span>
        <p className="text-sm text-gray-600">Posts</p>
      </div>
      <div className="text-center">
        <span className="font-bold">{followersCount}</span>
        <p className="text-sm text-gray-600">Followers</p>
      </div>
      <div className="text-center">
        <span className="font-bold">{followingCount}</span>
        <p className="text-sm text-gray-600">Following</p>
      </div>
    </div>
  );
};

export default ProfileStats;