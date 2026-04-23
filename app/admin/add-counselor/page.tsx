import CreateCounselor from "@/components/add-clounselors";

export const dynamic = 'force-dynamic';

export default function AddCounselor() {
  return(
    <CreateCounselor />
  )
}

// "use client";

// import React, { useState } from "react";
// import {
//   User, GraduationCap, Briefcase, ShieldCheck,
//   ChevronRight, ChevronLeft, Check, Eye, EyeOff,
//   AlertCircle, CheckCircle2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { createClient } from "@/lib/supabase/client";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface FormData {
//   firstName: string; lastName: string; email: string;
//   password: string; phone: string; degree: string;
//   fieldOfStudy: string; instituteName: string; graduationYear: string;
//   workplaceName: string; jobTitle: string; startDate: string;
//   endDate: string; description: string; licenseNumber: string;
//   licensingAuthority: string; issueDate: string; expiryDate: string;
// }

// type FormErrors = Partial<Record<keyof FormData, string>>;
// type StepId = 1 | 2 | 3 | 4;

// // ─── Constants ────────────────────────────────────────────────────────────────

// const STEPS = [
//   { id: 1 as StepId, label: "Personal Info", icon: User },
//   { id: 2 as StepId, label: "Education",     icon: GraduationCap },
//   { id: 3 as StepId, label: "Experience",    icon: Briefcase },
//   { id: 4 as StepId, label: "License",       icon: ShieldCheck },
// ];

// const BLANK: FormData = {
//   firstName: "", lastName: "", email: "", password: "", phone: "",
//   degree: "", fieldOfStudy: "", instituteName: "", graduationYear: "",
//   workplaceName: "", jobTitle: "", startDate: "", endDate: "",
//   description: "", licenseNumber: "", licensingAuthority: "",
//   issueDate: "", expiryDate: "",
// };

// const STEP_TITLES = [
//   "Personal Information", "Educational Background",
//   "Work Experience", "License & Certification",
// ];

// // ─── Shared Field Wrapper ─────────────────────────────────────────────────────

// interface FieldProps {
//   label: string;
//   error?: string;
//   required?: boolean;
//   wide?: boolean;
//   children: React.ReactNode;
//   htmlFor?: string;
// }

// const Field = ({ label, error, required, wide, children, htmlFor }: FieldProps) => (
//   <div className={wide ? "sm:col-span-2" : ""}>
//     <Label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//       {label}{required && <span className="text-red-500 ml-1">*</span>}
//     </Label>
//     {children}
//     {error && (
//       <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
//         <AlertCircle size={11} />{error}
//       </p>
//     )}
//   </div>
// );

// // ─── Step Components ──────────────────────────────────────────────────────────

// interface StepProps {
//   data: FormData;
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
//   errors: FormErrors;
// }

