import type { MetadataRoute } from "next";
import { allProjectSlugs } from "@/lib/projects";
import { SITE_URL } from "@/lib/site-url";

/** The homepage and every case study, generated at build time. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...allProjectSlugs().map((slug) => ({
      url: `${SITE_URL}/work/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
