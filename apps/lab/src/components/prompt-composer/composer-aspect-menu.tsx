"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { COMPOSER_COPY } from "./constants";
import { cn } from "cn";
import type { ComposerProps } from "./types";

export function ComposerAspectMenu({ composer: { aspect, setAspect, aspectOptions } }: ComposerProps) {
  const shape = aspectOptions.find((ratio) => ratio.value === aspect)?.shape ?? "h-3 w-4";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="gap-1.5 font-medium text-muted-foreground hover:bg-white/5.5 hover:text-foreground"
        >
          <span className={cn("rounded-xs border border-current opacity-80", shape)} />
          {aspect}
          <ChevronDown className="size-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 p-1">
        <DropdownMenuLabel>{COMPOSER_COPY.aspectRatio}</DropdownMenuLabel>
        {aspectOptions.map((ratio) => (
          <DropdownMenuItem
            key={ratio.value}
            onSelect={() => setAspect(ratio.value)}
            className={cn("gap-2", aspect === ratio.value && "bg-white/8 text-foreground")}
          >
            <span className={cn("rounded-xs border border-current opacity-80", ratio.shape)} />
            <span>{ratio.value}</span>
            <span className="ml-auto text-muted-foreground">{ratio.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
