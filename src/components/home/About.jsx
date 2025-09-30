import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Store, Gavel, UserCheck, Phone } from "lucide-react"; // icons

const About = () => {
  const features = [
    { 
      icon: <Store className="w-6 h-6" />, 
      title: "Marketplace", 
      desc: "List and discover verified scrap and metal products with our intelligent matching system.",
      gradient: "from-red-500 to-orange-500"
    },
    { 
      icon: <Gavel className="w-6 h-6" />, 
      title: "Live Auctions", 
      desc: "Real-time bidding platform with transparent processes and instant notifications.",
      gradient: "from-red-600 to-pink-600"
    },
    { 
      icon: <UserCheck className="w-6 h-6" />, 
      title: "Public Profiles", 
      desc: "Build credibility with verified business profiles and customer reviews.",
      gradient: "from-red-700 to-rose-700"
    },
  ];

  const stats = [
    { number: "20+", label: "Years of Excellence", sublabel: "Since 2003" },
    { number: "100+", label: "Active Clients", sublabel: "Global Network" },
    { number: "50+", label: "Products Traded", sublabel: "Diverse Range" },
    { number: "100%", label: "Trusted Deals", sublabel: "Verified Quality" }
  ];

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-white mt-16 py-20 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-6 border border-red-100">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-red-600 font-semibold text-sm">TRUSTED SINCE 2003</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
            About <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">Us</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8">
              Building trust in trading and auctions for over{" "}
              <span className="font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                20 years
              </span>
              . We connect businesses through a secure, transparent, and efficient marketplace.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-red-100/50 border border-red-50">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Pioneers in Metal & Scrap Trading
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                At <span className="font-bold text-red-600">Sawraj Enterprises</span>, 
                we specialize in trading <span className="text-red-600 font-semibold">Ferrous</span> and{" "}
                <span className="text-red-600 font-semibold">Non-Ferrous Metals</span> along with all types of scrap materials.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our two-decade journey is built on <span className="font-semibold">transparency, fair pricing, and customer-centric service</span>, 
                making us the preferred choice for global scrap and metal trading.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl font-black text-red-600 mb-2">{stat.number}</div>
                  <div className="font-semibold text-gray-900 text-sm mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="relative h-64 rounded-2xl overflow-hidden group">
                <Image
                  src="/metal.jpg"
                  alt="Metal Scrap"
                  fill
                  className="object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="font-bold">Ferrous & Non-Ferrous</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 text-white">
                <h4 className="font-bold text-lg mb-2">Quality Assured</h4>
                <p className="text-sm opacity-90">Every material verified for quality and authenticity</p>
              </div>
            </div>
            
            <div className="space-y-6 mt-12">
              <div className="bg-gradient-to-br from-black to-gray-700 rounded-2xl p-6 text-white">
                <h4 className="font-bold text-lg mb-2">Global Reach</h4>
                <p className="text-sm opacity-90">Connecting buyers and sellers worldwide</p>
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden group">
                <Image
                  src="/e-scrap.jpg"
                  alt="Electronic Scrap"
                  fill
                  className="object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="font-bold">Electronic Scrap</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-red-600">Platform</span> Features
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Designed to provide the best trading experience with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} text-white text-2xl mb-4`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Trading Experience?
            </h3>
            <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied clients who trust Sawraj Enterprises for their metal and scrap trading needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://wa.me/9324078235">
                <button className="px-8 py-4 bg-white text-red-600 font-bold rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300 flex items-center gap-2">
                  <Phone className="w-5 h-5" /> Contact Us Now
                </button>
              </Link>
              <Link href="/marketplace">
                <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300">
                  Explore Marketplace
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
