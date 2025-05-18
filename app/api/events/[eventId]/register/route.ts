import { NextResponse } from 'next/server';
import { addRegistration } from '@/app/lib/data';

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const eventId = params.eventId;
    const registrationData = await request.json();
    const newRegistration = addRegistration(eventId, registrationData);
    return NextResponse.json(newRegistration);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error registering for event" },
      { status: 404 }
    );
  }
} 