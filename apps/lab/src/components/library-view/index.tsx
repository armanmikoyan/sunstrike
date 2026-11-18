"use client";

import { Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EmptyState } from "@/ui/empty-state";
import { MediaCard } from "@/components/media-card";
import { SearchInput } from "@/ui/search-input";
import { SegmentedTabs } from "@/ui/segmented-tabs";
import { INSTANT_TRANSITION, LAYOUT_SPRING } from "@/motion/constants";
import { LIBRARY_ITEMS, LIBRARY_TABS, LIBRARY_VIEW_COPY } from "./constants";
import { useLibraryView } from "./hooks";

export function LibraryView() {
  const { tab, setTab, query, setQuery, filtered } = useLibraryView();
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <SegmentedTabs
          value={tab}
          onValueChange={setTab}
          options={LIBRARY_TABS}
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
        <AnimatePresence initial={false} mode="popLayout">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={reduceMotion ? INSTANT_TRANSITION : LAYOUT_SPRING}
            >
              <MediaCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
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
