import React, { useEffect, useState } from "react";
import axios from "axios";

const Accounts = ({ BACKEND_API }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(`${BACKEND_API}/users/suggestions`);
        setAccounts(res.data);
      } catch (err) {
        console.error("Failed to load accounts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [BACKEND_API]);

  const handleProfileClick = (username) => {
    window.location.href = `/${username}`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 animate-pulse"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Suggested Accounts</h2>
          <p className="text-gray-600 mt-1">Discover amazing creators and connect with friends</p>
        </div>
     
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {accounts.map((u, idx) => (
          <div
            key={`${u._id}-${idx}`}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
          >
          

            {/* Card Content */}
            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <img
                    src={u.profilePicture || "/personlogo.png"}
                    alt={u.username}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md group-hover:border-red-500 transition-colors duration-300"
                  />
                  {u.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-gray-900 truncate group-hover:text-red-600 transition-colors duration-300">
                    {u.username}
                  </p>
                  <p className="text-sm text-gray-600 truncate">{u.name}</p>
                </div>
              </div>

              {/* Stats */}
             <div className="flex justify-between text-center mb-4">
  <div>
    <p className="text-sm font-semibold text-gray-900">{u.followersCount || 0}</p>
    <p className="text-xs text-gray-500">Followers</p>
  </div>
  <div>
    <p className="text-sm font-semibold text-gray-900">{u.postsCount || 0}</p>
    <p className="text-xs text-gray-500">Posts</p>
  </div>
  <div>
    <p className="text-sm font-semibold text-gray-900">{u.followingsCount || 0}</p>
    <p className="text-xs text-gray-500">Following</p>
  </div>
</div>


              {/* Action Button */}
              <button
                onClick={() => handleProfileClick(u.username)}
                className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 group/btn"
              >
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span>Visit Profile</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      {accounts.length > 0 && (
        <div className="text-center mt-8">
          <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
            View More Suggestions
          </button>
        </div>
      )}
    </div>
  );
};

export default Accounts;