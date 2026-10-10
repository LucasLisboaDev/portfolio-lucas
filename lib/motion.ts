import type { Transition, Variants } from "motion/react";

/**
 * Motion tokens for the redesign. Every animation in the site pulls its timing
 * from here so the whole page moves with one consistent language.
 * CSS-only transitions use the matching variables in app/globals.css.
 *
 * See docs/ANIMATED_PORTFOLIO_PLAN.md, section 5.
 */

type Bezier = [number, number, number, number];

/** Cubic bezier curves, in the array form Motion expects. */
export const ease: { reveal: Bezier; page: Bezier } = {
  /** Every reveal and hover: fast start, long soft landing. */
  reveal: [0.22, 1, 0.36, 1],
  /** Page transitions and the section background inversion. */
  page: [0.65, 0, 0.35, 1],
};

/** Durations in seconds (Motion's unit). */
export const duration = {
  fast: 0.25,
  base: 0.6,
  slow: 0.9,
  /** Hero intro must finish within this budget. */
  heroBudget: 1.6,
};

/** Distances in pixels. */
export const distance = {
  /** Fade-up offset for scroll reveals. */
  reveal: 24,
  /** Hero portrait rise. */
  portraitRise: 40,
  /** Pill arrow nudge on hover. */
  arrowNudge: 3,
  /** How far ghost words drift against the scroll (parallax), in px each way. */
  ghostDrift: 40,
};

/** Stagger between siblings, in seconds. */
export const stagger = {
  list: 0.08,
  letters: 0.03,
};

/** Spring used by the cursor-following previews. */
export const spring = {
  cursor: { stiffness: 300, damping: 30, mass: 0.6 },
};

/** Scroll-reveal trigger: play once, when 20% of the element is visible. */
export const viewport = {
  once: true,
  amount: 0.2,
};

/** Default transition for reveals. */
export const revealTransition: Transition = {
  duration: duration.base,
  ease: ease.reveal,
};

/** Fade-up variants, used by Reveal and StaggerItem. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: distance.reveal },
  visible: { opacity: 1, y: 0, transition: revealTransition },
};

/** Parent variants that stagger their children's fade-up. */
export const staggerParent = (delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger.list, delayChildren },
  },
});
