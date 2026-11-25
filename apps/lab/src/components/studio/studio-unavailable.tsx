"use client";

import { STUDIO_COPY } from "./constants";
import { useSharedState } from "./hooks";
import { StudioHeader } from "./studio-header";
import { balanceAtom } from "./state";
import type { StudioProps } from "./types";

export function StudioUnavailable({ initialMode }: StudioProps) {
  const [credits] = useSharedState(balanceAtom);

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col lg:h-[calc(100vh-3rem)] lg:min-h-180 lg:overflow-hidden">
      <StudioHeader mode={initialMode} credits={credits} />
      <div role="status" className="flex flex-1 flex-col items-center justify-center gap-1.5 p-6 text-center">
        <p className="text-sm font-medium text-foreground">{STUDIO_COPY.unavailable.title}</p>
        <p className="max-w-80 text-xs lg:text-[0.6875rem] text-muted-foreground">{STUDIO_COPY.unavailable.body}</p>
      </div>
    </div>
  );
}
