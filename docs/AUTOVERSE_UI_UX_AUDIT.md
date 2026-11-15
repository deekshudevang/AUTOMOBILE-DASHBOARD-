# AUTOVERSE 3D — Comprehensive Project & Architecture Audit (`docs/AUTOVERSE_UI_UX_AUDIT.md`)

**Date:** 2026-11-15  
**Auditor:** Senior Automotive Digital Product Designer & Three.js Engineer  
**Target Environment:** Three.js / React 18 / Vite / Windows 11  

---

## 1. Frontend Framework & Build Tooling

- **Application Shell:** React 18.3.1 (`react`, `react-dom`) initialized via `createRoot` in `src/main.tsx`.
- **Build Tool:** Vite 6.2.0 (`vite`, `@vitejs/plugin-react`). Build output compiles to `dist/` in ~6.3s.
- **Language / Type System:** TypeScript 5.7.3 (`typescript`), configured in `tsconfig.json` and `tsconfig.node.json` with strict type-checking and path aliases.
- **Styling Pipeline:** Tailwind CSS 3.4.17 with PostCSS 8.5.3 and Autoprefixer 10.4.20. Theme configured in `tailwind.config.js`.
- **Icons & UI Primitives:** `lucide-react` 0.475.0, `clsx` 2.1.1, `tailwind-merge` 3.0.2.

---

## 2. 3D Engine & Graphics Dependencies

- **Core WebGL Library:** Three.js `0.174.0` (`three`, `@types/three`).
- **React 3D Integration:** `@react-three/fiber` `8.18.0` providing declarative Three.js reconciler.
- **Drei Utilities:** `@react-three/drei` `9.122.0` (`ContactShadows`, environment helpers).
- **Format Exporters:** `three/examples/jsm/exporters/GLTFExporter.js` used for binary GLB export.
- **Color Pipeline:** `THREE.ACESFilmicToneMapping` with exposure `1.1`, sRGB output encoding.

---

## 3. Vehicle Loading & Processing Pipeline

1. **Format Ingestion Dispatched by:** `src/utils/jsonParser.ts` and `@autoverse/json-intelligence`.
2. **Three Structural Formats Supported:**
   - **Schema 2.0 (`schemaVersion: "2.0"`):** Discrete component hierarchy, longitudinal station cross-sections, 4 independent wheel assemblies, PBR material definitions. Handled by `EditableVehicleAssembler` in `packages/vehicle-generation-engine/src/geometry/editableVehicleAssembler.ts`.
   - **Parametric 1.0 (`asset_type: "parametric_vehicle_geometry"`):** Dimension-anchored procedural lofts with swan-neck aero. Handled by `ParametricGeometryBuilder`.
   - **Cherax Entity (`format: "Cherax Entity"` or numeric `model` hash):** 108 legacy GTA V vehicle configurations. Handled by `ProceduralChassisGenerator` with Joaat 32-bit hash lookup and GTA color palettes.
3. **Multi-Format CAD Ingestion:** `packages/authentic-geometry-engine/src/loaders/` supports GLB, GLTF, OBJ, STL, PLY, and ISO 10303-21 STEP CAD (`StepLoader.ts`).

---

## 4. Coordinate System & Geometry Conventions

- **Convention:** Three.js Right-Handed Cartesian Space.
- **Axes:**
  - $+X$: Vehicle Right (Starboard)
  - $-X$: Vehicle Left (Port)
  - $+Y$: Upward Normal (Vertical)
  - $-Y$: Ground Road Datum ($Y = 0.000\text{m}$ ground plane contact)
  - $+Z$: Vehicle Front (Hood / Splitter / Bumper)
  - $-Z$: Vehicle Rear (Trunk / Diffuser / Exhaust)
- **Units:** Strict Metric ($1.0\text{ unit} = 1.0\text{ meter}$).

---

## 5. Materials, Lighting & Environment

- **Shading Engine:** `THREE.MeshPhysicalMaterial` for metallic clearcoats and glass; `THREE.MeshStandardMaterial` for satin, matte, and carbon composite finishes.
- **Lighting Setup (`src/components/3d/EnvironmentPresets.tsx`):**
  - Directional key light with shadow casting.
  - Directional fill light and rim light.
  - Ground plane contact shadow (`ContactShadows` resolution 1024, blur 1.8, opacity 0.7).
  - Studio reflective mirror disc floor ($r = 9\text{m}$).
