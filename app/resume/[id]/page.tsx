"use client";

import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import Template1 from "../../../components/cv-template/Template1";
import Template2 from "../../../components/cv-template/Template2";
import Template3 from "../../../components/cv-template/Template3";
import { ResumeData } from "../../resume/types";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
  Pencil,
  ChevronLeft,
} from "lucide-react";
import { downloadResumePDF } from "../../resume/ResumePDF";
import {
  saveResume,
  getCurrentUser,
} from "../../../components/cv-template/resumeService";

// ─── Mini thumbnails (same as builder) ───────────────────────────────────────

function MiniThumb({ id }: { id: number }) {
  if (id === 1)
    return (
      <svg viewBox="0 0 68 50" width={52} height={38} style={{ display: "block" }}>
        <rect width="68" height="13" fill="#1e3a8a" rx="2" />
        <rect x="4" y="3" width="22" height="3" rx="1" fill="white" opacity=".9" />
        <rect x="4" y="7.5" width="15" height="2" rx="1" fill="white" opacity=".5" />
        <rect width="19" height="37" y="13" fill="#eff6ff" />
        <rect x="3" y="16" width="13" height="1.5" rx=".5" fill="#bfdbfe" />
        <rect x="3" y="19" width="11" height="1" rx=".5" fill="#dbeafe" />
        <rect x="22" y="16" width="18" height="1.5" rx=".5" fill="#1e3a8a" />
        <rect x="22" y="19" width="43" height="1" rx=".5" fill="#e5e7eb" />
        <rect x="22" y="21" width="40" height="1" rx=".5" fill="#e5e7eb" />
      </svg>
    );
  if (id === 2)
    return (
      <svg viewBox="0 0 68 50" width={52} height={38} style={{ display: "block" }}>
        <rect width="19" height="50" fill="#0f172a" rx="2" />
        <circle cx="9.5" cy="9" r="5" fill="#0d9488" />
        <rect x="3" y="16" width="13" height="1.8" rx="1" fill="#334155" />
        <rect x="22" y="7" width="18" height="2.2" rx="1" fill="#0f172a" />
        <rect x="22" y="11" width="43" height="1" rx=".5" fill="#e5e7eb" />
        <rect x="22" y="13" width="39" height="1" rx=".5" fill="#e5e7eb" />
      </svg>
    );
  return (
    <svg viewBox="0 0 68 50" width={52} height={38} style={{ display: "block" }}>
      <rect x="3" y="4" width="34" height="5" rx="1" fill="#0f172a" />
      <rect x="3" y="11" width="19" height="2" rx="1" fill="#dc2626" />
      <rect x="3" y="15" width="62" height="2.5" rx="1" fill="#dc2626" />
      <rect x="16" y="22" width="49" height="1" rx=".5" fill="#e5e7eb" />
    </svg>
  );
}

const TMPL = [
  { id: 1, name: "Classic", desc: "Blue · Two column" },
  { id: 2, name: "Modern", desc: "Dark sidebar" },
  { id: 3, name: "Executive", desc: "Red accent" },
];

// ─── Template switcher panel ──────────────────────────────────────────────────

