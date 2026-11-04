import { mediaItems } from "@/lib/media";

/** The library is a working slice of the catalogue for the prototype. */
export const libraryItems = mediaItems.slice(0, 14);

export const libraryTabs = [
  ["all", "All work"],
  ["video", "Video"],
  ["image", "Images"],
  ["favorites", "Favorites"],
] as const;
