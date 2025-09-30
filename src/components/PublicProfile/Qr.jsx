"use client";
import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const Qr = ({ url, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm perspective cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`relative w-full h-96 md:h-80 duration-700 transform-style-3d transition-transform ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          onClick={handleFlip}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center">
            <div className="relative flex flex-col items-center justify-center h-full w-full z-10">
              {/* Glowing Background */}
              <div className="absolute -inset-4 bg-red-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
              <div className="absolute -inset-2 bg-white rounded-3xl shadow-inner opacity-10"></div>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-2xl shadow-2xl border border-red-200 z-10">
                <QRCodeCanvas
                  value={url}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#b91c1c"
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/selogo.jpg",
                    height: 80,
                    width: 80,
                    excavate: true,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-red-600 via-red-500 to-white rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center">
            <div className="relative flex flex-col items-center justify-center h-full w-full z-10 space-y-4">
              {/* Animated blobs */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full opacity-10 blur-3xl animate-float"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full opacity-10 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

              {/* Centered Logo */}
              <div className="w-48 h-48 flex items-center justify-center rounded-2xl overflow-hidden  bg-white shadow-lg">
                <img
                  src="/selogo.jpg"
                  alt="Logo"
                  className="w-full h-full  object-cover"
                />
              </div>

            
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind 3D helpers */}
      <style jsx>{`
        .perspective {
          perspective: 1200px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default Qr;
