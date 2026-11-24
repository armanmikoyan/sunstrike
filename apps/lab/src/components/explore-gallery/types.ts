import type { useExploreGallery } from "./hooks";

export type ExploreGalleryState = ReturnType<typeof useExploreGallery>;

export type ExploreGalleryProps = {
  gallery: ExploreGalleryState;
};
