import type { MediaKind } from "./types";

/** The private Storage bucket; created with the same limits in the migration. */
export const MEDIA_BUCKET = "media";

export const MEDIA_KINDS = ["image", "video", "audio"] as const;

/** Each accepted content type, the kind it records and the file extension it is stored under. */
export const MEDIA_TYPES: Record<string, { kind: MediaKind; extension: string }> = {
  "image/png": { kind: "image", extension: "png" },
  "image/jpeg": { kind: "image", extension: "jpg" },
  "image/webp": { kind: "image", extension: "webp" },
  "video/mp4": { kind: "video", extension: "mp4" },
  "video/quicktime": { kind: "video", extension: "mov" },
  "video/webm": { kind: "video", extension: "webm" },
  "audio/mpeg": { kind: "audio", extension: "mp3" },
  "audio/wav": { kind: "audio", extension: "wav" },
  "audio/mp4": { kind: "audio", extension: "m4a" },
};

export const BYTES_PER_MB = 1024 * 1024;

export const MAX_UPLOAD_BYTES: Record<MediaKind, number> = {
  image: 20 * BYTES_PER_MB,
  video: 50 * BYTES_PER_MB,
  audio: 20 * BYTES_PER_MB,
};

/** How long a download URL works. Signed upload URLs are fixed by Storage at two hours. */
export const DOWNLOAD_URL_TTL_SECONDS = 300;

export const ASSET_STATUS = { pending: "pending", ready: "ready" } as const;

export const UPLOAD_HEADERS = { upsert: "x-upsert", contentType: "content-type" } as const;

export const MEDIA_ERRORS = {
  notFound: "Asset not found.",
  unsupportedType: "Upload a PNG, JPEG or WebP image, an MP4, MOV or WebM video, or MP3, WAV or M4A audio.",
  notUploaded: "The file has not been uploaded yet.",
  mismatch: "The uploaded file does not match the type or size it was signed for.",
  missingBody: "Send contentType and sizeBytes.",
  invalidContentType: "contentType must be a MIME type such as image/png.",
  invalidSize: "sizeBytes must be a whole number of bytes above zero.",
} as const;
