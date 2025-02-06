import Link from 'next/link';

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="h-64 bg-gray-200 relative">
        {user.profile?.coverPic ? (
          <img
            src={user.profile.coverPic}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-60" />
        )}
        
        <div className="absolute -bottom-16 left-8 border-4 border-white rounded-full shadow-md">
          <img
            src={user.profile?.profilePic || "/default-profile.png"}
            alt=""
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
      </div>
 
      <div className="pt-20 px-8 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
            {user.profile?.bio && (
              <p className="text-gray-600 mt-2 max-w-xl">
                {user.profile.bio}
              </p>
            )}
            {user.profile?.website && (
              <a 
                href={user.profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                {user.profile.website}
              </a>
            )}
          </div>
 
          <div className="flex gap-3">
            <Link
              href={`/profile/${user.username}/edit`}
              className="bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </Link>
            <button
              // onClick={onLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
 };

export default ProfileHeader;