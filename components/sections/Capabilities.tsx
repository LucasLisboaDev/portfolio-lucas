"use client";

import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { useRef, useState } from "react";
import CursorPreview, { useCursorPreviewEnabled } from "@/components/motion/CursorPreview";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowUpRight } from "@/components/ui/icons";
import { capabilities, type Capability } from "@/data/capabilities";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { pad2 } from "@/lib/projects";

/** The small tilted card shown in the cursor preview, or inline as a fallback. */
function PreviewCard({ preview, index, className }: { preview: Capability["preview"]; index: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-[150px] w-[220px] flex-col justify-between rounded-card bg-canvas p-5 text-ink shadow-float",
        className,
      )}
    >
      <span className="text-xs tracking-[0.06em] text-muted">
        /{pad2(index + 1)} · {preview.label}
      </span>
      <span className="text-display stretch-normal text-2xl">
        {preview.title.split("\n").map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </span>
    </div>
  );
}

/**
 * Capabilities: accordion rows that turn ink when open or hovered.
 *
 * - Each row header is a real button inside a heading, with aria-expanded and
 *   aria-controls, so it works with the keyboard and screen readers.
 * - With a mouse or trackpad, a tilted card naming related work follows the
 *   pointer. On touch screens and with reduced motion, that card appears
 *   inside the open row instead.
 * - Hover styles only apply on devices that can hover (Tailwind's
 *   hoverOnlyWhenSupported), so a tap never leaves a row stuck dark.
 */
export default function Capabilities() {
  const [open, setOpen] = useState<number | null>(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previewEnabled = useCursorPreviewEnabled();

  const previewIndex = previewEnabled ? hovered : null;

  return (
    <section id="capabilities" aria-labelledby="cap-h" className="pb-section-sm pt-12 md:pb-section md:pt-16">
      <div className="mx-auto max-w-content px-gutter-sm md:px-gutter">
        <SectionHeading label="Capabilities" ghost="Build" meta="What I build" id="cap-h" />

        <div ref={listRef} onPointerLeave={() => setHovered(null)} className="relative z-10 mt-12">
          <Stagger as="ul" className="border-t border-line" amount={0.15}>
            {capabilities.map((c, i) => {
              const isOpen = open === i;
              const dark = isOpen || previewIndex === i;
              return (
                <StaggerItem
                  as="li"
                  key={c.title}
                  className={cn(
                    "border-b border-line transition-colors duration-[450ms] ease-reveal",
                    dark ? "bg-ink text-canvas" : "bg-transparent text-ink",
                  )}
                >
                  <div onPointerEnter={() => setHovered(i)}>
                    <h3>
                      <button
                        type="button"
                        id={`cap-btn-${i}`}
                        aria-expanded={isOpen}
                        aria-controls={`cap-panel-${i}`}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="flex min-h-11 w-full items-center gap-5 px-4 py-6 text-left md:gap-7 md:px-8 md:py-[30px]"
                      >
                        <span className="w-7 shrink-0 text-sm opacity-55">{pad2(i + 1)}</span>
                        <span className="text-display stretch-normal flex-1 text-[clamp(1.375rem,3vw,2.4rem)]">
                          {c.title}
                        </span>
                        <ArrowUpRight
                          size={26}
                          strokeWidth={1.6}
                          className={cn(
                            "shrink-0 transition-transform duration-[450ms] ease-reveal",
                            isOpen && "rotate-90",
                          )}
                        />
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <m.div
                          key="panel"
                          id={`cap-panel-${i}`}
                          role="region"
                          aria-labelledby={`cap-btn-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: ease.reveal }}
                          className="overflow-hidden"
                        >
                          <div
                            className={cn(
                              "grid items-center gap-8 px-4 pb-8 md:px-8 md:pb-9 md:pl-[88px]",
                              !previewEnabled && "md:grid-cols-[minmax(0,1fr)_260px]",
                            )}
                          >
                            <div className="flex flex-col gap-5">
                              <p className="max-w-[560px] text-base leading-[1.65] text-canvas/80 md:text-[17px]">
                                {c.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="mr-1 text-meta text-ink-muted">Related work</span>
                                {c.related.map((r) => (
                                  <Link
                                    key={r.label}
                                    href={r.href}
                                    className="inline-flex min-h-9 items-center rounded-full border border-ink-line px-3 py-1.5 text-meta font-medium transition-colors duration-fast hover:bg-canvas hover:text-ink"
                                  >
                                    {r.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                            {!previewEnabled && (
                              <PreviewCard preview={c.preview} index={i} className="-rotate-[4deg] justify-self-start md:justify-self-end" />
                            )}
                          </div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
          <CursorPreview containerRef={listRef} visible={previewIndex !== null}>
            {previewIndex !== null && (
              <PreviewCard preview={capabilities[previewIndex].preview} index={previewIndex} />
            )}
          </CursorPreview>
        </div>
      </div>
    </section>
  );
}
