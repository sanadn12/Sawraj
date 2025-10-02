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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

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

  // Enhanced WhatsApp sharing function
  const shareOnWhatsApp = () => {
    if (!listing) return;
    
    const productName = encodeURIComponent(listing.name);
    const productPrice = encodeURIComponent(`₹${listing.price}`);
    const productDetails = encodeURIComponent(listing.details?.substring(0, 120) + '...');
    const productImage = listing.images && listing.images.length > 0 ? listing.images[0] : '';
    const productLink = encodeURIComponent(window.location.href);
    
    // Create a rich message with product details
    const message = `🌟 *${listing.name}* 🌟%0A%0A` +
                    `💰 Price: ₹${listing.price}%0A` +
                    `📦 Quantity: ${listing.quantity}%0A` +
                    `📋 Category: ${listing.category}%0A%0A` +
                    `📝 Description: ${listing.details?.substring(0, 120)}...%0A%0A` +
                    `🛒 Check out this amazing product: ${window.location.href}`;
    
    window.open(`https://wa.me/?text=${message}`, '_blank');
    setShowShareTooltip(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1));
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading premium listing...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Listing Available</h2>
          <p className="text-gray-600 mb-6">We couldn&apos;t find the listing you&apos;re looking for.</p>
          <button
            onClick={() => router.push('/marketplace')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push('/marketplace')}
          className="flex items-center text-gray-700 hover:text-red-600 transition-colors duration-300 mb-8 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Marketplace
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          <div className="flex flex-col lg:flex-row">
            {/* Image Gallery Section */}
            <div className="w-full lg:w-1/2 relative">
              {listing.images && listing.images.length > 0 ? (
                <>
                  <div className="relative w-full h-80 sm:h-96 lg:h-full aspect-square">
                    <Image
                      src={listing.images[currentImageIndex]}
                      alt={`${listing.name} image ${currentImageIndex + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                      className="cursor-zoom-in"
                      onClick={() => setIsModalOpen(true)}
                    />
                  </div>

                  {/* Navigation buttons */}
                  <button
                    onClick={prevImage}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Previous Image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Next Image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Image counter */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {listing.images.length}
                  </div>

                  {/* Thumbnail navigation */}
                  {listing.images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 px-4">
                      {listing.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => selectImage(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${currentImageIndex === index ? 'bg-white scale-125' : 'bg-white bg-opacity-50'}`}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* View Larger Button */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-gray-900 px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center transition-all duration-300 hover:shadow-xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7" />
                    </svg>
                    Expand
                  </button>
                </>
              ) : (
                <div className="relative w-full h-96 lg:h-full">
                  <Image
                    src="/listingplaceholder.jpg"
                    alt="Placeholder"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="rounded-bl-3xl rounded-tl-3xl lg:rounded-tr-none lg:rounded-bl-none"
                  />
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold
                      ${listing.status.toLowerCase() === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {listing.status}
                  </span>
                  
                  {/* Share Button with Tooltip */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowShareTooltip(!showShareTooltip)}
                      className="flex items-center text-gray-500 hover:text-red-600 transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                    
                    {showShareTooltip && (
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl p-4 z-10 border border-gray-200 min-w-[200px]">
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button
                            onClick={shareOnWhatsApp}
                            className="p-2 bg-green-500 text-white rounded-full transition-transform hover:scale-110"
                            title="Share on WhatsApp"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488"/>
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => {
                              const message = `Check out "${listing.name}" for ₹${listing.price}! ${listing.details?.substring(0, 100)}... ${window.location.href}`;
                              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`, '_blank');
                              setShowShareTooltip(false);
                            }}
                            className="p-2 bg-blue-600 text-white rounded-full transition-transform hover:scale-110"
                            title="Share on Facebook"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => {
                              const message = `Check out "${listing.name}" for ₹${listing.price}! ${listing.details?.substring(0, 100)}... ${window.location.href}`;
                              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
                              setShowShareTooltip(false);
                            }}
                            className="p-2 bg-blue-400 text-white rounded-full transition-transform hover:scale-110"
                            title="Share on Twitter"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => {
                              const message = `Check out "${listing.name}" for ₹${listing.price}! ${listing.details?.substring(0, 100)}...`;
                              window.open(`mailto:?subject=Check out this product&body=${encodeURIComponent(message + '\n\n' + window.location.href)}`, '_blank');
                              setShowShareTooltip(false);
                            }}
                            className="p-2 bg-gray-600 text-white rounded-full transition-transform hover:scale-110"
                            title="Share via Email"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-2">Share this product</p>
                      </div>
                    )}
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.name}</h1>
                
                <div className="flex items-center mb-6">
                  <span className="text-2xl font-bold text-red-600">₹{listing.price}</span>
                  <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {listing.quantity} available
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Category</h3>
                  <p className="text-gray-900 font-medium">{listing.category}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{listing.details}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Address</h3>
                    <p className="text-gray-900">{listing.address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Listed On</h3>
                    <p className="text-gray-900">{new Date(listing.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Seller Information */}
              {listing.user && (
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
                  <div className="flex items-start">
                    {listing.user.profilePicture && (
                      <div className="flex-shrink-0 mr-4">
                        <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow">
                          <Image
                            src={listing.user.profilePicture}
                            alt={`${listing.user.name}'s profile`}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="56px"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{listing.user.name}</p>
                      <p className="text-gray-600 text-sm">{listing.user.email}</p>
                      {listing.user.phone && (
                        <p className="text-gray-600 text-sm">{listing.user.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Contact Seller Button */}
                 <a
  href={`tel:${listing.user.phone}`}
  className="mt-4 w-full block text-center bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 transform hover:-translate-y-0.5"
>
  Contact Seller
</a>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for large image view */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-zoom-out p-4"
        >
          <div className="relative max-w-4xl w-full max-h-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
              className="absolute top-4 right-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-100 transition-all duration-300"
              aria-label="Close large image view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative h-96 sm:h-[500px]">
              <Image
                src={listing.images[currentImageIndex]}
                alt={`${listing.name} large view`}
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-lg"
              />
            </div>
            
            {/* Navigation in modal */}
            {listing.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-100 transition-all duration-300"
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-100 transition-all duration-300"
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {listing.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectImage(index);
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${currentImageIndex === index ? 'bg-white scale-125' : 'bg-white bg-opacity-50'}`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Listing;