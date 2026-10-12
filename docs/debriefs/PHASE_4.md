# Phase 4 Debrief: Capabilities and Experience

**Branch:** `redesign/animated-portfolio`
**Commit:** `dd8f876`
**Date:** October 12, 2026

## What shipped

**Capabilities** is a new section between Selected Work and Experience, with four rows: AI Engineering & Agents, RAG & Data Pipelines, Full Stack Product, and iOS & Mobile. Each row is a large accordion header. The open row (the first one by default) turns ink and reveals a short description plus "Related work" links that jump to the matching case study or role. With a mouse, hovering a row also turns it ink and a small tilted card naming the related work follows the pointer. On phones and with reduced motion, that card sits inside the open row instead.

**Experience** replaces the old "My Recent Works" cards. As the section reaches the middle of the screen, the whole section fades from off white to ink, and it fades back as you scroll past it. Each row shows the company, role and dates. Clicking a row expands the full description, the tech stack and, where there is one, a link to the company site. With a mouse, the company logo follows the pointer on a tilted white card; on phones, each row has its logo (or a monogram) in a small tile instead.

The **navigation** now reads Work, Capabilities, Experience and About, matching the approved design, with "Let's Talk" as the way to reach the contact form.

## Content changes, sourced from your resume

The resume PDF in the repo (`data/Software-AI-Resume-LucasLisboa.pdf`) had the dates for most roles, so the Experience section uses them: Encountr from Sep 2025 to Present, BusyBee from May to Aug 2025, Globant and Carnival from May to Aug 2024, PlutoHacks in 2024, and independent mobile work from Jan 2022 to Jan 2024.

Two things on the old site disagreed with the resume, and both changed:

The old site listed **Globant** and **Carnival Cruise Lines** as two separate internships. The resume shows one internship: employed by Globant, working on Carnival's app. Two cards for one role reads as more experience than there was, which is the kind of thing a recruiter notices, so they are now a single row, "Globant · Carnival Cruise Lines", with both descriptions and both logos combined.

The resume lists **Mobile Applications Developer, Independent Contractor (Jan 2022 to Jan 2024)**, which the site never mentioned. It is now in the Experience section. It is easy to remove if you would rather leave it off.

**Spark Founders** is not on the resume, so its row shows no dates for now and sits at the end of the list. Adding a `start` and `end` in `data/workExperience.ts` puts dates on it.

The Capabilities descriptions are first drafts written from your projects and roles, the same copy you saw on the canvas. They live in `data/capabilities.ts` and are worth rewriting in your own words.

## Engineering decisions

**One set of color variables for a section that flips.** Every element in Experience (text, muted text, borders, tags, the ghost word) takes its color from CSS variables on the section, exposed to Tailwind as `inv-*` colors like `text-inv-muted` and `border-inv-line`. Flipping one `data-inverted` attribute swaps the whole set, and each element's own `transition-colors` animates it. Without this, every element would need two sets of classes and they would drift out of sync.

**Detecting "the middle of the screen" without scroll listeners.** The flip uses Motion's `useInView` with a root margin of `-50%` top and bottom, which shrinks the observed area to a single horizontal line across the middle of the viewport. The section is "in view" exactly while it crosses that line. The browser does the work through IntersectionObserver, so nothing runs on every scroll event.

> **Beginner flag:** a root margin grows or shrinks the area the browser watches. Negative 50% from the top and from the bottom leaves a zero-height line in the center, so the callback fires precisely when the section's edge crosses the middle of the screen.

**Accordions that are real buttons.** Every row header is a `button` inside a heading, with `aria-expanded` and `aria-controls` pointing at a labelled region. Keyboard users can Tab to each row and open it with Enter or Space, and screen readers announce whether it is expanded.

**Hover that only happens where hover exists.** Tailwind's `hoverOnlyWhenSupported` option now wraps every `hover:` style in a media query for devices that can actually hover. On phones, tapping a row used to risk leaving it stuck in its dark hover state; now it simply opens.

