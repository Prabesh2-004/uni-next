'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Trash2, Pencil, Globe, ArrowUpDown,
  ChevronLeft, ChevronRight, ExternalLink, X, Save,
  AlertTriangle, GraduationCap, MapPin, LayoutGrid, List,
} from 'lucide-react';

interface University {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  tier: string;
  type: string;
  hero_image: string;
  logo: string;
  website: string;
  description: string;
  founded: number | null;
}

const TIERS = ['Low', 'Mid-Low', 'Mid', 'Mid-High', 'Top'];
const TIER_COLORS: Record<string, string> = {
  Top: 'bg-amber-100 text-amber-800 border-amber-200',
  'Mid-High': 'bg-blue-100 text-blue-800 border-blue-200',
  Mid: 'bg-green-100 text-green-700 border-green-200',
  'Mid-Low': 'bg-orange-100 text-orange-700 border-orange-200',
  Low: 'bg-surface-container text-on-surface-variant border-outline-variant/30',
};

const PAGE_SIZE = 10;

const inputCls =
  'w-full bg-surface-container rounded-lg border border-outline-variant/30 px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all';

export default function AdminUniversitiesPage() {
  const supabase = createClient();

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [sortField, setSortField] = useState<'name' | 'tier' | 'country'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<University | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit modal
  const [editTarget, setEditTarget] = useState<University | null>(null);
  const [editForm, setEditForm] = useState<Partial<University>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // ── fetch ──────────────────────────────────────────────────────────────────
  async function fetchUniversities() {
    setLoading(true);
    const { data } = await supabase
      .from('university')
      .select('id, name, slug, city, country, tier, type, hero_image, logo, website, description, founded')
      .order('name');
    setUniversities(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchUniversities(); }, []);

  // ── derived list ───────────────────────────────────────────────────────────
  const filtered = universities
    .filter(u =>
      (tierFilter === 'All' || u.tier === tierFilter) &&
      (u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.country?.toLowerCase().includes(search.toLowerCase()) ||
        u.city?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const va = (a[sortField] ?? '').toString().toLowerCase();
      const vb = (b[sortField] ?? '').toString().toLowerCase();
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  }

  // ── delete ─────────────────────────────────────────────────────────────────
  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await supabase.from('university').delete().eq('id', deleteTarget.id);
    setUniversities(u => u.filter(x => x.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeleteLoading(false);
  }

  // ── edit ───────────────────────────────────────────────────────────────────
  function openEdit(uni: University) {
    setEditTarget(uni);
    setEditForm({ ...uni });
    setEditError('');
  }

  async function saveEdit() {
    if (!editTarget) return;
    setEditError('');
    if (!editForm.name || !editForm.slug || !editForm.city || !editForm.country) {
      setEditError('Name, slug, city and country are required.');
      return;
    }
    setEditLoading(true);
    const { error } = await supabase
      .from('university')
      .update({
        name: editForm.name,
        slug: editForm.slug,
        city: editForm.city,
        country: editForm.country,
        tier: editForm.tier,
        type: editForm.type,
        website: editForm.website,
        description: editForm.description,
        hero_image: editForm.hero_image,
        logo: editForm.logo,
        founded: editForm.founded ?? null,
      })
      .eq('id', editTarget.id);

    if (error) { setEditError(error.message); setEditLoading(false); return; }
    setUniversities(u => u.map(x => x.id === editTarget.id ? { ...x, ...editForm } as University : x));
    setEditTarget(null);
    setEditLoading(false);
  }

  // ── SortBtn ────────────────────────────────────────────────────────────────
  function SortBtn({ field, label }: { field: typeof sortField; label: string }) {
    return (
      <button onClick={() => toggleSort(field)} className="flex items-center gap-1 hover:text-primary transition-colors group">
        {label}
        <ArrowUpDown className={`w-3 h-3 transition-colors ${sortField === field ? 'text-primary' : 'text-on-surface-variant/40 group-hover:text-primary/60'}`} />
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Header */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium">Admin / Universities</p>
            <h1 className="text-xl font-semibold text-on-surface mt-0.5">Universities</h1>
          </div>
          <Link
            href="/admin/add-university"
            className="flex items-center gap-2 bg-secondary text-on-primary px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add University
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-5">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name, city, country..."
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Tier filters */}
            {['All', ...TIERS].map(t => (
              <button
                key={t}
                onClick={() => { setTierFilter(t); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  tierFilter === t
                    ? 'bg-secondary text-on-primary border-primary'
                    : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {t}
              </button>
            ))}

            {/* View toggle */}
            <div className="flex items-center border border-outline-variant/30 rounded-lg overflow-hidden ml-1">
              <button onClick={() => setViewMode('table')} className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-secondary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}>
                <List className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-secondary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}>
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Count */}
        <p className="text-xs text-on-surface-variant">
          {loading ? 'Loading...' : `${filtered.length} universit${filtered.length === 1 ? 'y' : 'ies'} found`}
        </p>

        {/* ── TABLE VIEW ────────────────────────────────────────────────────── */}
        {viewMode === 'table' && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-8">#</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      <SortBtn field="name" label="University" />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      <SortBtn field="country" label="Location" />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      <SortBtn field="tier" label="Tier" />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Type</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 bg-surface-container rounded animate-pulse" style={{ width: `${60 + (i * j * 7) % 30}%` }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-on-surface-variant/50">
                        <GraduationCap className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No universities found</p>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((uni, i) => (
                      <tr key={uni.id} className="hover:bg-surface-container/30 transition-colors group">
                        <td className="px-4 py-3 text-xs text-on-surface-variant/50 tabular-nums">
                          {(page - 1) * PAGE_SIZE + i + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden flex-shrink-0 border border-outline-variant/20">
                              {uni.logo
                                ? <img src={uni.logo} alt="" className="w-full h-full object-contain p-1" />
                                : <GraduationCap className="w-4 h-4 text-on-surface-variant/40" />
                              }
                            </div>
                            <div>
                              <p className="font-medium text-on-surface">{uni.name}</p>
                              <p className="text-xs text-on-surface-variant/60">/{uni.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                            <MapPin className="w-3 h-3" />
                            {uni.city}, {uni.country}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${TIER_COLORS[uni.tier] ?? 'bg-surface-container text-on-surface-variant border-outline-variant/20'}`}>
                            {uni.tier}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-on-surface-variant">{uni.type}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {uni.website && (
                              <a href={uni.website} target="_blank" rel="noreferrer"
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors" title="Visit website">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <Link href={`/universities/${uni.slug}`} target="_blank"
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors" title="View page">
                              <Globe className="w-3.5 h-3.5" />
                            </Link>
                            <button onClick={() => openEdit(uni)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-primary hover:bg-secondary/10 transition-colors" title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteTarget(uni)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-error hover:bg-error/10 transition-colors" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── GRID VIEW ─────────────────────────────────────────────────────── */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden animate-pulse">
                    <div className="h-36 bg-surface-container" />
                    <div className="p-4 flex flex-col gap-2">
                      <div className="h-4 bg-surface-container rounded w-3/4" />
                      <div className="h-3 bg-surface-container rounded w-1/2" />
                    </div>
                  </div>
                ))
              : paginated.map(uni => (
                  <div key={uni.id} className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-36 bg-surface-container overflow-hidden">
                      {uni.hero_image
                        ? <img src={uni.hero_image} alt={uni.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center"><GraduationCap className="w-10 h-10 text-on-surface-variant/20" /></div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button onClick={() => openEdit(uni)} className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-primary hover:bg-white transition-colors shadow-sm">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(uni)} className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-error hover:bg-white transition-colors shadow-sm">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-xs font-semibold border ${TIER_COLORS[uni.tier] ?? ''}`}>
                        {uni.tier}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start gap-2 mb-1">
                        {uni.logo && <img src={uni.logo} alt="" className="w-6 h-6 object-contain flex-shrink-0 mt-0.5" />}
                        <p className="font-semibold text-on-surface text-sm leading-snug">{uni.name}</p>
                      </div>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" /> {uni.city}, {uni.country}
                      </p>
                      <p className="text-xs text-on-surface-variant/70 line-clamp-2">{uni.description}</p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-outline-variant/15">
                        <Link href={`/universities/${uni.slug}`} target="_blank" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                          <Globe className="w-3 h-3" /> View
                        </Link>
                        {uni.website && (
                          <a href={uni.website} target="_blank" rel="noreferrer" className="text-xs text-on-surface-variant hover:underline flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        )}

        {/* Pagination */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-on-surface-variant">
              Page {page} of {totalPages} · {filtered.length} total
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                  if (idx > 0 && typeof arr[idx - 1] === 'number' && (n as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) =>
                  n === '...'
                    ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-on-surface-variant">…</span>
                    : <button key={n} onClick={() => setPage(n as number)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${page === n ? 'bg-secondary text-on-primary' : 'border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'}`}>
                        {n}
                      </button>
                )
              }
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── DELETE MODAL ────────────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error/10 mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>
            <h2 className="text-base font-semibold text-on-surface text-center mb-1">Delete University</h2>
            <p className="text-sm text-on-surface-variant text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-on-surface">{deleteTarget.name}</span>? This will also remove all related stats, departments, programs, and requirements.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface-variant hover:bg-surface-container transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-error text-on-error text-sm font-semibold hover:bg-error/90 transition-colors disabled:opacity-60">
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ──────────────────────────────────────────────────────── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditTarget(null)} />
          <div className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant/20 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="text-base font-semibold text-on-surface">Edit University</h2>
                <p className="text-xs text-on-surface-variant">{editTarget.name}</p>
              </div>
              <button onClick={() => setEditTarget(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {editError && (
                <div className="bg-error-container text-on-error-container text-xs rounded-lg px-3 py-2 border border-error/20">
                  {editError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Name <span className="text-error">*</span></label>
                  <input className={inputCls} value={editForm.name ?? ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Slug <span className="text-error">*</span></label>
                  <input className={inputCls} value={editForm.slug ?? ''} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Website</label>
                  <input className={inputCls} type="url" value={editForm.website ?? ''} onChange={e => setEditForm(f => ({ ...f, website: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">City <span className="text-error">*</span></label>
                  <input className={inputCls} value={editForm.city ?? ''} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Country <span className="text-error">*</span></label>
                  <input className={inputCls} value={editForm.country ?? ''} onChange={e => setEditForm(f => ({ ...f, country: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tier</label>
                  <select className={inputCls} value={editForm.tier ?? ''} onChange={e => setEditForm(f => ({ ...f, tier: e.target.value }))}>
                    <option value="" disabled>Select tier</option>
                    {TIERS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Type</label>
                  <input className={inputCls} value={editForm.type ?? ''} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Founded</label>
                  <input className={inputCls} type="number" value={editForm.founded ?? ''} onChange={e => setEditForm(f => ({ ...f, founded: e.target.value ? parseInt(e.target.value) : null }))} />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Hero Image URL</label>
                  <input className={inputCls} type="url" value={editForm.hero_image ?? ''} onChange={e => setEditForm(f => ({ ...f, hero_image: e.target.value }))} placeholder="https://res.cloudinary.com/..." />
                  {editForm.hero_image && (
                    <div className="h-28 rounded-lg overflow-hidden border border-outline-variant/20 mt-1">
                      <img src={editForm.hero_image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Logo URL</label>
                  <input className={inputCls} type="url" value={editForm.logo ?? ''} onChange={e => setEditForm(f => ({ ...f, logo: e.target.value }))} placeholder="https://res.cloudinary.com/..." />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Description</label>
                  <textarea className={`${inputCls} resize-none`} rows={3} value={editForm.description ?? ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
                </div>
              </div>

              <p className="text-xs text-on-surface-variant/60 mt-1">
                To update stats, admissions, departments or programs, use the{' '}
                <Link href={`/admin/universities/${editTarget.id}/edit`} className="text-primary underline">full edit page</Link>.
              </p>
            </div>

            {/* Modal footer */}
            <div className="sticky bottom-0 bg-surface-container-lowest border-t border-outline-variant/20 px-6 py-4 flex gap-3 rounded-b-2xl">
              <button onClick={() => setEditTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface-variant hover:bg-surface-container transition-colors">
                Cancel
              </button>
              <button onClick={saveEdit} disabled={editLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-on-primary text-sm font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-60">
                <Save className="w-4 h-4" /> {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}