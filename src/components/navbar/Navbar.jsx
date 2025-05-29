"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const page = currentPath === "/" ? "home" : currentPath.slice(1);
    setActivePage(page);

    
    const userId= sessionStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (page) => {
    setActivePage(page);
    setIsOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
        sessionStorage.removeItem("token");

    setIsLoggedIn(false);
    setActivePage("home");
    window.location.href = "/";
  };

  const getMenuItemClasses = (path) => {
    let classes = "text-lg font-semibold transition duration-300";

    if (path === "register") {
      classes += " text-red-500";
    } else if (path === "login") {
      classes += " text-black border border-black px-4 md:-mt-1 py-1 rounded hover:bg-red-50";
    } else if (path === "marketplace") {
      classes += " text-green-700 animate-blink";
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
    path: "https://sanadnaqvi.vercel.app", // External link to portfolio
    external: true,
  },
    { name: "Marketplace", path: "marketplace" },
    !isLoggedIn && { name: "Create Account", path: "register" },
    !isLoggedIn && { name: "Login", path: "login" },
    isLoggedIn && { name: "My Profile", path: "profile" },
    isLoggedIn && { name: "Logout", path: "logout" },
  ].filter(Boolean); // remove false/null entries

  const renderMenuItem = ({ name, path, external }) => {
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

        {/* Hamburger Icon */}
        <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
          {isOpen ? (
            <span className="text-3xl">✖</span>
          ) : (
            <span className="text-3xl text-red-500">☰</span>
          )}
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
          {menuItems.map(renderMenuItem)}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
