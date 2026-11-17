"use client";

import { Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MediaCard } from "@/components/media-card";
import { Input } from "@/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { instantTransition, layoutSpring } from "@/lib/motion";
import { libraryItems, libraryTabs, libraryViewCopy } from "./constants";
import { useLibraryView } from "./hooks";

export function LibraryView() {
  const { tab, setTab, query, setQuery, filtered } = useLibraryView();
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as typeof tab)}
        >
          <TabsList
            aria-label="Filter library"
            className="group-data-horizontal/tabs:h-9 gap-0 rounded-lg border border-white/[0.07] bg-white/[0.015] p-0.5 lg:group-data-horizontal/tabs:h-7"
          >
            {libraryTabs.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="flex-none rounded-[0.625rem] px-2.5 text-sm font-medium text-muted-foreground group-data-[variant=default]/tabs-list:data-active:shadow-none data-active:bg-white/[0.08] data-active:text-foreground lg:text-[0.6875rem] dark:data-active:border-transparent dark:data-active:bg-white/[0.08] dark:data-active:text-foreground"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-[13.75rem]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={libraryViewCopy.searchPlaceholder}
            className="h-9 rounded-lg border-white/[0.08] bg-white/[0.035] pl-8 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-white/15 focus-visible:border-white/[0.08] focus-visible:bg-white/[0.05] focus-visible:ring-0 md:text-sm lg:text-[0.6875rem] dark:bg-white/[0.035] dark:focus-visible:bg-white/[0.05]"
          />
        </div>
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
              transition={reduceMotion ? instantTransition : layoutSpring}
            >
              <MediaCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!filtered.length ? (
        <div className="mt-6 flex min-h-[18.75rem] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.015]">
          <Search className="size-5 text-muted-foreground" />
          <p className="mt-3 text-sm lg:text-[0.75rem] font-medium">
            {libraryViewCopy.emptyTitle}
          </p>
          <p className="mt-1 text-xs lg:text-[0.6875rem] text-muted-foreground">
            {libraryViewCopy.emptyDescription}
          </p>
        </div>
      ) : null}

      <p className="mt-5 text-center text-xs lg:text-[0.6875rem] text-muted-foreground">
        {libraryViewCopy.showing} {filtered.length} {libraryViewCopy.of}{" "}
        {libraryItems.length} {libraryViewCopy.frames}
      </p>
    </div>
  );
}
