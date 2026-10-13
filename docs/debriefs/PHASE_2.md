# Phase 2 Debrief: Navbar, Hero and Talk to Maya

**Branch:** `redesign/animated-portfolio`
**Commit:** `ab58855`
**Date:** October 10, 2026

## What shipped

This is the first phase visitors can see. The top of the homepage now matches the approved canvas.

The **navbar** has the LL wordmark, links with live counts pulled from the data files (Work 06, Experience 06), the "Open to opportunities" pill and a dark "Let's Talk" button. On phones it collapses into a full-screen menu with large staggered links. The old labels "Portfolio" and "Projects", which read as the same thing, are now "Work" and "Experience". A "Skip to content" link appears for keyboard users.

The **hero** sets LUCAS outlined and LISBOA solid in expanded Archivo, with the grayscale portrait rising in front of the name, the "AI Engineer" title from the canvas edit, the shorter introduction, "Let's Collaborate" and "View Resume" on the left, and LinkedIn, GitHub, Email and a scroll cue on the right. The letters slide up from behind a mask one by one, and the whole intro finishes in 1.56 seconds.

**Talk to Maya** is its own section with a warm, breathing orb in the brand palette, the voice session controls, and a live status line ("Maya is listening", "Maya is speaking"). The live orb during a conversation now uses the brand colors too.

The **resume dialog** was restyled and now closes with Escape, moves focus into the email field when it opens, and returns focus to the button when it closes. Page title and description now say "AI Engineer".

## Engineering decisions

**A hero with no JavaScript of its own.** The intro is pure CSS keyframes, so it starts on the very first paint, before any script has loaded, and the hero is a server component. Each letter gets its delay from two CSS variables (`--d` for the word's start and `--i` for the letter's index), which keeps the markup small. The real name sits in the `h1` for screen readers, while the animated letters are hidden from them so nobody hears "L, U, C, A, S".

**Loading the voice library only when someone asks for it.** The old hero imported `VoiceConversation` at the top of the file just to run an `instanceof` check on the volume readers. That one line pulled the entire voice stack (LiveKit, about 121 KB compressed) into every page load. The check now looks at the object's shape instead (does it have `getOutputVolume`?), and the library is imported only inside "Start voice conversation". The tests confirmed the LiveKit file is absent on load and arrives after the click.

> **Beginner flag:** a dynamic `import()` tells the bundler to split that library into a separate file that downloads only when the line runs. A regular `import` at the top of a file bundles it into the page, even if the code using it never runs.

**The nav keeps data on the server.** The link counts come from `githubProjects` and `workExperience`. The project data is large (it holds full case study text), so the header is a server component that counts on the server and passes plain labels to the small client-side mobile menu. None of that data ships to the browser.

**Portrait that scales instead of squeezing.** The middle column is `clamp(300px, 34vw, 440px)`, so at tablet widths the portrait shrinks instead of crushing the text columns, and both side columns stay equal so the portrait is always centered under the name. A 32px column gap gives the left column exactly enough room for both buttons on one line at desktop width.

## Bugs found and fixed

**Headlines were not in Archivo at all.** While checking the outlined text, the computed font turned out to be Inter. `next/font` writes the fallback list into a CSS variable without quotes, and the CSS minifier read "Black" in "Arial Black" as the color black, which made the whole font declaration invalid. Browsers quietly fall back to the inherited font when that happens, so nothing errored. Removing "Arial Black" from the fallback lists fixed it, and there is now a warning about it in `design-tokens.md` and `app/layout.tsx`. This also affected Phase 1's lab page, which only looked right because Inter bold is a plausible stand-in.

**A stray box inside the outlined "A".** Variable fonts are drawn from overlapping shapes, and an outline stroke traces every overlap. The fix was to generate a static Archivo instance at weight 800 and width 112% with fontTools, using its overlap removal, and subset it to Basic Latin. The result is a 7 KB file with clean outlines.

**Delayed entrances under reduced motion.** The global reduced motion rule shortened animations but kept their delays, so hero elements would sit invisible for up to a second and then pop in. Delays are now zeroed too.

## Metrics

Lighthouse 12, local production build, mobile profile, median of three runs, homepage.

| Metric | Phase 1 | Phase 2 |
|---|---|---|
| Performance score | 94 | 95 |
| Accessibility | 100 | 100 |
| Total Blocking Time | 121 ms | 33 ms |
| Largest Contentful Paint (simulated slow phone) | 2.89 s | 2.90 s |
| Largest Contentful Paint (observed in the test browser) | 243 ms | 240 ms |
| Cumulative Layout Shift | 0 | 0 |
| JavaScript transferred | 281 KB | about 170 KB |
| Home first-load JS (Next.js build) | 247 KB | 168 KB |
| Hero intro duration | n/a | 1.56 s (budget 1.6 s) |

Moving the voice library to on-demand loading removed about 111 KB of JavaScript from every visit and is why blocking time fell by almost three quarters.

The simulated LCP is still slightly above the 2.5 second budget. The investigation showed what drives it: Lighthouse's slow-phone simulation counts every high-priority download in flight before the largest paint, including fonts, and the 88 KB variable Archivo loads at top priority because text further down the page uses it. Browsers fetch a font as soon as any text in the document needs it, not only text on screen. Moving the hero's own display text onto the 7 KB headline font brought the simulated LCP back down from 3.4 seconds, and the remaining gap belongs to sections that are rebuilt in Phases 3 to 5 and tuned in Phase 6. In the real browser trace, the largest paint lands at about a quarter of a second.

## Lessons

Silent failures need visual checks. The broken font stack produced no error, no warning and no failed test. It only showed up by comparing the screenshot against the canvas and then reading the computed styles. Every phase from now on checks computed fonts, not just screenshots.

Read the simulation and the observation together. The simulated LCP alone suggested Phase 2 had made the page slower; the observed timings showed it had not. The simulation was still useful, because it pointed at the font loading order, which was worth fixing.

Small optimizations compound. Generating one 7 KB static font fixed a visual bug, removed a large file from the hero's critical path, and gave the outlined text a dedicated, predictable rendering.

## Open question

The site also loads ElevenLabs' floating Convai widget from unpkg on every page (`components/ElevenLabsConvaiWidget.tsx`), which is a second way to talk to the same agent. Now that Talk to Maya is a dedicated section, it is worth deciding whether to keep the floating widget, load it only after the visitor scrolls past Maya, or remove it. It is a third-party script on every visit.

## Next: Phase 3

Phase 3 rebuilds Selected Work: project data extended with category, year and cover fields, the filterable card grid, statically generated case study pages at `/work/[slug]`, and the shared title transition into each case study. The motion features move from `domAnimation` to `domMax` for the layout animations that transition needs.
