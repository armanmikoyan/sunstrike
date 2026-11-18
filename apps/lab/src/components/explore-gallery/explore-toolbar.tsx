"use client";

import { SegmentedTabs } from "@/ui/segmented-tabs";
import { SearchInput } from "@/ui/search-input";
import { EXPLORE_TOOLBAR_COPY, KIND_OPTIONS } from "./constants";
import type { ExploreGalleryProps } from "./types";

export function ExploreToolbar({ gallery: { kind, setKind, query, setQuery } }: ExploreGalleryProps) {
  return (
    <div className="relative -mx-5 border-b border-border bg-background px-5 py-3">
      <div className="flex items-center justify-between gap-2">
        <SegmentedTabs
          value={kind}
          onValueChange={setKind}
          options={KIND_OPTIONS}
          ariaLabel={EXPLORE_TOOLBAR_COPY.filterLabel}
        />

        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder={EXPLORE_TOOLBAR_COPY.searchPlaceholder}
          ariaLabel={EXPLORE_TOOLBAR_COPY.searchLabel}
          className="min-w-0 flex-1 sm:max-w-47.5 lg:w-47.5 lg:flex-none"
        />
      </div>
    </div>
  );
}
