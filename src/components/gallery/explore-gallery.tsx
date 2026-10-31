"use client";

import { useMemo, useState } from "react";
import { ArrowDownWideNarrow, Search, SlidersHorizontal } from "lucide-react";
import { MediaCard } from "@/components/gallery/media-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  mediaCategories,
  mediaItems,
  type MediaCategory,
  type MediaKind,
} from "@/lib/media";
import { cn } from "@/lib/utils";

type Filter = "All" | MediaCategory;
type KindFilter = "all" | MediaKind;

export function ExploreGallery() {
  const [category, setCategory] = useState<Filter>("All");
  const [kind, setKind] = useState<KindFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Trending");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = mediaItems.filter((item) => {
      const categoryMatch = category === "All" || item.category === category;
      const kindMatch = kind === "all" || item.kind === kind;
      const queryMatch =
        !normalized ||
        item.title.toLowerCase().includes(normalized) ||
        item.prompt.toLowerCase().includes(normalized) ||
        item.author.toLowerCase().includes(normalized) ||
        item.model.toLowerCase().includes(normalized);
      return categoryMatch && kindMatch && queryMatch;
    });

    if (sort === "Most liked") {
      return [...result].sort((a, b) => b.likes - a.likes);
    }
    if (sort === "Newest") {
      return [...result].reverse();
    }
    return result;
  }, [category, kind, query, sort]);

  return (
    <div>
      <div className="sticky top-12 z-20 -mx-5 border-y border-border bg-background/90 px-5 py-3 backdrop-blur-xl">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
            {mediaCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  "h-8 shrink-0 rounded-lg px-3 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground",
                  category === item && "bg-white/[0.08] text-foreground",
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-white/[0.07] bg-white/[0.02] p-0.5">
              {[
                { label: "All", value: "all" as const },
                { label: "Video", value: "video" as const },
                { label: "Image", value: "image" as const },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setKind(item.value)}
                  className={cn(
                    "h-6 rounded-md px-2.5 text-[11px] font-medium text-muted-foreground transition-colors",
                    kind === item.value &&
                      "bg-white/[0.08] text-foreground",
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
                placeholder="Search"
                className="h-8 w-[190px] rounded-lg border-white/[0.08] bg-white/[0.025] pl-8 text-[11px] placeholder:text-muted-foreground/60 focus-visible:border-white/25 focus-visible:ring-white/10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-lg border-white/[0.08] bg-white/[0.025] px-2.5 text-[11px] font-medium text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                >
                  <ArrowDownWideNarrow className="size-3" />
                  {sort}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 p-1.5">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                {["Trending", "Newest", "Most liked"].map((item) => (
                  <DropdownMenuItem
                    key={item}
                    onSelect={() => setSort(item)}
                    className="p-2 text-[12px]"
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
              aria-label="More filters"
            >
              <SlidersHorizontal className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "frame" : "frames"}
            {category !== "All" ? ` · ${category}` : ""}
            {kind !== "all" ? ` · ${kind}` : ""}
          </p>
          <p className="hidden text-[11px] text-muted-foreground sm:block">
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
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.015] text-center">
            <Search className="size-5 text-muted-foreground" />
            <p className="mt-3 text-[13px] font-medium">No frames found</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Try a different search or clear the filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 h-8 rounded-lg border-white/10 text-[11px]"
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
              className="h-9 rounded-lg border-white/[0.08] bg-white/[0.02] px-5 text-[11px] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
            >
              Load more work
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
