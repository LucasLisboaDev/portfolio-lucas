"use client";

import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import { testimonials } from "@/data/testimonials";
import { duration, ease } from "@/lib/motion";
import { pad2 } from "@/lib/projects";

/**
 * Kind Words: one large editorial testimonial at a time, quoted word for word
 * from data/testimonials.ts.
 *
 * - Previous and next are real buttons with labels; there is no autoplay, so
 *   nothing moves unless the visitor asks for it.
 * - The quote area is a polite live region, so screen readers read the new
 *   quote after a button press without interrupting anything else.
 * - Quotes crossfade with a short rise; with reduced motion it is a fade.
 */
export default function KindWords() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  const t = testimonials[index];
  const go = (step: number) => setIndex((i) => (i + step + total) % total);
  const initial = t.name.replace(/^Professor\s+/, "").charAt(0);

  return (
    <section id="kind-words" aria-labelledby="words-h" className="bg-surface py-section-sm md:py-[120px]">
      <div className="mx-auto max-w-content px-gutter-sm md:px-gutter">
        <SectionHeading
          label="Kind Words"
          ghost="Words"
          tone="surface"
          id="words-h"
          meta={
            <span className="tabular-nums">
              {pad2(index + 1)} / {pad2(total)}
            </span>
          }
        />

        <figure className="relative z-10 mt-12 flex flex-col gap-10 md:mt-14">
          <span aria-hidden="true" className="text-display text-outline h-[44px] text-[88px] leading-[0.6] md:h-[60px] md:text-[120px]">
            “
          </span>

          <div aria-live="polite" className="min-h-[220px] md:min-h-[200px]">
            <AnimatePresence mode="wait" initial={false}>
              <m.blockquote
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: duration.base * 0.6, ease: ease.reveal }}
                className="max-w-[1060px] text-lg leading-[1.6] tracking-[-0.01em] md:text-[26px] md:leading-[1.55]"
              >
                {t.quote}
              </m.blockquote>
            </AnimatePresence>
          </div>

          <figcaption className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-7">
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="text-display flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-ink text-lg text-canvas"
              >
                {initial}
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-base font-semibold">{t.name}</span>
                <span className="text-sm text-ink-soft">{t.company}</span>
              </span>
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-ink transition-colors duration-fast hover:bg-ink hover:text-canvas"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-ink transition-colors duration-fast hover:bg-ink hover:text-canvas"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
