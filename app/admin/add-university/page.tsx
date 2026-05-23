'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowLeft, Building2, Globe, MapPin, BookOpen,
  GraduationCap, BarChart3, Star, Plus, Trash2,
  Send, Save, ChevronRight, Image as ImageIcon,
  FlaskConical, Trophy, Eye, EyeOff,
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Requirement { sat_range: string; act_range: string; min_ielts: string; min_gpa: string; acceptance_rate: string; }
interface Stat { enrollment: string; acceptance_rate: string; student_faculty_ratio: string; }
interface Department { name: string; description: string; }
interface Program { name: string; }
interface GlobalImpact { description: string; }

const TIERS = ['Low', 'Mid-Low', 'Mid', 'Mid-High', 'Top'];
const TYPES = ['Public', 'Private', 'Private Non-Profit', 'Research Institution'];
const REGIONS = ['North America', 'Europe', 'Asia', 'Oceania', 'Latin America', 'Middle East', 'Africa'];

const STEPS = [
  { id: 'basic', label: 'Basic Info', icon: Building2 },
  { id: 'media', label: 'Media', icon: ImageIcon },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'admissions', label: 'Admissions', icon: GraduationCap },
  { id: 'academics', label: 'Academics', icon: BookOpen },
  { id: 'impact', label: 'Impact', icon: Globe },
];

