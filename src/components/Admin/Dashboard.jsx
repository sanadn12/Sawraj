import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    recentUsers: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/users/all`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        
        if (response.data.success) {
          setUserData(response.data.data);
          
          // Calculate stats
          const verifiedCount = response.data.data.filter(user => user.verified).length;
          const unverifiedCount = response.data.data.length - verifiedCount;
          
          // Calculate recent users (last 7 days)
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const recentCount = response.data.data.filter(user => 
            new Date(user.createdAt) > oneWeekAgo
          ).length;
          
          setStats({
            totalUsers: response.data.data.length,
            verifiedUsers: verifiedCount,
            unverifiedUsers: unverifiedCount,
            recentUsers: recentCount
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="mt-4 h-4 w-32 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse mb-6"></div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-32 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage and monitor your platform users</p>
        </div>

        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">All registered users</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Verified Users</p>
                    <p className="text-3xl font-bold text-green-900 mt-1">{stats.verifiedUsers}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">Email verified accounts</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unverified Users</p>
                    <p className="text-3xl font-bold text-amber-900 mt-1">{stats.unverifiedUsers}</p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">Pending verification</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Users (7d)</p>
                    <p className="text-3xl font-bold text-purple-900 mt-1">{stats.recentUsers}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">Registered in last week</p>
              </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">User Growth</h2>
              <div className="h-64 flex items-end justify-between px-4 pb-4 border-b border-gray-200">
                {userData && userData.slice(-7).map((user, index) => (
                  <div key={user._id} className="flex flex-col items-center">
                    <div 
                      className="bg-gradient-to-b from-blue-400 to-blue-600 rounded-t w-10 transition-all duration-500 hover:opacity-80"
                      style={{ height: `${Math.min(100, (index + 1) * 15)}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">Last 7 days registration activity</p>
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b border-gray-200">
                      <th className="pb-3">User</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData && userData.slice(-5).map(user => (
                      <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                     <td className="py-4">
  <div className="flex items-center">
    {user.profilePicture ? (
      <img
        src={user.profilePicture} 
        alt={user.name || "User"}
        className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
      />
    ) : (
      <div className="h-10 w-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
      </div>
    )}
    <div className="ml-3">
      <p className="font-medium text-gray-900">{user.name || "Unknown"}</p>
      <p className="text-sm text-gray-500">{user.phone || "No phone"}</p>
      {user.address && (
        <p className="text-xs text-gray-400 truncate max-w-[180px]">
          {user.address}
        </p>
      )}
    </div>
  </div>
</td>
                        <td className="py-4">
                          <p className="text-gray-900">{user.email}</p>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.verified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {user.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4">
                          <p className="text-gray-600 text-sm">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;