'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

const Listing = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${BACKEND_API}/listing/getlisting/${id}`);
        setListing(res.data.data);
      } catch (err) {
        console.error('Error fetching listing:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id, BACKEND_API]);

  if (loading) {
    return (
      <div className="text-center text-red-600 font-semibold py-20 text-xl animate-pulse">
        Loading listing...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center text-red-500 py-20 text-2xl font-semibold">
        Currently there are no listing 
        Comeback soon...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-red-50 to-red-100 py-12 px-6 sm:px-12 lg:px-20">
      <button
        onClick={() => router.push('/marketplace')}
        className="mb-8 inline-block text-red-700 font-semibold hover:text-red-900 transition-colors duration-300"
      >
        ← Back to Marketplace
      </button>

      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden border border-red-200">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2">
            <img
              src="/listingplaceholder.jpg"
              alt="Listing"
              className="object-cover w-full h-96 md:h-full rounded-bl-3xl rounded-tl-3xl md:rounded-tr-none md:rounded-bl-none transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between text-red-900">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2 text-red-800 drop-shadow-sm">
                {listing.name}
              </h1>
              <p
                className={`inline-block text-lg font-semibold px-4 py-1 rounded-full mb-6
                  ${
                    listing.status.toLowerCase() === 'available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-300 text-gray-700'
                  }
                `}
              >
                {listing.status}
              </p>

              <p className="text-red-600 font-semibold tracking-wide uppercase mb-4">
                Category: <span className="font-normal normal-case">{listing.category}</span>
              </p>

              <p className="leading-relaxed text-gray-700 mb-6 max-w-prose"><span className='text-red-700'>Details : </span>   {listing.details}</p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 text-red-700 font-medium">
                <p>
                  <span className="font-semibold text-red-800">Quantity:</span>{' '}
                  <span className="font-normal">{listing.quantity}</span>
                </p>
                <p>
                  <span className="font-semibold text-red-800">Price:</span>{' '}
                  <span className="font-normal">₹{listing.price}</span>
                </p>
                <p className="col-span-2">
                  <span className="font-semibold text-red-800">Address:</span>{' '}
                  <span className="font-normal">{listing.address}</span>
                </p>
              </div>

              <p className="text-sm text-gray-500 italic">
                Posted On: {new Date(listing.createdAt).toLocaleString()}
              </p>
            </div>

            {listing.user && (
              <div className="pt-6 border-t border-red-200 mt-8">
                <h2 className="text-2xl font-bold text-red-800 mb-4">Seller Info</h2>
                <div className="space-y-2 text-red-700 font-medium">
                  <p>
                    <span className="font-semibold text-red-900">Name:</span>{' '}
                    <span className="font-normal">{listing.user.name}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-red-900">Email:</span>{' '}
                    <span className="font-normal">{listing.user.email}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-red-900">Phone:</span>{' '}
                    <span className="font-normal">{listing.user.phone}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
