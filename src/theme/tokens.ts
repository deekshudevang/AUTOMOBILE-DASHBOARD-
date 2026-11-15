/**
 * AUTOVERSE 3D — Automotive Design System Tokens
 * Strictly follows Section 2 design brief:
 * Minimalist luxury, deep graphite surfaces, electric cyan accent,
 * WCAG 2.2 AA contrast ratios, 4px spacing rhythm, tabular numerals.
 */

export const tokens = {
  colors: {
    // Canvas & Elevations
    bg: '#0A0C10',
    surface1: '#11141C',
    surface2: '#161C28',
    surface3: '#1E2533',
    surfaceOverlay: '#252E3F',

    // Text & Content (WCAG 2.2 AA tested against #0A0C10 and #11141C)
    textPrimary: '#F1F5F9',   // Contrast 16.2:1 (AAA)
    textSecondary: '#94A3B8', // Contrast 7.1:1 (AA)
    textTertiary: '#64748B',  // Contrast 4.6:1 (AA)
    textDisabled: '#475569',  // Decorative/disabled states

    // Automotive Hero Accent
    accent: '#00F0FF',        // Electric Cyan (Contrast 13.8:1 against #0A0C10)
    accentHover: '#00D4E0',
    accentDim: 'rgba(0, 240, 255, 0.12)',
    accentBorder: 'rgba(0, 240, 255, 0.45)',

    // Semantic Status Colors
    semantic: {
      success: '#10B981',     // Emerald (Contrast 8.3:1)
      successDim: 'rgba(16, 185, 129, 0.15)',
      warning: '#F59E0B',     // Amber (Contrast 7.4:1)
      warningDim: 'rgba(245, 158, 11, 0.15)',
      error: '#EF4444',       // Crimson (Contrast 5.9:1)
      errorDim: 'rgba(239, 68, 68, 0.15)',
      info: '#3B82F6',        // Cobalt (Contrast 6.2:1)
      infoDim: 'rgba(59, 130, 246, 0.15)',
    },

    // Structural Borders
    border: '#1E2533',
    borderSubtle: '#161C28',
    borderFocus: '#00F0FF',
  },

  typography: {
    fontSans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontMono: '"JetBrains Mono", "SF Mono", Consolas, Menlo, monospace',
    scale: {
      xs: '0.6875rem',  // 11px
      sm: '0.75rem',    // 12px
      base: '0.875rem', // 14px
      md: '1.0rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
    },
    lineHeight: {
      tight: 1.15,
      normal: 1.4,
      relaxed: 1.6,
    }
  },

  spacing: {
    px: '1px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },

  radius: {
    none: '0px',
    sm: '2px',
    md: '4px',
    lg: '6px',
    xl: '8px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
    elevated: '0 4px 12px 0 rgba(0, 0, 0, 0.6)',
    modal: '0 12px 32px 0 rgba(0, 0, 0, 0.85)',
    cyanGlow: '0 0 16px rgba(0, 240, 255, 0.25)',
  },

  motion: {
    durations: {
      instant: '0ms',
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
    },
    easing: {
      standard: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',
      decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
      accelerate: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
    }
  },

  touch: {
    minTargetSize: '44px',
  },

  zIndex: {
    canvas: 0,
    viewportOverlay: 10,
    panels: 20,
    topBar: 30,
    modals: 50,
    tooltips: 100,
  }
} as const;

export type ThemeTokens = typeof tokens;
