"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/ui/button";
import { cn } from "cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { COMPOSER_COPY } from "./constants";
import type { ComposerProps } from "./types";

export function ComposerDurationMenu({ composer: { duration, setDuration, durationOptions } }: ComposerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="w-14 justify-center gap-1 font-medium text-muted-foreground hover:bg-white/5.5 hover:text-foreground"
        >
          {duration}
          <ChevronDown className="size-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36 p-1">
        <DropdownMenuLabel>{COMPOSER_COPY.duration}</DropdownMenuLabel>
        {durationOptions.map((value) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => setDuration(value)}
            className={cn(duration === value && "bg-white/8 text-foreground")}
          >
            {value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
