import type { MediaSearchField } from "@/components/media-card/types";
import { mixMediaByKind } from "@/components/media-card/utils";
import { mediaItems } from "@/mocks/media";

export const LIBRARY_ITEMS = mixMediaByKind(mediaItems).slice(0, 14);

export const LIBRARY_SEARCH_FIELDS: MediaSearchField[] = ["title", "prompt"];

export const LIBRARY_VIEW_COPY = {
  searchPlaceholder: "Search your library",
  searchLabel: "Search your library",
  filterLabel: "Filter library",
  emptyTitle: "Nothing here yet",
  emptyDescription: "Generate a frame or clear your search.",
  showing: "Showing",
  of: "of",
  frames: "frames",
};
