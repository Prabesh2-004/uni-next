'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import {
  Search, Shield, ShieldCheck, ShieldAlert, User, MoreHorizontal,
  ChevronLeft, ChevronRight, Mail, Phone, Pencil, Trash2,
  X, Save, AlertTriangle, UserX, RefreshCw, Filter,
  ArrowUpDown, Crown, Users,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  role: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLES = ['USER', 'ADMIN', 'COUNSELOR', 'MODERATOR'];

const ROLE_CONFIG: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  ADMIN:     { label: 'Admin',     icon: ShieldAlert, cls: 'bg-red-100 text-red-700 border-red-200' },
  COUNSELOR: { label: 'Counselor', icon: ShieldCheck, cls: 'bg-purple-100 text-purple-700 border-purple-200' },
  MODERATOR: { label: 'Moderator', icon: Shield,      cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  USER:      { label: 'User',      icon: User,        cls: 'bg-surface-container text-on-surface-variant border-outline-variant/30' },
};

const PAGE_SIZE = 12;

const inputCls = 'w-full bg-surface-container rounded-xl border border-outline-variant/30 px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function avatar(p: Profile) {
  if (p.avatar_url) return <img src={p.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />;
  const initials = `${p.first_name?.[0] ?? ''}${p.last_name?.[0] ?? ''}`.toUpperCase() || p.email?.[0]?.toUpperCase() || '?';
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500'];
  const color = colors[p.email?.charCodeAt(0) % colors.length];
  return <div className={`w-full h-full rounded-full ${color} flex items-center justify-center text-white text-xs font-bold`}>{initials}</div>;
}

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.USER;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold border ${cfg.cls}`}>
      <Icon className="w-3 h-3" />{cfg.label}
    </span>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const supabase = createClient();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortField, setSortField]   = useState<'created_at' | 'email' | 'role'>('created_at');
  const [sortAsc, setSortAsc]       = useState(false);
  const [page, setPage] = useState(1);

  // Quick role-change popover
  const [rolePopover, setRolePopover] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState<string | null>(null);

  // Edit modal
  const [editTarget, setEditTarget] = useState<Profile | null>(null);
  const [editForm, setEditForm]     = useState<Partial<Profile>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError]     = useState('');

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Stats
  const roleCounts = profiles.reduce<Record<string, number>>((acc, p) => {
    acc[p.role] = (acc[p.role] ?? 0) + 1;
    return acc;
  }, {});

  // ── fetch ──────────────────────────────────────────────────────────────────
  async function fetchProfiles() {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setProfiles(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchProfiles(); }, []);

  // ── derived ────────────────────────────────────────────────────────────────
  const filtered = profiles
    .filter(p =>
      (roleFilter === 'All' || p.role === roleFilter) &&
      [p.email, p.first_name, p.last_name, p.phone]
        .some(v => v?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const va = (a[sortField] ?? '').toString().toLowerCase();
      const vb = (b[sortField] ?? '').toString().toLowerCase();
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  }

  // ── quick role change ──────────────────────────────────────────────────────
  async function changeRole(id: string, role: string) {
    setRoleLoading(id);
    await supabase.from('profiles').update({ role }).eq('id', id);
    setProfiles(ps => ps.map(p => p.id === id ? { ...p, role } : p));
    setRolePopover(null);
    setRoleLoading(null);
  }

  // ── edit ───────────────────────────────────────────────────────────────────
  function openEdit(p: Profile) { setEditTarget(p); setEditForm({ ...p }); setEditError(''); }

  async function saveEdit() {
    if (!editTarget) return;
    setEditError('');
    setEditLoading(true);
    const { error } = await supabase.from('profiles').update({
      first_name: editForm.first_name,
      last_name:  editForm.last_name,
      bio:        editForm.bio,
      role:       editForm.role,
      phone:      editForm.phone,
      avatar_url: editForm.avatar_url,
    }).eq('id', editTarget.id);
    if (error) { setEditError(error.message); setEditLoading(false); return; }
    setProfiles(ps => ps.map(p => p.id === editTarget.id ? { ...p, ...editForm } as Profile : p));
    setEditTarget(null);
    setEditLoading(false);
  }

  // ── delete ─────────────────────────────────────────────────────────────────
  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await supabase.from('profiles').delete().eq('id', deleteTarget.id);
    setProfiles(ps => ps.filter(p => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeleteLoading(false);
  }

  // ─── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface-container-low" onClick={() => setRolePopover(null)}>

      {/* Header */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium">Admin / Users</p>
            <h1 className="text-xl font-semibold text-on-surface mt-0.5">User Management</h1>
          </div>
          <button onClick={fetchProfiles}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface-variant hover:bg-surface-container transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-5">

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Users', value: profiles.length, icon: Users, color: 'text-primary', bg: 'bg-secondary/10' },
            { label: 'Admins',      value: roleCounts.ADMIN ?? 0,     icon: ShieldAlert, color: 'text-red-600',    bg: 'bg-red-50' },
            { label: 'Counselors', value: roleCounts.COUNSELOR ?? 0, icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Moderators', value: roleCounts.MODERATOR ?? 0, icon: Shield,      color: 'text-blue-600',   bg: 'bg-blue-50' },
          ].map(s => (
            <div key={s.label} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-on-surface leading-none">{s.value}</p>
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
            {['All', ...ROLES].map(r => {
              const cfg = ROLE_CONFIG[r];
              return (
                <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    roleFilter === r
                      ? 'bg-secondary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                  }`}>
                  {cfg?.label ?? 'All'}
                  {r !== 'All' && roleCounts[r] !== undefined && (
                    <span className="ml-1.5 opacity-70">{roleCounts[r]}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Count */}
        <p className="text-xs text-on-surface-variant -mt-1">
          {loading ? 'Loading...' : `${filtered.length} user${filtered.length === 1 ? '' : 's'} found`}
        </p>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container/40">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-8">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    <button onClick={() => toggleSort('email')} className="flex items-center gap-1 hover:text-primary transition-colors">
                      Contact <ArrowUpDown className={`w-3 h-3 ${sortField === 'email' ? 'text-primary' : 'opacity-40'}`} />
                    </button>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    <button onClick={() => toggleSort('role')} className="flex items-center gap-1 hover:text-primary transition-colors">
                      Role <ArrowUpDown className={`w-3 h-3 ${sortField === 'role' ? 'text-primary' : 'opacity-40'}`} />
                    </button>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1 hover:text-primary transition-colors">
                      Joined <ArrowUpDown className={`w-3 h-3 ${sortField === 'created_at' ? 'text-primary' : 'opacity-40'}`} />
                    </button>
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-5 py-3.5">
                          <div className="h-4 bg-surface-container rounded animate-pulse" style={{ width: `${50 + (i * j * 9) % 40}%` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-on-surface-variant/50">
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No users found</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map((p, i) => (
                    <tr key={p.id} className="hover:bg-surface-container/30 transition-colors group">
                      {/* # */}
                      <td className="px-5 py-3.5 text-xs text-on-surface-variant/40 tabular-nums">
                        {(page - 1) * PAGE_SIZE + i + 1}
                      </td>

                      {/* User */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden ring-1 ring-outline-variant/20">
                            {avatar(p)}
                          </div>
                          <div>
                            <p className="font-medium text-on-surface text-sm">
                              {p.first_name || p.last_name
                                ? `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim()
                                : <span className="text-on-surface-variant/50 italic">No name</span>
                              }
                            </p>
                            <p className="text-[10px] text-on-surface-variant/50 font-mono mt-0.5 truncate max-w-[160px]">{p.id.slice(0, 8)}…</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate max-w-[180px]">{p.email}</span>
                          </span>
                          {p.phone && (
                            <span className="flex items-center gap-1.5 text-xs text-on-surface-variant/60">
                              <Phone className="w-3 h-3 flex-shrink-0" />{p.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Role — click to change */}
                      <td className="px-5 py-3.5">
                        <div className="relative" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setRolePopover(prev => prev === p.id ? null : p.id)}
                            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                            title="Click to change role"
                          >
                            <RoleBadge role={p.role} />
                            <MoreHorizontal className="w-3.5 h-3.5 text-on-surface-variant/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>

                          {rolePopover === p.id && (
                            <div className="absolute left-0 top-full mt-1 z-30 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-xl py-1 w-40 animate-in fade-in slide-in-from-top-1">
                              <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-wider px-3 py-1.5 font-semibold">Change role</p>
                              {ROLES.map(role => {
                                const cfg = ROLE_CONFIG[role];
                                const Icon = cfg.icon;
                                const isCurrent = p.role === role;
                                return (
                                  <button key={role}
                                    disabled={isCurrent || roleLoading === p.id}
                                    onClick={() => changeRole(p.id, role)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                                      isCurrent
                                        ? 'text-primary font-semibold bg-secondary/5'
                                        : 'text-on-surface hover:bg-surface-container'
                                    } disabled:opacity-60`}>
                                    <Icon className="w-3.5 h-3.5" />
                                    {cfg.label}
                                    {isCurrent && <span className="ml-auto text-[10px] text-primary font-bold">✓</span>}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-3.5 text-xs text-on-surface-variant whitespace-nowrap">
                        {timeAgo(p.created_at)}
                        <div className="text-[10px] text-on-surface-variant/40 mt-0.5">
                          {new Date(p.created_at).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(p)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-primary hover:bg-secondary/10 transition-colors" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteTarget(p)}
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

      {/* ── EDIT MODAL ──────────────────────────────────────────────────────── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditTarget(null)} />
          <div className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* header */}
            <div className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant/20 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-outline-variant/20">
                  {avatar(editTarget)}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-on-surface">Edit Profile</h2>
                  <p className="text-xs text-on-surface-variant">{editTarget.email}</p>
                </div>
              </div>
              <button onClick={() => setEditTarget(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {editError && (
                <div className="bg-error-container text-on-error-container text-xs rounded-xl px-3 py-2 border border-error/20">
                  {editError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">First Name</label>
                  <input className={inputCls} value={editForm.first_name ?? ''} onChange={e => setEditForm(f => ({ ...f, first_name: e.target.value }))} placeholder="Jane" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Last Name</label>
                  <input className={inputCls} value={editForm.last_name ?? ''} onChange={e => setEditForm(f => ({ ...f, last_name: e.target.value }))} placeholder="Doe" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Email</label>
                <input className={`${inputCls} opacity-50 cursor-not-allowed`} value={editForm.email ?? ''} disabled />
                <p className="text-xs text-on-surface-variant/50">Email is managed by Supabase Auth and cannot be changed here.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Phone</label>
                <input className={inputCls} type="tel" value={editForm.phone ?? ''} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 000 0000" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-500" /> Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map(role => {
                    const cfg = ROLE_CONFIG[role];
                    const Icon = cfg.icon;
                    const selected = editForm.role === role;
                    return (
                      <button key={role} type="button"
                        onClick={() => setEditForm(f => ({ ...f, role }))}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          selected
                            ? 'border-primary bg-secondary/10 text-primary'
                            : 'border-outline-variant/30 bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'
                        }`}>
                        <Icon className="w-4 h-4" />{cfg.label}
                        {selected && <span className="ml-auto text-xs font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Bio</label>
                <textarea className={`${inputCls} resize-none`} rows={3} value={editForm.bio ?? ''} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} placeholder="Short bio..." />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Avatar URL</label>
                <input className={inputCls} type="url" value={editForm.avatar_url ?? ''} onChange={e => setEditForm(f => ({ ...f, avatar_url: e.target.value }))} placeholder="https://..." />
                {editForm.avatar_url && (
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-outline-variant/20 mt-1">
                    <img src={editForm.avatar_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* footer */}
            <div className="sticky bottom-0 bg-surface-container-lowest border-t border-outline-variant/20 px-6 py-4 flex gap-3 rounded-b-2xl">
              <button onClick={() => setEditTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface-variant hover:bg-surface-container transition-colors">
                Cancel
              </button>
              <button onClick={saveEdit} disabled={editLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-on-primary text-sm font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-60">
                <Save className="w-4 h-4" />{editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ────────────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>
            <h2 className="text-base font-semibold text-on-surface text-center mb-1">Delete User</h2>
            <p className="text-sm text-on-surface-variant text-center mb-2">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-on-surface">
                {deleteTarget.first_name ?? deleteTarget.email}
              </span>?
            </p>
            <p className="text-xs text-on-surface-variant/60 text-center mb-6">
              This deletes the profile row. The auth.users record will also be removed via the foreign key cascade.
            </p>
            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-surface-container border border-outline-variant/20">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">{avatar(deleteTarget)}</div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">
                  {deleteTarget.first_name} {deleteTarget.last_name}
                </p>
                <p className="text-xs text-on-surface-variant truncate">{deleteTarget.email}</p>
              </div>
              <RoleBadge role={deleteTarget.role} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface-variant hover:bg-surface-container transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleteLoading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-error text-on-error text-sm font-semibold hover:bg-error/90 transition-colors disabled:opacity-60">
                <UserX className="w-4 h-4" />{deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}