"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostsSection from "../Post/PostsSection";
import { QrCode } from "lucide-react";
import Qr from "./Qr";
import axios from "axios";
import {
  FiUser,
  FiGlobe,
  FiBriefcase,
  FiHeart,
  FiUsers,
  FiImage,
  FiMessageSquare,
  FiCheckCircle,
  FiEdit3
} from "react-icons/fi";
import EditModal from "./EditModal";

const PublicProfile = ({ token, userId }) => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
  const [isFollowing, setIsFollowing] = useState(false);
const [isQrOpen, setIsQrOpen] = useState(false);

  // Fetch profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        let res;
        if (id) {
          res = await axios.get(`${BACKEND_API}/users/getotherprofile/${id}`);
        } else {
          res = await axios.get(`${BACKEND_API}/users/getmyprofile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        setProfile(res.data);

        // Check if current user is following this profile
       if (res.data.followers?.some(f => f === userId)) {
  setIsFollowing(true);
} else {
  setIsFollowing(false);
}
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id, token, userId]);

  const handleFollowToggle = async () => {
    if (!profile) return;
    try {
      if (isFollowing) {
        // Unfollow
        await axios.post(
          `${BACKEND_API}/users/unfollow`,
          { usernameToUnfollow: profile.username },
          { headers: { Authorization: `Bearer ${token}` } }
        );
     setProfile(prev => ({
  ...prev,
  followers: prev.followers.filter(f => f !== userId)
}));
setIsFollowing(false);
      } else {
        // Follow
        await axios.post(
          `${BACKEND_API}/users/follow`,
          { usernameToFollow: profile.username },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      setProfile(prev => ({
  ...prev,
  followers: [...prev.followers, userId] 
}));
setIsFollowing(true);
      }
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
  if (activeTab === "followers" && profile?.username) {
    async function fetchFollowers() {
      try {
        const res = await axios.get(`${BACKEND_API}/users/followers/${profile.username}`);
        setFollowers(res.data.followers);
      } catch (err) {
        console.error("Failed to fetch followers:", err);
      }
    }
    fetchFollowers();
  }
}, [activeTab, profile?.username]);

useEffect(() => {
  async function fetchData() {
    try {
      if (activeTab === "followers" && profile?.username) {
        const res = await axios.get(`${BACKEND_API}/users/followers/${profile.username}`);
        setFollowers(res.data.followers);
      } else if (activeTab === "following" && profile?.username) { 
        const res = await axios.get(`${BACKEND_API}/users/followings/${profile.username}`);
        setFollowings(res.data.followings);
      }
    } catch (err) {
      console.error(`Failed to fetch ${activeTab}:`, err);
    }
  }
  fetchData();
}, [activeTab, profile?.username]);


  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <FiUser className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Profile not found</h3>
        <p className="mt-1 text-gray-500">The user profile you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    </div>
  );

  const isOwnProfile = profile._id === userId;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Section */}
      <div className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start py-6 md:py-10">
            {/* Profile Image */}
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8">
              <img
                src={profile.profilePicture || "/personlogo.png"}
                alt={profile.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {profile.plan && (
                <div className="mt-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="mr-1" size={12} />
                  {profile.plan.name}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <h1 className="text-2xl font-bold">{profile.username}</h1>

                {/* Buttons */}
             {/* Buttons */}
<div className="mt-4 md:mt-0 flex space-x-3">
  <button
  className="flex items-center justify-center rounded-xl 
             bg-white text-red-600 w-12 h-12  transition-all duration-300 
             hover:bg-red-600 hover:text-white hover:scale-110 active:scale-95"
  onClick={() => setIsQrOpen(true)}
>
  <QrCode className="h-8 w-8" />
</button>

  {isOwnProfile ? (
    <>
      <button
        className="flex items-center gap-2 border-2 border-gray-800 rounded-full hover:bg-gray-800 hover:text-white text-black px-4 py-2 shadow-md transition-all duration-200"
        onClick={() => setIsEditOpen(true)}
      >
        <FiEdit3 className="h-5 w-5" /> Edit Profile
      </button>
      <button
        className="flex items-center gap-2 bg-red-500 rounded-full hover:bg-red-600 text-white px-3 py-2 shadow-md transition-all duration-200"
        onClick={() => (window.location.href = "/chats")}
      >
        <FiMessageSquare className="h-5 w-5" /> Chats
      </button>
    </>
  ) : (
    <>
      {/* Show follow & message only if logged in */}
      {token && (
        <>
          <button
            onClick={handleFollowToggle}
            className={`px-4 py-2 rounded-full flex items-center gap-2 shadow-md transition-all duration-200 ${
              isFollowing
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            <FiUser className="h-5 w-5" /> {isFollowing ? "Unfollow" : "Follow"}
          </button>

          <button
            className="text-red-500 border-2 border-red-500 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all duration-200 shadow-md"
            onClick={async () => {
              try {
                const res = await axios.post(
                  `${BACKEND_API}/messaging/`,
                  { userId: profile._id },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                const chat = res.data;
                window.location.href = `/chats?chatId=${chat._id}`;
              } catch (err) {
                console.error("Failed to start chat:", err);
              }
            }}
          >
            <FiMessageSquare className="h-5 w-5" /> Message
          </button>
        </>
      )}
    </>
  )}
