import { mixMediaByKind } from "@/components/media-card/utils";
import { mediaItems } from "@/mocks/media";

/** The library is a working slice of the catalogue for the prototype. */
export const LIBRARY_ITEMS = mixMediaByKind(mediaItems).slice(0, 14);

export const LIBRARY_TABS = [
  { value: "all", label: "All" },
  { value: "video", label: "Video" },
  { value: "image", label: "Image" },
] as const;

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
