// app/events/page.tsx
import EventsPage from '@/components/eventsPage';

export const dynamic = 'force-dynamic';

export default function Events() {
  return (
    <main className="pt-20">
      <EventsPage />
    </main>
  );
}