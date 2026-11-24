"use client";

import { Search } from "lucide-react";
import { EmptyState } from "@/ui/empty-state";
import { MediaCard } from "@/components/media-card";
import { MEDIA_FILTER_OPTIONS } from "@/components/media-card/constants";
import { SearchInput } from "@/ui/search-input";
import { SegmentedTabs } from "@/ui/segmented-tabs";
import { PresenceList } from "@/motion/presence-list";
import { LIBRARY_ITEMS, LIBRARY_VIEW_COPY } from "./constants";
import { useLibraryView } from "./hooks";

export function LibraryView() {
  const { tab, setTab, query, setQuery, filtered } = useLibraryView();
  return (
    <div className="mt-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <SegmentedTabs
          value={tab}
          onValueChange={setTab}
          options={MEDIA_FILTER_OPTIONS}
          ariaLabel={LIBRARY_VIEW_COPY.filterLabel}
        />

        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder={LIBRARY_VIEW_COPY.searchPlaceholder}
          ariaLabel={LIBRARY_VIEW_COPY.searchLabel}
          className="w-full sm:w-55"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-4">
        <PresenceList items={filtered}>{(item) => <MediaCard item={item} />}</PresenceList>
      </div>

      {!filtered.length ? (
        <EmptyState
          icon={Search}
          title={LIBRARY_VIEW_COPY.emptyTitle}
          description={LIBRARY_VIEW_COPY.emptyDescription}
          className="mt-6"
        />
      ) : null}

      <p className="mt-5 text-center text-xs lg:text-[0.6875rem] text-muted-foreground">
        {LIBRARY_VIEW_COPY.showing} {filtered.length} {LIBRARY_VIEW_COPY.of} {LIBRARY_ITEMS.length}{" "}
        {LIBRARY_VIEW_COPY.frames}
      </p>
    </div>
  );
}
