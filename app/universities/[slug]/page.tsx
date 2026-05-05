import UniversityPage from "@/components/universityDetails";
import { createClient } from "@/lib/supabase/server"; // ← server
import { notFound } from "next/navigation";

export default async function DetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>; // ← Promise
}) {
  const { slug } = await params; // ← await

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("university")
    .select(`
      *,
      stats(*),
      programs(*),
      requirements(*),
      departments(*),
      global_impact(
        *,
        global_impact_stats(*)
      )
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error(error);
    return notFound();
  }

  return <UniversityPage id={slug} data={data} />;
}