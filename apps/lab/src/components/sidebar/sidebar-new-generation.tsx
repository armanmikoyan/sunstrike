"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "cn";
import { CTA_BEVEL, SIDEBAR_COPY } from "./constants";
import { RailTooltip } from "./rail-tooltip";
import type { SidebarNewGenerationProps } from "./types";

/** The solid brand key above the main navigation. */
export function SidebarNewGeneration({ expanded, showToggle, onNavigate }: SidebarNewGenerationProps) {
  return (
    <RailTooltip expanded={expanded} label={SIDEBAR_COPY.newGeneration}>
      <Link
        href="/create/video"
        onClick={onNavigate}
        aria-label={SIDEBAR_COPY.newGeneration}
        className={cn(
          "group relative mb-4 flex h-9 w-full shrink-0 items-center gap-2 overflow-hidden rounded-lg bg-brand text-sm font-semibold lg:text-xs text-brand-foreground transition-[max-width,padding,opacity,transform,background-color] duration-260 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-brand-hover active:scale-97 motion-reduce:transition-none",
          expanded ? (showToggle ? "max-w-45 px-2.5" : "max-w-full px-2.5") : "max-w-9 px-2.25",
        )}
        style={{ boxShadow: CTA_BEVEL }}
      >
        <Plus className="size-5 shrink-0" strokeWidth={2.2} />
        <span
          className={cn(
            "truncate transition-opacity duration-200 motion-reduce:transition-none",
            expanded ? "opacity-100" : "opacity-0",
          )}
        >
          {SIDEBAR_COPY.newGeneration}
        </span>
      </Link>
    </RailTooltip>
  );
}
