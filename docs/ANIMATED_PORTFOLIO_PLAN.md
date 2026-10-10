# Animated Portfolio Redesign Plan

**Project:** LucasLisboaDev.com (`portfolio-lucas`)
**Owner:** Lucas Lisboa Alves
**Design direction:** Dymas Alfin's editorial, monochrome, motion led style
**Status:** Planning
**Last updated:** October 10, 2026

---

## 1. Goal

Turn the current portfolio into an animated, editorial experience that feels calm, confident, and memorable, using the design language of Dribbble designer Dymas Alfin as the visual and UX reference. We borrow his patterns, palette, and motion logic. We do not copy any of his screens, and every word, number, and credential on the site stays true to Lucas's real work.

Success looks like this: a recruiter or client lands on the site, understands who Lucas is within five seconds, scrolls through a smooth sequence of sections that each reveal themselves with purpose, and leaves with a clear path to contact him or try the Maya voice agent. Under the hood, the site stays fast, accessible, and easy to update from the existing `data/` files.

## 2. What we are keeping, replacing, and fixing

The current site is a Next.js 14 App Router project with TypeScript and Tailwind. Its content model is solid and stays: `data/workExperience.ts`, `data/github-projects.ts` (including the rich `sections` used for case studies), `data/testimonials.ts`, `data/certificates.ts`, and `data/site.ts`. The API routes for contact, resume access, and resume download stay exactly as they are. The ElevenLabs voice agent (Maya) and its orb stay, restyled to match the new system.

The visual layer gets replaced. The 562 line WebGL `AnimatedGradient` background goes away in favor of a flat off white canvas, which alone should improve load and scroll performance. The navy and green tokens in `design-tokens.md`, the rounded slate cards, and the centered headings all give way to the new system described below.

A short audit of the current site also turned up issues we will fix along the way. The nav uses "Portfolio" for work experience and "Projects" for projects, which reads as the same thing twice. The Recent Works subtitle calls engineering roles "design projects." The hint "Move your mouse over the portrait" appears on phones, which have no mouse. Work experience entries have no dates, which the new Experience section needs. And the mobile page runs extremely long because every card renders fully expanded.

## 3. Design language

### 3.1 Principles

Clarity over decoration: every animation exists to reveal hierarchy or respond to the visitor, never just to move. Scale contrast does the talking: huge display type against small, quiet body copy. One motion language everywhere: the same easing, distances, and timing in every section so the site feels authored by one hand. Honest content only: no placeholder employers, no inflated year counts, no fake metrics. Motion is a layer, not a requirement: everything must read perfectly with animation turned off.

### 3.2 Color tokens

| Token | Hex | Use |
|---|---|---|
| `canvas` | `#FDFDFD` | Page background |
| `surface` | `#F4F2F0` | Cards, inputs, subtle panels |
| `line` | `#E5E2DF` | Dividers and row borders |
| `ghost` | `#EDEBEA` | Decorative watermark words only |
| `ink` | `#0A0909` | Primary text, dark pills, inverted sections |
| `muted` | `#707070` | Secondary text (4.9:1 on canvas, passes AA) |
| `accent-deep` | `#5E3A30` | Hover text, active states |
| `accent` | `#9C6455` | Links, highlights, small labels (6.2:1 on canvas) |
| `accent-soft` | `#CEB3A6` | Tags, focus rings, decorative only |
| `ink-muted` | `#A3A09D` | Secondary text inside dark sections |
| `status` | `#22C55E` | The "Available" dot only |

Photography and company logos render in grayscale by default and restore color on hover. This keeps Encountr's orange and Carnival's red from fighting the monochrome palette while still letting each brand be recognized.

### 3.3 Typography

Display type uses **Archivo** (variable, with its width axis pushed to expanded) at weight 700 to 800, set in all caps with tight tracking. Body and UI type keep **Inter**, which the site already loads. Both come through `next/font/google`, so there are no layout shifts from font swapping.

| Role | Size (desktop / mobile) | Notes |
|---|---|---|
| Hero name | `clamp(4rem, 12vw, 11rem)` | First name outlined, last name solid |
| Ghost word | `clamp(5rem, 16vw, 14rem)` | `ghost` color, sits behind section headings |
| Section label | 2rem / 1.5rem | Slash prefix, for example `/SELECTED WORK` |
| Card title | 1.5rem / 1.25rem | Archivo, sentence case |
| Body | 1rem / 1rem | Inter 400, line height 1.65 |
| Meta and tags | 0.8125rem | Inter 500, `muted` |

