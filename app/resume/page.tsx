"use client";

import {
  useState, useEffect, useCallback, useRef, createContext, useContext,
} from "react";
import {
  User, Mail, Phone, MapPin, GraduationCap, Briefcase, Award,
  Plus, CheckCircle, Trash2, ChevronRight, ChevronLeft, AlertCircle,
  Sparkles, Download, Eye, Globe, Heart, Star, Users, BookOpen,
  Moon, Sun, Save, Loader2,
} from "lucide-react";
import { CvDraft, ResumeData, Education, Experience, defaultDraft } from "./types";
import Template1 from "../../components/cv-template/Template1";
import Template2 from "../../components/cv-template/Template2";
import Template3 from "../../components/cv-template/Template3";
import { downloadResumePDF } from "./ResumePDF";
import { saveResume, getCurrentUser } from "../../components/cv-template/resumeService";

// ─── Theme Context ────────────────────────────────────────────────────────────

const ThemeCtx = createContext<{ dark: boolean; toggle: () => void }>({
  dark: false, toggle: () => {},
});
const useDark = () => useContext(ThemeCtx);

// ─── Draft Hook ───────────────────────────────────────────────────────────────

function useCvDraft() {
  const [draft, setDraftState] = useState<CvDraft>(defaultDraft);

  useEffect(() => {
    try {
      const s = localStorage.getItem("cv_draft_v2");
      if (s) setDraftState(JSON.parse(s));
    } catch {}
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

function upItem<T>(set: (a: T[]) => void, arr: T[], i: number, k: keyof T, v: string) {
  const c = [...arr]; (c[i] as Record<string, unknown>)[k as string] = v; set(c);
}
function upArr(set: (a: string[]) => void, arr: string[], i: number, v: string) {
  const c = [...arr]; c[i] = v; set(c);
}

// ─── Field ────────────────────────────────────────────────────────────────────

interface FP {
  icon?: React.ReactNode; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean; error?: string;
}
function Field({ icon, label, value, onChange, placeholder, type = "text", required, error }: FP) {
  const { dark } = useDark();
  return (
    <div className="fg">
      <label className={`fl ${dark ? "fl-d" : "fl-l"}`}>
        {label}{required && <span className="req">*</span>}
      </label>
      <div className={`fw ${error ? "fe" : ""} ${dark ? "fw-d" : "fw-l"}`}>
        {icon && <span className="fi-ic">{icon}</span>}
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} className={`fi-in ${dark ? "fi-d" : "fi-l"}`} />
      </div>
      {error && <p className="em"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

// ─── Step 1 — Personal ───────────────────────────────────────────────────────

function PersonalForm({ personal, setPersonal, emailError }: {
  personal: CvDraft["personal"]; setPersonal: (p: CvDraft["personal"]) => void; emailError: string;
}) {
  const { dark } = useDark();
  return (
    <div className="g2">
      <Field icon={<User size={14}/>} label="Full Name" value={personal.name}
        onChange={v => setPersonal({...personal, name: v})} placeholder="Jane Doe"/>
      <Field icon={<Mail size={14}/>} label="Email Address" type="email" value={personal.email}
        onChange={v => setPersonal({...personal, email: v})} placeholder="jane@example.com"
        required error={emailError}/>
      <Field icon={<Phone size={14}/>} label="Phone Number" value={personal.phone}
        onChange={v => setPersonal({...personal, phone: v})} placeholder="+1 555 000 0000"/>
      <Field icon={<MapPin size={14}/>} label="Address" value={personal.address}
        onChange={v => setPersonal({...personal, address: v})} placeholder="City, Country"/>
      <div className="span2">
        <label className={`fl ${dark ? "fl-d" : "fl-l"}`}>About You</label>
        <textarea value={personal.objective}
          onChange={e => setPersonal({...personal, objective: e.target.value})}
          placeholder="Brief summary of your background and career goals..."
          className={`ta ${dark ? "ta-d" : "ta-l"}`} rows={4}/>
      </div>
    </div>
  );
}

// ─── Step 2 — Education & Experience ─────────────────────────────────────────

function EducationExperience({ education, setEducation, experience, setExperience }: {
  education: Education[]; setEducation: (e: Education[]) => void;
  experience: Experience[]; setExperience: (e: Experience[]) => void;
}) {
  const { dark } = useDark();
//   const c = (s: string) => dark ? s + " dark" : s;
  return (
    <div className="secs">
      <section className="sec">
        <div className={`sec-hd ${dark ? "sec-hd-d" : "sec-hd-l"}`}>
          <div className="sec-ttl"><GraduationCap size={16}/><span>Education</span></div>
          <button type="button" className="add-btn" onClick={() =>
            setEducation([...education, {institution:"",degree:"",field:"",address:"",start:"",end:""}])}>
            <Plus size={12}/> Add
          </button>
        </div>
        {education.map((e, i) => (
          <div key={i} className={`card ${dark ? "card-d" : "card-l"}`}>
            {education.length > 1 && (
              <button type="button" className="rm-btn" onClick={() => setEducation(education.filter((_,x) => x !== i))}>
                <Trash2 size={13}/> Remove
              </button>
            )}
            <div className="g2">
              <Field label="Institution" value={e.institution} onChange={v => upItem(setEducation,education,i,"institution",v)} placeholder="University of..."/>
              <Field label="Degree" value={e.degree} onChange={v => upItem(setEducation,education,i,"degree",v)} placeholder="Bachelor of Science"/>
              <Field label="Field of Study" value={e.field} onChange={v => upItem(setEducation,education,i,"field",v)} placeholder="Computer Science"/>
              <Field label="Address" value={e.address} onChange={v => upItem(setEducation,education,i,"address",v)} placeholder="City, Country"/>
              <Field label="Start Date" value={e.start} onChange={v => upItem(setEducation,education,i,"start",v)} placeholder="Sep 2020"/>
              <Field label="End Date" value={e.end} onChange={v => upItem(setEducation,education,i,"end",v)} placeholder="Jun 2024"/>
            </div>
          </div>
        ))}
      </section>

      <section className="sec">
        <div className={`sec-hd ${dark ? "sec-hd-d" : "sec-hd-l"}`}>
          <div className="sec-ttl"><Briefcase size={16}/><span>Experience</span></div>
          <button type="button" className="add-btn" onClick={() =>
            setExperience([...experience, {role:"",org:"",location:"",desc:"",start:"",end:""}])}>
            <Plus size={12}/> Add
          </button>
        </div>
        {experience.map((e, i) => (
          <div key={i} className={`card ${dark ? "card-d" : "card-l"}`}>
            {experience.length > 1 && (
              <button type="button" className="rm-btn" onClick={() => setExperience(experience.filter((_,x) => x !== i))}>
                <Trash2 size={13}/> Remove
              </button>
            )}
            <div className="g2">
              <Field label="Role / Position" value={e.role} onChange={v => upItem(setExperience,experience,i,"role",v)} placeholder="Software Engineer"/>
              <Field label="Organization" value={e.org} onChange={v => upItem(setExperience,experience,i,"org",v)} placeholder="Acme Corp"/>
              <Field label="Start Date" value={e.start} onChange={v => upItem(setExperience,experience,i,"start",v)} placeholder="Jan 2022"/>
              <Field label="End Date" value={e.end} onChange={v => upItem(setExperience,experience,i,"end",v)} placeholder="Present"/>
              <div className="span2">
                <Field icon={<MapPin size={13}/>} label="Location" value={e.location}
                  onChange={v => upItem(setExperience,experience,i,"location",v)} placeholder="Remote / New York"/>
              </div>
              <div className="span2">
                <label className={`fl ${dark ? "fl-d" : "fl-l"}`}>Description</label>
                <textarea value={e.desc}
                  onChange={ev => upItem(setExperience,experience,i,"desc",ev.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  className={`ta ${dark ? "ta-d" : "ta-l"}`} rows={3}/>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

// ─── Step 3 — Skills & More ───────────────────────────────────────────────────

const SK_CFG = [
  { key: "skills",       label: "Technical Skills",    icon: <Award size={14}/>,    ph: "TypeScript, React, Docker",    col: "#3b82f6", bg: "#eff6ff", bgD: "#1e3a5f" },
  { key: "softSkills",   label: "Soft Skills",          icon: <Star size={14}/>,     ph: "Communication, Leadership",    col: "#8b5cf6", bg: "#f5f3ff", bgD: "#2e1f5e" },
  { key: "languages",    label: "Languages",            icon: <Globe size={14}/>,    ph: "English (Fluent), Spanish",    col: "#10b981", bg: "#ecfdf5", bgD: "#064e3b" },
  { key: "leadership",   label: "Leadership",           icon: <Users size={14}/>,    ph: "Led a team of 8 engineers",   col: "#f59e0b", bg: "#fffbeb", bgD: "#451a03" },
  { key: "achievements", label: "Achievements",         icon: <Sparkles size={14}/>, ph: "Won national hackathon 2023", col: "#ef4444", bg: "#fef2f2", bgD: "#450a0a" },
  { key: "hobbies",      label: "Hobbies & Interests",  icon: <Heart size={14}/>,    ph: "Photography, Chess, Hiking",  col: "#ec4899", bg: "#fdf2f8", bgD: "#4a044e" },
];

function SkillsAll({ draft, setDraft }: { draft: CvDraft; setDraft: (d: CvDraft | ((p: CvDraft) => CvDraft)) => void }) {
  const { dark } = useDark();
  return (
    <div className="sk-grid">
      {SK_CFG.map(({ key, label, icon, ph, col, bg, bgD }) => {
        const arr = draft[key as keyof ResumeData] as string[];
        const set = (next: string[]) => setDraft(d => ({ ...d, [key]: next }));
        const blockBg = dark ? bgD : bg;
        return (
          <div key={key} className={`sk-block ${dark ? "sk-block-d" : "sk-block-l"}`}
            style={{ borderLeft: `3px solid ${col}` }}>
            <div className="sk-hd">
              <div className="sk-ttl" style={{ color: col }}>
                <span style={{ background: blockBg, borderRadius: 6, padding: "3px 5px", display:"flex",alignItems:"center" }}>{icon}</span>
                <span>{label}</span>
              </div>
              <button type="button" onClick={() => set([...arr, ""])}
                className="sk-add" style={{ color: col, background: blockBg }}>
                <Plus size={11}/> Add
              </button>
            </div>
            {arr.map((val, i) => (
              <div key={i} className="sk-row">
                <input className={`sk-in ${dark ? "sk-in-d" : "sk-in-l"}`}
                  placeholder={ph} value={val}
                  onChange={e => upArr(set, arr, i, e.target.value)}
                  style={{ "--fc": col } as React.CSSProperties}/>
                {arr.length > 1 && (
                  <button type="button" className="rm-ic" onClick={() => set(arr.filter((_,x) => x !== i))}>
                    <Trash2 size={12}/>
                  </button>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── Mini thumbnails ──────────────────────────────────────────────────────────

function MiniThumb({ id }: { id: number }) {
  if (id === 1) return (
    <svg viewBox="0 0 68 50" width={68} height={50} style={{display:"block"}}>
      <rect width="68" height="13" fill="#1e3a8a" rx="2"/>
      <rect x="4" y="3" width="22" height="3" rx="1" fill="white" opacity=".9"/>
      <rect x="4" y="7.5" width="15" height="2" rx="1" fill="white" opacity=".5"/>
      <rect width="19" height="37" y="13" fill="#eff6ff"/>
      <rect x="3" y="16" width="13" height="1.5" rx=".5" fill="#bfdbfe"/>
      <rect x="3" y="19" width="11" height="1" rx=".5" fill="#dbeafe"/>
      <rect x="3" y="21" width="12" height="1" rx=".5" fill="#dbeafe"/>
      <rect x="3" y="25" width="13" height="1.5" rx=".5" fill="#bfdbfe"/>
      <rect x="3" y="28" width="9"  height="1" rx=".5" fill="#dbeafe"/>
      <rect x="22" y="16" width="18" height="1.5" rx=".5" fill="#1e3a8a"/>
      <rect x="22" y="19" width="43" height="1" rx=".5" fill="#e5e7eb"/>
      <rect x="22" y="21" width="40" height="1" rx=".5" fill="#e5e7eb"/>
      <rect x="22" y="26" width="18" height="1.5" rx=".5" fill="#1e3a8a"/>
      <rect x="22" y="29" width="43" height="1" rx=".5" fill="#e5e7eb"/>
      <rect x="22" y="31" width="36" height="1" rx=".5" fill="#e5e7eb"/>
    </svg>
  );
  if (id === 2) return (
    <svg viewBox="0 0 68 50" width={68} height={50} style={{display:"block"}}>
      <rect width="19" height="50" fill="#0f172a" rx="2"/>
      <circle cx="9.5" cy="9" r="5" fill="#0d9488"/>
      <rect x="3" y="16" width="13" height="1.8" rx="1" fill="#334155"/>
      <rect x="3" y="19.5" width="10" height="1" rx=".5" fill="#1e293b"/>
      <rect x="3" y="21.5" width="12" height="1" rx=".5" fill="#1e293b"/>
      <rect x="3" y="26" width="13" height="1.3" rx=".5" fill="#0d9488" opacity=".6"/>
      <rect x="3" y="29" width="10" height="1" rx=".5" fill="#1e293b"/>
      <rect x="3" y="31" width="12" height="1" rx=".5" fill="#1e293b"/>
      <rect x="22" y="7" width="18" height="2.2" rx="1" fill="#0f172a"/>
      <rect x="22" y="11" width="43" height="1" rx=".5" fill="#e5e7eb"/>
      <rect x="22" y="13" width="39" height="1" rx=".5" fill="#e5e7eb"/>
      <rect x="22" y="19" width="16" height="1.8" rx="1" fill="#0f172a"/>
      <rect x="22" y="22.5" width="43" height="1" rx=".5" fill="#e5e7eb"/>
      <rect x="22" y="24.5" width="37" height="1" rx=".5" fill="#e5e7eb"/>
      <rect x="22" y="30" width="16" height="1.8" rx="1" fill="#0f172a"/>
      <rect x="22" y="33.5" width="43" height="1" rx=".5" fill="#e5e7eb"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 68 50" width={68} height={50} style={{display:"block"}}>
      <rect x="3" y="4"  width="34" height="5" rx="1" fill="#0f172a"/>
      <rect x="3" y="11" width="19" height="2" rx="1" fill="#dc2626"/>
      <rect x="3" y="15" width="62" height="2.5" rx="1" fill="#dc2626"/>
      <rect x="3" y="18" width="62" height="1" rx=".5" fill="#f1f5f9"/>
      <rect x="3" y="22" width="11" height="1.2" rx=".5" fill="#dc2626" opacity=".7"/>
      <rect x="16" y="22" width="49" height="1" rx=".5" fill="#e5e7eb"/>
      <rect x="16" y="24" width="44" height="1" rx=".5" fill="#e5e7eb"/>
      <rect x="3" y="29" width="11" height="1.2" rx=".5" fill="#dc2626" opacity=".7"/>
      <rect x="16" y="29" width="35" height="1" rx=".5" fill="#0f172a"/>
      <rect x="16" y="31" width="49" height="1" rx=".5" fill="#e5e7eb"/>
      <rect x="3"  y="38" width="22" height="3.5" rx="2" fill="#fef2f2"/>
      <rect x="27" y="38" width="18" height="3.5" rx="2" fill="#fef2f2"/>
    </svg>
  );
}

// ─── Template live preview ────────────────────────────────────────────────────

function TemplatePreview({ id, data }: { id: number; data: ResumeData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  useEffect(() => {
    const upd = () => { if (ref.current) setScale(ref.current.clientWidth / 794); };
    upd();
    const ro = new ResizeObserver(upd);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const C = id === 2 ? Template2 : id === 3 ? Template3 : Template1;
  return (
    <div ref={ref} className="prev-viewport">
      <div style={{ position:"absolute", top:0, left:0, transformOrigin:"top left",
        transform:`scale(${scale})`, width:794, pointerEvents:"none" }}>
        <C data={data}/>
      </div>
    </div>
  );
}

// ─── Step 4 — Template & Download ────────────────────────────────────────────

const TMPL = [
  { id:1, name:"Classic Professional", desc:"Blue gradient · Two column"  },
  { id:2, name:"Modern Dark Sidebar",  desc:"Slate sidebar · Teal accents" },
  { id:3, name:"Bold Executive",       desc:"Red accent · Editorial layout" },
];

function TemplateSelect({ draft, setDraft, onSave }: {
  draft: CvDraft;
  setDraft: (d: CvDraft | ((p: CvDraft) => CvDraft)) => void;
  onSave: (id: number) => Promise<void>;
}) {
  const { dark } = useDark();
  const selected = draft.templateId;
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const [downloading, setDownloading] = useState(false);

  const resumeData: ResumeData = {
    personal: draft.personal, education: draft.education, experience: draft.experience,
    skills: draft.skills, softSkills: draft.softSkills, languages: draft.languages,
    hobbies: draft.hobbies, leadership: draft.leadership, achievements: draft.achievements,
  };

  const pick = (id: number) => {
    setDraft(d => ({ ...d, templateId: id }));
    setSaved(false); setSaveErr("");
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true); setSaved(false); setSaveErr("");
    try {
      await onSave(selected);
      setSaved(true);
    } catch (e: unknown) {
      setSaveErr(e instanceof Error ? e.message : "Failed to save.");
    } finally { setSaving(false); }
  };

  const handleDownload = async () => {
    if (!selected) return;
    setDownloading(true);
    try { await downloadResumePDF(resumeData, selected); }
    finally { setDownloading(false); }
  };

  return (
    <div className="ts-wrap">
      {/* ── Left panel ── */}
      <div className="ts-left">
        <p className={`ts-hint ${dark ? "ts-hint-d" : "ts-hint-l"}`}>Pick a template — preview updates instantly</p>
        <div className="ts-cards">
          {TMPL.map(t => (
            <button key={t.id} type="button" onClick={() => pick(t.id)}
              className={`tc ${selected === t.id ? "tc-sel" : ""} ${dark ? "tc-d" : "tc-l"}`}>
              <div className={`tc-thumb ${dark ? "tc-thumb-d" : "tc-thumb-l"}`}>
                <MiniThumb id={t.id}/>
              </div>
              <div className="tc-meta">
                <span className="tc-name">{t.name}</span>
                <span className={`tc-desc ${dark ? "tc-desc-d" : "tc-desc-l"}`}>{t.desc}</span>
              </div>
              {selected === t.id && <CheckCircle size={15} style={{ color:"#3b82f6", flexShrink:0 }}/>}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        {selected && (
          <div className="ts-actions">
            <button type="button" onClick={handleSave} disabled={saving}
              className={`act-btn act-save ${dark ? "act-save-d" : "act-save-l"}`}>
              {saving ? <Loader2 size={15} className="spin"/> : <Save size={15}/>}
              {saving ? "Saving…" : saved ? "Saved ✓" : "Save to Account"}
            </button>
            <button type="button" onClick={handleDownload} disabled={downloading}
              className="act-btn act-dl">
              {downloading ? <Loader2 size={15} className="spin"/> : <Download size={15}/>}
              {downloading ? "Preparing…" : "Download PDF"}
            </button>
            {saveErr && <p className="save-err"><AlertCircle size={12}/>{saveErr}</p>}
          </div>
        )}
      </div>

      {/* ── Right: live preview ── */}
      <div className="ts-right">
        <div className={`prev-bar ${dark ? "prev-bar-d" : "prev-bar-l"}`}>
          <Eye size={13}/>
          <span>{selected ? `Template ${selected} — Live Preview` : "Choose a template"}</span>
          {selected && <span className="live-badge">LIVE</span>}
        </div>
        {selected
          ? <TemplatePreview id={selected} data={resumeData}/>
          : (
            <div className={`prev-empty ${dark ? "prev-empty-d" : "prev-empty-l"}`}>
              <BookOpen size={32} style={{ opacity:.2, marginBottom:10 }}/>
              <p>Your resume preview will appear here</p>
            </div>
          )}
      </div>
    </div>
  );
}

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { label:"Personal Info",           short:"Personal" },
  { label:"Education & Experience",  short:"Edu/Exp"  },
  { label:"Skills & More",           short:"Skills"   },
  { label:"Template & Download",     short:"Template" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CVBuilder() {
  const [dark, setDark] = useState(false);
  const { draft, setDraft, clearDraft } = useCvDraft();
  const [emailError, setEmailError] = useState("");
  const step = draft.step;

  // persist theme
  useEffect(() => {
    try { const d = localStorage.getItem("cv_theme"); if (d) setDark(d === "dark"); } catch {}
  }, []);
  const toggleTheme = () => {
    setDark(p => { const n = !p; localStorage.setItem("cv_theme", n ? "dark" : "light"); return n; });
  };

  const setStep = (n: number) => setDraft(d => ({ ...d, step: n }));

  const handleNext = () => {
    if (step === 1 && !draft.personal.email.trim()) {
      setEmailError("Email is required."); return;
    }
    setEmailError(""); setStep(step + 1);
  };

  // Save to Supabase — called by TemplateSelect
  const handleSave = async (templateId: number) => {
    const user = await getCurrentUser();
    console.log(user)
    if (!user) throw new Error("Please log in to save your resume.");

    const resumeData: ResumeData = {
      personal: draft.personal, education: draft.education, experience: draft.experience,
      skills: draft.skills, softSkills: draft.softSkills, languages: draft.languages,
      hobbies: draft.hobbies, leadership: draft.leadership, achievements: draft.achievements,
    };

    const result = await saveResume({
      data: resumeData,
      templateId,
      resumeId: draft.savedResumeId,
    });

    if (!result.success) throw new Error(result.error);
    // Store the resumeId so subsequent saves update instead of insert
    if (result.resumeId && !draft.savedResumeId) {
      setDraft(d => ({ ...d, savedResumeId: result.resumeId }));
    }
  };

  // CSS classes driven by dark flag
  const page = `cv-page ${dark ? "cv-page-d" : "cv-page-l"}`;
  const card = `cv-card ${dark ? "cv-card-d" : "cv-card-l"}`;
  const footer = `cv-ft ${dark ? "cv-ft-d" : "cv-ft-l"}`;
  const prog = `cv-prog ${dark ? "cv-prog-d" : "cv-prog-l"}`;

  return (
    <ThemeCtx.Provider value={{ dark, toggle: toggleTheme }}>
      <style>{CSS}</style>
      <div className={page}>
        <div className={card}>

          {/* ── Header ── */}
          <header className={`cv-hd ${dark ? "cv-hd-d" : "cv-hd-l"}`}>
            <div className="cv-hd-in">
              <div className="cv-logo">
                <Sparkles size={18}/>
              </div>
              <div className="cv-hd-text">
                <h1 className="cv-title">CV Builder</h1>
                <p className="cv-sub">Craft a professional CV for university applications</p>
              </div>
              {/* Theme toggle */}
              <button type="button" onClick={toggleTheme} className={`theme-btn ${dark ? "theme-btn-d" : "theme-btn-l"}`} aria-label="Toggle theme">
                {dark ? <Sun size={16}/> : <Moon size={16}/>}
                <span>{dark ? "Light" : "Dark"}</span>
              </button>
            </div>
          </header>

          {/* ── Progress ── */}
          <div className={prog}>
            {STEPS.map((s, i) => {
              const st = step > i+1 ? "done" : step === i+1 ? "act" : "idle";
              return (
                <div key={i} className="pi">
                  <div className={`pc pc-${st} ${dark ? "pc-"+st+"-d" : ""}`}>
                    {st === "done" ? <CheckCircle size={13}/> : i+1}
                  </div>
                  <span className={`pl pl-${st} ${dark ? "pl-"+st+"-d" : ""}`}>
                    <span className="pl-f">{s.label}</span>
                    <span className="pl-s">{s.short}</span>
                  </span>
                  {i < STEPS.length-1 && <div className={`pline ${step > i+1 ? "pline-done" : dark ? "pline-idle-d" : "pline-idle"}`}/>}
                </div>
              );
            })}
          </div>

          {/* ── Step body ── */}
          <div className="cv-body">
            {step === 1 && (
              <PersonalForm personal={draft.personal}
                setPersonal={p => setDraft(d => ({...d, personal:p}))} emailError={emailError}/>
            )}
            {step === 2 && (
              <EducationExperience
                education={draft.education} setEducation={ed => setDraft(d => ({...d, education:ed}))}
                experience={draft.experience} setExperience={ex => setDraft(d => ({...d, experience:ex}))}/>
            )}
            {step === 3 && <SkillsAll draft={draft} setDraft={setDraft}/>}
            {step === 4 && <TemplateSelect draft={draft} setDraft={setDraft} onSave={handleSave}/>}
          </div>

          {/* ── Footer ── */}
          <div className={footer}>
            <button type="button" onClick={() => { if (confirm("Clear all draft data?")) clearDraft(); }}
              className={`cl-btn ${dark ? "cl-btn-d" : "cl-btn-l"}`}>
              Clear Draft
            </button>
            <div className="ft-nav">
              <button type="button" onClick={() => setStep(step-1)} disabled={step===1}
                className={`nb nb-sec ${dark ? "nb-sec-d" : "nb-sec-l"}`}>
                <ChevronLeft size={14}/> Previous
              </button>
              {step < 4 && (
                <button type="button" onClick={handleNext} className="nb nb-pri">
                  Next Step <ChevronRight size={14}/>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Figtree:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* ── Page ── */
.cv-page{min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:1.75rem 1rem;font-family:'Figtree',sans-serif;transition:background .3s}
.cv-page-l{background:linear-gradient(140deg,#f0f4ff 0%,#fafbff 50%,#f5f0ff 100%)}
.cv-page-d{background:linear-gradient(140deg,#0a0f1e 0%,#0f172a 60%,#0d1117 100%)}

/* ── Card ── */
.cv-card{width:100%;max-width:960px;border-radius:18px;overflow:hidden;border:1px solid;transition:background .3s,border-color .3s;box-shadow:0 20px 60px rgba(0,0,0,.12)}
.cv-card-l{background:#fff;border-color:#e2e8f0}
.cv-card-d{background:#111827;border-color:#1f2937}

/* ── Header ── */
.cv-hd{padding:1.25rem 1.75rem;transition:background .3s}
.cv-hd-l{background:linear-gradient(135deg,#1e40af,#3b82f6);border-bottom:1px solid rgba(255,255,255,.1)}
.cv-hd-d{background:linear-gradient(135deg,#0f172a,#1e3a8a);border-bottom:1px solid #1f2937}
.cv-hd-in{display:flex;align-items:center;gap:.85rem}
.cv-hd-text{flex:1}
.cv-logo{width:38px;height:38px;background:rgba(255,255,255,.15);border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0}
.cv-title{font-family:'Syne',sans-serif;font-size:1.15rem;font-weight:700;color:#fff}
.cv-sub{font-size:.76rem;color:rgba(255,255,255,.65);margin-top:.1rem}

/* Theme toggle */
.theme-btn{display:flex;align-items:center;gap:.4rem;padding:.42rem .85rem;border-radius:20px;font-size:.78rem;font-weight:600;font-family:'Figtree',sans-serif;cursor:pointer;border:1px solid rgba(255,255,255,.2);transition:all .2s;flex-shrink:0}
.theme-btn-l{background:rgba(255,255,255,.15);color:#fff}.theme-btn-l:hover{background:rgba(255,255,255,.25)}
.theme-btn-d{background:rgba(255,255,255,.08);color:rgba(255,255,255,.8)}.theme-btn-d:hover{background:rgba(255,255,255,.14)}

/* ── Progress ── */
.cv-prog{display:flex;align-items:center;padding:.95rem 1.75rem;border-bottom:1px solid;overflow-x:auto;gap:0;transition:background .3s,border-color .3s}
.cv-prog-l{background:#f8faff;border-color:#e2e8f0}
.cv-prog-d{background:#0f172a;border-color:#1f2937}
.pi{display:flex;align-items:center;flex-shrink:0}
.pc{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.76rem;font-weight:700;font-family:'Syne',sans-serif;flex-shrink:0;transition:all .25s}
.pc-done{background:#3b82f6;color:#fff;border:2px solid #3b82f6}
.pc-act{background:#fff;color:#3b82f6;border:2px solid #3b82f6;box-shadow:0 0 0 4px #dbeafe}
.pc-idle{background:transparent;color:#9ca3af;border:2px solid #d1d5db}
.pc-done-d{background:#3b82f6;border-color:#3b82f6}
.pc-act-d{background:#1f2937;color:#60a5fa;border-color:#3b82f6;box-shadow:0 0 0 4px rgba(59,130,246,.15)}
.pc-idle-d{border-color:#374151;color:#4b5563}
.pl{font-size:.74rem;font-weight:500;margin-left:.4rem;white-space:nowrap;transition:color .2s}
.pl-done{color:#3b82f6}.pl-act{color:#111827;font-weight:600}.pl-idle{color:#9ca3af}
.pl-done-d{color:#60a5fa}.pl-act-d{color:#f9fafb;font-weight:600}.pl-idle-d{color:#4b5563}
.pl-s{display:none}
.pline{flex:1;height:2px;margin:0 .4rem;min-width:14px;border-radius:2px;transition:background .3s}
.pline-done{background:#3b82f6}.pline-idle{background:#e2e8f0}.pline-idle-d{background:#1f2937}

/* ── Body ── */
.cv-body{padding:1.6rem 1.75rem}

/* ── Footer ── */
.cv-ft{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.85rem;padding:1rem 1.75rem;border-top:1px solid;transition:all .3s}
.cv-ft-l{background:#f8faff;border-color:#e2e8f0}
.cv-ft-d{background:#0f172a;border-color:#1f2937}
.ft-nav{display:flex;gap:.55rem}
.nb{display:inline-flex;align-items:center;gap:.3rem;padding:.5rem 1rem;border-radius:8px;font-size:.84rem;font-weight:600;font-family:'Figtree',sans-serif;cursor:pointer;transition:all .18s;border:none}
.nb:disabled{opacity:.38;cursor:not-allowed}
.nb-pri{background:#3b82f6;color:#fff}.nb-pri:hover:not(:disabled){background:#2563eb;transform:translateY(-1px);box-shadow:0 4px 14px rgba(59,130,246,.35)}
.nb-sec-l{background:#fff;color:#374151;border:1px solid #d1d5db}.nb-sec-l:hover:not(:disabled){background:#f1f5f9}
.nb-sec-d{background:#1f2937;color:#d1d5db;border:1px solid #374151}.nb-sec-d:hover:not(:disabled){background:#263048}
.cl-btn{font-size:.78rem;font-family:'Figtree',sans-serif;border-radius:7px;padding:.42rem .85rem;cursor:pointer;transition:background .15s;border:1px solid}
.cl-btn-l{color:#ef4444;background:transparent;border-color:#fecaca}.cl-btn-l:hover{background:#fef2f2}
.cl-btn-d{color:#f87171;background:transparent;border-color:#7f1d1d}.cl-btn-d:hover{background:#450a0a}

/* ── Fields ── */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:.9rem}
.span2{grid-column:1/-1}
.fg{display:flex;flex-direction:column;gap:.3rem}
.fl{font-size:.77rem;font-weight:600;letter-spacing:.015em}
.fl-l{color:#475569}.fl-d{color:#94a3b8}
.req{color:#ef4444;margin-left:.18rem}
.fw{display:flex;align-items:center;gap:.4rem;border:1.5px solid;border-radius:8px;padding:.48rem .65rem;transition:all .18s}
.fw-l{background:#fff;border-color:#d1d5db}.fw-l:focus-within{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.12)}
.fw-d{background:#1f2937;border-color:#374151}.fw-d:focus-within{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.15)}
.fe{border-color:#ef4444!important}
.fi-ic{flex-shrink:0;color:#94a3b8}
.fi-in{flex:1;border:none;outline:none;font-size:.84rem;font-family:'Figtree',sans-serif;background:transparent}
.fi-l{color:#0f172a}.fi-l::placeholder{color:#94a3b8}
.fi-d{color:#f1f5f9}.fi-d::placeholder{color:#4b5563}
.em{display:flex;align-items:center;gap:.25rem;font-size:.72rem;color:#ef4444;margin-top:.1rem}
.ta{width:100%;border:1.5px solid;border-radius:8px;padding:.55rem .65rem;font-size:.84rem;font-family:'Figtree',sans-serif;resize:vertical;outline:none;transition:all .18s;line-height:1.55}
.ta-l{background:#fff;border-color:#d1d5db;color:#0f172a}.ta-l::placeholder{color:#94a3b8}
.ta-l:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.12)}
.ta-d{background:#1f2937;border-color:#374151;color:#f1f5f9}.ta-d::placeholder{color:#4b5563}
.ta-d:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.15)}

/* ── Sections ── */
.secs{display:flex;flex-direction:column;gap:2rem}
.sec{display:flex;flex-direction:column;gap:.75rem}
.sec-hd{display:flex;justify-content:space-between;align-items:center;padding-bottom:.5rem;border-bottom:2px solid}
.sec-hd-l{border-color:#f1f5f9}
.sec-hd-d{border-color:#1f2937}
.sec-ttl{display:flex;align-items:center;gap:.4rem;font-family:'Syne',sans-serif;font-size:.95rem;font-weight:700}
.add-btn{display:inline-flex;align-items:center;gap:.25rem;font-size:.76rem;font-weight:600;font-family:'Figtree',sans-serif;border:none;border-radius:20px;padding:.28rem .7rem;cursor:pointer;transition:opacity .15s}
.add-btn:hover{opacity:.8}
.card{border:1px solid;border-radius:12px;padding:1rem;display:flex;flex-direction:column;gap:.85rem;transition:all .2s}
.card-l{background:#f8faff;border-color:#e2e8f0}
.card-d{background:#1a2234;border-color:#1f2937}
.rm-btn{display:flex;align-items:center;gap:.28rem;margin-left:auto;font-size:.73rem;font-family:'Figtree',sans-serif;color:#ef4444;background:none;border:none;cursor:pointer;opacity:.65;transition:opacity .15s}
.rm-btn:hover{opacity:1}

/* ── Skills grid ── */
.sk-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.9rem}
.sk-block{border:1px solid;border-radius:12px;padding:.95rem;display:flex;flex-direction:column;gap:.65rem;transition:all .2s}
.sk-block-l{background:#fdfdff;border-color:#e2e8f0}
.sk-block-d{background:#1a2234;border-color:#1f2937}
.sk-hd{display:flex;justify-content:space-between;align-items:center}
.sk-ttl{display:flex;align-items:center;gap:.38rem;font-family:'Syne',sans-serif;font-size:.82rem;font-weight:700}
.sk-add{display:inline-flex;align-items:center;gap:.22rem;font-size:.73rem;font-weight:600;font-family:'Figtree',sans-serif;border:none;border-radius:20px;padding:.25rem .62rem;cursor:pointer;transition:opacity .15s}
.sk-add:hover{opacity:.8}
.sk-row{display:flex;align-items:center;gap:.45rem}
.sk-in{flex:1;border:1.5px solid;border-radius:7px;padding:.42rem .58rem;font-size:.81rem;font-family:'Figtree',sans-serif;outline:none;transition:all .18s}
.sk-in-l{background:#fff;border-color:#d1d5db;color:#0f172a}.sk-in-l::placeholder{color:#94a3b8}
.sk-in-l:focus{border-color:var(--fc,#3b82f6);box-shadow:0 0 0 3px rgba(59,130,246,.1)}
.sk-in-d{background:#111827;border-color:#374151;color:#f1f5f9}.sk-in-d::placeholder{color:#4b5563}
.sk-in-d:focus{border-color:var(--fc,#3b82f6);box-shadow:0 0 0 3px rgba(59,130,246,.12)}
.rm-ic{color:#ef4444;background:none;border:none;cursor:pointer;opacity:.55;transition:opacity .15s;flex-shrink:0;padding:.2rem}
.rm-ic:hover{opacity:1}

/* ── Template selector ── */
.ts-wrap{display:grid;grid-template-columns:260px 1fr;gap:1.4rem;align-items:start}
.ts-left{display:flex;flex-direction:column;gap:.65rem}
.ts-hint{font-size:.76rem;font-style:italic}
.ts-hint-l{color:#64748b}.ts-hint-d{color:#4b5563}
.ts-cards{display:flex;flex-direction:column;gap:.5rem}
.tc{position:relative;display:flex;align-items:center;gap:.65rem;border:1.5px solid;border-radius:11px;padding:.65rem;cursor:pointer;transition:all .18s;width:100%;text-align:left}
.tc-l{background:#fff;border-color:#e2e8f0}.tc-l:hover{border-color:#3b82f6;box-shadow:0 2px 12px rgba(59,130,246,.1)}
.tc-d{background:#1a2234;border-color:#1f2937}.tc-d:hover{border-color:#3b82f6;box-shadow:0 2px 12px rgba(59,130,246,.12)}
.tc-sel{border-color:#3b82f6!important;background:rgba(59,130,246,.07)!important}
.tc-thumb{border-radius:6px;padding:5px;flex-shrink:0;border:1px solid}
.tc-thumb-l{background:#f8fafc;border-color:#e2e8f0}
.tc-thumb-d{background:#0f172a;border-color:#1f2937}
.tc-meta{display:flex;flex-direction:column;gap:.1rem;flex:1}
.tc-name{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:700;display:block;color:inherit}
.tc-desc{font-size:.7rem;display:block}
.tc-desc-l{color:#64748b}.tc-desc-d{color:#4b5563}

/* Action buttons */
.ts-actions{display:flex;flex-direction:column;gap:.5rem;margin-top:.3rem}
.act-btn{display:flex;align-items:center;justify-content:center;gap:.4rem;width:100%;padding:.58rem;border:none;border-radius:8px;font-size:.83rem;font-weight:600;font-family:'Figtree',sans-serif;cursor:pointer;transition:all .18s}
.act-btn:disabled{opacity:.5;cursor:not-allowed}
.act-save-l{background:#f1f5f9;color:#1e293b}.act-save-l:hover:not(:disabled){background:#e2e8f0}
.act-save-d{background:#1f2937;color:#cbd5e1}.act-save-d:hover:not(:disabled){background:#263048}
.act-dl{background:#0f172a;color:#fff}.act-dl:hover:not(:disabled){background:#1e293b;transform:translateY(-1px)}
.save-err{display:flex;align-items:center;gap:.3rem;font-size:.74rem;color:#ef4444}
@keyframes spin{to{transform:rotate(360deg)}}
.spin{animation:spin .7s linear infinite}

/* ── Preview ── */
.ts-right{display:flex;flex-direction:column;gap:.5rem}
.prev-bar{display:flex;align-items:center;gap:.4rem;font-size:.77rem;font-weight:600;padding:.45rem .7rem;border-radius:7px;border:1px solid}
.prev-bar-l{background:#f8faff;border-color:#e2e8f0;color:#475569}
.prev-bar-d{background:#0f172a;border-color:#1f2937;color:#64748b}
.live-badge{margin-left:auto;background:#dcfce7;color:#15803d;font-size:.63rem;font-weight:800;padding:2px 7px;border-radius:20px;letter-spacing:.04em}
.prev-viewport{width:100%;height:370px;overflow:hidden;border-radius:10px;position:relative;border:1.5px solid #e2e8f0;background:#f8fafc}
.prev-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:370px;border-radius:10px;border:1.5px dashed;font-size:.82rem;text-align:center;transition:all .2s}
.prev-empty-l{background:#f8faff;border-color:#e2e8f0;color:#94a3b8}
.prev-empty-d{background:#0f172a;border-color:#1f2937;color:#374151}

/* ── Responsive ── */
@media(max-width:720px){
  .cv-body,.cv-hd,.cv-ft,.cv-prog{padding-left:1.1rem;padding-right:1.1rem}
  .pl-f{display:none}.pl-s{display:inline}
  .g2,.sk-grid{grid-template-columns:1fr}
  .ts-wrap{grid-template-columns:1fr}
  .ts-right{order:-1}
  .theme-btn span{display:none}
}
@media(max-width:400px){
  .pc{width:24px;height:24px;font-size:.68rem}
  .pl{font-size:.68rem}
  .cv-title{font-size:1rem}
}
`;