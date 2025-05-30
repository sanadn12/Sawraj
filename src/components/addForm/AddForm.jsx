"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm text-center">
        <p className="mb-4 text-lg text-green-400 font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      setFormData((prev) => ({ ...prev, postedBy: userId }));
    }
  }, []);

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
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("quantity", `${formData.quantity} ${formData.unit}`);
      payload.append("price", formData.price);
      payload.append("details", formData.details);
      payload.append("status", formData.status);
      payload.append("address", formData.address);
      payload.append("listingType", formData.listingType);
      payload.append("postedBy", formData.postedBy);

      images.forEach((image) => {
        payload.append("images", image);
      });

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/listing/addlisting`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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
        postedBy: formData.postedBy,
      });
      setImages([]);
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
    <div className="max-w-3xl mx-auto mt-10 bg-white border border-red-200 rounded-2xl shadow-xl p-8">
       <button
        onClick={() => router.push('/marketplace')}
        className="mb-8 inline-block text-red-700 font-semibold hover:text-red-900 transition-colors duration-300"
      >
        ← Back to Marketplace
      </button>
      <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">Add New Listing</h2>

      {message.text && (
        <div
          className={`text-center mb-4 font-semibold ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        {[
          { name: "name", label: "Product Name*", type: "text" },
          { name: "price", label: "Price ₹(for each)*", type: "number" },
          { name: "address", label: "Address*", type: "text" },
          // { name: "images", label: "Image URL(s)", type: "text" },
        ].map(({ name, label, type }) => (
        
        <div key={name}>
            <label className="block text-red-600 font-medium mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400"
            />
          </div>
        ))}
        <div className="flex gap-4">
  <div className="flex-1">
    <label className="block text-red-600 font-medium mb-1">Quantity*</label>
    <input
      type="number"
      name="quantity"
      value={formData.quantity}
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400"
      min={0}
      step="any"
    />
  </div>
  <div className="flex-1">
    <label className="block text-red-600 font-medium mb-1">Unit*</label>
    <select
      name="unit"
      value={formData.unit}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400"
    >
      <option value="" disabled>
    --Select Unit--
  </option>
      <option value="kgs">Kgs</option>
      <option value="pieces">Pieces</option>
      <option value="liters">Liters</option>
      <option value="meters">Meters</option>
      <option value="packs">Packs</option>
    </select>
  </div>
</div>

<div>
  <label className="block text-red-600 font-medium mb-1">Category*</label>
  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400"
    required
  >
  <option value="" disabled>
    --Select Category--
  </option>
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
        
        <div>
          <label className="block text-red-600 font-medium mb-1">Details*</label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-red-600 font-medium mb-1">Status*</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400"
            >
              <option value="Available">Available</option>
              {/* <option value="Sold">Sold</option> */}
            </select>
          </div>
          <div>
            <label className="block text-red-600 font-medium mb-1">Listing Type*</label>
            <select
              name="listingType"
              value={formData.listingType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400"
            >
              <option value="Sale">Sale</option>
            </select>
          </div>

            <div>
          <label className="block text-red-600 font-medium mb-1">
            Upload Images (up to 5 images , 3MB each)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400"
          />
        </div>
        {imagePreviews.length > 0 && (
  <div className="flex flex-wrap gap-2 mt-2">
    {imagePreviews.map((preview, idx) => (
      <img
        key={idx}
        src={preview}
        alt={`Preview ${idx + 1}`}
        className="h-20 w-20 object-cover rounded border border-red-200 shadow"
      />
    ))}
  </div>
)}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            loading ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Adding..." : "Add Listing"}
        </button>
      </form>
            {showModal && <Modal message="Listing added successfully!" onClose={handleCloseModal} />}

    </div>
  );
};

export default AddForm;