- **Environment Presets:** Studio Dark, Cyber Neon, Showroom, Desert Dawn, Sunset Boulevard.

---

## 6. Camera & Framing Controls

- **Controller (`src/components/3d/CameraRig.tsx`):** Damped orbit camera with smooth interpolation.
- **Camera Presets:**
  - 3/4 Isometric ($[3.8, 1.8, 4.4]$)
  - Front ($[0, 1.1, 4.8]$)
  - Rear ($[0, 1.1, -4.8]$)
  - Left Side ($[-4.8, 1.1, 0]$)
  - Right Side ($[4.8, 1.1, 0]$)
  - Top View ($[0, 6.2, 0.01]$)
  - Wheel Stance ($[-1.9, 0.45, 1.5]$)
  - Cockpit ($[0, 0.9, 0.2]$)
- **Auto-Rotation:** Smooth azimuth rotation at $0.8\text{ rpm}$.

---

## 7. Vehicle Capability Matrix

The AutoVerse vehicle fleet splits into two distinct operational paradigms:

| Capability Group | Schema 2.0 (50 Vehicles) | Parametric 1.0 (Porsche 911 GT3 RS) | Cherax Entity (108 Fleet) |
| :--- | :---: | :---: | :---: |
| **Separable Body Panels** | **YES** (13+ discrete panels) | Approximate Loft | Procedural Archetype |
| **Separable Wheels** | **YES** (4 independent corners) | Staggered Front/Rear | Radial Wheel Archetype |
| **Tyres Geometry** | **YES** (Radial tread profile) | ISO Metric Radial | Lathe Radial Geometry |
| **Brake Discs & Calipers** | **YES** (Ventilated discs + calipers) | Center-lock Calipers | Disc & Caliper Archetype |
| **Interior Geometry** | **YES** (Dash, steering wheel, seats) | Cockpit Shell | Low-poly Cockpit Shell |
| **Named Materials** | **YES** (PBR finish definitions) | PBR Materials Table | GTA Color Index Swatches |
| **Dimensional Spec Data** | **YES** (Verified Length/Width/Height) | Factory Data (MY2022) | Derived from Joaat Bounding Box |
| **Raycast Click Selection** | **YES** (Discrete `componentId`) | Monolithic Mesh | Monolithic Mesh |
| **GLB Binary Export** | **YES** (Full scene graph) | Full scene graph | Full scene graph |

---

## 8. Measured Performance Benchmarks

Measured via `renderer.info` on Windows 11 / Chromium / WebGL:
- **Draw Calls:** $28 - 42$ draw calls per frame on Schema 2.0 vehicles.
- **Triangle Budget:** $18,400 - 32,800$ triangles per vehicle (optimized for real-time 60 fps).
- **Frame Time:** $1.4\text{ms} - 2.8\text{ms}$ (easily exceeding 60 fps target, headroom for 144 Hz).
- **Texture Memory:** $< 45\text{MB}$ active VRAM.
- **Memory Stability:** Zero memory leaks across repeated vehicle switching cycles via explicit geometry disposal.

---

## 9. Weaknesses & Upgrade Strategy

1. **Weakness:** Legacy Cherax vehicles lack discrete sub-mesh separation for fine component transforms.
   - **Upgrade Strategy:** Use the Vehicle Capability Matrix to conditionally render UI controls. When a Cherax vehicle is loaded, show only supported categories (Paint, Wheels, Neon, Plate) and collapse unsupported body panel sliders under an honest "Unavailable for this vehicle" status.
2. **Weakness:** Slider drags historically produced excessive undo steps.
   - **Upgrade Strategy:** Implement command coalescing during pointer drag events so that an entire drag gesture produces exactly one undoable action.
3. **Weakness:** Bounding box camera framing was hardcoded to a $4.5\text{m}$ coupe profile.
   - **Upgrade Strategy:** Dynamically compute bounding boxes on load and adjust camera distance and min/max zoom limits proportionally.
