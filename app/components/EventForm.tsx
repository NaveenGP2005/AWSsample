'use client';

import { useState, useEffect } from "react";

interface EventFormProps {
  onEventCreated: () => void;
  eventToEdit?: {
    _id: string;
    title: string;
    description: string;
    datetime: string;
    venue: string;
    maxParticipants?: string;
  };
  onCancel?: () => void;
}

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  maxParticipants: string;
}

export default function EventForm({ onEventCreated, eventToEdit, onCancel }: EventFormProps) {
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    maxParticipants: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      const eventDate = new Date(eventToEdit.datetime);
      setForm({
        title: eventToEdit.title,
        description: eventToEdit.description,
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toTimeString().slice(0, 5),
        venue: eventToEdit.venue,
        maxParticipants: eventToEdit.maxParticipants || ""
      });
      setShowForm(true);
    }
  }, [eventToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const eventData = {
        ...form,
        datetime: new Date(`${form.date}T${form.time}`).toISOString()
      };

      const url = eventToEdit 
        ? `/api/events/${eventToEdit._id}`
        : '/api/events';
      
      const method = eventToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error saving event');
      }

      onEventCreated();
      if (!eventToEdit) {
        setForm({
          title: "",
          description: "",
          date: "",
          time: "",
          venue: "",
          maxParticipants: ""
        });
        setShowForm(false);
      }
    } catch (err: any) {
      setError(err.message || "Error saving event");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setShowForm(false);
    }
    if (!eventToEdit) {
      setForm({
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        maxParticipants: ""
      });
    }
  };

  if (!showForm && !eventToEdit) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-bold text-lg"
      >
        Create New Event
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 shadow-2xl border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          {eventToEdit ? 'Edit Event' : 'Create New Event'}
        </h3>
        <button
          onClick={handleCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-blue-400 mb-1">
              Event Title *
            </label>
            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-blue-400 mb-1">
              Venue *
            </label>
            <input
              id="venue"
              type="text"
              required
              value={form.venue}
              onChange={e => setForm({ ...form, venue: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500"
              placeholder="Enter venue"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-blue-400 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            required
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500"
            rows="3"
            placeholder="Enter event description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-blue-400 mb-1">
              Date *
            </label>
            <input
              id="date"
              type="date"
              required
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-blue-400 mb-1">
              Time *
            </label>
            <input
              id="time"
              type="time"
              required
              value={form.time}
              onChange={e => setForm({ ...form, time: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-blue-400 mb-1">
              Max Participants
            </label>
            <input
              id="maxParticipants"
              type="number"
              min="1"
              value={form.maxParticipants}
              onChange={e => setForm({ ...form, maxParticipants: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500"
              placeholder="Optional"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 text-red-400 p-3 rounded-lg text-sm border border-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white font-bold ${
              loading
                ? 'bg-blue-900 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            } transition-all duration-300 transform hover:scale-105`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                {eventToEdit ? 'Saving...' : 'Creating...'}
              </div>
            ) : (
              eventToEdit ? 'Save Changes' : 'Create Event'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
