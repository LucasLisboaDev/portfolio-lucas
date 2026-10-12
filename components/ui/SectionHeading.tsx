"use client";

import {
  m,
  useMotionValue,
  useReducedMotionConfig,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { distance } from "@/lib/motion";
import Reveal from "@/components/motion/Reveal";

/** "invert" follows an .invertible parent section (light or dark as it flips). */
type Tone = "light" | "surface" | "dark" | "invert";

type SectionHeadingProps = {
  /** Label shown after the slash, for example "Selected Work". */
  label: string;
  /** Large faded watermark word behind the label, for example "Projects". */
  ghost?: string;
  /** Right-hand detail such as "06 projects" or a link. */
  meta?: ReactNode;
  /** Background the heading sits on, which sets the ghost and text colors. */
  tone?: Tone;
  /** id for the h2, so the section can use aria-labelledby. */
  id?: string;
  className?: string;
};

const ghostColor: Record<Tone, string> = {
  light: "text-ghost",
  surface: "text-line",
  dark: "text-ink-surface",
  invert: "text-inv-ghost transition-colors duration-base ease-page",
};

const metaColor: Record<Tone, string> = {
  light: "text-muted",
  surface: "text-muted",
  dark: "text-ink-muted",
  invert: "text-inv-muted transition-colors duration-base ease-page",
};

/**
 * Section title in the reference style: a slash-prefixed label in display
 * type, an optional oversized ghost word behind it that drifts slightly slower
 * than the page (parallax), and optional meta on the right.
 *
 * The ghost word is decorative and hidden from screen readers. Its drift is
 * switched off when the visitor prefers reduced motion.
 */
export default function SectionHeading({
  label,
  ghost,
  meta,
  tone = "light",
  id,
  className,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotionConfig();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(
    scrollYProgress,
    [0, 1],
    [distance.ghostDrift, -distance.ghostDrift],
  );
  // Always bind a motion value: swapping to a fixed zero (rather than removing
  // the style) resets any offset applied before the reduced motion setting
  // was known on first render.
  const still = useMotionValue(0);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {ghost && (
        <m.span
          aria-hidden="true"
          className={cn(
            "text-display text-watermark pointer-events-none absolute -top-6 left-0 select-none whitespace-nowrap md:-top-16 md:left-6",
            ghostColor[tone],
          )}
          style={{ y: reduceMotion ? still : drift }}
        >
          {ghost}
        </m.span>
      )}
      <div className="relative z-10 flex flex-col items-start gap-3 pt-10 md:flex-row md:items-end md:justify-between md:gap-6">
        <Reveal as="h2" id={id} className="text-display stretch-normal text-section-sm md:text-section">
          /{label}
        </Reveal>
        {meta && (
          <Reveal
            delay={0.08}
            className={cn("text-sm", metaColor[tone])}
          >
            {meta}
          </Reveal>
        )}
      </div>
    </div>
  );
}
