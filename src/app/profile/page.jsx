"use client";

import Footer from '@/components/footer/Footer';
import MyListings from '@/components/MyListings/MyListings';
import Navbar from '@/components/navbar/Navbar';
import Profile from '@/components/profile/Profile';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

const Page = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('token');
      if (!storedToken) {
        router.push('/login'); 
      } else {
        setToken(storedToken);
      }
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className="text-center mt-32">Loading...</div>;
  }

  if (!token) {
    return null; 
  }
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