> **Beginner flag:** the outlined name effect uses `-webkit-text-stroke: 2px var(--ink)` with `color: transparent`. It is supported in every modern browser, but outlined text is harder to read at small sizes, so we only use it at hero scale and always keep the solid word next to it.

### 3.4 Shape, spacing, and components

Corners stay subtle: 8px on cards and inputs, fully rounded (999px) on pills. Sections get generous vertical space (160px desktop, 96px mobile) on a 1280px max width container with a 12 column grid. Buttons come in two forms: a dark `ink` pill with a small arrow icon for primary actions, and an outlined pill for secondary ones. Navigation links carry small superscript counts (Projects ⁰⁶) and the nav holds a green status pill reading "Open to opportunities." Lists use full width rows separated by `line` dividers instead of boxed cards wherever the content is a list.

## 4. Information architecture

The single page gets a clearer order, and each project gets its own case study page.

| # | Section | Source data | Key pattern |
|---|---|---|---|
| 01 | Nav | static | Wordmark, counted links, status pill, "Let's Talk" pill |
| 02 | Hero | static + portrait | Outlined LUCAS + solid LISBOA, grayscale portrait rising in, socials stacked right |
| 03 | /TALK TO MAYA | `site.ts` | Restyled orb, single dark pill to start the session |
| 04 | /SELECTED WORK | `github-projects.ts` | Ghost word PROJECTS, filter chips, card grid linking to case studies |
| 05 | /CAPABILITIES | new `data/capabilities.ts` | Accordion rows that invert on hover with a cursor following preview |
| 06 | /EXPERIENCE | `workExperience.ts` | Full dark section, staggered rows, logo preview follows cursor |
| 07 | /ABOUT | `About.tsx` content | Grayscale photo, story, BJJ achievements as a stat strip, education, languages |
| 08 | /KIND WORDS | `testimonials.ts` | One large editorial quote at a time with simple prev and next controls |
| 09 | /CREDENTIALS | `certificates.ts` | Divider rows: issuer on the left, title on the right |
| 10 | /CONTACT | `Contact.tsx` logic | "HAVE A PROJECT IN MIND?" headline, minimal underline form, social pills |
| 11 | Footer | static | Oversized outlined wordmark, links, copyright |

Case study pages live at `app/work/[slug]/page.tsx` and are statically generated from `githubProjects` using `generateStaticParams`. Each one opens with tag chips, the title followed by a small `/Case Study` label, a meta row (role, stack, year), Live Demo and GitHub pills, then renders the existing `sections` (architecture, stack, decisions, tables) in the editorial style, closes with a four card highlights row, and ends with a large "Next project" link that transitions into the following case study.

The Capabilities section replaces the "services" idea from the reference, because Lucas is presenting what he builds rather than selling packages. The four rows are AI Engineering and Agents, RAG and Data Pipelines, Full Stack Product, and iOS and Mobile, each previewing a real project from the data on hover.

## 5. Motion system

### 5.1 Libraries

We add **Motion** (the library formerly called Framer Motion, imported from `motion/react`) for reveals, staggers, layout animations, and page transitions, and **Lenis** for smooth, inertia style scrolling that the reference relies on. That is the entire motion stack. Both are tree shakable and together should add well under 60KB gzipped.

> **Beginner flag:** Motion's `whileInView` uses the browser's IntersectionObserver under the hood. Instead of listening to every scroll event (expensive), the browser tells us once when an element crosses into view, and Motion runs the animation then. That is why scroll reveals can stay smooth even on phones.

### 5.2 Motion tokens

| Token | Value | Use |
|---|---|---|
| `ease.out` | `[0.22, 1, 0.36, 1]` | Every reveal and hover |
| `ease.inOut` | `[0.65, 0, 0.35, 1]` | Page transitions, section inversion |
| `dur.fast` | 0.25s | Hovers, chips, icon nudges |
| `dur.base` | 0.6s | Standard reveal |
| `dur.slow` | 0.9s | Hero portrait, page transitions |
| `distance.reveal` | 24px | Fade up offset |
| `stagger.list` | 0.08s | Rows, cards, tags |
| `spring.cursor` | stiffness 300, damping 30 | Cursor following previews |

We deliberately keep fades shorter than the reference shot, where some transitions leave a nearly blank screen for a moment. No section should ever look empty while it animates.

