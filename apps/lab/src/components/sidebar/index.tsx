"use client";

import { cn } from "cn";
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
        "no-scrollbar sticky top-0 z-50 hidden h-screen shrink-0 flex-col overflow-x-hidden overflow-y-auto overscroll-contain border-r border-sidebar-border bg-sidebar px-2.5 pb-2.5 pt-0 transition-[width] duration-260 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none lg:flex",
        expanded ? "w-46" : "w-14.25",
      )}
    >
      <SidebarBody expanded={expanded} onToggle={onToggle} />
    </aside>
  );
}
