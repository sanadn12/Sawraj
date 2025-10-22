"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Star ,Sparkles,X  } from "lucide-react";
import PlansPopup from "../profile/getPlans";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPlans, setShowPlans] = useState(false);
    const [myPlan, setMyPlan] = useState(null);
const [token, setToken] = useState(null);
 const [showMyPlanPopup, setShowMyPlanPopup] = useState(false);

useEffect(() => {
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    const page = currentPath === "/" ? "home" : currentPath.slice(1);
    setActivePage(page);

    const storedToken = sessionStorage.getItem("token");
    setToken(storedToken);
    setIsLoggedIn(!!storedToken);
  }
}, []);

      const handleUpgradeClick = () => {
    setShowPlans(true);
  };

    const handleMyPlanClick = () => { 
    setShowMyPlanPopup(true);
  };

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const page = currentPath === "/" ? "home" : currentPath.slice(1);
      setActivePage(page);

      const token = sessionStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);
  useEffect(() => {
  const fetchMyPlan = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/plans/myplan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
       setMyPlan({
        ...res.data.plan,
        subscriptionValidTill: res.data.subscriptionValidTill,
        listingsCreatedThisMonth: res.data.listingsCreatedThisMonth,
      });
    } catch (err) {
      console.error("Error fetching user plan:", err);
    }
  };
  fetchMyPlan();
}, [token]);
  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (page) => {
    setActivePage(page);
    setIsOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setActivePage("home");
    window.location.href = "/";
  };

  const getMenuItemClasses = (path) => {
    let classes = "text-lg font-semibold transition duration-300";

    if (path === "register") {
      classes += " text-black";
    } else if (path === "login") {
      classes += " text-black border border-black px-4 md:-mt-1 py-1 rounded hover:bg-red-50";
    } else if (path === "marketplace") {
      classes += " text-green-700 animate-pulse";
    }  else if (path === "profile") {
      classes += " text-red-500 border border-red-500 md:-mt-1 px-4 py-1 rounded hover:bg-red-200 ";
    }
    else {
      classes += activePage === path ? " text-red-500" : " text-black";
    }

    return classes;
  };

  const menuItems = [
    { name: "Home", path: "home" },
    { name: "About Us", path: "about" },
     {
    name: "Need a Website?",
    path: "https://acespade.sawraj.in", // External link to portfolio
    external: true,
  },
    { name: "Marketplace", path: "marketplace" },
        { name: "Auctions", path: "auctions" },
    !isLoggedIn && { name: "Create Account", path: "register" },
    !isLoggedIn && { name: "Login", path: "login" },
   isLoggedIn && myPlan?._id === "free" && { name: "Upgrade", path: "buyplan" },
isLoggedIn && myPlan && myPlan._id !== "free" && { name: "My Plan", path: "myplan", icon: true },

    isLoggedIn && { name: "Profile", path: "profile" },
    isLoggedIn && { name: "Logout", path: "logout" },
  ].filter(Boolean); // remove false/null entries
