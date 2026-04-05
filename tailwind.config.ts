import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#00af51',
          light: '#00d462',
          dark: '#008a40',
        },
        yellow: {
          DEFAULT: '#f4ee19',
        },
        black: {
          DEFAULT: '#0d0d0d',
        },
        surface: {
          DEFAULT: '#141414',
          2: '#1a1a1a',
          3: '#202020',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          green: 'rgba(0,175,81,0.28)',
        },
      },
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
        sans: ['Work Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        xl: '22px',
      },
      boxShadow: {
        green: '0 8px 32px rgba(0,175,81,0.18)',
      },
      animation: {
        fadeUp: 'fadeUp 0.3s ease both',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
