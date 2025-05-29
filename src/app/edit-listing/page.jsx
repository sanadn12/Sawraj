"use client"
export const dynamic = "force-dynamic";

import EditListing from '@/components/editListing/EditListing';
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';
import React ,{Suspense }from 'react'

const page = () => {
  return (
    <>
                    <Suspense fallback={<div>Loading...</div>}>

    <div>
      
      <Navbar/>
      <div className='mt-24'>

        <EditListing/>

      </div>
        <Footer/>
    </div>
                    </Suspense>

    </>
  )
}

export default page;