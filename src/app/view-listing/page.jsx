import Footer from '@/components/footer/Footer';
import Listing from '@/components/listing/Listing';

import Navbar from '@/components/navbar/Navbar';
import React ,{Suspense }from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <div className='mt-24'>
      </div>
                      <Suspense fallback={<div>Loading...</div>}>
      
       <Listing/>
                       </Suspense>
       
        <Footer/>
    </div>
  )
}

export default page;