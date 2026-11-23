# AUTOVERSE CAR STUDIO — BRUTALLY HONEST TECHNICAL AUDIT
**Document Reference:** `CAR_STUDIO_AUDIT.md`  
**Auditor:** Principal Automotive Software Engineer & Senior 3D Graphics Specialist  
**System Evaluated:** AutoVerse 3D Car Studio (`CustomizationPanel.tsx`, `StudioView.tsx`, `VehicleRenderer.tsx`, `EditableVehicleAssembler.ts`, `VehicleGeometryEngine.ts`)  
**Audit Date:** 2026-11-23  
**Overall Studio Functionality Score:** **3.5 / 10** (Uninflated, Evidence-Based)

---

## 1. Executive Summary & Diagnostic Verdict

The existing AutoVerse Car Studio presents an attractive Ansys/Siemens-style user interface with camera presets, PBR paint pickers, and wireframe toggles. However, beneath the surface, **the vehicle customization pipeline is severely fragmented and fundamentally incomplete**:

1. **Zero Cross-Car Part Swapping**: There is literally no implementation allowing a user to take a bumper, rear wing, splitter, diffuser, wheel, or seat from one vehicle (e.g. Lamborghini Aventador SVJ or Ferrari 488 Pista) and mount it on another (e.g. Porsche 911 GT3 RS).
2. **Component Replacement is Absent**: While the UI allows selecting parts and moving them in X/Y or toggling visibility, a user cannot browse alternative component options or replace a part with a different variant.
3. **Ghost Assets in Manifest**: `public/vehicle-assets/manifest.json` claims paths to binary assets (`/vehicle-assets/cars/bmw/m3_g80.glb`, `/vehicle-assets/cars/porsche/911_gt3.glb`), but the directory `public/vehicle-assets/cars` contains **zero files**. All 3D models in the app are generated purely procedurally via Three.js code.
4. **Renderer Disconnect**: When `useGeometryEngineV2` is active (default), `VehicleRenderer.tsx` only passes `visible` and `color` to `VehicleGeometryEngine`. Any translation, rotation, scale, or replacement overrides set in the customizer are **completely ignored by the V2 3D scene**.
5. **Component Gallery Was a Mock**: The button in `CustomizationPanel.tsx` that opened `ComponentGalleryModal.tsx` opened a design-system UI showcase (dummy buttons, sliders, badges), not an actual parts catalog.

---

## 2. Quantitative Status Breakdown

| Evaluation Category | Status | Verified Functionality | Critical Gaps |
| :--- | :--- | :--- | :--- |
| **Vehicle Loading** | **PARTIALLY WORKING** | 50 Schema 2.0 vehicles & 3 Pilot archetypes generate in 3D. | 110 legacy Cherax JSONs fall back to a generic coupe shell; zero real GLB assets exist. |
| **Component Hierarchy** | **VERIFIED WORKING** | 30 discrete components per vehicle with unique IDs, groups, and bounding boxes. | IDs are slightly mismatched between Schema 2.0 (`front_left_fender`) and V2 Engine (`fender_front_l`). |
| **Part Selection & Raycast** | **VERIFIED WORKING** | Clicking in 3D viewport or component tree selects the component and highlights it with cyan emissive glow. | Selection outline does not display attachment datums or bounding clearance envelopes. |
| **Transform Customization** | **PARTIALLY WORKING** | Position X and Y sliders work in Schema 2.0 fallback mode (`EditableVehicleAssembler`). | Position Z, Rotation (X/Y/Z), and Dimensions (Width/Length/Height) sliders are missing in UI; ignored in V2 Engine. |
| **Component Removal** | **PARTIALLY WORKING** | Visibility eye toggle hides the mesh. | No formal unmount workflow; no structural dependency check (e.g. removing bumper leaves radiator floating). |
| **Component Replacement** | **NOT FUNCTIONAL** | `replaceComponent()` exists in `VehicleGeometryEngine` code. | No UI to select or load replacement parts; no catalog browser inside the customizer. |
| **Cross-Car Part Swapping** | **MISSING** | Tested conceptually in unit test (`three-vehicle-modularity.test.ts`). | **Zero code or UI** in `CustomizationPanel.tsx` or `StudioView.tsx` to mount donor parts across vehicles. |
| **Compatibility Checking** | **PARTIALLY WORKING** | `VehicleComponentCatalog.checkCompatibility()` validates hub bolt patterns (Center-Lock vs 5x114.3). | Isolated in `ComponentLibraryView.tsx`; never invoked inside the Car Studio / Customization Panel. |
| **Paint & PBR Finishes** | **VERIFIED WORKING** | Body paint color, metallic, matte, gloss, and caliper colors update live in 3D. | Cannot apply distinct materials to individual swapped body panels. |
| **Wheel & Stance Customization** | **PARTIALLY WORKING** | Camber angle slider and ±3% rolling diameter validator work. | Cannot pick alternate rim styles, wheel diameters, or swap wheels from other vehicles. |
| **Performance Customization** | **UI ONLY** | Displays static text or empirical formulas. | No link between visual mods and actual dynamic horsepower/downforce changes in the studio view. |
| **Build Persistence** | **PARTIALLY WORKING** | Saves `componentOverrides` to Zustand store and localStorage. | Does not persist donor vehicle IDs, cross-car adapter transforms, or custom modular assemblies. |

