"use client";

import { STUDIO_COPY } from "./constants";
import { StudioDurationMenu } from "./studio-duration-menu";
import { StudioField } from "./studio-field";
import type { StudioScopedProps } from "./types";

export function StudioDurationField({ studio }: StudioScopedProps) {
  if (studio.durationOptions.length === 0) return null;

  return (
    <StudioField label={STUDIO_COPY.controls.duration}>
      <StudioDurationMenu
        className="mt-2 w-full border border-white/8 bg-white/1.5 font-normal hover:bg-white/3.5"
        options={studio.durationOptions}
        value={studio.duration}
        onValueChange={studio.setDuration}
        label={STUDIO_COPY.controls.duration}
      />
    </StudioField>
  );
}
