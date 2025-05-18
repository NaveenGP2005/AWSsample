'use client';

import { useEffect, useState } from "react";
import EventForm from "./EventForm";
import RegistrationList from "./RegistrationList";
import OTPCheckout from "./OTPCheckout";

interface Event {
  _id: string;
  title: string;
  description: string;
  datetime: string;
  venue: string;
  maxParticipants?: string;
  registrations: any[];
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    checkedIn: 0,
    checkedOut: 0
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
      if (data.length > 0) {
        setSelectedEvent(data[0]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateOTP = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/generate-otp`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate OTPs');
      }
      
      alert("OTPs have been generated and sent to all registrants!");
      fetchEvents();
    } catch (error) {
      alert("Error generating OTPs. Please try again.");
    }
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setShowCheckout(false);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
  };

  const handleEventUpdated = () => {
    setEditingEvent(null);
    fetchEvents();
  };

  const updateStats = (event: Event) => {
    const total = event.registrations?.length || 0;
    const checkedIn = event.registrations?.filter(r => r.checkedIn)?.length || 0;
    const checkedOut = event.registrations?.filter(r => r.checkedOut)?.length || 0;
    setStats({ totalRegistrations: total, checkedIn, checkedOut });
  };

  useEffect(() => {
    if (selectedEvent) {
      updateStats(selectedEvent);
    }
  }, [selectedEvent]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Event Management
              </h1>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v3a1 1 0 102 0V9z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Creation Form */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h2>
          {editingEvent ? (
            <EventForm 
              onEventCreated={handleEventUpdated} 
              eventToEdit={editingEvent}
              onCancel={() => setEditingEvent(null)}
            />
          ) : (
            <EventForm onEventCreated={fetchEvents} />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Events Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                Events
              </h3>
              <div className="space-y-3">
                {events.map(event => (
                  <div
                    key={event._id}
                    className={`p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                      selectedEvent?._id === event._id
                        ? 'bg-blue-900/50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div 
                        className="flex-1"
                        onClick={() => handleEventSelect(event)}
                      >
                        <h4 className="font-medium text-white">{event.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(event.datetime).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="ml-2 p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit Event"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          {selectedEvent && (
            <div className="lg:col-span-3">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      {selectedEvent.title}
                    </h3>
                    <p className="text-gray-400 mt-1">{selectedEvent.description}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => generateOTP(selectedEvent._id)}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      Generate OTPs
                    </button>
                    <button
                      onClick={() => setShowCheckout(!showCheckout)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 4.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V4.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      {showCheckout ? 'Hide Checkout' : 'Show Checkout'}
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm text-blue-400 font-medium">Total Registrations</h4>
                        <p className="text-2xl font-bold text-blue-300 mt-1">{stats.totalRegistrations}</p>
                      </div>
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm text-green-400 font-medium">Checked In</h4>
                        <p className="text-2xl font-bold text-green-300 mt-1">{stats.checkedIn}</p>
                      </div>
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm text-purple-400 font-medium">Checked Out</h4>
                        <p className="text-2xl font-bold text-purple-300 mt-1">{stats.checkedOut}</p>
                      </div>
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout or Registration List */}
                <div className="mt-6">
                  {showCheckout ? (
                    <OTPCheckout eventId={selectedEvent._id} onCheckout={fetchEvents} />
                  ) : (
                    <RegistrationList eventId={selectedEvent._id} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
