import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "./user-menu"; // 👈 import the new client component
import { ThemeSwitcher } from "./theme-switcher";

export async function AuthButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-4">
      <div>
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
      </div>
      <ThemeSwitcher />
      <UserMenu /> {/* 👈 Radix only renders on client now */}
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
