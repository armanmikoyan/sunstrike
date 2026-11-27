"use client";

import { Switch } from "@/ui/switch";
import { STUDIO_COPY } from "./constants";
import type { StudioScopedProps } from "./types";

export function StudioAudioField({ studio }: StudioScopedProps) {
  if (!studio.selectedModel.capabilities.audio) return null;

  return (
    <div className="mt-5 flex items-center justify-between gap-4">
      <div>
        <p id="studio-audio-label" className="text-xs lg:text-[0.6875rem] font-medium text-foreground/80">
          {STUDIO_COPY.controls.audio}
        </p>
        <p className="mt-0.5 text-xs lg:text-[0.6875rem] text-muted-foreground">{STUDIO_COPY.controls.audioHint}</p>
      </div>
      <Switch checked={studio.audio} onCheckedChange={studio.setAudio} aria-labelledby="studio-audio-label" />
    </div>
  );
}
