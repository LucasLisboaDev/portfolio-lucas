"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import {
  isPlainClick,
  nameForTransition,
  useTransitionNav,
} from "@/components/motion/ViewTransitions";
import { ArrowLeft, ArrowUpRight } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import {
  HOME_STATE_KEY,
  RETURN_KEY,
  VT_ATTR,
  readSession,
  writeSession,
  type HomeState,
  type ReturnState,
} from "@/lib/transitions";

/**
 * "Back to work" link. If the visitor came straight from this project's card,
 * it goes back in history (exact scroll position restored); otherwise it
 * opens the homepage at the Work section. Either way the title morphs back
 * into its card.
 */
export function BackToWork({ slug, className }: { slug: string; className?: string }) {
  const { navigate } = useTransitionNav();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    const home = readSession<HomeState>(HOME_STATE_KEY);
    const back = home?.slug === slug && window.history.length > 1;
    writeSession(RETURN_KEY, { slug, mode: back ? "back" : "push" } satisfies ReturnState);
    nameForTransition(document.querySelector(`h1[${VT_ATTR}]`));
    navigate("/#work", { back });
  };

  return (
    <Link
      href="/#work"
      onClick={onClick}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2.5 text-sm font-medium text-ink transition-colors duration-fast hover:text-accent",
        className,
      )}
    >
      <ArrowLeft size={16} className="transition-transform duration-fast ease-reveal group-hover:-translate-x-1" />
      Back to work
    </Link>
  );
}

type NextProjectLinkProps = {
  slug: string;
  num: string;
  category: string;
  title: string;
  children?: ReactNode;
};

/** Large outlined link to the next case study; its title morphs into the next page's title. */
export function NextProjectLink({ slug, num, category, title }: NextProjectLinkProps) {
  const { navigate } = useTransitionNav();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    // Moving sideways between case studies: "Back to work" should no longer
    // treat history.back() as a return to the homepage.
    writeSession(HOME_STATE_KEY, null);
    nameForTransition(e.currentTarget.querySelector(`[${VT_ATTR}]`));
    navigate(`/work/${slug}`);
  };

  return (
    <Link
      href={`/work/${slug}`}
      onClick={onClick}
      className="group flex flex-col gap-5 border-t border-line pt-10 text-ink"
    >
      <span className="flex justify-between gap-4 text-sm text-muted">
        <span>Next project</span>
        <span>
          /{num} · {category}
        </span>
      </span>
      <span className="flex items-end justify-between gap-6">
        <span
          {...{ [VT_ATTR]: slug }}
          className="text-display text-outline text-[clamp(2.25rem,7vw,6.5rem)] transition-[-webkit-text-stroke-color] duration-fast group-hover:[-webkit-text-stroke-color:rgb(var(--color-accent))]"
        >
          {title}
        </span>
        <ArrowUpRight
          size={40}
          strokeWidth={1.5}
          className="mb-2 hidden shrink-0 transition-transform duration-fast ease-reveal group-hover:-translate-y-1 group-hover:translate-x-1 md:block"
        />
      </span>
    </Link>
  );
}
