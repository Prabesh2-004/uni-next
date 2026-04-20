"use client";
import {
  Calendar,
  Check,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Mail,
  MessageSquare,
  Ban,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAvailableDates, AvailableDate } from "@/lib/available-date";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";


interface CounselorExperience {
  id: string;
  job_title: string;
  start_date: string;
  end_date: string | null;
  workplace_name: string;
  is_current: boolean;
  description: string | null;
}

interface CounselorEducation {
  id: string;
  degree: string;
  field_of_study: string;
  institution_name: string;
  graduation_year: string;
}

interface Counselor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string;
  is_active: boolean;
  counselor_experience: CounselorExperience | null;
  counselor_education: CounselorEducation | null;
}

interface StepsBar {
  step: number;
  stepInfo: string;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  details: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

interface BookingState {
  counselor: Counselor | null;
  date: AvailableDate | null;
  time: string | null;
  personalInfo: UserFormData | null;
}

const times = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

const stepsBar: StepsBar[] = [
  { step: 1, stepInfo: "Counselor" },
  { step: 2, stepInfo: "Date & Time" },
  { step: 3, stepInfo: "Your Info" },
  { step: 4, stepInfo: "Confirm" },
];

export default function Booking() {
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [counselorsData, setCounselorsData] = useState<Counselor[]>([]);
  const [booking, setBooking] = useState<BookingState>({
    counselor: null,
    date: null,
    time: null,
    personalInfo: null,
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("counselor")
        .select(`
          id, first_name, last_name, email, phone, avatar, is_active,
          counselor_experience!counselor_experience_counselor_id_fkey(*),
          counselor_education!counselor_education_counselor_id_fkey(*)
        `)
        .eq('is_active', true);
      setCounselorsData((data as unknown as Counselor[]) || []);
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const metadata = user?.id;
      await supabase.from("booking").insert({
        user_id: metadata,
        counselor_id: booking.counselor?.id,
        full_name: booking.personalInfo?.name,
        email: booking.personalInfo?.email,
        phone: booking.personalInfo?.phone,
        description: booking.personalInfo?.details,
        appointment_date: booking.date,
        appointment_time: booking.time,
      });
      setSubmitted(true)
      setStep(0)
      setBooking({ counselor: null, date: null, time: null, personalInfo: null });
      setFormData({ name: "", email: "", phone: "", details: "" });
      localStorage.removeItem("booking");
      localStorage.removeItem("bookingForm");
      localStorage.removeItem("steps");


      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: booking.personalInfo?.email,
          counselorName: `${booking.counselor?.first_name} ${booking.counselor?.last_name}`,
          name: `${booking.personalInfo?.name}`,
          date: `${booking.date?.day}, ${booking.date?.month} ${booking.date?.date}`,
          time: booking.time,
        }),
      });
    } catch { }
  };

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    details: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    const savedSteps = localStorage.getItem("steps");

    if (savedSteps) {
      setStep(JSON.parse(savedSteps));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("steps", JSON.stringify(step));
  }, [step]);

  // Restore booking from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("booking");
    if (saved) setBooking(JSON.parse(saved));
  }, []);

  // Save booking to localStorage on change
  useEffect(() => {
    localStorage.setItem("booking", JSON.stringify(booking));
  }, [booking]);

  // Restore formData from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bookingForm");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  // Save formData to localStorage on change
  useEffect(() => {
    localStorage.setItem("bookingForm", JSON.stringify(formData));
  }, [formData]);

  // Auto-generates Mon–Fri for next 30 days, blocked dates come from admin panel
  const { dates } = useAvailableDates(30);

  const update = (patch: Partial<BookingState>) =>
    setBooking((prev) => ({ ...prev, ...patch }));

  const canAdvance = () => {
    if (step === 0) return !!booking.counselor;
    if (step === 1) return !!booking.date && !!booking.time;
    if (step === 2) return !!booking.personalInfo;
    return true;
  };

  const next = () => {
    if (canAdvance()) setStep((s) => Math.min(s + 1, 3));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (formData.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Invalid email address";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      update({ personalInfo: formData });
      setStep(3);
    }
  };

  // ── Step 1: Counselor ──────────────────────────────────────────────────────
  const Step1 = (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Choose your preferred counselor for this session.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {counselorsData.map((c) => {
          const experience = Array.isArray(c.counselor_experience)
            ? c.counselor_experience[0]
            : c.counselor_experience;

          const education = Array.isArray(c.counselor_education)
            ? c.counselor_education[0]
            : c.counselor_education;
          const active = booking.counselor?.id === c.id;
          const isActive = c.is_active;
          if (isActive) {
            return <button
              key={c.id}
              type="button"
              onClick={() => update({ counselor: c })}
              className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200
                ${active
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 shadow-md shadow-blue-100 dark:shadow-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
            >
              {active && (
                <span className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-0.5">
                  <Check size={12} />
                </span>
              )}
              <div className="flex items-center gap-3">

                <Avatar size="lg">
                  <AvatarImage src={c.avatar} />
                  <AvatarFallback>{`${c.first_name.charAt(0)}${c.last_name.charAt(0)}`}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {c.first_name} {c.last_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Briefcase size={11} /> {education?.degree}
                  </p>
                  <p className="text-xs text-blue-500 font-medium mt-0.5">
                    {experience?.start_date
                      ? `Experience: ${new Date().getFullYear() - new Date(experience.start_date).getFullYear()} + years`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </button>
          }
        })}
      </div>
    </div>
  );

  // ── Step 2: Date & Time ────────────────────────────────────────────────────
  const Step2 = (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Calendar size={15} /> Select a Date
          <span className="text-xs font-normal text-gray-400">
            (Mon – Fri only)
          </span>
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {dates.map((d) => {
            const isSelected = booking.date?.iso === d.iso;
            return (
              <button
                key={d.iso}
                type="button"
                disabled={d.isBlocked}
                onClick={() => update({ date: d, time: null })}
                title={d.isBlocked ? `Blocked: ${d.blockReason}` : undefined}
                className={`relative py-3 rounded-xl border-2 text-center transition-all duration-200
                  ${d.isBlocked
                    ? "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-40 cursor-not-allowed"
                    : isSelected
                      ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer"
                  }`}
              >
                {d.isBlocked && (
                  <span className="absolute top-1 right-1">
                    <Ban size={9} className="text-gray-400" />
                  </span>
                )}
                <p
                  className={`text-xs font-medium ${isSelected ? "opacity-80" : "text-gray-400 dark:text-gray-500"}`}
                >
                  {d.month}
                </p>
                <p
                  className={`text-base font-bold leading-tight ${!isSelected && !d.isBlocked ? "text-gray-800 dark:text-gray-200" : ""}`}
                >
                  {d.date}
                </p>
                <p
                  className={`text-xs ${isSelected ? "opacity-80" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {d.day}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {booking.date && (
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Clock size={15} /> Select a Time
            <span className="text-xs font-normal text-gray-400">
              for {booking.date.day}, {booking.date.month} {booking.date.date}
            </span>
          </p>
          <div className="grid grid-cols-4 gap-2">
            {times.map((t) => {
              const active = booking.time === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => update({ time: t })}
                  className={`py-2 px-1 rounded-lg border-2 text-xs font-medium transition-all duration-200
                    ${active
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 text-gray-600 dark:text-gray-400"
                    }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // ── Step 3: Personal Info ──────────────────────────────────────────────────
  const Step3 = (
    <form
      id="personalInfoForm"
      onSubmit={handleFormSubmit}
      className="space-y-4"
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">
        We{"'"}ll use this to send your confirmation.
      </p>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <User size={13} /> Full Name
        </label>
        <input
          type="text"
          placeholder="John Doe"
          value={formData.name}
          autoComplete="true"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className={`w-full px-4 py-2.5 rounded-lg border-2 bg-transparent text-sm outline-none transition-colors
            ${formErrors.name ? "border-red-400 focus:border-red-500" : "border-gray-200 dark:border-gray-700 focus:border-blue-500"}
            text-gray-900 dark:text-gray-100 placeholder:text-gray-400`}
        />
        {formErrors.name && (
          <p className="text-red-500 text-xs">{formErrors.name}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <Mail size={13} /> Email Address
        </label>
        <input
          type="email"
          placeholder="johndoe@example.com"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className={`w-full px-4 py-2.5 rounded-lg border-2 bg-transparent text-sm outline-none transition-colors
            ${formErrors.email ? "border-red-400 focus:border-red-500" : "border-gray-200 dark:border-gray-700 focus:border-blue-500"}
            text-gray-900 dark:text-gray-100 placeholder:text-gray-400`}
        />
        {formErrors.email && (
          <p className="text-red-500 text-xs">{formErrors.email}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <Phone size={13} /> Phone
        </label>
        <input
          type="text"
          placeholder="Enter your number"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          className={`w-full px-4 py-2.5 rounded-lg border-2 bg-transparent text-sm outline-none transition-colors
            ${formErrors.phone ? "border-red-400 focus:border-red-500" : "border-gray-200 dark:border-gray-700 focus:border-blue-500"}
            text-gray-900 dark:text-gray-100 placeholder:text-gray-400`}
        />
        {formErrors.phone && (
          <p className="text-red-500 text-xs">{formErrors.phone}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <MessageSquare size={13} /> Question
          <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="What would you like to discuss?"
          value={formData.details}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, details: e.target.value }))
          }
          className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 bg-transparent text-sm outline-none transition-colors resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
        />
      </div>
    </form>
  );

  // ── Step 4: Confirm ────────────────────────────────────────────────────────
  const Step4 = (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Review your appointment before confirming.
      </p>
      <div className="rounded-xl border-2 border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50">
          <Avatar size="lg">
            <AvatarImage src={booking.counselor?.avatar} />
            <AvatarFallback>{`${booking.counselor?.first_name.charAt(0)}${booking.counselor?.last_name.charAt(0)}`}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Counselor
            </p>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              {booking.counselor?.first_name} {booking.counselor?.last_name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {booking.counselor?.email}
            </p>
          </div>
        </div>
        <div className="flex gap-8 p-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-0.5">
              <Calendar size={11} /> Date
            </p>
            <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              {booking.date?.day}, {booking.date?.month} {booking.date?.date}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-0.5">
              <Clock size={11} /> Time
            </p>
            <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              {booking.time}
            </p>
          </div>
        </div>
        <div className="p-4 space-y-0.5">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
            <User size={11} /> Your Details
          </p>
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            {booking.personalInfo?.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {booking.personalInfo?.email}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {booking.personalInfo?.phone}
          </p>
          {booking.personalInfo?.details && (
            <p className="text-sm text-gray-400 italic mt-1">
              {booking.personalInfo.details}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const stepContents = [Step1, Step2, Step3, Step4];

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex h-[calc(100vh-65px)] justify-center items-center px-4">
        <div className="flex flex-col items-center text-center max-w-sm w-full gap-4 p-8 border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-[#0a0a0a]">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Check size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Booking Confirmed!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Session with{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {booking.counselor?.first_name} {booking.counselor?.last_name}
            </span>{" "}
            on{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {booking.date?.day}, {booking.date?.month} {booking.date?.date}
            </span>{" "}
            at{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {booking.time}
            </span>
            .
          </p>
          <p className="text-xs text-gray-400">
            Confirmation sent to {booking.personalInfo?.email}
          </p>
          <Button variant={"outline"} onClick={() => setSubmitted(false)}>
            Book Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen px-4 py-8">
      <div className="flex flex-col w-full max-w-2xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5">
          <h1 className="flex items-center gap-2.5 text-white text-xl font-bold">
            <Calendar size={22} /> Counselor Appointment
          </h1>
          <p className="mt-1 text-blue-100 text-sm">
            Schedule a one-to-one session with our expert counselors.
          </p>
        </div>

        {/* Steps bar */}
        <div className="flex justify-between text-center px-6 pt-6 pb-2 relative">
          <div className="absolute top-[38px] left-[12%] right-[12%] h-0.5 bg-gray-200 dark:bg-gray-700 z-0" />
          <div
            className="absolute top-[38px] left-[12%] h-0.5 bg-blue-500 z-0 transition-all duration-500"
            style={{ width: `${(step / (stepsBar.length - 1)) * 76}%` }}
          />
          {stepsBar.map((s) => {
            const isCompleted = s.step < step + 1;
            const isCurrent = s.step === step + 1;
            return (
              <div
                key={s.step}
                className="flex flex-col items-center gap-2 z-10"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-sm font-semibold
                  ${isCompleted || isCurrent
                      ? "bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/40"
                      : "bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-gray-600 text-gray-400"
                    }`}
                >
                  {isCompleted && !isCurrent ? <Check size={16} /> : s.step}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block transition-colors
                  ${isCurrent ? "text-blue-500" : isCompleted ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-600"}`}
                >
                  {s.stepInfo}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step title */}
        <div className="px-6 pt-4 pb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {
              [
                "Select a Counselor",
                "Date & Time",
                "Personal Info",
                "Confirm Booking",
              ][step]
            }
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-3 min-h-[280px]">{stepContents[step]}</div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={prev}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} /> Back
          </button>

          <span className="text-xs text-gray-400">
            {step + 1} / {stepsBar.length}
          </span>

          {step < 3 ? (
            step === 2 ? (
              <button
                type="submit"
                form="personalInfoForm"
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-all shadow-md shadow-blue-200 dark:shadow-blue-900/30"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={next}
                disabled={!canAdvance()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-all shadow-md shadow-blue-200 dark:shadow-blue-900/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={16} />
              </button>
            )
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all"
            >
              Confirm <Check size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
