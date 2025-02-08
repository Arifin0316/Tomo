"use client"
import Link from 'next/link';
import { useState } from 'react';
import { MoreVertical, Edit, LogOut, Sun, Moon } from 'lucide-react';
import { toggleFollow } from "@/lib/home";
import { useSession, signIn, signOut } from "next-auth/react";

const ProfileHeader = ({followers, user, isOwnProfile }) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleFollow = async () => {
    try {
      const result = await toggleFollow(user.id);
      
      if (result.success) {
        // Update state berdasarkan aksi
        setIsFollowing(!isFollowing);
      } else {
        // Tangani error, misalnya tampilkan pesan
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Implementasi toggle dark mode
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl transition-colors duration-300">
      {/* Cover Photo */}
      <div className="h-64 bg-gray-200 dark:bg-gray-700 relative transition-colors duration-300">
        {user.profile?.coverPic ? (
          <img
            src={user.profile.coverPic}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-60 dark:opacity-30" />
        )}
        
        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-8 border-4 border-white dark:border-gray-800 rounded-full shadow-md transition-colors duration-300">
          <img
            src={user.profile?.profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-8 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.username}
            </h1>
            {user.profile?.bio && (
              <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-xl">
                {user.profile.bio}
              </p>
            )}
            {user.profile?.website && (
              <a 
                href={user.profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 dark:text-blue-400 hover:underline mt-2 inline-block transition-colors"
              >
                {user.profile.website}
              </a>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Tombol Follow/Unfollow untuk profil orang lain */}
            {!isOwnProfile && (
              <button
            onClick={handleToggleFollow}
            className={`
              px-6 py-2 rounded-lg font-medium transition-colors duration-200
              ${isFollowing 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600' 
                : 'bg-blue-600 text-white hover:bg-blue-700'}
            `}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
            )}

            {/* Tombol Settings */}
            <div className="relative">
              {isOwnProfile && (
                 <button 
                 onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                 className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
               >
                 <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
               </button>
              )}
             
              {isSettingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
                  {isOwnProfile && (
                    <div className="py-1">
                      <Link
                        href={`/profile/${user.username}/edit`}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300" />
                        Edit Profile
                      </Link>
                      <button
                        onClick={toggleDarkMode}
                        className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {isDarkMode ? (
                          <>
                            <Sun className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300" />
                            Light Mode
                          </>
                        ) : (
                          <>
                            <Moon className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300" />
                            Dark Mode
                          </>
                        )}
                      </button>
                      <button
                        // onClick={onLogout}
                        onClick={() => signOut()}
                        className="flex items-center w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                      
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;