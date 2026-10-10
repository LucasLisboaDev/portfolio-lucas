"use client";

import {
  m,
  useMotionValue,
  useReducedMotionConfig,
  useSpring,
} from "motion/react";
import { useEffect, useState, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/cn";
import { duration, ease, spring } from "@/lib/motion";

/**
 * True when the floating cursor preview can run: the device has a real
 * hovering pointer (mouse or trackpad) and the visitor has not asked for
 * reduced motion. Sections use the same hook to decide when to show their
 * inline fallback (for example a logo inside the row on phones).
 */
export function useCursorPreviewEnabled(): boolean {
  const reduceMotion = useReducedMotionConfig();
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return finePointer && !reduceMotion;
}

type CursorPreviewProps = {
  /** The element the pointer moves over. It must be position: relative. */
  containerRef: RefObject<HTMLElement>;
  /** Whether a row is currently hovered (shows or hides the card). */
  visible: boolean;
  children: ReactNode;
  className?: string;
  /** Card position relative to the pointer, in px. */
  offset?: { x: number; y: number };
  /** Tilt in degrees. */
  rotate?: number;
};

/**
 * A small floating card that follows the pointer on a spring inside its
 * container, used by Capabilities and Experience.
 *
 * It only renders when useCursorPreviewEnabled() is true. Phones and
 * reduced-motion visitors get the inline fallback each section provides
 * instead, so nothing is lost. Purely decorative, so it is hidden from
 * screen readers.
 */
export default function CursorPreview({
  containerRef,
  visible,
  children,
  className,
  offset = { x: 36, y: -110 },
  rotate = -6,
}: CursorPreviewProps) {
  const enabled = useCursorPreviewEnabled();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring.cursor);
  const sy = useSpring(y, spring.cursor);

  useEffect(() => {
    const el = containerRef.current;
    if (!enabled || !el) return;

    const toLocal = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { px: e.clientX - r.left + offset.x, py: e.clientY - r.top + offset.y };
    };

    // On entry, jump straight to the pointer so the card does not fly in
    // from the container's corner.
    const onEnter = (e: PointerEvent) => {
      const { px, py } = toLocal(e);
      x.set(px);
      y.set(py);
      sx.jump(px);
      sy.jump(py);
    };
    const onMove = (e: PointerEvent) => {
      const { px, py } = toLocal(e);
      x.set(px);
      y.set(py);
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
    };
  }, [enabled, containerRef, offset.x, offset.y, x, y, sx, sy]);

  if (!enabled) return null;

  return (
    <m.div
      aria-hidden="true"
      data-testid="cursor-preview"
      className={cn("pointer-events-none absolute left-0 top-0 z-20", className)}
      style={{ x: sx, y: sy, rotate }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.85 }}
      transition={{ duration: duration.fast, ease: ease.reveal }}
    >
      {children}
    </m.div>
  );
}
