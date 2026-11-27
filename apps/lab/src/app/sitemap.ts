import type { MetadataRoute } from "next";
import { LEGAL_UPDATED } from "@/components/legal/constants";

const SITE_URL = process.env.SITE_URL ?? "https://wildscape.ai";
const updated = new Date(`${LEGAL_UPDATED.iso}T00:00:00.000Z`);

/**
 * Only the marketing and legal pages belong here. The studio, the library and
 * the settings tabs sit behind an account and stay out of search results.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/explore`,
      lastModified: updated,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/help`,
      lastModified: updated,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: updated,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: updated,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
