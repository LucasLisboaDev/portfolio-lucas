"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/** Height of the sticky navbar, so anchor jumps land below it. */
const NAV_OFFSET = -88;

/**
 * Inertia-style smooth scrolling for mouse wheels and trackpads (Lenis).
 *
 * - Touch devices keep native scrolling (Lenis leaves touch alone by default),
 *   so phones feel exactly like phones.
 * - Turned off entirely when the visitor prefers reduced motion, and turned
 *   on or off live if they change that setting while the page is open.
 * - Handles in-page anchor links (#work, #contact) with an offset for the navbar.
 *
 * Lenis drives the real window scroll position, so native features such as
 * position: sticky, scroll restoration and Motion's useScroll keep working.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const start = () => {
      if (lenis || reduce.matches) return;
      lenis = new Lenis({
        autoRaf: true,
        duration: 1.1,
        // Exponential ease out: quick response, long gentle settle.
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        anchors: { offset: NAV_OFFSET },
      });
    };

    const stop = () => {
      lenis?.destroy();
      lenis = null;
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
