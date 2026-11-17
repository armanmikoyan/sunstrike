"use client";

import { Search } from "lucide-react";
import { Input } from "@/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { exploreToolbarCopy, kindOptions } from "./constants";
import type { ExploreToolbarProps } from "./types";

export function ExploreToolbar({ gallery }: ExploreToolbarProps) {
  const { kind, setKind, query, setQuery } = gallery;

  return (
    <div className="relative -mx-5 border-b border-border bg-background px-5 py-3">
      <div className="flex items-center justify-between gap-2">
        <Tabs
          value={kind}
          onValueChange={(value) => setKind(value as typeof kind)}
        >
          <TabsList aria-label="Filter by type" className="group-data-horizontal/tabs:h-9 gap-0 rounded-lg border border-white/[0.07] bg-white/[0.015] p-0.5 lg:group-data-horizontal/tabs:h-7">
            {kindOptions.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="flex-none rounded-[0.625rem] px-2.5 text-sm font-medium text-muted-foreground group-data-[variant=default]/tabs-list:data-active:shadow-none data-active:bg-white/[0.08] data-active:text-foreground lg:px-2.5 lg:text-[0.6875rem] dark:data-active:border-transparent dark:data-active:bg-white/[0.08] dark:data-active:text-foreground"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative min-w-0 flex-1 lg:w-[11.875rem] lg:flex-none">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground lg:size-3.5" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={exploreToolbarCopy.searchPlaceholder}
            className="h-10 w-full min-w-0 rounded-lg border-white/[0.08] bg-white/[0.035] pl-8 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-white/15 focus-visible:border-white/[0.08] focus-visible:bg-white/[0.05] focus-visible:ring-0 sm:max-w-[11.875rem] md:text-sm lg:h-9 lg:text-[0.6875rem] dark:bg-white/[0.035] dark:focus-visible:bg-white/[0.05]"
          />
        </div>
      </div>
    </div>
  );
}
