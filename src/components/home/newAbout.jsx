import React from 'react';

const NewAbout = () => {
  return (
    <section className="bg-white text-gray-800 py-12 px-6 sm:px-12 lg:px-24 border-t-4 border-red-600">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-red-700 mb-8">
          Empowering Transactions with Sawraj Enterprises
        </h2>

        <p className="text-lg leading-relaxed mb-6">
          <span className="font-semibold text-red-700">Sawraj Enterprises</span> is a dynamic platform built to facilitate seamless buying, selling, and live auctioning of materials. We enable users to list products and engage with verified buyers and sellers, all within a secure and efficient ecosystem.
        </p>

        <p className="text-lg leading-relaxed mb-6">
          Whether you are a small vendor or an established business, our system is designed to provide maximum visibility and real-time bidding to get you the best value for your goods. Our auctions are transparent, intuitive, and built for scale.
        </p>

        {/* Shimmer Box */}
        <div className="relative overflow-hidden bg-red-50 border-l-4 border-red-600 p-6 mt-8 rounded-lg shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red/400 to-red-300 animate-shimmer" />
          <p className="relative z-10 text-md sm:text-lg font-medium text-red-800 text-center">
            Ready to sell or auction your materials? <br />
            <span className="font-semibold">Join Sawraj Enterprises today and transform the way you trade.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewAbout;
