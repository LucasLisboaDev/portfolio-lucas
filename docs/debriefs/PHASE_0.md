# Phase 0 Debrief: Foundation

**Branch:** `redesign/animated-portfolio`
**Commit:** `5a42b5a`
**Date:** October 10, 2026

## What shipped

Phase 0 laid the groundwork without changing how any section looks, apart from the background. Motion and Lenis are installed for the motion system that Phase 1 builds. Archivo (the expanded display face) and Inter (body) are now self-hosted variable fonts. The full palette, type scale, spacing, radius, shadow, and motion values exist as tokens in three synced places: CSS variables in `app/globals.css`, the Tailwind theme, and `lib/motion.ts`. `design-tokens.md` was rewritten to document all of it. The full-screen WebGL gradient that sat behind every section is gone, and the page now renders on the flat off white canvas color.

## Engineering decisions

**Self-hosting the fonts instead of loading them from Google.** The plan originally said `next/font/google`. During this phase the build failed in an environment that could not reach Google Fonts, which exposed a real fragility: every build depended on a network call to a third party. Moving to `next/font/local` with the woff2 files committed in `app/fonts` makes builds deterministic everywhere, including local machines, CI, and Vercel. The font licenses (SIL OFL) are committed alongside them. The cost is about 138 KB in the repository, which is negligible.

**Colors as RGB channel variables.** Each color is stored as `--color-ink: 10 9 9` rather than a hex value, and Tailwind reads it as `rgb(var(--color-ink) / <alpha-value>)`. This keeps a single source of truth while still allowing opacity modifiers like `bg-ink/80`, which a plain hex variable would break.

**Avoiding name collisions with Tailwind defaults.** Two token names would have silently changed existing behavior. A font size named `ghost` would have collided with the `ghost` color on the same `text-ghost` class, so it became `text-watermark`. Easing curves named `out` and `in-out` would have overridden Tailwind's default `ease-out` and `ease-in-out`, which the current Maya orb uses, so they became `ease-reveal` and `ease-page`.

**Keeping the legacy palette for now.** The current sections still use the old slate colors (`purple-primary`, `teal-light` and so on). Those stay in the Tailwind config, clearly labeled, until each section is rebuilt in Phases 2 to 5. Removing them now would have broken the live layout on the branch.

**Holding back the display font preload.** `next/font` preloads fonts by default, but nothing above the fold uses Archivo yet. Measured with the preload on, the unused 88 KB font competed with the hero text for bandwidth and made LCP worse (3.01s). With `preload: false` LCP improved to 2.74s. The preload gets switched back on in Phase 2, when the new hero headline makes Archivo the most important font on the page.

## Metrics

Measured with Lighthouse 12 on a local production build, mobile profile, median of three runs, before and after this phase.

| Metric | Before | After |
|---|---|---|
| Performance score | 56 | 96 |
| Accessibility | 100 | 100 |
| Best practices | 96 | 96 |
| SEO | 100 | 100 |
| Total Blocking Time | 159,401 ms | 90 ms |
| Speed Index | 12.4 s | 1.0 s |
| Largest Contentful Paint | 2.84 s | 2.74 s |
| Cumulative Layout Shift | 0 | 0 |
| Home route JS | 163 KB | 159 KB |

The blocking time and speed index numbers before the change are exaggerated by the test environment, which has no GPU, so the WebGL shader ran in software and kept the main thread busy for the entire test (Lighthouse also warned that the page never finished loading). On a real phone the gap is smaller, but the direction is the same: a shader animating behind the whole page costs battery and main thread time on every visit, and removing it was the single largest performance win available.

LCP is still above the 2.5s budget. The LCP element is the hero introduction paragraph, and it gets redesigned in Phase 2.

The Vercel preview deployment for this commit built and deployed successfully, which confirms the self-hosted fonts work in production builds too.

## Lessons

Measure from a clean slate every time. The first Phase 0 measurement came back with a perfect score that was false: an old server from the baseline run was still holding the port, so Lighthouse loaded the previous build's HTML with none of its JavaScript able to run. Checking that the served HTML referenced the new build's files caught it. Every measurement from now on starts by confirming no stale server is running.

Default behaviors deserve a second look. Both the font preload and the Tailwind naming collisions were defaults that would have quietly made things worse. Neither showed up as an error; they only showed up in measurements and careful reading.

## Next: Phase 1

Phase 1 builds the motion primitives (`MotionProvider`, `SmoothScroll`, `Reveal`, `Stagger`, `CursorPreview`) and the shared UI pieces (`SectionHeading`, `PillButton`, `StatusPill`, `Tag`), plus a hidden `/lab` page to test each one with reduced motion on and off.
