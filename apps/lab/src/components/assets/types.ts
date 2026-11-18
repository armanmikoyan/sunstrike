import type { RefObject } from "react";
import type { MediaKind } from "@/components/media-card/types";
import type { ASSETS } from "./constants";

export type Filter = "all" | MediaKind;

export type Asset = (typeof ASSETS)[number];

export type AssetsHeaderProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
};

export type AssetsToolbarProps = {
  filter: Filter;
  count: number;
  onFilterChange: (filter: Filter) => void;
};

export type AssetsGridProps = {
  assets: Asset[];
  reduceMotion: boolean | null;
};

export type AssetTileProps = {
  asset: Asset;
};
