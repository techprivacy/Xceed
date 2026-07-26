// The brand palette is driven by CSS custom properties holding full hex values
// (see lib/theme.ts). Tailwind cannot splice an alpha channel into a bare
// `var(--x)`, so utilities like `bg-brand-red/10` used to compile to *nothing*
// and the element rendered with no background at all. Routing every themed
// color through color-mix() restores the whole `/<opacity>` family while
// keeping the stored values as plain hex.
const withAlpha = (variable) => ({ opacityValue } = {}) =>
  opacityValue === undefined
    ? `var(${variable})`
    : `color-mix(in srgb, var(${variable}) calc(${opacityValue} * 100%), transparent)`;

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
          red: withAlpha('--color-primary'),
          redDark: withAlpha('--color-primary-dark'),
          black: '#000000',
          charcoal: '#111111',
          blue: withAlpha('--color-secondary'),
          blueDark: 'color-mix(in srgb, var(--color-secondary) 82%, black)',
          blueDarker: 'color-mix(in srgb, var(--color-secondary) 68%, black)',
          navy: withAlpha('--color-dark'),
          border: '#2A2A2A',
          footerText: '#F3F4F6',
          slate: withAlpha('--color-muted'),
          mist: withAlpha('--color-surface'),
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
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
        // Keyframes for these live in app/globals.css alongside the
        // prefers-reduced-motion opt-out that disables them.
        floatSoft: 'floatSoft 3.6s ease-in-out infinite',
        haloPulse: 'haloPulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
