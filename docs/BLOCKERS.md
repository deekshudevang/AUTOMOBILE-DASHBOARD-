# BLOCKERS.md — AutoVerse 3D Engineering Obstacles & Mitigation Log

## 1. Documented Blockers & Resolution Register

### Blocker 1: Absence of Authentic Pre-Baked 3D Mesh Assets (GLB/GLTF/OBJ)
- **Status**: CLOSED & MITIGATED (Item 3, Commit `d0ca15d`)
- **Description**: The repository contains zero physical 3D mesh files in `public/vehicle-assets/cars/`.
- **Resolution & Honest Standard**:
  - All 8 entries in `public/vehicle-assets/manifest.json` have been explicitly marked with `"assetStatus": "not_available"` and `"tier": "procedural"`.
  - ZR350 manufacturer path corrected to `/vehicle-assets/cars/mazda/rx7_fd.glb`.
  - Added CI check (`npm run validate:assets` via `scripts/validate-manifest-assets.ts`) that fails if any assetPath claiming to be available does not resolve to physical disk.
  - Geometry is honestly identified in UI as Procedural (brand-inspired).

---

### Blocker 2: Axis-Aligned Cuboid Bodywork Defect
- **Status**: CLOSED (Resolved in Commit `025f199` / `3c05cc7`)
- **Description**: Legacy `src/components/3d/VehicleRenderer.tsx` instantiated 3 `boxGeometry` primitives (`[1.76, 0.46, 4.2]`, `[1.68, 0.36, 1.5]`, `[1.44, 0.58, 2.1]`) representing lower hull, hood, and roof.
- **Resolution**:
  - Verified in `src/components/3d/VehicleRenderer.tsx`: all 3 `boxGeometry` primitives have been completely removed.
  - Rendering engine standardized on `EditableVehicleAssembler` and Schema 2.0 multi-station parametric lofts.
  - Zero box geometry primitives remain in active rendering paths.

---

### Blocker 3: Headless GPU Rendering for Automated Screenshots in CI/Node
- **Status**: MITIGATED
- **Description**: Node.js test environments lack native WebGL contexts without external GPU headless wrappers.
- **Mitigation Path**:
  - Headless Chromium with software rasterizer (`--headless=new --use-gl=angle`) targeting 1600x900 / 844x390 resolutions.
