# TASK.md - AUTOVERSE 3D Engineering Roadmap

## Status Overview
- **Project**: AUTOVERSE 3D — JSON to 3D Vehicle & Supercar Configurator
- **Current Phase**: Phase 28 — Complete 50 Vehicle Library Rebuild & Editable Component Geometry (Schema 2.0)
- **Status**: COMPLETED & VERIFIED (102/102 Tests Passing, Production Build Clean)

---

## Phase Checklist

### Phase 1: Project Discovery and JSON Intelligence
- [x] Scan workspace and catalog all 108 vehicle JSON files in `Vehicles/`
- [x] Identify root formats (`Cherax Entity`, Type 1) and model hash mechanism (Joaat 32-bit unsigned hashes)
- [x] Map unique vehicle hashes (74 unique models across 108 configs)
- [x] Identify duplicates (e.g. `2F2FSUPRA_Retro_Shade.json` vs `lulli.json`)
- [x] Map common vs uncommon properties (`extras` 87/108, `attachments` 5/108, `_creatorSignature` 3/108, `bulletproofTyres`/`driftTyres` 87/108)
- [x] Run automated JSON schema extraction script and generate `JSON_SCHEMA_REPORT.md`
- [x] Build vehicle metadata database mapping Joaat hashes to real-world vehicles, manufacturers, and GTA names

### Phase 2: React + Three.js / R3F Engine Foundation
- [x] Scaffold Vite + React + TypeScript + Tailwind CSS application
- [x] Install core dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `zustand`, `lucide-react`, `clsx`, `tailwind-merge`, `jszip`
- [x] Configure Tailwind CSS with Unslop design tokens (graphite neutrals, electric cyan accents `#00F0FF`, precise typography)
- [x] Build core 3D Canvas with OrbitControls, Studio HDR lighting, soft contact shadows, ground reflections
- [x] Implement camera presets (Front, Rear, Left, Right, Top, Isometric, Interior, Cinematic 360 rotation)
- [x] Implement Screenshot capture with metadata, wireframe mode, and studio lighting presets

### Phase 3: Vehicle Asset Registry & Intelligent Loader
- [x] Create `public/vehicle-assets/manifest.json` asset registry
- [x] Build 3D vehicle geometry and model loader with support for GLB/GLTF/OBJ/FBX
- [x] Provide authentic 3D models and procedural PBR vehicle assemblies for key brands (BMW, Porsche, Audi, Lamborghini, Ferrari, Toyota, Nissan, Mercedes)
- [x] Implement strict "Missing Asset State" when a model hash has no mapped 3D mesh (never fabricate false labels)
- [x] Implement drag-and-drop 3D asset importer in Asset Manager to bind custom GLB/GLTF to any vehicle model

### Phase 4: JSON-to-3D Vehicle Customization Engine
- [x] GTA V color palette engine (160+ metallic/classic/matte color swatch mappings) + Custom RGB Hex picker
- [x] Metallic, clearcoat, matte, gloss, and pearlescent automotive shader materials
- [x] Realistic tinted glass with variable opacity and tint indices (Limo, Smoke, Pure Black, None)
- [x] Neon Underglow Kit system (Left, Right, Front, Back toggles, custom RGB point lights, ground bounce)
- [x] Interactive Wheel Engine (wheel types, rim finishes, tyre appearance, drift/bulletproof flags)
- [x] Mod Slots (mod0 to mod49) system with friendly names (Spoiler, Bumpers, Skirts, Exhaust, Hood, Grille, Roof, Livery)
- [x] License Plate engine (custom text, Yankton / Blue on White / Yellow on Black styles)

### Phase 5: Premium Dark Automotive UI & Navigation
- [x] Main Sidebar with 10 modules: Dashboard, Library, 3D Studio, JSON Explorer, Customization, Comparison, Asset Manager, History, Export, Settings
- [x] Dashboard view with metrics: Total JSONs (108), Unique Models (74), Asset Availability, Property breakdown, Recent vehicles
- [x] Vehicle summary cards with badges, manufacturer logos, model hashes, and quick load actions

### Phase 6: Vehicle Library Module
- [x] Searchable & filterable library (Manufacturer, Category, Supercar, Sports, Sedan, SUV, Favorites)
- [x] Multi-configuration support per vehicle model (e.g. 8 BMW configs, 4 Mercedes configs)
- [x] Duplicate configuration indicator & config diff launcher

