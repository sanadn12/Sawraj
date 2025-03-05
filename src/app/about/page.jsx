import Footer from '@/components/footer/Footer';
import About from '@/components/home/About';
import Navbar from '@/components/navbar/Navbar';
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
        <About/>
        <Footer/>
    </div>
  )
}

export default page;