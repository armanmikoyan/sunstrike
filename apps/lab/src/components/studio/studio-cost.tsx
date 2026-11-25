import { LoaderCircle } from "lucide-react";
import { cn } from "cn";
import { formatUSD } from "@/components/pricing/utils";
import { SKELETON_BAR, STUDIO_COPY } from "./constants";
import type { StudioCostProps } from "./types";

export function StudioCost({ cost: { total, pending } }: StudioCostProps) {
  if (total === null) {
    return (
      <span className="inline-flex items-center align-middle">
        <span className={cn(SKELETON_BAR, "h-2 w-8 animate-pulse bg-white/10")} />
        <span className="sr-only">{STUDIO_COPY.controls.pricing}</span>
      </span>
    );
  }

  return (
    <span aria-busy={pending} className="inline-flex items-center gap-1 align-middle">
      {pending ? (
        <span aria-hidden="true" className="inline-flex animate-in fade-in delay-150 duration-200 fill-mode-backwards">
          <LoaderCircle className="size-3 animate-spin text-muted-foreground motion-reduce:animate-none" />
        </span>
      ) : null}
      <span
        className={cn("tabular-nums font-normal transition-opacity duration-150", pending && "opacity-50 delay-150")}
      >
        {formatUSD(total)}
      </span>
      {pending ? <span className="sr-only">{STUDIO_COPY.controls.pricing}</span> : null}
    </span>
  );
}
