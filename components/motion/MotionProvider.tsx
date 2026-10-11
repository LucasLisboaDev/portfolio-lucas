"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { revealTransition } from "@/lib/motion";

/**
 * Wraps the app with Motion's configuration.
 *
 * LazyMotion loads only the feature set the site uses, and every component
 * uses the lightweight `m.*` components (`strict` makes accidental use of the
 * heavier `motion.*` components throw in development).
 *
 * Phase 3 moved from domAnimation to domMax, which adds layout animations:
 * the Selected Work grid uses them so cards glide into place when a filter
 * changes. (Page transitions use the browser's View Transitions API instead,
 * see ViewTransitions.tsx.)
 *
 * The features load asynchronously (a separate chunk fetched right after
 * hydration), which keeps their parsing and evaluation out of the critical
 * startup work. Elements simply hold their initial state for those few
 * milliseconds; nothing above the fold depends on Motion (the hero intro is
 * pure CSS).
 *
 * reducedMotion="user" follows the visitor's system setting: when reduced
 * motion is on, Motion skips transform and layout animations and keeps only
 * opacity, so everything becomes a simple fade.
 */
const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={revealTransition}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
