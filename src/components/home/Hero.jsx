import React from "react";

const Hero = () => {
  return (
    <div className="bg-white text-gray-900 mt-12">
      <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Section: Text Content */}
          <div>
            <h1 className="text-4xl md:text-7xl font-bold font-montserrat leading-tight mb-6">
              Welcome to <br /> <span className="text-red-500 font-bold font-syne">Sawraj Enterprises</span>
            </h1>
            <p className="text-lg md:text-xl mb-8">
              We are Dealers in the trading of ferrous and non-ferrous metals and all types of scrap materials. With decades of experience, we ensure quality service and top market value for your scrap materials.
            </p>

            <a
  href="https://wa.me/9324078235"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block bg-red-500 text-white font-semibold text-lg px-4 py-2 md:px-8 md:py-4 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
>
  Contact Us Today
</a>

          </div>

          {/* Right Section: Image or Call-to-Action */}
          <div className="flex justify-center">
            <img
              src="/e-scrap.jpg"
              alt="Ferrous and Non-Ferrous Scrap Trading"
              className="w-full h-auto rounded-lg "
            />
          </div>
        </div>
      </div>

      {/* Decorative Red Section */}
      <div className="bg-red-500 text-white md:-mt-6 py-6">
        <div className="container mx-auto text-center">
          <p className="text-xl font-semibold">
            Trusted Scrap Trading Since 2003 | Dealers in Ferrous & Non-Ferrous Metals
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;

// ff