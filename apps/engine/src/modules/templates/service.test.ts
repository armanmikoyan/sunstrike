import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AssetView } from "@/modules/media";
import type { Template } from "./types";

const repositoryMock = vi.hoisted(() => ({
  listActive: vi.fn(),
  findActiveById: vi.fn(),
}));

const mediaMock = vi.hoisted(() => ({ getSharedAssets: vi.fn() }));

vi.mock("./repository", () => repositoryMock);
vi.mock("@/modules/media", () => ({ media: mediaMock }));

import * as service from "./service";

const options = { roles: ["scene"], resolutions: ["1080p"], durationsSeconds: [5], aspectRatios: ["16:9"] };

function template(n: number): Template {
  return {
    id: `0000000${n}-0000-4000-8000-000000000000`,
    sourceAssetId: `aaaaaaa${n}-aaaa-4aaa-8aaa-aaaaaaaaaaaa`,
    name: `Template ${n}`,
    customizationOptions: options,
    createdAt: "2026-11-26T09:00:00.000Z",
  };
}

function source(id: string): AssetView {
  return {
    id,
    kind: "video",
    contentType: "video/mp4",
    sizeBytes: 1024,
    status: "ready",
    createdAt: "2026-11-26T08:00:00.000Z",
    url: `https://storage.test/${id}`,
    urlExpiresAt: "2026-11-26T09:05:00.000Z",
  };
}

describe("templates service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mediaMock.getSharedAssets.mockImplementation(async (ids: string[]) => ids.map(source));
  });

  describe("listTemplates", () => {
    it("asks for one extra row to know whether another page exists", async () => {
      repositoryMock.listActive.mockResolvedValue([template(1), template(2), template(3)]);

      const page = await service.listTemplates({ limit: 2, cursor: null });

      expect(repositoryMock.listActive).toHaveBeenCalledWith(3, null);
      expect(page.templates.map((item) => item.name)).toEqual(["Template 1", "Template 2"]);
      expect(page.nextCursor).toBe(template(2).id);
      expect(page.templates[0].source.url).toBe(`https://storage.test/${template(1).sourceAssetId}`);
    });

    it("ends with a null cursor on the last page", async () => {
      repositoryMock.listActive.mockResolvedValue([template(1)]);

      await expect(service.listTemplates({ limit: 2, cursor: template(9).id })).resolves.toMatchObject({
        nextCursor: null,
      });
      expect(repositoryMock.listActive).toHaveBeenCalledWith(3, template(9).id);
    });

    it("leaves out a template whose source is not ready", async () => {
      repositoryMock.listActive.mockResolvedValue([template(1), template(2)]);
      mediaMock.getSharedAssets.mockResolvedValue([source(template(2).sourceAssetId)]);

      const page = await service.listTemplates({ limit: 5, cursor: null });

      expect(page.templates.map((item) => item.id)).toEqual([template(2).id]);
    });

    it("skips media when there are no templates", async () => {
      repositoryMock.listActive.mockResolvedValue([]);

      await expect(service.listTemplates({ limit: 5, cursor: null })).resolves.toEqual({
        templates: [],
        nextCursor: null,
      });
      expect(mediaMock.getSharedAssets).not.toHaveBeenCalled();
    });
  });

  describe("getTemplate", () => {
    it("returns an active template with its signed source", async () => {
      repositoryMock.findActiveById.mockResolvedValue(template(1));

      await expect(service.getTemplate(template(1).id)).resolves.toMatchObject({
        name: "Template 1",
        source: { status: "ready" },
        customizationOptions: options,
      });
    });

    it("returns 404 for an unknown, inactive or malformed id", async () => {
      repositoryMock.findActiveById.mockResolvedValue(null);

      await expect(service.getTemplate(template(1).id)).rejects.toMatchObject({ status: 404 });
      await expect(service.getTemplate("nope")).rejects.toMatchObject({ status: 404 });
      expect(repositoryMock.findActiveById).toHaveBeenCalledTimes(1);
    });

    it("returns 404 when the source is not ready", async () => {
      repositoryMock.findActiveById.mockResolvedValue(template(1));
      mediaMock.getSharedAssets.mockResolvedValue([]);

      await expect(service.getTemplate(template(1).id)).rejects.toMatchObject({ status: 404 });
    });
  });
});
