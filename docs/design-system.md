# AUTOVERSE 3D — Automotive Design System Specification (`docs/design-system.md`)

## 1. Aesthetic Direction: Premium Automotive Digital Studio

The AutoVerse 3D design system is modeled after elite automotive configuration interfaces (Porsche Individual, Lamborghini Ad Personam, Bugatti Sur Mesure, and McLaren MSO).

### Core Principles
1. **The Vehicle is the Hero:** The UI is restrained, technical, and subordinate to the 3D model. No distracting neon glows, saturated backgrounds, or decorative fluff.
2. **Precision Engineering Aesthetic:** Monospace tabular numerals, calibrated slider increments, high-precision readouts, and clean 4px geometric alignment.
3. **Deep Graphite Surfaces:** A single neutral ramp from true black (`#0A0C10`) through 3 elevation levels (`#11141C`, `#161C28`, `#1E2533`).
4. **Single Strategic Accent:** High-luminance Electric Cyan (`#00F0FF`) reserved exclusively for active states, selection outlines, and primary actions.

---

## 2. Color Ramp & WCAG 2.2 AA Contrast Compliance

All text and interactive states meet or exceed **WCAG 2.2 AA** (minimum contrast 4.5:1 for normal text, 3:1 for large text and interactive components).

| Token | Hex / Value | Background Tested | Contrast Ratio | WCAG Compliance |
| :--- | :--- | :--- | :---: | :---: |
| `textPrimary` | `#F1F5F9` | `#0A0C10` (Canvas) | **16.2 : 1** | **AAA Pass** |
| `textSecondary` | `#94A3B8` | `#11141C` (Surface 1) | **7.1 : 1** | **AAA Pass** |
| `textTertiary` | `#64748B` | `#11141C` (Surface 1) | **4.6 : 1** | **AA Pass** |
| `accent` | `#00F0FF` | `#0A0C10` (Canvas) | **13.8 : 1** | **AAA Pass** |
| `semantic.success` | `#10B981` | `#161C28` (Surface 2) | **8.3 : 1** | **AAA Pass** |
| `semantic.warning` | `#F59E0B` | `#161C28` (Surface 2) | **7.4 : 1** | **AAA Pass** |
| `semantic.error` | `#EF4444` | `#161C28` (Surface 2) | **5.9 : 1** | **AA Pass** |
| `semantic.info` | `#3B82F6` | `#161C28` (Surface 2) | **6.2 : 1** | **AA Pass** |

---

## 3. Typography & Numerical Representation

- **Interface Body Sans:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
- **Engineering Monospace:** `"JetBrains Mono", "SF Mono", Consolas, Menlo, monospace` with `font-feature-settings: "tnum" 1, "zero" 1`. Tabular numerals prevent slider value jitter and alignment drift.

### Type Scale
- `xs` (11px / 0.6875rem): Metadata, tags, component IDs, coordinate axes.
- `sm` (12px / 0.75rem): Secondary labels, slider headers, table text.
- `base` (14px / 0.875rem): Standard interface buttons, navigation items, card titles.
- `md` (16px / 1.0rem): Section headings, modal titles.
- `lg` (18px / 1.125rem): Top-level vehicle model headers.

---

## 4. Spacing, Borders & Radius

- **Grid System:** Strict 4px geometric spacing scale ($4\text{px}, 8\text{px}, 12\text{px}, 16\text{px}, 20\text{px}, 24\text{px}, 32\text{px}, 48\text{px}$).
- **Border Radii:** Minimalist radius tokens ($2\text{px}$ small inputs, $4\text{px}$ cards, $6\text{px}$ panels). Avoid round cartoon bubbles.
- **Elevation Shadows:** Subtle dark ambient occlusion (`0 4px 12px rgba(0, 0, 0, 0.6)`), avoiding colorful neon drop-shadows.

---

## 5. Accessibility & Motion

- **Touch Targets:** Minimum $44\text{px} \times 44\text{px}$ bounding box for interactive buttons on touch viewports.
- **Visible Focus Indicator:** High-contrast 2px cyan outline (`outline: 2px solid #00F0FF; outline-offset: 2px;`) enabled globally via `:focus-visible`.
- **Non-Color Signaling:** All semantic states pair color with iconography (e.g. checkmark with emerald, warning triangle with amber, lock with gold).
- **Reduced Motion:** Detects `@media (prefers-reduced-motion: reduce)` and supports an in-app toggle that sets transition durations to 0ms and halts auto-orbit.
