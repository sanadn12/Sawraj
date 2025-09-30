"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const About2 = () => {
  const router = useRouter();

  return (
    <div className="relative text-white overflow-hidden min-h-[90vh]">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/main2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 px-6 md:px-12 py-32 flex items-center justify-center min-h-[90vh]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-6">
            Your One-Stop Marketplace
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Welcome to our vibrant marketplace where you can effortlessly upload your products, showcase listings, and explore a wide variety of items from different sellers. Our platform empowers businesses and individuals to reach more customers with ease.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => router.push('/login')}
              className="bg-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition"
            >
              Join Now
            </button>
   
          </div>
        </div>
      </div>
    </div>
  );
};

export default About2;
