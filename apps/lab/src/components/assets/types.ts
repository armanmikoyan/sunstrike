import type { RefObject } from "react";
import type { MediaFilter, MediaItem } from "@/components/media-card/types";

export type AssetsHeaderProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
};

export type AssetsToolbarProps = {
  filter: MediaFilter;
  count: number;
  onFilterChange: (filter: MediaFilter) => void;
};

export type AssetsGridProps = {
  assets: MediaItem[];
};

export type AssetTileProps = {
  asset: MediaItem;
};
