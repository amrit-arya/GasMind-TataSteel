/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#F8F9FA',
        surface: {
          DEFAULT: '#FFFFFF',
          dim: '#F1F3F5',
          bright: '#FFFFFF',
          lowest: '#FFFFFF',
          low: '#F8F9FA',
          container: '#F1F3F5',
          high: '#E9ECEF',
          highest: '#DEE2E6',
          sidebar: '#0F172A'
        },
        'on-surface': {
          DEFAULT: '#0F172A',
          variant: '#475569'
        },
        outline: {
          DEFAULT: '#CBD5E1',
          variant: '#E2E8F0'
        },
        primary: {
          DEFAULT: '#FF6B00',
          light: '#FF9E00',
          dark: '#E65100',
          container: '#FFF3E0',
          fire: '#FF3D00'
        },
        secondary: {
          DEFAULT: '#059669',
          container: '#D1FAE5'
        },
        tertiary: {
          DEFAULT: '#D97706',
          container: '#FEF3C7'
        },
        critical: {
          DEFAULT: '#DC2626',
          container: '#FEE2E2'
        },
        'action-orange': '#FF6B00'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Hanken Grotesk', 'sans-serif']
      },
      borderRadius: {
        'industrial': '6px'
      }
    },
  },
  plugins: [],
}
