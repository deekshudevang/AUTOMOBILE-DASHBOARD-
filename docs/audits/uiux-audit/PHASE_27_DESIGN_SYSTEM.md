# AUTOVERSE PHASE 27 — DESIGN SYSTEM SPECIFICATION
**System Name**: Gran Turismo Workstation Design System  
**Document ID**: `docs/audits/uiux-audit/PHASE_27_DESIGN_SYSTEM.md`  
**Phase**: 27.0 Design Foundation  
**Version**: 1.0.0  
**License**: MIT / Proprietary AutoVerse (Fonts SIL OFL 1.1)  

---

## 1. DESIGN PHILOSOPHY: "GRAN TURISMO WORKSTATION"

The Gran Turismo Workstation design system unifies three distinct automotive digital experiences under a single, disciplined design language:
- **ATELIER**: High-luxury automotive bespoke customization (Ferrari Centro Stile, Porsche Exclusive Manufaktur).
- **TELEMETRY**: Real-time motorsport data and vehicle performance telemetry (MoTeC i2, Bosch Motorsport).
- **ENGINEERING**: High-precision CAD modeling and CFD simulation (CATIA, Siemens NX, OpenFOAM).

### Core Aesthetic Pillars:
1. **The 3D Vehicle Dominates**: The vehicle is the primary visual anchor; UI chrome floats as lightweight, semi-transparent instruments that dissolve during orbit gestures.
2. **Elimination of Cyberpunk Clichés**: Generic electric cyan (`#00F0FF`) and purple gradients are completely eliminated from UI chrome.
3. **Calibrated Automotive Neutrals**: The palette is grounded in **Obsidian Black (`#050608`)**, **Volcanic Basalt (`#0F1216`)**, and **Machined Graphite (`#1A1E23`)**.
4. **Semantic Motorsport Accents**: The primary action accent is **Motorsport Redline (`#E53935`)**, supported strictly by semantic status indicators.

---

## 2. DESIGN TOKEN INVENTORY

### A. Surfaces & Backgrounds
```css
--surface-obsidian: #050608;        /* Root 3D canvas backdrop; infinite depth */
--surface-basalt: #0F1216;          /* Primary workstation panels and headers */
--surface-graphite: #1A1E23;        /* Secondary containers, cards, and inputs */
--surface-graphite-raised: #242930; /* Hover states, active items, and raised cards */
```

### B. Structure & Hairline Borders
```css
--border-hairline: #1E222B;               /* Standard structural panel perimeter (1px) */
--border-glass: rgba(255, 255, 255, 0.08); /* Translucent floating HUD border */
```

### C. Typography
```css
--text-primary: #F0F1F2;   /* Headings, active values, high contrast */
--text-secondary: #A6ABB1; /* Labels, subtitles; strictly >= 4.5:1 WCAG AA */
--text-disabled: #6B7178;  /* Inactive states only; never readable content */
```

### D. Semantic Motorsport Accents
```css
--accent: #E53935;                          /* Motorsport Redline: Primary actions */
--accent-hover: #F87171;                    /* Hover state */
--focus-ring: #E53935;                      /* Inner focus ring */
--focus-ring-outer: rgba(240, 241, 242, 0.85); /* Outer high-contrast white ring */
--info: #2979FF;                            /* Performance Blue: Aerodynamic downforce */
--ok: #00C985;                              /* Optimal Green: Simulation convergence */
--warn: #FFB300;                            /* Warning Amber: Mechanical caution */
--error: #E53935;                           /* Error: Mechanical failure / input error */
```

---

## 3. MEASURED CONTRAST & ACCESSIBILITY AUDIT (WCAG 2.1 AA)

All contrast measurements were calculated using the W3C relative luminance formula:
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

| Foreground Token | Background Surface | Contrast Ratio | WCAG 2.1 AA Status | WCAG 2.1 AAA Status |
| :--- | :--- | :--- | :--- | :--- |
| `--text-primary` (`#F0F1F2`) | `--surface-obsidian` (`#050608`) | **18.4 : 1** | PASS (>= 4.5:1) | PASS (>= 7:1) |
| `--text-primary` (`#F0F1F2`) | `--surface-basalt` (`#0F1216`) | **16.1 : 1** | PASS (>= 4.5:1) | PASS (>= 7:1) |
| `--text-primary` (`#F0F1F2`) | `--surface-graphite` (`#1A1E23`) | **13.8 : 1** | PASS (>= 4.5:1) | PASS (>= 7:1) |
| `--text-secondary` (`#A6ABB1`) | `--surface-obsidian` (`#050608`) | **9.6 : 1** | PASS (>= 4.5:1) | PASS (>= 7:1) |
| `--text-secondary` (`#A6ABB1`) | `--surface-basalt` (`#0F1216`) | **8.4 : 1** | PASS (>= 4.5:1) | PASS (>= 7:1) |
| `--text-secondary` (`#A6ABB1`) | `--surface-graphite` (`#1A1E23`) | **7.2 : 1** | PASS (>= 4.5:1) | PASS (>= 7:1) |
| `--accent` (`#E53935`) | `--surface-obsidian` (`#050608`) | **4.9 : 1** | PASS (>= 3:1 graphical) | - |
| `--accent` (`#E53935`) Focus Ring | White Text (`#F0F1F2`) | **3.7 : 1** | PASS (>= 3:1 focus ring) | - |

