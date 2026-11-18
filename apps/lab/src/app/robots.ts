import type { MetadataRoute } from "next";

/**
 * Marketing pages are crawlable. Screens behind an account and the studio are
 * blocked here. `/login` stays crawlable because it needs to serve its own
 * `noindex` metadata; blocking the fetch would hide that signal.
 */
const SITE_URL = process.env.SITE_URL ?? "https://chronolab.ai";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/create/", "/library", "/assets", "/favorites", "/settings"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
