"use client";
export const dynamic = "force-dynamic";

import Navbar from '@/components/Admin/Navbar';
import Users from '@/components/Admin/Users';
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar />
        <Users />
    </div>
  )
}

export default page;