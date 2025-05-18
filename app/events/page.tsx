import Link from 'next/link';
import { getEvents } from '@/app/lib/data';

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event: any) => (
          <Link 
            href={`/events/${event._id}`}
            key={event._id}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{event.name}</h2>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(event.date).toLocaleDateString()}</span>
                <span>{event.location}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No events available at the moment.</p>
        </div>
      )}
    </div>
  );
} 