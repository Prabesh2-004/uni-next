"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, UserCheck, Trash2, Eye, Loader2,
  AlertCircle, Users, ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";

interface Counselor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
}

const AVATAR_COLORS = [
  "bg-blue-500", "bg-violet-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500", "bg-cyan-500",
];

const initials = (c: Counselor) =>
  `${c.first_name?.[0] ?? ""}${c.last_name?.[0] ?? ""}`.toUpperCase();

const avatarColor = (id: string) =>
  AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];

const Counselors = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [filtered, setFiltered] = useState<Counselor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const router = useRouter();

  const fetchCounselors = async () => {
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("counselor")
        .select("id, first_name, last_name, email, phone, is_active")
        .order("first_name");
      if (error) throw error;
      setCounselors(data ?? []);
      setFiltered(data ?? []);
    } catch {
      setError("Failed to load counselors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCounselors(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      counselors.filter(
        (c) =>
          c.first_name.toLowerCase().includes(q) ||
          c.last_name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q),
      ),
    );
  }, [search, counselors]);

  const handleUpdateStatus = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("counselor").update({ is_active: !counselors.find((c) => c.id === id)?.is_active }).eq("id", id);
      if (error) throw error;
      setCounselors((prev) => prev.map((c) => c.id === id ? { ...c, is_active: !c.is_active } : c));
    } catch {
      alert("Failed to update status.");
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("counselor").delete().eq("id", id);
      if (error) throw error;
      setCounselors((prev) => prev.filter((c) => c.id !== id));
      setConfirmId(null);
    } catch {
      alert("Failed to delete counselor.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-1">
          <span>Admin</span>
          <ChevronRight size={12} />
          <span className="text-blue-500 font-medium">Counselors</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Counselors</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {!loading && `${filtered.length} counselor${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/add-counselor")}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-sm font-medium
              bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
          >
            <UserCheck size={16} /> Add Counselor
          </button>
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

      {/* States */}
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
          <p className="text-sm">No counselors found.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          {/* Table — desktop */}
          <div className="hidden md:block rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  {["Counselor", "Email", "Phone", "Status", "Actions"].map((h) => (
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
                        <p className="font-medium text-gray-900 dark:text-white">{c.first_name} {c.last_name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{c.email}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{c.phone ?? "—"}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                        <Button onClick={() => handleUpdateStatus(c.id)} variant={c.is_active ? "outline" : "destructive"}>
                            {c.is_active ? "Active" : "Inactive"}
                        </Button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/admin/list-counselor/${c.id}`)}
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
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{c.first_name} {c.last_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.email}</p>
                  </div>
                </div>
                {c.phone && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{c.phone}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/list-counselor/${c.id}`)}
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

export default Counselors;