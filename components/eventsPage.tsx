// app/events/page.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Events {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  description: string;
  image_url: string;
  is_active: boolean;
  priority: boolean;
  location: string;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


const categories = ['All Events', 'Academic', 'Arts & Culture', 'Athletics', 'Student Life'];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState('All Events');
  const [webEvents, setWebEvents] = useState<Events[]>([]);
  const supabase = createClient()

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from('events').select('*');
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setWebEvents(data);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = activeCategory === 'All Events'
    ? webEvents
    : webEvents.filter(event => event.category === activeCategory);

  return (
    <main className="">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            fill
            className="object-cover"
            alt="Stunning architectural view of a historic university stone hall with gothic windows during a calm, overcast morning"
            src="/hero-uni.jpg"
          />
          <div className="absolute inset-0 bg-black/55"></div>
        </div>
        <div className="relative z-10 h-full max-w-screen-2xl mx-auto px-12 flex flex-col justify-center">
          <span className="inline-block text-tertiary-fixed-dim font-label text-sm uppercase tracking-[0.3em] mb-6">
            Experience the Legacy
          </span>
          <h1 className="font-display text-7xl md:text-8xl text-white leading-tight max-w-4xl -ml-1">
            University Events <br />
            <span className="italic font-light">&amp; Traditions</span>
          </h1>
          <p className="mt-8 text-on-primary-container text-xl max-w-xl leading-relaxed font-light">
            From intellectual symposia to vibrant cultural festivals, our campus events weave the fabric of the Heritage experience.
          </p>
        </div>
      </section>

      {/* Featured Event Section */}
      <section className="py-24 text-white px-12 max-w-screen-2xl mx-auto relative -mt-32 z-20">
        {filteredEvents.filter(event => event.priority).map(event => (
          <div key={event.id} className="bg-surface-container-lowest mb-5 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,10,30,0.12)]">
            <div className="lg:col-span-7 relative h-96 lg:h-auto overflow-hidden">
              <Image
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className="object-cover transition-transform duration-700 rounded-xl hover:scale-105"
                alt="Modern academic conference hall with warm ambient lighting and rows of intellectually engaged scholars"
                src={event?.image_url || 'https://i.pinimg.com/1200x/8f/af/65/8faf650f68a01329899f47cffa40ea90.jpg'}
              />
            </div>
            <div className="lg:col-span-5 p-16 flex flex-col justify-center border-l-0 lg:border-l border-outline-variant/10">
              <div className="flex items-center space-x-3 text-tertiary-fixed-dim mb-6">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  Star
                </span>
                <span className="font-label text-xs uppercase tracking-widest font-bold">{event.category}</span>
              </div>
              <h2 className="font-display text-4xl text-primary leading-tight mb-6">{event?.title}</h2>
              <div className="space-y-4 mb-10 text-on-surface-variant font-light">
                <div className="flex items-center">
                  <span className="material-symbols-outlined mr-3">Event On:</span>
                  <span>{event?.date}</span>
                </div>
                <div className="flex items-center">
                  <span className="material-symbols-outlined mr-3">location_on: </span>
                  <span>{event?.location}</span>
                </div>
              </div>
              <p className="text-on-surface-variant leading-relaxed mb-10 font-body">
                {event?.description}
              </p>
              <Link
                href={`/events/register?event=${event?.title}`}
                className="w-full bg-secondary text-secondary-fixed py-5 text-center font-semibold tracking-wide hover:bg-gray-800 rounded-full hover:text-on-secondary transition-colors duration-300 block"
              >
                Register Now
              </Link>
            </div>
          </div>

        ))}
      </section>

      {/* Event Listing Section */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-12">
          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h3 className="font-display text-5xl text-primary mb-4 italic">Upcoming Calendar</h3>
              <p className="text-on-surface-variant font-light text-lg">Curating moments of discovery and connection.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${activeCategory === category
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-container-highest text-on-surface-variant hover:bg-outline-variant'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredEvents.filter(event => event.is_active).filter(event => event.priority === false).map((event) => (
              <div key={event.id} className="group bg-surface-container-lowest flex flex-col h-full p-3 rounded-lg hover:bg-secondary transition-colors duration-300">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform rounded-lg duration-500 group-hover:scale-110"
                    alt={event.title}
                    src={event.image_url}
                  />
                  <div className="absolute top-4 left-4 bg-secondary rounded-lg px-4 py-2 text-secondary-fixed text-center">
                    <span className="block text-xl font-bold leading-none">{months[parseInt(event.date.split("-")[1]) - 1]}</span>
                    <span className="text-[10px] uppercase tracking-tighter">{event.date.split("-")[2]}</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <span className="text-tertiary-fixed-dim font-bold text-[10px] uppercase tracking-widest mb-3">
                    {event.category}
                  </span>
                  <h4 className="font-display text-2xl text-primary mb-4 leading-tight">{event.title}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-8 flex-grow">{event.description}</p>
                  <div className="flex justify-between items-center mt-auto pt-6 border-t border-outline-variant/10">
                    <span className="text-on-surface-variant text-xs font-medium flex items-center">
                      <span className="material-symbols-outlined text-sm mr-1">schedule</span> {event.time}
                    </span>
                    <Link
                      href={`/events/register?event=${encodeURIComponent(event.title)}`}
                      className="text-primary font-bold text-sm flex items-center hover:translate-x-1 transition-transform"
                    >
                      Register <span className="ml-1 text-sm"><ArrowRight /></span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-20 text-center">
            <button className="px-12 py-4 border border-outline font-medium text-primary hover:bg-secondary rounded-lg hover:text-on-secondary transition-all">
              View Full Calendar
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}