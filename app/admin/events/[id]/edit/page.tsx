import { createClient } from '@/lib/supabase/server';
import AdminEditEventPage from '@/components/admin/adminEditEventPage';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (!event) return notFound();

  return <AdminEditEventPage event={event} />;
}