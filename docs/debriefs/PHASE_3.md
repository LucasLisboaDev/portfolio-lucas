# Phase 3 Debrief: Selected Work, Case Studies and Page Transitions

**Branch:** `redesign/animated-portfolio`
**Commit:** `2573da6`
**Date:** October 11, 2026

## What shipped

**Selected Work** replaces the old "My Recent Projects" section. It has the slash heading with the drifting PROJECTS ghost word, a link to GitHub, filter chips (All, Agentic AI, RAG & Search, ML Research, Full Stack) with live counts, and a two-column grid of project cards with typographic covers that alternate ink and warm surface. Choosing a filter makes the remaining cards glide into their new places while the others fade out.

**Six case study pages**, one per project, at `/work/jiujitsu-jobs`, `/work/ai-content-pipeline`, `/work/email-calendar-agent`, `/work/production-rag-pipeline`, `/work/talentmatch-ai` and `/work/offline-llm-engineering`. Each has a "Back to work" header, category tags, the project name in large display type with the last line outlined, the summary with Live Demo and GitHub buttons, a meta row (category, type, core stack, status), a cover panel with the project's one-line pitch, every section of the existing write-up, and a large outlined link to the next project.

**Page transitions.** Clicking a card fades the homepage into ink, wipes the case study up from the bottom, and the project title flies from the card into its place as the page heading. "Back to work" plays it in reverse and lands on the exact scroll position you left. The next-project link carries its title into the next case study the same way.

The **floating ElevenLabs widget** is gone, as you asked. Maya now lives only in her own section.

## Engineering decisions

**Static pages generated from the existing data.** Each case study is built at deploy time from `data/github-projects.ts` with `generateStaticParams`, so there is no server work per visit and each page has its own title and description for search and link previews. Unknown slugs return a 404. Adding a project to the data file adds a page automatically. The data only gained two fields: `category` and `coverTitle`.

> **Beginner flag:** static generation means Next.js renders each page to HTML once, when the site is built, and serves those files directly. It is the fastest kind of page because nothing has to be computed when someone visits.

**Sections laid out from their content, not from extra configuration.** Rather than adding layout settings to every project, `CaseSections` reads the shape of each section. A heading that starts with "Key" (Key features, Key findings, Key engineering decisions) becomes the dark band of numbered cards. A list where every item reads "Label: value" with a short label, like the Stack sections, becomes definition rows. Everything else is a two-column row with numbered bullets, and tables sit in a scrollable region that keyboard users can focus. Every project ends up with exactly one dark band, which gives each page the same light, dark, light rhythm as the homepage.

**Keeping the write-ups off the homepage.** The full project data holds long case study text. `SelectedWork` is a server component that hands the interactive grid only the small card fields (title, cover, blurb, four tags), so none of the write-up text reaches the homepage's JavaScript.

**Transitions through the browser, not a library.** The plan called for Motion's shared layout animations plus a hand-built ink panel. Across a Next.js route change, the old page unmounts before the new one mounts, which makes that approach fragile. The View Transitions API is built for exactly this: the browser snapshots the old page, the navigation happens inside `startViewTransition`, and the browser animates between the snapshots. A small provider resolves the transition when the pathname changes, and the CSS defines the ink fade, the wipe, and the title morph. It costs almost no JavaScript, and browsers without support (or visitors with reduced motion) get a normal instant navigation.

> **Beginner flag:** a view transition works like a photo swap. The browser takes a picture of the old page and of the new one, then animates between the two pictures. Any element given the same `view-transition-name` on both pages is animated separately, morphing from its old position and size to its new one.

**A title that stays readable on any background.** The first version of the morph was invisible for most of its flight: dark text crossing the ink backdrop. Inverting the snapshots fixed one direction and broke the other, because the card titles are light on dark covers and dark on light covers. The final fix turns both snapshots pure white (`brightness(0) invert(1)`) and blends the group with `mix-blend-mode: difference`, so the title reads light over ink and dark over the light page as the wipe passes beneath it, and lands exactly on the real title's colors. No per-direction rules needed.

**Unique names, set at the moment of the click.** A view transition fails if two elements share a name. Cards, case study titles and next-project links carry a `data-vt-title` marker, and the shared name is applied to exactly one of them when the click happens, then cleared when the transition finishes. On the way back, the homepage grid names the matching card in a layout effect before the browser captures the new state.

