import type { MediaCategory, MediaKind } from "@/lib/media";
import type { ExploreGalleryState } from "./hooks";

export type CategoryFilter = "All" | MediaCategory;
export type KindFilter = "all" | MediaKind;
export type SortOption = "Trending" | "Newest" | "Most liked";

export type ExploreResultsProps = {
  gallery: ExploreGalleryState;
};

export type ExploreToolbarProps = {
  gallery: ExploreGalleryState;
};
