"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export function ClientNavbar() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // If we are on the /admin route (or any sub-route), don't render the Navbar
  if (isAdminRoute) {
    return null;
  }

  return <Navbar />;
}
