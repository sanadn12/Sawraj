"use client";
import ViewAuction from '@/components/Auctions/ViewAuction';
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Page = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  useEffect(() => {
    const checkAccess = async () => {
      if (typeof window === 'undefined') return;

      const storedToken = sessionStorage.getItem('token');

      // Not logged in
      if (!storedToken) {
        router.push('/login');
        return;
      }

      setToken(storedToken);

      try {
        const res = await axios.get(`${BACKEND_API}/plans/myplan`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });

        const plan = res.data.plan;

        // Logged in but no auction access
        if (!plan.auctionAccess) {
          router.push('/auctions');
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching plan:", err);
        router.push('/auctions'); // fallback redirect
      }
    };

    checkAccess();
  }, [router]);

  if (!token || loading) return <div className="text-center mt-32">Loading...</div>;

  return (
    <div>
      <Navbar />
      <ViewAuction token={token} />
      <Footer />
    </div>
  );
};

export default Page;
