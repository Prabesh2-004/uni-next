import UniversityPage from "@/components/universityDetails";
import { createClient } from "@/lib/supabase/client";

export default async function DetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data } = await supabase.from("universities").select("*").eq("id", id).single();
    return (
        <UniversityPage id={id} data={data} />
    )
}