import type { MediaCategory, MediaKind } from "@/lib/media";

export type CategoryFilter = "All" | MediaCategory;
export type KindFilter = "all" | MediaKind;
export type SortOption = "Trending" | "Newest" | "Most liked";
