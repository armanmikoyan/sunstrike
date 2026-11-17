import type { MetadataRoute } from "next";
import { legalUpdated } from "@/components/legal/constants";
import { siteUrl } from "@/lib/site";

const updated = new Date(`${legalUpdated.iso}T00:00:00.000Z`);

/**
 * Only the marketing and legal pages belong here. The studio, the library and
 * the settings tabs sit behind an account and stay out of search results.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/explore`,
      lastModified: updated,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/help`,
      lastModified: updated,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: updated,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: updated,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
