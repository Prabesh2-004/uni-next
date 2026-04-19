"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    throw new Error("Not authenticated");
  }

  // 🔹 Get form values
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const phone = formData.get("phone") as string;
  const bio = formData.get("bio") as string;
  const password = formData.get("password") as string;

  // 🔹 Update profile table
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name,
      last_name,
      phone,
      bio,
    })
    .eq("id", user.id);

  if (profileError) {
    throw new Error(profileError.message);
  }

  // 🔹 Update password (optional)
  if (password && password.length >= 6) {
    const { error: passError } = await supabase.auth.updateUser({
      password,
    });

    if (passError) {
      throw new Error(passError.message);
    }
  }

  // 🔄 refresh UI
  revalidatePath("/profile");
}