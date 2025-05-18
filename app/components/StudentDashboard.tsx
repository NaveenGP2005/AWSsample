import { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";
import { Event } from "@/types/event";
import Link from "next/link";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // const res = await fetch("http://localhost:3000/backend/events"); // Change URL
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          <div className="mt-4">
            <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Register for an Event
            </Link>
          </div>
        </>
      )}
    </div>
  );
}