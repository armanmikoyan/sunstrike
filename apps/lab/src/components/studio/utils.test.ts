import { describe, expect, it } from "vitest";
import type { ModelOption, Offering } from "./types";
import { ASPECT_RATIOS } from "./constants";
import {
  aspectRatiosFor,
  durationIndex,
  durationsFor,
  formatDuration,
  formatDurationRange,
  formatRate,
  modelsForMode,
  quoteQuery,
  resolutionsFor,
  spokenDuration,
  toModelOption,
} from "./utils";

const model = (overrides: Partial<ModelOption> = {}): ModelOption => ({
  id: "mdl_test",
  slug: "chronolab-test",
  displayName: "Chronolab Test",
  summary: "Fast drafts and short motion tests.",
  capabilities: {
    modes: ["video"],
    inputs: ["image"],
    resolutions: ["720p", "1080p"],
    durationsSeconds: [4, 5, 6],
    aspectRatios: ["16:9", "9:16", "1:1"],
    audio: false,
  },
  vendor: { id: "bytedance", name: "ByteDance", logoUrl: null },
  unit: "per_second",
  unitPrice: 0.085,
  priceVaries: false,
  tiers: [],
  example: { units: 6, total: 0.51 },
  ...overrides,
});

const offering = (price: Partial<Offering["price"]> = {}): Offering => ({
  model: {
    id: "mdl_test",
    slug: "chronolab-test",
    name: "Chronolab Test",
    summary: "Fast drafts and short motion tests.",
    vendor: { id: "bytedance", name: "ByteDance", logoUrl: null },
    capabilities: model().capabilities,
  },
  price: {
    unit: "per_second",
    unitPriceMicros: 85_000,
    rules: { tiers: [], resolutionMultipliers: {}, audioMultiplier: 1, discountPercent: 0 },
    example: { units: 6, totalMicros: 510_000 },
    currency: "USD",
    ...price,
  },
});

describe("toModelOption", () => {
  it("names the model and prices it in dollars", () => {
    expect(toModelOption(offering())).toEqual(model());
  });

  it("marks a price that rises with resolution or audio, and converts volume tiers", () => {
    const option = toModelOption(
      offering({
        rules: {
          tiers: [{ minQuantity: 10, unitPriceMicros: 60_000 }],
          resolutionMultipliers: { "1080p": 1.5 },
          audioMultiplier: 1,
          discountPercent: 0,
        },
      }),
    );

    expect(option.priceVaries).toBe(true);
    expect(option.tiers).toEqual([{ minQuantity: 10, unitPrice: 0.06 }]);
    expect(toModelOption(offering()).priceVaries).toBe(false);
  });
});

describe("modelsForMode", () => {
  it("keeps the models that support the mode, in order", () => {
    const still = model({ id: "mdl_still", capabilities: { ...model().capabilities, modes: ["image"] } });

    expect(modelsForMode([model(), still], "image")).toEqual([still]);
    expect(modelsForMode([model(), still], "video")).toEqual([model()]);
  });
});

describe("formatting", () => {
  it("labels durations in seconds", () => {
    expect(formatDuration(5)).toBe("5s");
  });

  it("labels the duration range and speaks the value", () => {
    expect(formatDurationRange([4, 5, 6, 15])).toBe("4–15s");
    expect(formatDurationRange([5])).toBe("5s");
    expect(formatDurationRange([])).toBe("");
    expect(spokenDuration(6)).toBe("6 seconds");
  });

  it("finds the slider stop for a duration, falling back to the first", () => {
    expect(durationIndex([4, 6, 7, 8], 7)).toBe(2);
    expect(durationIndex([4, 6, 7, 8], 5)).toBe(0);
  });

  it("shows the rate with its unit", () => {
    expect(formatRate(model())).toBe("$0.085/s");
    expect(formatRate(model({ unit: "per_image", unitPrice: 0.07 }))).toBe("$0.07/image");
  });
});

describe("quoteQuery", () => {
  it("sends the video settings with the duration", () => {
    const params = new URLSearchParams(
      quoteQuery({
        modelId: "mdl_test",
        mode: "video",
        resolution: "1080p",
        aspectRatio: "16:9",
        durationSeconds: 5,
        audio: true,
      }),
    );

    expect(Object.fromEntries(params)).toEqual({
      kind: "create",
      modelId: "mdl_test",
      mode: "video",
      resolution: "1080p",
      aspectRatio: "16:9",
      audio: "true",
      durationSeconds: "5",
    });
  });

  it("leaves the duration out for stills", () => {
    const params = new URLSearchParams(
      quoteQuery({
        modelId: "mdl_test",
        mode: "image",
        resolution: "1 MP",
        aspectRatio: "1:1",
        durationSeconds: null,
        audio: false,
      }),
    );

    expect(params.has("durationSeconds")).toBe(false);
  });
});

describe("generation presets", () => {
  it("lists six aspect ratios including landscape and portrait", () => {
    expect(ASPECT_RATIOS).toHaveLength(6);
    const values = ASPECT_RATIOS.map((ratio) => ratio.value);
    expect(values).toEqual(expect.arrayContaining(["16:9", "9:16", "1:1", "4:3", "3:4", "21:9"]));
    expect(new Set(values).size).toBe(6);
  });

  it("only exposes settings the selected model advertises", () => {
    const turbo = model();
    expect(aspectRatiosFor(turbo).map((ratio) => ratio.value)).toEqual(["16:9", "9:16", "1:1"]);
    expect(durationsFor(turbo)).toEqual([4, 5, 6]);
    expect(resolutionsFor(turbo)).toEqual(["720p", "1080p"]);
    expect(turbo.capabilities.audio).toBe(false);
  });

  it("returns no durations for a still model", () => {
    expect(durationsFor(model({ capabilities: { ...model().capabilities, durationsSeconds: [] } }))).toEqual([]);
  });
});
