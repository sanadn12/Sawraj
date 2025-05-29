"use client"
    import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';
import Register from '@/components/register/register';
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
       <Register/>
       <div className='-mt-16 md:-mt-10'>  <Footer/>
       </div>
      
    </div>
  )
}

export default page;