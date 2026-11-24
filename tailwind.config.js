/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'phone-landscape': { 'raw': '(max-height: 500px) and (orientation: landscape)' },
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Gran Turismo Workstation Semantic Tokens
        gt: {
          obsidian: 'var(--surface-obsidian)',
          basalt: 'var(--surface-basalt)',
          graphite: 'var(--surface-graphite)',
          raised: 'var(--surface-graphite-raised)',
          border: 'var(--border-hairline)',
          'border-glass': 'var(--border-glass)',
          accent: 'var(--accent)',
          'accent-hover': 'var(--accent-hover)',
          info: 'var(--info)',
          ok: 'var(--ok)',
          warn: 'var(--warn)',
          error: 'var(--error)',
          text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
            disabled: 'var(--text-disabled)',
          }
        },
        // Backwards compatibility mapping for existing components
        autoverse: {
          bg: 'var(--surface-obsidian)',
          surface: 'var(--surface-basalt)',
          elevated: 'var(--surface-graphite)',
          overlay: 'var(--surface-graphite-raised)',
          border: 'var(--border-hairline)',
          borderLight: '#2C3442',
          cyan: 'var(--accent)', // Redirects legacy cyan highlights to motorsport accent
          cyanGlow: 'rgba(229, 57, 53, 0.25)',
          cyanDark: '#B91C1C',
          amber: 'var(--warn)',
          emerald: 'var(--ok)',
          rose: 'var(--error)',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
        display: ['Chakra Petch', 'Inter', 'sans-serif']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 180ms cubic-bezier(0, 0, 0.2, 1)',
        'slide-up': 'slideUp 240ms cubic-bezier(0, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      zIndex: {
        canvas: '0',
        'scene-overlay': '10',
        panel: '20',
        header: '30',
        drawer: '40',
        modal: '50',
        toast: '60',
        palette: '70',
      }
    },
  },
  plugins: [],
}
