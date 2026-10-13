import type { Metadata } from "next";
import Link from "next/link";
import PillButton from "@/components/ui/PillButton";

export const metadata: Metadata = {
  title: "Page not found | Lucas Lisboa",
  robots: { index: false },
};

/**
 * Branded 404. Replaces Next's default page, which had no main landmark and
 * none of the site's styling. Same structure as the rest of the site: a slim
 * header, the big outlined numerals as the display moment, and a single clear
 * way back.
 */
export default function NotFound() {
  return (
    <>
      <header className="border-b border-line">
        <nav
          aria-label="Site"
          className="mx-auto flex h-[76px] max-w-content items-center px-gutter-sm md:px-gutter"
        >
          <Link href="/" className="flex items-center gap-3 text-ink" aria-label="Lucas Lisboa, home">
            <span
              aria-hidden="true"
              className="text-display flex h-[38px] w-[38px] items-center justify-center rounded-full bg-ink text-[12px] tracking-normal text-canvas"
            >
              LL
            </span>
            <span className="text-[15px] font-semibold">Lucas Lisboa</span>
          </Link>
        </nav>
      </header>

      <main
        id="main"
        className="mx-auto flex min-h-[calc(100svh-77px)] max-w-content flex-col justify-center gap-8 px-gutter-sm py-16 md:px-gutter"
      >
        <span className="text-meta text-accent">/Error 404</span>
        <p aria-hidden="true" className="text-display text-outline text-[clamp(7rem,30vw,20rem)] leading-[0.85]">
          404
        </p>
        <h1 className="max-w-[640px] font-display text-[28px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[44px]">
          This page wandered off.
        </h1>
        <p className="max-w-[480px] text-base leading-[1.65] text-ink-soft">
          The link may be old or mistyped. Everything I have built is on the homepage.
        </p>
        <div className="flex flex-wrap gap-3">
          <PillButton href="/" arrow>
            Back to the homepage
          </PillButton>
          <PillButton href="/#work" variant="secondary">
            See selected work
          </PillButton>
        </div>
      </main>
    </>
  );
}
