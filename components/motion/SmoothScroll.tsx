"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let instance: Lenis | null = null;

/**
 * The running Lenis instance, or null when smooth scrolling is off (touch
 * devices still have an instance but Lenis ignores touch; reduced motion has
 * none). Used by overlays such as the mobile menu to pause page scrolling.
 */
export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Inertia-style smooth scrolling for mouse wheels and trackpads (Lenis).
 *
 * - Touch devices keep native scrolling (Lenis leaves touch alone by default),
 *   so phones feel exactly like phones.
 * - Turned off entirely when the visitor prefers reduced motion, and turned
 *   on or off live if they change that setting while the page is open.
 * - Handles in-page anchor links (#work, #contact). Lenis honors each
 *   target's CSS scroll-margin-top, which globals.css sets for every section
 *   so jumps land just below the sticky navbar, with or without Lenis.
 *
 * Lenis drives the real window scroll position, so native features such as
 * position: sticky, scroll restoration and Motion's useScroll keep working.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const start = () => {
      if (instance || reduce.matches) return;
      instance = new Lenis({
        autoRaf: true,
        duration: 1.1,
        // Exponential ease out: quick response, long gentle settle.
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        anchors: true,
      });
    };

    const stop = () => {
      instance?.destroy();
      instance = null;
    };

    const onChange = () => (reduce.matches ? stop() : start());

    start();
    reduce.addEventListener("change", onChange);
    return () => {
      reduce.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return null;
}
