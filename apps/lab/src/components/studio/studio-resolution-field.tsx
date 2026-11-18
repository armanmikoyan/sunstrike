"use client";

import { STUDIO_COPY } from "./constants";
import { StudioSelectField } from "./studio-select-field";
import type { StudioScopedProps } from "./types";

export function StudioResolutionField({ studio }: StudioScopedProps) {
  return (
    <StudioSelectField
      label={STUDIO_COPY.controls.resolution}
      value={studio.resolution}
      options={studio.resolutionOptions.map((value) => ({ value, label: value }))}
      onChange={studio.setResolution}
    />
  );
}
