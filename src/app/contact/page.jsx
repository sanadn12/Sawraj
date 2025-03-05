"use client"
import Contact from '@/components/contact/Contact';
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
        <Contact/>
        <Footer/>
    </div>
  )
}

export default page;