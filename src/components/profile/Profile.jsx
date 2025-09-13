"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaSave, FaCamera ,FaCog } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation"; 


const Profile = ({ token }) => {
   const router = useRouter();
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  const [editName, setEditName] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [showsaveProfile, setShowSaveProfile] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [pendingProfileImage, setPendingProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const uploadProfileImage = async (base64Image) => {
    try {
      const response = await axios.put(
        `${BACKEND_API}/users/image`,
        { profilePicture: base64Image },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.profilePicture) {
        setUserData((prev) => ({
          ...prev,
          profilePicture: response.data.profilePicture,
        }));
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000);
      } else {
        throw new Error("Invalid response data on image upload");
      }
    } catch (err) {
      console.error("Error updating profile picture:", err);
      alert("Profile picture update failed!");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${BACKEND_API}/users/getuser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.user);
        setOriginalData(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    if (token) fetchUser();
  }, [token, BACKEND_API]);

  useEffect(() => {
    if (!originalData) return;

    const isChanged =
      userData.name !== originalData.name ||
      userData.address !== originalData.address;
    setShowSaveProfile(isChanged);
  }, [userData, originalData]);

  const saveProfile = async () => {
    try {
      const response = await axios.put(
        `${BACKEND_API}/users/edit`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData(response.data);
      setOriginalData(response.data);
      setShowSaveProfile(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Profile update failed!");
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("Image size must be less than 4 MB!");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPendingProfileImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmAndUploadImage = async () => {
    if (!pendingProfileImage) return;
    await uploadProfileImage(pendingProfileImage);
    setPendingProfileImage(null);
  };

  const triggerFileInput = () => fileInputRef.current.click();

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="h-1/2 bg-gradient-to-br from-red-500 to-pink-500 w-full absolute top-0 z-0" />
      <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden z-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-white opacity-100 blur-sm animate-bounce ${
              [
                "w-16 h-16 top-10 left-10",
                "w-32 h-32 top-20 left-40",
                "w-16 h-16 top-36 left-80",
                "w-20 h-20 bottom-10 right-20",
                "w-28 h-28 top-1/4 right-40",
              ][i]
            }`}
          ></div>
        ))}
      </div>
      <div className="h-1/2 bg-white w-full absolute bottom-0 z-0" />

      {/* Profile Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16">
        <div className="bg-white/40 backdrop-blur-md shadow-2xl border border-white/20 w-full max-w-5xl rounded-3xl pt-24 pb-10 px-6 text-center relative">
        {/* Settings Button - Only visible if Admin */}
{userData.role === "admin" && (
 <button
          className="absolute top-6 right-6 text-red-600 hover:text-red-800 bg-white/60 backdrop-blur-sm p-3 rounded-full shadow-md transition"
          title="Admin Settings"
          onClick={() => router.push("/admin")}
        >
          <FaCog size={20} />
        </button>
)}

          {/* Profile Image */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <img
                src={userData.profilePicture || "/personlogo.png"}
                alt="Profile"
                className="rounded-xl border-4 border-white shadow-xl w-40 h-40 object-cover"
              />
              <button
                onClick={triggerFileInput}
                className="absolute bottom-1 right-1 bg-red-600 p-2 rounded-full text-white hover:bg-red-700 transition"
                title="Change Profile Picture"
              >
                <FaCamera size={16} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Preview new image */}
            {pendingProfileImage && (
              <div className="mt-4 bg-white p-4 rounded-lg shadow-lg max-w-xs mx-auto text-center">
                <p className="mb-2 font-semibold">Preview New Profile Image</p>
                <img
                  src={pendingProfileImage}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={confirmAndUploadImage}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setPendingProfileImage(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Name */}
          <div className="flex justify-center items-center gap-4 mt-2">
            {editName ? (
              <input
                name="name"
                value={userData.name}
                onChange={handleChange}
                onBlur={() => setEditName(false)}
                className="text-3xl md:text-5xl font-bold text-red-700 bg-transparent border-b border-red-300 focus:outline-none"
                autoFocus
              />
            ) : (
              <>
                <h2 className="text-3xl md:text-5xl font-bold text-red-700">
                  {userData.name}
                </h2>
                <button
                  onClick={() => setEditName(true)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition"
                  title="Edit Name"
                >
                  <FaEdit size={18} />
                </button>
              </>
            )}
          </div>

          {/* Details */}
          <div className="mt-6 space-y-4 text-md md:text-xl text-gray-800 text-left max-w-md mx-auto">
            <p>
              <span className="font-semibold text-red-500">Email:</span>{" "}
              {userData.email}
            </p>
            <p>
              <span className="font-semibold text-red-500">Phone:</span>{" "}
              {userData.phone}
            </p>

            {/* Address */}
            <div className="flex items-start gap-2">
              <span className="font-semibold text-red-500">Address:</span>
              {editAddress ? (
                <textarea
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                  onBlur={() => setEditAddress(false)}
                  rows={2}
                  className="w-full bg-transparent border border-red-300 rounded-lg p-2 focus:outline-none"
                  autoFocus
                />
              ) : (
                <>
                  <span className="flex-1">{userData.address}</span>
                  <button
                    onClick={() => setEditAddress(true)}
                    className="text-red-600 hover:text-red-800"
                    title="Edit Address"
                  >
                    <FaEdit />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Save Button */}
          {showsaveProfile && (
            <div className="mt-8">
              <button
                onClick={saveProfile}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-200"
              >
                <FaSave className="inline-block mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm w-full animate-fade-in-down">
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Profile Updated!
            </h2>
            <p className="text-gray-700">
              Your profile has been successfully updated.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
