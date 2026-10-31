import { describe, expect, it } from "vitest";
import {
  MAX_CLIPS,
  MAX_IMAGES,
  MIN_CLIPS,
  MIN_IMAGES,
  VIDEO_PRICE,
  clampClipQuantity,
  clampImageQuantity,
  formatUSD,
  getImageQuote,
  getImageUnitPrice,
  getVideoQuote,
  videoModels,
} from "@/lib/pricing";

describe("image tiers", () => {
  it("charges 7c below ten images", () => {
    expect(getImageUnitPrice(1)).toBe(0.07);
    expect(getImageUnitPrice(9)).toBe(0.07);
  });

  it("charges 6c from ten images", () => {
    expect(getImageUnitPrice(10)).toBe(0.06);
    expect(getImageUnitPrice(49)).toBe(0.06);
  });

  it("charges 5c from fifty images", () => {
    expect(getImageUnitPrice(50)).toBe(0.05);
    expect(getImageUnitPrice(MAX_IMAGES)).toBe(0.05);
  });
});

describe("clampImageQuantity", () => {
  it("never drops below the minimum", () => {
    expect(clampImageQuantity(0)).toBe(MIN_IMAGES);
    expect(clampImageQuantity(-12)).toBe(MIN_IMAGES);
  });

  it("never exceeds the 500 image cap", () => {
    expect(clampImageQuantity(501)).toBe(MAX_IMAGES);
    expect(clampImageQuantity(5000)).toBe(MAX_IMAGES);
  });

  it("rounds fractional input", () => {
    expect(clampImageQuantity(3.4)).toBe(3);
    expect(clampImageQuantity(3.6)).toBe(4);
  });
});

describe("clampClipQuantity", () => {
  it("keeps clips between one and fifty", () => {
    expect(clampClipQuantity(0)).toBe(MIN_CLIPS);
    expect(clampClipQuantity(-4)).toBe(MIN_CLIPS);
    expect(clampClipQuantity(51)).toBe(MAX_CLIPS);
    expect(clampClipQuantity(10_000)).toBe(MAX_CLIPS);
  });

  it("rounds fractional clip counts", () => {
    expect(clampClipQuantity(3.2)).toBe(3);
    expect(clampClipQuantity(3.7)).toBe(4);
  });
});

describe("getImageQuote", () => {
  it("prices a ten image order at the middle tier", () => {
    const quote = getImageQuote(10);
    expect(quote).toMatchObject({ quantity: 10, unit: 0.06, total: 0.6 });
    expect(quote.savings).toBeCloseTo(0.1, 5);
    expect(quote.percent).toBe(14);
  });

  it("prices the 500 image maximum", () => {
    const quote = getImageQuote(500);
    expect(quote.quantity).toBe(MAX_IMAGES);
    expect(quote.unit).toBe(0.05);
    expect(quote.total).toBe(25);
    expect(quote.savings).toBe(10);
  });

  it("reports no saving on the base tier", () => {
    const quote = getImageQuote(5);
    expect(quote.savings).toBe(0);
    expect(quote.percent).toBe(0);
  });

  it("clamps out of range quantities before quoting", () => {
    expect(getImageQuote(0).quantity).toBe(MIN_IMAGES);
    expect(getImageQuote(10_000).quantity).toBe(MAX_IMAGES);
  });

  it("rounds totals to cents", () => {
    for (const quantity of [1, 7, 13, 49, 51, 137, 499]) {
      const { total } = getImageQuote(quantity);
      expect(Number.isInteger(Math.round(total * 100))).toBe(true);
      expect(total).toBe(Math.round(total * 100) / 100);
    }
  });
});

describe("getVideoQuote", () => {
  it("uses the standard clip rate by default", () => {
    expect(getVideoQuote(4, "standard")).toEqual({
      quantity: 4,
      unit: 0.51,
      total: 2.04,
    });
  });

  it("supports the turbo model", () => {
    expect(getVideoQuote(4, "turbo")).toEqual({
      quantity: 4,
      unit: 0.34,
      total: 1.36,
    });
  });

  it("clamps to the clip range", () => {
    expect(getVideoQuote(0, "standard").quantity).toBe(MIN_CLIPS);
    expect(getVideoQuote(999, "standard").quantity).toBe(MAX_CLIPS);
  });

  it("falls back to the published rate for unknown models", () => {
    // @ts-expect-error deliberately passing an unknown id
    expect(getVideoQuote(2, "something-else").unit).toBe(VIDEO_PRICE);
  });
});

describe("video models", () => {
  it("is priced in dollars, not credits", () => {
    for (const model of videoModels) {
      expect(model.price).toBeGreaterThan(0);
      expect(model.price).toBeLessThan(1);
    }
  });
});

describe("formatUSD", () => {
  it("formats whole and fractional amounts", () => {
    expect(formatUSD(10.54)).toBe("$10.54");
    expect(formatUSD(0.6)).toBe("$0.60");
    expect(formatUSD(25)).toBe("$25.00");
    expect(formatUSD(0)).toBe("$0.00");
  });
});
