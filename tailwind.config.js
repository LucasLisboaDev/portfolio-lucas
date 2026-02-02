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
        purple: {
          primary: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
        },
        teal: {
          primary: '#14B8A6',
          light: '#5EEAD4',
        },
        blue: {
          light: '#F0F9FF',
        },
      },
    },
  },
  plugins: [],
}
