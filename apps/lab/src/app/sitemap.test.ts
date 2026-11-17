import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { legalUpdated } from "@/components/legal/constants";
import { siteUrl } from "@/lib/site";

describe("sitemap", () => {
  const entries = sitemap();
  const paths = entries.map((entry) => entry.url.replace(siteUrl, ""));

  it("lists the public pages on the live origin", () => {
    expect(paths).toEqual([
      "/",
      "/explore",
      "/pricing",
      "/help",
      "/privacy",
      "/terms",
    ]);
    for (const entry of entries) {
      expect(entry.url.startsWith(`${siteUrl}/`)).toBe(true);
    }
  });

  it("stamps legal pages with the revision date", () => {
    const privacy = entries.find((entry) => entry.url.endsWith("/privacy"));
    expect(privacy?.lastModified).toEqual(
      new Date(`${legalUpdated.iso}T00:00:00.000Z`),
    );
    expect(privacy?.changeFrequency).toBe("yearly");
  });
});
