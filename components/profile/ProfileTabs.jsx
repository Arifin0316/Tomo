"use client";

// components/Profile/ProfileTabs.js
import React, { useState } from 'react';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('posts');
 
  const tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'tagged', label: 'Tagged' }
  ];
 
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-md rounded-xl mb-4 transition-colors duration-300">
      <div className="flex justify-center gap-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-4 font-medium text-sm transition-all duration-200 relative
              ${activeTab === tab.id 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;