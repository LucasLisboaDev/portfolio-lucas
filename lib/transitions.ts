/*
 * Shared constants for page transitions. Kept in a plain module (not a
 * "use client" file) so server components can import the real values:
 * constants exported from a client module arrive in server components as
 * references, not strings.
 */

/** view-transition-name shared by a project's card title and its case study title. */
export const PROJECT_TITLE = "project-title";

/** Marks elements that may carry PROJECT_TITLE (cards, case study titles, next-project links). */
export const VT_ATTR = "data-vt-title";

/** sessionStorage: { slug, scrollY } saved when leaving the homepage for a case study. */
export const HOME_STATE_KEY = "vt-home";

/** sessionStorage: { slug, mode } telling the homepage which card to morph back into. */
export const RETURN_KEY = "vt-return";

export type HomeState = { slug: string; scrollY: number };
export type ReturnState = { slug: string; mode: "back" | "push" };

export function readSession<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: unknown) {
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or storage blocked: transitions still work, just without
    // scroll restoration or the morph back into the card.
  }
}
