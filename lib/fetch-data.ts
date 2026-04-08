import { createClient } from "./supabase/client";

export default async function CounselorData() {
    const supabase = createClient();
    const { data: counselor } = await supabase.from("counselor").select("id, first_name, last_name, email, phone")
    return counselor;
}