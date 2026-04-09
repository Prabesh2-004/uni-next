import { Suspense } from "react";
import Booking from "@/components/booking";

export default async function BookingPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-sm text-gray-400">Loading...</div>}>
      <Booking />
    </Suspense>
  );
}