"use client";

import { useMemo, useState } from "react";
import { mediaItems } from "@/lib/media";
import type { CategoryFilter, KindFilter, SortOption } from "./types";

/** Category, kind, query and sort, plus the list they produce. */
export function useExploreGallery() {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [kind, setKind] = useState<KindFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("Trending");

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

  return {
    category,
    setCategory,
    kind,
    setKind,
    query,
    setQuery,
    sort,
    setSort,
    filtered,
  };
}

export type ExploreGalleryState = ReturnType<typeof useExploreGallery>;
