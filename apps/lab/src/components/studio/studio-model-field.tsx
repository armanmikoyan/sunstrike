"use client";

import { STUDIO_COPY } from "./constants";
import { StudioModelLogo } from "./studio-model-logo";
import { StudioSelectField } from "./studio-select-field";
import type { StudioScopedProps } from "./types";
import { formatRate } from "./utils";

export function StudioModelField({ studio }: StudioScopedProps) {
  const model = studio.selectedModel;

  return (
    <>
      <StudioSelectField
        label={STUDIO_COPY.controls.model}
        value={model.id}
        options={studio.activeModels.map((item) => ({
          value: item.id,
          label: item.displayName,
          icon: <StudioModelLogo vendor={item.vendor} />,
          hint: <span className="tabular-nums font-normal">{formatRate(item)}</span>,
        }))}
        onChange={studio.setModel}
      />
      <div className="mt-1.5 flex items-center justify-between gap-3 text-xs lg:text-[0.6875rem]">
        <span className="min-w-0 truncate text-muted-foreground" title={model.summary}>
          {model.summary}
        </span>
        <span className="shrink-0 text-muted-foreground">
          {model.capabilities.audio ? STUDIO_COPY.controls.audio : STUDIO_COPY.controls.silent}
        </span>
      </div>
    </>
  );
}
