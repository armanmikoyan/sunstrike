import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MediaAsset } from "./types";

const repositoryMock = vi.hoisted(() => ({
  insert: vi.fn(),
  findById: vi.fn(),
  findSharedReady: vi.fn(),
  markCompleted: vi.fn(),
}));

const storageMock = vi.hoisted(() => ({
  createUploadUrl: vi.fn(),
  uploadObject: vi.fn(),
  statObject: vi.fn(),
  createDownloadUrl: vi.fn(),
  createDownloadUrls: vi.fn(),
  removeObject: vi.fn(),
}));

vi.mock("./repository", () => repositoryMock);
vi.mock("@/infra/storage", () => storageMock);

import * as service from "./service";

const OWNER = "11111111-1111-4111-8111-111111111111";
const OTHER = "22222222-2222-4222-8222-222222222222";
const ASSET_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const MB = 1024 * 1024;

const pending: MediaAsset = {
  id: ASSET_ID,
  ownerUserId: OWNER,
  kind: "image",
  contentType: "image/png",
  sizeBytes: 2048,
  storageKey: `${OWNER}/${ASSET_ID}.png`,
  completedAt: null,
  createdAt: "2026-11-26T09:00:00.000Z",
};

const ready: MediaAsset = { ...pending, completedAt: "2026-11-26T09:05:00.000Z" };

