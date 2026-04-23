import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/events",
  "/",
];

const AUTH_ROUTES = ["/auth/login", "/auth/sign-up", "/auth/forgot-password"];

const ADMIN_ROUTES = ["/admin"];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // 1. Build client — this is what updateSession does internally
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 2. getUser() refreshes the session cookie — MUST run on every request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  // 3. Not logged in → only public routes allowed
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // 4. Logged in but visiting an auth page → redirect to home
  let role: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    role = profile?.role ?? null;
  }

  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 5. Admin route → check role in profiles table
  if (user && isAdminRoute) {
    if (role !== "ADMIN") {
      // Get the last active page from referrer or redirect to protected
      const referrer = request.headers.get("referer");
      const lastActivePage =
        referrer && new URL(referrer).pathname !== pathname
          ? referrer
          : new URL("/", request.url).toString();

      return NextResponse.redirect(new URL(lastActivePage));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Run on every route except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
