"use client";

import { Download } from "lucide-react";
import { formatUSD } from "@/components/pricing/utils";
import { STUDIO_COPY } from "./constants";
import type { StudioScopedProps } from "./types";

/** Title, output summary and download action below the frame. */
export function StudioPreviewInfo({
  studio: { active, aspect, cost, duration, isVideo, resolution, selectedModel },
}: StudioScopedProps) {
  return (
    <div className="mx-auto mt-3 flex max-w-245 items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-xs lg:text-[0.6875rem] font-medium">{active.title}</p>
        <p className="mt-0.5 truncate text-xs lg:text-[0.6875rem] text-muted-foreground">
          {selectedModel.displayName} · {aspect} · {isVideo && duration ? duration : resolution} ·{" "}
          <span className="tabular-nums font-normal">{formatUSD(cost)}</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          className="flex h-7 items-center gap-1.5 rounded-md border border-white/8 px-2 text-xs lg:text-[0.6875rem] text-muted-foreground transition-colors hover:bg-white/4 hover:text-foreground"
        >
          <Download className="size-3" />
          {STUDIO_COPY.preview.download}
        </button>
      </div>
    </div>
  );
}
