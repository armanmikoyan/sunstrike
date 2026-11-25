import { describe, expect, it } from "vitest";
import type { ModelOption, Offering } from "./types";
import { ASPECT_RATIOS } from "./constants";
import {
  aspectRatiosFor,
  durationsFor,
  formatDuration,
  formatRate,
  modelsForMode,
  quoteQuery,
  resolutionsFor,
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
  unit: "per_second",
  unitPrice: 0.085,
  ...overrides,
});

describe("toModelOption", () => {
  it("names the model and prices it in dollars", () => {
    const offering: Offering = {
      model: {
        id: "mdl_test",
        slug: "chronolab-test",
        name: "Chronolab Test",
        summary: "Fast drafts and short motion tests.",
        capabilities: model().capabilities,
      },
      price: { unit: "per_second", unitPriceMicros: 85_000, currency: "USD" },
    };

    expect(toModelOption(offering)).toEqual(model());
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
