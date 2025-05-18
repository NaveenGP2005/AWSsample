"use client";

import { useState } from "react";
import API from "../api"; // Make sure path is correct in your Next.js project

export default function CheckIn({ eventId, onCheckIn }) {
  const [form, setForm] = useState({ email: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await API.post("/checkin", { ...form, eventId });
      setSuccess(data.msg);
      setForm({ email: "", otp: "" });
      if (onCheckIn) onCheckIn();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
        Check-In Process
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-blue-400 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500"
            placeholder="Enter registered email"
          />
        </div>

        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-blue-400 mb-1">
            OTP Code
          </label>
          <input
            id="otp"
            type="text"
            required
            maxLength="6"
            value={form.otp}
            onChange={(e) => setForm({ ...form, otp: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500"
            placeholder="Enter 6-digit OTP"
          />
        </div>

        {error && (
          <div className="bg-red-900/50 text-red-400 p-3 rounded-lg text-sm border border-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/50 text-green-400 p-3 rounded-lg text-sm border border-green-700">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-bold ${
            loading
              ? "bg-blue-900 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          } transition-all duration-300 transform hover:scale-105`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            "Check In"
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <h3 className="text-sm font-medium text-blue-400 mb-2">Instructions:</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Enter the email address used during registration</li>
          <li>• Enter the 6-digit OTP received in your email</li>
          <li>• Staff will verify your identity before check-in</li>
          <li>• OTPs are valid for 15 minutes only</li>
        </ul>
      </div>
    </div>
  );
}
