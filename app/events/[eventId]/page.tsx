import RegistrationForm from '@/app/components/RegistrationForm';

interface EventPageProps {
  params: {
    eventId: string;
  };
}

export default function EventPage({ params }: EventPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <RegistrationForm eventId={params.eventId} />
    </div>
  );
} 