"use client";

import { useSelectedModel } from "./hooks";
import { StudioSkeleton } from "./studio-skeleton";
import { StudioUnavailable } from "./studio-unavailable";
import { StudioWorkspace } from "./studio-workspace";
import type { StudioProps } from "./types";

export function Studio({ initialMode }: StudioProps) {
  const { status, activeModels, selectedModel } = useSelectedModel(initialMode);

  if (selectedModel) {
    return <StudioWorkspace initialMode={initialMode} models={activeModels} selectedModel={selectedModel} />;
  }

  return status === "loading" ? <StudioSkeleton /> : <StudioUnavailable initialMode={initialMode} />;
}
