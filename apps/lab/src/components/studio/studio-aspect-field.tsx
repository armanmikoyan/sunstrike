"use client";

import { cn } from "cn";
import { STUDIO_COPY } from "./constants";
import { StudioField } from "./studio-field";
import type { StudioScopedProps } from "./types";

export function StudioAspectField({ studio }: StudioScopedProps) {
  return (
    <StudioField label={STUDIO_COPY.controls.aspectRatio}>
      <div className="mt-2 grid grid-cols-6 gap-1 rounded-lg border border-white/7 bg-white/1.5 p-0.5">
        {studio.aspectOptions.map((ratio) => (
          <button
            key={ratio.value}
            type="button"
            onClick={() => studio.setAspect(ratio.value)}
            aria-label={`${ratio.label} ${ratio.value}`}
            className={cn(
              "flex h-7 items-center justify-center rounded-[0.625rem] text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
              studio.aspect === ratio.value && "bg-white/8 text-foreground shadow-sm",
            )}
          >
            <span className={cn("rounded-xs border border-current opacity-80", ratio.shape)} />
          </button>
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-xs lg:text-[0.6875rem] text-muted-foreground">
        <span>{studio.aspectLabel}</span>
        <span className="font-mono">{studio.aspect}</span>
      </div>
    </StudioField>
  );
}