// const StepPersonal = ({ data, onChange, errors }: StepProps) => {
//   const [showPass, setShowPass] = useState(false);
//   const checks = [
//     { label: "8+ chars",  ok: data.password.length >= 8 },
//     { label: "Uppercase", ok: /[A-Z]/.test(data.password) },
//     { label: "Number",    ok: /\d/.test(data.password) },
//   ];
//   const score = checks.filter((c) => c.ok).length;
//   const barColor = (["bg-red-400", "bg-amber-400", "bg-green-500"] as const)[score - 1] ?? "";

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//       <Field label="First Name" required error={errors.firstName} htmlFor="firstName">
//         <Input id="firstName" name="firstName" value={data.firstName} onChange={onChange} placeholder="Jane" />
//       </Field>
//       <Field label="Last Name" required error={errors.lastName} htmlFor="lastName">
//         <Input id="lastName" name="lastName" value={data.lastName} onChange={onChange} placeholder="Smith" />
//       </Field>
//       <Field label="Email Address" required error={errors.email} htmlFor="email">
//         <Input id="email" type="email" name="email" value={data.email} onChange={onChange} placeholder="jane@example.com" />
//       </Field>
//       <Field label="Phone Number" error={errors.phone} htmlFor="phone">
//         <Input id="phone" type="tel" name="phone" value={data.phone} onChange={onChange} placeholder="+1 (555) 000-0000" />
//       </Field>
//       <Field label="Password" required error={errors.password} wide htmlFor="password">
//         <div className="relative">
//           <Input
//             id="password"
//             type={showPass ? "text" : "password"}
//             name="password"
//             value={data.password}
//             onChange={onChange}
//             placeholder="Min. 8 characters"
//             className="pr-9"
//           />
//           <button
//             type="button"
//             onClick={() => setShowPass((p) => !p)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//           >
//             {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
//           </button>
//         </div>
//       </Field>
//       {data.password && (
//         <div className="sm:col-span-2 space-y-2">
//           <div className="flex gap-1.5">
//             {[0, 1, 2].map((i) => (
//               <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < score ? barColor : "bg-gray-200 dark:bg-gray-700"}`} />
//             ))}
//           </div>
//           <div className="flex flex-wrap gap-4">
//             {checks.map((c) => (
//               <span key={c.label} className={`flex items-center gap-1 text-xs ${c.ok ? "text-green-500" : "text-gray-400"}`}>
//                 <Check size={10} />{c.label}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const StepEducation = ({ data, onChange, errors }: StepProps) => (
//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//     <Field label="Degree" required error={errors.degree} htmlFor="degree">
//       <Input id="degree" name="degree" value={data.degree} onChange={onChange} placeholder="e.g. Master of Science" />
//     </Field>
//     <Field label="Field of Study" required error={errors.fieldOfStudy} htmlFor="fieldOfStudy">
//       <Input id="fieldOfStudy" name="fieldOfStudy" value={data.fieldOfStudy} onChange={onChange} placeholder="e.g. Clinical Psychology" />
//     </Field>
//     <Field label="Institution Name" required error={errors.instituteName} wide htmlFor="instituteName">
//       <Input id="instituteName" name="instituteName" value={data.instituteName} onChange={onChange} placeholder="e.g. Stanford University" />
//     </Field>
//     <Field label="Graduation Year" required error={errors.graduationYear} htmlFor="graduationYear">
//       <Select
//         value={data.graduationYear}
//         onValueChange={(val) => onChange({ target: { name: "graduationYear", value: val } } as React.ChangeEvent<HTMLSelectElement>)}
//       >
//         <SelectTrigger id="graduationYear">
//           <SelectValue placeholder="Select year" />
//         </SelectTrigger>
//         <SelectContent>
//           {Array.from({ length: 50 }, (_, i) => 2025 - i).map((y) => (
//             <SelectItem key={y} value={String(y)}>{y}</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </Field>
//   </div>
// );

// const StepExperience = ({ data, onChange, errors }: StepProps) => {
//   const [current, setCurrent] = useState(!data.endDate);
//   const toggle = () => {
//     setCurrent((c) => {
//       if (!c) onChange({ target: { name: "endDate", value: "" } } as React.ChangeEvent<HTMLInputElement>);
//       return !c;
//     });
//   };
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//       <Field label="Workplace Name" required error={errors.workplaceName} htmlFor="workplaceName">
//         <Input id="workplaceName" name="workplaceName" value={data.workplaceName} onChange={onChange} placeholder="e.g. City Mental Health Clinic" />
//       </Field>
//       <Field label="Job Title" required error={errors.jobTitle} htmlFor="jobTitle">
//         <Input id="jobTitle" name="jobTitle" value={data.jobTitle} onChange={onChange} placeholder="e.g. Senior Counselor" />
//       </Field>
//       <Field label="Start Date" required error={errors.startDate} htmlFor="startDate">
//         <Input id="startDate" type="date" name="startDate" value={data.startDate} onChange={onChange} />
//       </Field>
//       <Field label="End Date" error={errors.endDate} htmlFor="endDate">
//         <Input
//           id="endDate"
//           type="date"
//           name="endDate"
//           value={data.endDate}
//           onChange={onChange}
//           disabled={current}
//           className={current ? "opacity-40 cursor-not-allowed" : ""}
//         />
//       </Field>
//       <div className="sm:col-span-2 flex items-center gap-2">
//         <Checkbox id="currentJob" checked={current} onCheckedChange={toggle} />
//         <Label htmlFor="currentJob" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
//           I currently work here
//         </Label>
//       </div>
//       <Field label="Role Description" error={errors.description} wide htmlFor="description">
//         <Textarea
//           id="description"
//           name="description"
//           value={data.description}
//           onChange={onChange}
//           placeholder="Describe key responsibilities, specializations, and notable outcomes..."
//           rows={4}
//           className="resize-none"
//         />
//       </Field>
//     </div>
//   );
// };

