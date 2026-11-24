# AUTOVERSE 3D — AERODYNAMIC ENGINEERING SPECIFICATION
## Phase T4: Aerodynamic Components, Published Airfoils & Package Architectures

**Document Version:** 1.0.0  
**Status:** Certified Engineering Reference  
**Date:** November 2026  
**Module:** `src/geometry/aero/parametricAeroLibrary.ts` & `src/components/views/AeroStudioView.tsx`  

---

## 1. COMPONENT DESIGN SPECIFICATIONS

Aero Studio provides direct parametric CAD generation and aerodynamic estimation for 6 primary automotive aerodynamic subsystems:

### 1.1 Front Splitter (`generateFrontSplitterGeometry`)
- **Forward Extension ($L_{\text{ext}}$):** 0.05 m to 0.25 m forward of the front bumper datum.
- **Span Width ($W$):** 1.60 m to 2.10 m matching vehicle body width.
- **Ground Clearance ($h_g$):** Enforced $\ge 0.075\text{ m}$ ($75\text{ mm}$) to prevent mechanical ground collision and aerodynamic choking.
- **Rake Angle ($\alpha_{\text{spl}}$):** 0.0° to 6.0° downward inclination.
- **Side Fences & Endplates:** Variable height (0.04 m to 0.15 m) to suppress high-pressure spillover from the top surface into the lower low-pressure zone.
- **Boundary Ramp Diffusers:** Underbody transition ramps expanding at 6° to 10° into the front wheel arches.

### 1.2 Multi-Element Rear Wing (`generateRearWingGeometry`)
- **Span ($b$):** 1.40 m to 2.05 m.
- **Chord ($c$):** 0.22 m to 0.45 m.
- **Angle of Attack ($\alpha$):** Continuous variation from -4.0° (low-drag DRS open) to +18.0° (high downforce / airbrake).
- **Aspect Ratio ($AR$):**
  $$AR = \frac{b^2}{S} = \frac{b}{c}$$
- **Finite-Wing Lift & Induced Drag (Helmbold Formulation):**
  $$a = \frac{a_0}{1 + \frac{a_0}{\pi AR}}$$
  $$C_L = -(C_{L0} + a \cdot \alpha)$$
  $$C_{Di} = \frac{C_L^2}{\pi e AR}$$
  where Oswald efficiency factor $e = 0.85$ and 2D section lift slope $a_0 = 2\pi \text{ rad}^{-1}$.
- **Mount Configurations:**
  - `swan_neck`: Top-mounted pylons preserving clean, uninterrupted suction on the wing's low-pressure underside.
  - `bottom_pylon`: Traditional chassis or deck-mounted struts.
  - `endplate_mount`: Direct endplate mounting to rear quarter panels.
- **Trailing Edge Gurney Flap:** 5 mm to 15 mm vertical tab creating counter-rotating vortices that delay boundary layer separation and increase downforce by up to 25%.

### 1.3 Underbody Venturi Diffuser (`generateRearDiffuserGeometry` & `generateUnderbodyTunnelGeometry`)
- **Expansion Length ($L_{\text{diff}}$):** 0.50 m to 1.10 m.
- **Ramp Angle ($\theta$):** 6.0° to 16.0°. Angles beyond 14° risk adverse-pressure-gradient boundary layer separation without active vortex generators.
- **Strakes / Fences:** 2 to 6 longitudinal vertical strakes isolating left/right underbody flow channels from turbulent tire wake crossflow.
- **Throat Height ($h_{\text{throat}}$):** Critical venturi constriction height governing peak suction $C_p$ according to Bernoulli's equation.

### 1.4 Front Bumper Canards / Dive Planes (`generateCanardGeometry`)
- **Delta Planform Area:** $0.02\text{ m}^2$ to $0.06\text{ m}^2$ per flick.
- **Incidence Rake:** 12.0° to 24.0°.
- **Aerodynamic Role:** Generates strong concentrated tip vortices along the vehicle flank that act as pneumatic skirts, preventing atmospheric air from infiltrating the low-pressure underbody.

---

## 2. PUBLISHED AIRFOIL CATALOGUE & LITERATURE PROVENANCE

Every airfoil in AutoVerse uses published mathematical profiles with full literature citations:

```
+---------------+------------------------+------------------------------------+-----------+------------+
| CODE          | AIRFOIL NAME           | LITERATURE CITATION                | THICKNESS | MAX CAMBER |
+---------------+------------------------+------------------------------------+-----------+------------+
| NACA_0012     | Symmetrical 12%        | Abbott & von Doenhoff, 1959        | 12.0%     | 0.0%       |
| NACA_2412     | Cambered 2% at 40% c   | Abbott & von Doenhoff, 1959        | 12.0%     | 2.0%       |
| NACA_6412     | High-Lift Cambered 6%  | NACA Report No. 460, 1933          | 12.0%     | 6.0%       |
| SELIG_S1223   | Motorsports High-Lift  | Selig & Guglielmo, J. Aircraft 1997| 12.1%     | 8.1%       |
+---------------+------------------------+------------------------------------+-----------+------------+
```

### Custom DAT File Ingestion
Engineers can import custom Selig/UIUC coordinate text files via `ParametricAeroLibrary.importAirfoilFromDat()`, which parses coordinate pairs from trailing edge to leading edge, checks geometry validity ($N \ge 10$), and recalculates thickness and camber ratios.

---

## 3. PRE-BUILT AERODYNAMIC PACKAGES

AutoVerse organizes aerodynamic configurations into genuine, physical component packages:

1. **Street Low-Drag Package (`pkg_gt3rs_street`):**
   - Front splitter: 80 mm extension, 0° rake.
   - Rear wing: NACA 2412 section, 1.68 m span, 4° AoA.
   - Diffuser: 8° expansion angle, 4 strakes.
   - Target: $C_d = 0.33$, $C_l = -0.15$, balance 40% front.
2. **Track High-Downforce Package (`pkg_gt3rs_track_high_downforce`):**
   - Front splitter: 165 mm extension, 3.5° rake, 120 mm side endplates.
   - Rear wing: Selig S1223 section, 1.88 m span, 14.5° AoA, 10 mm Gurney flap.
   - Diffuser: 14° expansion angle, 6 strakes.
   - Dual bumper canards (18° rake).
   - Target: $C_d = 0.42$, $C_l = -0.68$, balance 44.5% front.
