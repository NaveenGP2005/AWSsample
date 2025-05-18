'use client';

import { useState } from "react";

interface RegistrationFormProps {
  eventId: string;
}

interface FormData {
  name: string;
  email: string;
  college_id: string;
}

export default function RegistrationForm({ eventId }: RegistrationFormProps) {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    college_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error registering for event');
      }

      setSuccess(true);
      setForm({ name: "", email: "", college_id: "" });
    } catch (err: any) {
      setError(err.message || "Error registering for event");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 text-center border border-gray-700">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-500 mb-2">
          Registration Successful!
        </h2>
        <p className="text-gray-400 mb-4">
          Thank you for registering. Please check your email for further instructions.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          Register Another Person
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-blue-400 mb-1">
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          required
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label htmlFor="college_id" className="block text-sm font-medium text-blue-400 mb-1">
          College ID *
        </label>
        <input
          id="college_id"
          type="text"
          required
          value={form.college_id}
          onChange={e => setForm({ ...form, college_id: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500"
          placeholder="Enter your college ID"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-blue-400 mb-1">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500"
          placeholder="Enter your email address"
        />
      </div>

      {error && (
        <div className="bg-red-900/50 text-red-400 p-3 rounded-lg text-sm border border-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
          loading
            ? 'bg-blue-900 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        } transition-all duration-300 transform hover:scale-105`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
            Registering...
          </div>
        ) : (
          'Register for Event'
        )}
      </button>

      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <h3 className="text-sm font-medium text-blue-400 mb-2">Important Notes:</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Please provide accurate information</li>
          <li>• You will receive an OTP at the provided email address</li>
          <li>• Keep your OTP secure and do not share it with others</li>
          <li>• You must be present at the event to use your OTP</li>
        </ul>
      </div>
    </form>
  );
} 