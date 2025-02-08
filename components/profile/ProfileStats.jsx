"use client";
import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

const ProfileStats = ({
  postsCount,
  followersCount,
  followingCount,
  followers = [],
  following = [],
}) => {
  const [activeModal, setActiveModal] = useState(null);

  const openFollowersModal = () => setActiveModal("followers");
  const openFollowingModal = () => setActiveModal("following");
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md transition-colors duration-300">
        <div className="grid grid-cols-3 py-6 gap-4">
          <StatItem label="Posts" count={postsCount} />
          <StatItem
            label="Followers"
            count={followersCount}
            onClick={openFollowersModal}
          />
          <StatItem
            label="Following"
            count={followingCount}
            onClick={openFollowingModal}
          />
        </div>
      </div>

      {/* Modal Followers */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md max-h-[70vh] overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {activeModal === "followers" ? "Followers" : "Following"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <X />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[60vh]">
              {activeModal === "followers" ? (
                <FollowersList followers={followers} />
              ) : (
                <FollowingList following={following} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const StatItem = ({ label, count, onClick }) => (
  <div className="text-center cursor-pointer" onClick={onClick}>
    <span className="block text-2xl font-bold text-gray-900 dark:text-white">
      {count.toLocaleString()}
    </span>
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {label}
    </span>
  </div>
);

const FollowersList = ({ followers }) => {
  if (!followers || followers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Tidak ada followers
      </div>
    );
  }

  return (
    <div>
      {followers.map((follower) => (
        <UserListItem key={follower.id} user={follower} />
      ))}
    </div>
  );
};

const FollowingList = ({ following }) => {
  if (!following || following.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Tidak ada following
      </div>
    );
  }

  return (
    <div>
      {following.map((followedUser) => (
        <UserListItem key={followedUser.id} user={followedUser} />
      ))}
    </div>
  );
};

const UserListItem = ({ user }) => {
  return (
    <Link href={`/profile/${user.username}`}>
      <div className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <img
          src={user.profilePic || "/default-profile.png"}
          alt={user.username}
          className="w-10 h-10 rounded-full object-cover mr-4"
        />
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {user.username}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default ProfileStats;
