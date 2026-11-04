"use client";

import { cn } from "@/lib/utils";
import { SidebarBody } from "./sidebar-body";
import type { SidebarProps } from "./types";

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        // The inset is identical in both states; the gutter around the icons
        // comes from the rail width, not from padding. Collapsed, the rail is
        // the 40px control plus the same 10px inset the open rail uses (and its
        // 1px border), so controls keep one vertical axis and never slide.
        "sticky top-0 z-50 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar px-2.5 py-2.5 transition-[width] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none lg:flex",
        expanded ? "w-[12.5rem]" : "w-[3.8125rem]",
      )}
    >
      <SidebarBody expanded={expanded} onToggle={onToggle} />
    </aside>
  );
}

export { MobileSidebar } from "./mobile-sidebar";
