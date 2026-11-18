# AUTOVERSE 3D — ASSET INVENTORY & PIPELINE AUDIT

## 1. Asset Inventory Summary
- **Binary 3D Files (GLB/GLTF/OBJ)**: 0 files. The repository relies entirely on procedural, mathematical, and algorithmic geometry generators.
- **Parametric JSON Specifications**: 211 files located in `public/vehicles/`.
- **Runtime Catalogs & Manifests**:
  - `public/vehicle-assets/manifest.json`: Asset binding mappings for vehicle models.
  - `src/data/vehicleDatabase.json`: Database summary of models and configurations.
  - `src/data/parametricCatalog.ts`: Parametric files and catalog index bindings.
- **Texture Assets & HDRI**: Procedural PBR environment maps (`studio-dark`, `studio-light`, `neon-night`, `cyberpunk`, `desert-dusk`) generated via canvas and Three.js PMREM generators.

## 2. Coordinate System Standards
The geometry engine enforces strict right-handed CAD automotive coordinates:
- **Forward Axis**: $+Z$ (towards the front bumper)
- **Rear Axis**: $-Z$ (towards the rear bumper/exhaust)
- **Up Axis**: $+Y$ (normal to ground plane, $Y=0$ is the road surface)
- **Lateral Axis**: $+X$ is vehicle left (port), $-X$ is vehicle right (starboard)
- **Unit Scale**: 1 Three.js unit = 1.000 real-world meter
