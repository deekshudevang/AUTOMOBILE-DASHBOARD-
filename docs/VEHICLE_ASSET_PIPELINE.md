# AUTOVERSE 3D — Vehicle Asset Pipeline & Data Architecture

## 1. Overview & Data Flow

The AutoVerse asset pipeline ingests, validates, standardizes, and renders automotive specifications and 3D models with strict fidelity labeling and provenance tracking.

```
[OEM Blueprints / Technical Specifications]
                │
                ▼
      [JSON Schema 2.0 Ingestion]
                │
                ▼
     [SchemaV2Migrator Validation]
                │
                ▼
    [VehicleGeometryEngine (V2)] ───► [QualityGates 18-Test Suite]
                │                               │
                ▼                               ▼
       [Three.js Scene Graph]         [QUALITY_SUMMARY.md]
                │
                ▼
     [PBR Materials / Lighting]
                │
                ▼
   [High-Res WebGL Render Engine]
```

---

## 2. Dimensional Provenance & Fidelity Tiers

In accordance with the AutoVerse Truth Contract, every vehicle specification must be explicitly classified:

- **Tier A (Reference-Verified)**: Silhouette, plan, and section geometry verified against factory orthographic blueprints or licensed CAD models ($\le 5\text{mm}$ error).
- **Tier B (Spec-Accurate)**: Wheelbase, track widths, overall length, width, and height matched to manufacturer published engineering specs ($\le 1\%$ error).
- **Tier C (Proportionally Estimated)**: Modeled from photographic references where complete factory dimension sheets are pending.
- **Tier D (Parametric Template)**: Approximate procedural placeholder requiring the mandatory disclaimer banner: `APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY`.

---

## 3. WebGL Resource Management & Memory Disposal

To prevent GPU leaks across dozens of rapid configuration changes:
- `EditableVehicleAssembler.dispose(root)` and `VehicleGeometryEngine.dispose()` traverse the entire scene graph.
- All `BufferGeometry` vertex attributes (`position`, `normal`, `uv`, `index`) are freed via `geometry.dispose()`.
- Cloned PBR materials and textures are systematically dereferenced via `material.dispose()`.
- Verified by automated leak tests over 50 consecutive vehicle reload cycles (`tests/memory-leaks.test.ts`).
