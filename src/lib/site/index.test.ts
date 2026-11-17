import { describe, expect, it } from "vitest";
import { siteUrl } from ".";

describe("site origin", () => {
  it("is an absolute origin without a trailing slash", () => {
    expect(siteUrl).toBe("https://chronolab.ai");
    expect(siteUrl.endsWith("/")).toBe(false);
    expect(new URL(siteUrl).host).toBe("chronolab.ai");
  });
});
