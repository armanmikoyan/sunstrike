"use client";

import { Search } from "lucide-react";
import { Input } from "@/ui/input";
import { cn } from "@/lib/utils";
import { exploreToolbarCopy, kindOptions } from "./constants";
import type { ExploreToolbarProps } from "./types";

export function ExploreToolbar({ gallery }: ExploreToolbarProps) {
  const { kind, setKind, query, setQuery } = gallery;

  return (
    <div className="sticky top-12 z-20 -mx-5 border-b border-border bg-background px-5 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex rounded-lg border border-white/[0.07] bg-white/[0.015] p-0.5">
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

        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={exploreToolbarCopy.searchPlaceholder}
            className="h-8 w-[11.875rem] rounded-lg border-white/[0.08] bg-white/[0.025] pl-8 text-[0.6875rem] placeholder:text-muted-foreground/60 focus-visible:border-white/25 focus-visible:ring-white/10"
          />
        </div>
      </div>
    </div>
  );
}
