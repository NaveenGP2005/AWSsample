import { NextResponse } from 'next/server';
import { getDataStore } from '@/lib/dataStore';

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { otp } = await request.json();
    const { eventId } = params;

    if (!otp) {
      return NextResponse.json(
        { message: 'OTP is required' },
        { status: 400 }
      );
    }

    const dataStore = getDataStore();
    const events = dataStore.getEvents();
    const event = events.find(e => e._id === eventId);

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    // Find registration with matching OTP
    const registration = event.registrations?.find(r => r.otp === otp);

    if (!registration) {
      return NextResponse.json(
        { message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    if (!registration.checkedIn) {
      return NextResponse.json(
        { message: 'Please check in first before checking out' },
        { status: 400 }
      );
    }

    if (registration.checkedOut) {
      return NextResponse.json(
        { message: 'Already checked out' },
        { status: 400 }
      );
    }

    // Update registration status
    registration.checkedOut = true;
    registration.checkoutTime = new Date().toISOString();

    // Save updated data
    dataStore.saveEvents(events);

    return NextResponse.json(
      { message: 'Checkout successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 