import { describe, expect, it } from "vitest";
import robots from "./robots";
import { siteUrl } from "@/lib/site";

describe("robots", () => {
  const config = robots();
  const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
  const disallow = rules.flatMap((rule) => rule.disallow ?? []);

  it("allows the marketing pages", () => {
    expect(rules.every((rule) => rule.userAgent === "*")).toBe(true);
  });

  it("keeps account and studio screens out of the index", () => {
    expect(disallow).toContain("/create/");
    expect(disallow).toContain("/library");
    expect(disallow).toContain("/settings");
  });

  it("leaves the sign-in page crawlable for its noindex tag", () => {
    expect(disallow).not.toContain("/login");
  });

  it("points crawlers at the sitemap", () => {
    expect(config.sitemap).toBe(`${siteUrl}/sitemap.xml`);
  });
});
