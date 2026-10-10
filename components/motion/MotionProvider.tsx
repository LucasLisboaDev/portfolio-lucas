"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";
import { revealTransition } from "@/lib/motion";

/**
 * Wraps the app with Motion's configuration.
 *
 * LazyMotion + domAnimation loads only the animation features the site uses
 * (animations, variants, hover/tap/focus and in-view gestures) instead of the
 * full library, which keeps the JavaScript bundle small. `strict` makes any
 * accidental use of the heavier `motion.*` components throw in development,
 * so everything goes through the lightweight `m.*` components.
 *
 * reducedMotion="user" follows the visitor's system setting: when reduced
 * motion is on, Motion skips transform animations (movement, scale) and keeps
 * only opacity, so reveals become simple fades.
 *
 * Phase 3 switches the features to domMax, which adds the layout animations
 * needed for shared-element page transitions.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={revealTransition}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
