const ProfileStats = ({ postsCount, followersCount, followingCount }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="grid grid-cols-3 py-6 gap-4">
        <StatItem label="Posts" count={postsCount} />
        <StatItem label="Followers" count={followersCount} />
        <StatItem label="Following" count={followingCount} />
      </div>
    </div>
  );
 };
 
 const StatItem = ({ label, count }) => (
  <div className="text-center">
    <span className="block text-2xl font-bold text-gray-900">
      {count.toLocaleString()}
    </span>
    <span className="text-sm font-medium text-gray-500">
      {label}
    </span>
  </div>
 );
 
 export default ProfileStats;