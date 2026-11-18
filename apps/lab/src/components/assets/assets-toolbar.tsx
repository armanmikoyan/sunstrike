"use client";

import { CountBadge } from "@/ui/count-badge";
import { SegmentedTabs } from "@/ui/segmented-tabs";
import { ASSETS_COPY, FILTERS } from "./constants";
import type { AssetsToolbarProps } from "./types";

/** Recent-assets heading, count and the all/image/video filter chips. */
export function AssetsToolbar({ filter, count, onFilterChange }: AssetsToolbarProps) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-sm lg:text-xs font-medium">{ASSETS_COPY.recentTitle}</h2>
        <CountBadge>{count}</CountBadge>
      </div>
      <SegmentedTabs
        value={filter}
        onValueChange={onFilterChange}
        options={FILTERS}
        ariaLabel={ASSETS_COPY.filterLabel}
      />
    </div>
  );
}
