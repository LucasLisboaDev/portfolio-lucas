"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type InteractiveTiltAvatarProps = {
  src?: string;
  alt?: string;
  className?: string;
  /** Max tilt in degrees. */
  maxTilt?: number;
  /** Extra perspective depth for the glare/parallax feel. */
  scale?: number;
};

/**
 * 2.5D interactive portrait — the image gently tilts toward the cursor
 * and settles back when the pointer leaves. No 3D model required.
 */
export default function InteractiveTiltAvatar({
  src = "/lucas-professional2-cutout.png",
  alt = "Lucas Lisboa Alves",
  className = "",
  maxTilt = 12,
  scale = 1.02,
}: InteractiveTiltAvatarProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const hoveringRef = useRef(false);

  const [transform, setTransform] = useState(
    "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)"
  );
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const animate = useCallback(() => {
    const cur = currentRef.current;
    const tgt = targetRef.current;
    const ease = hoveringRef.current ? 0.12 : 0.08;

    cur.x += (tgt.x - cur.x) * ease;
    cur.y += (tgt.y - cur.y) * ease;

    const rx = cur.y;
    const ry = cur.x;
    const liveScale = hoveringRef.current ? scale : 1;

    setTransform(
      `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${liveScale})`
    );

    const glareX = 50 + (ry / maxTilt) * 35;
    const glareY = 50 + (rx / maxTilt) * 35;
    setGlare({
      x: glareX,
      y: glareY,
      opacity: hoveringRef.current ? 0.28 : 0,
    });

    const settled =
      Math.abs(tgt.x - cur.x) < 0.05 && Math.abs(tgt.y - cur.y) < 0.05;

    if (!settled || hoveringRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      rafRef.current = null;
      cur.x = 0;
      cur.y = 0;
      setTransform("perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)");
      setGlare((g) => ({ ...g, opacity: 0 }));
    }
  }, [maxTilt, scale]);

  const startLoop = useCallback(() => {
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const el = frameRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    // Cursor left → rotate toward left (negative Y), top → tip back (positive X)
    targetRef.current = {
      x: (px - 0.5) * 2 * maxTilt,
      y: (0.5 - py) * 2 * maxTilt,
    };
    hoveringRef.current = true;
    startLoop();
  };

  const onEnter = () => {
    if (reducedMotion) return;
    hoveringRef.current = true;
    startLoop();
  };

  const onLeave = () => {
    hoveringRef.current = false;
    targetRef.current = { x: 0, y: 0 };
    startLoop();
  };

  return (
    <div
      ref={frameRef}
      className={`relative w-full max-w-md mx-auto [perspective:900px] ${className}`}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={{ touchAction: "pan-y" }}
    >
      <div
        className="relative aspect-[4/5] will-change-transform"
        style={{
          transform,
          transformStyle: "preserve-3d",
          transition: reducedMotion ? "none" : undefined,
        }}
      >
        {/* Soft brand glow behind the cutout */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[12%] rounded-full bg-gradient-to-br from-slate-700/35 via-slate-400/25 to-slate-300/20 blur-3xl"
          style={{ transform: "translateZ(-50px)" }}
        />

        <div className="relative h-full w-full drop-shadow-2xl">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 90vw, 420px"
            className="object-contain object-bottom select-none"
            draggable={false}
          />

          {/* Specular glare that tracks the cursor */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light transition-opacity duration-300"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.12) 32%, transparent 60%)`,
              maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
            }}
          />
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-medium text-gray-800">
        Move your mouse over the portrait
      </p>
    </div>
  );
}
