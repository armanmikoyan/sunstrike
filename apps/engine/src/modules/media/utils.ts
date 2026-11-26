import type { ParseResult } from "@/shared/types";
import { isNonEmptyText, isRecord, isWholeNumber, parseFailure, toIsoString } from "@/shared/utils";
import { ASSET_STATUS, BYTES_PER_MB, MAX_UPLOAD_BYTES, MEDIA_ERRORS, MEDIA_TYPES } from "./constants";
import type { AssetRow, AssetView, MediaAsset, MediaKind, UploadRequest } from "./types";

/** The accepted type for a content type, ignoring parameters such as `; codecs=...`. */
export function mediaType(contentType: string) {
  const base = contentType.split(";")[0]?.trim().toLowerCase() ?? "";

  return Object.hasOwn(MEDIA_TYPES, base) ? { contentType: base, ...MEDIA_TYPES[base] } : null;
}

/** The server picks every path: the owner's folder and the asset's own id. */
export function storageKey(ownerUserId: string, assetId: string, extension: string): string {
  return `${ownerUserId}/${assetId}.${extension}`;
}

export function uploadLimitMessage(kind: MediaKind): string {
  return `A ${kind} upload can be up to ${MAX_UPLOAD_BYTES[kind] / BYTES_PER_MB} MB.`;
}

export function fitsUploadLimit(kind: MediaKind, sizeBytes: number): boolean {
  return sizeBytes > 0 && sizeBytes <= MAX_UPLOAD_BYTES[kind];
}

export function parseUploadRequest(body: unknown): ParseResult<UploadRequest> {
  if (!isRecord(body)) return parseFailure(MEDIA_ERRORS.missingBody);

  const { contentType, sizeBytes } = body;

  if (!isNonEmptyText(contentType)) return parseFailure(MEDIA_ERRORS.invalidContentType);

  if (!isWholeNumber(sizeBytes) || sizeBytes === 0) return parseFailure(MEDIA_ERRORS.invalidSize);

  return { ok: true, value: { contentType, sizeBytes } };
}

export function mapAssetRow(row: AssetRow): MediaAsset {
  const sizeBytes = typeof row.size_bytes === "number" ? row.size_bytes : Number.parseInt(row.size_bytes, 10);

  return {
    id: row.id,
    ownerUserId: row.owner_user_id,
    kind: row.kind,
    contentType: row.content_type,
    sizeBytes: Number.isFinite(sizeBytes) ? sizeBytes : 0,
    storageKey: row.storage_key,
    completedAt: row.completed_at ? toIsoString(row.completed_at) : null,
    createdAt: toIsoString(row.created_at),
  };
}

export function toAssetView(asset: MediaAsset, download: { url: string; expiresAt: string } | null = null): AssetView {
  return {
    id: asset.id,
    kind: asset.kind,
    contentType: asset.contentType,
    sizeBytes: asset.sizeBytes,
    status: asset.completedAt ? ASSET_STATUS.ready : ASSET_STATUS.pending,
    createdAt: asset.createdAt,
    url: download?.url ?? null,
    urlExpiresAt: download?.expiresAt ?? null,
  };
}

/** Owners see their own assets; shared assets (no owner) are visible to everyone signed in. */
export function canView(asset: MediaAsset, viewerId: string): boolean {
  return asset.ownerUserId === null || asset.ownerUserId === viewerId;
}
