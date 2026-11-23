# AutoVerse 3D — Car Studio Complete Overhaul & Cross-Car Swapping Implementation Plan

**Author:** AutoVerse Principal Software Architect & 3D Engineering Team  
**Date:** November 23, 2026  
**Target Branch:** `feat/car-studio-overhaul`  
**Execution Standard:** Superpowers Rigor + Ponytail Simplicity + Unslop UI  

---

## 1. Architectural Strategy

The overhaul transitions AutoVerse from disconnected UI sliders to a **fully integrated, bidirectional automotive assembly and cross-car part-swapping pipeline**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER ACTIONS (Car Studio UI)                    │
│  - Select Target Vehicle (e.g. Porsche 911 GT3 RS)                     │
│  - Open Global Parts Library -> Filter Donor: Lamborghini SVJ          │
│  - Select "SVJ Aero Wing" -> Fitment Evaluation: "ADAPTABLE"           │
│  - Click "Install on Target Vehicle"                                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   CrossCarPartSwapper Engine                           │
│  - Extracts Donor Component Geometry & Bounding Box                    │
│  - Computes Dimensional Scale & Anchor Delta Offset                    │
│  - Evaluates Fitment (Direct Fit / Adaptable / Incompatible)           │
│  - Generates Transformed Replacement Mesh with Mounting Brackets       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   useVehicleStore (State & Persistence)                │
│  - Stores ComponentOverride with donorVehicleId, donorComponentId,     │
│    fitmentType, adapterScale, adapterOffset, position, rotation, scale │
│  - Tracks History (Undo/Redo)                                          │
│  - Persists to LocalStorage (`autoverse_custom_builds`) & JSON export  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             VehicleRenderer.tsx (3D WebGL / Three.js Pipeline)         │
│  - Resolves Canonical IDs (Schema 2.0 <-> V2 Engine)                   │
│  - Ingests Overrides into V2 Engine and Schema2 Assembler              │
│  - Applies 3-Axis Translation, Euler Rotation, and Scale Matrices      │
│  - Replaces Sub-Meshes dynamically for Donor Swapped Parts             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Phase Breakdown & Execution Milestones

### Phase 1: Core Architecture & Cross-Car Part Swapping Engine
- **Objectives:**
  1. Extend `packages/shared-types/src/schema2.ts` and `src/types/vehicle.ts` with donor part metadata:
     `donorVehicleId?: string`, `donorComponentId?: string`, `fitmentType?: 'DIRECT_FIT' | 'ADAPTABLE' | 'INCOMPATIBLE'`, `adapterScale?: [number, number, number]`, `adapterOffset?: [number, number, number]`.
  2. Create `src/geometry/customization/crossCarPartSwapper.ts`:
     - Cross-car donor part extraction.
     - Dimensional bounding box ratio calculations ($S_x, S_y, S_z$).
     - Kinematic hub compatibility (PCD bolt patterns, Center-Lock vs. 5-lug, hub bore clearance).
     - Aero mounting bracket generation for wings, splitters, and diffusers.
  3. Create `src/geometry/components/canonicalComponentMap.ts`:
     - Bi-directional lookup between Schema 2.0 (`front_left_fender`, `rear_wing`, `wheel_front_left`) and V2 Engine (`fender_front_l`, `wing_rear`, `wheel_fl`).
- **Verification Gate:**
  - Automated unit test verifying SVJ wing adapted onto Porsche GT3 RS with `ADAPTABLE` fitment status, correctly scaled bounding box, and valid Three.js mesh generation.

---

### Phase 2: Bridge 3D Viewport & Geometry Engines
- **Objectives:**
  1. Update `src/components/3d/VehicleRenderer.tsx`:
     - Ingest overrides for both `useGeometryEngineV2` and `schema2Body` paths.
     - Apply translation `[x, y, z]`, rotation `[rx, ry, rz]`, and scale `[sx, sy, sz]` to component groups.
     - Dynamically swap child meshes when a replacement mesh or donor component is provided in the override.
     - Support component visibility toggle (part removal / delete mode) with instant 3D sync.
  2. Update `packages/vehicle-generation-engine/src/geometry/editableVehicleAssembler.ts`:
     - Ingest donor replacement meshes into the 30-part assembly hierarchy.
- **Verification Gate:**
  - In Three.js scene, modifying X/Y/Z position of a wing moves the wing in real-time. Swapping a part replaces the mesh. Removing a bumper hides the mesh and reveals the internal crash structure.

