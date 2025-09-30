"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const loadCashfreeScript = () => {
  return new Promise((resolve) => {
    if (window.Cashfree) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


const PlanCard = ({ plan, isCurrentPlan, index, handleBuyNow }) => (
  <div
    className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform shadow-lg ${
      index === 1
        ? "border-2 border-red-600 shadow-xl bg-white ring-2 ring-red-50 scale-105 z-10"
        : "border border-red-100 bg-white"
    }`}
  >
    {/* Popular badge for middle plan */}
    {index === 1 && (
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md">
        MOST POPULAR
      </div>
    )}

    {/* Current Plan badge */}
    {isCurrentPlan && (
      <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
        Your Plan
      </div>
    )}

    {/* Plan header */}
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold text-red-700">₹{plan.price}</span>
        {plan.interval && <span className="text-gray-500 text-sm">/{plan.interval}</span>}
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-red-100 to-transparent my-4"></div>
    </div>

    {/* Features list */}
    <div className="space-y-4 mb-8">
      <div className="flex items-start">
        <div className="bg-red-100 p-1 rounded-full mr-3 mt-0.5">
          <svg
            className="w-4 h-4 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <span className="text-gray-700">
          Listing Limit: <strong>{plan.listingLimit}</strong>
        </span>
      </div>

      <div className="flex items-start">
        <div
          className={`p-1 rounded-full mr-3 mt-0.5 ${plan.auctionAccess ? "bg-red-100" : "bg-gray-100"}`}
        >
          {plan.auctionAccess ? (
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )}
        </div>
        <span className={`${plan.auctionAccess ? "text-gray-700" : "text-gray-500"}`}>
          Auction Access: <strong>{plan.auctionAccess ? "Yes" : "No"}</strong>
        </span>
      </div>

      {plan.features.map((feature, idx) => (
        <div key={idx} className="flex items-start">
          <div className="bg-red-100 p-1 rounded-full mr-3 mt-0.5">
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span className="text-gray-700">{feature}</span>
        </div>
      ))}
    </div>

    {/* CTA Button */}
    {!isCurrentPlan ? (
      <button
        onClick={() => handleBuyNow(plan)}
        className={`w-full py-4 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg ${
          index === 1
            ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
            : "bg-white text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white"
        }`}
      >
        {index === 1 ? "Get Started Now" : "Choose Plan"}
      </button>
    ) : (
      <button
        disabled
        className="w-full py-4 rounded-xl font-bold bg-gray-300 text-gray-600 cursor-not-allowed"
      >
        Current Plan
      </button>
    )}
  </div>
);

const PlansPopup = ({ onClose, token }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [myPlan, setMyPlan] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  // Fetch all plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${BACKEND_API}/plans/public`);
        let fetchedPlans = res.data;

        if (myPlan?._id === "free" && !fetchedPlans.some((p) => p.price === 0)) {
          fetchedPlans = [
            {
              _id: "free",
              name: "Sawraj Basics",
              price: 0,
              listingLimit: 2,
              features: ["Basic Access"],
              auctionAccess: false,
            },
            ...fetchedPlans,
          ];
        }

        setPlans(fetchedPlans);
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [myPlan]);

  // Fetch user's current plan
  useEffect(() => {
    const fetchMyPlan = async () => {
      try {
        const res = await axios.get(`${BACKEND_API}/plans/myplan`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyPlan(res.data.plan);
      } catch (err) {
        console.error("Error fetching my plan:", err);
      }
    };
    if (token) fetchMyPlan();
  }, [token]);

const handleBuyNow = async (plan) => {
  try {
    const res = await axios.post(
      `${BACKEND_API}/plans/buy`,
      { planId: plan._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { order } = res.data;

    const isScriptLoaded = await loadCashfreeScript();
    if (!isScriptLoaded) return alert("Failed to load Cashfree SDK.");

const cashfree = window.Cashfree({ mode: 'production' });

    cashfree.checkout({
      paymentSessionId: order.payment_session_id,
      style: { theme: "red", backgroundColor: "#fff" }
    })
    .then(async (result) => {
      if (result.error) throw result.error;

      // 🔹 Call backend to verify payment
      const verifyRes = await axios.post(
        `${BACKEND_API}/plans/buy`,
        {
          planId: plan._id,
          cashfreePaymentId: result.paymentDetails?.paymentId,
          cashfreeOrderId: order.order_id,
          cashfreeSignature: result.paymentDetails?.signature
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔹 Update profile page state without reload
      setMyPlan(plan);
      onClose();
    })
    .catch(err => {
      console.error("Payment error:", err);
      if (err.message !== "USER_CLOSED_POPUP") alert("Payment failed.");
    });

  } catch (err) {
    console.error(err);
    alert("Error creating payment order.");
  }
};


  // Handle scroll for mobile carousel
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setActiveIndex(index);
    }
  };

  if (!plans) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center mt-40 md:mt-0 items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-red-700"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-red-100 opacity-50"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-red-100 opacity-30"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-colors duration-200 bg-white hover:bg-red-50 p-2 rounded-full shadow-md z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center pt-10 pb-6 px-8 bg-gradient-to-b from-white to-red-50">
          <h2 className="text-4xl font-bold text-red-700 mb-3 ">Upgrade Your Plan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the perfect package to unlock premium features and maximize your experience
          </p>
          <div className="h-1 w-24 bg-red-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-3 gap-6 p-8">
              {plans.map((plan, index) => {
                const isCurrentPlan =
                  myPlan && (myPlan._id === plan._id || (myPlan._id === "free" && plan.price === 0));
                return (
                  <PlanCard
                    key={plan._id}
                    plan={plan}
                    isCurrentPlan={isCurrentPlan}
                    index={index}
                    handleBuyNow={handleBuyNow}
                  />
                );
              })}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden relative">
              <div
                ref={carouselRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth space-x-4 p-4"
              >
                {plans.map((plan, index) => {
                  const isCurrentPlan =
                    myPlan && (myPlan._id === plan._id || (myPlan._id === "free" && plan.price === 0));
                  return (
                    <div key={plan._id} className="snap-center flex-shrink-0 w-full">
                      <PlanCard plan={plan} isCurrentPlan={isCurrentPlan} index={index} handleBuyNow={handleBuyNow} />
                    </div>
                  );
                })}
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {plans.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${activeIndex === index ? "bg-red-600" : "bg-gray-300"}`}
                  ></div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Additional info */}
        <div className="bg-red-50 px-8 py-6 rounded-b-2xl border-t border-red-100">
          <p className="text-center text-gray-700">
            <svg
              className="w-5 h-5 text-red-600 inline-block mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              ></path>
            </svg>
            All plans include 24/7 priority support and a 14-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlansPopup;