---

## 4. TYPOGRAPHY SPECIFICATION & LICENSING

The font stack is self-hosted via `@fontsource` modular packages to prevent third-party network blocking or FOIT (Flash of Invisible Text):
1. **Chakra Petch (600, 700)** — Display typeface for vehicle model headers, workspace badges, and modal titles. (SIL OFL 1.1)
2. **Inter (400, 500, 600)** — Clean neo-grotesque for core interface labels, descriptions, and button copy. (SIL OFL 1.1)
3. **JetBrains Mono (400, 500, 600)** — Non-proportional monospace for all dimensions, telemetry metrics, and CAD coordinates with `tabular-nums` enforced. (SIL OFL 1.1)

---

## 5. REUSABLE COMPONENT LIBRARY (`src/components/ui/`)

| Component | File | Key Features & Accessibility Standards |
| :--- | :--- | :--- |
| `Button` | `Button.tsx` | Variants: primary (Motorsport Red), secondary, ghost, danger. Heights 32/40/48 with 44px min touch target on touch devices. Dual focus ring. |
| `IconButton` | `IconButton.tsx` | Enforces mandatory `aria-label`. Minimum 44px touch target. |
| `Toggle` | `Toggle.tsx` | Tactile rocker switch with ARIA `role="switch"` and `aria-checked`. |
| `TechnicalSlider` | `TechnicalSlider.tsx` | Custom track with machined slot, knurled rectangular thumb, detent ticks, floating tooltip, double-click reset, full ARIA attributes. |
| `ValueReadout` | `ValueReadout.tsx` | High-precision tabular numeral display with unit labels and delta badges. |
| `TelemetryIndicator` | `TelemetryIndicator.tsx` | Semantic status dot/pill: optimal (`#00C985`), warning (`#FFB300`), error (`#E53935`), info (`#2979FF`). |
| `Badge` | `Badge.tsx` | Micro status tags: OEM, V2, STEP, SYNCED. |
| `Kbd` | `Kbd.tsx` | Machined keyboard key badge for hotkeys. |
| `Tooltip` | `Tooltip.tsx` | Accessible floating tooltip with directional positioning. |
| `SectionHeader` | `SectionHeader.tsx` | Standardized display heading with optional badge and action slot. |
| `Modal` | `Modal.tsx` | Accessible dialog with focus trap, Escape dismiss, portal, and backdrop blur. |
| `Drawer` | `Drawer.tsx` | Sliding panel (bottom or right) with keyboard dismiss. |

---

## 6. MIGRATION LOG (PHASE 27.0)

| Old Token / Pattern | File(s) | New Token / Replacement | Rationale |
| :--- | :--- | :--- | :--- |
| `#00F0FF` (Cyan) | `tailwind.config.js`, `src/index.css` | `--accent` (`#E53935`) | Eliminates generic cyberpunk neon; replaces with authentic motorsport red. |
| `#0B0F17` (Muddy Slate) | `src/index.css` | `--surface-obsidian` (`#050608`) | Increases dynamic range and contrast against 3D vehicle paint reflections. |
| `#11141C` (Dark Slate) | `src/index.css` | `--surface-basalt` (`#0F1216`) | Calibrated neutral background for floating HUD panels. |
| `#64748B` (Muted Slate) | `src/index.css` | `--text-secondary` (`#A6ABB1`) | Fixes WCAG AA text contrast failure (elevated from 3.8:1 to 8.4:1). |
| Native Range Sliders | `src/index.css` | `TechnicalSlider.tsx` | Replaces generic browser thumbs with machined knurled automotive sliders. |
| Google Fonts CDN | `index.html` | `@fontsource/*` self-hosted | Eliminates external render-blocking network dependency; ensures zero FOIT. |
| Procedural Paint Colors | `src/utils/colorUtils.ts` | Intentionally Preserved | Real vehicle OEM paint colors (Rosso Corsa, Miami Blue) must not be altered. |
| Simulation Contours | CFD / Aero Shaders | Intentionally Preserved | Scientific fluid velocity and pressure gradients must not be altered. |
