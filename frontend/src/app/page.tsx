'use client';

import { useEffect, useState } from 'react';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { AxiosError } from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Home() {
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createCheckoutSession = async () => {
      const axios = (await import('axios')).default;
      
      try {
        console.log('Creating checkout session...');
        const response = await axios.post('http://localhost:3001/api/create-checkout-session', {
          amount: 1000, // $10.00
        });
        
        console.log('Response:', response.data);
        
        if (!response.data.clientSecret) {
          throw new Error('No client secret received');
        }
        
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error:', axiosError);
        setError(axiosError.message || 'Failed to create checkout session');
      }
    };

    createCheckoutSession();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Stripe Payment Demo</h1>
        {error && (
          <div className="text-red-600 text-center mb-4">
            Error: {error}
          </div>
        )}
        {!clientSecret && !error && (
          <div className="text-gray-900 text-center">
            Loading payment form...
          </div>
        )}
        {clientSecret && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}
      </div>
    </main>
  );
}