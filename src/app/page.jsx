import Footer from '@/components/footer/Footer';
import About from '@/components/home/About';
import Hero from '@/components/home/Hero';
import Navbar from '@/components/navbar/Navbar';
import React from 'react'

const page = () => {
  return (
    <div>
<Navbar/>
<Hero/>
<About/>
<Footer/>
    </div>
  )
}

export default page;