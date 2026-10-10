import Image from "next/image";
import type { CSSProperties } from "react";
import PillButton from "@/components/ui/PillButton";
import StatusPill from "@/components/ui/StatusPill";
import { ArrowDown, ArrowUpRight } from "@/components/ui/icons";
import ResumeAccess from "@/components/ResumeAccess";
import { CONTACT_EMAIL } from "@/data/site";

const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/in/lucaslisboadev", external: true },
  { label: "GitHub", href: "https://github.com/LucasLisboaDev", external: true },
  { label: "Email", href: `mailto:${CONTACT_EMAIL}`, external: false },
];

/** One word of the hero name, split into letters that slide up from a mask. */
function MaskedWord({ word, start, outline = false }: { word: string; start: number; outline?: boolean }) {
  return (
    <span className="hero-mask">
      <span className={outline ? "text-outline" : undefined}>
        {Array.from(word).map((ch, i) => (
          <span
            key={i}
            className="hero-letter"
            style={{ "--d": `${start}s`, "--i": i } as CSSProperties}
          >
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Inline style that sets the entrance delay for a .hero-in element. */
const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/**
 * Homepage hero, in the reference layout: the oversized name with an outlined
 * first name and solid last name, the grayscale portrait rising in front of
 * it, the role and introduction on the left and links on the right.
 *
 * A server component with a CSS-only intro (see .hero-* in globals.css), so
 * the hero ships no JavaScript of its own and starts animating on first paint.
 * The real name is in the h1 for screen readers; the animated letters are
 * hidden from them.
 */
export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-name" className="relative border-b border-line pt-7 md:pt-[88px]">
      <div className="mx-auto max-w-content px-gutter-sm md:px-gutter">
        <div className="hero-in mb-5 md:hidden" style={delay(0)}>
          <StatusPill />
        </div>

        <h1
          id="hero-name"
          className="text-display relative z-10 text-[19.5vw] md:whitespace-nowrap md:text-center md:text-hero"
        >
          <span className="sr-only">Lucas Lisboa</span>
          <span aria-hidden="true" className="flex flex-col md:block">
            <MaskedWord word="Lucas" start={0.15} outline />
            <span className="hidden md:inline"> </span>
            <MaskedWord word="Lisboa" start={0.35} />
          </span>
        </h1>

        {/* Equal side columns keep the portrait centered under the name; the
            32px gap leaves the left column just wide enough for both buttons. */}
        <div className="relative z-20 flex flex-col gap-6 md:-mt-16 md:grid md:grid-cols-[minmax(0,1fr)_clamp(300px,34vw,440px)_minmax(0,1fr)] md:items-end md:gap-8">
          {/* Portrait: first on phones, centered between the columns on desktop */}
          <div className="hero-rise -mx-gutter-sm -mt-9 flex h-[420px] justify-center overflow-hidden md:order-2 md:mx-0 md:mt-0 md:h-auto md:overflow-visible">
            <Image
              src="/lucas-professional2-cutout.png"
              alt="Portrait of Lucas Lisboa"
              width={1580}
              height={1925}
              priority
              sizes="(min-width: 768px) 440px, 345px"
              className="h-full w-auto grayscale transition-[filter] duration-slow ease-reveal hover:grayscale-0 md:h-auto md:w-full"
            />
          </div>

          <div className="flex flex-col gap-5 md:order-1 md:pb-[72px]">
            <h2 className="hero-in font-headline text-2xl tracking-[-0.02em] md:text-[28px]" style={delay(0.8)}>
              AI Engineer
            </h2>
            <p className="hero-in max-w-[380px] text-[15px] leading-[1.65] text-muted md:text-base" style={delay(0.88)}>
              I design, build, and ship production software across web, mobile, data, and intelligent systems,
              from architecture and backend engineering to AI integration and cloud deployment.
            </p>
            <div className="hero-in flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={delay(0.96)}>
              <PillButton href="#contact" arrow className="w-full sm:w-auto">
                Let&apos;s Collaborate
              </PillButton>
              <ResumeAccess className="w-full sm:w-auto" block />
            </div>
          </div>

          <div
            className="hero-in flex flex-col gap-7 pb-10 md:order-3 md:items-end md:pb-[72px] md:text-right"
            style={delay(0.88)}
          >
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[15px] font-medium md:flex-col md:gap-3.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group inline-flex items-center gap-2 text-ink transition-colors duration-fast hover:text-accent"
                  >
                    {s.label}
                    <ArrowUpRight
                      size={14}
                      className="transition-transform duration-fast ease-reveal group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
                    />
                    {s.external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#maya"
              className="hidden items-center gap-2.5 text-xs uppercase tracking-[0.12em] text-muted transition-colors duration-fast hover:text-ink md:inline-flex"
            >
              Scroll
              <ArrowDown size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
