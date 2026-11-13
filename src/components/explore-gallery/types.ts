import type { MediaKind } from "@/lib/media";
import type { ExploreGalleryState } from "./hooks";

export type KindFilter = "all" | MediaKind;

export type ExploreResultsProps = {
  gallery: ExploreGalleryState;
};

export type ExploreToolbarProps = {
  gallery: ExploreGalleryState;
};
