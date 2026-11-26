import * as service from "./service";

/** Media assets: signed uploads checked on completion, and short-lived reads scoped to the owner. */
export const media = {
  getAsset: service.getAsset,
  getSharedAssets: service.getSharedAssets,
};

export type { AssetStatus, AssetView, MediaKind } from "./types";
