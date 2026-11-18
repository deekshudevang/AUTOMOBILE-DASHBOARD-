# AUTOVERSE 3D — MASTER DESIGN SYSTEM SPECIFICATION
**Platform:** AutoVerse Automotive CAD, Engineering & Aerodynamic Workstation  
**Standard:** UI/UX Pro Max + Anti-AI Unslop Standard  
**Aesthetic:** Dark Graphite Professional CAE Desktop Workstation (Ansys Discovery / CATIA / Siemens NX)  
**Target Density:** 8/10 (High Technical Information Density, Zero Clutter)  
**Motion Profile:** 2/10 (Subtle, Restrained Micro-transitions, Zero Distracting Animation)

---

## 1. DESIGN PHILOSOPHY & ANTI-SLOP DIRECTIVES

1. **Engineering Workstation First**: AutoVerse is a computational tool for automotive engineers, aerodynamicists, and students. It must never look like an entertainment gaming dashboard, crypto terminal, or generic SaaS template.
2. **Strict Elimination of AI Clichés**:
   - Zero neon gradients, ambient blur glows, or purple backdrops.
   - Zero emoji badges (`🚀`, `✨`, `🔥`, `🎉`).
   - Zero decorative spinning blobs, pulsing rings, or unnecessary parallax effects.
   - Clean, razor-sharp 1px borders with consistent sub-surface contrast.
3. **Typography & Data Display**:
   - Tabular figures (`tnum`) and slashed zeros for all numerical readings, measurements, coordinates, and coefficients.
   - Standard 4px spatial rhythm (4px, 8px, 12px, 16px, 24px, 32px, 48px).
   - High text contrast exceeding WCAG 2.2 AA ($4.5:1$ minimum for body text, $7:1$ for primary data).

---

## 2. COLOR PALETTE & SEMANTIC TOKENS

| Role | Token Name | CSS Variable | Hex / Value | Description & Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `bg-autoverse-bg` | `--color-bg` | `#0A0C10` | Base workstation viewport and container canvas |
| **Surface 1 (Base Panel)** | `bg-autoverse-surface` | `--color-surface-1` | `#11141C` | Primary workspace cards, sidebars, toolbars |
| **Surface 2 (Elevated)** | `bg-autoverse-elevated`| `--color-surface-2` | `#161C28` | Secondary panels, selected cards, active controls |
| **Surface 3 (Hover/Input)**| `bg-autoverse-overlay` | `--color-surface-3` | `#1E2533` | Inputs, table headers, hovered list items |
| **Workstation Border** | `border-autoverse-border`| `--color-border` | `#222938` | Default 1px dividing lines and panel borders |
| **High-Contrast Border** | `border-autoverse-borderLight`| `--color-border-light`| `#323C52` | Focused borders, active tabs, modal boundaries |
| **Primary Text** | `text-slate-100` | `--color-text-primary` | `#F1F5F9` | Titles, values, active labels ($>12:1$ contrast) |
| **Secondary Text** | `text-slate-400` | `--color-text-secondary`| `#94A3B8` | Subheadings, parameter names, units |
| **Tertiary Text** | `text-slate-500` | `--color-text-tertiary` | `#64748B` | Footers, metadata timestamps, inactive hints |
| **Technical Cyan Accent**| `text-autoverse-cyan` | `--color-accent` | `#00F0FF` | Primary action states, active tool toggles, CFD streamlines |
| **Aero Warning Amber** | `text-autoverse-amber`| `--color-warning` | `#F59E0B` | Clearance alerts, convergence near-limits |
| **Verified Emerald** | `text-autoverse-emerald`| `--color-success` | `#10B981` | Solved CFD states, passing clearance, manifold shells |
| **Critical Red Alert** | `text-autoverse-rose` | `--color-error` | `#F43F5E` | Solver divergence, collision penetration, non-manifold edges |

---

## 3. SPATIAL SYSTEM & DENSITY DIALS

All layouts adhere to a dense 4px grid designed for desktop technical workstations:
- **Inner element gaps:** 4px (`gap-1`), 8px (`gap-2`)
- **Panel inner padding:** 12px (`p-3`) or 16px (`p-4`), 20px (`p-5`) for major module sections
- **Card corner radius:** 4px (`rounded`) or 6px (`rounded-md`), never rounded-2xl or rounded-full
- **Border width:** Exactly 1px solid
- **Table density:** 28px - 32px row height for data-rich telemetry tables

---

## 4. ACCESSIBILITY & INTERACTION STANDARDS (WCAG 2.2 AA)

1. **Visible Keyboard Focus**: All interactive buttons, tabs, sliders, and inputs have `:focus-visible` styling (`outline: 2px solid #00F0FF; outline-offset: 2px`).
2. **Contrast Guarantees**: All body text and data numbers use `#F1F5F9` or `#94A3B8` on dark graphite, delivering contrast ratios $> 6.5:1$.
3. **Reduced Motion**: All animations and transitions fall back to instant `0.01ms` when `prefers-reduced-motion: reduce` is enabled.
4. **Touch & Click Targets**: Minimum $36\text{px} \times 36\text{px}$ clickable area for all icons and buttons.
5. **Screen Reader Semantic Roles**: ARIA roles, labels, and `aria-live` regions for asynchronous solver jobs.