---

### Phase 3: Global Parts Library & UI Controls Overhaul
- **Objectives:**
  1. Replace `ComponentGalleryModal.tsx` with production-grade `GlobalPartsLibraryModal.tsx`:
     - Search input with real-time text query.
     - Category pills: All, Aero, Body, Wheels, Interior, Exhaust, Chassis.
     - Donor Vehicle selector: Filter parts from all 50 Schema 2.0 vehicles + OEM catalog.
     - Live Fitment Badge: `DIRECT FIT` (green), `ADAPTABLE` (amber with explanation), `INCOMPATIBLE` (red with technical reason).
     - Component stats preview (weight change, downforce $\Delta$, drag coefficient $\Delta$, track width change).
     - "Install on Vehicle" action button.
  2. Overhaul `src/components/customizer/CustomizationPanel.tsx`:
     - Add full 3-axis Position sliders: X (Lateral $\pm 0.5\text{m}$), Y (Vertical $\pm 0.5\text{m}$), Z (Longitudinal $\pm 0.5\text{m}$).
     - Add 3-axis Rotation sliders: Pitch ($\pm 45^\circ$), Yaw ($\pm 45^\circ$), Roll ($\pm 45^\circ$).
     - Add Scale sliders: Uniform Scale ($0.5\times$ to $2.0\times$) and Width / Depth / Height independent scaling.
     - Add Wheel Rim Style selector: Center-Lock Y-Spoke, Forged 5-Spoke, BBS FI-R, Retro Turbofan, Carbon CR9, Volk TE37.
     - Add Wheel Rim Diameter selector: 18", 19", 20", 21", 22".
     - Add Tire Profile & Stance sliders: Camber ($-5.0^\circ$ to $0.0^\circ$), Spacers / Wheel Offset ($0$ to $+50\text{mm}$), Ride Height ($-60\text{mm}$ to $+40\text{mm}$).
     - Add "Remove Part" and "Restore OEM Part" buttons on selected components.
- **Verification Gate:**
  - Selecting a component exposes full 3D sliders. Sliders move/scale/rotate the part in 3D. Parts Library allows browsing and 1-click installing any donor part.

---

### Phase 4: Build Persistence & Management
- **Objectives:**
  1. Enhance `src/hooks/useVehicleStore.ts`:
     - Named Build Slots persisted in `localStorage` under key `autoverse_custom_builds`.
     - Build Management actions: `saveBuild(name)`, `loadBuild(id)`, `duplicateBuild(id)`, `deleteBuild(id)`, `resetToFactory()`.
     - Undo / Redo history stack (up to 30 states) for all component tweaks.
     - JSON Export: Download full build configuration with all cross-car part references and transforms.
     - JSON Import: Upload build JSON file and immediately reconstruct 3D vehicle state.
- **Verification Gate:**
  - Save build "GT3 RS Track Attack" with SVJ wing and BBS wheels $\rightarrow$ Reload page $\rightarrow$ Load build $\rightarrow$ All parts, transforms, and colors restore accurately.

---

### Phase 5: Automated Testing Suite & Verification
- **Objectives:**
  1. Create `tests/cross-car-part-swapping.test.ts`:
     - Test cross-car donor extraction (SVJ wing, Pista hood, Chiron diffuser).
     - Test bounding box adaptation and scale calculation.
     - Test hub compatibility validation (Center-Lock to Center-Lock = Direct Fit, 5-Lug to Center-Lock = Adaptable with adapter kit, 4-Lug = Incompatible).
     - Test JSON serialization and deserialization of custom builds.
  2. Run entire test suite (`npm test -- --run`).
  3. Run typecheck and production build (`npm run build`).
  4. Author comprehensive `CAR_STUDIO_FINAL_REPORT.md` answering all audit questions and detailing the verified implementation.

---

## 3. Strict Quality & Architectural Constraints

1. **Zero Fake UI / Zero Placeholders:** Every slider, dropdown, and button in the Customizer must bind directly to real 3D state in the active Three.js scene.
2. **Watertight Compatibility Logic:** No impossible fitments; all wheel PCDs, hub bores, and aero mounting envelopes must execute genuine automotive checks.
3. **Unslop Design Standard:** Single dark palette (`#0A0C10`, `#11141C`, `#161C28`), restrained cyan `#00F0FF` accents, tabular monospace numbers, 4px grid spacing, zero cartoonish AI clichés.
