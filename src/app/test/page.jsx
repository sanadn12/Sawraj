"use client"
import React from 'react'
import { MacbookScrollDemo } from '../../components/ui/Macbook';
import Navbar from '../../components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
const page = () => {
  return (
    <div>
        <Navbar/>
  <MacbookScrollDemo/>
  <Footer/>
       </div>
       
  )
}

export default page;