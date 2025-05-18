import { NextResponse } from 'next/server';
import { getEvents, addEvent } from '@/app/lib/data';

// GET /api/events
export async function GET() {
  const events = getEvents();
  return NextResponse.json(events);
}

// POST /api/events
export async function POST(request: Request) {
  const eventData = await request.json();
  const newEvent = addEvent(eventData);
  return NextResponse.json(newEvent);
} 