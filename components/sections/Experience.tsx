"use client";

import Image from "next/image";
import { AnimatePresence, m, useInView } from "motion/react";
import { useRef, useState } from "react";
import CursorPreview, { useCursorPreviewEnabled } from "@/components/motion/CursorPreview";
import { useMountedReducedMotion } from "@/components/motion/useMountedReducedMotion";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowUpRight } from "@/components/ui/icons";
import { formatDates, workExperience, type ExperienceEntry } from "@/data/workExperience";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { pad2 } from "@/lib/projects";

/** Initials for entries without a logo, for example "BB" for BusyBee. */
function monogram(name: string): string {
  // Split on spaces and on camel case, so "BusyBee" gives "BB".
  const words = name.match(/[A-Z][a-z]*|[a-z]+/g) ?? [name];
  return (words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[1][0]).toUpperCase();
}

/** Grayscale logo(s), or a monogram when the entry has none. */
function LogoMark({ entry, size }: { entry: ExperienceEntry; size: "tile" | "card" }) {
  const card = size === "card";
  if (entry.logos.length === 0) {
    return (
      <span className={cn("text-display text-ink", card ? "text-4xl" : "text-sm")}>{monogram(entry.company)}</span>
    );
  }
  return (
    <span className={cn("flex flex-col items-center justify-center", card ? "gap-4" : "gap-1")}>
      {entry.logos.slice(0, card ? 2 : 1).map((src) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={card ? 150 : 40}
          height={card ? 90 : 40}
          sizes={card ? "150px" : "40px"}
          className={cn(
            "h-auto w-auto object-contain grayscale",
            card ? (entry.logos.length > 1 ? "max-h-[40px] max-w-[150px]" : "max-h-[84px] max-w-[150px]") : "max-h-8 max-w-8",
          )}
        />
      ))}
    </span>
  );
}

/**
 * Experience: a section that turns the page dark while it crosses the middle
 * of the screen, then turns it back as it leaves, breaking up the long scroll.
 *
 * - The flip is driven by useInView with a rootMargin that shrinks the
 *   viewport to a single line across its middle. Colors come from the
 *   .invertible CSS variables, so every child flips together.
 * - With reduced motion, the section simply stays dark (no flashing).
 * - Rows are buttons that expand to show the full description and stack.
 * - With a mouse or trackpad, the company logo follows the pointer on a
 *   spring; on touch screens and with reduced motion it sits inside the row.
 */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useMountedReducedMotion();
  const crossingMiddle = useInView(sectionRef, { margin: "-50% 0px -50% 0px" });
  const inverted = reduceMotion ? true : crossingMiddle;

  const previewEnabled = useCursorPreviewEnabled();
  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const previewEntry = previewEnabled && hovered !== null ? workExperience[hovered] : null;

  const roles = workExperience.filter((e) => e.kind === "role").length;
  const builds = workExperience.length - roles;

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-labelledby="exp-h"
      data-inverted={inverted}
      className="invertible py-section-sm md:py-section"
    >
      <div className="mx-auto max-w-content px-gutter-sm md:px-gutter">
        <SectionHeading
          label="Experience"
          ghost="Experience"
          tone="invert"
          id="exp-h"
          meta={`${pad2(roles)} roles · ${pad2(builds)} ${builds === 1 ? "build" : "builds"}`}
        />

        <div ref={listRef} onPointerLeave={() => setHovered(null)} className="relative z-10 mt-12">
          <Stagger as="ul" className="border-t border-inv-line transition-colors duration-base ease-page" amount={0.1}>
            {workExperience.map((entry, i) => {
              const isOpen = open === i;
              const dates = formatDates(entry);
              return (
                <StaggerItem
                  as="li"
                  key={entry.company}
                  className="border-b border-inv-line transition-colors duration-base ease-page"
                >
                  <div onPointerEnter={() => setHovered(i)}>
                    <h3>
                      <button
                        type="button"
                        id={`exp-btn-${i}`}
                        aria-expanded={isOpen}
                        aria-controls={`exp-panel-${i}`}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="group flex min-h-11 w-full items-center gap-4 px-1 py-6 text-left md:gap-6 md:px-2 md:py-[30px]"
                      >
                        {!previewEnabled && (
                          <span
                            aria-hidden="true"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-canvas p-2 ring-1 ring-inv-line"
                          >
                            <LogoMark entry={entry} size="tile" />
                          </span>
                        )}
                        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <span className="font-display text-xl font-bold tracking-[-0.01em] transition-[transform,color] duration-[350ms] ease-reveal group-hover:translate-x-3.5 group-hover:text-inv-accent md:text-[26px]">
                            {entry.company}
                          </span>
                          <span className="text-sm text-inv-muted transition-colors duration-base md:text-[15px]">
                            {entry.role}
                            {dates && <span className="whitespace-nowrap md:hidden"> · {dates}</span>}
                          </span>
                        </span>
                        {dates && (
                          <span className="hidden shrink-0 text-[15px] tabular-nums text-inv-muted transition-colors duration-base md:block">
                            {dates}
                          </span>
                        )}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "relative ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inv-line transition-transform duration-[450ms] ease-reveal",
                            isOpen && "rotate-45",
                          )}
                        >
                          <span className="absolute h-px w-3.5 bg-current" />
                          <span className="absolute h-3.5 w-px bg-current" />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <m.div
                          key="panel"
                          id={`exp-panel-${i}`}
                          role="region"
                          aria-labelledby={`exp-btn-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: ease.reveal }}
                          className="overflow-hidden"
                        >
                          <div className={cn("flex flex-col gap-5 pb-8 pr-2 md:pb-10", previewEnabled ? "md:pl-2" : "md:pl-[72px]")}>
                            <p className="max-w-[760px] text-base leading-[1.7] text-inv-muted md:text-[17px]">
                              {entry.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {entry.tech.map((t) => (
                                <span
                                  key={t}
                                  className="inline-flex items-center rounded-full border border-inv-line px-3 py-1.5 text-meta font-medium transition-colors duration-base"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                            {entry.link && (
                              <a
                                href={entry.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link inline-flex min-h-11 items-center gap-2 self-start text-sm font-medium transition-colors hover:text-inv-accent"
                              >
                                Visit {new URL(entry.link).hostname.replace(/^www\./, "")}
                                <ArrowUpRight
                                  size={14}
                                  className="transition-transform duration-fast ease-reveal group-hover/link:-translate-y-[3px] group-hover/link:translate-x-[3px]"
                                />
                                <span className="sr-only">(opens in a new tab)</span>
                              </a>
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

          <CursorPreview containerRef={listRef} visible={previewEntry !== null}>
            <div className="flex h-[150px] w-[220px] items-center justify-center rounded-card bg-canvas p-6 shadow-float">
              {previewEntry && <LogoMark entry={previewEntry} size="card" />}
            </div>
          </CursorPreview>
        </div>
      </div>
    </section>
  );
}
