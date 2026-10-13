import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/** Lets search engines crawl everything and points them at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
