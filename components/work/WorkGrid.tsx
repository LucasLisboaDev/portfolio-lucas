"use client";

import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { useLayoutEffect, useState, type MouseEvent } from "react";
import Reveal from "@/components/motion/Reveal";
import { getLenis } from "@/components/motion/SmoothScroll";
import {
  isPlainClick,
  nameForTransition,
  useTransitionNav,
} from "@/components/motion/ViewTransitions";
import Tag from "@/components/ui/Tag";
import { ArrowUpRight } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import type { ProjectCardData } from "@/lib/projects";
import { pad2 } from "@/lib/projects";
import {
  HOME_STATE_KEY,
  RETURN_KEY,
  VT_ATTR,
  readSession,
  writeSession,
  type HomeState,
  type ReturnState,
} from "@/lib/transitions";
import ProjectCover from "./ProjectCover";

type WorkGridProps = {
  cards: ProjectCardData[];
  categories: string[];
};

const ALL = "All";

/**
 * Filter chips plus the project card grid.
 *
 * - Filtering animates with Motion layout animations: remaining cards glide
 *   to their new positions while others fade out (popLayout).
 * - Each card's title is a real link; a stretched overlay makes the whole
 *   card clickable without nesting interactive content inside a link.
 * - A plain click runs the page transition into the case study and saves
 *   the scroll position. Cmd/Ctrl-click still opens a new tab as usual.
 * - On return from a case study, the matching card is named so the title
 *   morphs back into it, and the scroll position is restored.
 */
export default function WorkGrid({ cards, categories }: WorkGridProps) {
  const [filter, setFilter] = useState<string>(ALL);
  const { navigate } = useTransitionNav();

  // Arriving back from a case study: restore scroll and prepare the morph.
  // Runs before the transition provider releases the new snapshot.
  useLayoutEffect(() => {
    const ret = readSession<ReturnState>(RETURN_KEY);
    if (!ret) return;
    writeSession(RETURN_KEY, null);

    const home = readSession<HomeState>(HOME_STATE_KEY);
    if (ret.mode === "back" && home?.slug === ret.slug) {
      window.scrollTo(0, home.scrollY);
      getLenis()?.scrollTo(home.scrollY, { immediate: true, force: true });
    }
    nameForTransition(document.querySelector(`[${VT_ATTR}="${ret.slug}"]`));
  }, []);

  const visible = filter === ALL ? cards : cards.filter((c) => c.category === filter);

  const chips = [ALL, ...categories].map((label) => ({
    label,
    count: label === ALL ? cards.length : cards.filter((c) => c.category === label).length,
  }));

  const openCase = (e: MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    writeSession(HOME_STATE_KEY, { slug, scrollY: window.scrollY } satisfies HomeState);
    const card = e.currentTarget.closest("li");
    nameForTransition(card?.querySelector(`[${VT_ATTR}]`) ?? null);
    navigate(`/work/${slug}`);
  };

  return (
    <>
      <Reveal delay={0.1} className="relative z-10 mt-10 flex flex-wrap gap-2.5" amount={0.5}>
        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2.5">
          {chips.map((chip) => {
            const active = filter === chip.label;
            return (
              <button
                key={chip.label}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(chip.label)}
                className={cn(
                  "min-h-11 rounded-full border px-[18px] py-2.5 text-sm font-medium transition-colors duration-fast ease-reveal",
                  active
                    ? "border-ink bg-ink text-canvas"
                    : "border-line bg-transparent text-ink hover:border-ink",
                )}
              >
                {chip.label} <span className="text-xs opacity-70">{pad2(chip.count)}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        {filter !== ALL ? ` in ${filter}` : ""}
      </p>

      <m.ul layout className="relative z-10 mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((card) => (
            <m.li
              key={card.slug}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: ease.reveal }}
              className="group relative"
            >
              <Reveal className="flex flex-col gap-5">
                <ProjectCover
                  slug={card.slug}
                  num={card.num}
                  category={card.category}
                  coverTitle={card.coverTitle}
                  live={card.live}
                  tone={card.tone}
                />
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-xl font-bold tracking-[-0.01em] transition-colors duration-fast group-hover:text-accent-deep md:text-2xl">
                      <Link
                        href={`/work/${card.slug}`}
                        onClick={(e) => openCase(e, card.slug)}
                        className="after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent-soft"
                      >
                        {card.title}
                      </Link>
                    </h3>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-muted" aria-hidden="true">
                      Case study
                      <ArrowUpRight
                        size={14}
                        className="transition-transform duration-fast ease-reveal group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
                      />
                    </span>
                  </div>
                  <p className="text-[15px] leading-[1.6] text-muted">{card.blurb}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {card.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>
              </Reveal>
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>
    </>
  );
}
