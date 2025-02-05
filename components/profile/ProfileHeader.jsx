import Link from 'next/link';

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Cover Picture */}
      <div className="h-48 bg-gray-200 relative">
        {user.profile?.coverPic ? (
          <img
            src={user.profile.coverPic}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-50"></div>
        )}
        
        {/* Profile Picture Overlay */}
        <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 border-4 border-white rounded-full">
          <img
            src={user.profile?.profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="pt-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
        
        {user.profile?.bio && (
          <p className="text-gray-600 mt-2 px-4 max-w-xl mx-auto">
            {user.profile.bio}
          </p>
        )}

        {user.profile?.website && (
          <a 
            href={user.profile.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 mt-2 block"
          >
            {user.profile.website}
          </a>
        )}

        {/* Edit Profile Button */}
        <div className="mt-4">
          <Link 
            href={`/profile/${user.username}/edit`} 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg text-sm font-semibold inline-block transition-colors duration-300"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;