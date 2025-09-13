"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    show: false,
    type: "",
    listingId: null,
    message: "",
    listing: null,
  });

  const router = useRouter();
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  const fetchMyListings = async () => {
    try {
      const res = await axios.get(`${BACKEND_API}/listing/getmylisting`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(res.data.data || []);
    } catch (err) {
      console.error("Error fetching user listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMyListings();
  }, [token]);

  // ✅ Toggle status confirm
  const confirmToggle = (listing) => {
    const nextStatus = listing.status === "Available" ? "Sold" : "Available";
    setModal({
      show: true,
      type: "toggle",
      listing,
      message: `Are you sure you want to mark this listing as "${nextStatus}"?`,
    });
  };

  const handleToggleConfirmed = async () => {
    const listing = modal.listing;
    const newStatus = listing.status === "Available" ? "Sold" : "Available";

    try {
      await axios.put(
        `${BACKEND_API}/listing/edit/${listing._id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setListings((prev) =>
        prev.map((item) =>
          item._id === listing._id ? { ...item, status: newStatus } : item
        )
      );

      setModal({
        show: true,
        type: "success",
        message: `Listing marked as ${newStatus}.`,
      });
    } catch (err) {
      console.error("Toggle error", err);
      setModal({
        show: true,
        type: "success",
        message: "Error changing status.",
      });
    }
  };

  // ✅ Delete confirm
  const confirmDelete = (id) => {
    setModal({
      show: true,
      type: "delete",
      listingId: id,
      message: "Are you sure you want to delete this listing? This action cannot be undone.",
    });
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${BACKEND_API}/listing/delete/${modal.listingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setListings((prev) => prev.filter((l) => l._id !== modal.listingId));
      setModal({
        show: true,
        type: "success",
        message: "Listing deleted successfully.",
      });
    } catch (err) {
      console.error("Delete error", err);
      setModal({
        show: true,
        type: "success",
        message: "Error deleting listing.",
      });
    }
  };

  const handleEdit = (listing) => {
    router.push(`/edit-listing?id=${listing._id}`);
  };

  // Loading Skeleton Component
  const ListingSkeleton = () => (
    <div className="bg-white rounded-2xl border border-red-100 shadow-lg p-6 animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-4"></div>
      <div className="flex justify-between">
        <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
        <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-6 sm:px-12 lg:px-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-red-800 mb-4">
            My Listings
          </h1>
          <p className="text-red-600 max-w-2xl mx-auto">
            Managing your product listings
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <ListingSkeleton key={item} />
          ))}
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-3">No listings found</h2>
          <p className="text-red-600 mb-6">You haven&apos;t created any listings yet. Start by adding your first product!</p>
          <button 
            onClick={() => router.push('/addForm')}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Create Your First Listing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-6 sm:px-12 lg:px-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-red-800 mb-4">
          My Listings
        </h1>
        <p className="text-red-600 max-w-2xl mx-auto">
          Manage your product listings, update status, edit details, or remove items
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white rounded-2xl border border-red-100 shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
          >
            {/* Status Ribbon */}
            <div className={`absolute -right-10 top-5 rotate-45 px-10 py-1 text-xs font-bold text-white z-10 ${listing.status === "Available" ? "bg-green-500" : "bg-red-500"}`}>
              {listing.status}
            </div>
            
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
              <Image
                src={
                  Array.isArray(listing.images) && listing.images.length > 0
                    ? listing.images[0]
                    : "/listingplaceholder.jpg"
                }
                alt={listing.name}
                fill
                style={{ objectFit: "contain" }}
                className="rounded-lg cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={() => router.push(`/view-listing?id=${listing._id}`)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            </div>

            <h2 className="text-xl font-bold text-red-800 truncate">{listing.name}</h2>
            
            <div className="my-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <span className="font-medium text-red-700">Category:</span> {listing.category}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span className="font-medium text-red-700">Quantity:</span> {listing.quantity} {listing.unit}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium text-red-700">Price:</span> ₹{listing.price}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-red-100">
              <button
                onClick={() => handleEdit(listing)}
                className="flex items-center bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit
              </button>

              <div className="flex items-center">
                <span className="text-xs text-gray-600 mr-2 font-medium">Status:</span>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={listing.status === "Available"}
                      onChange={() => confirmToggle(listing)}
                      className="sr-only"
                    />
                    <div
                      className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        listing.status === "Available"
                          ? "bg-green-400"
                          : "bg-red-400"
                      }`}
                    ></div>
                    <div
                      className={`dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 ${
                        listing.status === "Available"
                          ? "transform translate-x-6"
                          : ""
                      }`}
                    ></div>
                  </div>
                </label>
              </div>

              <button
                onClick={() => confirmDelete(listing._id)}
                className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
            <div className="text-center mb-5">
              <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${modal.type === "success" ? "bg-green-100" : "bg-red-100"} mb-4`}>
                {modal.type === "success" ? (
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : modal.type === "delete" ? (
                  <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                ) : (
                  <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {modal.type === "success"
                  ? "Success"
                  : modal.type === "delete"
                  ? "Confirm Delete"
                  : "Change Status"}
              </h2>
              <p className="text-gray-600">{modal.message}</p>
            </div>
            
            <div className="flex justify-center gap-4 mt-6">
              {modal.type === "success" ? (
                <button
                  onClick={() => setModal({ show: false })}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors duration-300 shadow-md"
                >
                  OK
                </button>
              ) : (
                <>
                  <button
                    onClick={
                      modal.type === "delete"
                        ? handleDeleteConfirmed
                        : handleToggleConfirmed
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors duration-300 shadow-md"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setModal({ show: false })}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2.5 rounded-lg font-medium transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;