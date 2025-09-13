"use client";
import { FiShare2 } from "react-icons/fi";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Marketplace = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Simulate network delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1500));
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/listing/getalllistings`);
        setItems(res.data.data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const viewlisting = (id) => {
    router.push(`/view-listing?id=${id}`);
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          {/* Image Skeleton */}
          <div className="relative w-full h-72 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
          
          {/* Content Skeleton */}
          <div className="p-5">
            <div className="h-6 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
            <div className="flex justify-between mb-3">
              <div className="h-7 w-20 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex items-center mb-2">
                <div className="h-5 w-5 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              <div className="flex items-center">
                <div className="h-5 w-5 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>
            <div className="mt-4 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-28 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 mb-4 font-syne">
            Marketplace
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover unique items from our community of sellers. Everything you need, all in one place.
          </p>
        </div>

        {isLoading ? (
          <SkeletonLoader />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="mb-6 p-4 bg-white rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16M9 10h.01M15 10h.01" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No listings available</h2>
            <p className="text-gray-600 max-w-md">Check back soon for new items or be the first to create a listing!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                {/* Image Container */}
                <div className="relative w-full h-72 overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md
                      ${item.status.toLowerCase() === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-200 text-gray-800'}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-red-600 shadow-md">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{item.name}</h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-2xl font-bold text-red-600">₹{item.price}</p>
                    <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-sm text-gray-600 truncate">{item.user?.name || 'Unknown Seller'}</p>
                    </div>
                    
                    {item.user?.phone && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <p className="text-sm text-gray-600">{item.user.phone}</p>
                      </div>
                    )}
                  </div>
                  
                {/* Action Buttons */}
<div className="mt-4 flex gap-3">
  {/* View Details */}
  <button
    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center"
    onClick={() => viewlisting(item._id)}
  >
    View Details
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </button>

  {/* Share */}
  
<button
  className="px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center"
  onClick={() => {
    const shareData = {
      title: item.name,
      text: `Check out this product: ${item.name} for ₹${item.price}`,
      url: `${window.location.origin}/view-listing?id=${item._id}`,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  }}
>
  <FiShare2 className="h-5 w-5 text-red-600" />
</button>
</div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;