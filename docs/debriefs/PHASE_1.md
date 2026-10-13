# Phase 1 Debrief: Motion System and Shared UI

**Branch:** `redesign/animated-portfolio`
**Commit:** `fef8a10`
**Date:** October 10, 2026
**Test page:** `/lab` on the preview deployment (hidden, not indexed)

## What shipped

Phase 1 built every reusable piece the new sections will be assembled from, without changing any visible section of the homepage yet.

The motion layer is five pieces. `MotionProvider` configures Motion for the whole site. `SmoothScroll` adds Lenis inertia scrolling. `Reveal` fades an element up into place the first time it enters the screen. `Stagger` and `StaggerItem` do the same for lists, one item after another. `CursorPreview` is the tilted card that follows the pointer on a spring, paired with a `useCursorPreviewEnabled` hook that tells a section when to show its fallback instead.

The UI layer is `SectionHeading` (the slash label with the drifting ghost word behind it), `PillButton` (primary, secondary and two dark-section variants), `StatusPill`, `Tag`, and a shared set of stroke icons.

The hidden `/lab` page shows all of them, with a toolbar that can simulate reduced motion and replay every entrance animation.

## Engineering decisions

**Loading only the parts of Motion the site uses.** Motion's full `motion.*` components include features this site does not need on day one. `MotionProvider` uses `LazyMotion` with the `domAnimation` feature set (animations, variants, hover, tap and in-view gestures), and every component uses the lightweight `m.*` components. Strict mode makes any accidental use of the heavy components throw during development. Phase 3 will move up to `domMax` because shared-element page transitions need layout animation.

> **Beginner flag:** "tree shaking" and lazy feature loading both mean shipping only the code a page actually uses. A library can be large on npm and still cost a page very little if you only import what you need.

**Reduced motion handled in one place.** `MotionConfig reducedMotion="user"` makes every Motion animation respect the visitor's system setting automatically: movement and scaling are skipped, and only fades remain. Components that do their own scroll-linked or pointer-linked work (the ghost word parallax and the cursor preview) read the same setting through `useReducedMotionConfig`, so the lab's simulated toggle and the real system setting behave identically.

**Smooth scroll only where it helps.** Lenis runs for mouse wheels and trackpads, but touch devices keep native scrolling, because phones already have their own inertia and fighting it feels wrong. It switches off completely, and live, if the visitor turns on reduced motion. It also handles in-page anchor links with an 88px offset so sections never land hidden under the navbar.

**Cursor previews only for real pointers.** The floating card only renders when the device can hover with a precise pointer and reduced motion is off. Everyone else gets an inline logo in each row, exposed through `useCursorPreviewEnabled` so sections can switch between the two without duplicating detection logic. On first entry the spring jumps straight to the pointer instead of animating in from the container's corner.

**Buttons that pick the right element.** `PillButton` renders a Next.js `Link` for internal routes, a plain anchor for hashes, email and external URLs (external ones open in a new tab safely), and a real `button` otherwise. Every size is at least 44px tall, which the tests confirmed (51px).

## Testing

Automated browser tests ran against the production build in three environments.

| Check | Desktop | Reduced motion | Touch phone |
|---|---|---|---|
| Smooth scroll active | Yes | No (correct) | Native |
| All reveals finish visible | Yes | Yes, fade only | Yes |
| Ghost word drifts on scroll | Yes | Still (correct) | Yes |
| Cursor preview card | Shows, follows pointer | Hidden, inline logos instead | Hidden, inline logos instead |
| Horizontal overflow | None | None | None |
| Keyboard focus ring | Visible, accent soft | Visible | n/a |

Two bugs were caught and fixed before shipping. With reduced motion on, the ghost word was frozen 40px lower than intended: on the first render the reduced motion setting was not known yet, so the parallax applied an offset, and then removing the style left that offset in place. Binding a fixed zero motion value instead of removing the style resets it. Separately, the oversized ghost words spilled 24px past the right edge and allowed sideways scrolling. Clipping overflow on the body did not work, because browsers transfer the body's overflow to the viewport and treat it differently, so the clip now lives on a wrapper inside the layout, which also keeps the sticky navbar working.

## Metrics

Lighthouse 12, local production build, mobile profile, median of three runs, homepage.

| Metric | Phase 0 | Phase 1 |
|---|---|---|
| Performance score | 96 | 94 |
| Accessibility | 100 | 100 |
| Largest Contentful Paint | 2.74 s | 2.89 s |
| Total Blocking Time | 90 ms | 121 ms |
| Cumulative Layout Shift | 0 | 0 |
| JavaScript transferred | 246 KB | 281 KB |

The motion system costs about 35 KB of JavaScript on the homepage, inside the 60 KB budget from the plan. It loads now even though the homepage sections do not use it yet, so this phase shows the cost before the benefit; Phase 2 starts using it.

The bigger finding is elsewhere. The largest single file on the homepage, 121 KB compressed, is LiveKit, the real-time audio library behind the Maya voice agent. The current hero imports the voice client at the top of the file, so every visitor downloads it on page load even if they never press "Start voice conversation." Phase 2 will load it only when someone actually starts a conversation, which should more than pay back the motion system's cost.

## Lessons

Test the off switch as carefully as the effect. Both bugs this phase only appeared with reduced motion on or at a specific width, exactly the paths that are easy to skip when everything looks good in a normal desktop browser.

Look at what the bundle actually contains before optimizing what you just added. Measuring the motion library's cost is what led to spotting the much larger voice library loading on every visit.

## Next: Phase 2

Phase 2 rebuilds the navbar, the hero (with the "AI Engineer" title from the canvas edit, the outlined and solid name, the grayscale portrait rising in, and the timed intro), and the Talk to Maya section, including loading the voice library only on demand. The Archivo font preload gets switched back on with it.
