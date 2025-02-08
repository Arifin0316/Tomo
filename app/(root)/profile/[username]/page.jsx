// app/(root)/profile/[username]/page.jsx

import { getProfile, getUserFollowers, getUserFollowing } from "@/lib/profile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfilePosts from "@/components/profile/ProfilePosts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage({ params }) {
  const session = await getServerSession(authOptions);
  const username = (await params).username;
  const user = await getProfile(username);
  const userFolower = await getUserFollowing(user.username);
  const userFollowings = await getUserFollowers(user.username);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        User not found
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="space-y-6">
          <ProfileHeader
            user={user}
            isOwnProfile={session?.user?.username === user.username}
          />
          <ProfileStats
            postsCount={user.postsCount}
            followersCount={user.followersCount}
            followingCount={user.followingCount}
            followers={userFolower.following}
            following={userFollowings.followers}
          />
          <ProfileTabs />
          <ProfilePosts user={user} />
        </div>
      </div>
    </div>
  );
}
