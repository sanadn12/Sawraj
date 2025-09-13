"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import AddButton from "@/components/marketplace/addbutton";
import Marketplace from "@/components/marketplace/marketplace";
import Navbar from "@/components/navbar/Navbar";
import Addbuttonfornon from "@/components/marketplace/addbuttonfornon";

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedId = sessionStorage.getItem("token");
    setIsLoggedIn(!!storedId);
  }, []);

  return (
    <div>
      <Navbar />
      <Marketplace />
      {!isLoggedIn && <Addbuttonfornon/>}
      {isLoggedIn && <AddButton />}
      <Footer />
    </div>
  );
};

export default Page;
