"use client";

import { useStudio } from "./hooks";
import { StudioControls } from "./studio-controls";
import { StudioHeader } from "./studio-header";
import { StudioPreview } from "./studio-preview";
import { StudioQueueDialog } from "./studio-queue-dialog";
import { StudioSummary } from "./studio-summary";
import { StudioTakes } from "./studio-takes";
import type { GenerationMode } from "@/lib/generation";

export { StudioSkeleton } from "./studio-skeleton";

export function Studio({ initialMode }: { initialMode: GenerationMode }) {
  const studio = useStudio(initialMode);

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col lg:h-[calc(100vh-3rem)] lg:min-h-[45rem] lg:overflow-hidden">
      <StudioHeader mode={initialMode} credits={studio.credits} />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <StudioControls studio={studio} />
        <StudioPreview studio={studio}>
          <StudioTakes studio={studio} />
          <StudioSummary studio={studio} />
        </StudioPreview>
      </div>
      <StudioQueueDialog studio={studio} />
    </div>
  );
}
