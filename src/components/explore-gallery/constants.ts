import type { SortOption } from "./types";

export const kindOptions = [
  { label: "All", value: "all" },
  { label: "Video", value: "video" },
  { label: "Image", value: "image" },
] as const;

export const sortOptions: SortOption[] = ["Trending", "Newest", "Most liked"];

export const exploreResultsCopy = {
  frame: "frame",
  frames: "frames",
  updated: "Updated live",
  emptyTitle: "No frames found",
  emptyDescription: "Try a different search or clear the filters.",
  clearFilters: "Clear filters",
  loadMore: "Load more work",
};

export const exploreToolbarCopy = {
  searchPlaceholder: "Search",
  sortBy: "Sort by",
  moreFilters: "More filters",
};
