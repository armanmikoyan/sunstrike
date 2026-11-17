import { describe, expect, it } from "vitest";
import { activationTargets } from "./legal-contents";

describe("activationTargets", () => {
  it("uses the heading offset for sections that can reach the reading line", () => {
    expect(activationTargets([100, 500, 900], 2_000)).toEqual([0, 360, 760]);
    expect(activationTargets([100, 500, 900], 2_000, 400)).toEqual([
      0, 100, 500,
    ]);
  });

  it("lets the first item own the top of the page", () => {
    // The first two headings sit high on the page; the rail must still open
    // on Overview rather than its neighbour.
    expect(activationTargets([239, 390, 647], 1_569)).toEqual([0, 250, 507]);
  });

  it("pins the final item to the bottom and pulls the tail back", () => {
    expect(activationTargets([100, 500, 900, 1_100], 800)).toEqual([
      0, 360, 710, 800,
    ]);
  });

  it("keeps at least 90px of scroll between the final sections", () => {
    expect(
      activationTargets([100, 500, 900, 1_100, 1_300], 800),
    ).toEqual([0, 360, 620, 710, 800]);
  });

  it("keeps the first and last item when the page can barely scroll", () => {
    expect(activationTargets([500, 600], 100)).toEqual([0, 100]);
    expect(activationTargets([500, 600, 700], 100)).toEqual([0, 10, 100]);
  });
});