**Back navigation that returns to the right spot.** When you leave from a card, the slug and scroll position are saved in session storage. "Back to work" uses `history.back()` when you came from that card, and the grid restores the saved position before the new snapshot is taken, so the reverse morph lands on a card that is actually on screen. Arriving at a case study directly (from a shared link, say) makes the same link open `/#work` instead. Session storage is wrapped in try and catch, so private browsing simply loses the restoration, not the navigation.

**Motion's features load after the page is interactive.** Layout animations need Motion's larger `domMax` feature set. It now loads as its own small chunk right after hydration instead of during startup. Nothing above the fold uses Motion, so visitors never see the difference.

**Shared constants live outside client modules.** Server components that import a constant from a `"use client"` file receive a reference, not the value. The transition names and session keys moved to `lib/transitions.ts` so the case study page (a server component) gets the real strings.

## Testing

Automated browser tests against the production build covered the following, all passing:

| Check | Result |
|---|---|
| All six case study URLs | 200; unknown slug 404 |
| Filter "ML Research" | 2 cards, chip pressed, layout animation running, screen reader hears "Showing 2 projects in ML Research" |
| Card click | one view transition, case study loads at the top |
| Back to work | returns home at the saved scroll position (2149px to 2149px) |
| Browser back and forward | same position restored (within 1px) |
| Keyboard | Tab reaches each card link with a visible focus ring; Enter opens the case study with the transition |
| Next project | opens the following case study |
| Direct visit, then Back to work | opens `/#work`, section heading lands just below the navbar |
| Reduced motion | navigation works, transition API never called |
| Leftover transition names | none after transitions finish |
| Phones (390px) | no sideways scroll on the homepage or any case study; tables scroll inside their box |
| Phase 1 and 2 suites | rerun and passing (hero intro 1.56s, voice library still on demand) |

## Metrics

Lighthouse 12, mobile profile. The test machine was noticeably slower today than in earlier phases, so instead of comparing against old numbers, the Phase 2 build was rebuilt and measured side by side with Phase 3, alternating, six runs each.

| Metric (median) | Phase 2 | Phase 3 | Case study page |
|---|---|---|---|
| Performance | 80 | 82 | 88 |
| Accessibility | 100 | 100 | 100 |
| Best practices | 96 | 96 | 96 |
| SEO | 100 | 100 | 100 |
| Largest Contentful Paint (simulated) | 4.24 s | 3.85 s | 3.33 s |
| Total Blocking Time | 178 ms | 227 ms | 236 ms |
| Cumulative Layout Shift | 0 | 0 | 0 |
| JavaScript transferred | 170 KB | 176 KB | 179 KB |

Phase 3 adds six case study pages, filtering, layout animations and transitions for 6 KB of JavaScript, while removing the third-party widget script. Blocking time rose about 50 ms, mostly from the larger Motion feature set; loading it asynchronously keeps it out of startup. The remaining best practices deduction is a missing favicon (a 404 in the console), which goes on the Phase 6 list.

## Lessons

Verify the server before trusting a number. Mid-phase, a Lighthouse run showed a blocking time of zero and a big score jump. It was false: an old server process was still holding the port and serving the new HTML with none of its JavaScript able to load. The same trap appeared in Phase 0. The test setup now has a script that frees the port through `/proc` and refuses to continue unless the page's own JavaScript files return 200.

Test the test. Two odd results (a transition counted twice, and one counted under reduced motion) came from the test script itself: Playwright treated a string containing an arrow function as a function and ran it. Tracing the real calls with stack traces showed the site was correct.

Compare like with like. Today's machine was slower across the board. Measuring the previous phase again on the same machine, in the same session, was the only honest way to say whether Phase 3 made things better or worse.

## Open items

The project covers are still typographic stand-ins. They work well with the morph, but real screenshots or diagrams would make the work more tangible. The experience dates are still needed for Phase 4.

## Next: Phase 4

Phase 4 builds Capabilities (the accordion with cursor-following previews, using a new `data/capabilities.ts`) and the dark Experience section with the page background inversion, the logo preview that follows the cursor, and inline logos on phones.