### 5.3 Choreography by section

**Hero intro (plays once on load).** The nav fades in at 0s. The outlined first name slides up from behind a mask at 0.15s, letter by letter with a 0.03s stagger, and the solid last name follows at 0.35s. The grayscale portrait rises from 40px below with a fade at 0.5s over 0.9s. The role line, intro paragraph, and CTAs stagger in from 0.8s. The whole sequence finishes in under 1.6 seconds, and the hero text is real HTML from the first paint, so the animation never delays the Largest Contentful Paint.

**Scroll reveals.** Section labels, ghost words, rows, and cards fade up 24px as they enter, triggered once at 20% visibility. Ghost words also drift slightly slower than the page (a gentle parallax of about 10%) to add depth.

**Cursor following previews.** In Capabilities and Experience, hovering a row shows a small tilted image card (rotated about 6 degrees) that follows the pointer on a spring. Capabilities shows a related project cover, and Experience shows the company logo in grayscale. On touch devices the preview is replaced by an inline thumbnail inside the expanded row, because there is no cursor to follow.

**Section inversion.** As Experience scrolls past the middle of the viewport, the page background transitions from `canvas` to `ink` and the text from `ink` to `canvas`, then flips back after the section ends. This gives the long scroll a rhythm break, the same trick the reference uses.

**Accordions.** Capability rows expand with an animated height of 0.45s, and the arrow icon rotates 45 degrees into a close mark.

