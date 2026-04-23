export const dynamic = 'force-dynamic';

import CounselorDetailPage from "@/components/counselor-details";
import { Suspense } from "react";

export default function CounselorDetails() {
    return (
        <Suspense fallback={null}>
            <CounselorDetailPage />
        </Suspense>
    );
}   