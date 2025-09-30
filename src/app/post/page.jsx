"use client";

import Post from '@/components/Post/Post';
import Navbar from '@/components/PublicProfile/Navbar';
import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const Page = () => {
    const [token, setToken] = useState(null);
      const [userId, setUserId] = useState(null);
      const [loading, setLoading] = useState(true);
    
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
          setLoading(false);
        }
      }, []);
  return (
    <div>
        <Navbar/>
        <Post/>
    </div>
  )
}

export default Page;