/**
 * Motion tokens for the redesign. Every animation in the site pulls its timing
 * from here so the whole page moves with one consistent language.
 * CSS-only transitions use the matching variables in app/globals.css.
 *
 * See docs/ANIMATED_PORTFOLIO_PLAN.md, section 5.
 */

/** Cubic bezier curves, in the array form Motion expects. */
export const ease = {
  /** Every reveal and hover: fast start, long soft landing. */
  reveal: [0.22, 1, 0.36, 1] as const,
  /** Page transitions and the section background inversion. */
  page: [0.65, 0, 0.35, 1] as const,
};

/** Durations in seconds (Motion's unit). */
export const duration = {
  fast: 0.25,
  base: 0.6,
  slow: 0.9,
  /** Hero intro must finish within this budget. */
  heroBudget: 1.6,
} as const;

/** Distances in pixels. */
export const distance = {
  /** Fade-up offset for scroll reveals. */
  reveal: 24,
  /** Hero portrait rise. */
  portraitRise: 40,
  /** Pill arrow nudge on hover. */
  arrowNudge: 3,
} as const;

/** Stagger between siblings, in seconds. */
export const stagger = {
  list: 0.08,
  letters: 0.03,
} as const;

/** Spring used by the cursor-following previews. */
export const spring = {
  cursor: { type: "spring", stiffness: 300, damping: 30, mass: 0.6 } as const,
} as const;

/** Scroll-reveal trigger: play once, when 20% of the element is visible. */
export const viewport = {
  once: true,
  amount: 0.2,
} as const;

/** Ready-made fade-up variants for Motion components. */
export const fadeUp = {
  hidden: { opacity: 0, y: distance.reveal },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.reveal },
  },
} as const;
