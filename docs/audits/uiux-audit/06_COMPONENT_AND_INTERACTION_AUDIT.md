# AUTOVERSE UI/UX AUDIT — COMPONENT AND INTERACTION AUDIT
**Document ID**: `docs/audits/uiux-audit/06_COMPONENT_AND_INTERACTION_AUDIT.md`  
**Phase**: Comprehensive UI/UX Audit & Automotive Design Identity Discovery  
**Audit Date**: November 24, 2026  
**Auditor**: Lead Product Designer, Automotive UI/UX Director, Senior Design Systems Architect  

---

## 1. COMPONENT DESIGN SYSTEM TEARDOWN

Every interface element in AutoVerse must satisfy two criteria:
1. **Ergonomic Simplicity**: Immediate tactile comprehension under fast mouse or touch interaction.
2. **Automotive Authenticity**: Feeling like a calibrated precision component engineered in Weissach, Maranello, or Woking.

Below is the exhaustive component-by-component audit and redesign specification.

---

## 2. BUTTONS & INTERACTIVE CONTROLS

### Current Deficiencies:
- Varied heights (28px to 48px) with no consistent touch target.
- "OPEN EVERYTHING" button currently styled in flashy cyan neon gradient (`09_car_studio_vehicle_access_panel.png`).
- Lack of tactile states (focus rings, active scale compression, disabled styling).

### Redesigned Specification:

```
+-----------------------------------------------------------------------------------------+
| BUTTON VARIANT         | HEIGHT | DEFAULT STATE            | HOVER / ACTIVE             |
+------------------------+--------+--------------------------+----------------------------+
| Primary Motorsport     | 40px   | Satin Red Gradient       | Bright Red + Scale 0.98    |
| Secondary Workstation  | 36px   | Anodized Titanium Fill   | Brushed Highlight + 1px up |
| Micro Telemetry Toggle | 28px   | Dark Basalt Hairline     | White Tabular Text + Dot   |
| 3D Hotspot Trigger     | 32px   | Translucent Pulse Glass  | Expanded Ring Reticle      |
+-----------------------------------------------------------------------------------------+
```

```html
<!-- Primary Action Redesign -->
<button class="h-10 px-4 rounded-md bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold font-mono tracking-wider shadow-md hover:shadow-red-500/20 active:scale-[0.98] transition-all flex items-center gap-2 border border-red-400/40">
  <DoorOpen class="w-4 h-4" />
  <span>OPEN APERTURES</span>
</button>
```

---

## 3. RANGE SLIDERS & TELEMETRY STEPPERS

### Current Deficiencies:
- Uses default browser slider thumbs with generic cyan tracks (`<input type="range" class="accent-[#00F0FF]">`).
- No visible calibration ticks (detents for 0%, 50%, 100%).
- Numerical readouts are disconnected from the slider thumb.

### Redesigned Specification:
1. **Custom Automotive Track**: 4px track styled like a machined slot in anodized aluminum (`bg-[#12151D] border border-white/10`).
2. **Knurled Slider Thumb**: An elongated rectangular thumb with 3 vertical grip grooves (12px wide × 18px tall), finished in satin silver with a subtle 1px center hairline.
3. **Interactive Floating Value Tooltip**: Hovering or dragging displays a floating bubble directly above the thumb showing the exact value in tabular monospaced numbers (e.g. `45.0 mm` or `82%`).
4. **Double-Click Reset**: Double-clicking the slider thumb smoothly animates the value back to OEM factory default.

---

## 4. COLOR & MATERIAL SWATCHES (PAINT & INTERIOR)

### Current Deficiencies:
- Paint swatches in `CustomizationPanel.tsx` (`07_car_studio_paint_studio.png`) are flat 28px circles.
- They completely fail to convey whether the paint is **Deep Metallic**, **Mirror Gloss**, **Matte Satin**, or **Raw Carbon Twill**.

### Redesigned Specification:

```
        CURRENT (Flat 2D Circle)                 REDESIGN (3D Automotive Speedform)
                 [  ]                                          ____
               ( #DC2626 )                                   /      \
                 [  ]                                       | Specular| (Highlights catch
              Flat Red Dot                                  \ Metallic/   virtual studio light)
                                                              \______/
```

1. **Automotive Speedform Swatches**:
   Instead of flat circles, each swatch renders as a miniature sculpted 3D vehicle fender contour ("speedform") that catches highlights, shadows, and flakes.
2. **Material Finish Badge**:
   A tiny indicator tag at the corner of each swatch indicates the finish type (`MET`, `SAT`, `GLS`, `CARB`).
3. **Active Selection Ring**:
   The active color swatch is framed by a double ring: an inner 1px white hairline and an outer 2px brushed silver ring with subtle drop shadow.

---

## 5. MODAL DIALOGS & DRAWERS

### Current Deficiencies:
- Center-aligned opaque modals (`VehicleSelectionModal`, `GlobalPartsLibraryModal`) obscure the 3D car entirely.
- Closing requires clicking an 'X' button or pressing Escape, with no click-outside dismiss gesture.

### Redesigned Specification:
1. **Non-Blocking Perimeter Docks**:
   Move secondary selectors (Vehicle Fleet, Parts Library) into **sliding perimeter blades** (docked to the bottom or right).
2. **Live Ghost Preview**:
   While hovering over a wheel or wing in the Parts Library, the 3D car in the background instantly shows a "ghosted" holographic preview of the part in real-time before clicking to install.
3. **Clear Dismiss Affordance**:
   Clicking anywhere outside the blade or pressing `Escape` slides the drawer away in 200ms with a smooth cubic-bezier curve (`cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 6. DATA TABLES & RESIDUAL PLOTS

### Current Deficiencies:
- In `CfdLabView.tsx` (`18_cfd_lab_residuals.png`) and `VehicleDynamicsView.tsx` (`20_vehicle_dynamics_telemetry.png`), telemetry numbers are displayed in standard sans-serif weights without alternating row zebra shading.
- SVG residual plots lack interactive crosshairs, value callouts, and zoom/pan controls.

### Redesigned Specification:
1. **MoTeC-Style Telemetry Tables**:
   - Font: `font-mono tabular-nums text-xs`.
   - Subtle alternating row fills (`bg-white/[0.02]` on even rows).
   - Embedded Sparklines: Every numerical metric column (e.g. Downforce vs Speed) has a miniature 40px sparkline graph showing the trend curve directly inside the cell.
2. **Interactive Telemetry Crosshairs**:
   Hovering over any CFD residual or dynamics curve displays a vertical cursor tracking all variables simultaneously with a high-contrast floating readout box.
