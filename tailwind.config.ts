import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/content/**/*.{md,mdx,json}'
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1320px' }
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        'muted-fg': 'hsl(var(--muted-fg))',
        card: 'hsl(var(--card))',
        'card-fg': 'hsl(var(--card-fg))',
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        brand: {
          50: '#fff8eb',
          100: '#ffe9c2',
          200: '#ffd388',
          300: '#ffb84d',
          400: '#ff9d24',
          500: '#f57f04',
          600: '#d96303',
          700: '#b44a07',
          800: '#923a0d',
          900: '#78310f',
          DEFAULT: '#f57f04',
          fg: '#1a0e00'
        },
        accent: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce1ff',
          300: '#8ecdff',
          400: '#58aeff',
          500: '#308dff',
          600: '#1a6df0',
          700: '#1456dc',
          800: '#1747b2',
          900: '#19408c',
          DEFAULT: '#308dff'
        },
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#ef4444'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
        mono: ['var(--font-mono)', 'monospace']
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem'
      },
      boxShadow: {
        soft: '0 6px 24px -8px rgba(15, 23, 42, 0.18)',
        ring: '0 0 0 4px rgba(245, 127, 4, 0.25)'
      },
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      animation: {
        shine: 'shine 6s linear infinite',
        float: 'float 4s ease-in-out infinite'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
