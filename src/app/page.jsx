import Footer from '@/components/footer/Footer';
import About from '@/components/home/About';
import About2 from '@/components/home/About2';
import Hero from '@/components/home/Hero';
import NewAbout from '@/components/home/newAbout';
import Navbar from '@/components/navbar/Navbar';
import React from 'react'

const page = () => {
  return (
    <div>
<Navbar/>
<div className='mt-36'>
<Hero/>

</div>
<div className='mt-12'>
<About2/>
<NewAbout/>
<Footer/>
</div>

    </div>
  )
}

export default page;