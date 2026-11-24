"use client";

import { cn } from "cn";
import { SidebarBody } from "./sidebar-body";
import type { SidebarProps } from "./types";

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "no-scrollbar sticky top-0 z-50 hidden h-screen shrink-0 flex-col overflow-x-hidden overflow-y-auto overscroll-contain border-r border-sidebar-border bg-sidebar px-2.5 pb-2.5 pt-0 transition-[width] duration-260 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none lg:flex",
        expanded ? "w-46" : "w-14.25",
      )}
    >
      <SidebarBody expanded={expanded} onToggle={onToggle} />
    </aside>
  );
}
