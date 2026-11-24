"use client";

import { Maximize, Pause, Volume2 } from "lucide-react";
import { STUDIO_COPY } from "./constants";
import type { StudioScopedProps } from "./types";

export function StudioPreviewPlayback({ studio: { active, audio, duration, isVideo } }: StudioScopedProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
      <div className="mb-2.5 flex items-center gap-1.5">
        <span className="rounded border border-white/15 bg-black/30 px-1.5 py-0.5 font-mono text-xs lg:text-[0.6875rem] text-white/70">
          {isVideo ? STUDIO_COPY.preview.times.video : STUDIO_COPY.preview.times.image}
        </span>
        <div className="relative h-0.75 flex-1 overflow-hidden rounded-full bg-white/20">
          <span className="absolute inset-y-0 left-0 w-[38%] rounded-full bg-foreground/80" />
          <span className="absolute left-[38%] top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" />
        </div>
        <span className="font-mono text-xs lg:text-[0.6875rem] text-white/60">
          {isVideo && duration ? duration : STUDIO_COPY.preview.image}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {isVideo ? (
            <button
              type="button"
              className="grid size-7 place-items-center rounded-md text-white/80 hover:bg-white/10 hover:text-white"
              aria-label={STUDIO_COPY.preview.pause}
            >
              <Pause className="size-3 fill-current" />
            </button>
          ) : null}
          {audio ? (
            <button
              type="button"
              className="grid size-7 place-items-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
              aria-label={STUDIO_COPY.preview.volume}
            >
              <Volume2 className="size-3" />
            </button>
          ) : null}
          <span className="ml-1 max-w-55 truncate text-xs lg:text-[0.6875rem] text-white/55">{active.title}</span>
        </div>
        <button
          type="button"
          className="grid size-7 place-items-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
          aria-label={STUDIO_COPY.preview.fullscreen}
        >
          <Maximize className="size-3" />
        </button>
      </div>
    </div>
  );
}
