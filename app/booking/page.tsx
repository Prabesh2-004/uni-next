import { Suspense } from "react";
import Booking from "@/components/booking";

export const metadata = {
  title: "Booking - Dream Uni",
  description: "Book a counseling session with our expert counselors and get personalized guidance for your university journey.",
}

export default async function BookingPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-sm text-gray-400">Loading...</div>}>
      <Booking />
    </Suspense>
  );
}