### Phase 7: Advanced JSON Explorer & Two-Way Sync
- [x] Interactive JSON tree browser with syntax highlighting and collapsible nodes
- [x] Direct JSON editor with real-time validation and error diagnostics
- [x] Bidirectional synchronization: changing 3D controls updates JSON; editing JSON updates 3D scene immediately
- [x] Side-by-side JSON file comparison with diff highlights

### Phase 8: Multi-Vehicle Comparison Studio
- [x] 2 to 4 synchronized 3D vehicle viewports
- [x] Synchronized camera angles & lighting
- [x] Side-by-side property diff table (paint, wheels, mods, plate)
- [x] Multi-car comparative screenshot generation

### Phase 9: Asset Manager & Modular Mesh Binder
- [x] Asset inspector for user-uploaded GLB/GLTF/OBJ/FBX files
- [x] Model-to-Hash assignment interface
- [x] Material inspector and attachment point calibrator
- [x] Geometry inspection (vertex count, triangles, meshes)

### Phase 10: Import / Export Center & History
- [x] Original and modified JSON export with preserved formatting and unknown properties
- [x] Batch JSON ZIP download (compiles all 108 vehicle configurations into a single `.zip`)
- [x] Configuration backup and restore
- [x] Undo / Redo history stack for customization actions

### Phase 11: Performance Optimization & RTX 4060 Target
- [x] Lazy loading of 3D models and textures
- [x] WebGL memory disposal on vehicle unmount
- [x] Performance stats monitor and graphics quality presets (Low, Medium, High, Ultra)

### Phase 12: Testing, Verification & Validation
- [x] Automated Vitest unit tests for JSON parser, Joaat hash resolver, color converter, and schema validator (11/11 tests passing)
- [x] End-to-end configuration round-trip test (Import -> Modify -> Export -> Re-import -> Verify)
- [x] Error handling tests for malformed JSON, unknown models, missing assets

### Phase 13: Documentation Suite
- [x] `README.md`
- [x] `ARCHITECTURE.md`
- [x] `JSON_SCHEMA_REPORT.md`
- [x] `VEHICLE_ASSET_GUIDE.md`
- [x] `MOD_MAPPING_GUIDE.md`
- [x] `INSTALLATION.md`
- [x] `TEST_REPORT.md`
- [x] `TASK.md`

### Phase 14: Decoupled Monorepo Architecture & Universal Packages
- [x] `@autoverse/shared-types`: Universal TypeScript contracts & four-level status reports
- [x] `@autoverse/gta-compat`: Signed/unsigned 32-bit Joaat math, 160+ GTA color swatches, mod0-mod49 dictionary
- [x] `@autoverse/json-intelligence`: Schema detection, FiveM XML parsing, lossless round-trip preservation
- [x] `@autoverse/vehicle-registry`: 74 unique models mapped with confidence scores
- [x] `@autoverse/vehicle-generation-engine`: Standalone Three.js engine with zero React/DOM imports
- [x] `@autoverse/vehicle-asset-pipeline`: Asset manifest handling, AssetResolver, and AssetInspector
- [x] `@autoverse/vehicle-exporter`: Cherax JSON, FiveM `vehicles.meta` XML, and batch fleet ZIP compilation

### Phase 15: Local-First Backend & Offline SQLite Job Queue
- [x] Fastify server listening on loopback `127.0.0.1:3001` with local CORS
- [x] Native Node.js `node:sqlite` database repository with WAL mode (`autoverse.db`)
- [x] Persistent embedded job queue (`OfflineJobQueue`) for batch fleet processing
- [x] Full REST API endpoints for vehicles, undo/redo history, background jobs, and XML/ZIP exports

### Phase 16: Milestone 1 BMW M3 Verification & Acceptance
- [x] Verified `Vehicles/BMW M3 MINT GREEN.json` (hash 2709293299, sentinel5, custom cyan paint, wheel type 8, 4-channel neon)
- [x] Validated standalone Three.js scene assembly generation with zero DOM dependencies
- [x] Validated lossless round-trip serialization and FiveM XML export
- [x] 37/37 unit and integration tests passing across 6 test suites with 0 failures

