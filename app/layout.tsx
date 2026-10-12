import "./globals.css";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL } from "@/lib/site-url";
import MotionProvider from "@/components/motion/MotionProvider";
import SmoothScroll from "@/components/motion/SmoothScroll";
import ViewTransitions from "@/components/motion/ViewTransitions";

/*
 * Fonts are self-hosted from app/fonts (SIL Open Font License, see
 * app/fonts/OFL-LICENSES.txt), so builds never depend on Google Fonts.
 *
 * Note: fallback lists must not contain "Arial Black". next/font writes the
 * fallbacks into a CSS variable unquoted, and the CSS minifier then reads
 * "Black" as the color black, which silently invalidates the whole font stack.
 */

/**
 * Headline: a static Archivo instance at weight 800 and width 112%, subset to
 * Basic Latin (about 7 KB). Generated from the variable font with fontTools'
 * instancer using OverlapMode.REMOVE, which merges the overlapping shapes
 * variable fonts are built from. That serves two purposes:
 * - Outlined words (LUCAS, the footer wordmark) render cleanly. A stroke on
 *   the variable font traced its internal overlaps (a stray box in the "A").
 * - The hero only needs this one tiny file, instead of the larger variable
 *   font, which keeps Largest Contentful Paint fast on slow connections.
 * Used by .text-display and .text-outline in globals.css. Preloaded.
 */
const headline = localFont({
  src: "./fonts/Archivo-Headline-800-112.woff2",
  variable: "--font-headline",
  weight: "800",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

/**
 * Display: Archivo at normal width (100%), variable from weight 600 to 800,
 * for everything that is not the 800/112% headline style: section labels,
 * card titles, case study headings. Those are the only widths and weights
 * the design uses, so the font is trimmed to them (23 KB instead of 88 KB;
 * see scripts/build-brand-assets.py). Not preloaded: it is mostly needed
 * below the fold.
 */
const display = localFont({
  src: "./fonts/Archivo-Display-600-800.woff2",
  variable: "--font-display",
  weight: "600 800",
  display: "swap",
  fallback: ["Arial", "system-ui", "sans-serif"],
  preload: false,
});

/** Body and UI: Inter, variable from weight 400 to 700 (35 KB). */
const sans = localFont({
  src: "./fonts/Inter-400-700.woff2",
  variable: "--font-sans",
  weight: "400 700",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
});

const description =
  "AI Engineer with full-stack experience building production applications across web, mobile, data, and intelligent systems, from architecture to cloud deployment.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Lucas Lisboa Alves | AI Engineer",
  description,
  applicationName: "Lucas Lisboa Alves",
  authors: [{ name: "Lucas Lisboa Alves" }],
  openGraph: {
    type: "website",
    siteName: "Lucas Lisboa Alves",
    title: "Lucas Lisboa Alves | AI Engineer",
    description,
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucas Lisboa Alves | AI Engineer",
    description,
  },
};

/** Colors the browser chrome on phones to match the page. */
export const viewport: Viewport = {
  themeColor: "#FDFDFD",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${headline.variable}`}>
      <body className="font-sans">
        <MotionProvider>
          <SmoothScroll />
          {/*
            Oversized ghost words and the hero name intentionally bleed past
            the screen edges. overflow-x: clip on this wrapper (not on body,
            where browsers turn it into overflow: hidden on the viewport)
            stops sideways scrolling without breaking position: sticky.
          */}
          <ViewTransitions>
            <div className="relative overflow-x-clip">{children}</div>
          </ViewTransitions>
        </MotionProvider>
      </body>
    </html>
  );
}
