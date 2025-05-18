import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'events.json');

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// Initialize the events file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

export function getEvents() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading events:', error);
    return [];
  }
}

export function saveEvents(events: any[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Error saving events:', error);
  }
}

export function addEvent(event: any) {
  const events = getEvents();
  const newEvent = {
    _id: Date.now().toString(),
    ...event,
    registrations: [],
    createdAt: new Date().toISOString(),
  };
  events.push(newEvent);
  saveEvents(events);
  return newEvent;
}

export function addRegistration(eventId: string, registrationData: any) {
  const events = getEvents();
  const eventIndex = events.findIndex((e: any) => e._id === eventId);

  if (eventIndex === -1) {
    throw new Error('Event not found');
  }

  const newRegistration = {
    _id: Date.now().toString(),
    ...registrationData,
    checkedIn: false,
    checkedOut: false,
    check_in_time: null,
    check_out_time: null,
    createdAt: new Date().toISOString(),
  };

  events[eventIndex].registrations.push(newRegistration);
  saveEvents(events);
  return newRegistration;
} 