// const StepLicense = ({ data, onChange, errors }: StepProps) => {
//   const [agreed, setAgreed] = useState(false);
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//       <Field label="License Number" required error={errors.licenseNumber} htmlFor="licenseNumber">
//         <Input id="licenseNumber" name="licenseNumber" value={data.licenseNumber} onChange={onChange} placeholder="e.g. LPC-12345" />
//       </Field>
//       <Field label="Licensing Authority" required error={errors.licensingAuthority} htmlFor="licensingAuthority">
//         <Input id="licensingAuthority" name="licensingAuthority" value={data.licensingAuthority} onChange={onChange} placeholder="e.g. State Board of Counselors" />
//       </Field>
//       <Field label="Issue Date" required error={errors.issueDate} htmlFor="issueDate">
//         <Input id="issueDate" type="date" name="issueDate" value={data.issueDate} onChange={onChange} />
//       </Field>
//       <Field label="Expiry Date" required error={errors.expiryDate} htmlFor="expiryDate">
//         <Input id="expiryDate" type="date" name="expiryDate" value={data.expiryDate} onChange={onChange} />
//       </Field>
//       <div className="sm:col-span-2 flex gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
//         <AlertCircle size={17} className="text-amber-500 shrink-0 mt-0.5" />
//         <div>
//           <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Verification Required</p>
//           <p className="text-xs text-amber-600 dark:text-amber-500 mt-1 leading-relaxed">
//             The license will be verified with the issuing authority before the counselor&apos;s profile goes live. This takes 1–2 business days.
//           </p>
//         </div>
//       </div>
//       <div className="sm:col-span-2 flex items-start gap-2.5">
//         <Checkbox id="terms" checked={agreed} onCheckedChange={(v) => setAgreed(Boolean(v))} className="mt-0.5" />
//         <Label htmlFor="terms" className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed cursor-pointer">
//           I confirm all information is accurate and the counselor agrees to the{" "}
//           <span className="text-blue-500 hover:underline cursor-pointer">Terms of Service</span> and{" "}
//           <span className="text-blue-500 hover:underline cursor-pointer">Privacy Policy</span>.
//         </Label>
//       </div>
//     </div>
//   );
// };

// // ─── Validators ───────────────────────────────────────────────────────────────

// const validators: Record<StepId, (d: FormData) => FormErrors> = {
//   1: (d) => {
//     const e: FormErrors = {};
//     if (!d.firstName.trim()) e.firstName = "Required";
//     if (!d.lastName.trim())  e.lastName  = "Required";
//     if (!d.email.trim())     e.email     = "Required";
//     else if (!/\S+@\S+\.\S+/.test(d.email)) e.email = "Invalid email";
//     if (!d.password)              e.password = "Required";
//     else if (d.password.length < 8) e.password = "Min 8 characters";
//     return e;
//   },
//   2: (d) => {
//     const e: FormErrors = {};
//     if (!d.degree.trim())        e.degree        = "Required";
//     if (!d.fieldOfStudy.trim())  e.fieldOfStudy  = "Required";
//     if (!d.instituteName.trim()) e.instituteName = "Required";
//     if (!d.graduationYear)       e.graduationYear = "Required";
//     return e;
//   },
//   3: (d) => {
//     const e: FormErrors = {};
//     if (!d.workplaceName.trim()) e.workplaceName = "Required";
//     if (!d.jobTitle.trim())      e.jobTitle      = "Required";
//     if (!d.startDate)            e.startDate     = "Required";
//     return e;
//   },
//   4: (d) => {
//     const e: FormErrors = {};
//     if (!d.licenseNumber.trim())      e.licenseNumber      = "Required";
//     if (!d.licensingAuthority.trim()) e.licensingAuthority = "Required";
//     if (!d.issueDate)  e.issueDate  = "Required";
//     if (!d.expiryDate) e.expiryDate = "Required";
//     return e;
//   },
// };

