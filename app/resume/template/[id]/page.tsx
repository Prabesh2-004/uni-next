import { getResumeById } from "@/components/cv-template/resumeService";
import Template1 from "@/components/cv-template/Template1";
import Template2 from "@/components/cv-template/Template2";
import Template3 from "@/components/cv-template/Template3";

export const fetchCache = "force-no-store";

export default async function TemplatePage({ params }: { params: { id: string } }) {
  const resume = await getResumeById(params.id);

  if (!resume) return <div>Resume not found</div>;

  const templateMap: any = {
    "template-1": Template1,
    "template-2": Template2,
    "template-3": Template3,
  };

  const TemplateComponent = templateMap[resume.template_key] ?? Template1;

  return <TemplateComponent data={resume} />;
}
