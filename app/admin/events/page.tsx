import { createClient } from '@/lib/supabase/server';
import EventsAdminPage from '@/components/eventsAdminPage';

export default async function Page() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });

  return <EventsAdminPage events={events || []} />;
}