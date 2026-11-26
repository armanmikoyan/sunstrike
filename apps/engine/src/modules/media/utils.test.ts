import { describe, expect, it } from "vitest";
import type { MediaAsset } from "./types";
import {
  canView,
  fitsUploadLimit,
  mapAssetRow,
  mediaType,
  parseUploadRequest,
  storageKey,
  toAssetView,
  uploadLimitMessage,
} from "./utils";

const asset: MediaAsset = {
  id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  ownerUserId: "11111111-1111-4111-8111-111111111111",
  kind: "image",
  contentType: "image/png",
  sizeBytes: 2048,
  storageKey: "11111111-1111-4111-8111-111111111111/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa.png",
  completedAt: null,
  createdAt: "2026-11-26T09:00:00.000Z",
};

describe("mediaType", () => {
  it("maps an accepted content type to its kind and extension", () => {
    expect(mediaType("video/quicktime")).toEqual({ contentType: "video/quicktime", kind: "video", extension: "mov" });
  });

  it("ignores case and parameters", () => {
    expect(mediaType("Video/WebM; codecs=vp9")?.contentType).toBe("video/webm");
  });

  it("rejects anything outside the list", () => {
    expect(mediaType("image/svg+xml")).toBeNull();
    expect(mediaType("application/pdf")).toBeNull();
    expect(mediaType("")).toBeNull();
  });
});

describe("storageKey", () => {
  it("puts the asset in its owner's folder under its own id", () => {
    expect(storageKey("user-1", "asset-1", "png")).toBe("user-1/asset-1.png");
  });
});

describe("upload limits", () => {
  it("allows up to each kind's cap and nothing empty", () => {
    expect(fitsUploadLimit("image", 20 * 1024 * 1024)).toBe(true);
    expect(fitsUploadLimit("image", 20 * 1024 * 1024 + 1)).toBe(false);
    expect(fitsUploadLimit("video", 50 * 1024 * 1024)).toBe(true);
    expect(fitsUploadLimit("audio", 0)).toBe(false);
  });

  it("states the cap in megabytes", () => {
    expect(uploadLimitMessage("video")).toBe("A video upload can be up to 50 MB.");
  });
});

describe("parseUploadRequest", () => {
  it("accepts a content type and a whole byte count", () => {
    expect(parseUploadRequest({ contentType: "image/png", sizeBytes: 2048, name: "ignored.png" })).toEqual({
      ok: true,
      value: { contentType: "image/png", sizeBytes: 2048 },
    });
  });

  it.each([undefined, null, [], { sizeBytes: 10 }, { contentType: " ", sizeBytes: 10 }])(
    "rejects a body without a content type: %j",
    (body) => {
      expect(parseUploadRequest(body).ok).toBe(false);
    },
  );

  it.each([0, -1, 1.5, "2048", null])("rejects a size of %j", (sizeBytes) => {
    expect(parseUploadRequest({ contentType: "image/png", sizeBytes }).ok).toBe(false);
  });
});

describe("mapAssetRow", () => {
  it("converts bigint strings and dates", () => {
    expect(
      mapAssetRow({
        id: asset.id,
        owner_user_id: null,
        kind: "video",
        content_type: "video/mp4",
        size_bytes: "52428800",
        storage_key: "shared/clip.mp4",
        completed_at: new Date("2026-11-26T09:05:00.000Z"),
        created_at: "2026-11-26T09:00:00.000Z",
      }),
    ).toMatchObject({ ownerUserId: null, sizeBytes: 52_428_800, completedAt: "2026-11-26T09:05:00.000Z" });
  });
});

describe("toAssetView", () => {
  it("shows a pending upload without a URL and hides the storage key", () => {
    const view = toAssetView(asset);

    expect(view).toMatchObject({ status: "pending", url: null, urlExpiresAt: null });
    expect(view).not.toHaveProperty("storageKey");
    expect(view).not.toHaveProperty("ownerUserId");
  });

  it("shows a ready asset with its signed URL", () => {
    const download = { url: "https://storage.test/signed", expiresAt: "2026-11-26T09:10:00.000Z" };

    expect(toAssetView({ ...asset, completedAt: "2026-11-26T09:05:00.000Z" }, download)).toMatchObject({
      status: "ready",
      url: download.url,
      urlExpiresAt: download.expiresAt,
    });
  });
});

describe("canView", () => {
  it("lets the owner and everyone for shared assets, nobody else", () => {
    expect(canView(asset, asset.ownerUserId ?? "")).toBe(true);
    expect(canView({ ...asset, ownerUserId: null }, "someone")).toBe(true);
    expect(canView(asset, "22222222-2222-4222-8222-222222222222")).toBe(false);
  });
});
