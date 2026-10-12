# Phase 6 Debrief: Polish and Launch

**Branch:** `redesign/animated-portfolio`
**Commit:** `5cd9fa8`
**Date:** October 12, 2026

## What shipped

This phase was about the details a visitor notices without thinking about them, plus making the site faster and safer to merge.

**An icon.** The site now has an LL monogram favicon in ink and off white, in three forms: a crisp SVG for modern browsers, a classic `favicon.ico` for older browsers and crawlers, and a 180 pixel icon for when someone saves the site to an iPhone home screen. The letters are drawn from the same Archivo headline font as the hero, so the icon belongs to the brand rather than sitting next to it. This also cleared the last Best Practices deduction in Lighthouse (96 to 100).

**Social preview images.** When someone pastes your link into LinkedIn, iMessage, Slack or WhatsApp, they now see a designed card instead of a blank box. The homepage card is the hero in miniature: LUCAS outlined over LISBOA in solid, your grayscale portrait beside it, and "AI Engineer" underneath. Every case study gets its own card in the same dark or light tone as its project card on the homepage, with the outlined last line, the category, the live site, and the one line pitch. All seven images are generated once at build time. You can see them in `docs/screenshots/social-preview-*.jpg`.

> **Beginner flag:** these are called Open Graph images. A site lists them in `<meta property="og:image">` tags, and apps that unfurl links fetch that image to build the preview card.

**Search engine basics.** The site now publishes a `sitemap.xml` (the homepage and all six case studies) and a `robots.txt` that points crawlers at it and keeps them out of the API routes. Each case study declares a canonical address, so search engines never treat a copy of it as a separate page.

**A real 404 page.** Mistyped links used to land on Next.js's plain default page. Now they get a branded one: a huge outlined 404, "This page wandered off.", and two buttons back to the homepage and the work section. The default page also had no main landmark, which the accessibility scan flagged as soon as I pointed it at a missing page.

**The internal test page is gone.** `/lab`, the hidden page I used to test motion components in Phase 1, has been removed so nothing unfinished ships to your live site.

## Performance work

The budget from the plan was a Largest Contentful Paint under 2.5 seconds on Lighthouse's simulated phone. Three changes did most of the work.

**1. Trimmed fonts.** The display font was the full variable Archivo, which carries every width from condensed to expanded and every weight from 100 to 900. The site only ever uses it at normal width and weights 600 to 800. A script now cuts it down to exactly that, taking it from 88 KB to 23 KB. Inter got the same treatment (weights 400 to 700, 47 KB to 35 KB). The full source fonts are kept in `scripts/font-sources` so the trimmed ones can be rebuilt if a future design needs another weight.

> **Beginner flag:** a variable font stores a design space (for example, every weight between thin and black) in one file. Instancing pins or narrows those axes, which removes the data the site never asks for.

**2. A hidden 30 KB of animation code.** The site has used Motion's "lazy" setup since Phase 1: small `m` components on the page, with the heavy features (layout animations, drag, gestures) meant to download a moment after the page is interactive. While tracing the bundle this phase, I found that promise was not being kept. The `motion/react` entry point in the version we use re-exports its parent package and then reads one property from it at the top of the file. That single line tells the bundler the full feature set is in use, so all of it was packed into the first download anyway, and the lazy chunk was an empty 221 byte file. A one line alias in `next.config.js` points `motion/react` at the parent package directly, at the exact same pinned version, so tree shaking works again. The homepage's first load JavaScript dropped from 178 KB to 153 KB and the case studies from 146 KB to 116 KB, with every animation test still passing. The comment in `next.config.js` explains why, so the alias can be removed once Motion fixes its entry file.

> **Beginner flag:** tree shaking is the bundler removing code you import but never use. It only works when the bundler can prove a piece is unused, and one top level line that touches it is enough to keep the whole piece in.

**3. Case study text visible at first paint.** On phones, Lighthouse picked the case study summary paragraph as the largest element. It sat inside a scroll reveal that starts at opacity 0 and only fades in once JavaScript loads, so the browser could not count it as painted until about a second in. The case study header now uses a CSS entrance that slides text up 28 pixels without fading it. The motion feels the same, but the text is visible from the first frame and needs no JavaScript. Transforms never cause layout shift, so CLS stays at 0.

Two smaller changes: images are now served as AVIF where the browser supports it (the hero portrait went from about 60 KB to 38 KB on phones), and the Lighthouse runs no longer see a missing favicon request.

## Accessibility

**Keyboard focus on invisible controls.** I added a keyboard walk to the test suite that presses Tab through every page at desktop and phone sizes and checks that each focused element is on screen, fully visible and showing a focus ring. On phones, it caught two filter chips that received focus while still invisible: pressing Tab scrolls a control only to the very edge of the screen, which was not far enough to trigger their reveal. Reveal and Stagger now reveal immediately when focus lands inside them, so a keyboard user can never be on a control they cannot see. After the fix, all 54 desktop stops and 49 phone stops on the homepage pass, as do the case studies and the 404.

**Full scan.** The axe-core full scan (scroll everything into view, open every accordion, then test) reports 0 violations on the homepage, three case studies and the 404 page, at desktop and phone sizes. Lighthouse accessibility is 100 on every page measured.

## Testing

