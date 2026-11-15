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
        autoverse: {
          bg: '#0B0D11',
          surface: '#12151C',
          elevated: '#181C26',
          overlay: '#202533',
          border: '#262C3D',
          borderLight: '#343D54',
          cyan: '#00F0FF',
          cyanGlow: 'rgba(0, 240, 255, 0.25)',
          cyanDark: '#008B99',
          amber: '#F59E0B',
          emerald: '#10B981',
          rose: '#F43F5E',
          purple: '#A855F7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