### Phase 17: Vehicle Geometry Engine Reconstruction
- [x] Phase 1 Audit: Produced `GEOMETRY_DEFECT_REPORT.md` documenting primitive usage table, root-cause diagnosis, proportion defects, 0 GLB asset inventory, and captured baseline 1600x900 screenshots (`artifacts/screenshots/baseline/`)
- [x] Phase 2 Parametric Body Engine: Built `LongitudinalProfileGenerator`, `CrossSectionGenerator` (≥28 transverse stations with wheel arch cutouts and flares), `SurfaceLofter` (watertight BufferGeometry lofting with area-weighted normals), and `PanelSeparator` (bonnet, fascias, diffuser, doors, side skirts with 3mm shut-lines)
- [x] Phase 3 Geometry Profiles: Defined typed `VehicleGeometryProfile` schema with 28 fields, validation rules, and 7 archetype templates (`sedan`, `coupe`, `sports_car`, `supercar`, `suv`, `muscle_car`, `pickup`)
- [x] Phase 4 Detailed Components & Anchors: Built profile-derived mounting anchor system (`AssemblyGraph`) with body style compatibility rejection
- [x] Phase 5 Wheels & Suspension: Built `WheelGenerator` with authentic toroidal radial tyres (`LatheGeometry` with sidewall bulge and crown tread), stepped multi-piece rim, ventilated brake disc, 6-piston caliper; updated `WheelAssembly.tsx` and removed all flat cylinders
- [x] Phase 6 Materials & Diagnostics: Built `GeometryDiagnostics` automated 9-point CI verification suite (anti-box check, NaN/Inf, unit normals, ground plane contact, tyre-arch clearance, triangle budget)
- [x] Phase 7 Asset Priority: Implemented strict 5-tier resolution logging with rejection reasons in `AssetResolver` (Tier 1 Exact GLB -> Tier 2 Base Mesh -> Tier 3 Base + Mods -> Tier 4 Parametric Procedural -> Tier 5 Missing Asset State)
- [x] Phase 8 Visual Quality Gate: Captured 42 high-resolution (1600x900) screenshots across all 7 archetypes across 6 views (three_quarter, front, rear, side, wireframe, flat_normals) with mandatory Rule 6 banner; produced `VISUAL_QA_REPORT.md`
- [x] Phase 9 Documentation & Verification: Produced `GEOMETRY_ENGINE.md`, updated `ENGINE_TASK.md` and `BLOCKERS.md`; 65/65 unit and integration tests passing (100%) and production build passing (`tsc && vite build`)

### Phase 18: Authentic Automotive Geometry Engine (AAGE) Monorepo Core
- [x] Scaffold `@autoverse/authentic-geometry-engine` package with universal TypeScript contracts
- [x] Define `AuthenticVehicleMetadata`, `GeometryQualityClass` (Class A/B/C/D), `ManufacturerSpecifications`, `TopologyAnalysisResult`, `DimensionCheck`, and `GeometryValidationReport` in `types.ts`
- [x] Integrate package aliases in root `tsconfig.json` and `vite.config.ts`

### Phase 19: Multi-Format 3D Ingestion & Native ISO 10303-21 STEP CAD Ingestion Engine
- [x] Implement `StepLoader` with ISO 10303-21 lexical tokenization, `#ID` entity resolution, and B-rep face loop ear-clipping/fan tessellation
- [x] Implement `UniversalLoader` supporting GLB, GLTF, OBJ, STL, PLY, STEP, and JSON formats
- [x] Implement automated normal vector generation and unindexed buffer conversion

### Phase 20: Mesh Topology & Automatic Spatial Unit Scale Detection Engine
- [x] Implement `MeshTopologyAnalyzer.detectUnitScale()` supporting Millimeters ($mm$), Centimeters ($cm$), Inches ($in$), Feet ($ft$), and Meters ($m$)
- [x] Implement automated non-manifold edge detection, boundary edge analysis, and degenerate zero-area triangle elimination
- [x] Implement analytical area-weighted unit normal recomputation

### Phase 21: Semantic Vehicle Component Recognition & Hierarchy Engine
- [x] Implement `ComponentRecognizer` decomposing vehicle meshes into `exterior`, `wheels`, and `interior`
- [x] Implement cockpit and interior controls classification (steering wheel, seats, dashboard, console) prior to road wheel matching
- [x] Implement 4-quadrant spatial road wheel partitioning ($FL, FR, RL, RR$) with rim, tyre, brake disc, and caliper recognition

