"use client";
import { useState, useEffect } from "react";
import {
  Calendar,
  Ban,
  CheckCircle2,
  Trash2,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface BlockedDate {
  iso: string;
  reason: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const DAY_NAMES    = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_NAMES  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function toISO(d: Date) {
  return d.toLocaleDateString("en-CA");
}

function buildCalendarMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);
  const cells: (Date | null)[] = [];
  for (let i = 0; i < first.getDay(); i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// ─── Supabase helpers ──────────────────────────────────────────────────────────
async function fetchBlocked(): Promise<BlockedDate[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("iso, reason");
  if (error) throw error;
  return (data as BlockedDate[]) ?? [];
}

async function insertBlocked(date: BlockedDate) {
  const supabase = createClient();
  const { error } = await supabase
    .from("blocked_dates")
    .upsert({ iso: date.iso, reason: date.reason });
  if (error) throw error;
}

async function deleteBlocked(iso: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("blocked_dates")
    .delete()
    .eq("iso", iso);
  if (error) throw error;
}

async function deleteAllBlocked() {
  const supabase = createClient();
  const { error } = await supabase
    .from("blocked_dates")
    .delete()
    .neq("iso", "");
  if (error) throw error;
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminDatePanel() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [blocked,   setBlocked]   = useState<BlockedDate[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [modal,     setModal]     = useState<string | null>(null);
  const [reason,    setReason]    = useState("");
  const [toast,     setToast]     = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetchBlocked()
      .then(setBlocked)
      .catch(() => showToast("Failed to load blocked dates", false))
      .finally(() => setLoading(false));
  }, []);

  const refresh = () =>
    fetchBlocked()
      .then(setBlocked)
      .catch(() => showToast("Failed to refresh", false));

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2800);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const cells = buildCalendarMonth(viewYear, viewMonth);
  const isBlockedISO = (iso: string) => blocked.some(b => b.iso === iso);

  const handleCellClick = async (d: Date) => {
    const iso = toISO(d);
    if (d < today || d.getDay() === 0 || d.getDay() === 6) return;
    if (isBlockedISO(iso)) {
      setSaving(true);
      try {
        await deleteBlocked(iso);
        showToast("Date unblocked");
        await refresh();
      } catch {
        showToast("Something went wrong", false);
      } finally {
        setSaving(false);
      }
    } else {
      setModal(iso);
      setReason("");
    }
  };

  const confirmBlock = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      await insertBlocked({ iso: modal, reason: reason.trim() || "Blocked by admin" });
      showToast("Date blocked", false);
      await refresh();
    } catch {
      showToast("Failed to block date", false);
    } finally {
      setSaving(false);
      setModal(null);
      setReason("");
    }
  };

  const removeBlocked = async (iso: string) => {
    setSaving(true);
    try {
      await deleteBlocked(iso);
      showToast("Date unblocked");
      await refresh();
    } catch {
      showToast("Failed to unblock date", false);
    } finally {
      setSaving(false);
    }
  };

  const clearAll = async () => {
    setSaving(true);
    try {
      await deleteAllBlocked();
      showToast("All dates unblocked");
      await refresh();
    } catch {
      showToast("Failed to clear dates", false);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickToggle = async (iso: string) => {
    setSaving(true);
    try {
      if (isBlockedISO(iso)) {
        await deleteBlocked(iso);
        showToast("Date unblocked");
      } else {
        await insertBlocked({ iso, reason: "Blocked by admin" });
        showToast("Date blocked", false);
      }
      await refresh();
    } catch {
      showToast("Something went wrong", false);
    } finally {
      setSaving(false);
    }
  };

  const sortedBlocked = [...blocked].sort((a, b) => a.iso.localeCompare(b.iso));

  const formatISO = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return `${DAY_NAMES[dt.getDay()]}, ${SHORT_MONTHS[m - 1]} ${d}, ${y}`;
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white font-['DM_Sans',sans-serif] p-6 md:p-10">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');`}</style>

      {/* ── Header ── */}
      <div className="max-w-5xl mx-auto mb-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
          <ShieldAlert size={20} className="text-rose-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight font-['Space_Grotesk']">Booking Date Control</h1>
          <p className="text-xs text-white/40">Admin panel · Manage available appointment dates</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {saving && <Loader2 size={14} className="text-white/30 animate-spin" />}
          <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50">
            {blocked.length} date{blocked.length !== 1 ? "s" : ""} blocked
          </span>
        </div>
      </div>

      {loading ? (
        <div className="max-w-5xl mx-auto flex items-center justify-center py-32 gap-3 text-white/30">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Loading blocked dates…</span>
        </div>
      ) : (
        <>
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Calendar ── */}
            <div className="lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <h2 className="font-semibold font-['Space_Grotesk'] tracking-wide text-sm">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </h2>
                <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-7 px-4 pt-4 pb-1">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                  <div key={d} className="text-center text-[10px] font-semibold text-white/30 uppercase tracking-widest pb-2">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 px-4 pb-5">
                {cells.map((cell, i) => {
                  if (!cell) return <div key={i} />;
                  const iso      = toISO(cell);
                  const isPast   = cell < today;
                  const isToday  = iso === toISO(today);
                  const isWkend  = cell.getDay() === 0 || cell.getDay() === 6;
                  const blocked_ = isBlockedISO(iso);
                  const notAvail = isPast || isWkend;

                  return (
                    <button
                      key={iso}
                      onClick={() => handleCellClick(cell)}
                      disabled={notAvail || saving}
                      title={isWkend ? "Weekend" : isPast ? "Past date" : blocked_ ? "Click to unblock" : "Click to block"}
                      className={`
                        relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all duration-150
                        ${notAvail ? "opacity-20 cursor-not-allowed"
                          : blocked_ ? "bg-rose-500/20 border border-rose-500/50 text-rose-300 hover:bg-rose-500/30"
                          : "hover:bg-white/10 border border-transparent hover:border-white/20 cursor-pointer"}
                        ${isToday && !blocked_ && !notAvail ? "border-blue-400/50 bg-blue-500/10" : ""}
                      `}
                    >
                      {blocked_ && <Ban size={10} className="absolute top-1 right-1 text-rose-400 opacity-80" />}
                      <span className={isToday ? "text-blue-300 font-bold" : ""}>{cell.getDate()}</span>
                      {isToday && <span className="w-1 h-1 rounded-full bg-blue-400 mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              <div className="px-6 pb-5 flex items-center gap-6 text-xs text-white/40">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500/20 border border-blue-400/50 inline-block" />Today</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500/50 inline-block" />Blocked</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white/5 border border-white/10 inline-block opacity-30" />Weekend / Past</span>
              </div>
            </div>

            {/* ── Blocked list ── */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
                <Ban size={14} className="text-rose-400" />
                <h3 className="text-sm font-semibold font-['Space_Grotesk']">Blocked Dates</h3>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-white/5 max-h-[420px]">
                {sortedBlocked.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-6 gap-3">
                    <CheckCircle2 size={32} className="text-green-400/40" />
                    <p className="text-sm text-white/30">No dates blocked.<br />All weekdays are open.</p>
                  </div>
                ) : (
                  sortedBlocked.map(b => (
                    <div key={b.iso} className="flex items-start gap-3 px-5 py-3 hover:bg-white/5 transition-colors group">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white/90">{formatISO(b.iso)}</p>
                        <p className="text-xs text-white/40 truncate mt-0.5">{b.reason}</p>
                      </div>
                      <button
                        onClick={() => removeBlocked(b.iso)}
                        disabled={saving}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 flex items-center justify-center transition-all shrink-0 mt-0.5 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={12} className="text-rose-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {sortedBlocked.length > 0 && (
                <div className="px-5 py-3 border-t border-white/10">
                  <button
                    onClick={clearAll}
                    disabled={saving}
                    className="w-full text-xs text-white/40 hover:text-rose-400 transition-colors py-1 disabled:cursor-not-allowed"
                  >
                    Clear all blocked dates
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Quick Block ── */}
          <div className="max-w-5xl mx-auto mt-6 bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={14} className="text-white/40" />
              <h3 className="text-sm font-semibold font-['Space_Grotesk']">Upcoming Weekdays — Quick Block</h3>
              <span className="text-xs text-white/30 ml-1">(next 14 days)</span>
            </div>
            <QuickBlock blocked={blocked} saving={saving} onToggle={handleQuickToggle} />
          </div>
        </>
      )}

      {/* ── Modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1d27] border border-white/15 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Ban size={16} className="text-rose-400" />
                <h3 className="font-semibold font-['Space_Grotesk'] text-sm">Block Date</h3>
              </div>
              <button onClick={() => setModal(null)} className="text-white/30 hover:text-white/70 transition-colors">
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-white/60 mb-1">Blocking</p>
            <p className="text-base font-semibold mb-5">{formatISO(modal)}</p>
            <label className="block text-xs text-white/50 mb-2 uppercase tracking-widest">Reason (optional)</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Public holiday, Training day…"
              value={reason}
              onChange={e => setReason(e.target.value)}
              onKeyDown={e => e.key === "Enter" && confirmBlock()}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-rose-400/60 transition-colors"
            />
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/15 text-sm text-white/50 hover:text-white hover:border-white/30 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmBlock}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                Block Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl z-50
          ${toast.ok ? "bg-green-500/20 border-green-500/40 text-green-300" : "bg-rose-500/20 border-rose-500/40 text-rose-300"}`}
        >
          {toast.ok ? <CheckCircle2 size={15} /> : <Ban size={15} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── Quick Block strip ─────────────────────────────────────────────────────────
function QuickBlock({
  blocked,
  saving,
  onToggle,
}: {
  blocked: BlockedDate[];
  saving: boolean;
  onToggle: (iso: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: { iso: string; label: string; sub: string }[] = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const iso = d.toLocaleDateString("en-CA");
    days.push({
      iso,
      label: String(d.getDate()),
      sub: SHORT_MONTHS[d.getMonth()] + " " + DAY_NAMES[d.getDay()],
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {days.map(({ iso, label, sub }) => {
        const isB = blocked.some(b => b.iso === iso);
        return (
          <button
            key={iso}
            onClick={() => onToggle(iso)}
            disabled={saving}
            title={isB ? "Click to unblock" : "Click to block"}
            className={`flex flex-col items-center px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-150 disabled:cursor-not-allowed
              ${isB
                ? "bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30"
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/25"
              }`}
          >
            <span className="text-base font-bold leading-tight">{label}</span>
            <span className="text-[10px] opacity-70">{sub}</span>
            {isB && <Ban size={9} className="mt-0.5 text-rose-400" />}
          </button>
        );
      })}
    </div>
  );
}