import { Event } from "@/types/event";

export default function EventCard({ event }: { event: Event }) {
    return (
        <div className="border p-4 rounded shadow mb-4 bg-white">
        <h2 className="text-xl font-semibold">{event.name}</h2>
        <p className="text-sm text-gray-500">{event.date}</p>
        <p className="mt-2">{event.description}</p>
        </div>
    );
}