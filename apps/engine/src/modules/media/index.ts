import * as service from "./service";

/** Media assets: signed uploads checked on completion, and short-lived reads scoped to the owner. */
export const media = {
  getAsset: service.getAsset,
  getSharedAssets: service.getSharedAssets,
  registerOutput: service.registerOutput,
};

export type { AssetStatus, AssetView, MediaKind, OutputFile } from "./types";
