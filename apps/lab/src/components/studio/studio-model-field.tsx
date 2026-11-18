"use client";

import { formatUSD } from "@/components/pricing/utils";
import { STUDIO_COPY } from "./constants";
import { StudioSelectField } from "./studio-select-field";
import type { StudioScopedProps } from "./types";

export function StudioModelField({ studio }: StudioScopedProps) {
  const model = studio.selectedModel;

  return (
    <>
      <StudioSelectField
        label={STUDIO_COPY.controls.model}
        value={model.displayName}
        options={studio.activeModels.map((item) => ({
          value: item.displayName,
          label: item.displayName,
          hint: (
            <>
              {item.provider} · <span className="tabular-nums font-normal">{formatUSD(item.cost)}</span>
            </>
          ),
        }))}
        onChange={studio.setModel}
      />
      <div className="mt-1.5 flex items-center justify-between gap-3 text-xs lg:text-[0.6875rem]">
        <span className="text-muted-foreground">{model.provider}</span>
        <span className="text-muted-foreground">
          {model.capabilities.audio ? STUDIO_COPY.controls.audio : STUDIO_COPY.controls.silent}
        </span>
      </div>
    </>
  );
}