// ─── Small helpers ────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant/15 bg-surface-container/40">
        <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-sm font-semibold text-on-surface tracking-wide">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
        {label}{required && <span className="text-error ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-on-surface-variant/60">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full bg-surface-container rounded-xl border border-outline-variant/30 px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/60 transition-all";
const textareaCls = inputCls + " resize-none";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminAddUniversityPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Basic
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [tier, setTier] = useState('');
  const [type, setType] = useState('');
  const [motto, setMotto] = useState('');
  const [founded, setFounded] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');

  // Media
  const [heroImage, setHeroImage] = useState('');
  const [logo, setLogo] = useState('');

  // Stats
  const [stat, setStat] = useState<Stat>({ enrollment: '', acceptance_rate: '', student_faculty_ratio: '' });

  // Admissions
  const [req, setReq] = useState<Requirement>({ sat_range: '', act_range: '', min_ielts: '', min_gpa: '', acceptance_rate: '' });

  // Academics
  const [departments, setDepartments] = useState<Department[]>([{ name: '', description: '' }]);
  const [programs, setPrograms] = useState<Program[]>([{ name: '' }]);

  // Impact
  const [impact, setImpact] = useState<GlobalImpact>({ description: '' });

  // ── helpers ──
  function handleNameChange(val: string) {
    setName(val);
    if (!slugManual) setSlug(slugify(val));
  }

  function addDept() { setDepartments(d => [...d, { name: '', description: '' }]); }
  function removeDept(i: number) { setDepartments(d => d.filter((_, idx) => idx !== i)); }
  function updateDept(i: number, field: keyof Department, val: string) {
    setDepartments(d => d.map((dep, idx) => idx === i ? { ...dep, [field]: val } : dep));
  }

  function addProgram() { setPrograms(p => [...p, { name: '' }]); }
  function removeProgram(i: number) { setPrograms(p => p.filter((_, idx) => idx !== i)); }
  function updateProgram(i: number, val: string) {
    setPrograms(p => p.map((prog, idx) => idx === i ? { name: val } : prog));
  }

  // ── submit ──
  async function handleSubmit() {
    setError('');
    if (!name || !slug || !city || !country || !tier || !type) {
      setError('Please fill in all required fields (Basic Info tab).');
      setStep(0);
      return;
    }
    setLoading(true);

    const { data: uni, error: uniErr } = await supabase
      .from('university')
      .insert({ name, slug, city, country, region, tier, type, motto, founded: founded ? parseInt(founded) : null, website, description, details, hero_image: heroImage, logo })
      .select('id')
      .single();

    if (uniErr || !uni) { setError(uniErr?.message ?? 'Failed to create university.'); setLoading(false); return; }

    const uid = uni.id;

    await Promise.all([
      supabase.from('stats').insert({ university_id: uid, enrollment: stat.enrollment ? parseInt(stat.enrollment) : null, acceptance_rate: stat.acceptance_rate, student_faculty_ratio: stat.student_faculty_ratio }),
      supabase.from('requirements').insert({ university_id: uid, ...req, min_ielts: req.min_ielts ? parseFloat(req.min_ielts) : null, min_gpa: req.min_gpa ? parseFloat(req.min_gpa) : null, acceptance_rate: req.acceptance_rate ? parseFloat(req.acceptance_rate) : null }),
      ...departments.filter(d => d.name).map(d => supabase.from('departments').insert({ university_id: uid, ...d })),
      ...programs.filter(p => p.name).map(p => supabase.from('programs').insert({ university_id: uid, name: p.name })),
      supabase.from('global_impact').insert({ university_id: uid, description: impact.description }),
    ]);

    setLoading(false);
    router.push('/admin/universities');
  }

  const stepContent = [
    // 0 — Basic Info
    <div key="basic" className="flex flex-col gap-5">
      <SectionCard title="Identity" icon={Building2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="University Name" required>
            <input className={inputCls} value={name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Stanford University" />
          </Field>
          <Field label="URL Slug" required hint="Auto-generated from name; edit to override">
            <input className={inputCls} value={slug}
              onChange={e => { setSlug(slugify(e.target.value)); setSlugManual(true); }}
              placeholder="stanford-university" />
          </Field>
          <Field label="Motto">
            <input className={inputCls} value={motto} onChange={e => setMotto(e.target.value)} placeholder="Die Luft der Freiheit weht" />
          </Field>
          <Field label="Founded Year">
            <input className={inputCls} type="number" value={founded} onChange={e => setFounded(e.target.value)} placeholder="1885" />
          </Field>
          <Field label="Type" required>
            <select className={inputCls} value={type} onChange={e => setType(e.target.value)}>
              <option value="" disabled>Select type</option>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Tier" required>
            <select className={inputCls} value={tier} onChange={e => setTier(e.target.value)}>
              <option value="" disabled>Select tier</option>
              {TIERS.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Website">
            <input className={inputCls} type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://www.stanford.edu" />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Location" icon={MapPin}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="City" required>
            <input className={inputCls} value={city} onChange={e => setCity(e.target.value)} placeholder="Stanford" />
          </Field>
          <Field label="Country" required>
            <input className={inputCls} value={country} onChange={e => setCountry(e.target.value)} placeholder="United States" />
          </Field>
          <Field label="Region">
            <select className={inputCls} value={region} onChange={e => setRegion(e.target.value)}>
              <option value="" disabled>Select region</option>
              {REGIONS.map(r => <option key={r}>{r}</option>)}
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Description" icon={BookOpen}>
        <div className="flex flex-col gap-4">
          <Field label="Short Description" hint="Shown on the university listing card">
            <textarea className={textareaCls} rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief 1-2 sentence summary..." />
          </Field>
          <Field label="Full Details" hint="Shown on the university detail page (institutional profile)">
            <textarea className={textareaCls} rows={6} value={details} onChange={e => setDetails(e.target.value)} placeholder="Detailed institutional profile..." />
          </Field>
        </div>
      </SectionCard>
    </div>,

    // 1 — Media
    <div key="media" className="flex flex-col gap-5">
      <SectionCard title="Hero Image" icon={ImageIcon}>
        <Field label="Hero Image URL (Cloudinary)" hint="Upload to Cloudinary and paste the URL here">
          <input className={inputCls} type="url" value={heroImage} onChange={e => setHeroImage(e.target.value)} placeholder="https://res.cloudinary.com/..." />
        </Field>
        {heroImage && (
          <div className="mt-3 rounded-xl overflow-hidden h-48 border border-outline-variant/20">
            <img src={heroImage} alt="Hero preview" className="w-full h-full object-cover" />
          </div>
        )}
        {!heroImage && (
          <div className="mt-3 rounded-xl h-32 bg-surface-container flex items-center justify-center border border-dashed border-outline-variant/40">
            <div className="text-center text-on-surface-variant/40">
              <ImageIcon className="w-8 h-8 mx-auto mb-1" />
              <p className="text-xs">Hero image preview</p>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard title="University Logo" icon={Star}>
        <Field label="Logo URL (Cloudinary)" hint="Upload to Cloudinary and paste the URL here">
          <input className={inputCls} type="url" value={logo} onChange={e => setLogo(e.target.value)} placeholder="https://res.cloudinary.com/..." />
        </Field>
        {logo && (
          <div className="mt-3 w-24 h-24 rounded-xl bg-white border border-outline-variant/20 flex items-center justify-center p-3 shadow-sm">
            <img src={logo} alt="Logo preview" className="w-full h-full object-contain" />
          </div>
        )}
        {!logo && (
          <div className="mt-3 w-24 h-24 rounded-xl bg-surface-container flex items-center justify-center border border-dashed border-outline-variant/40">
            <Star className="w-6 h-6 text-on-surface-variant/30" />
          </div>
        )}
      </SectionCard>
    </div>,

    // 2 — Stats
    <div key="stats" className="flex flex-col gap-5">
      <SectionCard title="Institution Statistics" icon={BarChart3}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Total Enrollment">
            <input className={inputCls} type="number" value={stat.enrollment} onChange={e => setStat(s => ({ ...s, enrollment: e.target.value }))} placeholder="17,000" />
          </Field>
          <Field label="Acceptance Rate" hint="e.g. 4% or 3.68%">
            <input className={inputCls} value={stat.acceptance_rate} onChange={e => setStat(s => ({ ...s, acceptance_rate: e.target.value }))} placeholder="3.68%" />
          </Field>
          <Field label="Student-Faculty Ratio" hint="e.g. 5:1">
            <input className={inputCls} value={stat.student_faculty_ratio} onChange={e => setStat(s => ({ ...s, student_faculty_ratio: e.target.value }))} placeholder="5:1" />
          </Field>
        </div>
      </SectionCard>
    </div>,

    // 3 — Admissions
    <div key="admissions" className="flex flex-col gap-5">
      <SectionCard title="Admission Requirements" icon={GraduationCap}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="SAT Range">
            <input className={inputCls} value={req.sat_range} onChange={e => setReq(r => ({ ...r, sat_range: e.target.value }))} placeholder="1500-1570" />
          </Field>
          <Field label="ACT Range">
            <input className={inputCls} value={req.act_range} onChange={e => setReq(r => ({ ...r, act_range: e.target.value }))} placeholder="34-36" />
          </Field>
          <Field label="Minimum IELTS">
            <input className={inputCls} type="number" step="0.5" value={req.min_ielts} onChange={e => setReq(r => ({ ...r, min_ielts: e.target.value }))} placeholder="7.0" />
          </Field>
          <Field label="Minimum GPA">
            <input className={inputCls} type="number" step="0.1" value={req.min_gpa} onChange={e => setReq(r => ({ ...r, min_gpa: e.target.value }))} placeholder="3.9" />
          </Field>
          <Field label="Acceptance Rate (%)">
            <input className={inputCls} type="number" step="0.01" value={req.acceptance_rate} onChange={e => setReq(r => ({ ...r, acceptance_rate: e.target.value }))} placeholder="3.68" />
          </Field>
        </div>
      </SectionCard>
    </div>,

    // 4 — Academics
    <div key="academics" className="flex flex-col gap-5">
      <SectionCard title="Departments" icon={FlaskConical}>
        <div className="flex flex-col gap-3">
          {departments.map((dept, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-surface-container border border-outline-variant/20 relative group">
              <input className={inputCls} value={dept.name} onChange={e => updateDept(i, 'name', e.target.value)} placeholder="Department name" />
              <input className={inputCls} value={dept.description} onChange={e => updateDept(i, 'description', e.target.value)} placeholder="Short description" />
              {departments.length > 1 && (
                <button onClick={() => removeDept(i)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-error/10 text-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button onClick={addDept} className="flex items-center gap-2 text-sm text-primary font-medium py-2 px-4 rounded-xl border border-dashed border-primary/40 hover:bg-secondary/5 transition-colors w-fit">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Programs" icon={Trophy}>
        <div className="flex flex-col gap-3">
          {programs.map((prog, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <input className={inputCls} value={prog.name} onChange={e => updateProgram(i, e.target.value)} placeholder="e.g. Computer Science B.Sc." />
              {programs.length > 1 && (
                <button onClick={() => removeProgram(i)} className="flex-shrink-0 w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
          <button onClick={addProgram} className="flex items-center gap-2 text-sm text-primary font-medium py-2 px-4 rounded-xl border border-dashed border-primary/40 hover:bg-secondary/5 transition-colors w-fit">
            <Plus className="w-4 h-4" /> Add Program
          </button>
        </div>
      </SectionCard>
    </div>,

    // 5 — Impact
    <div key="impact" className="flex flex-col gap-5">
      <SectionCard title="Global Impact" icon={Globe}>
        <Field label="Global Impact Description" hint="Shown in the Global Impact section of the university detail page">
          <textarea className={textareaCls} rows={5} value={impact.description} onChange={e => setImpact({ description: e.target.value })} placeholder="Describe the university's global impact on research, alumni networks, innovation, and community..." />
        </Field>
      </SectionCard>

      {/* Summary before publish */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6">
        <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-4">Publish Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          {[
            ['Name', name || '—'],
            ['Slug', slug || '—'],
            ['City', city || '—'],
            ['Country', country || '—'],
            ['Tier', tier || '—'],
            ['Type', type || '—'],
            ['Departments', departments.filter(d => d.name).length.toString()],
            ['Programs', programs.filter(p => p.name).length.toString()],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-xs text-on-surface-variant/60 uppercase tracking-wide">{label}</span>
              <span className="font-medium text-on-surface truncate">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-surface-container-lowest/95 backdrop-blur border-b border-outline-variant/20 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/universities" className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-xs text-on-surface-variant">Universities / <span className="text-on-surface font-medium">Add New</span></p>
            <h1 className="text-base font-semibold text-on-surface leading-tight">Add University</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(p => !p)}
            className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant px-3 py-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container transition-colors"
          >
            {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {previewMode ? 'Hide Preview' : 'Preview'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Step tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-8 scrollbar-none">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <button
                key={s.id}
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  active ? 'bg-secondary text-on-primary shadow-sm' :
                  done ? 'bg-secondary/10 text-primary' :
                  'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {s.label}
                {done && <span className="text-[10px]">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-error-container text-on-error-container text-sm rounded-xl px-4 py-3 border border-error/20">
            {error}
          </div>
        )}

        {/* Step content */}
        <div className="mb-8">{stepContent[step]}</div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className={`rounded-full transition-all ${i === step ? 'w-5 h-2 bg-secondary' : 'w-2 h-2 bg-outline-variant'}`} />
            ))}
          </div>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-on-secondary text-sm font-semibold hover:bg-secondary/90 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Save Draft
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-secondary text-on-primary text-sm font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Send className="w-4 h-4" /> {loading ? 'Publishing...' : 'Publish University'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}