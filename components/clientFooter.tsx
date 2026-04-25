"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

const disabledRoute = ["/admin", "/booking", "/resume", "/profile", "/setting", "/universities/"]

export function ClientFooter() {
  const pathname = usePathname();
  const isDisabledRoute = disabledRoute.some(route => pathname?.startsWith(route));

  // If we are on the /admin route (or any sub-route), don't render the Navbar
  if (isDisabledRoute) {
    return null;
  }

  return <Footer />;
}
