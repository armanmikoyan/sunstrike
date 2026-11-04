"use client";

import { Check, ChevronDown } from "lucide-react";
import { AspectShape } from "@/components/aspect-shape";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { aspectRatios } from "@/lib/generation";
import type { PromptComposerState } from "./hooks";

export function ComposerAspectMenu({
  composer,
}: {
  composer: PromptComposerState;
}) {
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
          <AspectShape className={shape} />
          {aspect}
          <ChevronDown className="size-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 p-1.5">
        <DropdownMenuLabel>Aspect ratio</DropdownMenuLabel>
        {aspectRatios.map((ratio) => (
          <DropdownMenuItem
            key={ratio.value}
            onSelect={() => setAspect(ratio.value)}
            className="gap-2 p-2"
          >
            <AspectShape className={ratio.shape} />
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