describe("media service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storageMock.createUploadUrl.mockResolvedValue({ url: "https://storage.test/upload?token=t", token: "t" });
    storageMock.createDownloadUrl.mockResolvedValue("https://storage.test/download?token=d");
    repositoryMock.insert.mockImplementation(async (asset, completed = false) => ({
      ...asset,
      completedAt: completed ? ready.completedAt : null,
      createdAt: pending.createdAt,
    }));
  });

  describe("registerOutput", () => {
    it("stores the file under its owner and records a ready asset", async () => {
      const body = Buffer.from("frame");

      const asset = await service.registerOutput(OWNER, { contentType: "image/png", body });
      const [bucket, key, stored, contentType] = storageMock.uploadObject.mock.calls[0];

      expect([bucket, stored, contentType]).toEqual(["media", body, "image/png"]);
      expect(key).toMatch(new RegExp(`^${OWNER}/[0-9a-f-]{36}\\.png$`));
      expect(repositoryMock.insert).toHaveBeenCalledWith(
        expect.objectContaining({ ownerUserId: OWNER, sizeBytes: body.length, storageKey: key }),
        true,
      );
      expect(asset).toMatchObject({ status: "ready", kind: "image" });
    });

    it("rejects an output type the bucket does not accept", async () => {
      await expect(
        service.registerOutput(OWNER, { contentType: "application/pdf", body: Buffer.from("x") }),
      ).rejects.toMatchObject({ status: 415 });
      expect(storageMock.uploadObject).not.toHaveBeenCalled();
    });
  });

  describe("requestUpload", () => {
    it("signs an upload under the owner's folder and records a pending asset", async () => {
      const ticket = await service.requestUpload(OWNER, { contentType: "image/png", sizeBytes: 2048 });
      const [bucket, key] = storageMock.createUploadUrl.mock.calls[0];

      expect(bucket).toBe("media");
      expect(key).toMatch(new RegExp(`^${OWNER}/[0-9a-f-]{36}\\.png$`));
      expect(repositoryMock.insert).toHaveBeenCalledWith(
        expect.objectContaining({ ownerUserId: OWNER, kind: "image", storageKey: key }),
      );
      expect(ticket.asset).toMatchObject({ status: "pending", url: null });
      expect(ticket.upload).toEqual({
        url: "https://storage.test/upload?token=t",
        method: "PUT",
        headers: { "content-type": "image/png", "x-upsert": "false" },
      });
    });

    it("rejects an unsupported type with 415 before signing", async () => {
      await expect(service.requestUpload(OWNER, { contentType: "image/svg+xml", sizeBytes: 10 })).rejects.toMatchObject(
        { status: 415 },
      );
      expect(storageMock.createUploadUrl).not.toHaveBeenCalled();
    });

    it("rejects a file above its kind's limit with 413 before signing", async () => {
      await expect(
        service.requestUpload(OWNER, { contentType: "image/png", sizeBytes: 20 * MB + 1 }),
      ).rejects.toMatchObject({ status: 413 });
      expect(storageMock.createUploadUrl).not.toHaveBeenCalled();
      expect(repositoryMock.insert).not.toHaveBeenCalled();
    });

    it("allows a larger video than image", async () => {
      await service.requestUpload(OWNER, { contentType: "video/mp4", sizeBytes: 50 * MB });

      expect(repositoryMock.insert).toHaveBeenCalledWith(expect.objectContaining({ kind: "video" }));
    });
  });

  describe("completeUpload", () => {
    it("records the stored size and returns a signed download", async () => {
      repositoryMock.findById.mockResolvedValue(pending);
      storageMock.statObject.mockResolvedValue({ sizeBytes: 4096, contentType: "image/png" });
      repositoryMock.markCompleted.mockResolvedValue({ ...ready, sizeBytes: 4096 });

      const asset = await service.completeUpload(OWNER, ASSET_ID);

      expect(repositoryMock.markCompleted).toHaveBeenCalledWith(ASSET_ID, 4096);
      expect(storageMock.createDownloadUrl).toHaveBeenCalledWith("media", pending.storageKey, 300);
      expect(asset).toMatchObject({ status: "ready", sizeBytes: 4096, url: "https://storage.test/download?token=d" });
    });

    it("returns 404 for another user's asset and never reads storage", async () => {
      repositoryMock.findById.mockResolvedValue(pending);

      await expect(service.completeUpload(OTHER, ASSET_ID)).rejects.toMatchObject({ status: 404 });
      expect(storageMock.statObject).not.toHaveBeenCalled();
    });

    it("returns 404 for a malformed id without querying", async () => {
      await expect(service.completeUpload(OWNER, "not-a-uuid")).rejects.toMatchObject({ status: 404 });
      expect(repositoryMock.findById).not.toHaveBeenCalled();
    });

    it("returns 409 while the file is not in storage yet", async () => {
      repositoryMock.findById.mockResolvedValue(pending);
      storageMock.statObject.mockResolvedValue(null);

      await expect(service.completeUpload(OWNER, ASSET_ID)).rejects.toMatchObject({ status: 409 });
      expect(repositoryMock.markCompleted).not.toHaveBeenCalled();
    });

    it("removes a stored file whose type differs from the one signed for", async () => {
      repositoryMock.findById.mockResolvedValue(pending);
      storageMock.statObject.mockResolvedValue({ sizeBytes: 4096, contentType: "image/jpeg" });

      await expect(service.completeUpload(OWNER, ASSET_ID)).rejects.toMatchObject({ status: 422 });
      expect(storageMock.removeObject).toHaveBeenCalledWith("media", pending.storageKey);
      expect(repositoryMock.markCompleted).not.toHaveBeenCalled();
    });

    it("removes a stored file above the kind's limit", async () => {
      repositoryMock.findById.mockResolvedValue(pending);
      storageMock.statObject.mockResolvedValue({ sizeBytes: 20 * MB + 1, contentType: "image/png" });

      await expect(service.completeUpload(OWNER, ASSET_ID)).rejects.toMatchObject({ status: 422 });
      expect(storageMock.removeObject).toHaveBeenCalled();
    });

    it("is idempotent once complete", async () => {
      repositoryMock.findById.mockResolvedValue(ready);

      await expect(service.completeUpload(OWNER, ASSET_ID)).resolves.toMatchObject({ status: "ready" });
      expect(storageMock.statObject).not.toHaveBeenCalled();
      expect(repositoryMock.markCompleted).not.toHaveBeenCalled();
    });
  });

  describe("getAsset", () => {
    it("signs a short-lived URL for the owner", async () => {
      repositoryMock.findById.mockResolvedValue(ready);

      const asset = await service.getAsset(OWNER, ASSET_ID);

      expect(asset.url).toBe("https://storage.test/download?token=d");
      expect(Date.parse(asset.urlExpiresAt ?? "") - Date.now()).toBeLessThanOrEqual(300_000);
    });

    it("returns 404 for another user's asset without signing", async () => {
      repositoryMock.findById.mockResolvedValue(ready);

      await expect(service.getAsset(OTHER, ASSET_ID)).rejects.toMatchObject({ status: 404 });
      expect(storageMock.createDownloadUrl).not.toHaveBeenCalled();
    });

    it("lets anyone signed in read a shared asset", async () => {
      repositoryMock.findById.mockResolvedValue({ ...ready, ownerUserId: null });

      await expect(service.getAsset(OTHER, ASSET_ID)).resolves.toMatchObject({ status: "ready" });
    });

    it("shows the owner a pending upload without a URL", async () => {
      repositoryMock.findById.mockResolvedValue(pending);

      await expect(service.getAsset(OWNER, ASSET_ID)).resolves.toMatchObject({ status: "pending", url: null });
      expect(storageMock.createDownloadUrl).not.toHaveBeenCalled();
    });

    it("returns 404 for a missing asset", async () => {
      repositoryMock.findById.mockResolvedValue(null);

      await expect(service.getAsset(OWNER, ASSET_ID)).rejects.toMatchObject({ status: 404 });
    });
  });

  describe("getSharedAssets", () => {
    const shared: MediaAsset = { ...ready, ownerUserId: null, storageKey: `shared/${ASSET_ID}.png` };

    it("signs every ready shared asset in one batch", async () => {
      repositoryMock.findSharedReady.mockResolvedValue([shared]);
      storageMock.createDownloadUrls.mockResolvedValue(new Map([[shared.storageKey, "https://storage.test/s"]]));

      const assets = await service.getSharedAssets([ASSET_ID, ASSET_ID, "not-a-uuid"]);

      expect(repositoryMock.findSharedReady).toHaveBeenCalledWith([ASSET_ID]);
      expect(storageMock.createDownloadUrls).toHaveBeenCalledWith("media", [shared.storageKey], 300);
      expect(assets).toEqual([
        expect.objectContaining({ id: ASSET_ID, status: "ready", url: "https://storage.test/s" }),
      ]);
    });

    it("leaves out an asset Storage could not sign", async () => {
      repositoryMock.findSharedReady.mockResolvedValue([shared]);
      storageMock.createDownloadUrls.mockResolvedValue(new Map());

      await expect(service.getSharedAssets([ASSET_ID])).resolves.toEqual([]);
    });

    it("skips the database and Storage when no id is valid", async () => {
      await expect(service.getSharedAssets(["nope"])).resolves.toEqual([]);
      expect(repositoryMock.findSharedReady).not.toHaveBeenCalled();
      expect(storageMock.createDownloadUrls).not.toHaveBeenCalled();
    });
  });
});
