"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Gavel, User, Clock, Tag, Award, MessageSquare, ArrowRight } from "lucide-react";
import {jwtDecode} from "jwt-decode";


const Popup = ({ message, type, onClose }) => {
  // type can be 'success', 'error', 'info'
  const colors = {
    success: "bg-green-500",
    error: "bg-red-400",
    info: "bg-red-700",
  };

  return (
    <div className={`fixed bottom-28 right-6 px-4 z-50 py-3 rounded-lg text-white shadow-lg ${colors[type] || colors.info}`}>
      <div className="flex justify-between items-center gap-4">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold">X</button>
      </div>
    </div>
  );
};



const ViewAuction = ({ token }) => {
  const searchParams = useSearchParams();
  const auctionId = searchParams.get("id");
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  const [popup, setPopup] = useState({ show: false, message: "", type: "info" });

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState({});
  const [userData, setUserData] = useState(null);

  // Axios config with Authorization header
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
  if (!auctionId) return;

  const fetchLatestAuction = async () => {
    try {
      const res = await axios.get(`${BACKEND_API}/listing/auction/${auctionId}`, axiosConfig);
      setAuction(res.data.auction);
    } catch (err) {
      console.error("Polling error:", err);
    }
  };

  // Initial fetch
  fetchLatestAuction();

  // Polling every 3 seconds
  const interval = setInterval(fetchLatestAuction, 3000);

  return () => clearInterval(interval); // cleanup
}, [auctionId, token]);

const showPopup = (message, type = "info") => {
  setPopup({ show: true, message, type });

  if (window.popupTimeout) clearTimeout(window.popupTimeout);

  window.popupTimeout = setTimeout(() => {
    setPopup({ show: false, message: "", type: "info" });
  }, 3000);
};

