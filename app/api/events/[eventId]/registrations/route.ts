import { NextResponse } from 'next/server';
import { getDataStore } from '@/lib/dataStore';

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = params;
    const dataStore = getDataStore();
    const events = dataStore.getEvents();
    const event = events.find(e => e._id === eventId);

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event.registrations || []);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 