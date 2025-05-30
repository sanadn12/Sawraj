'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const Listing = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const router = useRouter();
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1));
  };

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
          <div className="w-full md:w-1/2 relative rounded-bl-3xl rounded-tl-3xl md:rounded-tr-none md:rounded-bl-none overflow-hidden">
            {listing.images && listing.images.length > 0 ? (
              <>
                <div className="relative w-full h-96 md:h-full">
                  <Image
                    src={listing.images[currentImageIndex]}
                    alt={`${listing.name} image ${currentImageIndex + 1}`}
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'center'  }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className=""
                  />
                </div>

                {/* Navigation buttons */}
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-red-600 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-2 shadow-lg"
                  aria-label="Previous Image"
                >
                  ‹
                </button>

                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-red-600 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-2 shadow-lg"
                  aria-label="Next Image"
                >
                  ›
                </button>

                {/* Image counter */}
                <div className="absolute bottom-2 right-4 bg-red-700 bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold select-none">
                  {currentImageIndex + 1} / {listing.images.length}
                </div>

                {/* View Larger Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="absolute bottom-12 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold"
                >
                  View Larger
                </button>
              </>
            ) : (
              <Image
                src="/listingplaceholder.jpg"
                alt="Placeholder"
                fill
                style={{ objectFit: 'contain', objectPosition: 'center'  }}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-bl-3xl rounded-tl-3xl md:rounded-tr-none md:rounded-bl-none"
              />
            )}
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
                  {listing.user.profilePicture && (
                    <div className="mt-4">
                      <div className="mt-2">
                        <Image
                          src={listing.user.profilePicture}
                          alt={`${listing.user.name}'s profile picture`}
                          width={80} 
                          height={80}
                          className="rounded-full border border-red-300 shadow-md"
                        />
                      </div>
                    </div>
                  )}
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

      {/* Modal for large image view */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-full w-full px-4">
            <Image
              src={listing.images[currentImageIndex]}
              alt={`${listing.name} large view`}
              width={1200}
              height={800}
              style={{ objectFit: 'contain' }}
              className="rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
              className="absolute top-4 right-4 text-white text-3xl font-bold bg-red-700 bg-opacity-80 rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-900"
              aria-label="Close large image view"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listing;
