/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#4ADE80',
          'green-dim': '#16a34a',
          bg: '#080C14',
          surface: '#0E1420',
          card: '#131B2E',
          border: '#1E2A42',
          text: '#E2E8F0',
          muted: '#64748B',
          accent: '#1E3A5F',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

