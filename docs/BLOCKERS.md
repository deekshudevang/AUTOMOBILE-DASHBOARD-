# BLOCKERS.md — AutoVerse 3D Engineering Obstacles & Mitigation Log

## 1. Documented Blockers & Resolution Register

### Blocker 1: Absence of Authentic Pre-Baked 3D Mesh Assets (GLB/GLTF/OBJ)
- **Status**: OPEN / MITIGATED (Item 3, Commit `d0ca15d`)
- **Description**: The repository contains zero physical 3D mesh files in `public/vehicle-assets/cars/`.
- **Mitigation & Honest Standard**:
  - All 8 entries in `public/vehicle-assets/manifest.json` have been explicitly marked with `"assetStatus": "not_available"` and `"tier": "procedural"`.
  - ZR350 manufacturer path corrected to `/vehicle-assets/cars/mazda/rx7_fd.glb`.
  - Added CI check (`npm run validate:assets` via `scripts/validate-manifest-assets.ts`) that fails if any assetPath claiming to be available does not resolve to physical disk.
  - Geometry is honestly identified in UI as Procedural (brand-inspired).
  - Authentic manufacturer-licensed GLB meshes remain deferred until licensing agreements are secured.

---

### Blocker 2: Axis-Aligned Cuboid Bodywork Defect & Jagged Spike Polygons
- **Status**: CLOSED & VERIFIED (Item 7, Commit for Item 7)
- **Description**: Legacy box geometry path exhibited jagged spike polygons, floating black blocks on hood/roof, hollow tire rings with no rims, no glass, and detached rear wings on non-Porsche vehicles.
- **Resolution**:
  - Reordered rendering priorities in `src/components/3d/VehicleRenderer.tsx`: V2 Coachwork engine (`v2Result` via `VehicleGeometryEngine`) is now Priority 1 and the DEFAULT for EVERY car in the catalog.
  - Quarantined legacy box and mesh lofts strictly as explicit fallbacks.
  - Created typed Brand Design Language in `src/vehicles/brandDesign/` covering 24 distinct automotive brands (Porsche, Lamborghini, Ferrari, McLaren, Nissan, BMW, Mercedes, Audi, Toyota, Ford, Chevrolet, Koenigsegg, Bugatti, Pagani, Aston Martin, Honda, Mazda, Dodge, Subaru, Mitsubishi, Lexus, Maserati, Bentley, Rolls-Royce) with distinct silhouette curves, proportions, headlights, taillights, grilles, and wings.
  - Connected `ArchetypeRegistry.buildChassis` to brand design language with continuous watertight curved patches, attached child parts, and full radial wheels (lathe tyre sidewall, alloy multi-spoke rim, cross-drilled rotor, and monobloc caliper) responsive to stance controls.
  - 12 before/after comparison screenshots captured and committed under `docs/assets/`.
  - Closed with passing automated tests in `tests/vehicle-brand-design.test.ts`.

---

### Blocker 3: Headless GPU Rendering for Automated Screenshots in CI/Node
- **Status**: CLOSED & MITIGATED (Item 7)
- **Description**: Node.js test environments lack native WebGL contexts without external GPU headless wrappers.
- **Mitigation Path**:
  - Headless Chromium with software rasterizer (`--headless=new --disable-gpu`) via Puppeteer capturing 1280x720 comparison screenshots across multiple brands.
