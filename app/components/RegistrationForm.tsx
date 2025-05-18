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
      <div className="bg-white rounded-lg p-6 text-center">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
        <p className="text-gray-600 mb-4">
          Thank you for registering. Please check your email for further instructions.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Register Another Person
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Registration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="college_id" className="block text-sm font-medium text-gray-700 mb-1">
            College ID *
          </label>
          <input
            id="college_id"
            type="text"
            required
            value={form.college_id}
            onChange={e => setForm({ ...form, college_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your college ID"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email address"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
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
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Important Notes:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Please provide accurate information</li>
          <li>• You will receive an OTP at the provided email address</li>
          <li>• Keep your OTP secure and do not share it with others</li>
          <li>• You must be present at the event to use your OTP</li>
        </ul>
      </div>
    </div>
  );
} 