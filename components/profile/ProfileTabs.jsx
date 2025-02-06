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
    <div className="bg-white shadow-sm rounded-xl mb-4">
      <div className="flex justify-center gap-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-4 font-medium text-sm transition-colors relative
              ${activeTab === tab.id 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-gray-900'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
 };

export default ProfileTabs;