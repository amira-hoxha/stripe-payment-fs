'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    if (paymentIntent) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          {status === 'loading' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Processing Payment...</h2>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your payment. Your transaction has been completed successfully.
              </p>
              <a
                href="/"
                className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Return to Home
              </a>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
              <p className="text-gray-600 mb-6">
                There was an issue processing your payment. Please try again.
              </p>
              <a
                href="/"
                className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Return to Home
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 