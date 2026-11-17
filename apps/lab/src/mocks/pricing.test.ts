import { describe, expect, it } from "vitest";
import { imageRates, topUpPacks, videoRates } from "./pricing";
import { mediaItems } from "./media";

describe("pricing data", () => {
  it("offers six top-up presets in dollars", () => {
    expect(topUpPacks.map((pack) => pack.price)).toEqual([
      5, 50, 250, 1000, 5000, 10000,
    ]);
    expect(topUpPacks.map((pack) => pack.note)).not.toContain("");
    expect(topUpPacks.find((pack) => pack.popular)?.price).toBe(50);
  });

  it("publishes a per-second rate for every video model", () => {
    expect(videoRates).toHaveLength(5);
    for (const model of videoRates) {
      expect(model.perSecond).toBeGreaterThan(0);
      expect(model.perSecond).toBeLessThan(1);
    }
  });

  it("publishes a per-image rate for every image model", () => {
    expect(imageRates).toHaveLength(4);
    for (const model of imageRates) {
      expect(model.perImage).toBeGreaterThan(0);
      expect(model.perImage).toBeLessThan(1);
    }
  });

  it("does not mention credits anywhere in the catalogue", () => {
    const serialised = JSON.stringify({
      mediaItems,
      topUpPacks,
      videoRates,
      imageRates,
    });
    expect(serialised).not.toMatch(/credit/i);
  });
});

describe("video rates", () => {
  it("matches the published second rates", () => {
    expect(videoRates.map((model) => model.perSecond)).toEqual([
      0.085, 0.09, 0.085, 0.1, 0.072,
    ]);
  });

  it("quotes a six-second clip from the second rate", () => {
    expect(
      videoRates.map((model) => Math.round(model.perSecond * 6 * 100) / 100),
    ).toEqual([0.51, 0.54, 0.51, 0.6, 0.43]);
  });
});
