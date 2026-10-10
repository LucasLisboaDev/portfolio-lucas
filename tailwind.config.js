/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Professional slate / charcoal palette (replaces previous purple/teal brand)
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
    },
  },
  plugins: [],
}
