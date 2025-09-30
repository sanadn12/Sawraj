"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const PaymentCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Verifying your payment...');
  
  const orderId = searchParams.get('order_id');
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        console.log("=== Payment Callback Debug Logs ===");
        console.log("Order ID from searchParams:", orderId);
        console.log("Backend API URL:", BACKEND_API);

        if (!orderId) {
          console.warn("No order ID found in URL.");
          setStatus('error');
          setMessage('Invalid order ID');
          return;
        }

        const token = sessionStorage.getItem('token');
        console.log("Token from sessionStorage:", token);

        if (!token) {
          console.warn("Token missing, fallback to pending. Webhook will confirm payment.");
          setStatus('pending');
          setMessage('Payment is being processed. You will receive confirmation shortly.');
          setTimeout(() => router.push('/profile'), 5000);
          return;
        }

        console.log("Verifying payment with backend...");

        const response = await axios.get(
          `${BACKEND_API}/plans/verify/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            validateStatus: () => true // avoid axios throwing on non-2xx
          }
        );

        console.log("Axios response status:", response.status);
        console.log("Axios response data:", response.data);

        if (response.status === 204 || !response.data) {
          console.warn("Payment verification returned 204 or empty response. Marking as pending.");
          setStatus('pending');
          setMessage('Payment is being processed. You will receive confirmation shortly.');
          setTimeout(() => router.push('/profile'), 5000);
          return;
        }

        if (response.data.success) {
          console.log("Payment verified successfully!");
          setStatus('success');
          setMessage('Payment completed successfully! Your plan has been activated.');
          setTimeout(() => router.push('/profile?payment=success'), 3000);
        } else {
          console.warn("Payment verification returned success: false. Pending status.");
          setStatus('pending');
          setMessage('Payment is being processed. Please check your profile in a few minutes.');
          setTimeout(() => router.push('/profile'), 5000);
        }

      } catch (error) {
        console.error('Payment verification error:', error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
        }
        setStatus('pending');
        setMessage('Payment status is being verified. You will receive an email confirmation shortly.');
        setTimeout(() => router.push('/profile'), 5000);
      }
    };

    if (orderId) {
      console.log("Calling verifyPayment...");
      verifyPayment();
    } else {
      console.warn("No orderId, skipping verification.");
    }
  }, [orderId, router, BACKEND_API]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Payment...</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Failed</h2>
          </>
        )}
        
        {status === 'pending' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing...</h2>
          </>
        )}
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        {(status === 'success' || status === 'pending') && (
          <p className="text-sm text-gray-500">Redirecting to your profile...</p>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
