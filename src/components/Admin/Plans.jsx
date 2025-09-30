"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiPlus, FiEdit2, FiTrash2, FiX, FiInfo } from "react-icons/fi";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    listingLimit: 1,
    auctionAccess: false,
    features: [""]
  });
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${BACKEND_API}/plans/all`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      setPlans(res.data.plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPlan 
        ? `${BACKEND_API}/plans/edit/${editingPlan._id}`
        : `${BACKEND_API}/plans/create`;
      
      const method = editingPlan ? 'put' : 'post';
      
      const res = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      
      if (res.status === 200 || res.status === 201) {
        setShowModal(false);
        setEditingPlan(null);
        setFormData({
          name: "",
          price: 0,
          listingLimit: 1,
          auctionAccess: false,
          features: [""]
        });
        fetchPlans();
      }
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      listingLimit: plan.listingLimit,
      auctionAccess: plan.auctionAccess,
      features: plan.features && plan.features.length > 0 ? plan.features : [""]
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await axios.delete(`${BACKEND_API}/plans/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        fetchPlans();
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  const addFeatureField = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""]
    });
  };

  const removeFeatureField = (index) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-red-100  text-gray-600 text-lg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-red-600 rounded-full mb-4"></div>
          <p>Loading Plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 mt-16 text-left">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Subscription Plans
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 text-left max-w-3xl "
        >
          Choose the perfect plan for your needs or create a custom one
        </motion.p>
      </div>

      {/* Action Button */}
      <div className="max-w-7xl mx-auto mb-10 md:-mt-32 flex justify-end">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl shadow-lg transition-all font-medium"
        >
          <FiPlus size={20} /> Create New Plan
        </motion.button>
      </div>

      {/* Plans Grid */}
      <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            {/* Popular Badge */}
            {index === 1 && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-red-400 to-red-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg shadow">
                MOST POPULAR
              </div>
            )}
            
            <div className="p-8">
              {/* Plan Name */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h2>

              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-bold text-indigo-600">
                  ₹{plan.price}
                  <span className="text-sm text-gray-500 font-normal">/mo</span>
                </p>
              </div>

              {/* Limits & Features */}
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-center gap-3">
                  <FiCheckCircle className="text-green-500 flex-shrink-0" /> 
                  <span>Listing Limit: <strong>{plan.listingLimit}</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <FiCheckCircle className="text-green-500 flex-shrink-0" /> 
                  <span>Auction Access: <strong>{plan.auctionAccess ? "Yes" : "No"}</strong></span>
                </li>
                {plan.features?.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <FiCheckCircle className="text-green-500 flex-shrink-0" /> 
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="flex justify-between mt-6">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(plan)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium transition"
                >
                  <FiEdit2 size={16} /> Edit
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(plan._id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium transition"
                >
                  <FiTrash2 size={16} /> Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowModal(false);
              setEditingPlan(null);
              setFormData({
                name: "",
                price: 0,
                listingLimit: 1,
                auctionAccess: false,
                features: [""]
              });
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {editingPlan ? "Edit Plan" : "Create New Plan"}
                  </h2>
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      setEditingPlan(null);
                      setFormData({
                        name: "",
                        price: 0,
                        listingLimit: 1,
                        auctionAccess: false,
                        features: [""]
                      });
                    }}
                    className="text-white hover:text-indigo-200 transition"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="e.g., Premium Plan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Listing Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.listingLimit}
                    onChange={(e) => setFormData({...formData, listingLimit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auctionAccess"
                    checked={formData.auctionAccess}
                    onChange={(e) => setFormData({...formData, auctionAccess: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auctionAccess" className="ml-2 block text-sm text-gray-700">
                    Auction Access
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Features
                    </label>
                    <button
                      type="button"
                      onClick={addFeatureField}
                      className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center"
                    >
                      <FiPlus size={12} className="mr-1" /> Add Feature
                    </button>
                  </div>
                  
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="e.g., 24/7 Support"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureField(index)}
                          className="ml-2 text-red-500 hover:text-red-700 p-2"
                        >
                          <FiX size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-red-50 p-3 rounded-lg flex items-start">
                  <FiInfo className="text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-xs text-red-800">
                    Add each feature as a separate item. Users will see these as benefits of this plan.
                  </p>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingPlan(null);
                      setFormData({
                        name: "",
                        price: 0,
                        listingLimit: 1,
                        auctionAccess: false,
                        features: [""]
                      });
                    }}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
                  >
                    {editingPlan ? "Update Plan" : "Create Plan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Plans;