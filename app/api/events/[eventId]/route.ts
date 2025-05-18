import { NextResponse } from 'next/server';
import { getEvents, saveEvents } from '@/app/lib/data';

export async function PUT(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const eventId = params.eventId;
    const eventData = await request.json();
    const events = getEvents();
    const eventIndex = events.findIndex((e: any) => e._id === eventId);

    if (eventIndex === -1) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    events[eventIndex] = {
      ...events[eventIndex],
      ...eventData,
      _id: eventId, // Preserve the original ID
    };

    saveEvents(events);
    return NextResponse.json(events[eventIndex]);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error updating event" },
      { status: 500 }
    );
  }
} 