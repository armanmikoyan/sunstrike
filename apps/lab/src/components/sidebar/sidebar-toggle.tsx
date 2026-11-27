"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { SIDEBAR_COPY } from "./constants";
import type { SidebarToggleProps } from "./types";

export function SidebarToggle({ expanded, onToggle }: SidebarToggleProps) {
  const label = expanded ? SIDEBAR_COPY.collapse : SIDEBAR_COPY.expand;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onToggle}
          aria-label={label}
          aria-expanded={expanded}
          className="absolute top-[2.96875rem] right-[0.5px] z-10 grid size-7 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border bg-sidebar text-foreground/80 outline-none transition-colors hover:border-white/20 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-white/30"
        >
          {expanded ? (
            <PanelLeftClose className="size-3.5" strokeWidth={1.9} />
          ) : (
            <PanelLeftOpen className="size-3.5" strokeWidth={1.9} />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
