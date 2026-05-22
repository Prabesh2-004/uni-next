'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, CalendarDays, Clock, Image as ImageIcon, Info, MapPin, Send, Save, ToggleLeft, Eye } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['Academic', 'Arts & Culture', 'Athletics', 'Student Life'];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(dateStr: string) {
  if (!dateStr) return 'Date not set';
  const [y, m, d] = dateStr.split('-');
  return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

function formatTime(timeStr: string) {
  if (!timeStr) return 'Time not set';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export default function AdminAddEventPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image_url: '',
    is_active: true,
    priority: false,
  });
  console.log(form);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  async function handleSubmit(publish: boolean) {
    setError('');
    if (!form.title || !form.category || !form.date || !form.time || !form.location || !form.description || !form.image_url) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    const { error: sbError } = await supabase.from('events').insert({
      title: form.title,
      category: form.category,
      date: form.date,
      time: form.time,
      location: form.location,
      description: form.description,
      image_url: form.image_url,
      is_active: publish ? form.is_active : false,
      priority: form.priority,
    });
    setLoading(false);
    if (sbError) { setError(sbError.message); return; }
    router.push('/admin/events');
  }

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Top bar */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/20 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/events" className="text-on-surface-variant hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium">Events / Add New</p>
            <h1 className="font-display text-2xl text-primary leading-tight">Add New Event</h1>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
          form.is_active ? 'bg-green-100 text-green-700' : 'bg-surface-container text-on-surface-variant'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${form.is_active ? 'bg-green-500' : 'bg-outline'}`} />
          {form.is_active ? 'Live' : 'Draft'}
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main form */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Basic info */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
            <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-5 flex items-center gap-2">
              <Info className="w-4 h-4" /> Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Event Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="e.g. Annual Academic Symposium 2026"
                  className="w-full bg-surface-container rounded-lg border border-outline-variant/30 px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Description <span className="text-error">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Describe what attendees can expect..."
                  maxLength={300}
                  rows={4}
                  className="w-full bg-surface-container rounded-lg border border-outline-variant/30 px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                />
                <p className="text-xs text-on-surface-variant/60 text-right mt-1">{form.description.length} / 300</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Category <span className="text-error">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={e => set('category', e.target.value)}
                    className="w-full bg-surface-container rounded-lg border border-outline-variant/30 px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  >
                    <option value="" disabled>Select category</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Location <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => set('location', e.target.value)}
                    placeholder="e.g. Main Hall, Block A"
                    className="w-full bg-surface-container rounded-lg border border-outline-variant/30 px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
            <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-5 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Date &amp; Time
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Date <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => set('date', e.target.value)}
                  className="w-full bg-surface-container rounded-lg border border-outline-variant/30 px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Time <span className="text-error">*</span>
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => set('time', e.target.value)}
                  className="w-full bg-surface-container rounded-lg border border-outline-variant/30 px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
            <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-5 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Event Image
            </h2>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Image URL <span className="text-error">*</span>
              </label>
              <input
                type="url"
                value={form.image_url}
                onChange={e => set('image_url', e.target.value)}
                placeholder="https://example.com/event-image.jpg"
                className="w-full bg-surface-container rounded-lg border border-outline-variant/30 px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
            {form.image_url && (
              <div className="mt-3 rounded-lg overflow-hidden h-40 relative border border-outline-variant/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/events"
              className="px-5 py-2.5 rounded-lg border border-outline-variant/30 text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Discard
            </Link>
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-outline-variant/30 text-sm text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> Save as Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-secondary text-on-secondary text-sm font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-50 ml-auto"
            >
              <Send className="w-4 h-4" /> {loading ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="flex flex-col gap-5">

          {/* Visibility */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
            <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
              <ToggleLeft className="w-4 h-4" /> Visibility
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-on-surface">Active</p>
                  <p className="text-xs text-on-surface-variant">Show in event listings</p>
                </div>
                <button
                  onClick={() => set('is_active', !form.is_active)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.is_active ? 'bg-primary' : 'bg-outline-variant'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                <div>
                  <p className="text-sm font-medium text-on-surface">Featured</p>
                  <p className="text-xs text-on-surface-variant">Show as hero event</p>
                </div>
                <button
                  onClick={() => set('priority', !form.priority)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.priority ? 'bg-primary' : 'bg-outline-variant'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.priority ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
            <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4" /> Live Preview
            </h2>
            <div className="rounded-lg overflow-hidden h-28 bg-surface-container mb-3 relative">
              {form.image_url
                ? <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30"><ImageIcon className="w-8 h-8" /></div>
              }
              {form.category && (
                <span className="absolute top-2 left-2 bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {form.category}
                </span>
              )}
            </div>
            <p className="font-display text-base text-primary leading-snug mb-2">
              {form.title || <span className="text-on-surface-variant/40 font-body font-normal text-sm">Title will appear here</span>}
            </p>
            <div className="space-y-1 text-xs text-on-surface-variant">
              <div className="flex items-center gap-1.5"><CalendarDays className="w-3 h-3" />{formatDate(form.date)}</div>
              <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{formatTime(form.time)}</div>
              <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{form.location || 'Location not set'}</div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
            <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-4">Summary</h2>
            <div className="space-y-2 text-sm">
              {[
                ['Status', form.is_active ? 'Active' : 'Inactive'],
                ['Featured', form.priority ? 'Yes' : 'No'],
                ['Category', form.category || '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-on-surface-variant">{label}</span>
                  <span className="font-medium text-on-surface">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}