"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface CounselorFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  degree: string;
  fieldOfStudy: string;
  instituteName: string;
  graduationYear: string;
  workplaceName: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  description: string;
  licenseNumber: string;
  licensingAuthority: string;
  issueDate: string;
  expiryDate: string;
}

export async function createCounselor(formData: CounselorFormData) {
  const supabase = await createClient();
  
  // Verify admin using regular client
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) throw new Error("Unauthorized: Please login");

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", currentUser.id)
    .single();

  if (adminProfile?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  // Create user using ADMIN API (bypasses rate limits!)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      role: 'COUNSELOR'
    }
  });

  if (authError) {
    throw new Error(`Failed to create user: ${authError.message}`);
  }
  
  if (!authData.user) throw new Error("User creation failed");

  const userId = authData.user.id;

  // Wait a moment for the trigger to create the profile
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Insert into counselor table
  const { error: counselorError } = await supabase
    .from("counselor")
    .insert({
      id: userId,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    });
  
  if (counselorError) {
    throw counselorError;
  }

  // Insert education
  const { error: eduError } = await supabase
    .from("counselor_education")
    .insert({
      id: userId,
      degree: formData.degree,
      field_of_study: formData.fieldOfStudy,
      institution_name: formData.instituteName,
      graduation_year: formData.graduationYear,
    });
  
  if (eduError) {
    throw eduError;
  }

  // Insert experience
  const experienceData: any = {
    id: userId,
    workplace_name: formData.workplaceName,
    job_title: formData.jobTitle,
    start_date: formData.startDate,
    description: formData.description || null,
    is_current: !formData.endDate,
  };
  
  if (formData.endDate) {
    experienceData.end_date = formData.endDate;
  }
  
  const { error: expError } = await supabase
    .from("counselor_experience")
    .insert(experienceData);
  
  if (expError) {
    throw expError;
  }

  // Insert license
  const { error: licError } = await supabase
    .from("counselor_licenses")
    .insert({
      id: userId,
      license_number: formData.licenseNumber,
      licensing_authority: formData.licensingAuthority,
      issue_date: formData.issueDate,
      expiry_date: formData.expiryDate,
      license_status: 'pending_verification',
    });
  
  if (licError) {
    throw licError;
  }

  return { success: true, userId };
}