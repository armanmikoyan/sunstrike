import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Marketing pages are crawlable. Screens behind an account and the studio are
 * blocked here. `/login` stays crawlable because it needs to serve its own
 * `noindex` metadata; blocking the fetch would hide that signal.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/create/",
          "/library",
          "/assets",
          "/favorites",
          "/settings",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
