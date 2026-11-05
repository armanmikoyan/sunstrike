"use client";

import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { aspectRatios } from "@/lib/generation";
import { cn } from "@/lib/utils";
import { composerCopy } from "./constants";
import type { ComposerAspectMenuProps } from "./types";

export function ComposerAspectMenu({ composer }: ComposerAspectMenuProps) {
  const { aspect, setAspect } = composer;
  const shape =
    aspectRatios.find((ratio) => ratio.value === aspect)?.shape ?? "h-3 w-4";

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
        {aspectRatios.map((ratio) => (
          <DropdownMenuItem
            key={ratio.value}
            onSelect={() => setAspect(ratio.value)}
            className="gap-2 p-2"
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
            {aspect === ratio.value ? (
              <Check className="size-3 text-foreground" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
