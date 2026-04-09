"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function AppHeader({ title = "Overview" }: { title?: string }) {
  return (
    <header className="flex h-12 max-w-[calc(100vw-100px)] ml-32 items-center gap-3 z-10 border-b px-4">
      {/* This trigger is OUTSIDE the sidebar — no overlap */}
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-4" />
      <span className="text-sm font-medium">{title}</span>
    </header>
  )
}