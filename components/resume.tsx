"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Plus,
  CheckCircle,
  Trash2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Sparkles,
  Download,
  Eye,
  Globe,
  Heart,
  Star,
  Users,
  BookOpen,
  Loader2,
} from "lucide-react";
import {
  CvDraft,
  ResumeData,
  Education,
  Experience,
  defaultDraft,
} from "../app/resume/types";
import Template1 from "./cv-template/Template1";
import Template2 from "./cv-template/Template2";
import Template3 from "./cv-template/Template3";

import {
  saveResume,
  getCurrentUser,
} from "./cv-template/resumeService";

// ─── Draft Hook ───────────────────────────────────────────────────────────────

function useCvDraft() {
  const [draft, setDraftState] = useState<CvDraft>(defaultDraft);

  useEffect(() => {
    try {
      const s = localStorage.getItem("cv_draft_v2");
      if (s) setDraftState(JSON.parse(s));
    } catch { }
  }, []);

  const setDraft = useCallback((up: CvDraft | ((p: CvDraft) => CvDraft)) => {
    setDraftState((prev) => {
      const next = typeof up === "function" ? up(prev) : up;
      localStorage.setItem("cv_draft_v2", JSON.stringify(next));
      return next;
    });
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem("cv_draft_v2");
    setDraftState(defaultDraft);
  }, []);

  return { draft, setDraft, clearDraft };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function upItem<T>(
  set: (a: T[]) => void,
  arr: T[],
  i: number,
  k: keyof T,
  v: string,
) {
  const c = [...arr];
  (c[i] as Record<string, unknown>)[k as string] = v;
  set(c);
}

function upArr(
  set: (a: string[]) => void,
  arr: string[],
  i: number,
  v: string,
) {
  const c = [...arr];
  c[i] = v;
  set(c);
}

// ─── Shared input classes ─────────────────────────────────────────────────────

const inputBase =
  "flex-1 border-none outline-none text-sm bg-transparent " +
  "text-slate-800 dark:text-slate-100 " +
  "placeholder:text-slate-400 dark:placeholder:text-slate-500";

const wrapperBase =
  "flex items-center gap-2 border rounded-lg px-3 py-2 transition-all " +
  "bg-white dark:bg-slate-800 " +
  "border-slate-200 dark:border-slate-700 " +
  "focus-within:border-blue-500 dark:focus-within:border-blue-400 " +
  "focus-within:ring-2 focus-within:ring-blue-500/10 dark:focus-within:ring-blue-400/10";

const textareaBase =
  "w-full border rounded-lg px-3 py-2 text-sm resize-y outline-none " +
  "leading-relaxed transition-all " +
  "bg-white dark:bg-slate-800 " +
  "border-slate-200 dark:border-slate-700 " +
  "text-slate-800 dark:text-slate-100 " +
  "placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
  "focus:border-blue-500 dark:focus:border-blue-400 " +
  "focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-blue-400/10";

const labelBase =
  "text-xs font-semibold tracking-wide " + "text-slate-500 dark:text-slate-400";

// ─── Field ────────────────────────────────────────────────────────────────────

interface FieldProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  error,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className={labelBase}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div
        className={`${wrapperBase} ${error ? "!border-red-400 dark:!border-red-500" : ""}`}
      >
        {icon && (
          <span className="text-slate-400 dark:text-slate-500 flex-shrink-0">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputBase}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className={labelBase}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={textareaBase}
      />
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  onAdd,
}: {
  icon: React.ReactNode;
  title: string;
  onAdd: () => void;
}) {
  return (
    <div className="flex justify-between items-center pb-2 border-b-2 border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
        {icon}
        <span>{title}</span>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-1 text-xs font-semibold
          text-blue-600 dark:text-blue-400
          bg-blue-50 dark:bg-blue-950/50
          px-3 py-1 rounded-full
          hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
      >
        <Plus size={12} /> Add
      </button>
    </div>
  );
}

function EntryCard({
  onRemove,
  children,
}: {
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="border border-slate-200 dark:border-slate-700 rounded-xl p-4
      bg-slate-50 dark:bg-slate-800/40 flex flex-col gap-4"
    >
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1.5 ml-auto text-xs
            text-red-400 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400
            opacity-70 hover:opacity-100 transition-opacity"
        >
          <Trash2 size={13} /> Remove
        </button>
      )}
      {children}
    </div>
  );
}

