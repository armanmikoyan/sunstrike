"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { StudioDurationSlider } from "@/components/studio/studio-duration-slider";
import { formatDuration } from "@/components/studio/utils";
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
          {formatDuration(duration)}
          <ChevronDown className="size-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60 p-1">
        <DropdownMenuLabel>{COMPOSER_COPY.duration}</DropdownMenuLabel>
        <StudioDurationSlider
          className="px-2 pb-2"
          options={durationOptions}
          value={duration}
          onValueChange={setDuration}
          label={COMPOSER_COPY.duration}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
