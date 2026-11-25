import { cn } from "cn";
import { formatUSD } from "@/components/pricing/utils";
import { SKELETON_BAR, STUDIO_COPY } from "./constants";
import type { StudioCostProps } from "./types";

export function StudioCost({ cost }: StudioCostProps) {
  if (cost === null) {
    return (
      <span className="inline-flex items-center align-middle">
        <span className={cn(SKELETON_BAR, "h-2 w-8 animate-pulse bg-white/10")} />
        <span className="sr-only">{STUDIO_COPY.controls.pricing}</span>
      </span>
    );
  }

  return <span className="tabular-nums font-normal">{formatUSD(cost)}</span>;
}
