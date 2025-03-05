import React from "react";
import Link from "next/link";
import Image from "next/image";

const About = () => {
  return (
    <div className="bg-white mt-12 py-16 px-8 md:px-16 lg:px-32">
      <div className="container mx-auto text-center md:text-left">
        <h2 className="text-3xl md:text-6xl font-bold text-red-500 mb-6">About Us</h2>
        <p className="text-gray-800 mt-12 text-2xl leading-relaxed">
          At <span className="font-semibold text-red-500">Sawraj Enterprises</span>, we specialize in trading Ferrous and Non-Ferrous Metals and all types of scrap materials. <br />With over 20 years of experience, we are a trusted name in the scrap trading industry, ensuring quality products <br /> and professional service worldwide.
        </p>

        <p className="text-gray-800 text-lg mt-4 leading-relaxed">
          Since our establishment in 2003, we’ve built lasting relationships with clients through transparency, fair pricing, and customer-centric service. Whether you&apos;re looking for reliable suppliers or quality scrap materials, we are your one-stop solution.
        </p>

        {/* Images Section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metal Scrap Image */}
          <div className="relative w-full h-64 hover:scale-105">
            <Image 
              src="/metal.jpg" // Replace with actual image path
              alt="Metal Scrap"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Electronic Scrap Image */}
          <div className="relative w-full h-64 hover:scale-105">
            <Image 
              src="/e-scrap.jpg" // Replace with actual image path
              alt="Electronic Scrap"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <Link href="https://wa.me/9324078235">
          <button className="mt-6 px-8 py-3 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition-all">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default About;
