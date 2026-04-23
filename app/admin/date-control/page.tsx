import { Suspense } from "react";
import AdminDatePanel from "@/components/admin-date-control";

export default function AdminDateControlPage() {
  return (
    <Suspense fallback={null}>
      <AdminDatePanel />
    </Suspense>
  );
}