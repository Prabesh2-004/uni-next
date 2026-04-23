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

  console.log(webEvents)

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
        <div className="bg-surface-container-lowest grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,10,30,0.12)]">
          <div className="lg:col-span-7 relative h-96 lg:h-auto overflow-hidden">
            <Image
              fill
              className="object-cover transition-transform duration-700 rounded-xl hover:scale-105"
              alt="Modern academic conference hall with warm ambient lighting and rows of intellectually engaged scholars"
              src="/classroom.jpg"
            />
          </div>
          <div className="lg:col-span-5 p-16 flex flex-col justify-center border-l-0 lg:border-l border-outline-variant/10">
            <div className="flex items-center space-x-3 text-tertiary-fixed-dim mb-6">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                Star
              </span>
              <span className="font-label text-xs uppercase tracking-widest font-bold">Featured Tradition</span>
            </div>
            <h2 className="font-display text-4xl text-primary leading-tight mb-6">Centennial Scholars Symposium</h2>
            <div className="space-y-4 mb-10 text-on-surface-variant font-light">
              <div className="flex items-center">
                <span className="material-symbols-outlined mr-3">calendar_today: </span>
                <span>October 24th — 26th, 2024</span>
              </div>
              <div className="flex items-center">
                <span className="material-symbols-outlined mr-3">location_on: </span>
                <span>Founder{"'"}s Grand Hall, North Campus</span>
              </div>
            </div>
            <p className="text-on-surface-variant leading-relaxed mb-10 font-body">
              Join us for our landmark 100th annual symposium, where world-renowned alumni and faculty converge to discuss the future of global ethics and innovation.
            </p>
            <Link
              href="/events/register?event=centennial-scholars-symposium"
              className="w-full bg-secondary text-secondary-fixed py-5 text-center font-semibold tracking-wide hover:bg-gray-800 rounded-full hover:text-on-secondary transition-colors duration-300 block"
            >
              Register Now
            </Link>
          </div>
        </div>
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
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                    activeCategory === category
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
            {filteredEvents.map((event) => (
              <div key={event.id} className="group bg-surface-container-lowest flex flex-col h-full p-3 rounded-lg hover:bg-secondary transition-colors duration-300">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    fill
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

      {/* Traditions Grid (Editorial Bento) */}
      {/* <section className="py-24 px-12 max-w-screen-2xl mx-auto">
        <h3 className="font-display text-4xl text-primary mb-12 text-center">Living Traditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px]">
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-secondary">
            <Image
              fill
              className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
              alt="Students in academic robes walking through a historic stone archway during a commencement ceremony"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUvcU4J9RV0Vfx5_jmwK2GQx_ony85xDuPkRFwAXGYaWO73HeoXVT6c4H8FworWn-hpqs2swfdnVu20GKMyZpdHSmb7i5yC5ir4_wMbTbnNcrVecpXsoanxeysg7jha4TNyzmrw2hHU0BKJfRMdonFfH-W_TiZSI-G-riJpC9YW7GsLP6exxxt325gNqt1So6SXcADz_ZgM9UkLdYBpcRuKvO4UnxOaTxt69IPa3D1f6UHTH9G5wAzoVYaB0QoqJ3hEE1VeHCW77k"
            />
            <div className="absolute bottom-10 left-10 text-white">
              <h4 className="font-display text-4xl mb-2">Convocation Day</h4>
              <p className="font-light text-on-primary-container">A centuries-old march into the future.</p>
            </div>
          </div>
          <div className="md:col-span-2 relative group overflow-hidden bg-secondary">
            <Image
              fill
              className="object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105"
              alt="Outdoor festival at night with strings of glowing lights and students enjoying live music"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjnWkxxLJqLVvAJmkbgvZ67wu3oR9O8bC34IeDQVrBKwB5VZAzyGZBfbPrT4ZOKGcC3BXsvVcaxSI9BFuj8RKUWSwb0tIhh9P3RGJia9Nsy22KNV8j0bAxRlPkuxocGLZydHi1F8MBJT-GcMqUn-duJGfIEZ6iWn0IfLsEI0CrbOyr0unBjSHzZPcc8mAQlDLBO8vxl69tSbwO1CFm2iwLrdVRxJcUc1Ci4qgcq43ALkta8Uemlam8PjNydLFOO9oFzSr59x9Hk3Y"
            />
            <div className="absolute bottom-8 left-8 text-white">
              <h4 className="font-display text-3xl mb-2">The Night Market</h4>
              <p className="font-light text-on-secondary-container">Celebrating diversity through food and craft.</p>
            </div>
          </div>
          <div className="relative group overflow-hidden bg-on-tertiary-container">
            <Image
              fill
              className="object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105"
              alt="Exciting basketball game in a packed university stadium with cheering fans"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPLJ3vkpPILEGGvlwo4e9-ygAKXSeZWjB5Cx0UR_xi2r2oeCkHI_lAZljjzfwh_g4Rfbj0rwB8ySFo44p5lsZoeAOjiPMgs_m4dxeXbnM2FEwgjODmncKmUKya3DudRvYQxLSX10qesMh51kd18yi90Yye-TmGgbkCAMGOnVdxR4McTeRifb-UPjIAEYFrpl4j2lHvvfvR6zADSuZEZGGBMVPkrdlefKvsRD1UyNULSXcM_bgZRKlRz0pUykpImxu9uzTH68NAZIo"
            />
            <div className="absolute bottom-6 left-6 text-white">
              <h4 className="font-display text-xl">Rivalry Week</h4>
            </div>
          </div>
          <div className="relative group overflow-hidden bg-primary-container">
            <Image
              fill
              className="object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105"
              alt="Calm library interior with students reading by soft green lamps"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaAo3XGm-_w-_HyMcgPLsPslVUVvZpeUWsdZbt_VeS1I96eUjLw3b7RkCCUXTkrCiCIfQnqMoSTlp3HLwzkcHAd2WS-u_Ulxsmvn2pCa3QmY3oc_po1s9NfwLwcaoVa1O6Q4m3QgYPw3OiGR2mnzl97sumHUdJqjDJ9808e9UP6mWWuuiWcSuKKWnEIWUpxEAVb15FxmRSdi3lz-_YMfLp6W7bhVIJm4siDMN-vearkw03QyKSyBXcd5h64QW0s-0pVs86WKDKsbQ"
            />
            <div className="absolute bottom-6 left-6 text-white">
              <h4 className="font-display text-xl">The Reading Quiet</h4>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  );
}