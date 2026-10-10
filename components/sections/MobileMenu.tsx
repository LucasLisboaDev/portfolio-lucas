"use client";

import { AnimatePresence, m } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getLenis } from "@/components/motion/SmoothScroll";
import StatusPill from "@/components/ui/StatusPill";
import PillButton from "@/components/ui/PillButton";
import { Close, Menu } from "@/components/ui/icons";
import { duration, ease, stagger } from "@/lib/motion";

export type NavLink = { href: string; label: string; count?: string };

/**
 * Full-screen menu for phones and small tablets.
 *
 * Accessibility: the toggle reports aria-expanded, Escape closes the menu,
 * focus moves into the menu when it opens and back to the toggle when it
 * closes, and the page behind stops scrolling while it is open.
 */
export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    getLenis()?.stop();
    firstLinkRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) close(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      root.style.overflow = previousOverflow;
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors duration-fast hover:bg-ink hover:text-canvas md:hidden"
      >
        {open ? <Close size={18} /> : <Menu size={18} />}
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast, ease: ease.reveal }}
            className="fixed inset-x-0 bottom-0 top-[76px] z-40 flex flex-col justify-between overflow-y-auto bg-canvas px-gutter-sm pb-10 pt-8 md:hidden"
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {links.map((link, i) => (
                  <m.li
                    key={link.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: duration.base, ease: ease.reveal, delay: 0.05 + i * stagger.list }}
                    className="border-b border-line"
                  >
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      onClick={() => close(false)}
                      className="text-display stretch-normal flex items-baseline justify-between py-5 text-[2.5rem]"
                    >
                      {link.label}
                      {link.count && (
                        <span className="font-sans text-sm font-medium normal-case tracking-normal text-muted">{link.count}</span>
                      )}
                    </a>
                  </m.li>
                ))}
              </ul>
            </nav>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: duration.base, delay: 0.35 }}
              className="mt-10 flex flex-col gap-4"
            >
              <StatusPill className="self-start" />
              <PillButton href="#contact" block arrow onClick={() => close(false)}>
                Let&apos;s Talk
              </PillButton>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
