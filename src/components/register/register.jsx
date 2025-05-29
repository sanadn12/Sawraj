"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Register = () => {

    const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP input, 3 = success
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Regex patterns for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setMessage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address.";
    if (!phoneRegex.test(formData.phone)) newErrors.phone = "Please enter a valid phone number (7-15 digits, optional +).";
    if (!passwordRegex.test(formData.password))
      newErrors.password = "Password must be at least 8 chars, with uppercase, lowercase, number & special char.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_API}/users/createAccount`, formData);
      setLoading(false);
      if (res.status === 201) {
        setStep(2);
        setMessage("OTP sent to your email. Please enter it below.");
      }
    } catch (error) {
      setLoading(false);
      setMessage(error.response?.data?.message || "Error creating account. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!otp.trim()) {
      setErrors({ otp: "Please enter the OTP." });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_API}/users/verifyotp`, { email: formData.email, otp });
      setLoading(false);
      if (res.status === 200) {
        setStep(3);
        setMessage("Account verified successfully! You can now login.");
      }
    } catch (error) {
      setLoading(false);
      setMessage(error.response?.data?.message || "Error verifying OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-16 px-4 py-12 relative">
      <div className="bg-gradient-to-tr from-white via-red-200 to-red-500 animate-gradient-background min-h-screen w-full absolute top-0 left-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white mb-12 shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-red-200 relative z-10"
      >
        {step === 1 && (
          <>
            <h2 className="text-4xl font-extrabold text-red-600 mb-8 text-center tracking-wide">
              Create Account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="peer w-full px-4 pt-5 pb-2 text-gray-800 placeholder-transparent border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
                  placeholder="Full Name"
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200">
                  Full Name
                </label>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </motion.div>

              {/* Email */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`peer w-full px-4 pt-5 pb-2 text-gray-800 placeholder-transparent border rounded-lg focus:outline-none transition duration-200 ${
                    errors.email ? "border-red-500 focus:ring-red-500" : "border-red-300 focus:ring-red-400"
                  }`}
                  placeholder="Email"
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200">
                  Email Address
                </label>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </motion.div>

              {/* Phone */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={`peer w-full px-4 pt-5 pb-2 text-gray-800 placeholder-transparent border rounded-lg focus:outline-none transition duration-200 ${
                    errors.phone ? "border-red-500 focus:ring-red-500" : "border-red-300 focus:ring-red-400"
                  }`}
                  placeholder="Phone"
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200">
                  Phone Number
                </label>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </motion.div>

              {/* Password */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`peer w-full px-4 pt-5 pb-2 text-gray-800 placeholder-transparent border rounded-lg focus:outline-none transition duration-200 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : "border-red-300 focus:ring-red-400"
                  }`}
                  placeholder="Password"
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-sm text-red-600 hover:text-red-800 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </motion.div>

              {/* Submit */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 text-white font-semibold text-lg rounded-xl hover:bg-red-700 transition-all duration-200 shadow-md disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </motion.button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-3xl font-extrabold text-red-600 mb-8 text-center tracking-wide">
              Enter OTP
            </h2>
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1
, y: 0 }} transition={{ duration: 0.4 }} className="relative">
<input
  type="text"
  name="otp"
  value={otp}
  onChange={(e) => {
    setOtp(e.target.value);
    setErrors((prev) => ({ ...prev, otp: "" }));
    setMessage("");
  }}
  maxLength={6}
  required
  className={`peer w-full px-4 pt-5 pb-2 text-gray-800 placeholder-transparent border rounded-lg focus:outline-none transition duration-200 ${
    errors.otp ? "border-red-500 focus:ring-red-500" : "border-red-300 focus:ring-red-400"
  }`}
  placeholder="OTP"
/>


<label className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200">
One-Time Password (OTP)
</label>
{errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
</motion.div>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white font-semibold text-lg rounded-xl hover:bg-red-700 transition-all duration-200 shadow-md disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </motion.button>

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setOtp("");
              setMessage("");
              setErrors({});
            }}
            className="mt-4 w-full text-center text-red-600 hover:underline"
          >
            Back to Registration
          </button>
        </form>
      </>
    )}

    {step === 3 && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-extrabold text-green-600 mb-4">
          Success!
        </h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={() => {
            setStep(1);
            setFormData({ name: "", email: "", phone: "", password: "" });
            setOtp("");
            setErrors({});
            setMessage("");
          }}
          className="py-3 px-6 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition duration-200"
        >
          Register Another Account
        </button>
      </motion.div>
    )}

    {message && step !== 3 && (
      <p
        className={`mt-4 text-center font-semibold ${
          step === 2 ? "text-red-600" : "text-green-700"
        }`}
      >
        {message}
      </p>
    )}
  </motion.div>
</div>
);
};

export default Register;