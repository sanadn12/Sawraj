'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const MyListings = () => {
  const [userId, setUserId] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
const [listingToDelete, setListingToDelete] = useState(null);
const [modal, setModal] = useState({
  show: false,
  type: "", // "delete" or "toggle"
  listingId: null,
  message: "",
  listing: null,
});


  const router = useRouter();
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;


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
    await axios.put(`${BACKEND_API}/listing/edit/${listing._id}`, { status: newStatus }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  useEffect(() => {
    // Get userId from sessionStorage
    const storedUser = sessionStorage.getItem('userId');
    if (storedUser) {
      try {
       setUserId(storedUser);

      } catch (e) {
        console.error('Error parsing user from sessionStorage:', e);
      }
    }
  }, []);


    const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await axios.get(`${BACKEND_API}/listing/getmylisting/${userId}`,
              {
          headers: {
            Authorization: `Bearer ${token}`,  
          },
        }
        );
        setListings(res.data.data || []);
      } catch (err) {
        console.error('Error fetching user listings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchMyListings();
  }, [userId, BACKEND_API]);

  if (loading) {
    return (
      <div className="text-center text-red-600 font-semibold py-20 text-xl animate-pulse">
        Loading your listings...
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center text-red-500 py-20 text-2xl font-semibold">
        No listings found.
      </div>
    );
  }

  return (

    
    <div className="min-h-screen bg-gradient-to-tr from-white via-red-50 to-red-100 py-12 px-6 sm:px-12 lg:px-20">
      <h1 className="text-4xl md:text-5xl font-syne text-center font-bold text-red-800 mb-8">My Listings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((listing) => (
        <div
  key={listing._id}
  className="bg-white rounded-2xl border border-red-200 shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer"
>
<div className="relative w-full h-48"> {/* Adjust height as needed */}
  <Image
    src={
      Array.isArray(listing.images) && listing.images.length > 0
        ? listing.images[0]
        : '/listingplaceholder.jpg'
    }
    alt={listing.name}
    fill
    style={{ objectFit: 'contain' }}
    className="rounded-lg cursor-pointer"
    onClick={() => router.push(`/view-listing?id=${listing._id}`)}
  />
</div>
    
  <h2 className="text-xl font-bold text-red-800">{listing.name}</h2>
  <p className="text-sm text-gray-600 mb-1">
    <span className="text-red-700 font-semibold">Category:</span> {listing.category}
  </p>
  <p className="text-sm text-gray-600 mb-1">
    <span className="text-red-700 font-semibold">Quantity:</span> {listing.quantity}
  </p>
  <p className="text-sm text-gray-600 mb-1">
    <span className="text-red-700 font-semibold">Price:</span> ₹{listing.price}
  </p>
  <p className="text-sm text-gray-600 mb-3">
    <span className="text-red-700 font-semibold">Status:</span>{' '}
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
        listing.status?.toLowerCase() === 'available'
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-200 text-gray-700'
      }`}
    >
      {listing.status}
    </span>
  </p>
  <p className="text-xs text-gray-400 italic mb-4">
    Posted on: {new Date(listing.createdAt).toLocaleDateString()}
  </p>

 <div className="flex justify-between items-center space-x-2">
  <button
    onClick={() => handleEdit(listing)}
    className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
  >
    Edit
  </button>

  <label className="flex items-center cursor-pointer">
  <div className="relative">
    <input
      type="checkbox"
      checked={listing.status === 'Available'}
      onChange={() => confirmToggle(listing)}
      className="sr-only"
    />
    <div className={`w-12 h-6 rounded-full transition ${
      listing.status === 'Available' ? 'bg-green-400' : 'bg-red-400'
    }`}></div>
    <div
      className={`dot absolute w-5 h-5 bg-white rounded-full shadow -left-1 -top-0.5 transition transform ${
        listing.status === 'Available' ? 'translate-x-full bg-green-700' : 'bg-red-700'
      }`}
    ></div>
  </div>
  <span className="ml-2 text-xs text-gray-600">{listing.status}</span>
</label>

  <button
    onClick={() => confirmDelete(listing._id)}
    className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
  >
    Delete
  </button>
</div>
{modal.show && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
      <h2 className="text-xl font-semibold text-red-700 mb-4">
        {modal.type === "success" ? "Success" : modal.type === "delete" ? "Confirm Delete" : "Change Status"}
      </h2>
      <p className="text-sm text-gray-700 mb-6">{modal.message}</p>
      <div className="flex justify-center gap-4">
        {modal.type === "success" ? (
          <button
            onClick={() => setModal({ show: false })}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            OK
          </button>
        ) : (
          <>
            <button
              onClick={modal.type === "delete" ? handleDeleteConfirmed : handleToggleConfirmed}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Yes
            </button>
            <button
              onClick={() => setModal({ show: false })}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
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

        ))}
      </div>
    </div>
  );
};

export default MyListings;
