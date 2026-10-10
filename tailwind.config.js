/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

/**
 * Colors come from CSS variables defined in app/globals.css (RGB channels), so
 * Tailwind opacity modifiers like `bg-ink/80` keep working and there is a single
 * source of truth for the palette. See design-tokens.md for usage rules.
 */
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Redesign palette (Dymas Alfin style) ─────────────────────────
        canvas: token('canvas'),
        surface: token('surface'),
        line: token('line'),
        ghost: token('ghost'),
        ink: {
          DEFAULT: token('ink'),
          soft: token('ink-soft'),
          muted: token('ink-muted'),
          surface: token('ink-surface'),
          line: token('ink-line'),
        },
        muted: token('muted'),
        accent: {
          DEFAULT: token('accent'),
          deep: token('accent-deep'),
          soft: token('accent-soft'),
        },
        status: token('status'),

        // ── Legacy slate palette ─────────────────────────────────────────
        // Still used by the current sections. Remove once every section has
        // been rebuilt in Phases 2 to 5.
        purple: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          primary: '#334155',
          light: '#64748B',
          dark: '#0F172A',
        },
        teal: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          primary: '#475569',
          light: '#94A3B8',
        },
        blue: {
          light: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-display)', ...defaultTheme.fontFamily.sans],
        // Static Archivo 800 at 112% width (7 KB, preloaded). Use for any
        // display text above the fold so the 88 KB variable font stays off
        // the critical path.
        headline: ['var(--font-headline)', 'var(--font-display)', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        // Fluid display sizes (desktop max, phones scale down with the viewport)
        hero: ['clamp(3rem, 9.4vw, 8.75rem)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        // Named "watermark" (not "ghost") so it does not collide with the ghost color
        watermark: ['clamp(5rem, 15vw, 14rem)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        contact: ['clamp(2.8rem, 7.2vw, 6.6rem)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        wordmark: ['clamp(3rem, 10.6vw, 9.6rem)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        // Section labels such as /SELECTED WORK
        section: ['2.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'section-sm': ['1.875rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        // Body and meta
        lead: ['1.0625rem', { lineHeight: '1.7' }],
        meta: ['0.8125rem', { lineHeight: '1.4' }],
      },
      maxWidth: {
        content: '1280px',
      },
      spacing: {
        gutter: '2.5rem', // 40px desktop side padding
        'gutter-sm': '1.25rem', // 20px phone side padding
        section: '10rem', // 160px desktop section rhythm
        'section-sm': '6rem', // 96px phone section rhythm
      },
      borderRadius: {
        card: '8px',
      },
      boxShadow: {
        float: '0 24px 60px rgb(10 9 9 / 0.35)',
        lift: '0 12px 32px rgb(10 9 9 / 0.08)',
      },
      transitionTimingFunction: {
        // Named so they do not override Tailwind's default ease-out / ease-in-out
        reveal: 'cubic-bezier(0.22, 1, 0.36, 1)', // ease-reveal: every reveal and hover
        page: 'cubic-bezier(0.65, 0, 0.35, 1)', // ease-page: page transitions, section inversion
      },
      transitionDuration: {
        fast: '250ms',
        base: '600ms',
        slow: '900ms',
      },
    },
  },
  plugins: [],
};
