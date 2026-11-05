"use client";

import {
  Clapperboard,
  Layers3,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { starterPrompts, studioCopy } from "./constants";
import type { StudioSummaryProps } from "./types";

export function StudioSummary({ studio }: StudioSummaryProps) {
  const copy = studioCopy.summary;
  const { selectedModel, aspect, camera, duration, prompt, isVideo } = studio;
  const shownPrompt = prompt || starterPrompts[isVideo ? "video" : "image"];

  const facts = [
    { icon: Layers3, label: copy.model, value: selectedModel.name },
    {
      icon: Clapperboard,
      label: copy.direction,
      value: isVideo ? `${camera} · ${duration}` : copy.singleFrame,
    },
    { icon: Layers3, label: copy.output, value: `${aspect} · ${copy.resolution}` },
  ];

  return (
    <>
      <div className="mx-auto mt-7 grid max-w-[61.25rem] gap-2 sm:grid-cols-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5"
          >
            <fact.icon
              className="size-3 text-muted-foreground"
              strokeWidth={1.8}
            />
            <div className="min-w-0">
              <p className="text-[0.6875rem] text-muted-foreground">
                {fact.label}
              </p>
              <p className="mt-0.5 truncate text-[0.6875rem]">{fact.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-2.5 max-w-[61.25rem] rounded-lg border border-white/[0.07] bg-white/[0.015] p-3">
        <div className="flex items-center justify-between">
          <p className="text-[0.6875rem] text-muted-foreground">
            {copy.currentPrompt}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                aria-label={copy.promptOptions}
              >
                <MoreHorizontal className="size-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1.5">
              <DropdownMenuLabel>{copy.promptMenuLabel}</DropdownMenuLabel>
              <DropdownMenuItem className="p-2 text-[0.6875rem]">
                {copy.copyPrompt}
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 text-[0.6875rem]">
                {copy.saveToFavorites}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-2 text-[0.6875rem]">
                {copy.resetToLast}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[0.75rem] leading-relaxed text-muted-foreground">
          {shownPrompt}
        </p>
      </div>
    </>
  );
}
