import { describe, expect, it } from "vitest";
import {
  aspectRatios,
  durations,
  getGenerationCost,
  modelOptions,
} from ".";

describe("model catalogue", () => {
  it("offers four models per mode", () => {
    expect(modelOptions.video).toHaveLength(4);
    expect(modelOptions.image).toHaveLength(4);
  });

  it("every model is priced in dollars with a visible description", () => {
    for (const models of Object.values(modelOptions)) {
      for (const model of models) {
        expect(model.name).toMatch(/^Chronolab /);
        expect(model.cost).toBeGreaterThan(0);
        expect(model.cost).toBeLessThan(1);
        expect(model.description.length).toBeGreaterThan(0);
      }
    }
  });

  it("video models cost more than image models", () => {
    const cheapestVideo = Math.min(
      ...modelOptions.video.map((model) => model.cost),
    );
    const priciestImage = Math.max(
      ...modelOptions.image.map((model) => model.cost),
    );
    expect(cheapestVideo).toBeGreaterThan(priciestImage);
  });
});

describe("getGenerationCost", () => {
  it("returns the clip rate for a standard duration", () => {
    expect(getGenerationCost("video", "Chronolab Motion 2", "5s")).toBe(0.51);
    expect(
      getGenerationCost("video", "Chronolab Motion Turbo", "4s"),
    ).toBe(0.34);
  });

  it("adds render time for longer takes", () => {
    expect(getGenerationCost("video", "Chronolab Motion 2", "8s")).toBe(0.68);
    expect(getGenerationCost("video", "Chronolab Motion 2", "12s")).toBe(0.94);
  });

  it("ignores duration for stills", () => {
    expect(getGenerationCost("image", "Chronolab Image 2", "12s")).toBe(0.07);
    expect(getGenerationCost("image", "Chronolab Image Raw", "5s")).toBe(0.17);
  });

  it("falls back to the first model when the name is unknown", () => {
    expect(getGenerationCost("video", "Unknown model", "5s")).toBe(
      modelOptions.video[0].cost,
    );
    expect(getGenerationCost("image", "Unknown model", "5s")).toBe(
      modelOptions.image[0].cost,
    );
  });

  it("rounds to cents", () => {
    expect(getGenerationCost("video", "Chronolab Loop", "12s")).toBe(0.86);
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
});
