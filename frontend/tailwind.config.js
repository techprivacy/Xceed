/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E30613',
          redDark: '#B8050F',
          black: '#171717',
          charcoal: '#2A2A2A',
          blue: '#0F4AA6',
          blueDark: '#0A3578',
          blueDarker: '#083D8C',
          navy: '#071C3A',
          border: '#E9EDF2',
          footerText: '#D9DEE6',
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
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(15, 74, 166, 0.55)' },
          '50%': { boxShadow: '0 0 0 6px rgba(15, 74, 166, 0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        ring: 'ring 2.2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 1.8s ease-in-out infinite',
        fadeIn: 'fadeIn 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
