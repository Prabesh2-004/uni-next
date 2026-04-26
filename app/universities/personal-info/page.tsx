"use client"

import { Input } from "@/components/ui/input"
import { BookText, Compass, User, Trophy, Plus, X, Sparkles } from "lucide-react"
import { useState, useRef, useCallback, useEffect, DragEvent, ChangeEvent } from "react";
import { uploadTranscriptToCloudinary } from "./uploadTranscript";
import { savePersonalInfo } from "./userPersonalInfo";

type Category = "Awards" | "Leadership" | "Gap Year" | "Extracurriculars";
type Item = { id: number; text: string };
export type Entries = Record<Category, Item[]>;

const CATEGORIES: Category[] = ["Awards", "Leadership", "Gap Year", "Extracurriculars"];
const COUNTRIES = ["Germany", "Canada", "United States", "Russia", "India"];
const LS_KEY = "personal-info-draft";

type UploadedFile = { file: File; preview: string };

export type FormData = {
    fullName: string;
    phone: string;
    school: string;
    countryFirst: string;
    countrySecond: string;
    targetUniversity: string;
    program: string;
    sat: string;
    act: string;
    ielts: string;
    toefl: string;
};

const DEFAULT_FORM: FormData = {
    fullName: "", phone: "", school: "",
    countryFirst: "", countrySecond: "",
    targetUniversity: "", program: "",
    sat: "", act: "", ielts: "", toefl: "",
};

const DEFAULT_ENTRIES: Entries = {
    Awards: [], Leadership: [], "Gap Year": [], Extracurriculars: [],
};