// ─── Step 1 — Personal ───────────────────────────────────────────────────────

function PersonalForm({
  personal,
  setPersonal,
  emailError,
}: {
  personal: CvDraft["personal"];
  setPersonal: (p: CvDraft["personal"]) => void;
  emailError: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field
        icon={<User size={14} />}
        label="Full Name"
        value={personal.name}
        onChange={(v) => setPersonal({ ...personal, name: v })}
        placeholder="Jane Doe"
      />
      <Field
        icon={<Mail size={14} />}
        label="Email Address"
        type="email"
        value={personal.email}
        onChange={(v) => setPersonal({ ...personal, email: v })}
        placeholder="jane@example.com"
        required
        error={emailError}
      />
      <Field
        icon={<Phone size={14} />}
        label="Phone Number"
        value={personal.phone}
        onChange={(v) => setPersonal({ ...personal, phone: v })}
        placeholder="+977 9876543210"
      />
      <Field
        icon={<MapPin size={14} />}
        label="Address"
        value={personal.address}
        onChange={(v) => setPersonal({ ...personal, address: v })}
        placeholder="City, Country"
      />
      <div className="col-span-full">
        <TextArea
          label="About You"
          value={personal.objective}
          onChange={(v) => setPersonal({ ...personal, objective: v })}
          placeholder="Brief summary of your background and career goals..."
          rows={4}
        />
      </div>
    </div>
  );
}

// ─── Step 2 — Education & Experience ─────────────────────────────────────────

