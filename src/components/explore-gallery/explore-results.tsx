"use client";

import { Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MediaCard } from "@/components/media-card";
import { Button } from "@/ui/button";
import { instantTransition, layoutSpring } from "@/lib/motion";
import { exploreResultsCopy } from "./constants";
import type { ExploreResultsProps } from "./types";

export function ExploreResults({ gallery }: ExploreResultsProps) {
  const { filtered, kind, setKind, setQuery } = gallery;
  const reduceMotion = useReducedMotion();

  return (
    <div className="pt-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[0.6875rem] text-muted-foreground">
          {filtered.length}{" "}
          {filtered.length === 1
            ? exploreResultsCopy.frame
            : exploreResultsCopy.frames}
          {kind !== "all" ? ` · ${kind}` : ""}
        </p>
      </div>

      {filtered.length ? (
        <div className="columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4">
          <AnimatePresence initial={false} mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={reduceMotion ? instantTransition : layoutSpring}
                className="mb-3 break-inside-avoid"
              >
                <MediaCard item={item} aspect={item.aspect} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex min-h-[20rem] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.015] text-center">
          <Search className="size-5 text-muted-foreground" />
          <p className="mt-3 text-[0.8125rem] font-medium">
            {exploreResultsCopy.emptyTitle}
          </p>
          <p className="mt-1 text-[0.8125rem] text-muted-foreground">
            {exploreResultsCopy.emptyDescription}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 h-8 rounded-lg border-white/10 text-[0.6875rem]"
            onClick={() => {
              setKind("all");
              setQuery("");
            }}
          >
            {exploreResultsCopy.clearFilters}
          </Button>
        </div>
      )}

      {filtered.length ? (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="h-9 rounded-lg border-white/[0.08] bg-white/[0.015] px-5 text-[0.6875rem] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
          >
            {exploreResultsCopy.loadMore}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
