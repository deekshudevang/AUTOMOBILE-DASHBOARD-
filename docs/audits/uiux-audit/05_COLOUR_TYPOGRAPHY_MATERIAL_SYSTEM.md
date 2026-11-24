# AUTOVERSE UI/UX AUDIT — COLOUR, TYPOGRAPHY & MATERIAL SYSTEM
**Document ID**: `docs/audits/uiux-audit/05_COLOUR_TYPOGRAPHY_MATERIAL_SYSTEM.md`  
**Phase**: Comprehensive UI/UX Audit & Automotive Design Identity Discovery  
**Audit Date**: November 24, 2026  
**Auditor**: Lead Product Designer, Automotive UI/UX Director, Senior Design Systems Architect  

---

## 1. THE NEW DESIGN TOKENS ARCHITECTURE

To replace the outdated `#0B0F17` / `#00F0FF` scheme, we specify a comprehensive design system engineered specifically for high-end automotive workstations.

---

## 2. COLOR PALETTE SPECIFICATION

### A. Neutral Ramps: "Obsidian & Brushed Titanium"
A calibrated neutral ramp grounded in warm neutral black, ensuring deep dynamic range against 3D vehicle paint finishes.

| Token Name | Hex Code | Description & Usage |
| :--- | :--- | :--- |
| `--autoverse-black` | `#050608` | Deepest root canvas backdrop; true deep black for high-contrast HDR highlights. |
| `--autoverse-obsidian` | `#090B0E` | Primary workstation background; provides deep contrast without total OLED black. |
| `--autoverse-surface` | `#0F1216` | Floating HUD panel backgrounds; subtle glassmorphic fill (`bg-black/60`). |
| `--autoverse-elevated` | `#161A22` | Card, container, and input field backgrounds. |
| `--autoverse-border` | `#232834` | Hairline panel borders (1px); crisp, subtle perimeter definition. |
| `--autoverse-border-subtle` | `#181C25` | Secondary dividers and internal grid lines. |
| `--autoverse-text-primary` | `#F1F5F9` | High-contrast headers, active labels, critical values (WCAG 15.2:1). |
| `--autoverse-text-secondary` | `#94A3B8` | Subtitles, field descriptions, metadata labels (WCAG 7.1:1). |
| `--autoverse-text-muted` | `#64748B` | Subtle hints, inactive icons, disabled states (WCAG 4.6:1). |

---

### B. Automotive Motorsport Accents (Strictly Semantic)
Instead of universal cyan, AutoVerse adopts a semantic racing palette where each accent has a defined technical purpose.

| Token Name | Hex Code | Semantic Role & Purpose |
| :--- | :--- | :--- |
| `--autoverse-accent-red` | `#E53935` | **Motorsport Redline**: Primary action triggers (e.g. "Launch CFD", "Install Part"), critical mechanical warnings, brake caliper highlights. |
| `--autoverse-accent-amber` | `#FFB300` | **Telemetry Warning / Pit Caution**: Dirty unsaved state, aerodynamic stall warning, approximate procedural mesh placard. |
| `--autoverse-accent-green` | `#00E676` | **Optimal Performance**: Cloud sync success, CFD convergence reached, G0/G1/G2 continuity verified. |
| `--autoverse-accent-blue` | `#2979FF` | **Aero Downforce / Fluid Stream**: Velocity stream contours, low pressure zones, CAD wireframe edge selections. |
| `--autoverse-accent-titanium` | `#E2E8F0` | **Brushed Metal**: Selected tabs, primary active toggles, active camera preset pill. |

---

## 3. TYPOGRAPHY SYSTEM SPECIFICATION

```css
/* Typography Token Definition */
:root {
  /* Display Font: Bold, aerodynamic, architectural */
  --font-display: "Chakra Petch", "Industry", "Eurostile Next", sans-serif;

  /* UI Font: Clean, legible, neutral geometric */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Telemetry Font: Tabular non-proportional, high precision */
  --font-mono: "JetBrains Mono", "SF Mono", "Consolas", monospace;
}
```

### Typographic Scale & Rhythm (Strict 4px Baseline)

| Level | Size / Line Height | Font Family | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 1** | `28px / 32px` | Display | Bold (700) | `tracking-wider` | Vehicle Model Name (e.g., PORSCHE 911 GT3 RS) |
| **Display 2** | `20px / 24px` | Display | SemiBold (600) | `tracking-wide` | Section Titles (e.g., KINEMATICS, CFD RESIDUALS) |
| **Headline** | `15px / 20px` | Sans | SemiBold (600) | `tracking-tight` | Card Headers, Modal Titles |
| **Body 1** | `13px / 18px` | Sans | Medium (500) | `normal` | Primary UI text, button labels, dropdown items |
| **Body 2** | `11px / 16px` | Sans | Regular (400) | `normal` | Descriptions, helper text |
| **Telemetry** | `12px / 16px` | Mono | SemiBold (600) | `tracking-tight` | Speed, Cd, Downforce, RPM, Angles (`tabular-nums`) |
| **Micro Badge**| `9px / 12px` | Mono | Bold (700) | `tracking-widest` | Status tags (e.g., OEM, V2, STEP, SYNCED) |

---

## 4. MATERIALS & SURFACING SYSTEM

AutoVerse UI panels are not flat web containers; they are virtual aerospace instruments floating over the vehicle stage.

### Surface Class 1: `Glassmorphic HUD Blade`
```css
.hud-blade {
  background: rgba(9, 11, 14, 0.65);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}
```

### Surface Class 2: `Tactile Anodized Button`
```css
.btn-anodized {
  background: linear-gradient(180deg, #1A1F29 0%, #11151D 100%);
  border: 1px solid #28303F;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  color: #F1F5F9;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-anodized:hover {
  background: linear-gradient(180deg, #222938 0%, #161A24 100%);
  border-color: #3B465C;
  transform: translateY(-1px);
}
```

### Surface Class 3: `Motorsport Redline Trigger`
```css
.btn-motorsport-red {
  background: linear-gradient(180deg, #EF4444 0%, #B91C1C 100%);
  border: 1px solid #F87171;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
.btn-motorsport-red:hover {
  background: linear-gradient(180deg, #F87171 0%, #DC2626 100%);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.45);
}
```

---

## 5. SPACING & RADIUS RULES (THE 4PX SYSTEM)

1. **Strict 4px Multiples**: All paddings and margins must adhere to `4px`, `8px`, `12px`, `16px`, `24px`, `32px`. Arbitrary tailwind values like `p-1.5` (6px) or `p-3.5` (14px) are prohibited.
2. **Harmonic Border Radii**:
   - Outermost Screen Modals: `rounded-2xl` (16px)
   - Major Floating HUD Blades: `rounded-xl` (12px)
   - Child Cards & Modules: `rounded-lg` (8px)
   - Interactive Buttons & Inputs: `rounded-md` (6px)
   - Micro Badges & Color Swatches: `rounded` (4px) or `rounded-full`
   *Rule*: Nested child border radius must always equal parent radius minus padding (`R_child = R_parent - padding`) to eliminate awkward visual gaps.
