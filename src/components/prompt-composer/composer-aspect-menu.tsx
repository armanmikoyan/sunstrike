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
import { composerCopy } from "./constants";
import { cn } from "@/lib/utils";
import type { ComposerAspectMenuProps } from "./types";

export function ComposerAspectMenu({ composer }: ComposerAspectMenuProps) {
  const { aspect, setAspect, aspectOptions } = composer;
  const shape =
    aspectOptions.find((ratio) => ratio.value === aspect)?.shape ?? "h-3 w-4";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 rounded-lg px-2 text-[0.6875rem] font-medium text-muted-foreground hover:bg-white/[0.055] hover:text-foreground"
        >
          <span
            className={cn(
              "rounded-[0.125rem] border border-current opacity-80",
              shape,
            )}
          />
          {aspect}
          <ChevronDown className="size-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 p-1.5">
        <DropdownMenuLabel>{composerCopy.aspectRatio}</DropdownMenuLabel>
        {aspectOptions.map((ratio) => (
          <DropdownMenuItem
            key={ratio.value}
            onSelect={() => setAspect(ratio.value)}
            className={cn(
              "gap-2 p-2",
              aspect === ratio.value && "bg-white/[0.08] text-foreground",
            )}
          >
            <span
              className={cn(
                "rounded-[0.125rem] border border-current opacity-80",
                ratio.shape,
              )}
            />
            <span className="text-[0.75rem]">{ratio.value}</span>
            <span className="ml-auto text-[0.6875rem] text-muted-foreground">
              {ratio.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
