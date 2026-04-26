import { createClient } from "@/lib/supabase/client";
import { FormData, Entries } from "@/app/universities/personal-info/page"; // your types

export async function savePersonalInfo(
  form: FormData,
  entries: Entries,
  transcriptUrl?: string
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("user_personal_info")
    .insert(
      {
        user_id: user.id,
        full_name: form.fullName,
        phone: form.phone,
        school: form.school,
        country_first: form.countryFirst,
        country_second: form.countrySecond,
        target_university: form.targetUniversity,
        program: form.program,
        sat: form.sat,
        act: form.act,
        ielts: form.ielts,
        toefl: form.toefl,
        entries,
        ...(transcriptUrl && { transcript_url: transcriptUrl }),
      }
    );

  if (error) throw error;
}