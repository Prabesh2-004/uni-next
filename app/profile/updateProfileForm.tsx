"use client";

import { useTransition } from "react";
import { updateProfile } from "./updateProfile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function UpdateProfileForm({ profile }: any) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) =>
        startTransition(() => updateProfile(formData))
      }
      className="space-y-4"
    >
      <Input
                name="first_name"
                defaultValue={profile?.first_name || ""}
                placeholder="First Name"
                className="input"
            />

            <Input
                name="last_name"
                defaultValue={profile?.last_name || ""}
                placeholder="Last Name"
                className="input"
            />

            <Input
                name="phone"
                defaultValue={profile?.phone || ""}
                placeholder="Phone"
                className="input"
            />

            <Textarea
                name="bio"
                defaultValue={profile?.bio || ""}
                placeholder="Bio"
                rows={4}
                className="input"
            />

            <Input
                name="password"
                type="password"
                placeholder="New Password"
                className="input"
            />

            <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save Changes"}
            </Button>
    </form>
  );
}