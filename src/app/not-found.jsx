"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-red-600 px-6">
      {/* Logo */}
      <motion.img
        src="https://sawraj.in/SeLogo.png"
        alt="Logo"
        className="w-72 h-24 mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* 404 Text */}
      <motion.h1
        className="text-8xl font-extrabold tracking-widest"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        404
      </motion.h1>

      {/* Not Found Message */}
      <motion.h2
        className="mt-4 text-2xl font-semibold text-gray-800"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Oops! Page Not Found
      </motion.h2>

      <motion.p
        className="mt-2 text-gray-500 text-center max-w-md"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        The page you’re looking for doesn’t exist or may have been moved.
        Don’t worry, let’s get you back on track.
      </motion.p>

      {/* Button */}
      <motion.div
        className="mt-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Link href="/" className="px-6 py-3 bg-red-600 text-white rounded-2xl shadow-lg hover:bg-red-700 transition-all duration-300 font-semibold">
          Go Back Home
        </Link>
      </motion.div>

      {/* Decorative Line */}
      <motion.div
        className="mt-10 w-40 h-1 bg-red-600 rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 1 }}
      />
    </div>
  );
};

export default NotFound;
