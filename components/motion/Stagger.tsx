"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, staggerParent, viewport } from "@/lib/motion";

const tags = {
  div: m.div,
  ul: m.ul,
  ol: m.ol,
  li: m.li,
  section: m.section,
  article: m.article,
};

type StaggerProps = {
  children: ReactNode;
  as?: keyof typeof tags;
  className?: string;
  /** Delay in seconds before the first child animates. */
  delay?: number;
  /** Fraction of the container that must be visible to trigger. */
  amount?: number;
  role?: string;
  "aria-label"?: string;
};

/**
 * Container that reveals its StaggerItem children one after another
 * (80ms apart) when it scrolls into view. Children that are not StaggerItem
 * render normally.
 */
export function Stagger({
  children,
  as = "div",
  className,
  delay = 0,
  amount = viewport.amount,
  ...rest
}: StaggerProps) {
  const Tag = tags[as] as typeof m.div;
  return (
    <Tag
      className={className}
      variants={staggerParent(delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewport.once, amount }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  as?: keyof typeof tags;
  className?: string;
};

/** One item inside a Stagger container. Fades up 24px when its turn comes. */
export function StaggerItem({ children, as = "div", className }: StaggerItemProps) {
  const Tag = tags[as] as typeof m.div;
  return (
    <Tag className={className} variants={fadeUp}>
      {children}
    </Tag>
  );
}
