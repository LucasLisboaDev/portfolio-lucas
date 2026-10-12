"use client";

import { useReducedMotionConfig } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Reduced motion preference that is safe to use in rendered markup.
 *
 * Motion's hook reads the preference during the very first client render,
 * but the server always renders as if motion were allowed. Using it directly
 * in an attribute makes the two renders disagree, and React keeps the
 * server's version during hydration (the attribute silently never updates).
 * This hook returns false until the component has mounted, then the real
 * value, so the change arrives as a normal re-render.
 */
export function useMountedReducedMotion(): boolean {
  const reduce = useReducedMotionConfig();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && Boolean(reduce);
}
