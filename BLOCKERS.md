# BLOCKERS.md — AutoVerse 3D Engineering Obstacles & Mitigation Log

## 1. Active & Documented Blockers

### Blocker 1: Absence of Authentic Pre-Baked 3D Mesh Assets (GLB/GLTF/OBJ)
- **Status**: ACTIVE / SYSTEMIC
- **Description**: The repository contains zero physical 3D mesh files (`.glb`, `.gltf`, `.obj`, `.fbx`) in `vehicle-assets/` or `public/vehicle-assets/cars/`. The existing `manifest.json` references theoretical paths (e.g. `/vehicle-assets/cars/bmw/m3_g80.glb`), but these files were never created or committed.
- **Impact**: No vehicle model can load an authentic manufacturer CAD mesh (Asset Priority Tier 1). Every vehicle must rely on Tier 4 (High-Quality Parametric Procedural Template).
- **Conservative Mitigation Path**:
  - Implement full 7-archetype parametric geometry generator using Catmull-Rom longitudinal splines, transverse cross-section lofts (≥24 stations), wheel arch topological cuts, and discrete panels with shut-line gaps.
  - Enforce Non-Negotiable Rule 6: Display the prominent diagnostic badge on all procedural views:
    `APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY`
  - When user provides real GLB assets via Asset Manager drag-and-drop, AssetResolver seamlessly elevates them to Tier 1.

---

### Blocker 2: Axis-Aligned Cuboid Bodywork Defect
- **Status**: CONFIRMED & ROOT-CAUSED (Being fixed in Phase 2)
- **Description**: `src/components/3d/VehicleRenderer.tsx` instantiates 3 `boxGeometry` primitives (`[1.76, 0.46, 4.2]`, `[1.68, 0.36, 1.5]`, `[1.44, 0.58, 2.1]`) to represent the lower hull, hood, and cabin roof. These rectangular boxes have flat axis-aligned normals, no tumblehome, no shoulder lines, and no wheel cutouts.
- **Impact**: Vehicles visually appear as primitive rectangles with wheels clipping through the body.
- **Conservative Mitigation Path**:
  - Replace `boxGeometry` assemblies with a lofted `BufferGeometry` surface engine generating position, normal, UV, and index attributes across 7 distinct vehicle archetypes.

---

### Blocker 3: Headless GPU Rendering for Automated Screenshots in CI/Node
- **Status**: MITIGATED
- **Description**: Node.js test environments (Vitest/Node) lack native WebGL contexts without external GPU headless wrappers.
- **Conservative Mitigation Path**:
  - Use headless Chrome with software rasterizer (`--headless=new --use-gl=angle` or puppeteer CDP) targeting `1600x900` resolution.
  - Expose client-side and standalone canvas screenshot export pipeline.
