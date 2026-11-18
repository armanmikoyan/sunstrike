"use client";

import { Clock3, Download, MoreHorizontal } from "lucide-react";
import { CountBadge } from "@/ui/count-badge";
import { Button } from "@/ui/button";
import { STUDIO_COPY } from "./constants";
import type { StudioScopedProps } from "./types";

export function StudioPreviewHeader({ studio }: StudioScopedProps) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-border px-3 sm:px-4">
      <div className="flex items-center gap-2">
        <span className="text-xs lg:text-[0.6875rem] font-medium">{STUDIO_COPY.preview.title}</span>
        <CountBadge>{studio.aspect}</CountBadge>
        <span className="hidden items-center gap-1 text-xs lg:text-[0.6875rem] text-muted-foreground sm:flex">
          <Clock3 className="size-2.5" />
          {studio.active.createdAt}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="hidden rounded border border-white/8 px-1.5 py-0.5 font-mono text-xs lg:text-[0.6875rem] text-muted-foreground sm:inline">
          {studio.resolution}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
          aria-label={STUDIO_COPY.preview.downloadPreview}
        >
          <Download className="size-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
          aria-label={STUDIO_COPY.preview.moreOptions}
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
