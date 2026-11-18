"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { LogoLockup } from "@/components/brand";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { cn } from "cn";
import { SIDEBAR_COPY } from "./constants";
import type { SidebarToggleProps } from "./types";

/** Rail header: the collapse control and the lockup that follows it. */
export function SidebarToggle({ expanded, showToggle, onToggle }: SidebarToggleProps) {
  const label = expanded ? SIDEBAR_COPY.collapse : SIDEBAR_COPY.expand;

  return (
    <div className={cn("mb-4 flex h-11 w-full shrink-0 items-center gap-2", showToggle ? undefined : "pl-2.5")}>
      {showToggle ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onToggle}
              aria-label={label}
              aria-expanded={expanded}
              className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:bg-white/5.5"
            >
              {expanded ? (
                <PanelLeftClose className="size-4" strokeWidth={1.8} />
              ) : (
                <PanelLeftOpen className="size-4" strokeWidth={1.8} />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={12}>
            {label}
          </TooltipContent>
        </Tooltip>
      ) : null}
      <LogoLockup
        compact
        imageClassName={showToggle ? undefined : "max-h-7"}
        inactive={!expanded}
        className={cn("min-w-0 overflow-hidden", expanded ? "flex opacity-100" : "hidden")}
      />
    </div>
  );
}
