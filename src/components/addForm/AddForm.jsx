"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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

const AddForm = () => {
  const router = useRouter();
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
    postedBy: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/profile");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      setMessage({ type: "error", text: "You can upload up to 5 images only." });
      return;
    }

    const oversized = files.some((file) => file.size > 3 * 1024 * 1024);
    if (oversized) {
      setMessage({
        type: "error",
        text: "Each image must be less than 3 MB.",
      });
      return;
    }

    const updatedImages = [...images, ...files];
    setImages(updatedImages);

    const previews = updatedImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    e.target.value = null;
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const token = sessionStorage.getItem("token");
    if (!token) {
      setMessage({
        type: "error",
        text: "You must be logged in to add a listing.",
      });
      setLoading(false);
      return;
    }

    try {
      // Convert images to Base64
      const convertToBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

      const base64Images = await Promise.all(images.map((img) => convertToBase64(img)));

      const payload = {
        ...formData,
        images: base64Images,
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/listing/addlisting`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setShowModal(true);
      setMessage({ type: "success", text: "Listing added successfully!" });
      setFormData({
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
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to add listing. Try again.",
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
            onClick={() => router.push('/marketplace')}
            className="mb-4 inline-flex items-center text-white bg-red-800 bg-opacity-30 hover:bg-opacity-40 px-4 py-2 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Marketplace
          </button>
          <h2 className="text-3xl font-bold mb-2">Add New Listing</h2>
          <p className="text-red-100">Fill in the details of your product to create a new listing</p>
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

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-red-700 font-medium">
                  Upload Images (up to 5 images, 3MB each)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-red-300 rounded-lg cursor-pointer bg-red-50 hover:bg-red-100 transition-all duration-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="mb-2 text-sm text-red-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-red-600">PNG, JPG, GIF up to 3MB</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="h-28 w-full object-cover rounded-lg border border-red-200 shadow-sm transition-all duration-300 group-hover:brightness-75"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                  Processing...
                </>
              ) : (
                "Add Listing"
              )}
            </button>
          </form>
        </div>
      </div>
      
      {showModal && <Modal message="Listing added successfully!" onClose={handleCloseModal} />}
    </div>
  );
};

export default AddForm;