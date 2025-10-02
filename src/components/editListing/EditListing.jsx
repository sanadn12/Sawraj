"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4 transform transition-all duration-300 scale-100 hover:scale-105">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <p className="mb-6 text-lg text-gray-800 font-semibold text-center">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const EditListing = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("id");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    price: "",
    details: "",
    status: "Available",
    address: "",
    listingType: "Sale",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/listing/getlisting/${listingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const listing = res.data.data;
        const [quantityValue, unitValue] = listing.quantity.split(" ");
        setFormData({
          ...listing,
          quantity: quantityValue,
          unit: unitValue || "",
        });
      } catch (err) {
        console.error("Failed to fetch listing:", err);
        setMessage({
          type: "error",
          text: "Failed to load listing details. Please try again.",
        });
      }
    };

    if (listingId) fetchListing();
  }, [listingId]);

  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/profile");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setMessage({ type: "error", text: "You must be logged in to edit a listing." });
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        quantity: `${formData.quantity} ${formData.unit}`,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/listing/edit/${listingId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowModal(true);
      setMessage({ type: "success", text: "Listing updated successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to update listing. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-red-100">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
          <button
            onClick={() => router.push("/profile")}
            className="mb-4 inline-flex items-center text-white bg-red-800 bg-opacity-30 hover:bg-opacity-40 px-4 py-2 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to My Profile
          </button>
          <h2 className="text-3xl font-bold mb-2">Edit Listing</h2>
          <p className="text-red-100">Update your product details</p>
        </div>

        <div className="p-8">
          {message.text && (
            <div
              className={`p-4 rounded-lg mb-6 font-semibold ${
                message.type === "success" 
                  ? "bg-green-100 text-green-700 border border-green-200" 
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-red-700 font-medium">Product Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-red-700 font-medium">Price (₹)*</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
                  placeholder="Enter price per unit"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-red-700 font-medium">Address*</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
                placeholder="Enter your address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-red-700 font-medium">Quantity*</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
                  min="0"
                  step="any"
                  placeholder="Enter quantity"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-red-700 font-medium">Unit*</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                >
                  <option value="" disabled>--Select Unit--</option>
                  <option value="kgs">Kgs</option>
                  <option value="pieces">Pieces</option>
                  <option value="liters">Liters</option>
                  <option value="meters">Meters</option>
                  <option value="packs">Packs</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-red-700 font-medium">Category*</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                required
              >
                <option value="" disabled>--Select Category--</option>
                <option value="Scrap Materials">Scrap Materials</option>
                                <option value="Coins & Collectibles">Coins & Collectibles</option>
                <option value="Construction Materials">Construction Materials</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Clothing">Clothing</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Plastic & Packaging Materials">Plastic & Packaging Materials</option>
                <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                <option value="Furniture">Furniture</option>
                <option value="Books & Stationery">Books & Stationery</option>
                <option value="Agricultural Products">Agricultural Products</option>
                <option value="Industrial Equipment">Industrial Equipment</option>
                <option value="Tools & Machinery">Tools & Machinery</option>
                <option value="Jewelry & Accessories">Jewelry & Accessories</option>
                <option value="Health & Beauty">Health & Beauty</option>
                <option value="Sports & Outdoor">Sports & Outdoor</option>
                <option value="Toys & Games">Toys & Games</option>
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Services">Services</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-red-700 font-medium">Details*</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
                placeholder="Describe your product in detail..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-red-700 font-medium">Status*</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                >
                  <option value="Available">Available</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-red-700 font-medium">Listing Type*</label>
                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                >
                  <option value="Sale">Sale</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                loading 
                  ? "bg-red-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Listing"
              )}
            </button>
          </form>
        </div>
      </div>
      
      {showModal && <Modal message="Listing updated successfully!" onClose={handleCloseModal} />}
    </div>
  );
};

export default EditListing;