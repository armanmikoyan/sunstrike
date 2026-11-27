"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { StudioDurationSlider } from "./studio-duration-slider";
import type { StudioDurationMenuProps } from "./types";
import { formatDuration } from "./utils";

/** The chosen duration on a compact trigger; the draggable track opens in a menu. */
export function StudioDurationMenu({
  options,
  value,
  onValueChange,
  label,
  className,
  contentClassName,
  menuLabel = false,
}: StudioDurationMenuProps) {
  const fixed = options.length < 2;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={fixed}>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          aria-label={`${label}: ${formatDuration(value)}`}
          className={cn("justify-between disabled:opacity-100", className)}
        >
          <span className="font-mono tabular-nums">{formatDuration(value)}</span>
          {fixed ? null : <ChevronDown className="size-3.5 text-muted-foreground/80" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={cn("p-1", contentClassName)}>
        {menuLabel ? <DropdownMenuLabel>{label}</DropdownMenuLabel> : null}
        <StudioDurationSlider
          className="px-2 pb-1.5 pt-0.5"
          options={options}
          value={value}
          onValueChange={onValueChange}
          label={label}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
