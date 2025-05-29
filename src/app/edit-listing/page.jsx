import EditListing from '@/components/editListing/EditListing';
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <div className='mt-24'>
        <EditListing/>
      </div>
        <Footer/>
    </div>
  )
}

export default page;