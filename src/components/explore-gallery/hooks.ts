"use client";

import { useMemo, useState } from "react";
import { mediaItems } from "@/mocks/media";
import type { KindFilter } from "./types";

/** Kind and query, plus the list they produce. */
export function useExploreGallery() {
  const [kind, setKind] = useState<KindFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return mediaItems.filter((item) => {
      const kindMatch = kind === "all" || item.kind === kind;
      const queryMatch =
        !normalized ||
        item.title.toLowerCase().includes(normalized) ||
        item.prompt.toLowerCase().includes(normalized) ||
        item.model.toLowerCase().includes(normalized);
      return kindMatch && queryMatch;
    });
  }, [kind, query]);

  return {
    kind,
    setKind,
    query,
    setQuery,
    filtered,
  };
}

export type ExploreGalleryState = ReturnType<typeof useExploreGallery>;
