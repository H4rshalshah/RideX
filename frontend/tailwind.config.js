/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ui: {
          canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
          card: 'rgb(var(--color-card) / <alpha-value>)',
          card2: 'rgb(var(--color-card2) / <alpha-value>)',
          line: 'rgb(var(--color-line) / <alpha-value>)',
          ink: 'rgb(var(--color-ink) / <alpha-value>)',
          muted: 'rgb(var(--color-muted) / <alpha-value>)',
          faint: 'rgb(var(--color-faint) / <alpha-value>)',
          accent: 'rgb(var(--color-accent) / <alpha-value>)',
          onaccent: 'rgb(var(--color-onaccent) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.05)',
        lift: '0 4px 12px rgba(0, 0, 0, 0.10), 0 16px 40px rgba(0, 0, 0, 0.14)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
