"use client";

import Navbar from "@/components/PublicProfile/Navbar";
import PublicProfile from "@/components/PublicProfile/PublicProfile";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Page = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const decoded = jwtDecode(storedToken);
          setUserId(decoded.id || decoded._id);
        } catch (err) {
          console.error("Failed to decode token", err);
        }
      }
    }
  }, []);

  return (
    <div>
      <PublicProfile token={token} userId={userId} />
      <Navbar />
    </div>
  );
};

export default Page;
