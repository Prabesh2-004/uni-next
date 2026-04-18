"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, User, GraduationCap, Briefcase, BadgeCheck,
  Mail, Phone, Calendar, Building2, Loader2, AlertCircle,
  Trash2, ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CounselorDetail {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  // education
  degree: string | null;
  field_of_study: string | null;
  institution_name: string | null;
  graduation_year: string | null;
  // experience
  workplace_name: string | null;
  job_title: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  // license
  license_number: string | null;
  licensing_authority: string | null;
  issue_date: string | null;
  expiry_date: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (d: string | null) => {
  if (!d) return "Present";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
};

const initials = (c: Pick<CounselorDetail, "first_name" | "last_name">) =>
  `${c.first_name?.[0] ?? ""}${c.last_name?.[0] ?? ""}`.toUpperCase();

// ─── Sub-components ───────────────────────────────────────────────────────────

const DetailRow = ({
  icon: Icon, label, value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
      <Icon size={15} className="text-gray-500 dark:text-gray-400" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{label}</p>
      <p className="text-sm text-gray-900 dark:text-white mt-0.5 break-words">{value || "—"}</p>
    </div>
  </div>
);

const Section = ({
  icon: Icon, title, color, children,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
    <div className={`flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800 ${color}`}>
      <div className="p-2 rounded-lg bg-white/20 dark:bg-white/10">
        <Icon size={16} />
      </div>
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
  </div>
);

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
    {label}
  </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CounselorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<CounselorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const supabase = createClient();

        const [
          { data: counselor, error: e1 },
          { data: edu, error: e2 },
          { data: exp, error: e3 },
          { data: lic, error: e4 },
        ] = await Promise.all([
          supabase.from("counselor").select("*").eq("id", id).single(),
          supabase.from("counselor_education").select("*").eq("id", id).maybeSingle(),
          supabase.from("counselor_experience").select("*").eq("id", id).maybeSingle(),
          supabase.from("counselor_licenses").select("*").eq("id", id).maybeSingle(),
        ]);

        if (e1) throw e1;
        if (e2) throw e2;
        if (e3) throw e3;
        if (e4) throw e4;

        setData({
          ...counselor,
          degree: edu?.degree ?? null,
          field_of_study: edu?.field_of_study ?? null,
          institution_name: edu?.institution_name ?? null,
          graduation_year: edu?.graduation_year ?? null,
          workplace_name: exp?.workplace_name ?? null,
          job_title: exp?.job_title ?? null,
          start_date: exp?.start_date ?? null,
          end_date: exp?.end_date ?? null,
          description: exp?.description ?? null,
          license_number: lic?.license_number ?? null,
          licensing_authority: lic?.licensing_authority ?? null,
          issue_date: lic?.issue_date ?? null,
          expiry_date: lic?.expiry_date ?? null,
        });
      } catch {
        setError("Counselor not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("counselor").delete().eq("id", id);
      if (error) throw error;
      router.push("/admin/list-counselor");
    } catch {
      alert("Failed to delete counselor.");
      setDeleting(false);
    }
  };

  // ─── States ───────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
      <Loader2 size={32} className="animate-spin" />
    </div>
  );

  if (error || !data) return (
    <div className="p-6 max-w-xl mx-auto mt-10">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10
        border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
        <AlertCircle size={16} />
        {error || "Counselor not found."}
      </div>
      <button
        onClick={() => router.push("/admin/list-counselor")}
        className="mt-4 text-sm text-blue-500 hover:underline flex items-center gap-1"
      >
        <ArrowLeft size={14} /> Back to Counselors
      </button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">

      {/* Back */}
      <button
        onClick={() => router.push("/admin/list-counselor")}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400
          hover:text-blue-500 dark:hover:text-blue-400 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to All Counselors
      </button>

      {/* Hero card */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden mb-5">
        <div className="h-24 bg-gradient-to-r from-blue-500 via-blue-600 to-violet-600" />
        <div className="px-5 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-gray-900
                bg-blue-500 flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-lg">
                {initials(data)}
              </div>
              <div className="mb-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {data.first_name} {data.last_name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {data.licensing_authority && (
                    <Badge
                      label={`Licensed — ${data.licensing_authority}`}
                      color="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    />
                  )}
                  {data.job_title && (
                    <Badge
                      label={data.job_title}
                      color="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                    />
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-sm font-medium
                border border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 size={15} /> Delete Counselor
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Mail size={14} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{data.email}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Phone size={14} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{data.phone || "No phone"}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <ShieldCheck size={14} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                License #{data.license_number || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <Section icon={GraduationCap} title="Education" color="text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10">
          <DetailRow icon={GraduationCap} label="Degree" value={data.degree} />
          <DetailRow icon={User} label="Field of Study" value={data.field_of_study} />
          <DetailRow icon={Building2} label="Institution" value={data.institution_name} />
          <DetailRow icon={Calendar} label="Graduation Year" value={data.graduation_year} />
        </Section>

        <Section icon={Briefcase} title="Work Experience" color="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10">
          <DetailRow icon={Building2} label="Workplace" value={data.workplace_name} />
          <DetailRow icon={Briefcase} label="Job Title" value={data.job_title} />
          <DetailRow icon={Calendar} label="Start Date" value={formatDate(data.start_date)} />
          <DetailRow icon={Calendar} label="End Date" value={(data.end_date === null ? "Currently" : (data.end_date))} />
          {data.description && (
            <div className="sm:col-span-2 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                <Briefcase size={15} className="text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Description</p>
                <p className="text-sm text-gray-900 dark:text-white mt-0.5 leading-relaxed">{data.description}</p>
              </div>
            </div>
          )}
        </Section>

        <Section icon={BadgeCheck} title="Licensing & Certification" color="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10">
          <DetailRow icon={BadgeCheck} label="License Number" value={data.license_number} />
          <DetailRow icon={Building2} label="Licensing Authority" value={data.licensing_authority} />
          <DetailRow icon={Calendar} label="Issue Date" value={formatDate(data.issue_date)} />
          <DetailRow icon={Calendar} label="Expiry Date" value={formatDate(data.expiry_date)} />
        </Section>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900 shadow-2xl p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Delete Counselor</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {data.first_name} {data.last_name}
              </span>
              ? This will permanently remove all their data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg
                  border border-gray-200 dark:border-gray-700
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg
                  bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer disabled:opacity-60"
              >
                {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}