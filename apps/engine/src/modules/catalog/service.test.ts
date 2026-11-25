import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearProviderAdapters } from "./providers";
import type { CatalogProviderAdapter } from "./providers/types";
import type { CatalogModelWithCost } from "./types";

const repositoryMock = vi.hoisted(() => ({
  listActive: vi.fn(),
  listAll: vi.fn(),
  findById: vi.fn(),
  findBySlug: vi.fn(),
  setActive: vi.fn(),
  upsertProviderModel: vi.fn(),
}));

vi.mock("./repository", () => repositoryMock);

import * as service from "./service";

const videoModel: CatalogModelWithCost = {
  id: "11111111-1111-4111-8111-111111111111",
  slug: "chronolab-motion-2",
  name: "Chronolab Motion 2",
  summary: "Native audio and longer takes.",
  provider: "chronolab",
  providerModelKey: "motion-2",
  vendor: null,
  capabilities: {
    modes: ["video"],
    inputs: ["image", "video"],
    resolutions: ["720p", "1080p"],
    durationsSeconds: [4, 5, 6, 8, 12],
    aspectRatios: ["16:9", "9:16", "1:1"],
    audio: true,
  },
  providerCostMicros: 55_000,
  providerCostUnit: "per_second",
  active: true,
  updatedAt: "2026-11-24T12:00:00.000Z",
};

const imageModel: CatalogModelWithCost = {
  id: "22222222-2222-4222-8222-222222222222",
  slug: "chronolab-image-2",
  name: "Chronolab Image 2",
  summary: "Everyday 1 MP images.",
  provider: "chronolab",
  providerModelKey: "image-2",
  vendor: null,
  capabilities: {
    modes: ["image"],
    inputs: ["image"],
    resolutions: ["1 MP"],
    durationsSeconds: [],
    aspectRatios: ["16:9", "1:1"],
    audio: false,
  },
  providerCostMicros: 40_000,
  providerCostUnit: "per_image",
  active: true,
  updatedAt: "2026-11-24T12:00:00.000Z",
};

describe("catalog service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearProviderAdapters();
  });

  it("lists active models, filters by mode, and toggles upstream costs via includeCost", async () => {
    repositoryMock.listActive.mockResolvedValue([videoModel, imageModel]);

    const models = await service.listActiveModels();

    expect(models).toHaveLength(2);
    expect(models[0]).not.toHaveProperty("providerCostMicros");
    expect(models[0]).not.toHaveProperty("providerCostUnit");

    const videoWithCosts = await service.listActiveModels("video", true);

    expect(videoWithCosts).toHaveLength(1);
    expect(videoWithCosts[0]).toMatchObject({ providerCostMicros: 55_000 });

    await expect(service.listActiveModels("3d")).rejects.toMatchObject({ status: 400 });
  });

  it("looks up by UUID or slug, hides inactive models publicly, and includes costs when requested", async () => {
    repositoryMock.findBySlug.mockResolvedValue(videoModel);

    const found = await service.getModel("chronolab-motion-2");

    expect(found.id).toBe(videoModel.id);
    expect(found).not.toHaveProperty("providerCostMicros");

    const withCost = await service.getModel("chronolab-motion-2", true);

    expect(withCost).toMatchObject({ providerCostMicros: 55_000 });

    repositoryMock.findById.mockResolvedValue({ ...videoModel, active: false });

    await expect(service.getModel(videoModel.id)).rejects.toMatchObject({ status: 404 });
    await expect(service.getModel(videoModel.id, true)).resolves.toMatchObject({ active: false });
  });

  it("toggles a model active flag and throws 404 when missing", async () => {
    const disabled = { ...videoModel, active: false };
    repositoryMock.setActive.mockResolvedValue(disabled);

    const updated = await service.setModelActive(videoModel.id, false);

    expect(updated.active).toBe(false);

    repositoryMock.setActive.mockResolvedValue(null);

    await expect(service.setModelActive(videoModel.id, true)).rejects.toMatchObject({ status: 404 });
  });

  it("validates generation settings and throws 400 on unsupported option or 404 on unknown model", async () => {
    repositoryMock.findBySlug.mockResolvedValue(videoModel);

    const valid = await service.validateGenerationSettings(videoModel.slug, {
      mode: "video",
      resolution: "1080p",
      durationSeconds: 6,
      aspectRatio: "16:9",
      audio: true,
    });

    expect(valid).toMatchObject({ id: videoModel.id, providerCostMicros: 55_000 });

    await expect(
      service.validateGenerationSettings(videoModel.slug, {
        mode: "video",
        resolution: "4K",
        durationSeconds: 6,
        aspectRatio: "16:9",
      }),
    ).rejects.toMatchObject({ status: 400 });

    repositoryMock.findBySlug.mockResolvedValue(null);

    await expect(
      service.validateGenerationSettings("missing-model", {
        mode: "video",
        resolution: "1080p",
        durationSeconds: 6,
        aspectRatio: "16:9",
      }),
    ).rejects.toMatchObject({ status: 404 });
  });

  it("syncs updates through a registered provider adapter", async () => {
    const adapter: CatalogProviderAdapter = {
      provider: "chronolab",
      fetchModelUpdates: vi.fn().mockResolvedValue([
        {
          providerModelKey: videoModel.providerModelKey,
          vendor: null,
          active: true,
          capabilities: null,
          cost: { micros: 52_000, unit: "per_second" },
        },
      ]),
    };

    service.registerProviderAdapter(adapter);
    repositoryMock.listAll.mockResolvedValue([videoModel]);
    const synced = { ...videoModel, providerCostMicros: 52_000 };
    repositoryMock.upsertProviderModel.mockResolvedValue(synced);

    const result = await service.syncFromProvider("chronolab");

    expect(result).toEqual([synced]);
    expect(adapter.fetchModelUpdates).toHaveBeenCalledWith([videoModel]);
    expect(repositoryMock.upsertProviderModel).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: videoModel.slug,
        providerCostMicros: 52_000,
      }),
    );
  });

  it("throws 404 when syncing a provider without a registered adapter", async () => {
    await expect(service.syncFromProvider("unregistered")).rejects.toMatchObject({ status: 404 });
  });
});
