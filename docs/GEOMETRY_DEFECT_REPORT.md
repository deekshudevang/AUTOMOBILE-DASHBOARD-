# GEOMETRY_DEFECT_REPORT.md — Vehicle Geometry Engine Audit & Defect Report

> **Engineering Role**: Senior Graphics Engineer, AutoVerse 3D  
> **Date**: 2026-11-10  
> **Phase**: Phase 1 — Comprehensive Read-Only Audit  
> **Target Platform**: Windows 11, NVIDIA GeForce RTX 4060 (8GB VRAM)  
> **Verification Status**: Phase 1 Complete (Baseline Documented & Screen-Captured)

---

## 1. Executive Summary

A critical visual defect currently compromises the realism of AutoVerse 3D: **vehicles visually read as primitive rectangular boxes with wheels attached**. 
Following an exhaustive read-only inspection of the geometry pipeline (`VehicleRenderer.tsx`, `WheelAssembly.tsx`, `proceduralChassis.ts`, and `packages/vehicle-generation-engine`), the root cause has been diagnosed:

1. **Stacking of Axis-Aligned `BoxGeometry` Cuboids**: The main bodywork is constructed from three flat rectangular boxes with 6 faces (12 triangles each) and uniform box normal vectors.
2. **Absence of Longitudinal Curves**: No side-view splines exist for hood rake, A-pillar slope, roof crown, backlight slope, or decklid taper.
3. **Absence of Transverse Cross-Sections**: The body has zero tumblehome, zero shoulder taper, and zero rocker pinch.
4. **Missing Wheel Arches**: The body hull contains no wheel well cutouts. Wheels clip through the box corners or sit completely exposed without fender flares.
5. **Universal Archetype Homogeneity**: All 108 vehicle configurations—spanning sedans, supercars, muscle cars, and SUVs—render with identical 4.2m box dimensions.

---

## 2. Primitive Usage Table

| File | Line | Primitive Type | Dimensions / Arguments | What it Represents | Forms Main Body? |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `src/components/3d/VehicleRenderer.tsx` | 174 | `boxGeometry` | `args={[1.76, 0.46, 4.2]}` | Lower Main Hull / Monocoque | **YES (Primary Body)** |
| `src/components/3d/VehicleRenderer.tsx` | 187 | `boxGeometry` | `args={[1.68, 0.36, 1.5]}` | Hood Slant (Rotated 0.12 rad) | **YES (Front Body)** |
| `src/components/3d/VehicleRenderer.tsx` | 217 | `boxGeometry` | `args={[1.44, 0.58, 2.1]}` | Center Cabin Greenhouse / Roof | **YES (Greenhouse)** |
| `src/components/3d/VehicleRenderer.tsx` | 202 | `boxGeometry` | `args={[0.5, 0.06, 0.8]}` | Hood Scoop Base | No (Mod Part) |
| `src/components/3d/VehicleRenderer.tsx` | 208 | `boxGeometry` | `args={[0.12, 0.02, 0.6]}` | Hood Vented Slats | No (Mod Part) |
| `src/components/3d/VehicleRenderer.tsx` | 230 | `boxGeometry` | `args={[0.34, 0.1, 0.6]}` | Roof Scoop | No (Mod Part) |
| `src/components/3d/VehicleRenderer.tsx` | 241 | `boxGeometry` | `args={[0.08, 0.02, 4.2]}` | Center Twin Stripes | No (Decal) |
| `src/components/3d/VehicleRenderer.tsx` | 251 | `planeGeometry` | `args={[1.38, 0.85]}` | Windshield Glass | Yes (Glass) |
| `src/components/3d/VehicleRenderer.tsx` | 265 | `planeGeometry` | `args={[1.36, 0.8]}` | Rear Window Glass | Yes (Glass) |
| `src/components/3d/VehicleRenderer.tsx` | 280 | `planeGeometry` | `args={[1.9, 0.54]}` | Side Windows Glass | Yes (Glass) |
| `src/components/3d/VehicleRenderer.tsx` | 300 | `boxGeometry` | `args={[0.38, 0.12, 0.44]}` | Cockpit Seat Base | No (Interior) |
| `src/components/3d/VehicleRenderer.tsx` | 305 | `boxGeometry` | `args={[0.36, 0.52, 0.1]}` | Cockpit Seat Backrest | No (Interior) |
| `src/components/3d/VehicleRenderer.tsx` | 314 | `torusGeometry` | `args={[0.13, 0.02, 16, 24]}` | Steering Wheel | No (Interior) |
| `src/components/3d/VehicleRenderer.tsx` | 323, 327 | `cylinderGeometry` | `args={[0.02, 0.02, 1.36 / 0.9, 12]}` | Rollcage Bars | No (Interior) |
| `src/components/3d/VehicleRenderer.tsx` | 340, 356 | `boxGeometry` | `args={[0.28, 0.12, 0.08]}` | Headlights / Taillights | No (Lighting) |
| `src/components/3d/VehicleRenderer.tsx` | 372, 388 | `boxGeometry` | `args={[1.78, 0.08, 0.15]}` | Front Bumper / Rear Diffuser | No (Exterior Aero) |
| `src/components/3d/VehicleRenderer.tsx` | 404 | `boxGeometry` | `args={[0.06, 0.08, 2.6]}` | Side Skirts | No (Exterior Aero) |
| `src/components/3d/VehicleRenderer.tsx` | 415, 423 | `cylinderGeometry` | `args={[0.038 / 0.045, ... 16]}` | Exhaust Tips | No (Exhaust) |
| `src/components/3d/VehicleRenderer.tsx` | 442 | `boxGeometry` | `args={[1.72, 0.04, 0.32]}` | Rear GT Wing Blade | No (Aero) |
| `src/components/3d/WheelAssembly.tsx` | 34 | `cylinderGeometry` | `args={[0.34, 0.34, 0.28, 32]}` | Tyre (Flat Cylinder) | No (Wheel) |
| `src/components/3d/WheelAssembly.tsx` | 52 | `cylinderGeometry` | `args={[0.26, 0.26, 0.14, 32, 1, true]}` | Rim Barrel | No (Wheel) |
| `src/components/3d/WheelAssembly.tsx` | 89 | `boxGeometry` | `args={[0.025, 0.035, 0.18]}` | Rim Spokes | No (Wheel) |
| `src/components/3d/WheelAssembly.tsx` | 103, 109 | `cylinder / box` | `args={[0.22, 0.22, 0.02]}` | Brake Rotor & Caliper | No (Brakes) |
| `packages/.../proceduralChassis.ts` | 108 | `CylinderGeometry` | `args=[0.88, 0.92, 4.2, 32, 4]` (scale 1, 0.42, 1) | Lower Tub | **YES (Fallback Body)** |
| `packages/.../proceduralChassis.ts` | 130 | `SphereGeometry` | `args=[1.2, 24, 16, 0, 2π, 0, π/2]` (scale 0.68, 0.52, 1.25) | Cabin Roof | **YES (Fallback Cabin)** |

