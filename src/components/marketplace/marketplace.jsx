"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Marketplace = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/listing/getalllistings`);
        setItems(res.data.data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);

  const viewlisting = (id) => {
    router.push(`/view-listing?id=${id}`);
  };

  return (
    <div className="bg-white min-h-screen mt-28 p-6">
      <h1 className="text-4xl md:text-6xl font-bold text-red-600 mb-6 font-syne text-center">Marketplace</h1>

      {items.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-3xl font-semibold text-red-500 mb-2">😔 No listings available currently</p>
          <p className="text-2xl text-gray-600">Please check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="border-2 border-red-500 rounded-xl overflow-hidden shadow-lg hover:shadow-red-300 hover:scale-105 transition-shadow">
             {item.images && item.images.length > 0 ? (
  <div className="relative w-full h-64">
    <Image
      src={item.images[0]}
      alt={item.name}
      fill
      style={{ objectFit: 'contain' }}
      sizes="(max-width: 768px) 100vw, 33vw"
      priority
      className="rounded-t-xl"
    />
  </div>
) : (
  <div className="relative w-full h-64">
    <Image
      src="/listingplaceholder.jpg"
      alt="Placeholder"
      fill
      style={{ objectFit: 'contain' }}
      sizes="(max-width: 768px) 100vw, 33vw"
      priority
      className="rounded-t-xl"
    />
  </div>
)}
              <div className="p-4 bg-red-50">
                <p
                  className={`inline-block text-lg font-semibold px-4 py-1 rounded-full mb-6
                    ${
                      item.status.toLowerCase() === 'available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-300 text-gray-700'
                    }
                  `}
                >
                  {item.status}
                </p>
                <p className="text-sm text-red-500 font-semibold">{item.category}</p>
                <h2 className="text-lg font-bold text-red-700">{item.name}</h2>
                <p className="text-red-800 font-semibold">Price: ₹{item.price}</p>
                <p className="text-red-800 font-semibold">Quantity: {item.quantity}</p>
                <p className="text-red-800 font-semibold">Status: {item.status}</p>
                <p className="text-red-600">Contact: {item.user?.phone || 'N/A'}</p>
                <p className="text-red-600">Seller: {item.user?.name || 'Unknown'}</p>

                <button
                  className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition-all font-semibold"
                  onClick={() => viewlisting(item._id)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
