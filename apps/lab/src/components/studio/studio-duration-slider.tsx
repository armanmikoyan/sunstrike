"use client";

import { Slider } from "@/ui/slider";
import type { StudioDurationSliderProps } from "./types";
import { durationIndex, formatDuration, formatDurationRange, spokenDuration } from "./utils";

export function StudioDurationSlider({ options, value, onValueChange, label, className }: StudioDurationSliderProps) {
  const last = Math.max(options.length - 1, 1);

  return (
    <div className={className}>
      <div className="flex h-9 items-center rounded-lg border border-white/7 bg-white/1.5 px-3">
        <Slider
          min={0}
          max={last}
          step={1}
          marks
          value={[durationIndex(options, value)]}
          onValueChange={([index]) => {
            const seconds = index === undefined ? undefined : options[index];

            if (seconds !== undefined) onValueChange(seconds);
          }}
          disabled={options.length < 2}
          aria-label={label}
          valueText={spokenDuration(value)}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between font-mono text-xs lg:text-[0.6875rem] text-muted-foreground">
        <span>{formatDurationRange(options)}</span>
        <span className="text-foreground">{formatDuration(value)}</span>
      </div>
    </div>
  );
}
