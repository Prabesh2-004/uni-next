"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bug,
  CalendarIcon,
  CalendarSearch,
  CreditCardIcon,
  FileUser,
  Lightbulb,
  Menu,
  SettingsIcon,
  University,
  UserIcon,
} from "lucide-react";
import { LogoutButton } from "./logout-button";
import Link from "next/link";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"sm"}>
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup className="md:hidden">
          <DropdownMenuLabel>Services</DropdownMenuLabel>
          <DropdownMenuItem>
            <FileUser />
            <Link href="/resume">
              Resume
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CalendarIcon />
            <Link href="/booking">
              Book Counselor
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <University />
            <Link href="/universities">
              Universities
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CalendarSearch />
            <Link href="/events">
              Events
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Lightbulb />
            <Link href="/strategy-hub">
              Strategy Hub
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <UserIcon />
            <Link href="/profile">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon />
            <Link href="/setting">
              Setting
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Bug />
            Report
          </DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
