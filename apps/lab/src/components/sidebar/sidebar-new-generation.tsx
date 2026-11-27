"use client";

import { Link } from "@/components/link";
import { Plus } from "lucide-react";
import { cn } from "cn";
import { CTA_BEVEL, SIDEBAR_COPY } from "./constants";
import { RailTooltip } from "./rail-tooltip";
import type { SidebarNewGenerationProps } from "./types";

export function SidebarNewGeneration({ expanded, showToggle, onNavigate }: SidebarNewGenerationProps) {
  return (
    <RailTooltip expanded={expanded} label={SIDEBAR_COPY.newGeneration}>
      <Link
        href="/create/video"
        onClick={onNavigate}
        aria-label={SIDEBAR_COPY.newGeneration}
        className={cn(
          "group relative mb-6 flex h-8 w-full shrink-0 items-center gap-2 self-start overflow-hidden rounded-lg bg-brand px-2 text-sm font-semibold lg:text-xs text-brand-foreground transition-[max-width,opacity,transform,background-color] duration-260 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-brand-hover active:scale-97 motion-reduce:transition-none",
          showToggle ? "mt-2" : "mt-1",
          expanded ? (showToggle ? "max-w-[calc(100%-0.5rem)]" : "max-w-[calc(100%-2.75rem)]") : "max-w-8",
        )}
        style={{ boxShadow: CTA_BEVEL }}
      >
        <Plus className="size-4 shrink-0" strokeWidth={2.4} />
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
