"use client";

import { useMemo, useState } from "react";
import type { MediaFilter } from "@/components/media-card/types";
import { filterMedia } from "@/components/media-card/utils";
import { LIBRARY_ITEMS, LIBRARY_SEARCH_FIELDS } from "./constants";

export function useLibraryView() {
  const [tab, setTab] = useState<MediaFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => filterMedia(LIBRARY_ITEMS, tab, query, LIBRARY_SEARCH_FIELDS), [tab, query]);

  return { tab, setTab, query, setQuery, filtered };
}
