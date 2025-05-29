import Footer from '@/components/footer/Footer';
import About from '@/components/home/About';
import NewAbout from '@/components/home/newAbout';
import Navbar from '@/components/navbar/Navbar';
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <div className='mt-24'>
 <About/>
        <NewAbout/>
      </div>
       
        <Footer/>
    </div>
  )
}

export default page;