| Check | Result |
|---|---|
| Phase 2 suite: hero intro, voice library lazy loaded, resume dialog, mobile menu | passing |
| Phase 3 suite: filters with layout animation, page transitions, title morph, scroll restore | passing (layout animations confirmed working with the split out feature bundle) |
| Phase 4 suite: Experience inversion, Capabilities accordion, anchors, reduced motion | passing |
| Phase 5 suite: testimonials, form validation, mocked send and failure, footer wordmark | passing |
| Keyboard walk (new) | every stop visible with a focus ring, desktop and phone |
| axe-core full scan | 0 violations on 5 pages at 2 sizes |
| Icons and metadata | favicon.ico, icon.svg, apple-icon.png, robots.txt, sitemap.xml and 7 social images all return 200; og and twitter tags present on every page |
| 404 | unknown paths return status 404 with the branded page |
| Vercel | previews are building again; this commit deployed successfully |

## Metrics

Lighthouse 12, mobile profile, Phase 5 rebuilt from its commit and measured side by side with Phase 6, alternating, five rounds each.

| Homepage (median) | Phase 5 | Phase 6 |
|---|---|---|
| Performance | 91 | 97 |
| Accessibility | 100 | 100 |
| Best practices | 96 | 100 |
| SEO | 100 | 100 |
| First Contentful Paint | 1.58 s | 1.38 s |
| Largest Contentful Paint | 3.35 s | 2.58 s |
| Total Blocking Time | 74 ms | 48 ms |
| Cumulative Layout Shift | 0 | 0 |
| First load JavaScript (build) | 179 KB | 153 KB |
| Total page weight | 417 KB | 316 KB |

| Case studies (median) | Phase 5 | Phase 6 |
|---|---|---|
| Performance | 88 to 90 | 94 to 96 |
| Largest Contentful Paint | 3.35 to 3.37 s | 2.39 to 2.50 s |
| Page weight | 356 KB | 279 KB |

**Where the 2.5 second budget stands.** The case studies are now inside it. The homepage sits at 2.58 seconds, just over. I also measured with Lighthouse's other mode, which actually slows the network and CPU down instead of estimating, and both versions land at about 2.0 seconds there. The difference is how the simulated mode works: it counts every file the browser requested before the largest element painted, and on the homepage that element is the navigation text, painted almost immediately, so the estimate is mostly a measure of the total bytes requested early. In a real browser the page's largest element appears with the first paint. I stopped here rather than cut features for the last 80 milliseconds of an estimate.

One number to keep an eye on: in the slowed down mode, Total Blocking Time varied a lot from run to run (medians of 210 ms for Phase 5 and 307 ms for Phase 6, including one outlier run), while the simulated mode showed it improving. The JavaScript is the same size overall; it now runs in two smaller pieces instead of one. Real visitor data from Vercel Speed Insights would settle it, if you want to turn that on.

## What I could not do from here

**Testing on a real iPhone and Android phone.** I test with a real Chromium browser at phone sizes, with touch enabled, but not on actual devices, and my environment cannot open your Vercel preview links. The Phase 6 preview is live at `portfolio-lucas-qebl0rinb-lucas-projects-882b20a0.vercel.app`. A ten minute pass on your phone would cover what I cannot:

On iPhone Safari, check that the hero intro plays smoothly, that the page transition into a case study and back works (Safari added View Transitions in version 18; older versions simply switch pages instantly, which is the intended fallback), that the mobile menu opens and locks scrolling, and that Talk to Maya asks for the microphone and connects. Then add the site to your home screen and look at the icon. On Android Chrome, check the same, plus the back gesture from a case study landing you where you left off. Finally, paste the preview link into a LinkedIn draft or a WhatsApp chat to see the social card.

## Things for you to decide or provide

These have been open for a while and do not block the merge, but the site gets better with each one:

1. **Spark Founders dates**, which are still missing from Experience.
2. **The Capabilities copy**, which is still my draft.
3. **Your Encountr title**: the resume says "Software Engineer / AI Developer".
4. **Real project covers**, if you would like screenshots instead of the typographic covers.
5. **One project title**: "offline-llm-engineering" displays as its repository name (lowercase with hyphens) on its card, page title and social card, while the others have proper titles. A display title would read better.
6. **A custom domain**, if you get one: set `NEXT_PUBLIC_SITE_URL` in Vercel and the social images, sitemap and canonical links all follow.

## Engineering decisions worth remembering

**Drawing type as shapes for the social images.** The image generator inside Next.js cannot draw outlined text, cannot read variable fonts and cannot read WOFF2 files. Instead of giving up the outlined style, `scripts/build-brand-assets.py` extracts the headline font's letter outlines and kerning into a small JSON file, and the images draw each letter as an SVG shape. The cards therefore use exactly the same letterforms, spacing and outline weight as the site.

**One script for every generated asset.** The trimmed fonts, the icon files, the glyph data and the grayscale portrait for the social card all come from one documented script, and the outputs are committed. Nothing new runs during the Vercel build, but none of these files is a mystery either.

**Preview builds point at themselves.** Social image URLs need a full address. In production that is your live domain; on a Vercel preview it is the preview's own address, so a shared preview link shows its own card instead of production's.

## Lessons

**Check that an optimization is still doing its job.** The lazy animation setup was right when it went in and measured well at the time, but a packaging detail in a library meant it had quietly stopped doing anything. It only surfaced because I looked at what was inside each bundle file instead of at the total.

**A reveal animation is part of accessibility, not just decoration.** Content that waits for scrolling to appear works for a mouse, but the keyboard moves differently, and the reveal has to know about focus.

**Know what a metric is measuring before chasing it.** The simulated LCP on the homepage turned out to be mostly a count of early bytes. Cutting 100 KB moved it 0.8 seconds. The last 80 milliseconds would have meant removing things visitors actually see.

## Merge

The pull request from `redesign/animated-portfolio` into `main` is open. Merging it publishes the redesign to `portfolio-lucas-henna.vercel.app`. Every phase deployed as a preview first, so the production build will be identical to the preview you can check now.
