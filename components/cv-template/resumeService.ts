// lib/resumeService.ts
// Handles saving / updating / fetching resumes for the logged-in Supabase user.
//
// Setup:
//   npm install @supabase/supabase-js
//   Create /lib/supabaseClient.ts with your project URL + anon key.

import { createClient } from "@/lib/supabase/client";
import type { ResumeData } from "../../app/resume/types";

// ─── Types ────────────────────────────────────────────────────────────────────

const supabase = createClient();

export interface ResumeRow {
  id: string;
  user_id: string;
  title: string;
  template_key: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  objective: string | null;
  education: ResumeData["education"];
  experience: ResumeData["experience"];
  skills: string[];
  soft_skills: string[];
  languages: string[];
  hobbies: string[];
  leadership: string[];
  achievements: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SaveResumePayload {
  data: ResumeData;
  templateId: number;
  /** If provided, the existing row will be updated instead of inserted */
  resumeId?: string | null;
}

export interface SaveResumeResult {
  success: boolean;
  resumeId?: string;
  error?: string;
}

// ─── Get current session user ─────────────────────────────────────────────────

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data) return null;
  return data;
}

// ─── Save (insert or update) a resume ────────────────────────────────────────

export async function saveResume({
  data,
  templateId,
  resumeId,
}: SaveResumePayload): Promise<SaveResumeResult> {
  // 1. Ensure the user is authenticated
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to save a resume." };
  }

  // 2. Build the row payload
  const payload = {
    user_id:      user.user.id,
    title:        data.experience?.[0]?.role || data.personal.name || "Untitled Resume",
    template_key: `template-${templateId}`,
    full_name:    data.personal.name    || null,
    email:        data.personal.email   || null,
    phone:        data.personal.phone   || null,
    address:      data.personal.address || null,
    objective:    data.personal.objective || null,
    education:    data.education,
    experience:   data.experience,
    skills:       data.skills.filter(Boolean),
    soft_skills:  data.softSkills.filter(Boolean),
    languages:    data.languages.filter(Boolean),
    hobbies:      data.hobbies.filter(Boolean),
    leadership:   data.leadership.filter(Boolean),
    achievements: data.achievements.filter(Boolean),
  };

  // 3. Upsert or insert
  if (resumeId) {
    // UPDATE existing row (RLS will enforce ownership)
    const { error } = await supabase
      .from("resumes")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", resumeId)
      .eq("user_id", user.user.id)
      .select(); // double-check ownership

    if (error) return { success: false, error: error.message };
    return { success: true, resumeId };
  } else {
    // INSERT new row
    const { data: inserted, error } = await supabase
      .from("resumes")
      .insert(payload)
      .select("id")
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, resumeId: inserted.id };
  }
}

// ─── Fetch all resumes for the logged-in user ─────────────────────────────────

export async function getMyResumes(): Promise<ResumeRow[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("getMyResumes error:", error.message);
    return [];
  }
  return data as ResumeRow[];
}

// ─── Fetch a single resume by id ──────────────────────────────────────────────

export async function getResumeById(id: string): Promise<ResumeRow | null> {
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as ResumeRow;
}

// ─── Delete a resume ──────────────────────────────────────────────────────────

export async function deleteResume(id: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.user.id);

  return !error;
}

// ─── Toggle published status ───────────────────────────────────────────────────

export async function togglePublish(id: string, isPublished: boolean): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const { error } = await supabase
    .from("resumes")
    .update({ is_published: isPublished })
    .eq("id", id)
    .eq("user_id", user.user.id);

  return !error;
}



// ─── Record a view (call from the public resume page) ────────────────────────

export async function recordView(resumeId: string): Promise<void> {
  await supabase.from("resume_views").insert({ resume_id: resumeId });
}