function EducationExperience({
  education,
  setEducation,
  experience,
  setExperience,
}: {
  education: Education[];
  setEducation: (e: Education[]) => void;
  experience: Experience[];
  setExperience: (e: Experience[]) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <SectionHeader
          icon={<GraduationCap size={16} />}
          title="Education"
          onAdd={() =>
            setEducation([
              ...education,
              {
                institution: "",
                degree: "",
                field: "",
                address: "",
                start: "",
                end: "",
              },
            ])
          }
        />
        {education.map((e, i) => (
          <EntryCard
            key={i}
            onRemove={
              education.length > 1
                ? () => setEducation(education.filter((_, x) => x !== i))
                : undefined
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Institution"
                value={e.institution}
                onChange={(v) =>
                  upItem(setEducation, education, i, "institution", v)
                }
                placeholder="University of..."
              />
              <Field
                label="Degree"
                value={e.degree}
                onChange={(v) =>
                  upItem(setEducation, education, i, "degree", v)
                }
                placeholder="Bachelor of Science"
              />
              <Field
                label="Field of Study"
                value={e.field}
                onChange={(v) => upItem(setEducation, education, i, "field", v)}
                placeholder="Computer Science"
              />
              <Field
                label="Address"
                value={e.address}
                onChange={(v) =>
                  upItem(setEducation, education, i, "address", v)
                }
                placeholder="City, Country"
              />
              <Field
                label="Start Date"
                value={e.start}
                onChange={(v) => upItem(setEducation, education, i, "start", v)}
                placeholder="Sep 2020"
              />
              <Field
                label="End Date"
                value={e.end}
                onChange={(v) => upItem(setEducation, education, i, "end", v)}
                placeholder="Jun 2024"
              />
            </div>
          </EntryCard>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader
          icon={<Briefcase size={16} />}
          title="Experience"
          onAdd={() =>
            setExperience([
              ...experience,
              { role: "", org: "", location: "", desc: "", start: "", end: "" },
            ])
          }
        />
        {experience.map((e, i) => (
          <EntryCard
            key={i}
            onRemove={
              experience.length > 1
                ? () => setExperience(experience.filter((_, x) => x !== i))
                : undefined
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Role / Position"
                value={e.role}
                onChange={(v) =>
                  upItem(setExperience, experience, i, "role", v)
                }
                placeholder="Software Engineer"
              />
              <Field
                label="Organization"
                value={e.org}
                onChange={(v) => upItem(setExperience, experience, i, "org", v)}
                placeholder="Acme Corp"
              />
              <Field
                label="Start Date"
                value={e.start}
                onChange={(v) =>
                  upItem(setExperience, experience, i, "start", v)
                }
                placeholder="Jan 2022"
              />
              <Field
                label="End Date"
                value={e.end}
                onChange={(v) => upItem(setExperience, experience, i, "end", v)}
                placeholder="Present"
              />
              <div className="col-span-full">
                <Field
                  icon={<MapPin size={13} />}
                  label="Location"
                  value={e.location}
                  onChange={(v) =>
                    upItem(setExperience, experience, i, "location", v)
                  }
                  placeholder="Remote / New York"
                />
              </div>
              <div className="col-span-full">
                <TextArea
                  label="Description"
                  value={e.desc}
                  onChange={(v) =>
                    upItem(setExperience, experience, i, "desc", v)
                  }
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                />
              </div>
            </div>
          </EntryCard>
        ))}
      </section>
    </div>
  );
}

// ─── Step 3 — Skills & More ───────────────────────────────────────────────────

const SK_CFG = [
  {
    key: "skills",
    label: "Technical Skills",
    icon: <Award size={14} />,
    ph: "TypeScript, React, Docker",
    col: "#3b82f6",
    tag: "blue",
  },
  {
    key: "softSkills",
    label: "Soft Skills",
    icon: <Star size={14} />,
    ph: "Communication, Leadership",
    col: "#8b5cf6",
    tag: "violet",
  },
  {
    key: "languages",
    label: "Languages",
    icon: <Globe size={14} />,
    ph: "English (Fluent), Spanish",
    col: "#10b981",
    tag: "emerald",
  },
  {
    key: "leadership",
    label: "Leadership",
    icon: <Users size={14} />,
    ph: "Led a team of 8 engineers",
    col: "#f59e0b",
    tag: "amber",
  },
  {
    key: "achievements",
    label: "Achievements",
    icon: <Sparkles size={14} />,
    ph: "Won national hackathon 2023",
    col: "#ef4444",
    tag: "red",
  },
  {
    key: "hobbies",
    label: "Hobbies & Interests",
    icon: <Heart size={14} />,
    ph: "Photography, Chess, Hiking",
    col: "#ec4899",
    tag: "pink",
  },
] as const;

const tagBg: Record<string, string> = {
  blue: "bg-blue-50 dark:bg-blue-950/40 border-l-blue-500",
  violet: "bg-violet-50 dark:bg-violet-950/40 border-l-violet-500",
  emerald: "bg-emerald-50 dark:bg-emerald-950/40 border-l-emerald-500",
  amber: "bg-amber-50 dark:bg-amber-950/40 border-l-amber-500",
  red: "bg-red-50 dark:bg-red-950/40 border-l-red-500",
  pink: "bg-pink-50 dark:bg-pink-950/40 border-l-pink-500",
};

function SkillsAll({
  draft,
  setDraft,
}: {
  draft: CvDraft;
  setDraft: (d: CvDraft | ((p: CvDraft) => CvDraft)) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {SK_CFG.map(({ key, label, icon, ph, col, tag }) => {
        const arr = draft[key as keyof ResumeData] as string[];
        const set = (next: string[]) =>
          setDraft((d) => ({ ...d, [key]: next }));
        return (
          <div
            key={key}
            className={`${tagBg[tag]} border border-slate-200 dark:border-slate-700
              border-l-[3px] rounded-xl p-3.5 flex flex-col gap-2.5`}
          >
            <div className="flex justify-between items-center">
              <div
                className="flex items-center gap-2 text-xs font-bold"
                style={{ color: col }}
              >
                <span style={{ color: col }}>{icon}</span>
                <span>{label}</span>
              </div>
              <button
                type="button"
                onClick={() => set([...arr, ""])}
                className="flex items-center gap-1 text-xs font-semibold
                  px-2.5 py-0.5 rounded-full border transition-opacity hover:opacity-70"
                style={{ color: col, borderColor: col + "55" }}
              >
                <Plus size={11} /> Add
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {arr.map((val, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    placeholder={ph}
                    value={val}
                    onChange={(e) => upArr(set, arr, i, e.target.value)}
                    className="flex-1 border border-slate-200 dark:border-slate-700 rounded-lg
                      px-3 py-1.5 text-sm outline-none transition-all
                      bg-white dark:bg-slate-800
                      text-slate-800 dark:text-slate-100
                      placeholder:text-slate-400 dark:placeholder:text-slate-500
                      focus:border-current focus:ring-2 focus:ring-current/10"
                    style={
                      { "--tw-ring-color": col + "22" } as React.CSSProperties
                    }
                  />
                  {arr.length > 1 && (
                    <button
                      type="button"
                      onClick={() => set(arr.filter((_, x) => x !== i))}
                      className="text-red-400 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400
                        opacity-60 hover:opacity-100 transition-opacity p-1 flex-shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Mini thumbnails ──────────────────────────────────────────────────────────

function MiniThumb({ id }: { id: number }) {
  if (id === 1)
    return (
      <svg viewBox="0 0 68 50" width={68} height={50} style={{ display: "block" }}>
        <rect width="68" height="13" fill="#1e3a8a" rx="2" />
        <rect x="4" y="3" width="22" height="3" rx="1" fill="white" opacity=".9" />
        <rect x="4" y="7.5" width="15" height="2" rx="1" fill="white" opacity=".5" />
        <rect width="19" height="37" y="13" fill="#eff6ff" />
        <rect x="3" y="16" width="13" height="1.5" rx=".5" fill="#bfdbfe" />
        <rect x="3" y="19" width="11" height="1" rx=".5" fill="#dbeafe" />
        <rect x="3" y="21" width="12" height="1" rx=".5" fill="#dbeafe" />
        <rect x="3" y="25" width="13" height="1.5" rx=".5" fill="#bfdbfe" />
        <rect x="3" y="28" width="9" height="1" rx=".5" fill="#dbeafe" />
        <rect x="22" y="16" width="18" height="1.5" rx=".5" fill="#1e3a8a" />
        <rect x="22" y="19" width="43" height="1" rx=".5" fill="#e5e7eb" />
        <rect x="22" y="21" width="40" height="1" rx=".5" fill="#e5e7eb" />
        <rect x="22" y="26" width="18" height="1.5" rx=".5" fill="#1e3a8a" />
        <rect x="22" y="29" width="43" height="1" rx=".5" fill="#e5e7eb" />
        <rect x="22" y="31" width="36" height="1" rx=".5" fill="#e5e7eb" />
      </svg>
    );
  if (id === 2)
    return (
      <svg viewBox="0 0 68 50" width={68} height={50} style={{ display: "block" }}>
        <rect width="19" height="50" fill="#0f172a" rx="2" />
        <circle cx="9.5" cy="9" r="5" fill="#0d9488" />
        <rect x="3" y="16" width="13" height="1.8" rx="1" fill="#334155" />
        <rect x="3" y="19.5" width="10" height="1" rx=".5" fill="#1e293b" />
        <rect x="3" y="21.5" width="12" height="1" rx=".5" fill="#1e293b" />
        <rect x="3" y="26" width="13" height="1.3" rx=".5" fill="#0d9488" opacity=".6" />
        <rect x="3" y="29" width="10" height="1" rx=".5" fill="#1e293b" />
        <rect x="3" y="31" width="12" height="1" rx=".5" fill="#1e293b" />
        <rect x="22" y="7" width="18" height="2.2" rx="1" fill="#0f172a" />
        <rect x="22" y="11" width="43" height="1" rx=".5" fill="#e5e7eb" />
        <rect x="22" y="13" width="39" height="1" rx=".5" fill="#e5e7eb" />
        <rect x="22" y="19" width="16" height="1.8" rx="1" fill="#0f172a" />
        <rect x="22" y="22.5" width="43" height="1" rx=".5" fill="#e5e7eb" />
        <rect x="22" y="24.5" width="37" height="1" rx=".5" fill="#e5e7eb" />
        <rect x="22" y="30" width="16" height="1.8" rx="1" fill="#0f172a" />
        <rect x="22" y="33.5" width="43" height="1" rx=".5" fill="#e5e7eb" />
      </svg>
    );
  return (
    <svg viewBox="0 0 68 50" width={68} height={50} style={{ display: "block" }}>
      <rect x="3" y="4" width="34" height="5" rx="1" fill="#0f172a" />
      <rect x="3" y="11" width="19" height="2" rx="1" fill="#dc2626" />
      <rect x="3" y="15" width="62" height="2.5" rx="1" fill="#dc2626" />
      <rect x="3" y="18" width="62" height="1" rx=".5" fill="#f1f5f9" />
      <rect x="3" y="22" width="11" height="1.2" rx=".5" fill="#dc2626" opacity=".7" />
      <rect x="16" y="22" width="49" height="1" rx=".5" fill="#e5e7eb" />
      <rect x="16" y="24" width="44" height="1" rx=".5" fill="#e5e7eb" />
      <rect x="3" y="29" width="11" height="1.2" rx=".5" fill="#dc2626" opacity=".7" />
      <rect x="16" y="29" width="35" height="1" rx=".5" fill="#0f172a" />
      <rect x="16" y="31" width="49" height="1" rx=".5" fill="#e5e7eb" />
      <rect x="3" y="38" width="22" height="3.5" rx="2" fill="#fef2f2" />
      <rect x="27" y="38" width="18" height="3.5" rx="2" fill="#fef2f2" />
    </svg>
  );
}

// ─── Template live preview ────────────────────────────────────────────────────

function TemplatePreview({ id, data }: { id: number; data: ResumeData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  const [contentHeight, setContentHeight] = useState(450);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const upd = () => {
      if (ref.current) {
        const newScale = ref.current.clientWidth / 794;
        setScale(newScale);
        if (innerRef.current) {
          setContentHeight(innerRef.current.scrollHeight * newScale);
        }
      }
    };
    upd();
    const ro = new ResizeObserver(upd);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [id, data]);

  const C = id === 2 ? Template2 : id === 3 ? Template3 : Template1;

  return (
    <div
      ref={ref}
      className="w-full overflow-hidden rounded-xl relative
        border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
      style={{ minHeight: 200, height: contentHeight }}
    >
      <div
        ref={innerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          width: 794,
          pointerEvents: "none",
        }}
      >
        <C data={data} />
      </div>
    </div>
  );
}

// ─── Step 4 — Template & Download ────────────────────────────────────────────

const TMPL = [
  { id: 1, name: "Classic Professional", desc: "Blue gradient · Two column" },
  { id: 2, name: "Modern Dark Sidebar", desc: "Slate sidebar · Teal accents" },
  { id: 3, name: "Bold Executive", desc: "Red accent · Editorial layout" },
];

function TemplateSelect({
  draft,
  setDraft,
  // FIX: accept a stable save callback
  onSave,
}: {
  draft: CvDraft;
  setDraft: (d: CvDraft | ((p: CvDraft) => CvDraft)) => void;
  onSave: (id: number) => Promise<void>;
}) {
  const selected = draft.templateId;
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [downloading, setDl] = useState(false);

  const resumeData: ResumeData = {
    personal: draft.personal,
    education: draft.education,
    experience: draft.experience,
    skills: draft.skills,
    softSkills: draft.softSkills,
    languages: draft.languages,
    hobbies: draft.hobbies,
    leadership: draft.leadership,
    achievements: draft.achievements,
  };

  // Track whether the user actively clicked a template in this session
  const userPickedRef = useRef(false);
  const onSaveRef = useRef(onSave);
  useEffect(() => { onSaveRef.current = onSave; }, [onSave]);

  // Wrap the real setDraft to track user picks
  const handleTemplatePick = (id: number) => {
    userPickedRef.current = true;
    setDraft((d) => ({ ...d, templateId: id }));
  };

  useEffect(() => {
    // Only auto-save when the user actively picked a template this session
    if (!selected || !userPickedRef.current) return;

    let cancelled = false;
    setSaveStatus("saving");

    const timer = setTimeout(async () => {
      if (cancelled) return;
      try {
        await onSaveRef.current(selected);
        if (!cancelled) {
          setSaveStatus("saved");
          setTimeout(() => {
            if (!cancelled) setSaveStatus("idle");
          }, 2000);
        }
      } catch {
        if (!cancelled) {
          setSaveStatus("error");
        }
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [selected]);

  const handleDownload = async () => {
    if (!selected) return;
    setDl(true);
    try {
      const { downloadResumePDF } = await import("../app/resume/ResumePDF");
      await downloadResumePDF(resumeData, selected);
    } finally {
      setDl(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 items-start">
      {/* ── Left: template cards + actions ── */}
      <div className="flex flex-col gap-3">
        <p className="text-xs italic text-slate-400 dark:text-slate-500">
          Pick a template
        </p>

        <div className="flex flex-col gap-2">
          {TMPL.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTemplatePick(t.id)}
              className={`relative flex items-center gap-3 border rounded-xl p-3
                w-full text-left cursor-pointer transition-all
                ${selected === t.id
                  ? "border-blue-500 dark:border-blue-400 bg-blue-50/80 dark:bg-blue-950/30 ring-1 ring-blue-500/20"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm"
                }`}
            >
              <div
                className="rounded-lg p-1.5 flex-shrink-0
                border border-slate-200 dark:border-slate-700
                bg-slate-50 dark:bg-slate-900"
              >
                <MiniThumb id={t.id} />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block truncate">
                  {t.name}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 block">
                  {t.desc}
                </span>
              </div>
              {selected === t.id && (
                <CheckCircle size={15} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        {selected && (
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg
              text-sm font-semibold transition-all
              bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white
              text-white dark:text-slate-900
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:-translate-y-px hover:shadow-md"
          >
            {downloading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Download size={15} />
            )}
            {downloading ? "Preparing…" : "Download PDF"}
          </button>
        )}
      </div>

      {/* ── Right: live preview ── */}
      <div className="flex flex-col gap-2">
        <div
          className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg
          border border-slate-200 dark:border-slate-700
          bg-slate-50 dark:bg-slate-800/50
          text-slate-500 dark:text-slate-400"
        >
          <Eye size={13} />
          <span>
            {selected ? `Template ${selected} — Live Preview` : "Choose a template"}
          </span>
          {selected && (
            <span
              className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide transition-colors ${saveStatus === "saving"
                  ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 animate-pulse"
                  : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                }`}
            >
              {saveStatus === "saving" ? "SAVING..." : "LIVE"}
            </span>
          )}
        </div>

        {selected ? (
          <TemplatePreview id={selected} data={resumeData} />
        ) : (
          <div
            className="flex flex-col items-center justify-center min-h-[370px] rounded-xl
              border border-dashed border-slate-200 dark:border-slate-700
              bg-slate-50 dark:bg-slate-900
              text-slate-400 dark:text-slate-600 text-sm text-center gap-3"
          >
            <BookOpen size={32} className="opacity-20" />
            <p>Your resume preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step labels ──────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Personal Info", short: "Personal" },
  { label: "Education & Experience", short: "Edu/Exp" },
  { label: "Skills & More", short: "Skills" },
  { label: "Template & Download", short: "Template" },
];

// ─── Main CVBuilder ───────────────────────────────────────────────────────────

export default function CVBuilder() {
  const { draft, setDraft, clearDraft } = useCvDraft();
  const [emailError, setEmailError] = useState("");
  const step = draft.step;

  const setStep = (n: number) => setDraft((d) => ({ ...d, step: n }));

  const handleNext = () => {
    if (step === 1 && !draft.personal.email.trim()) {
      setEmailError("Email is required.");
      return;
    }
    setEmailError("");
    setStep(step + 1);
  };

  // FIX: Wrap in useCallback so the reference is stable across renders.
  // This prevents the auto-save useEffect from firing on every render.
  const handleSave = useCallback(
    async (templateId: number) => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Please log in to save your resume.");

      const resumeData: ResumeData = {
        personal: draft.personal,
        education: draft.education,
        experience: draft.experience,
        skills: draft.skills,
        softSkills: draft.softSkills,
        languages: draft.languages,
        hobbies: draft.hobbies,
        leadership: draft.leadership,
        achievements: draft.achievements,
      };

      const result = await saveResume({
        data: resumeData,
        templateId,
        resumeId: draft.savedResumeId,
      });

      if (!result.success) throw new Error(result.error);

      if (result.resumeId) {
        // Persist resume data so the view page can read it immediately
        localStorage.setItem(
          `resume_${result.resumeId}`,
          JSON.stringify({ data: resumeData, templateId }),
        );

        // Update draft with the saved ID
        setDraft((d) => ({ ...d, savedResumeId: result.resumeId }));
      }
    },
    // FIX: depend on the actual data fields, not the whole draft object,
    // to keep the reference stable when unrelated draft fields change.
    [
      draft.personal,
      draft.education,
      draft.experience,
      draft.skills,
      draft.softSkills,
      draft.languages,
      draft.hobbies,
      draft.leadership,
      draft.achievements,
      draft.savedResumeId,
      setDraft,
    ],
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-7
      bg-gradient-to-br from-blue-50 via-white to-violet-50/60
      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
      transition-colors duration-300"
    >
      <div
        className="w-full max-w-[960px] rounded-2xl overflow-hidden
        border border-slate-200 dark:border-slate-800
        bg-white dark:bg-slate-900
        shadow-xl shadow-slate-200/60 dark:shadow-black/50"
      >
        {/* ── Header ── */}
        <header
          className="px-5 sm:px-7 py-5 flex items-center gap-3
          bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500
          dark:from-slate-900 dark:via-blue-950 dark:to-blue-900
          border-b border-white/10 dark:border-slate-800"
        >
          <div
            className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center
            text-white flex-shrink-0"
          >
            <Sparkles size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-white">CV Builder</h1>
            <p className="text-xs text-white/60 mt-0.5 hidden sm:block">
              Craft a professional CV for university applications
            </p>
          </div>
        </header>

        {/* ── Progress bar ── */}
        <div
          className="flex items-center justify-between px-5 sm:px-7 py-4 gap-0 overflow-x-auto
          bg-slate-50 dark:bg-slate-900/60
          border-b border-slate-100 dark:border-slate-800"
        >
          {STEPS.map((s, i) => {
            const state =
              step > i + 1 ? "done" : step === i + 1 ? "active" : "idle";
            return (
              <div key={i} className="flex items-center flex-shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center
                  text-xs font-bold flex-shrink-0 transition-all duration-300
                  ${state === "done"
                      ? "bg-blue-500 text-white border-2 border-blue-500"
                      : state === "active"
                        ? "bg-white dark:bg-slate-800 text-blue-500 border-2 border-blue-500 ring-4 ring-blue-500/15 dark:ring-blue-400/15"
                        : "bg-transparent text-slate-400 dark:text-slate-600 border-2 border-slate-200 dark:border-slate-700"
                    }`}
                >
                  {state === "done" ? <CheckCircle size={13} /> : i + 1}
                </div>
                <span
                  className={`ml-2 text-xs font-medium whitespace-nowrap transition-colors
                  ${state === "done"
                      ? "text-blue-500 dark:text-blue-400"
                      : state === "active"
                        ? "text-slate-800 dark:text-slate-100 font-semibold"
                        : "text-slate-400 dark:text-slate-600"
                    }`}
                >
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.short}</span>
                </span>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 mx-2 min-w-[100px] rounded-full transition-colors duration-300
                    ${step > i + 1 ? "bg-blue-500 dark:bg-blue-400" : "bg-slate-200 dark:bg-slate-700"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Step body ── */}
        <div className="p-5 sm:p-7">
          {step === 1 && (
            <PersonalForm
              personal={draft.personal}
              setPersonal={(p) => setDraft((d) => ({ ...d, personal: p }))}
              emailError={emailError}
            />
          )}
          {step === 2 && (
            <EducationExperience
              education={draft.education}
              setEducation={(ed) => setDraft((d) => ({ ...d, education: ed }))}
              experience={draft.experience}
              setExperience={(ex) => setDraft((d) => ({ ...d, experience: ex }))}
            />
          )}
          {step === 3 && <SkillsAll draft={draft} setDraft={setDraft} />}
          {step === 4 && (
            <TemplateSelect
              draft={draft}
              setDraft={setDraft}
              onSave={handleSave}
            />
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="flex flex-wrap justify-between items-center gap-3
          px-5 sm:px-7 py-4
          border-t border-slate-100 dark:border-slate-800
          bg-slate-50 dark:bg-slate-900/60"
        >
          <button
            type="button"
            onClick={() => {
              if (confirm("Clear all draft data?")) clearDraft();
            }}
            className="text-xs font-medium px-3 py-2 rounded-lg transition-colors
              text-red-400 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400
              border border-red-200 dark:border-red-900/60
              hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            Clear Draft
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
                border border-slate-200 dark:border-slate-700
                bg-white dark:bg-slate-800
                text-slate-700 dark:text-slate-300
                hover:bg-slate-50 dark:hover:bg-slate-700/70
                disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={15} /> Previous
            </button>
            {step < 4 && (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold
                  bg-blue-500 hover:bg-blue-600 text-white
                  hover:-translate-y-px hover:shadow-lg hover:shadow-blue-500/25
                  transition-all"
              >
                Next Step <ChevronRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}