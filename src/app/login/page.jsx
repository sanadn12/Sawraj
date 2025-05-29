"use client"
    import Footer from '@/components/footer/Footer';
import Login from '@/components/login/login';
import Navbar from '@/components/navbar/Navbar';
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
       <Login/>
       <div className='md:-mt-10'> <Footer/>
       </div>
       
    </div>
  )
}

export default page;