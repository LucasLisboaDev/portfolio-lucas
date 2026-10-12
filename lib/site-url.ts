/**
 * Absolute base URL of the site, used for social preview images, the sitemap
 * and canonical links.
 *
 * Production uses the public domain. Vercel preview builds use their own
 * deployment URL, so a shared preview link shows its own preview image.
 * Local builds fall back to localhost. If the site moves to a custom domain,
 * set NEXT_PUBLIC_SITE_URL in the Vercel project settings.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === "production"
    ? "https://portfolio-lucas-henna.vercel.app"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
