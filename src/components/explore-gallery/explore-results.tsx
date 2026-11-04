"use client";

import { Search } from "lucide-react";
import { MediaCard } from "@/components/media-card";
import { Button } from "@/components/ui/button";
import type { ExploreGalleryState } from "./hooks";

export function ExploreResults({
  gallery,
}: {
  gallery: ExploreGalleryState;
}) {
  const {
    filtered,
    category,
    kind,
    setCategory,
    setKind,
    setQuery,
  } = gallery;

  return (
    <div className="pt-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[0.6875rem] text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "frame" : "frames"}
          {category !== "All" ? ` · ${category}` : ""}
          {kind !== "all" ? ` · ${kind}` : ""}
        </p>
        <p className="hidden text-[0.6875rem] text-muted-foreground sm:block">
          Updated live
        </p>
      </div>

      {filtered.length ? (
        <div className="columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4">
          {filtered.map((item) => (
            <div key={item.id} className="mb-3 break-inside-avoid">
              <MediaCard item={item} aspect={item.aspect} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[20rem] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.015] text-center">
          <Search className="size-5 text-muted-foreground" />
          <p className="mt-3 text-[0.8125rem] font-medium">No frames found</p>
          <p className="mt-1 text-[0.8125rem] text-muted-foreground">
            Try a different search or clear the filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 h-8 rounded-lg border-white/10 text-[0.6875rem]"
            onClick={() => {
              setCategory("All");
              setKind("all");
              setQuery("");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}

      {filtered.length ? (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="h-9 rounded-lg border-white/[0.08] bg-white/[0.02] px-5 text-[0.6875rem] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
          >
            Load more work
          </Button>
        </div>
      ) : null}
    </div>
  );
}
