"use client"
import EditListing from '@/components/editListing/EditListing';
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';
import React ,{Suspense }from 'react'

const page = () => {
  return (
    <div>
      
      <Navbar/>
      <div className='mt-24'>
                <Suspense fallback={<div>Loading...</div>}>

        <EditListing/>
                </Suspense>

      </div>
        <Footer/>
    </div>
  )
}

export default page;