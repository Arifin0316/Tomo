// app/(root)/profile/[username]/page.jsx

import { getProfile } from '@/lib/profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfilePosts from '@/components/profile/ProfilePosts';

export default async function ProfilePage({ params }) {
  
  const username = (await params).username;
  const user = await getProfile(username);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProfileHeader user={user} />
      <ProfileStats
        postsCount={user.postsCount}
        followersCount={user.followersCount}
        followingCount={user.followingCount}
      />
      <ProfileTabs />
      <ProfilePosts user={user}  />
    </div>
  );
}