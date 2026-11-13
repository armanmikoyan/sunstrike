import { describe, expect, it } from "vitest";
import {
  VIDEO_PRICE,
  generationRates,
  getVideoUnitPrice,
  topUpPacks,
  videoModels,
} from "./pricing";
import { mediaItems } from "./media";

describe("pricing data", () => {
  it("offers three top-up packs in dollars", () => {
    expect(topUpPacks.map((pack) => pack.price)).toEqual([10, 25, 50]);
    expect(topUpPacks.filter((pack) => pack.popular)).toHaveLength(1);
  });

  it("publishes per-render rates as dollar strings", () => {
    expect(generationRates.length).toBeGreaterThanOrEqual(4);
    for (const rate of generationRates) {
      expect(rate.price).toMatch(/^\$\d+\.\d{2}$/);
    }
  });

  it("does not mention credits anywhere in the catalogue", () => {
    const serialised = JSON.stringify({
      mediaItems,
      topUpPacks,
      generationRates,
    });
    expect(serialised).not.toMatch(/credit/i);
  });
});

describe("video models", () => {
  it("is priced in dollars, not credits", () => {
    for (const model of videoModels) {
      expect(model.price).toBeGreaterThan(0);
      expect(model.price).toBeLessThan(1);
    }
  });

  it("falls back to the published rate for unknown models", () => {
    expect(getVideoUnitPrice("something-else")).toBe(VIDEO_PRICE);
    expect(getVideoUnitPrice("turbo")).toBe(0.34);
    expect(getVideoUnitPrice("standard")).toBe(0.51);
  });
});
