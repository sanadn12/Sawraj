"use client";
export const dynamic = "force-dynamic";

import Dashboard from '@/components/Admin/Dashboard'
import Navbar from '@/components/Admin/Navbar'
import React from 'react'
const Page = () => {
  return (
    <div>
      <Navbar/>
      <div>
        <Dashboard/>
      </div>
    </div>
  )
}

export default Page;