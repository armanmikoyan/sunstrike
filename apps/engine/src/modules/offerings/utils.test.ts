import { describe, expect, it } from "vitest";
import type { CatalogModel } from "@/modules/catalog";
import type { PricingRate } from "@/modules/pricing";
import { buildOfferings } from "./utils";

const videoModel: CatalogModel = {
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
    resolutions: ["1080p"],
    durationsSeconds: [5, 6],
    aspectRatios: ["16:9"],
    audio: true,
  },
  active: true,
  updatedAt: "2026-11-24T12:00:00.000Z",
};

const imageModel: CatalogModel = {
  ...videoModel,
  id: "22222222-2222-4222-8222-222222222222",
  slug: "chronolab-image-2",
  name: "Chronolab Image 2",
  capabilities: { ...videoModel.capabilities, modes: ["image"], durationsSeconds: [] },
};

const videoRate: PricingRate = {
  modelId: videoModel.id,
  unit: "per_second",
  unitPriceMicros: 85_000,
  rules: { tiers: [], resolutionMultipliers: {}, audioMultiplier: 1, discountPercent: 0 },
  example: { units: 6, totalMicros: 510_000 },
  currency: "USD",
  updatedAt: "2026-11-25T09:00:00.000Z",
};

const imageRate: PricingRate = { ...videoRate, modelId: imageModel.id, unit: "per_image", unitPriceMicros: 70_000 };

describe("offerings utils", () => {
  it("pairs models with their rates in catalog order without provider details", () => {
    const offerings = buildOfferings([videoModel, imageModel], [imageRate, videoRate]);

    expect(offerings.map((offering) => offering.model.slug)).toEqual([videoModel.slug, imageModel.slug]);
    expect(offerings[0]).toEqual({
      model: {
        id: videoModel.id,
        slug: videoModel.slug,
        name: videoModel.name,
        summary: videoModel.summary,
        vendor: videoModel.vendor,
        capabilities: videoModel.capabilities,
      },
      price: {
        unit: "per_second",
        unitPriceMicros: 85_000,
        rules: videoRate.rules,
        example: videoRate.example,
        currency: "USD",
        updatedAt: videoRate.updatedAt,
      },
    });
  });

  it("leaves out a model without an active price", () => {
    expect(buildOfferings([videoModel, imageModel], [videoRate]).map((offering) => offering.model.id)).toEqual([
      videoModel.id,
    ]);
  });
});
