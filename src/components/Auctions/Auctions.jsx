"use client";
import { FiShare2 } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Gavel } from "lucide-react";


const AuctionSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
      <div className="relative w-full h-72 bg-gray-200" />
      <div className="p-5">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="flex items-center justify-between mb-3">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/5"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="mt-4 flex gap-3">
          <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
          <div className="h-10 w-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};



const Auctions = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timers, setTimers] = useState({}); // store countdowns for each auction
  const [auctionAccess, setAuctionAccess] = useState(false);
    const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
const [token, setToken] = useState(null);

useEffect(() => {
  const init = async () => {
    const storedToken = sessionStorage.getItem("token");
    setToken(storedToken || null);

    if (storedToken) {
      try {
        const res = await axios.get(`${BACKEND_API}/plans/myplan`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setAuctionAccess(res.data.plan.auctionAccess || false);
      } catch (err) {
        console.error("Error fetching plan:", err);
        setAuctionAccess(false);
      }
    }
  };
  init();
}, []);


  useEffect(() => {
    const fetchListings = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // optional delay
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/listing/getalllistings`
        );
        const auctionItems = (res.data.data || []).filter(
          (item) => item.listingType === "Auction"
        );
        setItems(auctionItems);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      items.forEach((item) => {
        const now = new Date().getTime();
        const start = new Date(item.auctionStartTime).getTime();
        const end = new Date(item.auctionEndTime).getTime();

        if (now < start) {
          newTimers[item._id] = `Starts in ${formatTime(start - now)}`;
        } else if (now >= start && now <= end) {
          newTimers[item._id] = `Ends in ${formatTime(end - now)}`;
        } else {
          newTimers[item._id] = "Auction ended";
        }
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [items]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const enterAuction = (id) => {
    router.push(`/view-auction?id=${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-28 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 font-syne">
              Auctions
            </h1>
            <Gavel size={40} className="ml-6 text-red-800" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover unique auction items from our community of sellers.
          </p>
        </div>
      <div className="bg-gradient-to-r from-red-100 to-red-200 border-l-8 border-red-500 shadow-md p-2 mb-8 rounded-xl text-red-900 flex flex-col md:flex-row items-center justify-between gap-4">
  <div className="flex items-center gap-3">
    <svg
      className="w-8 h-8 text-red-600 animate-pulse"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20h.01M20.071 4.929a10 10 0 11-14.142 14.142 10 10 0 0114.142-14.142z"></path>
    </svg>
    <p className="text-sm md:text-lg font-medium">
      Want to create an auction? Please{" "}
      <a href="mailto:sawrajenterprises2003@gmail.com" className="underline font-bold text-red-700 hover:text-red-900">
        contact us via email
      </a>{" "}
      or{" "}
      <a href="https://wa.me/919324078235" target="_blank" rel="noopener noreferrer" className="underline font-bold text-red-700 hover:text-red-900">
        WhatsApp
      </a>{" "}
      to submit your auction request. We’ll review it before publishing.
    </p>
  </div>
</div>


      {isLoading ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {Array.from({ length: 8 }).map((_, i) => (
      <AuctionSkeleton key={i} />
    ))}
  </div>
) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <Gavel size={40} className="text-red-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No auctions available
            </h2>
            <p className="text-gray-600 max-w-md">
              Check back soon for new auctions or be the first to create one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => {
              const now = new Date().getTime();
              const start = new Date(item.auctionStartTime).getTime();
              const end = new Date(item.auctionEndTime).getTime();
              const isActive = now >= start && now <= end;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="relative w-full h-72 overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Gavel size={40} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                          item.status.toLowerCase() === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-red-600 shadow-md">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                      {item.name}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                      <p className="text-2xl font-bold text-red-600">
                        ₹{item.price}
                      </p>
                      <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-3 mt-3">
                      <p className="text-sm text-gray-600 truncate">
                        Seller: {item.user?.name || "Unknown"}
                      </p>
                      <p className="text-sm font-medium text-red-600 mt-1">
                        {timers[item._id]}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-3">
                   <button
  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300
    ${!token 
      ? "bg-gray-400 cursor-not-allowed" 
      : auctionAccess 
        ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg cursor-pointer" 
        : "bg-gray-400 cursor-not-allowed"
    }`}
  onClick={() => {
    if (!token) {
      alert("Please login to enter auction");
      router.push("/login");
    } else if (!auctionAccess) {
      alert("Your plan does not allow auction access");
    } else {
      enterAuction(item._id);
    }
  }}
  disabled={!token || !auctionAccess || !isActive}
>
  {!token ? "Login to Participate" : !auctionAccess ? "No Auction Access" : "Enter Auction"}
</button>


                      <button
                        className="px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center"
                        onClick={() => {
                          const shareData = {
                            title: item.name,
                            text: `Check out this auction: ${item.name} for ₹${item.price}`,
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auctions;
