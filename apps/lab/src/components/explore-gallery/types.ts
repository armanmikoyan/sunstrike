import type { MediaKind } from "@/components/media-card/types";
import type { useExploreGallery } from "./hooks";

export type KindFilter = "all" | MediaKind;

export type ExploreGalleryState = ReturnType<typeof useExploreGallery>;

export type ExploreGalleryProps = {
  gallery: ExploreGalleryState;
};
