
"use client"
import AddForm from '@/components/addForm/AddForm';
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      router.push('/login'); 
    }
  }, [router]);

  return (
    <div>
      <Navbar />
      <div className="mt-36">
        <AddForm />
      </div>
      <Footer />
    </div>
  );
};

export default Page;
