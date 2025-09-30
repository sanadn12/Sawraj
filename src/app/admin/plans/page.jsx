"use client";
export const dynamic = "force-dynamic";

import Navbar from '@/components/Admin/Navbar';
import Plans from '@/components/Admin/Plans';
import React from 'react'
import { useEffect, useState } from "react";

const Page = () => {
         const [token, setToken] = useState(null);
    
          useEffect(() => {
            if (typeof window !== 'undefined') {
              const storedToken = sessionStorage.getItem('token');
              setToken(storedToken);
            }
          }, []);
  return (
    <div>
     <Navbar/>   
     <Plans token={token}/>
    </div>
  )
}

export default Page;