// // ─── Main Component ───────────────────────────────────────────────────────────

// type Status = "idle" | "loading" | "success" | "error";

// const CreateCounselor = () => {
//   const [step, setStep]         = useState<StepId>(1);
//   const [errors, setErrors]     = useState<FormErrors>({});
//   const [status, setStatus]     = useState<Status>("idle");
//   const [formData, setFormData] = useState<FormData>(BLANK);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//     if (errors[name as keyof FormData]) {
//       setErrors((p) => ({ ...p, [name]: undefined }));
//     }
//   };

//   const next = () => {
//     const errs = validators[step](formData);
//     if (Object.keys(errs).length) { setErrors(errs); return; }
//     setErrors({});
//     setStep((s) => (s + 1) as StepId);
//   };

//   const back = () => {
//     setErrors({});
//     setStep((s) => (s - 1) as StepId);
//   };

//   const submit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   const errs = validators[4](formData);
//   if (Object.keys(errs).length) { setErrors(errs); return; }
//   setStatus("loading");
//   try {
//     const supabase = createClient();

//     // 1. Create auth user
//     const { data: authData, error: authError } = await supabase.auth.admin.createUser({
//       email: formData.email,
//       password: formData.password,
//       email_confirm: true,
//     });
//     if (authError) throw authError;

//     const userId = authData.user.id;

//     // 2. Insert into counselor (parent)
//     const { error: counselorError } = await supabase.from("counselor").insert({
//       id: userId,
//       first_name: formData.firstName,
//       last_name: formData.lastName,
//       email: formData.email,
//       phone: formData.phone,
//     });
//     if (counselorError) throw counselorError;

//     // 3. Insert into counselor_education
//     const { error: eduError } = await supabase.from("counselor_education").insert({
//       id: userId,
//       degree: formData.degree,
//       field_of_study: formData.fieldOfStudy,
//       institute_name: formData.instituteName,
//       graduation_year: formData.graduationYear,
//     });
//     if (eduError) throw eduError;

//     // 4. Insert into counselor_experience
//     const { error: expError } = await supabase.from("counselor_experience").insert({
//       id: userId,
//       workplace_name: formData.workplaceName,
//       job_title: formData.jobTitle,
//       start_date: formData.startDate,
//       end_date: formData.endDate || null,
//       is_current: !formData.endDate,
//       description: formData.description || null,
//     });
//     if (expError) throw expError;

//     // 5. Insert into counselor_license
//     const { error: licError } = await supabase.from("counselor_license").insert({
//       id: userId,
//       license_number: formData.licenseNumber,
//       licensing_authority: formData.licensingAuthority,
//       issue_date: formData.issueDate,
//       expiry_date: formData.expiryDate,
//     });
//     if (licError) throw licError;

//     setStatus("success");
//   } catch {
//     setStatus("error");
//   }
// };

//   const reset = () => { setFormData(BLANK); setStep(1); setErrors({}); setStatus("idle"); };

//   if (status === "success") return (
//     <div className="flex flex-col items-center justify-center min-h-[72vh] p-6 text-center">
//       <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 ring-4 ring-green-200 dark:ring-green-900 flex items-center justify-center mb-5">
//         <CheckCircle2 size={38} className="text-green-500" />
//       </div>
//       <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Counselor Created!</h2>
//       <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-8 leading-relaxed">
//         <span className="font-semibold text-gray-700 dark:text-gray-200">{formData.firstName} {formData.lastName}</span>&apos;s profile is pending license verification.
//       </p>
//       <div className="flex gap-3 flex-wrap justify-center">
//         <Button onClick={reset}>Add Another</Button>
//         <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
//       </div>
//     </div>
//   );

//   const StepIcon = STEPS[step - 1].icon;
//   const progress = ((step - 1) / 3) * 100 + 25;

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Add New Counselor</h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete all four steps to register a counselor.</p>
//       </div>

