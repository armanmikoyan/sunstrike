"use client";

import { STUDIO_COPY } from "./constants";
import { StudioDurationSlider } from "./studio-duration-slider";
import { StudioField } from "./studio-field";
import type { StudioScopedProps } from "./types";

export function StudioDurationField({ studio }: StudioScopedProps) {
  if (studio.durationOptions.length === 0) return null;

  return (
    <StudioField label={STUDIO_COPY.controls.duration}>
      <StudioDurationSlider
        className="mt-2"
        options={studio.durationOptions}
        value={studio.duration}
        onValueChange={studio.setDuration}
        label={STUDIO_COPY.controls.duration}
      />
    </StudioField>
  );
}
