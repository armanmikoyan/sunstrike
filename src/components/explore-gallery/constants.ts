import type { SortOption } from "./types";

export const kindOptions = [
  { label: "All", value: "all" },
  { label: "Video", value: "video" },
  { label: "Image", value: "image" },
] as const;

export const sortOptions: SortOption[] = ["Trending", "Newest", "Most liked"];
