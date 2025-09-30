
"use client";
import Navbar from '@/components/PublicProfile/Navbar'
import SearchPage from '@/components/Search/FeedPage'
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
        <Navbar/>
        <SearchPage token={token} userId={userId} />
    </div>
  )
}

export default Page;