"use client";

import { cn } from "cn";
import { STUDIO_COPY } from "./constants";
import { StudioField } from "./studio-field";
import type { StudioScopedProps } from "./types";

export function StudioDurationField({ studio }: StudioScopedProps) {
  if (studio.durationOptions.length === 0) return null;

  return (
    <StudioField label={STUDIO_COPY.controls.duration}>
      <div className="mt-2 flex gap-1">
        {studio.durationOptions.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => studio.setDuration(value)}
            className={cn(
              "h-7 flex-1 rounded-lg border border-white/7 bg-white/1.5 font-mono text-xs lg:text-[0.6875rem] text-muted-foreground transition-colors hover:bg-white/4 hover:text-foreground",
              studio.duration === value && "border-white/20 bg-white/8 text-foreground",
            )}
          >
            {value}
          </button>
        ))}
      </div>
    </StudioField>
  );
}
