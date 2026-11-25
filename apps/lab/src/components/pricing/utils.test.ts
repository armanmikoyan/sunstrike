import { describe, expect, it } from "vitest";
import { toModelOption } from "@/components/studio/utils";
import { offerings } from "@/mocks/offerings";
import { formatUSD, formatUSDRate, interleaveRows, modelCapacity, rowsFor } from "./utils";

const [motion, seedance, image2, imagePro] = offerings.map(toModelOption);

describe("modelCapacity", () => {
  it("counts whole example outputs the amount buys", () => {
    expect(modelCapacity(motion, 50)).toBe(98);
    expect(modelCapacity(image2, 5)).toBe(71);
  });

  it("buys nothing without a model", () => {
    expect(modelCapacity(undefined, 50)).toBe(0);
  });
});

describe("interleaveRows", () => {
  it("alternates video and image rows, then lists the rest", () => {
    const rows = interleaveRows([motion, seedance], [image2, imagePro]);

    expect(rows.map((row) => `${row.kind}:${row.model.slug}`)).toEqual([
      "video:chronolab-motion-2",
      "image:chronolab-image-2",
      "video:seedance",
      "image:chronolab-image-pro",
    ]);
    expect(interleaveRows([motion, seedance], [image2]).map((row) => row.model.slug)).toEqual([
      "chronolab-motion-2",
      "chronolab-image-2",
      "seedance",
    ]);
  });

  it("filters rows by kind", () => {
    const rows = interleaveRows([motion], [image2]);

    expect(rowsFor(rows, "image").map((row) => row.kind)).toEqual(["image"]);
    expect(rowsFor(rows, "all")).toHaveLength(2);
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

describe("formatUSDRate", () => {
  it("keeps three decimals only when the rate needs them", () => {
    expect(formatUSDRate(0.085)).toBe("$0.085");
    expect(formatUSDRate(0.072)).toBe("$0.072");
    expect(formatUSDRate(0.1)).toBe("$0.10");
  });
});
