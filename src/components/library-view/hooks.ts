"use client";

import { useMemo, useState } from "react";
import { libraryItems } from "./constants";

export function useLibraryView() {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return libraryItems.filter((item) => {
      const typeMatch =
        tab === "all" ||
        (tab === "video" && item.kind === "video") ||
        (tab === "image" && item.kind === "image") ||
        (tab === "favorites" && Number(item.id) % 3 === 0);
      const queryMatch =
        !normalized ||
        item.title.toLowerCase().includes(normalized) ||
        item.prompt.toLowerCase().includes(normalized);
      return typeMatch && queryMatch;
    });
  }, [tab, query]);

  return { tab, setTab, query, setQuery, filtered };
}

export type LibraryViewState = ReturnType<typeof useLibraryView>;
