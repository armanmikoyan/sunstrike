"use client";

import { useMemo, useState } from "react";
import { LIBRARY_ITEMS } from "./constants";
import type { LibraryTab } from "./types";

export function useLibraryView() {
  const [tab, setTab] = useState<LibraryTab>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return LIBRARY_ITEMS.filter((item) => {
      const typeMatch =
        tab === "all" || (tab === "video" && item.kind === "video") || (tab === "image" && item.kind === "image");
      const queryMatch =
        !normalized || item.title.toLowerCase().includes(normalized) || item.prompt.toLowerCase().includes(normalized);
      return typeMatch && queryMatch;
    });
  }, [tab, query]);

  return { tab, setTab, query, setQuery, filtered };
}
