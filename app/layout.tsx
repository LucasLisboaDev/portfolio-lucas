import "./globals.css";
import localFont from "next/font/local";
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
 * - The hero only needs this one tiny file, instead of the 88 KB variable
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
 * Display: the full variable Archivo (weight 100–900, width 62–125%), for
 * everything that is not the 800/112% headline style: section labels at
 * normal width, card titles at 700, and so on. Mostly below the fold, so it
 * is not preloaded; it loads as soon as the page first uses it.
 */
const display = localFont({
  src: "./fonts/Archivo-Variable-latin.woff2",
  variable: "--font-display",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  fallback: ["Arial", "system-ui", "sans-serif"],
  preload: false,
});

/** Body and UI: Inter variable, weight 100–900. */
const sans = localFont({
  src: "./fonts/Inter-Variable-latin.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
});

export const metadata = {
  title: "Lucas Lisboa Alves | AI Engineer",
  description:
    "AI Engineer with full-stack experience building production applications across web, mobile, data, and intelligent systems, from architecture to cloud deployment.",
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
