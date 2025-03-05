import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-red-500 mt-12 text-white py-12">
      <div className="container mx-auto px-6 md:px-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Column 1: Logo & Contact */}
          <div>
            <Image
              src="/Selogo.png"
              alt="Logo"
              width={224}
              height={96}
              className=" bg-white rounded-full mb-4 h-20 w-48 md:h-24 md:w-60"
            />
            <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-bold ">Call:</span>{" "}
                <a href="tel:+919324078235" className="hover:underline">
                  +91 9324078235
                </a>
              </li>
              <li>
                <span className="font-bold">Email:</span>{" "}
                <a
                  href="mailto:sawrajenterprises2003@gmail.com"
                  className="hover:underline"
                >
                  sawrajenterprises2003@gmail.com
                </a>
              </li>
              <li>
                <span className="font-bold">Address:</span>
                <br />
                <a
                  href="https://maps.app.goo.gl/9tCJ3VWmD4h39VXn8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  1-b 06 Aghadi Nagar, Andheri(East), Mumbai-93
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              {/* <li>
                <Link href="/services" className="hover:underline">
                  Services
                </Link>
              </li> */}
              <li>
                <Link href="https://wa.me/9324078235" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/sanad.naqvi.1/?locale=en_GB&_rdr"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-600 p-3 rounded-full hover:bg-blue-600 hover:text-white transition"
                aria-label="Facebook"
              >
                <FacebookIcon fontSize="large" />
              </a>

              <a
                href="https://www.linkedin.com/in/sanad-naqvi-687703256/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-700 p-3 rounded-full hover:bg-blue-700 hover:text-white transition"
                aria-label="LinkedIn"
              >
                <LinkedInIcon fontSize="large" />
              </a>

              <a
                href="https://www.instagram.com/sanad_n12"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-pink-500 p-3 rounded-full hover:bg-pink-500 hover:text-white transition"
                aria-label="Instagram"
              >
                <InstagramIcon fontSize="large" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-white pt-4 text-center text-sm text-white">
          © 2003-2025 Sawraj Enterprises. All rights reserved.
        </div>

        {/* WhatsApp Floating Icon */}
        <a
          href="https://wa.me/+919324078235"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
          aria-label="WhatsApp"
        >
          <WhatsAppIcon fontSize="large" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
