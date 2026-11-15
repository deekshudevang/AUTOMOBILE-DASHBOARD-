# AUTOVERSE 3D — GEOMETRY ENGINE AUDIT (PHASE 1)
**Document**: `GEOMETRY_ENGINE_AUDIT.md` | **System**: AutoVerse 3D AAGE | **Date**: 2026-11-11

---

## 1. Executive System Audit

| Subsystem | Current State | Architecture & Technology | Assessment & Limitations |
| :--- | :--- | :--- | :--- |
| **Monorepo / Architecture** | Decoupled universal monorepo (`packages/`) | TypeScript 5.7.3, ES Modules, Node.js 24 | Strong separation of concerns; packages are DOM-free and reusable |
| **3D Rendering Engine** | React Three Fiber v8 & Three.js r174 | Canvas, ACESFilmic tone mapping, PCFSoftShadowMap | Modern WebGL pipeline; supports PBR materials and shadow cascades |
| **Geometry Representation** | Parametric lofted hull (`SurfaceLofter`) | BufferGeometry generated from transverse spline stations | High aesthetic quality for generic silhouettes, but **Class D approximate only**; not authentic CAD/scan geometry |
| **Physical 3D Assets** | **0 physical 3D files on disk** | Directory `public/vehicle-assets/cars/` is empty | Relies 100% on procedural templates or user-uploaded files |
| **Vehicle Data Format** | 108 Cherax Entity JSONs (`Vehicles/`) | Joaat 32-bit hashes, GTA mod slots (mod0..mod49) | **Contains zero 3D mesh geometry**; contains only configuration and tuning states |
| **Asset Pipeline** | 5-Tier Asset Priority Resolver | `@autoverse/vehicle-asset-pipeline` | Resolves asset status; currently falls back to Tier 4 Procedural Template |
| **UI & Studio** | Unslop-compliant dark UI | React 18, Tailwind CSS, Zustand 5, Lucide icons | Fully functional studio, comparison view, customizer, and asset manager |

---

## 2. Framework & Rendering Pipeline Audit

### 2.1 WebGL & Three.js Stack
- **Engine Core**: Three.js `r174` (native ES modules).
- **React Bindings**: `@react-three/fiber` (`v8.18.0`) + `@react-three/drei` (`v9.122.0`).
- **Canvas Setup** (`src/components/3d/SceneCanvas.tsx`):
  * ACESFilmic tone mapping with exposure 1.1.
  * Preserved drawing buffer enabled for screenshot and visual inspection captures.
  * Device pixel ratio clamped to `[1, 2]`.
  * Dynamic shadow map cascades and contact shadows via `ContactShadows`.
- **Camera & Lighting Controls** (`src/components/3d/CameraRig.tsx` & `EnvironmentPresets.tsx`):
  * OrbitControls with damped transitions.
  * 8 presets: `isometric` (3/4 Iso), `front`, `rear`, `left`, `right`, `top`, `interior`, `wheel`.
  * 5 studio lighting environments: `studio-dark`, `cyber-neon`, `showroom`, `desert-dawn`, `sunset-boulevard`.

### 2.2 Vehicle Rendering Pipeline (`src/components/3d/VehicleRenderer.tsx`)
- Inspects incoming `VehicleAssetBinding`.
- If `assetBinding?.isCustomUpload && assetBinding?.customMesh` is present, renders custom uploaded mesh.
- Otherwise, falls back to `ProceduralChassisGenerator.generateSculptedBody(...)` with primary/secondary paint, wheels, underglow, and license plates.
- **Critical Finding**: No native multi-format loader (OBJ, FBX, STL, PLY, STEP) is integrated into the primary pipeline; only basic browser `URL.createObjectURL` is hooked in the UI.

---

## 3. Vehicle JSON Dataset Audit

### 3.1 Format & Structure
- **Dataset Size**: 108 files located in `Vehicles/` and mirrored in `public/vehicles/`.
- **Root Format**: 100% `Cherax Entity` (Type 1: Vehicle).
- **Core Schema Fields**:
  * `format`: string (`"Cherax Entity"`)
  * `type`: integer (`1`)
  * `model`: 32-bit Joaat unsigned integer hash (e.g. `2709293299` for BMW M3 / `sentinel5`)
  * `baseFlags`: bitfield integer
  * `mods`: dictionary of tuning slots (`mod0` through `mod49`)
  * `primaryColor`, `secondaryColor`, `customPrimaryColor`, `customSecondaryColor`: paint colors
  * `wheelType`, `wheelColor`, `driftTyres`, `bulletproofTyres`: wheel specs
  * `neonKits`: 4-channel neon underglow and RGB color
  * `windowTint`: tint index (0 to 6)
  * `plateText`, `plateTextIndex`: license plate data
  * `extras`: bitmask / boolean flags

