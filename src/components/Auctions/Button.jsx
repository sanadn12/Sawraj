import React, { useEffect, useState } from "react";
import { Gavel } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CreateAuctionButton = () => {
  const router = useRouter();
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);

        try {
          const decoded = jwtDecode(storedToken);
          setRole(decoded.role); // make sure your JWT has "role"
        } catch (err) {
          console.error("Error decoding token:", err);
        }
      }
    }
  }, []);

  const handleAdd = () => {
    router.push("/create-auction");
  };

  // Show button only for admins
  if (role !== "admin") return null;

  return (
    <button
      onClick={handleAdd}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 
                 border-4 bg-red-100 border-red-600 text-red-600 font-semibold text-xl 
                 px-4 md:px-8 py-1 md:py-4 rounded-full shadow-xl 
                 hover:bg-red-700 hover:text-white hover:shadow-2xl hover:scale-105 
                 transition-all duration-300 ease-in-out"
    >
      <Gavel size={28} />
      Create Auction
    </button>
  );
};

export default CreateAuctionButton;