function TemplateSwitcher({
  resumeId,
  resumeData,
  current,
  onSwitch,
}: {
  resumeId: string;
  resumeData: ResumeData;
  current: number;
  onSwitch: (id: number) => void;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [downloading, setDl] = useState(false);
  const pendingRef = useRef<number | null>(null);

  const handlePick = async (id: number) => {
    if (id === current) return;

    // Optimistically update the preview immediately
    onSwitch(id);

    // Cancel any in-flight debounce
    if (pendingRef.current) clearTimeout(pendingRef.current);

    setStatus("saving");
    setErrMsg("");

    pendingRef.current = window.setTimeout(async () => {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Please log in.");

        const result = await saveResume({
          data: resumeData,
          templateId: id,
          resumeId,
        });

        if (!result.success) throw new Error(result.error);

        // Keep localStorage in sync so a hard-refresh still works
        localStorage.setItem(
          `resume_${resumeId}`,
          JSON.stringify({ data: resumeData, templateId: id }),
        );

        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } catch (e: unknown) {
        setStatus("error");
        setErrMsg(e instanceof Error ? e.message : "Save failed.");
        // Roll back the optimistic switch on error
        onSwitch(current);
      }
    }, 400);
  };

  const handleDownload = async () => {
    setDl(true);
    try {
      await downloadResumePDF(resumeData, current);
    } finally {
      setDl(false);
    }
  };

  return (
    <aside
      className="w-full lg:w-[220px] flex-shrink-0 flex flex-col gap-3
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-800
        rounded-2xl p-4 shadow-sm"
    >
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Switch Template
      </p>

      {/* Status pill */}
      {status !== "idle" && (
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border ${
            status === "error"
              ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400"
              : status === "saving"
                ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400"
                : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400"
          }`}
        >
          {status === "saving" && <><Loader2 size={11} className="animate-spin" /><span>Saving…</span></>}
          {status === "saved"  && <><CheckCircle size={11} /><span>Saved</span></>}
          {status === "error"  && <><AlertCircle size={11} /><span>{errMsg}</span></>}
        </div>
      )}

      {/* Template cards */}
      <div className="flex flex-col gap-2">
        {TMPL.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handlePick(t.id)}
            className={`flex items-center gap-3 border rounded-xl p-2.5 text-left
              transition-all w-full
              ${
                current === t.id
                  ? "border-blue-500 dark:border-blue-400 bg-blue-50/80 dark:bg-blue-950/30 ring-1 ring-blue-500/20"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-400 hover:shadow-sm"
              }`}
          >
            <div className="rounded-lg p-1 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex-shrink-0">
              <MiniThumb id={t.id} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{t.name}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">{t.desc}</p>
            </div>
            {current === t.id && (
              <CheckCircle size={13} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* Download */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg
          text-xs font-semibold transition-all mt-1
          bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white
          text-white dark:text-slate-900
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
        {downloading ? "Preparing…" : "Download PDF"}
      </button>
    </aside>
  );
}

// ─── Inner content (uses params) ──────────────────────────────────────────────

function ResumeViewContent() {
  const params  = useParams();
  const router  = useRouter();
  const resumeId = params.id as string;

  const [resumeData, setResumeData]   = useState<ResumeData | null>(null);
  const [templateId, setTemplateId]   = useState<number>(1);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // 1. Try the specific resume key first (written by CVBuilder on save)
        let stored = localStorage.getItem(`resume_${resumeId}`);

        // 2. Fall back to the active draft
        if (!stored) {
          const draft = localStorage.getItem("cv_draft_v2");
          if (draft) {
            const parsed = JSON.parse(draft);
            stored = JSON.stringify({
              data: {
                personal:     parsed.personal,
                education:    parsed.education,
                experience:   parsed.experience,
                skills:       parsed.skills,
                softSkills:   parsed.softSkills,
                languages:    parsed.languages,
                hobbies:      parsed.hobbies,
                leadership:   parsed.leadership,
                achievements: parsed.achievements,
              },
              templateId: parsed.templateId || 1,
            });
          }
        }

        if (stored) {
          const parsed = JSON.parse(stored);
          setResumeData(parsed.data ?? parsed);
          setTemplateId(parsed.templateId ?? 1);
        } else {
          setError("Resume not found. Please create one first.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load resume.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading your resume…</p>
        </div>
      </div>
    );
  }

  if (error || !resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center p-6 flex flex-col items-center gap-3">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-red-500 font-medium">{error ?? "Resume not found"}</p>
          <a href="/resume" className="text-blue-500 hover:underline text-sm">
            Go back to builder
          </a>
        </div>
      </div>
    );
  }

  const Template = templateId === 2 ? Template2 : templateId === 3 ? Template3 : Template1;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* ── Top bar ── */}
      <div
        className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80
          backdrop-blur border-b border-slate-200 dark:border-slate-800
          px-4 sm:px-8 py-3 flex items-center justify-between gap-3"
      >
        <button
          type="button"
          onClick={() => router.push("/resume")}
          className="flex items-center gap-1.5 text-sm font-semibold
            text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400
            transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Builder
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-xs text-slate-400 dark:text-slate-500">
            Template {templateId} selected
          </span>
          <button
            type="button"
            onClick={() => router.push("/resume")}
            className="flex items-center gap-1.5 px-3 py-1.5
              bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold
              rounded-lg transition-colors"
          >
            <Pencil size={12} /> Edit Content
          </button>
        </div>
      </div>

      {/* ── Body: switcher + preview ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* Template switcher */}
        <TemplateSwitcher
          resumeId={resumeId}
          resumeData={resumeData}
          current={templateId}
          onSwitch={setTemplateId}
        />

        {/* Resume preview */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl overflow-visible">
            <Template data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page export with Suspense ────────────────────────────────────────────────

export default function ResumeViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
          </div>
        </div>
      }
    >
      <ResumeViewContent />
    </Suspense>
  );
}