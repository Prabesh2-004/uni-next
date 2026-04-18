"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { UserMenu } from "./user-menu";
import { ThemeSwitcher } from "./theme-switcher";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) {
      setUserRole(null);
      return;
    }
    const supabase = createClient()

    supabase.from("profiles").select("role").eq("id", user.id).single().then(({ data }) => {
      setUserRole(data?.role)
    })
  }, [user])

  useEffect(() => {
    const supabase = createClient();

    // Get the initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show nothing while loading to avoid flash
  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <div className="w-8 h-8 rounded-md bg-muted animate-pulse" />
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex">
        <Link href="/resume">
          <Button variant={"link"} size={"sm"}>
            Resume
          </Button>
        </Link>
        <Link href="/booking">
          <Button variant={"link"} size={"sm"}>
            Book Counselor
          </Button>
        </Link>
        <Link href="/universities">
          <Button variant={"link"} size={"sm"}>
            Universities
          </Button>
        </Link>
        <Link href="/events">
          <Button variant={"link"} size={"sm"}>
            Events
          </Button>
        </Link>
        <Link href="/strategy-hub">
          <Button variant={"link"} size={"sm"}>
            Strategy Hub
          </Button>
        </Link>
        {userRole === "ADMIN" && <Link href="/admin">
          <Button variant={"link"} size={"sm"}>
            Admin
          </Button>
        </Link>}
      </div>
      <ThemeSwitcher />
      <UserMenu />
    </div>
  ) : (
    <div className="flex gap-2">
      <ThemeSwitcher />
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