const PersonalInfo = () => {
    const [isOpenFirst, setIsOpenFirst] = useState(false);
    const [isOpenSecond, setIsOpenSecond] = useState(false);
    const [form, setForm] = useState<FormData>(DEFAULT_FORM);
    const [entries, setEntries] = useState<Entries>(DEFAULT_ENTRIES);
    const [active, setActive] = useState<Category | null>(null);
    const [input, setInput] = useState("");
    const [uploaded, setUploaded] = useState<UploadedFile[]>([]);
    const [dragging, setDragging] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(LS_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.form) setForm(parsed.form);
                if (parsed.entries) setEntries(parsed.entries);
            }
        } catch { /* ignore */ }
    }, []);

    // Auto-save form + entries to localStorage
    useEffect(() => {
        if (submitted) return;
        try {
            localStorage.setItem(LS_KEY, JSON.stringify({ form, entries }));
        } catch { /* ignore */ }
    }, [form, entries, submitted]);

    const setField = (key: keyof FormData) =>
        (e: ChangeEvent<HTMLInputElement>) =>
            setForm(prev => ({ ...prev, [key]: e.target.value }));

    // File upload
    const processFiles = useCallback((files: FileList | null) => {
        if (!files) return;
        const allowed = ["image/jpeg", "image/png", "application/pdf"];
        Array.from(files).forEach((file) => {
            if (!allowed.includes(file.type) || file.size > 10 * 1024 * 1024) return;
            const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : "";
            setUploaded(prev => [...prev, { file, preview }]);
        });
    }, []);

    const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files);
    }, [processFiles]);

    const onDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = () => setDragging(false);

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files); e.target.value = "";
    };

    const removeFile = (index: number) => {
        setUploaded(prev => {
            const copy = [...prev];
            if (copy[index].preview) URL.revokeObjectURL(copy[index].preview);
            copy.splice(index, 1);
            return copy;
        });
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Achievements
    const handleCategoryClick = (cat: Category) => {
        setActive(prev => prev === cat ? null : cat);
        setInput("");
    };

    const addItem = () => {
        if (!active || !input.trim()) return;
        setEntries(prev => ({
            ...prev,
            [active]: [...prev[active], { id: Date.now(), text: input.trim() }],
        }));
        setInput("");
    };

    const removeItem = (cat: Category, id: number) =>
        setEntries(prev => ({ ...prev, [cat]: prev[cat].filter(i => i.id !== id) }));

    const totalCount = Object.values(entries).flat().length;

    // Submit
    const handleSubmit = async () => {
        try {
            // Upload all files to Cloudinary, take the last URL (or adjust logic)
            let transcriptUrl: string | undefined;
            if (uploaded.length > 0) {
                const urls = await Promise.all(
                    uploaded.map(u => uploadTranscriptToCloudinary(u.file))
                );
                transcriptUrl = urls[urls.length - 1]; // or store all as array if needed
            }

            // Save form data + transcript URL to Supabase
            await savePersonalInfo(form, entries, transcriptUrl);

            // Cleanup
            uploaded.forEach(u => { if (u.preview) URL.revokeObjectURL(u.preview); });
            localStorage.removeItem(LS_KEY);
            setForm(DEFAULT_FORM);
            setEntries(DEFAULT_ENTRIES);
            setUploaded([]);
            setActive(null);
            setInput("");
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);

        } catch (err) {
            console.error("Failed to submit:", err);
        }
    };

    const ChevronIcon = ({ open }: { open: boolean }) => (
        <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );

    const cardClass = "w-full flex flex-col mb-3 items-start border dark:border-gray-700 border-gray-200 shadow-sm p-5 rounded-xl dark:bg-[#0a0a0a] bg-white";

    return (
        <div className="w-full flex flex-col items-start max-w-3xl m-auto pt-4 pb-16 px-4">
            <div className="flex flex-col gap-2 mb-8">
                <h2 className="text-xl font-semibold">Get Personalized Recommendations</h2>
                <p className="text-sm text-gray-500">Complete your academic profile to let our AI match you with the best-fit universities worldwide.</p>
            </div>

            {submitted && (
                <div className="w-full mb-4 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                    ✓ Profile submitted successfully! Draft cleared.
                </div>
            )}

            <div className="w-full">
                {/* Personal Info */}
                <div className={cardClass}>
                    <h1 className="flex gap-2 items-center text-sm font-semibold mb-4">
                        <User className="text-green-500 w-5 h-5" /> Personal Info
                    </h1>
                    <div className="flex w-full gap-5 mb-3">
                        <div className="w-full">
                            <label htmlFor="full_name" className="text-sm text-gray-600 dark:text-gray-400">Full Name</label>
                            <Input id="full_name" placeholder="Full Name" className="mt-2" autoComplete="name"
                                value={form.fullName} onChange={setField("fullName")} required />
                        </div>
                        <div className="w-full">
                            <label htmlFor="phone" className="text-sm text-gray-600 dark:text-gray-400">Phone</label>
                            <Input id="phone" placeholder="+977 9876543210" className="mt-2" autoComplete="tel"
                                value={form.phone} onChange={setField("phone")} required />
                        </div>
                    </div>
                    <div className="w-full">
                        <label htmlFor="school" className="text-sm text-gray-600 dark:text-gray-400">Current School / Institution</label>
                        <Input id="school" placeholder="Name of your high school or current university" className="mt-2"
                            value={form.school} onChange={setField("school")} required />
                    </div>
                </div>

                {/* Preferences */}
                <div className={cardClass}>
                    <h1 className="flex gap-2 items-center text-sm font-semibold mb-4">
                        <Compass className="text-green-500 w-5 h-5" /> Preferences
                    </h1>
                    <div className="flex flex-col w-full gap-5">
                        <div className="flex w-full gap-5">
                            {/* Country First */}
                            <div className="flex flex-col w-full text-sm relative">
                                <label className="mb-2 text-gray-600 dark:text-gray-400">Country of First Choice</label>
                                <button type="button" onClick={() => { setIsOpenFirst(p => !p); setIsOpenSecond(false); }}
                                    className="w-full text-left px-4 pr-2 py-2 border rounded-lg dark:bg-black bg-white text-gray-500 dark:border-gray-700 border-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all">
                                    <span className={form.countryFirst ? "dark:text-white text-gray-800" : ""}>{form.countryFirst || "Select country"}</span>
                                    <ChevronIcon open={isOpenFirst} />
                                </button>
                                {isOpenFirst && (
                                    <ul className="w-full bg-white dark:bg-[#111] absolute top-[4.5rem] z-10 border dark:border-gray-700 border-gray-200 rounded-lg shadow-lg py-1">
                                        {COUNTRIES.map(c => (
                                            <li key={c} className="px-4 py-2 hover:bg-emerald-500 hover:text-white cursor-pointer text-sm dark:text-gray-200 transition-colors"
                                                onClick={() => { setForm(p => ({ ...p, countryFirst: c })); setIsOpenFirst(false); }}>
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Country Second */}
                            <div className="flex flex-col w-full text-sm relative">
                                <label className="mb-2 text-gray-600 dark:text-gray-400">Country of Second Choice</label>
                                <button type="button" onClick={() => { setIsOpenSecond(p => !p); setIsOpenFirst(false); }}
                                    className="w-full text-left px-4 pr-2 py-2 border rounded-lg dark:bg-black bg-white text-gray-500 dark:border-gray-700 border-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all">
                                    <span className={form.countrySecond ? "dark:text-white text-gray-800" : ""}>{form.countrySecond || "Select country"}</span>
                                    <ChevronIcon open={isOpenSecond} />
                                </button>
                                {isOpenSecond && (
                                    <ul className="w-full bg-white dark:bg-[#111] absolute top-[4.5rem] z-10 border dark:border-gray-700 border-gray-200 rounded-lg shadow-lg py-1">
                                        {COUNTRIES.map(c => (
                                            <li key={c} className="px-4 py-2 hover:bg-emerald-500 hover:text-white cursor-pointer text-sm dark:text-gray-200 transition-colors"
                                                onClick={() => { setForm(p => ({ ...p, countrySecond: c })); setIsOpenSecond(false); }}>
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="w-full">
                                <label htmlFor="target_university" className="text-sm text-gray-600 dark:text-gray-400">Targeted University (optional)</label>
                                <Input id="target_university" placeholder="e.g. Cambridge University" className="mt-2"
                                    value={form.targetUniversity} onChange={setField("targetUniversity")} />
                            </div>
                            <div className="w-full">
                                <label htmlFor="program" className="text-sm text-gray-600 dark:text-gray-400">Program Choice</label>
                                <Input id="program" placeholder="e.g. BSc Computer Science" className="mt-2"
                                    value={form.program} onChange={setField("program")} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Academic Record */}
                <div className={cardClass}>
                    <h1 className="flex gap-2 items-center text-sm font-semibold mb-4">
                        <BookText className="text-green-500 w-5 h-5" /> Academic Record
                    </h1>
                    <div className="w-full">
                        {/* Drop Zone */}
                        <div className="rounded-xl dark:bg-[#101010] bg-[#f8f8f8] p-6">
                            <p className="text-xs tracking-[0.2em] uppercase text-gray-400 font-medium mb-1">Document Upload</p>
                            <h3 className="text-lg font-semibold mb-4 dark:text-white text-gray-800">Upload Transcripts</h3>

                            <div onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                                onClick={() => inputRef.current?.click()}
                                className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 p-8
                                    flex flex-col items-center justify-center text-center gap-3 group
                                    ${dragging
                                        ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 scale-[1.01]"
                                        : "border-gray-300 dark:border-gray-700 bg-white dark:bg-black hover:border-gray-400 dark:hover:border-gray-500"}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                                    ${dragging ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"}`}>
                                    <svg className={`w-5 h-5 transition-all duration-300 ${dragging ? "-translate-y-0.5 text-emerald-500" : "text-gray-400 group-hover:-translate-y-0.5"}`}
                                        fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M12 16v-8m0 0-3 3m3-3 3 3M6.5 19a4.5 4.5 0 0 1-.25-8.99A5.5 5.5 0 0 1 17.45 10H18a4 4 0 0 1 .25 7.98" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium dark:text-gray-200 text-gray-700">
                                        Drop files here or <span className="text-emerald-600 underline underline-offset-2">browse</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">PDF, JPEG or PNG · Max 10 MB</p>
                                </div>
                                <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden" onChange={onFileChange} />
                            </div>

                            {uploaded.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {uploaded.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3 group transition-all hover:border-gray-300">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                {item.preview ? (
                                                    <img src={item.preview} alt={item.file.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <p className="text-sm font-medium dark:text-white text-gray-800 truncate">{item.file.name}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{formatSize(item.file.size)}</p>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Test Scores */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                            {[
                                { id: "sat", label: "SAT Score", placeholder: "1600", field: "sat" as keyof FormData },
                                { id: "act", label: "ACT Score", placeholder: "36", field: "act" as keyof FormData },
                                { id: "ielts", label: "IELTS Score", placeholder: "9.0", field: "ielts" as keyof FormData },
                                { id: "toefl", label: "TOEFL Score", placeholder: "120", field: "toefl" as keyof FormData },
                            ].map(({ id, label, placeholder, field }) => (
                                <div key={id}>
                                    <label htmlFor={id} className="text-sm text-gray-600 dark:text-gray-400">{label}</label>
                                    <Input id={id} placeholder={placeholder} className="mt-2" type="number" min={0}
                                        value={form[field]} onChange={setField(field)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Achievements & Activities */}
                <div className={cardClass}>
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-sm font-semibold">Achievements &amp; Activities</h2>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                        {CATEGORIES.map((cat) => {
                            const count = entries[cat].length;
                            const isActive = active === cat;
                            return (
                                <button key={cat} onClick={() => handleCategoryClick(cat)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150
                                        ${isActive ? "bg-gray-800 dark:bg-white text-white dark:text-gray-900 border-gray-800 dark:border-white"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
                                    <Plus className="w-3.5 h-3.5" />
                                    {cat}
                                    {count > 0 && (
                                        <span className={`ml-0.5 text-xs rounded-full px-1.5 py-0.5 font-semibold
                                            ${isActive ? "bg-white dark:bg-gray-900 text-gray-800 dark:text-white" : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200"}`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {active && (
                        <div className="mb-4 flex gap-2">
                            <input autoFocus type="text" value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addItem()}
                                placeholder={`Add ${active}...`}
                                className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:text-white text-gray-800 placeholder-gray-400" />
                            <button onClick={addItem} disabled={!input.trim()}
                                className="px-4 py-2 bg-gray-800 dark:bg-white text-white dark:text-gray-900 text-sm rounded-lg hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                Add
                            </button>
                        </div>
                    )}

                    {totalCount > 0 && (
                        <div className="space-y-3 mb-4">
                            {CATEGORIES.map((cat) => {
                                const items = entries[cat];
                                if (!items.length) return null;
                                return (
                                    <div key={cat}>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{cat}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {items.map(item => (
                                                <span key={item.id}
                                                    className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs px-3 py-1.5 rounded-full">
                                                    {item.text}
                                                    <button onClick={() => removeItem(cat, item.id)}
                                                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <p className="text-xs text-gray-400 italic">
                        Add any notable honors, clubs, or experience to strengthen your recommendation profile.
                    </p>
                </div>

                {/* Submit */}
                <button onClick={handleSubmit}
                    className="mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-sm flex gap-2 items-center px-5">
                    Get AI Recommendations <Sparkles size={18} />
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">Your progress is auto-saved locally.</p>
            </div>
        </div>
    );
};

export default PersonalInfo;