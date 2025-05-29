"use client"
    import Footer from '@/components/footer/Footer';
import MyListings from '@/components/MyListings/MyListings';
import Navbar from '@/components/navbar/Navbar';
import Profile from '@/components/profile/Profile';
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <div className='mt-24 md:mt-28'>
      <Profile/>
      <MyListings/>

      </div>
       <div className='md:-mt-10'> <Footer/>
       </div>
       
    </div>
  )
}

export default page;