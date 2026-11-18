# AUTOVERSE 3D — Critical Geometry Failure Audit

## 1. Executive Summary & Audit Mandate

This document serves as the forensic engineering audit of the geometry pipeline failures identified in AutoVerse 3D. The user-provided screenshots (Ferrari 488 Pista, Lamborghini Aventador SVJ, and Porsche 911 GT3 RS) represent critical failure evidence where vehicles presented generic, box-like, or incorrectly assembled 3D geometry rather than authentic model-specific coachwork.

---

## 2. Visual Defect Analysis from Supplied Failure Evidence

### 2.1 Ferrari 488 Pista (2019) — Failure Analysis (`media_1794756687925_a55d17f8.jpg`)
- **Oversized Rectangular Slabs**: Doors, front fenders, rear quarter panels, and front bumper were instantiated as axis-aligned `BoxGeometry` rectangular blocks floating disconnectedly outside the inner lofted body.
- **Nose & Splitter Box Geometry**: Front bumper consisted of a monolithic block with crude rectangular cutouts rather than the Formula 1-derived aerodynamic S-Duct nose.
- **Missing Aero Features**: Absence of the double-bubble roof contour, sculptured intercooler side intakes, and rear flying buttresses.
- **Disclaimer Banner**: Displayed `CLASS D: APPROXIMATE TEMPLATE` and `APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY` due to fallback to unverified procedural chassis code.

### 2.2 Lamborghini Aventador SVJ (2019) — Failure Analysis (`media_1794756692284_98e36105.jpg`)
- **Identical Box Panels**: Displayed the exact same rectangular panel slabs as the Ferrari, proving that multiple unrelated sports cars were using the identical generic box-panel generator.
- **Missing Razor-Wedge Profile**: Aventador's characteristic steep wedge rake and hexagonal packaging were completely lost beneath axis-aligned rectangular boxes.
- **Missing SVJ Aero Package**: No ALA 2.0 active aerodynamics, no Y-signature headlights, and no rear engine louvre slatted spine.

### 2.3 Porsche 911 GT3 RS (992, 2022) — Failure Analysis (`media_1794756703556_261c6db9.jpg`)
- **Dark Vertical Sail Fin Defect**: Side window glass geometry was lofted to maximum roof height forward of the cowl shut line, creating an unnatural 50cm tall dark vertical plane cutting across the windshield flank.
- **Primitive Lighting Elements**: Headlights were represented by black rectangular/trapezoidal extrusions protruding awkwardly from the fender crests.
- **Discontinuous Wheel Arch Step**: Lower fender profile stopped at $35\text{cm}$ above ground, leaving a $25\text{cm}$ vertical notch between the front fender, front splitter, and door sill.

---

## 3. End-to-End Pipeline Execution Trace

```
1. User Selects Vehicle in UI (Dashboard / Library / URL Hash)
   │
   ▼
2. `useVehicleStore.setActiveVehicle(vehicleId)`
   │  - Resolves `activeModel` (VehicleModelMetadata) from `parametricCatalog.ts` or `vehicleDatabase.json`
   │  - Resolves `activeFile` and reads raw JSON from `public/vehicles/`
   │
   ▼
3. `VehicleRenderer.tsx` Lifecycle
   │  - Reads `useGeometryEngineV2` flag (default `true`)
   │  - Passes `parametricSpec` and `vehicleId` to `SchemaV2Migrator.migrate(rawSpec, vehicleId)`
   │
   ▼
4. [FAILURE POINT 1] Engine Branching & Fallback Logic
   │  - If `useGeometryEngineV2` was disabled or threw, fallback descended into:
   │    `EditableVehicleAssembler.build(spec)`
   │  - `EditableVehicleAssembler` stepped through `spec.components` and generated `BoxGeometry`
   │    panels for every body panel (`front_bumper`, `fender_front_l`, `door_l`, `quarter_panel_l`).
   │
   ▼
5. [FAILURE POINT 2] Generic Archetype Collapsing
   │  - In the legacy geometry engine, multiple distinct models mapped to a single generic archetype:
   │    Ferrari 488 Pista, McLaren 720S, and Lamborghini Aventador all resolved to the same
   │    generic wedge archetype with identical 10,036-triangle counts.
   │
   ▼
6. [FAILURE POINT 3] Metadata vs Geometry Decoupling
   │  - Model status labels ("CLASS B: VERIFIED PRODUCTION MODEL" vs "CLASS D") were derived
   │    purely from JSON string fields (`validation.accuracyClass`) without evaluating the actual
   │    triangle topology, dimensions, or surface curvature of the generated Three.js mesh.
```

---

## 4. Root Causes Identified

1. **`EditableVehicleAssembler.buildBodyPanelComponent`**:
   Originally implemented as `new THREE.BoxGeometry(width, height, length)`. When components were enabled for customizer overrides, 10+ literal boxes were rendered over the car.
2. **Lack of Model-Specific Dispatching**:
   The engine lacked dedicated geometric constructors for the signature physical forms of the Ferrari 488 Pista (S-Duct, flying buttresses), Lamborghini Aventador (hexagonal razor-wedge, ALA 2.0 wing), and Porsche 911 (torpedo crests, teardrop flyline).
3. **Discontinuous Wheel Arch Mathematical Formulation**:
   Wheel arch equations evaluated to zero at apex or terminated mid-elevation ($Y = 0.352\text{m}$), creating vertical gap notches and open cavities exposing the interior chassis.
4. **Camera Framing Hardcoding**:
   Camera presets used fixed coordinate distances without adapting to the actual bounding box dimensions of vehicles with different wheelbases, overhangs, and track widths.

---

## 5. Corrective Engineering Strategy

1. **Complete Removal of Box Panels**:
   All automotive exterior surfaces must be modeled using $C^0/C^1$ continuous lofted spline and Bezier patches (`createCurvedPatch`), with zero `BoxGeometry` on exterior panels.
2. **Dedicated Model-Specific Constructors**:
   Independent procedural geometry generators for the Lamborghini Aventador SVJ, Ferrari 488 Pista, Porsche 911 GT3 RS, and Grand Tourer archetypes.
3. **Dynamic Bounding-Box Camera Rig**:
   Camera distance and framing automatically computed from `new THREE.Box3().setFromObject(vehicleGroup)`.
4. **Honest Model Status Hierarchy**:
   Status badges driven by physical geometry evaluation (18-gate quality suite) rather than static JSON claims:
   - `AUTHENTIC_ASSET_VERIFIED`
   - `MODEL_SPECIFIC_RECONSTRUCTION`
   - `PROCEDURAL_APPROXIMATION`
   - `MODEL_UNAVAILABLE`
   - `VALIDATION_PENDING`
5. **Cross-Vehicle Silhouette & Invariant Testing**:
   Automated Vitest suites asserting that different vehicles produce demonstrably distinct 3D geometry hashes, triangle budgets, and silhouette projections.
