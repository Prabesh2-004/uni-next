"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Trash2, Eye, Loader2,
  AlertCircle, Users, ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Status = "pending" | "completed" | "rejected" | "approved";

interface Booking {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: Status;
}

const AVATAR_COLORS = [
  "bg-blue-500", "bg-violet-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500", "bg-cyan-500",
];

const STATUS_STYLES: Record<Status, string> = {
  pending:   "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20",
  approved:  "bg-green-100  text-green-700  border-green-200  dark:bg-green-500/10  dark:text-green-400  dark:border-green-500/20",
  completed: "bg-blue-100   text-blue-700   border-blue-200   dark:bg-blue-500/10   dark:text-blue-400   dark:border-blue-500/20",
  rejected:  "bg-red-100    text-red-700    border-red-200    dark:bg-red-500/10    dark:text-red-400    dark:border-red-500/20",
};

const initials = (c: Booking) =>
  `${c.full_name?.[0] ?? ""}${c.full_name?.[1] ?? ""}`.toUpperCase();

const avatarColor = (id: string) =>
  AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];

const BookingList = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("booking")
        .select("id, full_name, email, phone, status")
        .order("full_name");
      if (error) throw error;
      setBookings(data ?? []);
      setFiltered(data ?? []);
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      bookings.filter(
        (c) =>
          c.full_name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q),
      ),
    );
  }, [search, bookings]);

  const handleStatusChange = async (id: string, newStatus: Status) => {
    setUpdatingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("booking")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      setBookings((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status.";
      alert(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("booking").delete().eq("id", id);
      if (error) throw error;
      setBookings((prev) => prev.filter((c) => c.id !== id));
      setConfirmId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete booking.";
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const StatusSelect = ({ c }: { c: Booking }) => (
    <div className="relative">
      {updatingId === c.id && (
        <Loader2 size={12} className="animate-spin absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
      )}
      <select
        value={c.status ?? "pending"}
        disabled={updatingId === c.id}
        onChange={(e) => handleStatusChange(c.id, e.target.value as Status)}
        className={`text-xs dark:bg-[#171c26] font-medium px-2.5 py-1.5 rounded-lg border appearance-none pr-6 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors disabled:opacity-60
          ${STATUS_STYLES[c.status ?? "pending"]}`}
      >
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="completed">Completed</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-1">
          <span>Admin</span>
          <ChevronRight size={12} />
          <span className="text-blue-500 font-medium">Bookings</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Bookings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {!loading && `${filtered.length} booking${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg
            border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900 text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-600
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10
          border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <Users size={40} strokeWidth={1.5} />
          <p className="text-sm">No bookings found.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          {/* Table — desktop */}
          <div className="hidden md:block rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  {["User", "Email", "Phone", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${avatarColor(c.id)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                          {initials(c)}
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">{c.full_name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{c.email}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{c.phone ?? "—"}</td>
                    <td className="px-5 py-4"><StatusSelect c={c} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/admin/booking/${c.id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
                            border border-gray-200 dark:border-gray-700
                            hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500/30
                            hover:text-blue-600 dark:hover:text-blue-400
                            text-gray-600 dark:text-gray-400 transition-colors cursor-pointer"
                        >
                          <Eye size={13} /> View
                        </button>
                        {confirmId === c.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDelete(c.id)}
                              disabled={deletingId === c.id}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg
                                bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer disabled:opacity-60"
                            >
                              {deletingId === c.id && <Loader2 size={12} className="animate-spin" />}
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg
                                border border-gray-200 dark:border-gray-700
                                text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(c.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
                              border border-gray-200 dark:border-gray-700
                              hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-300 dark:hover:border-red-500/30
                              hover:text-red-600 dark:hover:text-red-400
                              text-gray-600 dark:text-gray-400 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile */}
          <div className="md:hidden space-y-3">
            {filtered.map((c) => (
              <div key={c.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${avatarColor(c.id)} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {initials(c)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{c.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.email}</p>
                  </div>
                  <StatusSelect c={c} />
                </div>
                {c.phone && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{c.phone}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/booking/${c.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg
                      border border-gray-200 dark:border-gray-700
                      hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400
                      text-gray-600 dark:text-gray-400 transition-colors cursor-pointer"
                  >
                    <Eye size={13} /> View Details
                  </button>
                  {confirmId === c.id ? (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
                        className="px-3 py-2 text-xs font-medium rounded-lg bg-red-500 text-white cursor-pointer disabled:opacity-60"
                      >
                        {deletingId === c.id ? <Loader2 size={12} className="animate-spin inline" /> : "Confirm"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(c.id)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg
                        border border-gray-200 dark:border-gray-700
                        hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400
                        text-gray-600 dark:text-gray-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingList;