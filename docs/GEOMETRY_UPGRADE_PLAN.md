# AUTOVERSE 3D — GEOMETRY UPGRADE PLAN (AAGE ROADMAP)
**Document**: `GEOMETRY_UPGRADE_PLAN.md` | **System**: AutoVerse 3D AAGE | **Date**: 2026-11-11

---

## 1. System Vision & Engineering Objectives

The **Automotive Authentic Geometry Engine (AAGE)** upgrades AutoVerse 3D from a procedural/approximate visualizer to a production-grade automotive CAD and high-fidelity mesh geometry engine.

### Core Objectives:
1. **Source-First Geometry**: Prioritize manufacturer-authorized CAD, licensed 3D production models, and verified scan data over procedural approximations.
2. **Multi-Format Ingestion**: Ingest and process standard automotive 3D formats (`.glb`, `.gltf`, `.obj`, `.fbx`, `.stl`, `.ply`) and engineering CAD formats (`.step`, `.stp`).
3. **Rigorous CAD & Mesh Analysis**: Surface normal validation, manifold verification, duplicate geometry removal, and B-rep preservation.
4. **Hierarchical Component Recognition**: Automatically detect or preserve semantic parts (Hood, Bumpers, Doors, Wings, Wheels, Discs, Calipers, Interior).
5. **Manufacturer Dimensional Validation**: Validate scale against verified wheelbase, track widths, and overall dimensions.
6. **Honest Quality Classification**: Explicitly classify and tag all assets as **Class A** (Verified OEM), **Class B** (Verified Production), **Class C** (Reconstructed), or **Class D** (Approximate).

---

## 2. Multi-Format Geometry Pipeline Architecture

```
                       [ RAW VEHICLE ASSET ]
   (GLB / GLTF / OBJ / FBX / STL / PLY / STEP / AutoVerse JSON)
                               │
                               ▼
            ┌──────────────────────────────────────┐
            │       AAGE FORMAT ADAPTER            │
            │  (GLTFLoader, OBJLoader, FBXLoader,  │
            │   STLLoader, PLYLoader, STEPConverter│
            └──────────────────────────────────────┘
                               │
                               ▼
            ┌──────────────────────────────────────┐
            │     GEOMETRY ANALYSIS & VALIDATION   │
            │  - Non-manifold mesh detection       │
            │  - Area-weighted normal computation  │
            │  - Bounding box & unit scale to (m)  │
            │  - Duplicate vertex/face pruning     │
            └──────────────────────────────────────┘
                               │
                               ▼
            ┌──────────────────────────────────────┐
            │   COMPONENT RECOGNITION ENGINE       │
            │  - Exterior panels & shut-lines      │
            │  - Wheel assemblies (Rims/Tyres/Brake│
            │  - Interior cabin hierarchy          │
            └──────────────────────────────────────┘
                               │
                               ▼
            ┌──────────────────────────────────────┐
            │   DIMENSIONAL VALIDATION & REPORT    │
            │  - Wheelbase & track verification    │
            │  - Class A/B/C/D quality grading     │
            │  - Geometry Provenance Certificate   │
            └──────────────────────────────────────┘
                               │
                               ▼
            ┌──────────────────────────────────────┐
            │   OPTIMIZED THREE.JS RUNTIME SCENE   │
            │  - PBR clearcoat/metallic shaders    │
            │  - Dynamic lighting & reflections    │
            │  - Interactive component selection   │
            └──────────────────────────────────────┘
```

---

## 3. Subsystem Implementation Plan

### Subsystem 1: AAGE Core Package (`@autoverse/authentic-geometry-engine`)
Create a new dedicated workspace package containing:
- `loaders/`: Universal Multi-Format Loader supporting GLB, GLTF, OBJ, FBX, STL, PLY, and STEP.
- `analysis/`: Mesh topology analysis, normal consistency, non-manifold edge detection, and bounding box validation.
- `cad/`: STEP / B-rep processing and tessellation pipeline using OpenCascade WebAssembly (`occt-import-js`) or lightweight STEP geometry parser.
- `components/`: Semantic component recognizer identifying exterior body panels, wheels, and interior cockpit nodes.
- `validation/`: Metric dimensional validator comparing mesh bounds to OEM technical specs.
- `provenance/`: Classification metadata manager (Class A/B/C/D) and Provenance Registry.

### Subsystem 2: Integration with UI & 3D Studio
- Update `src/components/3d/VehicleRenderer.tsx` to query AAGE asset registry.
- Render authentic models when available, displaying the verified Class A / B / C badge.
- When an authentic model is unavailable, display the missing asset diagnostic card with option to load Class D approximate template.
- Add an interactive **Orthographic Multi-View Inspector** to `StudioView.tsx` (Front, Rear, Left, Right, Top, Bottom, Front 3/4, Rear 3/4).
- Add a **Component Hierarchy Inspector** allowing users to highlight, isolate, and inspect individual body panels, doors, wheels, and calipers.

### Subsystem 3: Comprehensive Test Suite
- Automated unit and integration tests covering:
  * Multi-format loading (GLB, GLTF, OBJ, FBX, STL, PLY, STEP).
  * Mesh topology and manifold analysis.
  * Dimensional validation against OEM specs.
  * Component recognition accuracy.
  * Provenance and classification integrity.

---

## 4. Phase Execution Milestones

| Milestone | Target Deliverable | Verification Check |
| :--- | :--- | :--- |
| **Phase 1** | Audit & Strategy Reports | `GEOMETRY_ENGINE_AUDIT.md`, `VEHICLE_ASSET_INVENTORY.md`, `GEOMETRY_UPGRADE_PLAN.md` |
| **Phase 2 & 3** | Authentic Geometry Engine Core | Multi-format loader, CAD/STEP converter, mesh topology analyzer |
| **Phase 4 & 5** | Component Recognition & Dimensional Validation | Semantic hierarchy mapper, OEM dimension verification |
| **Phase 6 & 7** | Multi-View Inspection & Quality Classification | 8-view orthographic harness, Class A/B/C/D badge system |
| **Phase 8 & 9** | Three.js Optimization & Central Database | DRACO/Meshopt integration, vehicle metadata registry |
| **Phase 10 & 11**| Existing JSON Compatibility & Fallback Integrity | Lossless Cherax/FiveM adapter, explicit missing-asset handler |
| **Phase 12 & 13**| Performance Optimization & Test Automation | Vitest test suite for all loaders and validators |
| **Phase 14** | Final Integration & System Handover | `AAGE_ENGINE_ARCHITECTURE.md`, `VEHICLE_GEOMETRY_VALIDATION.md`, `VEHICLE_ASSET_CATALOG.md` |

