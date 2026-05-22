'use client';

import { createClient } from '@/lib/supabase/client';
import { CalendarDays, MapPin, Pencil, Trash2, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface EventType {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  image_url: string;
  is_active: boolean;
  priority: boolean;
}

export default function EventsAdminPage({
  events,
}: {
  events: EventType[];
}) {
  const supabase = createClient();
  const router = useRouter();

  async function toggleActive(id: string, value: boolean) {
    await supabase
      .from('events')
      .update({ is_active: !value })
      .eq('id', id);

    router.refresh();
  }

  async function toggleFeatured(id: string, value: boolean) {
    await supabase
      .from('events')
      .update({ priority: !value })
      .eq('id', id);

    router.refresh();
  }

  async function deleteEvent(id: string) {
    const confirmDelete = confirm(
      'Are you sure you want to delete this event?'
    );

    if (!confirmDelete) return;

    await supabase.from('events').delete().eq('id', id);

    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface-container-low p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-on-surface-variant uppercase tracking-widest">
            Admin Panel
          </p>

          <h1 className="text-3xl font-display text-primary">
            Events Management
          </h1>
        </div>

        <Link
          href="/admin/host-events"
          className="text-white border px-5 py-2.5 rounded-xl"
        >
          Add Event
        </Link>
      </div>

      <div className="grid gap-5">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Image */}
              <div className="lg:col-span-3 h-60">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="lg:col-span-9 p-6 flex flex-col">
                
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-secondary text-on-secondary text-xs font-semibold px-2 py-1 rounded-full">
                        {event.category}
                      </span>

                      {event.priority && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Featured
                        </span>
                      )}

                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          event.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {event.is_active ? 'Live' : 'Draft'}
                      </span>
                    </div>

                    <h2 className="text-2xl font-display text-primary mb-3">
                      {event.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {event.date}
                      </div>

                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[160px]">
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-white"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        toggleActive(event.id, event.is_active)
                      }
                      className="px-4 py-2 rounded-xl border"
                    >
                      {event.is_active ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      onClick={() =>
                        toggleFeatured(event.id, event.priority)
                      }
                      className="px-4 py-2 rounded-xl border"
                    >
                      {event.priority
                        ? 'Remove Featured'
                        : 'Make Featured'}
                    </button>

                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!events.length && (
          <div className="text-center py-20 text-on-surface-variant">
            No events found.
          </div>
        )}
      </div>
    </div>
  );
}