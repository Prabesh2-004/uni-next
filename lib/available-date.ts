"use client";
import { useState, useEffect } from "react";
import { createClient } from "./supabase/client";

export interface AvailableDate {
  date: number;
  day: string;
  month: string;
  year: number;
  iso: string; // "YYYY-MM-DD" — used as the key everywhere
  isBlocked: boolean;
  blockReason?: string;
}

export interface BlockedDate {
  iso: string;
  reason: string;
}

export async function getBlockedDates(): Promise<BlockedDate[]> {
  const supabase = createClient();
  const { data } = await supabase.from("blocked_dates").select("iso, reason");
  return (data as BlockedDate[]) ?? [];
}

export async function saveBlockedDates(date: BlockedDate) {
  const supabase = createClient();
  await supabase.from("blocked_dates").upsert(date);
}

export async function removeBlockedDate(iso: string) {
  const supabase = createClient();
  await supabase.from("blocked_dates").delete().eq("iso", iso);
}
// ─── Generate Mon–Fri for the next `daysAhead` calendar days ─────────────────
function generateWeekdays(
  daysAhead = 30,
): Omit<AvailableDate, "isBlocked" | "blockReason">[] {
  const days: Omit<AvailableDate, "isBlocked" | "blockReason">[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 1; i <= daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const dow = d.getDay(); // 0 = Sun, 6 = Sat
    if (dow === 0 || dow === 6) continue; // skip weekends

    const iso = d.toLocaleDateString("en-CA");
    days.push({
      date: d.getDate(),
      day: DAY_NAMES[dow],
      month: MONTH_NAMES[d.getMonth()],
      year: d.getFullYear(),
      iso,
    });
  }

  return days;
}

// ─── Main hook ────────────────────────────────────────────────────────────────
export function useAvailableDates(daysAhead = 30) {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("blocked_dates")
      .select("iso, reason")
      .then(({ data }) => setBlockedDates((data as BlockedDate[]) ?? []));
  }, []);

  const refresh = () => getBlockedDates().then(setBlockedDates);

  const weekdays = generateWeekdays(daysAhead);

  const dates: AvailableDate[] = weekdays.map((d) => {
    const blocked = blockedDates.find((b) => b.iso === d.iso);
    return {
      ...d,
      isBlocked: !!blocked,
      blockReason: blocked?.reason,
    };
  });

  return { dates, blockedDates, refresh };
}
