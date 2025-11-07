import Footer from '@/components/footer/Footer';
import About from '@/components/home/About';
import NewAbout from '@/components/home/newAbout';
import Navbar from '@/components/navbar/Navbar';
import { MacbookScrollDemo } from '../../components/ui/Macbook';

import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <div className='mt-24'>
 <About/>
   <MacbookScrollDemo/>
 
        <NewAbout/>
      </div>
       
        <Footer/>
    </div>
  )
}

export default page;