"use client"
import Auctions from '@/components/Auctions/Auctions'
import Button from '@/components/Auctions/Button'
import Footer from '@/components/footer/Footer'
import Navbar from '@/components/navbar/Navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
        <Auctions/>
        <Button/>
        <Footer/>
    </div>
  )
}

export default page