</div>

              </div>

               {isEditOpen && (
        <EditModal
          profile={profile}
          token={token}
          onClose={() => setIsEditOpen(false)}
          onUpdate={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
        />
      )}

              {/* Stats */}
              <div className="mt-6 flex justify-center md:justify-start space-x-8 text-sm">
                <div className="flex flex-col items-center md:items-start">
                  <span className="font-bold text-gray-900">{profile.posts?.length || 0}</span>
                  <span className="text-gray-600">Posts</span>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <span className="font-bold text-gray-900">{profile.followers?.length || 0}</span>
                  <span className="text-gray-600">Followers</span>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <span className="font-bold text-gray-900">{profile.followings?.length || 0}</span>
                  <span className="text-gray-600">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
  <nav className="flex -mb-px space-x-6 overflow-x-auto scrollbar-hide">
    <button
      onClick={() => setActiveTab("posts")}
      className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center whitespace-nowrap ${
        activeTab === "posts"
          ? "border-red-500 text-red-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      <FiImage className="mr-2" />
      Posts
    </button>
    <button
      onClick={() => setActiveTab("about")}
      className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center whitespace-nowrap ${
        activeTab === "about"
          ? "border-red-500 text-red-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      <FiUser className="mr-2" />
      About
    </button>
    <button
      onClick={() => setActiveTab("followers")}
      className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center whitespace-nowrap ${
        activeTab === "followers"
          ? "border-red-500 text-red-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      <FiUsers className="mr-2" />
      Followers
    </button>
    <button
      onClick={() => setActiveTab("following")}
      className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center whitespace-nowrap ${
        activeTab === "following"
          ? "border-red-500 text-red-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      <FiUsers className="mr-2" />
      Following
    </button>
  </nav>
</div>

        
        {/* Tab Content */}
        <div className="mt-6">
      {activeTab === "posts" && (
  <PostsSection posts={profile.posts} isOwnProfile={isOwnProfile} token={token} />
)}
          
          {activeTab === "about" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
              
              <div className="space-y-4">
                {profile.bio && (
                  <div className="flex">
                    <div className="flex-shrink-0 w-32 text-gray-500">Bio</div>
                    <div className="text-gray-900">{profile.bio}</div>
                  </div>
                )}
                
                {profile.gstNumber && (
                  <div className="flex">
                    <div className="flex-shrink-0 w-32 text-gray-500 flex items-center">
                      <FiBriefcase className="mr-2 text-red-500" />
                      GST Number
                    </div>
                    <div className="text-gray-900">{profile.gstNumber}</div>
                  </div>
                )}
                
                {profile.website && (
                  <div className="flex">
                    <div className="flex-shrink-0 w-32 text-gray-500 flex items-center">
                      <FiGlobe className="mr-2 text-red-500" />
                      Website
                    </div>
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-500 hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
                
                <div className="flex">
                  <div className="flex-shrink-0 w-32 text-gray-500 flex items-center">
                    <FiUsers className="mr-2 text-red-500" />
                    Followers
                  </div>
                  <div className="text-gray-900">{profile.followers?.length || 0}</div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 w-32 text-gray-500 flex items-center">
                    <FiUsers className="mr-2 text-red-500" />
                    Following
                  </div>
                  <div className="text-gray-900">{profile.followings?.length || 0}</div>
                </div>
              </div>
            </div>
          )}
          
{activeTab === "followers" && (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-lg font-bold text-gray-900 mb-4">Followers</h2>

    {followers.length > 0 ? (
      <ul className="divide-y divide-gray-200">
        {followers.slice(0, 10).map((follower, idx) => {
          const isFollowingThisUser = profile?.followings?.includes(follower._id);

          return (
            <li
              key={idx}
              className="py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer rounded-lg px-3"
              onClick={() => window.location.href = `/${follower.username}`} // navigate
            >
              <div className="flex items-center">
                <img
                  src={follower.profilePicture || "/personlogo.png"}
                  alt={follower.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{follower.username}</p>
                  {follower.name && (
                    <p className="text-sm text-gray-500">{follower.name}</p>
                  )}
                </div>
              </div>

            
            </li>
          );
        })}
      </ul>
    ) : (
      <div className="text-center py-8">
        <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No followers yet</h3>
<p className="mt-1 text-gray-500">
  {isOwnProfile
    ? "You don’t have any followers."
    : "This user doesn’t have any followers."}
</p>
      </div>
    )}
  </div>
)}

{activeTab === "following" && (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-lg font-bold text-gray-900 mb-4">Following</h2>

    {followings.length > 0 ? (
      <ul className="divide-y divide-gray-200">
        {followings.slice(0, 10).map((following, idx) => (
          <li
            key={idx}
            className="py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer rounded-lg px-3"
            onClick={() => (window.location.href = `/${following.username}`)}
          >
            <div className="flex items-center">
              <img
                src={following.profilePicture || "/personlogo.png"}
                alt={following.username}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {following.username}
                </p>
                {following.name && (
                  <p className="text-sm text-gray-500">{following.name}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <div className="text-center py-8">
        <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No followings yet
        </h3>
        <p className="mt-1 text-gray-500">
          {isOwnProfile
            ? "You’re not following anyone."
            : "This user isn’t following anyone."}
        </p>
      </div>
    )}
  </div>
)}
        </div>
      </div>
      {isQrOpen && (
  <Qr
    url={`${window.location.origin}/${profile.username}`}
    onClose={() => setIsQrOpen(false)}
  />
)}

    </div>
  );
};

export default PublicProfile;