import { mediaItems } from "@/mocks/media";

/** The library is a working slice of the catalogue for the prototype. */
export const libraryItems = mediaItems.slice(0, 14);

export const libraryTabs = [
  ["all", "All work"],
  ["video", "Video"],
  ["image", "Images"],
] as const;

export const libraryViewCopy = {
  searchPlaceholder: "Search your library",
  emptyTitle: "Nothing here yet",
  emptyDescription: "Generate a frame or clear your search.",
  showing: "Showing",
  of: "of",
  frames: "frames",
};

