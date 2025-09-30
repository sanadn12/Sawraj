"use client";
import React, { useEffect, useState } from "react";
import { FiSearch, FiPlusSquare, FiUser } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  return (
    <div className="fixed bottom-6  left-0 right-0">
      {/* Outer container with margin on mobile & centered */}
      <div className="mx-4 sm:mx-auto max-w-xl bg-white shadow-2xl rounded-full border border-gray-200">
        <div className="flex justify-between items-center px-8 py-3">

          {/* Search */}
          <button
            onClick={() => router.push("/search")}
            className="flex flex-col items-center justify-center"
          >
            <FiSearch
              className={`h-6 w-6 ${pathname === "/search" ? "text-red-500" : "text-gray-700"}`}
            />
            <span
              className={`text-xs mt-1 ${pathname === "/search" ? "text-red-500" : "text-gray-700"}`}
            >
              Search
            </span>
          </button>

          {/* Post (center & elevated) */}
          <button
            onClick={() => isLoggedIn && router.push("/post")}
            disabled={!isLoggedIn}
            className={`flex flex-col items-center justify-center -mt-6 ${
              !isLoggedIn ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className={`p-4 rounded-full shadow-lg ${isLoggedIn ? "bg-red-500" : "bg-gray-400"}`}>
              <FiPlusSquare className="h-6 w-6 text-white" />
            </div>
            <span
              className={`text-xs mt-1 ${pathname === "/post" ? "text-red-500" : "text-gray-700"}`}
            >
              Post
            </span>
          </button>

          {/* Profile / Login */}
          <button
            onClick={() => router.push(isLoggedIn ? "/profile" : "/login")}
            className="flex flex-col items-center justify-center"
          >
            <FiUser
              className={`h-6 w-6 ${
                pathname === "/profile" || pathname === "/login"
                  ? "text-red-500"
                  : "text-gray-700"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                pathname === "/profile" || pathname === "/login"
                  ? "text-red-500"
                  : "text-gray-700"
              }`}
            >
              {isLoggedIn ? "Profile" : "Login"}
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