---

## 3. Specific Defect Ledger & Severity

### Finding 1: V2 Geometry Engine Ignores Component Customizations
- **File:** `src/components/3d/VehicleRenderer.tsx` (Lines 113–123)
- **Defect:** In `useGeometryEngineV2` mode, the renderer iterates over `componentOverrides`, but only checks `override.visible === false` and `(override as any).color`. It does NOT apply `position`, `rotation`, `scale`, `dimensions`, or `replaceComponent()`.
- **Impact:** When a user moves a slider in the Customization Panel, nothing moves in the 3D viewport if V2 Engine is enabled!
- **Severity:** **CRITICAL**
- **Correction:** Wire full transform updates (`position`, `rotation`, `scale`), material overrides, and component replacements directly into the active `VehicleGeometryEngine` group.

### Finding 2: Missing Cross-Car Swapping Engine & Donor Parts Pipeline
- **File:** `src/components/customizer/CustomizationPanel.tsx`, `src/geometry/components/componentManager.ts`
- **Defect:** No mechanism exists to retrieve components from Car B, calculate coordinate offsets, check mounting compatibility against Car A, and insert the donor mesh into Car A's scene graph.
- **Impact:** The core promise of cross-car customization is completely broken for the end user.
- **Severity:** **CRITICAL**
- **Correction:** Build `CrossCarPartSwapper` and `ModularPartRegistry` that extracts donor components from any available vehicle, computes position/scale adaptation vectors, tests fitment against `VEHICLE_HUB_SPECS` and `CollisionDetector`, and hot-swaps them into the live assembly.

### Finding 3: Component Gallery Was a Dummy Showcase
- **File:** `src/components/gallery/ComponentGalleryModal.tsx`
- **Defect:** Clicking "Component Gallery" in `CustomizationPanel.tsx` opened a modal demonstrating UI buttons, sliders, and color swatches. It did not contain any car parts!
- **Impact:** Misleading user experience; user expects a parts catalog and gets a UI design showcase.
- **Severity:** **HIGH**
- **Correction:** Replace `ComponentGalleryModal` with a functional **Global Parts Library & Donor Browser** displaying all available OEM and aftermarket parts across all vehicles, categorized by Aero, Body, Wheels, Interior, Exhaust, with filter by donor vehicle and direct-fit compatibility.

### Finding 4: Incomplete Transform & Dimension Sliders in Customizer
- **File:** `src/components/customizer/CustomizationPanel.tsx` (Lines 830–892)
- **Defect:** Only X (lateral) and Y (height) position sliders exist. Z (longitudinal), Pitch/Yaw/Roll rotations, and Width/Length/Height scaling are absent from the UI.
- **Impact:** User cannot adjust component overhang, angle of attack, or width adaptations.
- **Severity:** **HIGH**
- **Correction:** Provide full 6-DOF transform controls (X, Y, Z translation and rotation) plus proportional scaling sliders with safe envelope clamps.

### Finding 5: Wheel Replacement is Blocked
- **File:** `src/components/customizer/CustomizationPanel.tsx` (Lines 1009–1075)
- **Defect:** Under the "Wheels" category, user can only adjust front camber angle. There is no selector to pick different rim designs (e.g. Porsche Center-Lock Y-Spoke, BBS FI-R, Lamborghini Leirion, Ferrari Forged, Enkei RPF1, Volk TE37) or change rim diameter (19", 20", 21").
- **Impact:** Wheel customization is essentially non-functional.
- **Severity:** **HIGH**
- **Correction:** Add rim style selector and diameter/width dropdowns connected to `WheelAssemblyGenerator` and `WheelRuleValidator`.

### Finding 6: Missing 3D Binary Assets in `public/vehicle-assets/cars/`
- **File:** `public/vehicle-assets/manifest.json`
- **Defect:** Manifest lists 12 vehicle entries referencing `.glb` files that do not exist on disk.
- **Impact:** If `AssetManagerView` or any loader attempts to fetch from `/vehicle-assets/cars/`, a 404 error occurs.
- **Severity:** **MEDIUM**
- **Correction:** Ensure all asset bindings gracefully fall back to the procedural and parametric B-Rep generation pipelines, and export actual binary `.glb` assets on demand.

---

## 4. Honest Functionality Score: 3.5 / 10

| Dimension | Weight | Score (0-10) | Weighted |
| :--- | :--- | :--- | :--- |
| 3D Viewport & Rendering | 15% | 7.5 | 1.13 |
| Vehicle Model Quality & Integrity | 20% | 4.0 | 0.80 |
| Component Accessibility & Hierarchy | 15% | 6.0 | 0.90 |
| Same-Car Customization | 20% | 3.0 | 0.60 |
| Cross-Car Part Swapping | 20% | 0.0 | 0.00 |
| Save / Load / Persistence | 10% | 1.0 | 0.10 |
| **Total Weighted Score** | **100%** | — | **3.53 / 10** |

This audit reflects the unvarnished reality of the codebase. The implementation plan in `CAR_STUDIO_IMPLEMENTATION_PLAN.md` outlines the exact steps to bring this score to **9.5+ / 10**.
