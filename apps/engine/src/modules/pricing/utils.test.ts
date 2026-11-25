import { describe, expect, it } from "vitest";
import type { CatalogModel } from "@/modules/catalog";
import type { ModelPrice, QuoteRequest } from "./types";
import { buildQuote, buildRates, mapPriceRow, parsePricingRules, parseQuoteQuery, tierUnitPrice } from "./utils";

const videoModel: CatalogModel = {
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
    aspectRatios: ["16:9", "9:16"],
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
  capabilities: { ...videoModel.capabilities, modes: ["image"], resolutions: ["1 MP"], durationsSeconds: [] },
};

const noRules = { tiers: [], resolutionMultipliers: {}, audioMultiplier: 1, discountPercent: 0 };

const videoPrice: ModelPrice = {
  id: "33333333-3333-4333-8333-333333333333",
  modelId: videoModel.id,
  unitPriceMicros: 85_000,
  rules: noRules,
  active: true,
  updatedAt: "2026-11-25T09:00:00.000Z",
};

const imagePrice: ModelPrice = {
  ...videoPrice,
  id: "44444444-4444-4444-8444-444444444444",
  modelId: imageModel.id,
  unitPriceMicros: 70_000,
  rules: {
    ...noRules,
    tiers: [
      { minQuantity: 10, unitPriceMicros: 60_000 },
      { minQuantity: 50, unitPriceMicros: 50_000 },
    ],
  },
};

const videoRequest: QuoteRequest = {
  kind: "create",
  modelId: videoModel.slug,
  settings: { mode: "video", resolution: "1080p", aspectRatio: "16:9", durationSeconds: 6 },
  templateId: null,
  quantity: 1,
};

describe("pricing utils", () => {
  it("normalises stored rules, sorting tiers and dropping malformed entries", () => {
    expect(
      parsePricingRules({
        tiers: [
          { min_quantity: 50, unit_price_micros: 50_000 },
          { min_quantity: 10, unit_price_micros: 60_000 },
          { min_quantity: 0, unit_price_micros: 1 },
          "bad",
        ],
        resolution_multipliers: { "1080p": 1.25, "4K": -1 },
        audio_multiplier: 1.2,
        discount_percent: 150,
      }),
    ).toEqual({
      tiers: [
        { minQuantity: 10, unitPriceMicros: 60_000 },
        { minQuantity: 50, unitPriceMicros: 50_000 },
      ],
      resolutionMultipliers: { "1080p": 1.25 },
      audioMultiplier: 1.2,
      discountPercent: 0,
    });

    expect(parsePricingRules(null)).toEqual(noRules);
  });

  it("maps a database row with a bigint price", () => {
    expect(
      mapPriceRow({
        id: videoPrice.id,
        model_id: videoModel.id,
        unit_price_micros: "85000",
        pricing_rules: {},
        active: true,
        updated_at: videoPrice.updatedAt,
      }),
    ).toEqual(videoPrice);
  });

  it("picks the highest volume tier the quantity reaches", () => {
    expect(tierUnitPrice(imagePrice, 1)).toBe(70_000);
    expect(tierUnitPrice(imagePrice, 10)).toBe(60_000);
    expect(tierUnitPrice(imagePrice, 49)).toBe(60_000);
    expect(tierUnitPrice(imagePrice, 500)).toBe(50_000);
  });

  it("joins models to prices and skips models without an active price", () => {
    const rates = buildRates([videoModel, imageModel], [videoPrice]);

    expect(rates).toEqual([
      {
        modelId: videoModel.id,
        unit: "per_second",
        unitPriceMicros: 85_000,
        rules: noRules,
        currency: "USD",
        updatedAt: videoPrice.updatedAt,
      },
    ]);
  });

  it("quotes video by the second and images by the tiered unit", () => {
    const quotedAt = new Date("2026-11-25T10:00:00.000Z");
    const video = buildQuote(videoRequest, videoModel, videoPrice, quotedAt);

    expect(video).toMatchObject({ unit: "per_second", units: 6, unitPriceMicros: 85_000, totalMicros: 510_000 });
    expect(video.quotedAt).toBe(quotedAt.toISOString());

    const image = buildQuote(
      {
        ...videoRequest,
        modelId: imageModel.slug,
        settings: { mode: "image", resolution: "1 MP", aspectRatio: "1:1" },
        quantity: 10,
      },
      imageModel,
      imagePrice,
      quotedAt,
    );

    expect(image).toMatchObject({ unit: "per_image", units: 1, unitPriceMicros: 60_000, totalMicros: 600_000 });
  });

  it("applies setting multipliers before the percentage discount", () => {
    const price: ModelPrice = {
      ...videoPrice,
      rules: { ...noRules, resolutionMultipliers: { "1080p": 1.5 }, audioMultiplier: 2, discountPercent: 10 },
    };
    const quote = buildQuote(
      { ...videoRequest, settings: { ...videoRequest.settings, audio: true } },
      videoModel,
      price,
      new Date(),
    );

    expect(quote).toMatchObject({ subtotalMicros: 1_530_000, discountMicros: 153_000, totalMicros: 1_377_000 });
  });

  it("parses a quote query string with defaults and rejects malformed fields", () => {
    const query = {
      kind: "create",
      modelId: " chronolab-motion-2 ",
      mode: "video",
      resolution: "1080p",
      aspectRatio: "16:9",
      durationSeconds: "6",
    };

    expect(parseQuoteQuery(query)).toEqual({ ok: true, value: { ...videoRequest, modelId: "chronolab-motion-2" } });
    expect(parseQuoteQuery({ ...query, audio: "true", quantity: "3" })).toMatchObject({
      ok: true,
      value: { settings: { audio: true }, quantity: 3 },
    });

    expect(parseQuoteQuery({})).toMatchObject({ ok: false });
    expect(parseQuoteQuery({ ...query, kind: "remix" })).toMatchObject({ ok: false });
    expect(parseQuoteQuery({ ...query, mode: "3d" })).toMatchObject({ ok: false });
    expect(parseQuoteQuery({ ...query, mode: ["video", "image"] })).toMatchObject({ ok: false });
    expect(parseQuoteQuery({ ...query, durationSeconds: "six" })).toMatchObject({ ok: false });
    expect(parseQuoteQuery({ ...query, audio: "yes" })).toMatchObject({ ok: false });
    expect(parseQuoteQuery({ ...query, templateId: "not-a-uuid" })).toMatchObject({ ok: false });
    expect(parseQuoteQuery({ ...query, quantity: "1.5" })).toMatchObject({ ok: false });
  });
});