---

## 3. Root Cause Analysis

### A. Lack of Longitudinal Profile & Continuous Tangency
In authentic automotive styling, the vehicle profile is governed by a continuous side-view silhouette curve:
$$\vec{C}(t) = \text{CatmullRomSpline}(\mathbf{P}_0, \mathbf{P}_1, \dots, \mathbf{P}_n)$$
The current implementation splits the vehicle into discontinuous disjoint boxes:
- The hood is a detached box rotated by `0.12` radians sitting atop the lower hull.
- The greenhouse is an abrupt perpendicular block with hard 90° corners, completely lacking windshield rake transitions, roof peak crowns, and C-pillar sail panels.
- Flat normals on the 6 box faces cause light reflections to read as planar cardboard rather than curved automotive steel and carbon fiber.

### B. Lack of Transverse Cross-Sections & Tumblehome
Real cars taper inward toward the roof (tumblehome) by 8° to 16°, widen outward at the beltline/shoulders, and tuck under at the rocker sills. The current system employs a constant width of `1.76m` across the entire length of the lower hull and `1.44m` across the entire greenhouse, giving the car the cross-section of a shipping container.

### C. Wheel Arch Geometry Defect
Wheel arches in authentic cars are precision circular cutouts blended into the fenders with flared lips. In the current implementation:
- No boolean or topological cutouts exist.
- Wheels simply intersect the solid rectangular body box.
- Tyres protrude `140mm` past the bodywork without fender coverage.

---

## 4. Measured Proportion Defects vs. Plausible Range

