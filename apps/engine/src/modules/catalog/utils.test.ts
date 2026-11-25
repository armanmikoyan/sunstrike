import { describe, expect, it } from "vitest";
import type { CatalogModelWithCost, ModelRow } from "./types";
import {
  filterModelsByMode,
  filterModelsByProvider,
  isGenerationMode,
  mapModelRow,
  mergeProviderUpdates,
  toPublicModel,
  validateModelCapabilities,
} from "./utils";

const videoModel: CatalogModelWithCost = {
  id: "11111111-1111-4111-8111-111111111111",
  slug: "chronolab-motion-2",
  name: "Chronolab Motion 2",
  summary: "Native audio and longer takes.",
  provider: "chronolab",
  providerModelKey: "motion-2",
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

describe("catalog utils", () => {
  it("maps a database row and parses bigint provider cost strings", () => {
    const row: ModelRow = {
      id: videoModel.id,
      slug: videoModel.slug,
      name: videoModel.name,
      summary: videoModel.summary,
      provider: videoModel.provider,
      provider_model_key: videoModel.providerModelKey,
      supported_modes: ["video", "unknown-mode"],
      supported_inputs: ["image", "video", "invalid-input"],
      resolutions: ["720p", "1080p"],
      durations_seconds: [4, 5, 6, 8, 12],
      aspect_ratios: ["16:9", "9:16", "1:1"],
      supports_audio: true,
      provider_cost_micros: "55000",
      provider_cost_unit: "per_second",
      sort_order: 10,
      active: true,
      updated_at: "2026-11-24T12:00:00.000Z",
    };

    expect(mapModelRow(row)).toEqual(videoModel);
  });

  it("strips upstream provider cost fields when converting to public model", () => {
    const publicModel = toPublicModel(videoModel);

    expect(publicModel).not.toHaveProperty("providerCostMicros");
    expect(publicModel).not.toHaveProperty("providerCostUnit");
    expect(publicModel.slug).toBe("chronolab-motion-2");
    expect(publicModel.capabilities.audio).toBe(true);
  });

  it("checks valid generation modes and filters models", () => {
    expect(isGenerationMode("video")).toBe(true);
    expect(isGenerationMode("image")).toBe(true);
    expect(isGenerationMode("audio")).toBe(false);
    expect(isGenerationMode(undefined)).toBe(false);
    expect(isGenerationMode(["video"])).toBe(false);

    expect(filterModelsByMode([videoModel, imageModel], "video")).toEqual([videoModel]);
    expect(filterModelsByMode([videoModel, imageModel])).toEqual([videoModel, imageModel]);
    expect(filterModelsByProvider([videoModel, imageModel], "chronolab")).toEqual([videoModel, imageModel]);
  });

  it("merges upstream provider updates with existing catalog metadata", () => {
    const merged = mergeProviderUpdates(
      [videoModel, imageModel],
      [
        {
          providerModelKey: videoModel.providerModelKey,
          name: "Chronolab Motion 2.1",
          providerCostMicros: 52_000,
          active: true,
        },
      ],
    );

    expect(merged).toEqual([
      {
        slug: videoModel.slug,
        name: "Chronolab Motion 2.1",
        summary: videoModel.summary,
        provider: videoModel.provider,
        providerModelKey: videoModel.providerModelKey,
        capabilities: videoModel.capabilities,
        providerCostMicros: 52_000,
        providerCostUnit: videoModel.providerCostUnit,
        active: true,
      },
    ]);
  });

  it("accepts valid video and image generation settings", () => {
    expect(
      validateModelCapabilities(videoModel, {
        mode: "video",
        resolution: "1080p",
        durationSeconds: 6,
        aspectRatio: "16:9",
        audio: true,
        inputs: ["image"],
      }),
    ).toEqual({ ok: true, model: videoModel });

    expect(
      validateModelCapabilities(imageModel, {
        mode: "image",
        resolution: "1 MP",
        aspectRatio: "1:1",
        audio: false,
      }),
    ).toEqual({ ok: true, model: imageModel });
  });

  it("rejects inactive models and unsupported capabilities", () => {
    expect(
      validateModelCapabilities(
        { ...videoModel, active: false },
        { mode: "video", resolution: "1080p", durationSeconds: 6, aspectRatio: "16:9" },
      ),
    ).toMatchObject({ ok: false, code: "model_inactive" });

    expect(
      validateModelCapabilities(videoModel, {
        mode: "image",
        resolution: "1080p",
        aspectRatio: "16:9",
      }),
    ).toMatchObject({ ok: false, code: "unsupported_mode" });

    expect(
      validateModelCapabilities(videoModel, {
        mode: "video",
        resolution: "4K",
        durationSeconds: 6,
        aspectRatio: "16:9",
      }),
    ).toMatchObject({ ok: false, code: "unsupported_resolution" });

    expect(
      validateModelCapabilities(videoModel, {
        mode: "video",
        resolution: "1080p",
        durationSeconds: 6,
        aspectRatio: "21:9",
      }),
    ).toMatchObject({ ok: false, code: "unsupported_aspect_ratio" });

    expect(
      validateModelCapabilities(videoModel, {
        mode: "video",
        resolution: "1080p",
        durationSeconds: 30,
        aspectRatio: "16:9",
      }),
    ).toMatchObject({ ok: false, code: "unsupported_duration" });

    expect(
      validateModelCapabilities(imageModel, {
        mode: "image",
        resolution: "1 MP",
        durationSeconds: 5,
        aspectRatio: "1:1",
      }),
    ).toMatchObject({ ok: false, code: "unsupported_duration" });

    expect(
      validateModelCapabilities(imageModel, {
        mode: "image",
        resolution: "1 MP",
        aspectRatio: "1:1",
        audio: true,
      }),
    ).toMatchObject({ ok: false, code: "unsupported_audio" });

    expect(
      validateModelCapabilities(imageModel, {
        mode: "image",
        resolution: "1 MP",
        aspectRatio: "1:1",
        inputs: ["video"],
      }),
    ).toMatchObject({ ok: false, code: "unsupported_input" });
  });
});
