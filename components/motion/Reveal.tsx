"use client";

import { m } from "motion/react";
import { useState, type ReactNode } from "react";
import { distance, duration, ease, viewport } from "@/lib/motion";

const tags = {
  div: m.div,
  section: m.section,
  header: m.header,
  article: m.article,
  li: m.li,
  p: m.p,
  span: m.span,
  h2: m.h2,
  h3: m.h3,
};

type RevealProps = {
  children: ReactNode;
  /** Element to render. Defaults to div. */
  as?: keyof typeof tags;
  className?: string;
  /** Extra delay in seconds before this element animates. */
  delay?: number;
  /** Fade-up distance in px. Defaults to the 24px reveal token. */
  y?: number;
  /** Fraction of the element that must be visible to trigger (0 to 1). */
  amount?: number;
  id?: string;
};

/**
 * Fades its content up into place the first time it scrolls into view.
 *
 * Do not wrap the hero headline or other above-the-fold LCP content in Reveal:
 * it starts at opacity 0, which would delay the first meaningful paint.
 *
 * Keyboard safety: if focus lands inside before the element has scrolled far
 * enough into view (a Tab press only scrolls the focused control to the edge
 * of the screen), it reveals immediately, so a focus ring is never drawn on
 * an invisible control.
 */
export default function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  y = distance.reveal,
  amount = viewport.amount,
  id,
}: RevealProps) {
  const Tag = tags[as] as typeof m.div;
  const [focused, setFocused] = useState(false);
  return (
    <Tag
      id={id}
      className={className}
      onFocusCapture={focused ? undefined : () => setFocused(true)}
      initial={{ opacity: 0, y }}
      animate={focused ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: viewport.once, amount }}
      transition={{ duration: duration.base, ease: ease.reveal, delay }}
    >
      {children}
    </Tag>
  );
}
