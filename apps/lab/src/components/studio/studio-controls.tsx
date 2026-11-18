"use client";

import { StudioAspectField } from "./studio-aspect-field";
import { StudioAudioField } from "./studio-audio-field";
import { StudioCostFooter } from "./studio-cost-footer";
import { StudioDurationField } from "./studio-duration-field";
import { StudioModelField } from "./studio-model-field";
import { StudioPromptField } from "./studio-prompt-field";
import { StudioReferencesField } from "./studio-references-field";
import { StudioResolutionField } from "./studio-resolution-field";
import { StudioTemplateField } from "./studio-template-field";
import type { StudioScopedProps } from "./types";

export function StudioControls({ studio }: StudioScopedProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-background lg:w-97 lg:border-b-0 lg:border-r">
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <StudioPromptField studio={studio} />
        <StudioReferencesField studio={studio} />
        <StudioTemplateField studio={studio} />
        <StudioModelField studio={studio} />
        <StudioAspectField studio={studio} />
        <StudioResolutionField studio={studio} />
        <StudioDurationField studio={studio} />
        <StudioAudioField studio={studio} />
      </div>
      <StudioCostFooter studio={studio} />
    </aside>
  );
}
