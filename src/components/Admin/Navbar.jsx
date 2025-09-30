"use client";
import React, { useState, useEffect } from "react";
import { FiUsers, FiBox, FiHome, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const router = useRouter();

  // Track window width for responsive animations
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateWidth = () => setWindowWidth(window.innerWidth);
      updateWidth(); // set initial width

      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  // Calculate motion width safely
  const calculatedWidth = windowWidth
    ? isOpen
      ? windowWidth < 768
        ? "95%"
        : 650
      : windowWidth < 768
      ? "90%"
      : 300
    : 300; // fallback if width not yet loaded

  return (
    <div className="fixed top-6 left-0 right-0 flex justify-center z-50">
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        animate={{ width: calculatedWidth, height: 70 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative bg-white text-black rounded-full flex items-center justify-center shadow-xl cursor-pointer overflow-hidden px-4 sm:px-6"
      >
        {/* Content Row */}
        <div className="flex items-center justify-between w-full">
          {/* Left side */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 sm:gap-6"
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/admin");
                  }}
                  className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm sm:text-md"
                >
                  <FiHome size={16} /> <span className="hidden sm:inline">Dashboard</span>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/admin/users");
                  }}
                  className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm sm:text-md"
                >
                  <FiUsers size={16} /> <span className="hidden sm:inline">Users</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logo in center */}
          <div className="flex items-center justify-center mx-auto">
            <Image
              src="/SeLogo.png"
              alt="Logo"
              width={isOpen ? 150 : 200}
              height={100}
              className="rounded-full sm:w-[290px] sm:h-[120px] transition-all duration-300"
            />
          </div>

          {/* Right side */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 40, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 sm:gap-6"
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/admin/plans");
                  }}
                  className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm sm:text-md"
                >
                  <FiBox size={16} /> <span className="hidden sm:inline">Plans</span>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/profile");
                  }}
                  className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm sm:text-md"
                >
                  <FiUser size={16} /> <span className="hidden sm:inline">Profile</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;
