/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // The six vars below are admin-editable (frontend/lib/theme.ts, /admin/settings)
        // and injected at request time in app/layout.tsx. Token *names* here stay the
        // same as before on purpose, so existing bg-brand-red/text-brand-blue/etc.
        // classes across the app keep working unchanged — only the underlying value
        // became dynamic. blueDark/blueDarker are derived shades of the single stored
        // "secondary" color via color-mix(), since the admin form only stores one hex
        // per role.
        brand: {
          red: 'var(--color-primary)',
          redDark: 'var(--color-primary-dark)',
          black: '#171717',
          charcoal: '#2A2A2A',
          blue: 'var(--color-secondary)',
          blueDark: 'color-mix(in srgb, var(--color-secondary) 82%, black)',
          blueDarker: 'color-mix(in srgb, var(--color-secondary) 68%, black)',
          navy: 'var(--color-dark)',
          border: '#E9EDF2',
          footerText: '#D9DEE6',
          slate: 'var(--color-muted)',
          mist: 'var(--color-surface)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        ring: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(-15deg)' },
          '20%': { transform: 'rotate(12deg)' },
          '30%': { transform: 'rotate(-10deg)' },
          '40%': { transform: 'rotate(8deg)' },
          '50%': { transform: 'rotate(0deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        ring: 'ring 2.2s ease-in-out infinite',
        fadeIn: 'fadeIn 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