### Phase 22: Dimensional Verification & Verified OEM Specifications Database
- [x] Implement `DimensionalValidator` calculating Length, Width, Height, Wheelbase, Front Track, Rear Track, and Ground Clearance
- [x] Establish verified OEM technical specifications database (`vehicleAssetDatabase.ts`) seeded with BMW M3 G80, Porsche 911 GT3 992, Audi R8 V10, Lamborghini Huracán, Ferrari 812, Toyota Supra A80, Nissan Skyline GT-R R34, Koenigsegg Jesko
- [x] Calculate percentage error against OEM specs and enforce tolerances ($\le 0.5\%$ Class A, $\le 3.5\%$ Class B, $\le 5.0\%$ Class C)

### Phase 23: Digital Provenance Certification & 4-Tier Accuracy Quality Grading
- [x] Implement `QualityClassifier` evaluating topology and dimensional reports into Class A (OEM), Class B (Production), Class C (Reconstructed), or Class D (Approximate)
- [x] Issue digital `ProvenanceCertificate` with cryptographic ID, timestamp, and dimensional compliance report
- [x] Enforce mandatory Rule 6 disclaimer for Class D: `APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY`

### Phase 24: Runtime Optimization & Orthographic Verification Camera Harness
- [x] Implement `RuntimeOptimizer` precomputing bounding spheres, enabling frustum culling, consolidating duplicate PBR materials, and safely disposing WebGL resources
- [x] Implement `OrthographicVerificationHarness` configuring 8 CAD-grade orthographic viewing angles (Front, Rear, Left, Right, Top, Bottom, Isometric Front, Isometric Rear)

### Phase 25: Studio Integration & Interactive Provenance Certificate HUD
- [x] Extend `VehicleAssetBinding` in `src/types/vehicle.ts` supporting custom uploaded meshes, quality class, certificate, and components
- [x] Update `AssetManagerView.tsx` with drag-and-drop dropzone for all 8 formats, real-time AAGE analysis, live quality badge, and model binding
- [x] Update `StudioView.tsx` with top HUD quality pill, Rule 6 warning banner for Class D, and interactive Provenance Certificate modal

### Phase 26: Complete AAGE Documentation Suite & Master Verification
- [x] Create `GEOMETRY_ENGINE_AUDIT.md` (Phase 1 audit)
- [x] Create `VEHICLE_ASSET_INVENTORY.md` (Phase 1 inventory)
- [x] Create `GEOMETRY_UPGRADE_PLAN.md` (Phase 1 upgrade plan)
- [x] Create `AAGE_ENGINE_ARCHITECTURE.md` (Phase 14 architectural specification)
- [x] Create `VEHICLE_GEOMETRY_VALIDATION.md` (Phase 14 dimensional tolerances & validation standard)
- [x] Create `VEHICLE_ASSET_CATALOG.md` (Phase 14 catalog of 74 unique models across 108 configs)
- [x] Create `FORMAT_SUPPORT.md` (Phase 14 format specification & support matrix)
- [x] Update `INSTALLATION.md` (installation, quick start, build, and offline usage)
- [x] 83/83 unit and integration tests passing across 9 test suites (`npm test -- --run`)
- [x] 0 TypeScript compiler errors (`tsc -b` / `tsc`)
- [x] Clean production build generated in 6.41s (`npm run build`)