| Dimension / Metric | Current Measured Value | Realistic Sports / GT Range | Defect Severity | Visual Consequence |
| :--- | :--- | :--- | :--- | :--- |
| **Wheel Diameter / Body Height Ratio** | $\frac{0.68\text{m}}{1.04\text{m}} = 0.654$ | $0.44 - 0.50$ | **CRITICAL** | Massive monster-truck wheels relative to low box body |
| **Ground Clearance** | $210\text{ mm}$ ($0.21\text{m}$) | $105 - 130\text{ mm}$ (Sports/GT) | **CRITICAL** | Unrealistic SUV-level clearance under a supposed sports car |
| **Front Overhang** | $0.72\text{m}$ (Symmetric with rear) | $0.85 - 0.95\text{m}$ | **MODERATE** | Stubby front nose; lacks front radiator crash structure |
| **Rear Overhang** | $0.72\text{m}$ (Symmetric with front) | $0.95 - 1.10\text{m}$ | **MODERATE** | Lacks rear trunk/decklid taper and aerodynamic diffuser taper |
| **Track vs. Width Clearance** | Outer tyre edge at $X = \pm 1.02\text{m}$ | Tyre edge flush with fender lip ($X \le \pm 0.90\text{m}$) | **HIGH** | Tyres clip outside body by $140\text{mm}$ |
| **Tyre Profile** | Cylinder with zero sidewall bulge | Toroidal profile with rounded shoulder & rim protector | **HIGH** | Unrealistic flat hockey-puck tyre appearance |

---

## 5. Attachment & Component Gaps

1. **Hardcoded Vector Literals**: Components in `VehicleRenderer.tsx` rely on magic numbers (`position={[0, -0.18, 2.05]}`) rather than dynamic named anchor points (`mount_bumper_f`, `mount_wing`, `mount_exhaust`).
2. **Zero Scalability**: If a vehicle profile has a different wheelbase or length, hardcoded components float disconnected in mid-air or interpenetrate the cabin.
3. **Missing Component Metadata**: Components lack `compatibleBodyStyles`, `anchorPoints`, `mirrorable`, and `triangleBudget` descriptors.

---

## 6. Asset Inventory (Repository & Manifest)

- **Total Physical 3D Assets on Disk**: **0** (`.glb`, `.gltf`, `.obj`, `.fbx`).
- **`public/vehicle-assets/cars/`**: Directory exists but is completely empty.
- **`public/vehicle-assets/manifest.json`**: Contains 12 theoretical entries (e.g. `/vehicle-assets/cars/bmw/m3_g80.glb`, `/vehicle-assets/cars/porsche/911_gt3.glb`), but no corresponding asset files exist.
- **License / Provenance**: N/A (all vehicles must rely on procedural parametric generation).

---

## 7. Baseline Test & Build Status

- **Build**: `npm run build` succeeds cleanly in `6.07s` (0 errors).
- **Unit Tests**: `npm test -- --run` passes **43 of 43 tests** across 7 test files (`core.test.ts`, `workflow.test.ts`, `packages.test.ts`, `exporter.test.ts`, `milestone1-bmw.test.ts`, `milestone2-fleet.test.ts`, `backend.test.ts`).

---

## 8. Baseline Photographic Evidence (1600x900)

Baseline captures recorded directly from headless Chrome:
- **Three-Quarter View**: [`artifacts/screenshots/baseline/three_quarter.png`](file:///c:/Users/deeks/Downloads/cars/artifacts/screenshots/baseline/three_quarter.png)
- **Side Profile**: [`artifacts/screenshots/baseline/side.png`](file:///c:/Users/deeks/Downloads/cars/artifacts/screenshots/baseline/side.png)
- **Front Elevation**: [`artifacts/screenshots/baseline/front.png`](file:///c:/Users/deeks/Downloads/cars/artifacts/screenshots/baseline/front.png)

> **Visual Defect Confirmation**: The screenshots clearly confirm the defect: three rectangular cyan boxes with flat lighting and cylinder tyres clipping into the side panels.

---

## 9. Reconstruction Roadmap (Phases 2–9)

- [ ] **Phase 2**: Parametric Body Engine (Longitudinal Catmull-Rom profiles, ≥24 transverse cross-section stations, lofted `BufferGeometry`, smooth normals with crease splits, integrated wheel arches, separate panels, fascias).
- [ ] **Phase 3**: Editable `VehicleGeometryProfile` schema & 7 distinct archetype templates (Sedan, Coupe, Sports car, Supercar, SUV, Muscle, Pickup).
- [ ] **Phase 4**: Detailed components with dynamic named anchor points and compatibility metadata in `AssemblyGraph`.
- [ ] **Phase 5**: Wheels with toroidal tyres, rim spokes/barrel/lip, ventilated brake rotors, and calipers.
- [ ] **Phase 6**: PBR materials, UV unwrap, and automated geometry diagnostics (anti-box check, clearance, degenerate faces).
- [ ] **Phase 7**: 5-tier Asset Priority resolver with rejection logging.
- [ ] **Phase 8**: Visual Quality Gate (all 7 archetypes rendered at ≥1600x900 with studio lighting, wireframe, and flat normals).
- [ ] **Phase 9**: Final documentation, verification, and handoff.
