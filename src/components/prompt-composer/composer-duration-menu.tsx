"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { composerCopy } from "./constants";
import type { ComposerDurationMenuProps } from "./types";

export function ComposerDurationMenu({ composer }: ComposerDurationMenuProps) {
  const { duration, setDuration, durationOptions } = composer;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-[3.5rem] justify-center gap-1 rounded-lg px-2 text-[0.6875rem] font-medium text-muted-foreground hover:bg-white/[0.055] hover:text-foreground"
        >
          {duration}
          <ChevronDown className="size-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36 p-1.5">
        <DropdownMenuLabel>{composerCopy.duration}</DropdownMenuLabel>
        {durationOptions.map((value) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => setDuration(value)}
            className={cn(
              "p-2 text-[0.75rem]",
              duration === value && "bg-white/[0.08] text-foreground",
            )}
          >
            {value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
