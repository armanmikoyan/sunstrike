"use client";

import { Search } from "lucide-react";
import { EmptyState } from "@/ui/empty-state";
import { MediaCard } from "@/components/media-card";
import { Button } from "@/ui/button";
import { PresenceList } from "@/motion/presence-list";
import { EXPLORE_RESULTS_COPY } from "./constants";
import type { ExploreGalleryProps } from "./types";

export function ExploreResults({ gallery: { filtered, kind, setKind, setQuery } }: ExploreGalleryProps) {
  return (
    <div className="pt-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground lg:text-[0.6875rem]">
          {filtered.length} {filtered.length === 1 ? EXPLORE_RESULTS_COPY.frame : EXPLORE_RESULTS_COPY.frames}
          {kind !== "all" ? ` · ${kind}` : ""}
        </p>
      </div>

      {filtered.length ? (
        <div className="columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4">
          <PresenceList items={filtered} itemClassName="mb-3 break-inside-avoid">
            {(item) => <MediaCard item={item} aspect={item.aspect} />}
          </PresenceList>
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title={EXPLORE_RESULTS_COPY.emptyTitle}
          description={EXPLORE_RESULTS_COPY.emptyDescription}
          action={
            <Button
              variant="outline"
              className="h-9 border-white/10 lg:h-8"
              onClick={() => {
                setKind("all");
                setQuery("");
              }}
            >
              {EXPLORE_RESULTS_COPY.clearFilters}
            </Button>
          }
        />
      )}

      {filtered.length ? (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="h-10 border-white/8 bg-white/1.5 px-5 text-muted-foreground hover:bg-white/5 hover:text-foreground lg:h-9"
          >
            {EXPLORE_RESULTS_COPY.loadMore}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
