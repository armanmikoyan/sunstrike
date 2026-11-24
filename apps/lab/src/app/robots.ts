import type { MetadataRoute } from "next";

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
