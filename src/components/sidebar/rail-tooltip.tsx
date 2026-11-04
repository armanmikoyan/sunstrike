"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { RailTooltipProps } from "./types";

/**
 * A tooltip for the icon-only rail. While the rail is expanded the content is
 * gone and the open state is forced closed, so a pointer that was resting on
 * an item during the collapse does not trigger a stale tooltip.
 */
export function RailTooltip({ expanded, label, children }: RailTooltipProps) {
  const [open, setOpen] = useState(false);
  const [lastExpanded, setLastExpanded] = useState(expanded);

  if (lastExpanded !== expanded) {
    setLastExpanded(expanded);
    setOpen(false);
  }

  return (
    <Tooltip
      open={open && !expanded}
      onOpenChange={(next) => setOpen(next && !expanded)}
    >
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {expanded ? null : (
        <TooltipContent side="right" sideOffset={12} className="font-medium">
          {label}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
