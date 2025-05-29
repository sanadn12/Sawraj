import AddForm from '@/components/addForm/AddForm';
import Footer from '@/components/footer/Footer';

import Navbar from '@/components/navbar/Navbar';
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <div className='mt-36'>
<AddForm/>
      </div>
       
        <Footer/>
    </div>
  )
}

export default page;