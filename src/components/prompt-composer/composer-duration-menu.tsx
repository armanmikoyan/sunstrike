"use client";

import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { durations } from "@/lib/generation";
import type { PromptComposerState } from "./hooks";

export function ComposerDurationMenu({
  composer,
}: {
  composer: PromptComposerState;
}) {
  const { duration, setDuration } = composer;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1 rounded-lg px-2 text-[0.6875rem] font-medium text-muted-foreground hover:bg-white/[0.055] hover:text-foreground"
        >
          {duration}
          <ChevronDown className="size-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36 p-1.5">
        <DropdownMenuLabel>Duration</DropdownMenuLabel>
        {durations.map((value) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => setDuration(value)}
            className="p-2 text-[0.75rem]"
          >
            {value}
            {duration === value ? (
              <Check className="ml-auto size-3 text-foreground" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