const mobileMenuItems = menuItems.filter(
  (item) => item.path !== "buyplan" && item.path !== "myplan"
);
  const renderMenuItem = ({ name, path, external,icon  }) => {
  if (path === "logout") {
    return (
      <li key={path} className={getMenuItemClasses(path)}>
        <button onClick={handleLogout} className="flex items-center gap-2">
          {name}
          <LogOut className="w-5 h-5" />
        </button>
      </li>
    );
  }
  if (path === "buyplan") {
    return (
      <li key={path} className={getMenuItemClasses(path)}>
        <button onClick={handleUpgradeClick}  className="flex items-center gap-2">
          {name}
          <Sparkles  className="w-5 h-5" />
        </button>
      </li>
    );
  }
   if (icon) {
    return (
     <li key={path} className={getMenuItemClasses(path)}>
  <div  onClick={handleMyPlanClick}
  className="relative flex items-center justify-center w-10 h-10 md:-mt-1 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg ">
    <Star className="w-5 h-5 text-white" title="Your Current Plan" />
    {/* Optional sparkle effect */}
    <span className="absolute top-0 right-0 block w-2 h-2 bg-white rounded-full animate-ping opacity-75"></span>
  </div>
</li>

    );
  }

  return (
    <li
      key={path}
      className={getMenuItemClasses(path)}
      onClick={() => !external && handleMenuItemClick(path)}
    >
      {external ? (
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold text-blue-700 hover:underline"
        >
          {name}
        </a>
      ) : (
        <Link href={path === "home" ? "/" : `/${path}`}>{name}</Link>
      )}
    </li>
  );
};


  return (
    <nav className="bg-white fixed text-gray-800 py-2 px-4 shadow-md top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <div className="relative ml-4 h-20 w-60 md:h-24 md:w-80 cursor-pointer">
              <Image
                src="/SeLogo.png"
                alt="MyLogo"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </Link>
        </div>

<div className="md:hidden -ml-4 md:ml-0 flex items-center gap-3">
    {isLoggedIn && myPlan && myPlan._id !== "free" && (
    <div
      onClick={handleMyPlanClick}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg cursor-pointer"
    >
      <Star className="w-5 h-5 text-white" title="Your Current Plan" />
      <span className="absolute top-0 right-0 block w-2 h-2 bg-white rounded-full animate-ping opacity-75"></span>
    </div>
  )}
  {isLoggedIn && myPlan?._id === "free" && (
    <div
      onClick={handleUpgradeClick}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-red-600 shadow-lg cursor-pointer"
    >
      <Sparkles className="w-5 h-5 text-white" title="Upgrade Plan" />
    </div>
  )}

     {/* Hamburger Icon with Animation */}
<div className="md:hidden cursor-pointer z-50 " onClick={toggleMenu}>
  
  <div className="w-8 h-8  flex flex-col justify-center items-center relative">
    {/* Top line */}
    <span
      className={`bg-red-500 block h-0.5 w-8 rounded-sm absolute transition-all duration-300 ease-out ${
        isOpen ? "rotate-45" : "-translate-y-2"
      }`}
    ></span>

    {/* Middle line */}
    <span
      className={`bg-red-500 block h-0.5 w-8 rounded-sm absolute transition-all duration-300 ease-out ${
        isOpen ? "opacity-0" : "opacity-100"
      }`}
    ></span>

    {/* Bottom line */}
    <span
      className={`bg-red-500 block h-0.5 w-8 rounded-sm absolute transition-all duration-300 ease-out ${
        isOpen ? "-rotate-45" : "translate-y-2"
      }`}
    ></span>
  </div>
</div>
</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8">
          {menuItems.map(renderMenuItem)}
        </ul>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 overflow-hidden ${
          isOpen ? "h-auto opacity-100" : "h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-4 py-4">
          {mobileMenuItems.map(renderMenuItem)}
        </ul>
      </div>
            {showPlans && <PlansPopup onClose={() => setShowPlans(false)}  token={token}/>}
{showMyPlanPopup && myPlan && (  
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
     <button
  className="absolute top-3 right-3 rounded-full p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition"
  onClick={() => setShowMyPlanPopup(false)}
>
  <X size={18} strokeWidth={2} />
</button>
    <div className="bg-white rounded-2xl p-6 w-96 max-w-full relative shadow-2xl">
      {/* Close button */}
    

      {/* Styled plan card */}
      <div className="relative overflow-hidden rounded-xl p-6 border-2 border-red-600 shadow-lg bg-white ring-2 ring-red-50 scale-105">
        {/* Badge */}
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          Your Plan
        </div>
   

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{myPlan.name}</h3>
          <div className="mb-4">
            <span className="text-4xl font-bold text-red-700">₹{myPlan.price}</span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-red-100 to-transparent my-4"></div>
        </div>
     <div className="text-center mb-4">
  {myPlan.subscriptionValidTill ? (
    <p className="text-sm text-gray-600">
      Expires on:{" "}
      <span className="font-medium text-red-600">
        {new Date(myPlan.subscriptionValidTill).toLocaleDateString()}
      </span>{" "}
      (
      {Math.max(
        0,
        Math.ceil(
          (new Date(myPlan.subscriptionValidTill) - new Date()) / (1000 * 60 * 60 * 24)
        )
      )}{" "}
      days remaining)
    </p>
  ) : (
    <p className="text-sm text-gray-600">This is a free plan.</p>
  )}

  <p className="text-sm text-gray-600">
    Listings created this month: {myPlan.listingsCreatedThisMonth || 0}
  </p>
</div>
        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-red-100 p-1 rounded-full mr-3 mt-0.5">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span className="text-gray-700">
              Listing Limit: <strong>{myPlan.listingLimit}</strong>
            </span>
          </div>

          <div className="flex items-start">
            <div className={`p-1 rounded-full mr-3 mt-0.5 ${myPlan.auctionAccess ? "bg-red-100" : "bg-gray-100"}`}>
              {myPlan.auctionAccess ? (
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
            </div>
            <span className="text-gray-700">
              Auction Access: <strong>{myPlan.auctionAccess ? "Yes" : "No"}</strong>
            </span>
          </div>

          {myPlan.features?.length > 0 && (
            <div>
              <strong className="block mb-2 text-gray-700">Features:</strong>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                {myPlan.features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

    </nav>
    
    
  );
  
};

export default Navbar;