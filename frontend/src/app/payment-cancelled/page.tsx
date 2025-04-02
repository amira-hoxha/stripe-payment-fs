'use client';

export default function PaymentCancelled() {
  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">Payment Cancelled</h2>
            <p className="text-gray-600 mb-6">
              Your payment was cancelled. No charges were made.
            </p>
            <a
              href="/"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
} 