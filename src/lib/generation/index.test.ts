import { describe, expect, it } from "vitest";
import {
  aspectRatios,
  aspectRatiosFor,
  durations,
  durationsFor,
  getGenerationCost,
  resolutionsFor,
  type ModelOption,
} from ".";

const model = (overrides: Partial<ModelOption> = {}): ModelOption => ({
  id: "mdl_test",
  slug: "chronolab-test",
  displayName: "Chronolab Test",
  provider: "Chronolab",
  providerModelId: "test",
  capabilities: {
    modes: ["video"],
    inputs: ["image"],
    resolutions: ["720p", "1080p"],
    durations: ["4s", "5s", "6s"],
    aspectRatios: ["16:9", "9:16", "1:1"],
    audio: false,
  },
  isEnabled: true,
  cost: 0.51,
  ...overrides,
});

describe("getGenerationCost", () => {
  it("returns the clip rate for a standard duration", () => {
    expect(getGenerationCost("video", model(), "5s")).toBe(0.51);
    expect(getGenerationCost("video", model({ cost: 0.34 }), "4s")).toBe(0.34);
  });

  it("adds render time for longer takes", () => {
    expect(getGenerationCost("video", model(), "8s")).toBe(0.68);
    expect(getGenerationCost("video", model(), "12s")).toBe(0.94);
  });

  it("ignores duration for stills", () => {
    expect(getGenerationCost("image", model({ cost: 0.07 }), "12s")).toBe(0.07);
    expect(getGenerationCost("image", model({ cost: 0.17 }), "5s")).toBe(0.17);
  });

  it("rounds to cents", () => {
    expect(getGenerationCost("video", model({ cost: 0.43 }), "12s")).toBe(0.86);
  });
});

describe("generation presets", () => {
  it("lists six aspect ratios including landscape and portrait", () => {
    expect(aspectRatios).toHaveLength(6);
    const values = aspectRatios.map((ratio) => ratio.value);
    expect(values).toEqual(
      expect.arrayContaining(["16:9", "9:16", "1:1", "4:3", "3:4", "21:9"]),
    );
    expect(new Set(values).size).toBe(6);
  });

  it("offers durations the composer can show", () => {
    expect(durations).toEqual(["4s", "5s", "6s", "8s", "12s"]);
  });

  it("only exposes settings the selected model advertises", () => {
    const turbo = model();
    expect(aspectRatiosFor(turbo).map((ratio) => ratio.value)).toEqual([
      "16:9",
      "9:16",
      "1:1",
    ]);
    expect(durationsFor(turbo)).toEqual(["4s", "5s", "6s"]);
    expect(resolutionsFor(turbo)).toEqual(["720p", "1080p"]);
    expect(turbo.capabilities.audio).toBe(false);
  });

  it("returns no durations for a still model", () => {
    expect(durationsFor(model({ capabilities: { ...model().capabilities, durations: [] } }))).toEqual([]);
  });
});
