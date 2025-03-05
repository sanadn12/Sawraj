"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    const currentPath = window.location.pathname;
    const page = currentPath === "/" ? "home" : currentPath.slice(1);
    setActivePage(page);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (page) => {
    setActivePage(page);
    setIsOpen(false); // Close the menu on selection
  };

  // Menu items with display names and paths
  const menuItems = [
    { name: "Home", path: "home" },
    { name: "About Us", path: "about" },
    // { name: "Contact Us", path: "contact" },
  ];

  return (
    <nav className="bg-white fixed text-gray-800 py-2 px-4 shadow-md top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo with Link to Home */}
        <div className="flex-shrink-0">
          <Link href="/">
            <div className="relative ml-4 h-20 w-60 md:h-24 md:w-80 cursor-pointer">
              <Image
                src="/Selogo.png"
                alt="MyLogo"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </Link>
        </div>

        {/* Menu Icon for Mobile */}
        <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
          {isOpen ? (
            <span className="text-3xl">✖</span>
          ) : (
            <span className="text-3xl text-red-500">☰</span>
          )}
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8">
          {menuItems.map(({ name, path }) => (
            <li
              key={path}
              className={`text-lg font-semibold hover:text-red-700 ${
                activePage === path ? "text-red-500" : "text-black"
              }`}
            >
              <Link href={path === "home" ? "/" : `/${path}`}>{name}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 overflow-hidden ${
          isOpen ? "h-auto opacity-100" : "h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-4 py-4">
          {menuItems.map(({ name, path }) => (
            <li
              key={path}
              className={`text-lg font-semibold hover:text-red-700 ${
                activePage === path ? "text-red-500" : "text-black"
              }`}
              onClick={() => handleMenuItemClick(path)}
            >
              <Link href={path === "home" ? "/" : `/${path}`}>{name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
