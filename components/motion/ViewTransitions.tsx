"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { PROJECT_TITLE, VT_ATTR } from "@/lib/transitions";

type NavigateOptions = {
  /** Use router.back() instead of pushing a new entry (returns to the exact previous page). */
  back?: boolean;
};

type TransitionContextValue = {
  navigate: (href: string, options?: NavigateOptions) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

/**
 * Page transitions between the homepage and case studies, using the browser's
 * View Transitions API.
 *
 * navigate() asks the browser to snapshot the current page, then performs the
 * Next.js navigation inside startViewTransition. When the new route has
 * rendered (the pathname changes), the promise resolves and the browser
 * animates from the old snapshot to the new page: the old page fades into
 * ink, the new one wipes up from the bottom, and the one element named
 * "project-title" on each side morphs from its old position and size to the
 * new one (CSS in globals.css).
 *
 * Browsers without the API, and visitors who prefer reduced motion, get a
 * normal instant navigation. Nothing depends on the animation.
 */
export default function ViewTransitions({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const resolveRef = useRef<(() => void) | null>(null);

  // The new route has committed. Child effects (such as the work grid naming
  // the card to morph back into) have already run, so the browser can now
  // capture the new state.
  useEffect(() => {
    const resolve = resolveRef.current;
    resolveRef.current = null;
    resolve?.();
  }, [pathname]);

  const navigate = useCallback(
    (href: string, options: NavigateOptions = {}) => {
      const go = () => (options.back ? router.back() : router.push(href));

      const target = new URL(href, window.location.href);
      const changesRoute = options.back || target.pathname !== window.location.pathname;
      const supported = typeof document.startViewTransition === "function";
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!supported || reduce || !changesRoute) {
        clearTransitionNames();
        go();
        return;
      }

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            resolveRef.current = resolve;
            go();
            // Safety net: never leave the page frozen if the route never changes.
            window.setTimeout(() => {
              if (resolveRef.current === resolve) {
                resolveRef.current = null;
                resolve();
              }
            }, 2500);
          }),
      );
      transition.finished.catch(() => {}).finally(clearTransitionNames);
    },
    [router],
  );

  return <TransitionContext.Provider value={{ navigate }}>{children}</TransitionContext.Provider>;
}

/** Removes temporary transition names so the next transition starts clean. */
export function clearTransitionNames() {
  document.querySelectorAll<HTMLElement>(`[${VT_ATTR}]`).forEach((el) => {
    el.style.viewTransitionName = "";
  });
}

/** Gives exactly one element the shared title name (names must be unique). */
export function nameForTransition(el: Element | null) {
  clearTransitionNames();
  if (el instanceof HTMLElement) el.style.viewTransitionName = PROJECT_TITLE;
}

export function useTransitionNav(): TransitionContextValue {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransitionNav must be used inside <ViewTransitions>");
  return ctx;
}

/** True for a plain left click (no modifier keys), which the page handles itself. */
export function isPlainClick(e: MouseEvent): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