**Page transitions.** Moving from a project card into its case study uses a shared element transition on the card title (Motion's `layoutId`), while a full screen `ink` panel wipes upward over 0.5s. Returning reverses the motion.

> **Beginner flag:** a shared element transition means Motion measures where the title sits on the old page and where it sits on the new page, then animates between the two positions. The visitor sees the title travel instead of the page simply swapping.

**Hover micro interactions.** Pills shift their arrow icon 3px diagonally, cards lift 2px with a soft shadow, and links underline from left to right.

### 5.4 Reduced motion

When the visitor's system has `prefers-reduced-motion: reduce` turned on, Lenis is disabled, parallax and cursor previews are removed, page transitions become simple crossfades, and every reveal becomes an opacity change only. This is handled once in a `MotionProvider` using Motion's `MotionConfig reducedMotion="user"`, so individual components do not need their own checks.

## 6. Accessibility and performance budgets

Accessibility targets: WCAG 2.2 AA contrast for all real text (decorative ghost words are hidden from screen readers with `aria-hidden`), visible focus rings in `accent-soft`, full keyboard support for the accordion, testimonial controls, filters, and the voice agent button, and semantic landmarks with one `h1` per page.

Performance targets on a mid range mobile profile: Lighthouse performance score of 90 or higher, Largest Contentful Paint under 2.5 seconds, Cumulative Layout Shift under 0.05, and Interaction to Next Paint under 200 milliseconds. All images go through `next/image` with explicit sizes, and the portrait gets `priority` loading.

> **Beginner flag:** Cumulative Layout Shift measures how much content jumps around while the page loads. Animations that move elements with `transform` and `opacity` do not count against it, but animations that change `top`, `height`, or `margin` can. That is why every reveal in this plan uses transforms.

## 7. Technical architecture

New and changed files, grouped by role:

```
app/
  layout.tsx                 fonts (Archivo + Inter), MotionProvider, SmoothScroll
  page.tsx                   new section order, AnimatedGradient removed
  work/[slug]/page.tsx       statically generated case studies
  template.tsx               page transition wrapper
components/
  motion/
    MotionProvider.tsx       MotionConfig + reduced motion handling
    SmoothScroll.tsx         Lenis setup, disabled for reduced motion
    Reveal.tsx               fade up on enter
    Stagger.tsx              staggered children
    CursorPreview.tsx        spring driven floating image
    useSectionInversion.ts   canvas to ink background switch
  ui/
    SectionHeading.tsx       slash label + ghost word
    PillButton.tsx           primary and secondary pills with arrow
    StatusPill.tsx           green dot + label
    Tag.tsx                  chip used in cards and case studies
  sections/
    Nav.tsx  Hero.tsx  TalkToMaya.tsx  SelectedWork.tsx  Capabilities.tsx
    Experience.tsx  About.tsx  KindWords.tsx  Credentials.tsx  Contact.tsx  Footer.tsx
  case-study/
    CaseHeader.tsx  CaseSections.tsx  CaseHighlights.tsx  NextProject.tsx
data/
  capabilities.ts            new
  workExperience.ts          add role, company, start, end fields
  github-projects.ts         add category, year, role, cover fields
tailwind.config.js           design tokens from section 3
design-tokens.md             rewritten to match this plan
```

The existing `MayaOrb.tsx`, `ResumeAccess.tsx`, and the voice session logic inside `Hero.tsx` move into `TalkToMaya.tsx` largely unchanged, with only their styling updated. The old `Portfolio.tsx`, `RecentProjects.tsx`, `animated-gradient.tsx`, and `interactive-tilt-avatar.tsx` are deleted once their replacements ship.

## 8. Delivery phases

Work happens on a branch named `redesign/animated-dymas-style`. Each phase ends with Playwright screenshots at desktop (1440px) and mobile (390px) widths, a short recorded scroll of the animations, and a written debrief covering the engineering decisions made, the metrics measured, and the lessons learned.

**Phase 0: Foundation.** Create the branch, install `motion` and `lenis`, add the color, type, spacing, and motion tokens to Tailwind and CSS variables, load Archivo alongside Inter, rewrite `design-tokens.md`, and remove the animated gradient background. Done when the site builds, the tokens are usable as Tailwind classes, and a baseline Lighthouse score is recorded for comparison.

**Phase 1: Motion primitives.** Build `MotionProvider`, `SmoothScroll`, `Reveal`, `Stagger`, `CursorPreview`, `SectionHeading`, `PillButton`, `StatusPill`, and `Tag`, plus a hidden `/lab` route that shows each primitive in isolation. Done when every primitive works with reduced motion on and off, and with keyboard and touch input.

**Phase 2: Nav, Hero, and Maya.** Build the counted nav with status pill and mobile menu, the hero with its intro choreography and grayscale portrait, and restyle the Maya voice section. Done when the hero sequence finishes under 1.6 seconds, LCP stays under 2.5 seconds on mobile, and the voice agent still connects and ends sessions correctly.

**Phase 3: Selected Work and case studies.** Extend the project data, build the filterable card grid, generate the case study pages, and wire up the shared title transition and next project link. Done when all six projects have working case study URLs, filters animate with layout transitions, and back navigation restores the scroll position.

**Phase 4: Capabilities and Experience.** Add `capabilities.ts` and dates to the experience data, build the accordion with cursor previews, and build the dark Experience section with the background inversion. Done when the inversion triggers reliably in both scroll directions and touch devices get the inline thumbnail fallback.

**Phase 5: About, Kind Words, Credentials, Contact, and Footer.** Rebuild the remaining sections in the new style and restyle the contact form without changing its API route. Done when the contact form still sends through Resend, the testimonial controls work by keyboard, and the footer wordmark scales cleanly on every width.

**Phase 6: Polish and launch.** Run a full accessibility pass (axe plus manual keyboard and screen reader checks), tune performance against the budgets in section 6, test on real iOS Safari and Android Chrome, capture final visual snapshots, then merge and deploy. Done when every budget is met and the final debrief is written.

## 9. Content rules

Every claim on the site must be something Lucas can stand behind in an interview. Year counts are calculated from real start dates. Experience rows list only real roles. Project metrics come from the project write ups themselves (for example, the 180 run comparison study in offline-llm-engineering). Testimonials stay word for word with the author's name and title. Nothing gets filled with sample text "for now."

## 10. Open questions

1. **Project covers.** The projects currently have no images. Options are screenshots of the live demos, simple typographic covers generated in the brand palette, or architecture diagrams. Screenshots will feel most real.
2. **Experience dates.** The start and end month for each role need to be added to `workExperience.ts`.
3. **Hero portrait.** `lucas-professional2-cutout.png` is the natural fit for the rising grayscale portrait. Confirm, or provide a newer cutout.
4. **Capabilities copy.** A sentence for each of the four capability rows, ideally in Lucas's own words.
5. **Deployment and push access.** The Claude GitHub App needs repository access before branches can be pushed from this workspace. Until then, changes stay local and can be delivered as a zip.

## 11. Definition of done

The redesign is finished when the site reads as one confident, editorial, motion led experience in Dymas Alfin's style, every section and case study is built from real data, all accessibility and performance budgets in section 6 are met, the voice agent, resume access, and contact form all still work, and a debrief exists for every phase.
