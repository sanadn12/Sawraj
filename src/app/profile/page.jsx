"use client";

import Footer from '@/components/footer/Footer';
import MyListings from '@/components/MyListings/MyListings';
import Navbar from '@/components/navbar/Navbar';
import Profile from '@/components/profile/Profile';
import React, { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

const Page = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  if (!token) return <div className="text-center mt-32">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className='mt-24 md:mt-28'>
        <Profile token={token} />
        <MyListings />
      </div>
      <div className='md:-mt-10'>
        <Footer />
      </div>
    </div>
  );
};

export default Page;
