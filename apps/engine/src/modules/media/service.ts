import { randomUUID } from "node:crypto";
import * as storage from "@/infra/storage";
import {
  conflict,
  contentTooLarge,
  isoAfterSeconds,
  isUuid,
  notFound,
  unprocessable,
  unsupportedMediaType,
} from "@/shared/utils";
import { DOWNLOAD_URL_TTL_SECONDS, MEDIA_BUCKET, MEDIA_ERRORS, UPLOAD_HEADERS } from "./constants";
import * as repository from "./repository";
import type { AssetView, MediaAsset, UploadRequest, UploadTicket } from "./types";
import { canView, fitsUploadLimit, mediaType, storageKey, toAssetView, uploadLimitMessage } from "./utils";

async function findAsset(assetId: string): Promise<MediaAsset | null> {
  return isUuid(assetId) ? repository.findById(assetId) : null;
}

async function signedView(asset: MediaAsset): Promise<AssetView> {
  const url = await storage.createDownloadUrl(MEDIA_BUCKET, asset.storageKey, DOWNLOAD_URL_TTL_SECONDS);

  return toAssetView(asset, { url, expiresAt: isoAfterSeconds(new Date(), DOWNLOAD_URL_TTL_SECONDS) });
}

/** Check the declared type and size, then sign a one-time upload to a path the server picks. */
export async function requestUpload(ownerUserId: string, request: UploadRequest): Promise<UploadTicket> {
  const type = mediaType(request.contentType);

  if (!type) throw unsupportedMediaType(MEDIA_ERRORS.unsupportedType);

  if (!fitsUploadLimit(type.kind, request.sizeBytes)) throw contentTooLarge(uploadLimitMessage(type.kind));

  const id = randomUUID();
  const key = storageKey(ownerUserId, id, type.extension);
  const signed = await storage.createUploadUrl(MEDIA_BUCKET, key);
  const asset = await repository.insertPending({
    id,
    ownerUserId,
    kind: type.kind,
    contentType: type.contentType,
    sizeBytes: request.sizeBytes,
    storageKey: key,
  });

  return {
    asset: toAssetView(asset),
    upload: {
      url: signed.url,
      method: "PUT",
      headers: { [UPLOAD_HEADERS.contentType]: type.contentType, [UPLOAD_HEADERS.upsert]: "false" },
    },
  };
}

/**
 * Trust the stored object, not the request: its real type must match the one
 * signed for and its real size must fit the kind's limit, or it is removed.
 */
export async function completeUpload(ownerUserId: string, assetId: string): Promise<AssetView> {
  const asset = await findAsset(assetId);

  if (!asset || asset.ownerUserId !== ownerUserId) throw notFound(MEDIA_ERRORS.notFound);

  if (asset.completedAt) return signedView(asset);

  const stored = await storage.statObject(MEDIA_BUCKET, asset.storageKey);

  if (!stored) throw conflict(MEDIA_ERRORS.notUploaded);

  const storedType = stored.contentType ? mediaType(stored.contentType) : null;

  if (storedType?.contentType !== asset.contentType || !fitsUploadLimit(asset.kind, stored.sizeBytes)) {
    await storage.removeObject(MEDIA_BUCKET, asset.storageKey);

    throw unprocessable(MEDIA_ERRORS.mismatch);
  }

  return signedView(await repository.markCompleted(asset.id, stored.sizeBytes));
}

/** A ready asset with a short-lived URL; an owner also sees a pending upload, without one. */
export async function getAsset(viewerId: string, assetId: string): Promise<AssetView> {
  const asset = await findAsset(assetId);

  if (!asset || !canView(asset, viewerId)) throw notFound(MEDIA_ERRORS.notFound);

  if (asset.completedAt) return signedView(asset);

  if (asset.ownerUserId === viewerId) return toAssetView(asset);

  throw notFound(MEDIA_ERRORS.notFound);
}
