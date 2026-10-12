# Design Tokens

The portfolio follows an editorial, monochrome, motion led style inspired by Dribbble designer Dymas Alfin. These tokens are the single source of truth. Colors live as CSS variables in `app/globals.css`, Tailwind exposes them as classes through `tailwind.config.js`, and motion values live in `lib/motion.ts`. The full design rationale is in `docs/ANIMATED_PORTFOLIO_PLAN.md`.

## Color

| Token | Hex | Tailwind | Use |
|---|---|---|---|
| canvas | `#FDFDFD` | `bg-canvas` | Page background |
| surface | `#F4F2F0` | `bg-surface` | Cards, inputs, subtle panels |
| line | `#E5E2DF` | `border-line` | Dividers and row borders |
| ghost | `#EDEBEA` | `text-ghost` | Decorative watermark words only, always `aria-hidden` |
| ink | `#0A0909` | `text-ink`, `bg-ink` | Primary text, dark pills, inverted sections |
| ink soft | `#4A4645` | `text-ink-soft` | Long-form body copy |
| muted | `#707070` | `text-muted` | Secondary text on the canvas (4.9:1, passes AA). Not on `surface` (4.43:1): use ink soft there |
| ink muted | `#A3A09D` | `text-ink-muted` | Secondary text inside dark sections |
| ink surface | `#1B1817` | `bg-ink-surface` | Cards inside dark sections |
| ink line | `#2A2726` | `border-ink-line` | Dividers inside dark sections |
| accent | `#9C6455` | `text-accent` | Section labels, links, small highlights (6.2:1) |
| accent deep | `#5E3A30` | `text-accent-deep` | Hover and active states |
| accent soft | `#CEB3A6` | `text-accent-soft` | Focus rings and decoration only, never body text |
| status | `#22C55E` | `bg-status` | The "Open to opportunities" dot only |

Photography and company logos render in grayscale by default and restore their color on hover.

## Typography

All fonts are self-hosted in `app/fonts` (SIL Open Font License) and loaded with `next/font/local`. There are three files:

| File | What it is | Size | Loading |
|---|---|---|---|
| `Archivo-Headline-800-112.woff2` | Static Archivo, weight 800, width 112%, overlaps merged, Basic Latin | 7 KB | Preloaded |
| `Archivo-Variable-latin.woff2` | Full variable Archivo, weight 100 to 900, width 62 to 125% | 88 KB | On first use |
| `Inter-Variable-latin.woff2` | Variable Inter, weight 100 to 900 | 47 KB | Preloaded |

`text-display` and `text-outline` use the headline file, which is all the hero needs. `stretch-normal` and the `font-display` Tailwind family use the variable file. For display text above the fold, prefer `text-display` or `font-headline` so the 88 KB file stays off the critical path. Do not add "Arial Black" to a `next/font` fallback list: it is written unquoted into a CSS variable and the minifier reads "Black" as a color, which breaks the whole font stack.

| Role | Font | Class | Size |
|---|---|---|---|
| Hero name | Archivo 800, width 112%, caps | `text-display text-hero` | `clamp(3rem, 9.4vw, 8.75rem)` |
| Ghost word | Archivo 800, caps | `text-display text-watermark text-ghost` | `clamp(5rem, 15vw, 14rem)` |
| Section label | Archivo 800, width 100%, caps | `text-display stretch-normal text-section` | 44px desktop, 30px phone |
| Contact headline | Archivo 800, caps | `text-display text-contact` | `clamp(2.8rem, 7.2vw, 6.6rem)` |
| Footer wordmark | Archivo 800, caps, outlined | `text-display text-outline text-wordmark` | `clamp(3rem, 10.6vw, 9.6rem)` |
| Card title | Archivo 700 | `font-display font-bold` | 24px |
| Body | Inter 400 | `font-sans text-lead` | 17px, line height 1.7 |
| Meta and tags | Inter 500 | `text-meta font-medium` | 13px |

The outlined word effect (`text-outline`) is only used at headline scale and always next to a solid word, because outlined text gets hard to read when it is small.

## Shape and layout

Cards and inputs use an 8px radius (`rounded-card`), pills are fully rounded (`rounded-full`). Content sits in a 1280px container (`max-w-content`) with 40px side padding on desktop (`px-gutter`) and 20px on phones (`px-gutter-sm`). Sections are spaced 160px apart on desktop (`py-section`) and 96px on phones (`py-section-sm`). Lists use full width divider rows instead of boxed cards. Shadows are reserved for floating elements: `shadow-float` for cursor previews and `shadow-lift` for hovered cards.

## Buttons

The primary button is a dark `ink` pill with a small diagonal arrow icon that nudges 3px up and right on hover. The secondary button is an outlined pill that fills with `ink` on hover. Both have at least a 44px touch target.

## Motion

| Token | Value | Tailwind / CSS | Use |
|---|---|---|---|
| ease reveal | `cubic-bezier(0.22, 1, 0.36, 1)` | `ease-reveal`, `--ease-reveal` | Every reveal and hover |
| ease page | `cubic-bezier(0.65, 0, 0.35, 1)` | `ease-page`, `--ease-page` | Page transitions, section inversion |
| fast | 250ms | `duration-fast` | Hovers, chips, icon nudges |
| base | 600ms | `duration-base` | Standard reveal |
| slow | 900ms | `duration-slow` | Hero portrait, page transitions |
| reveal distance | 24px | `distance.reveal` | Fade-up offset |
| list stagger | 80ms | `stagger.list` | Rows, cards, tags |
| cursor spring | stiffness 300, damping 30 | `spring.cursor` | Cursor-following previews |

Animations only move `transform` and `opacity`, so they never cause layout shift. When the visitor has reduced motion turned on, `app/globals.css` collapses all CSS animation, and the Motion provider (Phase 1) does the same for JavaScript animation.
