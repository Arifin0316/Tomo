"use client";

// components/Profile/ProfileTabs.js
import React, { useState } from 'react';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="flex justify-center border-b">
      <button
        className={`px-4 py-2 ${activeTab === 'posts' ? 'border-t-2 border-black font-semibold' : 'text-gray-600'}`}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </button>
      <button
        className={`px-4 py-2 ${activeTab === 'tagged' ? 'border-t-2 border-black font-semibold' : 'text-gray-600'}`}
        onClick={() => setActiveTab('tagged')}
      >
        Tagged
      </button>
    </div>
  );
};

export default ProfileTabs;