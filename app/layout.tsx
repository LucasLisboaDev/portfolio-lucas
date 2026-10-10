import "./globals.css";
import localFont from "next/font/local";
import ElevenLabsConvaiWidget from "@/components/ElevenLabsConvaiWidget";
import MotionProvider from "@/components/motion/MotionProvider";
import SmoothScroll from "@/components/motion/SmoothScroll";

/**
 * Fonts are self-hosted from app/fonts (SIL Open Font License, see
 * app/fonts/OFL-LICENSES.txt). Loading them locally keeps builds deterministic:
 * no request to Google Fonts at build time, so CI, preview deployments and
 * offline builds all behave the same.
 *
 * - Archivo (display): variable weight 100–900 and width 62–125%. The redesign
 *   uses it expanded (font-stretch 112%) and in all caps for headlines.
 * - Inter (body/UI): variable weight 100–900.
 */
const display = localFont({
  src: "./fonts/Archivo-Variable-latin.woff2",
  variable: "--font-display",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  fallback: ["Arial Black", "Arial", "system-ui", "sans-serif"],
  // Not preloaded yet: no above-the-fold text uses Archivo until the hero is
  // rebuilt in Phase 2. Preloading an unused 88 KB font competed with the hero
  // text for bandwidth and pushed LCP from 2.84s to 3.01s. Turn this back on
  // (remove the line) when the new hero ships.
  preload: false,
});

const sans = localFont({
  src: "./fonts/Inter-Variable-latin.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
});

export const metadata = {
  title: "Lucas Lisboa Alves | Software / AI Engineer",
  description:
    "Software / AI Engineer with full-stack experience building production applications across web, mobile, data, and intelligent systems — from architecture to cloud deployment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">
        <MotionProvider>
          <SmoothScroll />
          {/*
            Oversized ghost words and the hero name intentionally bleed past
            the screen edges. overflow-x: clip on this wrapper (not on body,
            where browsers turn it into overflow: hidden on the viewport)
            stops sideways scrolling without breaking position: sticky.
          */}
          <div className="relative overflow-x-clip">{children}</div>
        </MotionProvider>
        <ElevenLabsConvaiWidget />
      </body>
    </html>
  );
}
