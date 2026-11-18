"use client";

import { StudioPreviewHeader } from "./studio-preview-header";
import { StudioPreviewInfo } from "./studio-preview-info";
import { StudioPreviewStage } from "./studio-preview-stage";
import type { StudioPreviewProps } from "./types";

export function StudioPreview({ studio, children }: StudioPreviewProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <StudioPreviewHeader studio={studio} />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-245">
          <StudioPreviewStage studio={studio} />
          <StudioPreviewInfo studio={studio} />
          {children}
        </div>
      </div>
    </section>
  );
}
