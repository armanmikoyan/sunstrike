"use client";

import { useMemo, useState } from "react";
import type { MediaFilter } from "@/components/media-card/types";
import { filterMedia, mixMediaByKind } from "@/components/media-card/utils";
import { mediaItems } from "@/mocks/media";
import { EXPLORE_SEARCH_FIELDS } from "./constants";

export function useExploreGallery() {
  const [kind, setKind] = useState<MediaFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => mixMediaByKind(filterMedia(mediaItems, kind, query, EXPLORE_SEARCH_FIELDS)),
    [kind, query],
  );

  return {
    kind,
    setKind,
    query,
    setQuery,
    filtered,
  };
}
