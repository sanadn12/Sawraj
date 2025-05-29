"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";


const Login = () => {
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
  const router = useRouter();


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${BACKEND_API}/users/login`, formData);
      setSuccess("Login successful!");
const userId = response.data?.user?._id || response.data?._id;
const token = response.data?.token; 
if (userId && token) {
  sessionStorage.setItem("userId", userId);
   sessionStorage.setItem("token", token);
}      router.push("/profile");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-red-500 to-red-200 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-red-200 transition-all duration-300">
        <h2 className="text-4xl font-extrabold text-red-600 mb-8 text-center tracking-wide">
          Login
        </h2>

        {error && (
          <p className="mb-4 text-center text-red-600 font-semibold">{error}</p>
        )}

        {success && (
          <p className="mb-4 text-center text-green-600 font-semibold">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="peer w-full px-4 pt-5 pb-2 text-gray-800 placeholder-transparent border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
              placeholder="Email"
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200">
              Email Address
            </label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="peer w-full px-4 pt-5 pb-2 text-gray-800 placeholder-transparent border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
              placeholder="Password"
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-2 text-sm text-red-500 hover:text-red-700 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold text-lg rounded-xl shadow-md transition-all duration-200 ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-red-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