### 3.2 Geometry Content of JSON Files
> [!IMPORTANT]
> **No vehicle JSON file contains 3D mesh vertices, faces, NURBS, or CAD geometry.**  
> The JSON files represent **configuration and customization states**, not 3D spatial models. An external geometry acquisition and resolution system is mandatory.

---

## 4. Existing Procedural Geometry Generators Audit

### 4.1 Subsystems in `@autoverse/vehicle-generation-engine`
1. **`LongitudinalProfileGenerator`**:
   - Evaluates side elevation profiles along vehicle length $Z$.
   - Computes cowl, windshield rake, roof peak, backlight, and decklid heights.
2. **`CrossSectionGenerator`**:
   - Generates $\ge 28$ transverse cross-sections along $Z$.
   - Integrates circular wheel arch cutouts at $Z = \pm \text{wheelbase}/2$ and flares fender lips.
3. **`SurfaceLofter`**:
   - Connects transverse stations into indexed quad-strip `THREE.BufferGeometry`.
   - Computes vertex normals and closes front/rear caps.
4. **`PanelSeparator`**:
   - Generates discrete panels (bonnet, fascias, doors, skirts) with 3.0mm–3.5mm shut lines.
5. **`WheelGenerator`**:
   - Produces toroidal radial tyres via `THREE.LatheGeometry`, stepped rims, ventilated brake discs, and 6-piston calipers.
6. **`AssemblyGraph`**:
   - Profile-derived mounting anchor points (`mount_wheel_fl`, `mount_bonnet`, etc.).
7. **`GeometryDiagnostics`**:
   - Automated 9-point CI verification suite checking NaN, unit normals, ground contact, and anti-box constraints.

### 4.2 Quality Assessment
- **Strengths**: Eliminates primitive box mocks; produces recognizable vehicle archetype silhouettes; adheres to the mandatory Class D approximation watermark.
- **Defects & Limitations**:
  * Does NOT represent true OEM production body curves.
  * Cannot capture model-specific stamping lines, authentic headlight glass optics, manufacturer-specific radiator grilles, or exact aerodynamic diffusers.
  * Under Phase 7 standards, this procedural output is strictly **Class D — Approximate**.

---

## 5. Existing Asset Resolution & Pipeline Audit

In `packages/vehicle-asset-pipeline`:
- **`AssetResolver`** implements a 5-tier resolution hierarchy:
  1. `TIER_1_EXACT_GLB`: Manifest-registered GLB/GLTF.
  2. `TIER_2_BASE_MESH`: User-imported custom base mesh.
  3. `TIER_3_BASE_PLUS_MODS`: User-imported mesh with modular tuning parts.
  4. `TIER_4_PROCEDURAL_TEMPLATE`: Parametric procedural template with mandatory approximation banner.
  5. `TIER_5_MISSING_ASSET`: Explicit missing asset state with zero silent fallback.
- **`AssetInspector`**: Computes mesh count, vertex count, triangle count, and memory footprint.
- **Current Bottleneck**: Manifest in `public/vehicle-assets/manifest.json` points to paths (`/vehicle-assets/cars/bmw/m3_g80.glb`, etc.) that do not physically exist on disk.

---

## 6. Functional Features to Preserve

During the construction and integration of the Automotive Authentic Geometry Engine (AAGE), the following features must remain 100% operational:
1. **Bidirectional JSON Synchronization**: Edits in 3D customizer update JSON state; edits in JSON editor update 3D state immediately.
2. **GTA Color Palette & Custom RGB Engine**: 160+ swatch palette with metallic, pearlescent, matte, and clearcoat PBR shaders.
3. **4-Channel Neon Underglow & License Plate Engine**: Custom text, plate styles, and ground reflection bounces.
4. **Camera Rig & Environment Presets**: 8 camera presets and 5 studio lighting environments.
5. **Export System**: Cherax JSON export, FiveM `vehicles.meta` XML export, and fleet ZIP archive compilation.
6. **Local-First SQLite Database**: Background job queue and persistent fleet storage.