**Logos or monograms.** BusyBee and the independent contractor work have no logo, so they get a two-letter monogram in the display font ("BB", "IC"). The monogram splits on camel case, so "BusyBee" becomes "BB" rather than "BU". The previous site used a stock photo of a data dashboard for BusyBee, which suggested a logo that does not exist.

## Bugs found and fixed

**Reduced motion attribute stuck at the server value.** With reduced motion on, Experience is meant to stay dark instead of flashing between light and dark. The first version read the preference during the very first render. The server always renders as if motion is allowed, so the browser's first render disagreed with the HTML it received, and React keeps the server's attributes when that happens during hydration. The attribute silently stayed "false". A small hook, `useMountedReducedMotion`, now returns false until the component has mounted and the real value afterwards, so the change arrives as an ordinary update. The tests confirm the section stays dark at every scroll position.

> **Beginner flag:** hydration is the step where React attaches its behavior to HTML the server already rendered. React expects its first render in the browser to match that HTML exactly; when an attribute differs, it keeps the server version and moves on without fixing it.

**Anchor links landing 80px too low.** Clicking "Encountr" under Related work scrolled to the Experience section but stopped 168px from the top instead of just below the navbar. Lenis was adding its own 88px offset on top of the 80px CSS `scroll-margin-top` it also respects. The offset now comes only from CSS (set once for every section in `globals.css`), and both smooth scrolling and native scrolling on phones land at exactly 80px.

**Two logos overflowing the preview card.** The Globant and Carnival logos side by side were wider than the card. When an entry has two logos they now stack, each at a smaller size.

## Testing

| Check | Result |
|---|---|
| Experience before the middle line | light (rgb 253, 253, 253) |
| Experience crossing the middle | ink (rgb 10, 9, 9) |
| Past the section, and back into it | light, then ink again |
| Reduced motion | stays ink everywhere, inline logos and preview cards |
| Capabilities | first row open by default; opening another closes it; Enter toggles from the keyboard |
| Cursor previews | appear with the right content on hover, for both sections |
| Phones | inline logos for all six rows, preview card inside the open capability, no sideways scroll, menu shows the new links |
| Anchor jumps | 80px below the top with Lenis and with native scrolling |
| Phase 1, 2 and 3 suites | all rerun and passing |

## Metrics

Lighthouse 12, mobile profile, Phase 3 rebuilt and measured side by side with Phase 4, alternating, six runs each.

| Metric (median) | Phase 3 | Phase 4 |
|---|---|---|
| Performance | 90 | 90 |
| Accessibility | 100 | 100 |
| Best practices | 96 | 96 |
| SEO | 100 | 100 |
| Largest Contentful Paint | 3.44 s | 3.32 s |
| Total Blocking Time | 88 ms | 98 ms |
| Cumulative Layout Shift | 0 | 0 |
| JavaScript transferred | 176 KB | 181 KB |

Two interactive sections added for 5 KB of JavaScript and no measurable change in performance. The only best practices deduction is still the missing favicon, which is on the Phase 6 list.

## Lessons

Read the source before writing the content. The resume answered the dates question and exposed two inconsistencies in the existing site that would have been carried straight into the redesign.

Test the accessibility paths with real assertions, not screenshots. The reduced motion bug looked fine in every screenshot taken with motion on, and only showed up because the test checked the attribute value with reduced motion enabled.

When two systems both handle the same thing, pick one. Lenis and CSS were each applying an anchor offset; keeping only the CSS version makes the result the same with or without smooth scrolling.

## Next: Phase 5

Phase 5 rebuilds the remaining sections in the new style: About (grayscale photo, story, BJJ achievements as a stat strip, education, languages), Kind Words (one large editorial testimonial at a time), Credentials (divider rows), Contact ("Have a project in mind?" with the minimal underline form, keeping the existing Resend route), and the oversized outlined wordmark footer.
