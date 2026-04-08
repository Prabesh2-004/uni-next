// types.ts — shared across all CV Builder files

export interface Personal {
  name: string;
  email: string;
  phone: string;
  address: string;
  objective: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  address: string;
  start: string;
  end: string;
}

export interface Experience {
  role: string;
  org: string;
  location: string;
  desc: string;
  start: string;
  end: string;
}

export interface ResumeData {
  personal: Personal;
  education: Education[];
  experience: Experience[];
  skills: string[];
  softSkills: string[];
  languages: string[];
  hobbies: string[];
  leadership: string[];
  achievements: string[];
}

export interface CvDraft extends ResumeData {
  step: number;
  templateId: number | null;
  savedResumeId?: string | null;
}

export const defaultDraft: CvDraft = {
  step: 1,
  templateId: null,
  savedResumeId: null,
  personal: { name: "", email: "", phone: "", address: "", objective: "" },
  education: [{ institution: "", degree: "", field: "", address: "", start: "", end: "" }],
  experience: [{ role: "", org: "", location: "", desc: "", start: "", end: "" }],
  skills: [""],
  softSkills: [""],
  languages: [""],
  hobbies: [""],
  leadership: [""],
  achievements: [""],
};