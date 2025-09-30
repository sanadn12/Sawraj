"use client";
import React, { useState ,useEffect} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_red.css";
import { jwtDecode } from "jwt-decode";
import { 
  Calendar, 
  Camera, 
  Clock, 
  DollarSign, 
  MapPin, 
  Package, 
  Tag, 
  Type, 
  AlertCircle,
  Gavel,
  Loader2,
  CheckCircle2
} from "lucide-react";

const CreateAuctionForm = () => {

      const router = useRouter();
    
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
    const [role, setRole] = useState(null);
  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    details: "",
    status: "Active",
    address: "",
    price: "",
    listingType: "Auction",
    images: [],
auctionStartTime: new Date(), 
auctionEndTime: new Date(),
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

 useEffect(() => {
  if (!token || typeof token !== "string" || token.trim() === "") {
    router.push('/login');
    return;
  }

  try {
    const decoded = jwtDecode(token);
    setRole(decoded.role);

    if (decoded.role !== "admin") {
      router.push('/profile'); 
    }
  } catch (err) {
    console.error("Error decoding token:", err);
    router.push('/login'); 
  }
}, [token, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setMessage("Maximum 5 images allowed");
      setMessageType("error");
      return;
    }
    
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
          })
      )
    ).then((images) => {
      setFormData((prev) => ({ ...prev, images }));
      setMessage(`${images.length} image(s) uploaded successfully`);
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    }).catch(() => {
      setMessage("Error uploading images");
      setMessageType("error");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate auction times
    if (new Date(formData.auctionStartTime) >= new Date(formData.auctionEndTime)) {
      setMessage("Auction end time must be after start time");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_API}/listing/addlisting`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message || "Auction created successfully!");
      setMessageType("success");
      
      // Reset form
      setFormData({
        name: "",
        category: "",
        quantity: 1,
        details: "",
        status: "Active",
        address: "",
        price: 0,
        listingType: "Auction",
        images: [],
        auctionStartTime: "",
        auctionEndTime: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.error || "Error creating auction listing");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4 mt-28 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-red-600 py-4 px-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Gavel className="mr-2" size={28} />
            Create Auction
          </h2>
        </div>
        
        <div className="p-6">
       
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Type className="h-5 w-5 text-red-500" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
            </div>
            
            {/* Category and Quantity Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-red-500" />
                </div>
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="h-5 w-5 text-red-500" />
                </div>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min={1}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                />
              </div>

               <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-red-500" />
              </div>
              <input
                type="number"
                name="price"
                placeholder="Starting Price"
                value={formData.price}
                onChange={handleChange}
                required
                min={0}
                step="0.01"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
            </div>
            </div>
            
            {/* Product Details */}
            <div className="relative">
              <textarea
                name="details"
                placeholder="Product Details"
                value={formData.details}
                onChange={handleChange}
                required
                rows={4}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
            </div>
            
           
            
            {/* Address */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-red-500" />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
            </div>
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
      <Calendar className="mr-2 text-red-500" /> Auction Start Time
    </label>
<Flatpickr
  data-enable-time
  value={formData.auctionStartTime || ""}
  onChange={date => setFormData(prev => ({ ...prev, auctionStartTime: date[0] }))}
  options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
  className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
/>
  </div>

  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
      <Clock className="mr-2 text-red-500" /> Auction End Time
    </label>
  <Flatpickr
  data-enable-time
  value={formData.auctionEndTime || ""}
  onChange={date => setFormData(prev => ({ ...prev, auctionEndTime: date[0] }))}
  options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
  className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
/>
  </div>
</div>

            {/* Image Upload */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (Max 5)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-red-300 rounded-lg cursor-pointer bg-red-50 hover:bg-red-100 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-8 h-8 mb-3 text-red-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5 images)</p>
                  </div>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
               {formData.images.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2">
        {formData.images.map((img, idx) => (
          <div key={idx} className="relative w-20 h-20 border rounded-lg overflow-hidden">
            <img src={img} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  images: prev.images.filter((_, i) => i !== idx)
                }));
              }}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 transition"
            >
              ×
            </button>
          </div>
          
        ))}
            </div>
                )} </div>

            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 transition flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Creating Auction...
                </>
              ) : (
                "Create Auction"
              )}
            </button>
               {message && (
            <div className={`mb-6 p-3 rounded-lg flex items-center ${
              messageType === "success" 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {messageType === "success" ? (
                <CheckCircle2 className="mr-2" size={20} />
              ) : (
                <AlertCircle className="mr-2" size={20} />
              )}
              {message}
            </div>
          )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAuctionForm;