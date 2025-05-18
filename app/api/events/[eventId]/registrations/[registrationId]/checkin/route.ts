import { NextResponse } from 'next/server';
import { getDataStore } from '@/lib/dataStore';

export async function POST(
  request: Request,
  { params }: { params: { eventId: string; registrationId: string } }
) {
  try {
    const { eventId, registrationId } = params;
    const dataStore = getDataStore();
    const events = dataStore.getEvents();
    const event = events.find(e => e._id === eventId);

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    const registration = event.registrations?.find(r => r._id === registrationId);

    if (!registration) {
      return NextResponse.json(
        { message: 'Registration not found' },
        { status: 404 }
      );
    }

    if (registration.checkedIn) {
      return NextResponse.json(
        { message: 'Already checked in' },
        { status: 400 }
      );
    }

    // Update registration status
    registration.checkedIn = true;
    registration.checkInTime = new Date().toISOString();

    // Save updated data
    dataStore.saveEvents(events);

    return NextResponse.json(
      { message: 'Check-in successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 