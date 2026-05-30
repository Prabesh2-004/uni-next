// middleware.ts (or utils/supabase/middleware.ts — wherever your proxy lives)
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES   = ["/auth/login", "/auth/sign-up", "/auth/forgot-password", "/"];
const AUTH_ROUTES     = ["/auth/login", "/auth/sign-up", "/auth/forgot-password"];
const ADMIN_ROUTES    = ["/admin"];
const COUNSELOR_ROUTES = ["/counselor"];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublicRoute   = PUBLIC_ROUTES.some((r) => r === "/" ? pathname === "/" : pathname.startsWith(r));
  const isAdminRoute    = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isCounselorRoute = COUNSELOR_ROUTES.some((r) => pathname.startsWith(r));

  // ── Not logged in ────────────────────────────────────────────────────────
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // ── Fetch role once (only if logged in) ───────────────────────────────────
  let role: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? null;
  }

  // ── Logged-in user visiting auth pages → redirect by role ─────────────────
  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (role === "ADMIN")     return NextResponse.redirect(new URL("/admin",     request.url));
    if (role === "COUNSELOR") return NextResponse.redirect(new URL("/counselor", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ── Admin route guard ─────────────────────────────────────────────────────
  if (user && isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ── Counselor route guard ─────────────────────────────────────────────────
  if (user && isCounselorRoute) {
    if (role !== "COUNSELOR" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Extra check: counselor must have a counselor record
    if (role === "COUNSELOR") {
      const { data: counselorRow } = await supabase
        .from("counselor")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (!counselorRow) {
        // Sign them out and redirect to login with an error message
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        url.searchParams.set("error", "counselor_profile_missing");
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};