//       {/* Desktop step track */}
//       <div className="hidden sm:flex items-center mb-4">
//         {STEPS.map((s, idx) => {
//           const Icon = s.icon;
//           const done = s.id < step;
//           const active = s.id === step;
//           return (
//             <React.Fragment key={s.id}>
//               <div className="flex flex-col items-center gap-1.5">
//                 <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${done ? "bg-blue-500 border-blue-500 text-white" : active ? "border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-300 dark:border-gray-700 text-gray-400"}`}>
//                   {done ? <Check size={15} /> : <Icon size={15} />}
//                 </div>
//                 <span className={`text-xs font-medium whitespace-nowrap ${active ? "text-blue-600 dark:text-blue-400" : done ? "text-gray-600 dark:text-gray-300" : "text-gray-400"}`}>
//                   {s.label}
//                 </span>
//               </div>
//               {idx < STEPS.length - 1 && (
//                 <div className={`flex-1 h-0.5 mb-5 mx-2 transition-colors duration-500 ${s.id < step ? "bg-blue-400" : "bg-gray-200 dark:bg-gray-700"}`} />
//               )}
//             </React.Fragment>
//           );
//         })}
//       </div>

//       {/* Progress bar */}
//       <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-6">
//         <div
//           className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
//           style={{ width: `${progress}%` }}
//         />
//       </div>

//       {/* Mobile step label */}
//       <div className="flex justify-between text-xs mb-5 sm:hidden">
//         <span className="text-gray-400">Step {step} of 4</span>
//         <span className="font-semibold text-blue-500">{STEPS[step - 1].label}</span>
//       </div>

//       {/* Card */}
//       <form onSubmit={submit}>
//         <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
//           {/* Header */}
//           <div className="flex items-center gap-3 px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-800">
//             <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-500 shrink-0">
//               <StepIcon size={19} />
//             </div>
//             <div>
//               <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Step {step} / 4</p>
//               <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">{STEP_TITLES[step - 1]}</h2>
//             </div>
//           </div>

//           {/* Body */}
//           <div className="p-5 sm:p-6">
//             {step === 1 && <StepPersonal  data={formData} onChange={handleChange} errors={errors} />}
//             {step === 2 && <StepEducation data={formData} onChange={handleChange} errors={errors} />}
//             {step === 3 && <StepExperience data={formData} onChange={handleChange} errors={errors} />}
//             {step === 4 && <StepLicense   data={formData} onChange={handleChange} errors={errors} />}
//           </div>

//           {/* Footer */}
//           <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 rounded-b-2xl gap-3">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={back}
//               disabled={step === 1}
//               className={step === 1 ? "invisible" : ""}
//             >
//               <ChevronLeft size={15} />Back
//             </Button>

//             <div className="flex gap-1.5 items-center">
//               {STEPS.map((s) => (
//                 <div
//                   key={s.id}
//                   className={`rounded-full transition-all duration-300 ${s.id === step ? "w-5 h-2 bg-blue-500" : s.id < step ? "w-2 h-2 bg-blue-400" : "w-2 h-2 bg-gray-300 dark:bg-gray-700"}`}
//                 />
//               ))}
//             </div>

//             {step < 4 ? (
//               <Button type="button" onClick={next}>
//                 Continue<ChevronRight size={15} />
//               </Button>
//             ) : (
//               <Button
//                 type="submit"
//                 disabled={status === "loading"}
//                 className="bg-green-500 hover:bg-green-600"
//               >
//                 {status === "loading" ? (
//                   <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
//                 ) : (
//                   <><Check size={15} />Create Counselor</>
//                 )}
//               </Button>
//             )}
//           </div>
//         </div>

//         {status === "error" && (
//           <div className="mt-4 flex gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
//             <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
//             <div>
//               <p className="text-sm font-semibold text-red-700 dark:text-red-400">Submission Failed</p>
//               <p className="text-xs text-red-500 mt-0.5">Something went wrong. Please check the details and try again.</p>
//             </div>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default CreateCounselor;
