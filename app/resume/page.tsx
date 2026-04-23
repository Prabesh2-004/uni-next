export const dynamic = 'force-dynamic';

import CVBuilder from "@/components/resume";


export const metadata = {
  title: "Resume",
  description: "Build a professional resume with our AI-powered resume builder and get personalized guidance for your university journey.",
  keywords: ["resume", "cv-builder", "cv", "resume-builder", "resume builder", "cv builder", "free resume builder", "cv maker", "resume maker", "free cv builder", "free resume maker", "free cv maker", "free resume maker", "ai resume builder", "ai cv builder", "ai resume maker", "ai cv maker"]
}

export default function Resume() {
  return (
    <div>
      <CVBuilder />
    </div>
  )
} 