"use client";
import React, { useState } from "react";
import axios from "axios";
import { FiX, FiEdit2, FiGlobe, FiFileText, FiCheck } from "react-icons/fi";

const EditModal = ({ profile, token, onClose, onUpdate }) => {
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  const [formData, setFormData] = useState({
    bio: profile.bio || "",
    website: profile.website || "",
    gstNumber: profile.gstNumber || "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.put(
        `${BACKEND_API}/users/editpublicprofile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => {
        onUpdate(res.data.user);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <FiX size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center">
            <span className="flex-grow">{errorMsg}</span>
            <button onClick={() => setErrorMsg("")} className="ml-2">
              <FiX size={16} />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center">
            <FiCheck size={16} className="mr-2" />
            <span className="flex-grow">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Bio Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiEdit2 size={14} className="inline mr-1 -mt-1" />
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Tell everyone about yourself..."
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {formData.bio.length}/150
            </div>
          </div>

          {/* Website Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiGlobe size={14} className="inline mr-1 -mt-1" />
              Website
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              placeholder="https://example.com"
            />
          </div>

          {/* GST Number Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFileText size={14} className="inline mr-1 -mt-1" />
              GST Number
            </label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              placeholder="GSTIN123456789"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:transform-none disabled:hover:shadow-md"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;