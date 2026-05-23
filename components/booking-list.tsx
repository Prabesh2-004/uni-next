'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Trash2, Eye, Loader2, AlertCircle,
  CalendarClock, ChevronLeft, ChevronRight,
  ArrowUpDown, RefreshCw, Filter,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// ─── Types ───────────────────────────────────────────────────────────────────

type Status = 'pending' | 'completed' | 'rejected' | 'approved';

interface Booking {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: Status;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-violet-500', 'bg-emerald-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
];

const STATUS_CONFIG: Record<Status, { label: string; cls: string }> = {
  pending:   { label: 'Pending',   cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  approved:  { label: 'Approved',  cls: 'bg-green-100 text-green-700 border-green-200' },
  completed: { label: 'Completed', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  rejected:  { label: 'Rejected',  cls: 'bg-red-100 text-red-700 border-red-200' },
};

const STATUSES: Status[] = ['pending', 'approved', 'completed', 'rejected'];
const PAGE_SIZE = 12;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function avatarColor(id: string) {
  return AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];
}

function initials(b: Booking) {
  const parts = b.full_name?.trim().split(' ') ?? [];
  return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase() || '?';
}

function Avatar({ b }: { b: Booking }) {
  return (
    <div className={`w-9 h-9 rounded-full ${avatarColor(b.id)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {initials(b)}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const BookingList = () => {
  const router = useRouter();
  const supabase = createClient();

  const [bookings, setBookings]     = useState<Booking[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Status>('All');
  const [sortField, setSortField]   = useState<'full_name' | 'email' | 'status'>('full_name');
  const [sortAsc, setSortAsc]       = useState(true);
  const [page, setPage]             = useState(1);

  // Status popover
  const [statusPopover, setStatusPopover] = useState<string | null>(null);
  const [updatingId, setUpdatingId]       = useState<string | null>(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [deletingId, setDeletingId]     = useState<string | null>(null);

  // Stats
  const statusCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1;
    return acc;
  }, {});

  // ── fetch ──────────────────────────────────────────────────────────────────
  async function fetchBookings() {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('booking')
      .select('id, full_name, email, phone, status')
      .order('full_name');
    if (error) setError('Failed to load bookings.');
    else setBookings(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchBookings(); }, []);

  // ── derived ────────────────────────────────────────────────────────────────
  const filtered = bookings
    .filter(b =>
      (statusFilter === 'All' || b.status === statusFilter) &&
      [b.full_name, b.email, b.phone].some(v => v?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const va = (a[sortField] ?? '').toLowerCase();
      const vb = (b[sortField] ?? '').toLowerCase();
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  }

  // ── status change ──────────────────────────────────────────────────────────
  async function changeStatus(id: string, status: Status) {
    setUpdatingId(id);
    const { error } = await supabase.from('booking').update({ status }).eq('id', id);
    if (!error) setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b));
    setStatusPopover(null);
    setUpdatingId(null);
  }

  // ── delete ─────────────────────────────────────────────────────────────────
  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    const { error } = await supabase.from('booking').delete().eq('id', deleteTarget.id);
    if (!error) setBookings(bs => bs.filter(b => b.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeletingId(null);
  }

  // ─── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface-container-low" onClick={() => setStatusPopover(null)}>

      {/* Header */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium">Admin / Bookings</p>
            <h1 className="text-xl font-semibold text-on-surface mt-0.5">Booking Management</h1>
          </div>
          <button onClick={fetchBookings}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface-variant hover:bg-surface-container transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-5">

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total',     value: bookings.length,             color: 'text-primary',    bg: 'bg-primary/10',    dot: 'bg-primary' },
            { label: 'Pending',   value: statusCounts.pending   ?? 0, color: 'text-amber-600',  bg: 'bg-amber-50',      dot: 'bg-amber-400' },
            { label: 'Approved',  value: statusCounts.approved  ?? 0, color: 'text-green-600',  bg: 'bg-green-50',      dot: 'bg-green-400' },
            { label: 'Completed', value: statusCounts.completed ?? 0, color: 'text-blue-600',   bg: 'bg-blue-50',       dot: 'bg-blue-400' },
          ].map(s => (
            <div key={s.label} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <span className={`w-3 h-3 rounded-full ${s.dot}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold leading-none ${s.color}`}>{s.value}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name, email, phone..."
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-on-surface-variant/50" />
            {(['All', ...STATUSES] as const).map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  statusFilter === s
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                }`}>
                {s === 'All' ? 'All' : STATUS_CONFIG[s].label}
                {s !== 'All' && statusCounts[s] !== undefined && (
                  <span className="ml-1.5 opacity-70">{statusCounts[s]}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-xs text-on-surface-variant -mt-1">
          {loading ? 'Loading...' : `${filtered.length} booking${filtered.length === 1 ? '' : 's'} found`}
        </p>

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-error-container text-on-error-container text-sm border border-error/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        {/* Table */}
        {!error && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container/40">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-8">#</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      <button onClick={() => toggleSort('full_name')} className="flex items-center gap-1 hover:text-primary transition-colors">
                        Name <ArrowUpDown className={`w-3 h-3 ${sortField === 'full_name' ? 'text-primary' : 'opacity-40'}`} />
                      </button>
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      <button onClick={() => toggleSort('email')} className="flex items-center gap-1 hover:text-primary transition-colors">
                        Contact <ArrowUpDown className={`w-3 h-3 ${sortField === 'email' ? 'text-primary' : 'opacity-40'}`} />
                      </button>
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      <button onClick={() => toggleSort('status')} className="flex items-center gap-1 hover:text-primary transition-colors">
                        Status <ArrowUpDown className={`w-3 h-3 ${sortField === 'status' ? 'text-primary' : 'opacity-40'}`} />
                      </button>
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="px-5 py-3.5">
                            <div className="h-4 bg-surface-container rounded animate-pulse" style={{ width: `${50 + (i * j * 11) % 40}%` }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16 text-on-surface-variant/50">
                        <CalendarClock className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No bookings found</p>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((b, i) => (
                      <tr key={b.id} className="hover:bg-surface-container/30 transition-colors group">
                        {/* # */}
                        <td className="px-5 py-3.5 text-xs text-on-surface-variant/40 tabular-nums">
                          {(page - 1) * PAGE_SIZE + i + 1}
                        </td>

                        {/* Name */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar b={b} />
                            <p className="font-medium text-on-surface">{b.full_name}</p>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col gap-0.5 text-xs text-on-surface-variant">
                            <span className="truncate max-w-[180px]">{b.email}</span>
                            {b.phone && <span className="text-on-surface-variant/60">{b.phone}</span>}
                          </div>
                        </td>

                        {/* Status — click to change */}
                        <td className="px-5 py-3.5">
                          <div className="relative" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setStatusPopover(prev => prev === b.id ? null : b.id)}
                              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              {updatingId === b.id
                                ? <span className="flex items-center gap-1.5 text-xs text-on-surface-variant"><Loader2 className="w-3 h-3 animate-spin" /> Updating...</span>
                                : <StatusBadge status={b.status} />
                              }
                            </button>

                            {statusPopover === b.id && (
                              <div className="absolute left-0 top-full mt-1 z-30 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-xl py-1 w-36">
                                <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-wider px-3 py-1.5 font-semibold">Change status</p>
                                {STATUSES.map(status => {
                                  const cfg = STATUS_CONFIG[status];
                                  const isCurrent = b.status === status;
                                  return (
                                    <button key={status}
                                      disabled={isCurrent}
                                      onClick={() => changeStatus(b.id, status)}
                                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                                        isCurrent ? 'text-primary font-semibold bg-primary/5' : 'text-on-surface hover:bg-surface-container'
                                      } disabled:opacity-60`}>
                                      <span className={`w-1.5 h-1.5 rounded-full border ${cfg.cls}`} />
                                      {cfg.label}
                                      {isCurrent && <span className="ml-auto text-[10px] text-primary font-bold">✓</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => router.push(`/admin/booking/${b.id}`)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors" title="View details">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(b)}
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

        {/* Pagination */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-on-surface-variant">Page {page} of {totalPages} · {filtered.length} total</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                  if (idx > 0 && typeof arr[idx - 1] === 'number' && (n as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                  acc.push(n); return acc;
                }, [])
                .map((n, idx) =>
                  n === '...'
                    ? <span key={`e${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-on-surface-variant">…</span>
                    : <button key={n} onClick={() => setPage(n as number)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${page === n ? 'bg-primary text-on-primary' : 'border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'}`}>
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
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-error" />
            </div>
            <h2 className="text-base font-semibold text-on-surface text-center mb-1">Delete Booking</h2>
            <p className="text-sm text-on-surface-variant text-center mb-5">
              Are you sure you want to delete the booking for{' '}
              <span className="font-semibold text-on-surface">{deleteTarget.full_name}</span>?
            </p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container border border-outline-variant/20 mb-5">
              <Avatar b={deleteTarget} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-on-surface truncate">{deleteTarget.full_name}</p>
                <p className="text-xs text-on-surface-variant truncate">{deleteTarget.email}</p>
              </div>
              <StatusBadge status={deleteTarget.status} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface-variant hover:bg-surface-container transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={!!deletingId}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-error text-on-error text-sm font-semibold hover:bg-error/90 transition-colors disabled:opacity-60">
                {deletingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deletingId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList;