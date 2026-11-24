"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import type { RailTooltipProps } from "./types";

export function RailTooltip(props: RailTooltipProps) {
  const pathname = usePathname();

  return <RailTooltipInner key={pathname} {...props} />;
}

function RailTooltipInner({ expanded, label, children }: RailTooltipProps) {
  const [open, setOpen] = useState(false);
  const [lastExpanded, setLastExpanded] = useState(expanded);

  if (lastExpanded !== expanded) {
    setLastExpanded(expanded);
    setOpen(false);
  }

  return (
    <Tooltip open={open && !expanded} onOpenChange={(next) => setOpen(next && !expanded)}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {expanded ? null : (
        <TooltipContent side="right" sideOffset={12} className="font-medium">
          {label}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
