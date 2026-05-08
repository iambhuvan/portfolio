import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#000000',
          800: '#040603',
          700: '#070b03',
          600: '#0a1006',
        },
        // NOTE: 'amber' tokens repurposed as NVIDIA-green shades site-wide.
        amber: {
          50: '#f3fbe6',
          100: '#eaf6d6',
          200: '#d0ee9c',
          300: '#b6e068',
          400: '#98cf30',
          500: '#80c310',
          600: '#76b900',
          700: '#5d9300',
          800: '#466e00',
          900: '#324d00',
        },
        nv: {
          50: '#f3fbe6',
          100: '#eaf6d6',
          200: '#cfeb96',
          300: '#9ad03d',
          400: '#80c310',
          500: '#76b900',
          600: '#5d9300',
          700: '#466e00',
          800: '#324d00',
          900: '#1f2e00',
        },
        ember: '#76b900',
        gold: '#9aef00',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.05em',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 8s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
