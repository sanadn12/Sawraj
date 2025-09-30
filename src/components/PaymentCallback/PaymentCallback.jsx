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
        if (!orderId) {
          setStatus('error');
          setMessage('Invalid order ID');
          return;
        }

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // Verify payment with backend
        const response = await axios.get(
          `${BACKEND_API}/plans/verify/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setStatus('success');
          setMessage('Payment completed successfully! Your plan has been activated.');
          
          // Redirect to profile after 3 seconds
          setTimeout(() => {
            router.push('/profile?payment=success');
          }, 3000);
        } else {
          setStatus('pending');
          setMessage('Payment is being processed. Please check your profile in a few minutes.');
          
          setTimeout(() => {
            router.push('/profile');
          }, 5000);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('pending');
        setMessage('Payment status is being verified. You will receive an email confirmation shortly.');
        
        setTimeout(() => {
          router.push('/profile');
        }, 5000);
      }
    };

    if (orderId) {
      verifyPayment();
    }
  }, [orderId, router]);

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