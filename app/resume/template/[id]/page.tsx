import { getResumeById } from "@/components/cv-template/resumeService";
import Template1 from "@/components/cv-template/Template1";
import Template2 from "@/components/cv-template/Template2";
import Template3 from "@/components/cv-template/Template3";
import type { ComponentType } from "react";

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ id: string }>; // ⬅️ Next.js 15+ requires Promise
}) {
  const { id } = await params; // ⬅️ Await before using
  const resume = await getResumeById(id);

  if (!resume) return <div>Resume not found</div>;

  const templateMap: Record<string, ComponentType<{ data: typeof resume }>> = {
    "template-1": Template1,
    "template-2": Template2,
    "template-3": Template3,
  };

  const TemplateComponent = templateMap[resume.template_key] ?? Template1;

  return <TemplateComponent data={resume} />;
}
