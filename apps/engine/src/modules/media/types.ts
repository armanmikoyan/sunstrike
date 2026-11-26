import type { ASSET_STATUS, MEDIA_KINDS } from "./constants";

export type MediaKind = (typeof MEDIA_KINDS)[number];

export type AssetStatus = (typeof ASSET_STATUS)[keyof typeof ASSET_STATUS];

export interface MediaAsset {
  id: string;
  ownerUserId: string | null;
  kind: MediaKind;
  contentType: string;
  sizeBytes: number;
  storageKey: string;
  completedAt: string | null;
  createdAt: string;
}

export interface AssetRow {
  id: string;
  owner_user_id: string | null;
  kind: MediaKind;
  content_type: string;
  size_bytes: string | number;
  storage_key: string;
  completed_at: Date | string | null;
  created_at: Date | string;
}

export interface UploadRequest {
  contentType: string;
  sizeBytes: number;
}

export interface NewAsset {
  id: string;
  ownerUserId: string;
  kind: MediaKind;
  contentType: string;
  sizeBytes: number;
  storageKey: string;
}

/** An asset as the API returns it; `url` is set only once it is ready. */
export interface AssetView {
  id: string;
  kind: MediaKind;
  contentType: string;
  sizeBytes: number;
  status: AssetStatus;
  createdAt: string;
  url: string | null;
  urlExpiresAt: string | null;
}

/** A file the server holds in memory, such as a provider's generation output. */
export interface OutputFile {
  contentType: string;
  body: Buffer;
}

export interface UploadTicket {
  asset: AssetView;
  upload: {
    url: string;
    method: "PUT";
    headers: Record<string, string>;
  };
}