useEffect(() => {
  if (!token) return;
  try {
    const decoded = jwtDecode(token);
    // Example: decoded might have { id, name, email } depending on your backend
    setUserData({ id: decoded.id, name: decoded.name, email: decoded.email });
  } catch (err) {
    console.error("Invalid token", err);
  }
}, [token]);
  // Fetch auction details
  const fetchAuction = async () => {
  try {
    const res = await axios.get(`${BACKEND_API}/listing/auction/${auctionId}`, axiosConfig);
    setAuction(res.data.auction);
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.error || "Failed to load auction");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (auctionId) fetchAuction();
}, [auctionId, token]);
  // Timer effect
  useEffect(() => {
    if (!auction) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(auction.auctionStartTime).getTime();
      const end = new Date(auction.auctionEndTime).getTime();
      
      let difference = 0;
      if (now < start) {
        difference = start - now;
      } else if (now <= end) {
        difference = end - now;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  // Place bid
  const handleBid = async () => {
    try {
      if (!bidAmount) return showPopup("Enter bid amount");
      if (Number(bidAmount) <= (auction.highestBid || auction.price)) {
        return showPopup(`Bid must be higher than ₹${auction.highestBid || auction.price}`);
      }
      
      const res = await axios.post(
        `${BACKEND_API}/listing/bid`,
        { listingId: auctionId, amount: Number(bidAmount) },
        axiosConfig
      );
      setAuction(res.data.auction);
      setBidAmount("");
      fetchAuction();
    } catch (err) {
      showPopup(err.response?.data?.error || "Failed to place bid");
    }
  };

  // Add comment
  const handleComment = async () => {
    try {
      if (!comment) return showPopup("Enter comment");
      const res = await axios.post(
        `${BACKEND_API}/listing/comment`,
        { listingId: auctionId, content: comment },
        axiosConfig
      );
      
      setComment("");
      fetchAuction();
    } catch (err) {
      showPopup(err.response?.data?.error || "Failed to add comment");
    }
  };

  const getAuctionStatus = () => {
    if (!auction) return "";
    const now = new Date().getTime();
    const start = new Date(auction.auctionStartTime).getTime();
    const end = new Date(auction.auctionEndTime).getTime();
    
    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "LIVE";
    return "ENDED";
  };

  const status = getAuctionStatus();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-red-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading auction details...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-red-50">
      <p className="text-center text-red-500 text-xl">{error}</p>
    </div>
  );
  
  if (!auction) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-red-50">
      <p className="text-center text-gray-600 text-xl">Auction not found</p>
    </div>
  );

  const isActive = status === "LIVE";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50 py-8 px-4 mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Auction Status Banner */}
        <div className={`mb-8 p-4 rounded-xl text-center font-bold text-white text-lg ${
          status === "LIVE" ? "bg-red-600 animate-pulse" : 
          status === "UPCOMING" ? "bg-amber-500" : "bg-gray-600"
        }`}>
          {status === "LIVE" ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
              <span>LIVE AUCTION - ENDING SOON</span>
            </div>
          ) : status === "UPCOMING" ? (
            `AUCTION STARTS SOON`
          ) : (
            `AUCTION ENDED`
          )}
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 - Images */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-fit">
            <div className="relative w-full h-80">
              {auction.images?.length > 0 ? (
                <Image
                  src={auction.images[0]}
                  alt={auction.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-red-50 to-red-100 flex items-center justify-center">
                  <Gavel size={80} className="text-red-300" />
                </div>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {auction.images?.length > 1 && (
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Additional Images</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {auction.images.slice(1).map((img, index) => (
                    <div key={index} className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={img}
                        alt={`${auction.name} view ${index + 2}`}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Item Details */}
            <div className="p-6 border-t">
              <h3 className="font-semibold text-gray-800 mb-3">Item Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Tag size={16} />
                  <span>Category: {auction.category}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <User size={16} />
                  <span>Seller: {auction.postedBy?.name || "Unknown"}</span>
                </div>
                
                {auction.description && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-1">Description</h4>
                    <p className="text-gray-600 text-sm">{auction.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 2 - Bidding Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 h-fit">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{auction.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === "LIVE" ? "bg-red-100 text-red-800" : 
                status === "UPCOMING" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"
              }`}>
                {status}
              </span>
            </div>

            {/* Current Price */}
            <div className="mb-6">
              <div className="text-gray-500 text-sm">CURRENT BID</div>
              <div className="text-3xl font-bold text-red-600">
                ₹{auction.highestBid || auction.price}
              </div>
              {auction.highestBidder && (
                <div className="text-sm text-gray-500 mt-1">
                  By: {auction.highestBidder.name}
                </div>
              )}
            </div>

            {/* Timer */}
            <div className="bg-red-50 p-4 rounded-xl mb-6">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                <Clock size={18} />
                <span>
                  {status === "UPCOMING" ? "Starts in" : status === "LIVE" ? "Ends in" : "Auction ended"}
                </span>
              </div>
              
              {status !== "ENDED" && (
                <div className="flex gap-3">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex-1 text-center">
                      <div className="bg-white rounded-lg p-2 shadow-sm">
                        <div className="text-xl font-bold text-red-600">{value}</div>
                        <div className="text-xs text-gray-500 uppercase">{unit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bid Section */}
            <div>
              <div className="text-gray-700 font-medium mb-3">
                Enter your bid (Minimum: ₹{auction.highestBid ? auction.highestBid + 1 : auction.price})
              </div>
              
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    min={auction.highestBid ? auction.highestBid + 1 : auction.price}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={!isActive}
                    placeholder={auction.highestBid ? `₹${auction.highestBid + 1} or more` : `₹${auction.price} or more`}
                  />
                </div>
                
                <button
                  className={`px-4 py-3 rounded-xl text-white font-semibold flex items-center gap-2 ${
                    isActive 
                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-200" 
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleBid}
                  disabled={!isActive}
                >
                  <Award size={18} />
                  Bid
                </button>
              </div>
              
              {!isActive && status === "ENDED" && (
                <div className="text-red-600 mt-2 font-medium">This auction has ended</div>
              )}
            </div>
            
            {/* Bidding History */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-800 mb-3">Bid History</h3>
              {auction.bids?.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {auction.bids
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((bid, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{bid.user?.name || "Unknown"}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(bid.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="font-bold text-red-600">₹{bid.amount}</p>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No bids yet</p>
              )}
            </div>
          </div>

          {/* Column 3 - Comments Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              Comments
            </h2>
            
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center gap-1"
                onClick={handleComment}
              >
                Post <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
           {auction.comments?.length > 0 ? (
  [...auction.comments].reverse().map((c, i) => (
    <div key={i} className="p-4 bg-red-50 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <User size={16} className="text-red-600" />
        </div>
        <p className="font-semibold text-gray-800">{c.user?.name || "Unknown"}</p>
      </div>
      <p className="text-gray-700">{c.content}</p>
      <p className="text-xs text-gray-500 mt-2">
        {new Date(c.createdAt).toLocaleString()}
      </p>
    </div>
  ))
) : (
  <div className="text-center py-8 text-gray-500">
    <MessageSquare size={40} className="mx-auto text-gray-300 mb-2" />
    <p>No comments yet. Be the first to comment!</p>
  </div>
)}
            </div>
          </div>
        </div>
      </div>
      {popup.show && <Popup message={popup.message} type={popup.type} onClose={() => setPopup({ show: false })} />}
  <style jsx>{`
      @keyframes slide-in-right {
        0% {
          transform: translateX(100%);
          opacity: 0;
        }
        100% {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .animate-slide-in {
        animation: slide-in-right 0.3s ease-out forwards;
      }
    `}</style>
    </div>
  );
};

export default ViewAuction;