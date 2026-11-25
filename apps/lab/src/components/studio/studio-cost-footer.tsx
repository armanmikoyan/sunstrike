"use client";

import { Film, Image as ImageIcon } from "lucide-react";
import { Button } from "@/ui/button";
import { formatUSD } from "@/components/pricing/utils";
import { STUDIO_COPY } from "./constants";
import { StudioCost } from "./studio-cost";
import type { StudioScopedProps } from "./types";

export function StudioCostFooter({ studio }: StudioScopedProps) {
  return (
    <div className="border-t border-border bg-white/1.5 p-4">
      <div className="mb-2.5 flex items-center justify-between text-xs lg:text-[0.6875rem]">
        <span className="text-muted-foreground">{STUDIO_COPY.controls.estimatedCost}</span>
        <span className="font-mono text-foreground/80">
          <StudioCost cost={studio.cost} />
        </span>
      </div>
      <Button type="button" size="cta" onClick={() => studio.setQueued(true)} className="w-full rounded-xl">
        {studio.isVideo ? <Film className="size-3.5" /> : <ImageIcon className="size-3.5" />}
        {studio.isVideo ? STUDIO_COPY.controls.generate.video : STUDIO_COPY.controls.generate.image}
      </Button>
      <p className="mt-2 text-center text-xs lg:text-[0.6875rem] text-muted-foreground">
        <span className="tabular-nums font-normal">{formatUSD(studio.credits)}</span> {STUDIO_COPY.controls.available}
      </p>
    </div>
  );
}