### Phase 27: Parametric Vehicle Geometry Engine & Porsche 911 GT3 RS (992) Integration
- [x] Ingest dimension-anchored parametric JSON specification `porsche_911_gt3_rs_992_2022.json` (published overall dimensions: length 4.572m, width 1.900m, height 1.322m, wheelbase 2.457m, track 1.630m / 1.582m)
- [x] Build `ParametricGeometryBuilder` in `@autoverse/vehicle-generation-engine` with multi-station longitudinal lofting (15 stations from Z=2.286 to Z=-2.286)
- [x] Model authentic 992 GT3 RS aerodynamics: tall dual-element swan-neck rear wing (span 1.78m, chord 0.42m / 0.30m), top-mounted curved swan-neck brackets, endplates, swept carbon front splitter, hood extraction vents, front fender louvres, rear diffuser with 5 vertical fins
- [x] Model staggered performance wheels: 20" front (275/35 ZR 20, radius 0.35025m, center X=±0.815m) and 21" rear (335/30 ZR 21, radius 0.36720m, center X=±0.791m) with center-lock forged rims and ventilated brakes
- [x] Integrate PBR materials: GT Silver Metallic (`MeshPhysicalMaterial` #8B929A, clearcoat 1.0), exposed carbon fiber (#17191C), tinted greenhouse glass (#18232D)
- [x] Add `Parametric Vehicle` schema detection and parser support in `parseVehicleJson` and `@autoverse/json-intelligence`
- [x] Integrate into `UniversalLoader` for direct JSON-to-3D geometry generation
- [x] Wire into `VehicleRenderer.tsx` and configure as active default in `useVehicleStore.ts`
- [x] 94/94 unit and integration tests passing across 10 test suites (`npm test -- --run`)
- [x] Production build clean in 6.06s (`npm run build`)

### Phase 28: Complete Vehicle Library Rebuild (50 High-Detail Vehicles + Fully Editable Component Geometry)
- [x] Schema 2.0 TypeScript Contracts: Defined `VehicleSchema2`, `VehicleComponentDef`, `WheelComponentSpec`, `LongitudinalCrossSection`, `MaterialDef`, `ComponentOverride`, and `ComponentCustomizationOptions` in `packages/shared-types/src/schema2.ts`.
- [x] 50 Unique Vehicles Library: Generated 50 detailed Schema 2.0 JSON files across 8 categories (`supercars`, `hypercars`, `sports_cars`, `luxury_cars`, `track_cars`, `jdm_cars`, `muscle_cars`, `special_edition`) with authentic dimensions, cross-sections, wheel specs, and components in both `vehicles/` and `public/vehicles/`.
- [x] Universal Editable Vehicle Assembler: Implemented `EditableVehicleAssembler` in `packages/vehicle-generation-engine` generating discrete, addressable 3D meshes with component ID tagging, PBR materials, real-time matrix transforms, dimension scaling, and material swapping.
- [x] Universal Loader & JSON Parser Upgrades: Extended `UniversalLoader`, `parseVehicleJson`, and `schemaDetector` to seamlessly detect, parse, and instantiate Schema 2.0 assets.
- [x] Component Customization State & Store: Wired interactive customization store in `src/hooks/useVehicleStore.ts` supporting `selectedComponentId`, `componentOverrides`, `selectComponent`, `updateComponentOverride`, `toggleComponentVisibility`, `toggleComponentLock`, `resetComponentOverride`, and `resetAllComponentOverrides`.
- [x] 3D Raycasting & Viewport Interaction: Updated `src/components/3d/VehicleRenderer.tsx` with direct 3D raycasting pointer down handlers selecting components on click, and rendering live Schema 2.0 assemblies with cyan selection emissive glow.
- [x] Binary GLB Exporter: Implemented `VehicleExporter.exportToGlb` using Three.js `GLTFExporter` to download customized vehicles ready for Blender, Unreal Engine, and WebGL.
- [x] Phase 8 Professional Customization UI: Built responsive 3-column Customization Studio (`src/components/customizer/CustomizationPanel.tsx`) with 50-car category filter and search, collapsible component hierarchy tree, camera presets toolbar, comprehensive component inspector (transforms, dimensions, finishes, colors, wheel camber, wing AoA), and bottom action bar with undo/redo, save, export JSON, and export GLB.
- [x] Phase 11 Documentation Suite: Created `VEHICLE_LIBRARY_AUDIT.md`, `AAGE_GEOMETRY_SCHEMA.md`, `COMPONENT_CUSTOMIZATION_GUIDE.md`, `VEHICLE_ASSET_CATALOG.md`, and `GEOMETRY_VALIDATION_REPORT.md`.
- [x] Quality & Verification Gates:
  - 102/102 unit & integration tests passing across all 11 test suites (`npm test -- --run`).
  - Production build compiled cleanly with 0 errors (`npm run build`).
  - Headless Chromium visual verification executed with screenshots captured in `artifacts/`: `studio_view.png`, `customizer_view.png`, and `schema2_aventador_customizer.png` with 0 console errors.


