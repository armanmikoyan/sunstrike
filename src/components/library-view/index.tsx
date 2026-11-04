"use client";

import { Search } from "lucide-react";
import { MediaCard } from "@/components/media-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { libraryItems, libraryTabs } from "./constants";
import { useLibraryView } from "./hooks";

export function LibraryView() {
  const { tab, setTab, query, setQuery, filtered } = useLibraryView();

  return (
    <div className="mt-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList
            variant="line"
            className="h-8 gap-4 border-b-0 bg-transparent p-0"
          >
            {libraryTabs.map(([value, label]) => (
              <TabsTrigger
                key={value}
                value={value}
                className="h-8 flex-none px-0 text-[0.6875rem] font-medium text-muted-foreground data-active:text-foreground"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-[13.75rem]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your library"
            className="h-8 rounded-lg border-white/[0.08] bg-white/[0.025] pl-8 text-[0.6875rem] placeholder:text-muted-foreground/60 focus-visible:border-white/25 focus-visible:ring-white/10"
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>

      {!filtered.length ? (
        <div className="mt-6 flex min-h-[18.75rem] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.015]">
          <Search className="size-5 text-muted-foreground" />
          <p className="mt-3 text-[0.8125rem] font-medium">Nothing here yet</p>
          <p className="mt-1 text-[0.6875rem] text-muted-foreground">
            Generate a frame or clear your search.
          </p>
        </div>
      ) : null}

      <p className="mt-5 text-center text-[0.6875rem] text-muted-foreground">
        Showing {filtered.length} of {libraryItems.length} frames
      </p>
    </div>
  );
}
