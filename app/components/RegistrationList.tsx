'use client';

import { useEffect, useState } from "react";

interface Registration {
  _id: string;
  name: string;
  email: string;
  phone: string;
  checkedIn: boolean;
  checkedOut: boolean;
  checkInTime?: string;
  checkoutTime?: string;
  otp?: string;
}

interface RegistrationListProps {
  eventId: string;
}

export default function RegistrationList({ eventId }: RegistrationListProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, [eventId]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/events/${eventId}/registrations`);
      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (registrationId: string) => {
    if (processingId) return; // Prevent multiple simultaneous requests
    
    try {
      setProcessingId(registrationId);
      setError("");
      setSuccessMessage("");

      const response = await fetch(`/api/events/${eventId}/registrations/${registrationId}/checkin`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check in');
      }

      setSuccessMessage('Check-in successful!');
      await fetchRegistrations(); // Refresh the list
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to check in');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-400 bg-red-900/50 rounded-lg border border-red-700">
        {error}
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="p-4 text-gray-400 bg-gray-800/50 rounded-lg border border-gray-700">
        No registrations found for this event.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="p-4 text-green-400 bg-green-900/50 rounded-lg border border-green-700">
          {successMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {registrations.map((registration) => (
          <div
            key={registration._id}
            className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-white">{registration.name}</h4>
                <p className="text-sm text-gray-400">{registration.email}</p>
                <p className="text-sm text-gray-400">{registration.phone}</p>
              </div>
              <div className="flex items-center space-x-2">
                {registration.checkedIn ? (
                  <span className="px-2 py-1 text-xs font-medium text-green-400 bg-green-900/50 rounded-full border border-green-700">
                    Checked In
                  </span>
                ) : registration.checkedOut ? (
                  <span className="px-2 py-1 text-xs font-medium text-gray-400 bg-gray-900/50 rounded-full border border-gray-700">
                    Checked Out
                  </span>
                ) : (
                  <button
                    onClick={() => handleCheckIn(registration._id)}
                    disabled={processingId === registration._id}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      processingId === registration._id
                        ? 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed'
                        : 'text-blue-400 bg-blue-900/50 border-blue-700 hover:bg-blue-800/50'
                    }`}
                  >
                    {processingId === registration._id ? 'Processing...' : 'Check In'}
                  </button>
                )}
              </div>
            </div>
            {registration.checkInTime && (
              <p className="mt-2 text-xs text-gray-500">
                Checked in: {new Date(registration.checkInTime).toLocaleString()}
              </p>
            )}
            {registration.checkoutTime && (
              <p className="mt-1 text-xs text-gray-500">
                Checked out: {new Date(registration.checkoutTime).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
