"use client";

import { ArrowDownWideNarrow, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Input } from "@/ui/input";
import { mediaCategories } from "@/lib/media";
import { cn } from "@/lib/utils";
import { exploreToolbarCopy, kindOptions, sortOptions } from "./constants";
import type { ExploreToolbarProps } from "./types";

export function ExploreToolbar({ gallery }: ExploreToolbarProps) {
  const { category, setCategory, kind, setKind, query, setQuery, sort, setSort } =
    gallery;

  return (
    <div className="sticky top-12 z-20 -mx-5 border-y border-border bg-background/90 px-5 py-3 backdrop-blur-xl">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
          {mediaCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "h-8 shrink-0 rounded-lg px-3 text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground",
                category === item && "bg-white/[0.08] text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-white/[0.07] bg-white/[0.02] p-0.5">
            {kindOptions.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setKind(item.value)}
                className={cn(
                  "h-6 rounded-md px-2.5 text-[0.6875rem] font-medium text-muted-foreground transition-colors",
                  kind === item.value && "bg-white/[0.08] text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={exploreToolbarCopy.searchPlaceholder}
              className="h-8 w-[11.875rem] rounded-lg border-white/[0.08] bg-white/[0.025] pl-8 text-[0.6875rem] placeholder:text-muted-foreground/60 focus-visible:border-white/25 focus-visible:ring-white/10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-lg border-white/[0.08] bg-white/[0.025] px-2.5 text-[0.6875rem] font-medium text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
              >
                <ArrowDownWideNarrow className="size-3" />
                {sort}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 p-1.5">
              <DropdownMenuLabel>{exploreToolbarCopy.sortBy}</DropdownMenuLabel>
              {sortOptions.map((item) => (
                <DropdownMenuItem
                  key={item}
                  onSelect={() => setSort(item)}
                  className="p-2 text-[0.75rem]"
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-lg border-white/[0.08] bg-white/[0.025] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
            aria-label={exploreToolbarCopy.moreFilters}
          >
            <SlidersHorizontal className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
