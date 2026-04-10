"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return <Button className="text-red-500 w-full h-8 flex justify-start focus:text-red-500 hover:text-red-500" variant={"ghost"} onClick={logout}> <LogOutIcon />Logout</Button>;
}
