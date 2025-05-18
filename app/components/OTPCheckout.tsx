'use client';

import { useState } from "react";

interface OTPCheckoutProps {
  eventId: string;
  onCheckout: () => void;
}

export default function OTPCheckout({ eventId, onCheckout }: OTPCheckoutProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(`/api/events/${eventId}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to process checkout');
      }

      setSuccess(true);
      setOtp("");
      onCheckout();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
        Checkout with OTP
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-blue-400 mb-2">
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            placeholder="Enter your OTP"
            required
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-900/50 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-sm text-green-400 bg-green-900/50 rounded-lg border border-green-700">
            Checkout successful!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105 ${
            loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          {loading ? 'Processing...' : 'Checkout'}
        </button>
      </form>
    </div>
  );
}
