# AUTOVERSE 3D — REPOSITORY AUDIT & SYSTEM DISCOVERY

## 1. Executive Summary
This audit inspects the complete codebase of **AutoVerse 3D**, a real-time automotive visualization and customization application built on **React 18**, **Three.js 0.174**, **Vite 6**, and **Tailwind CSS**.

- **Total Vehicle JSON Definitions**: 211 files in `public/vehicles/`.
- **Pre-baked 3D Models**: 0 static binary GLB/GLTF assets. 100% of vehicle geometry is rendered parametrically and procedurally via Three.js `BufferGeometry` lofters and component assemblers.
- **Root-Cause Defect**: Previously, multiple vehicle models defaulted to a single shared parametric template or fallback box assembly (`EditableVehicleAssembler`), changing only primary and secondary paint colors while rendering near-identical body shapes.
- **Transformation Mission**: Re-engineer the automotive geometry engine into model-specific digital twins with genuine real-world proportions, distinct silhouettes, authentic headlights/taillights, and model-specific aerodynamic packages.

## 2. Directory Architecture
```
autoverse-3d/
├── docs/                   # Engineering documentation, quality summaries, and audits
├── public/
│   ├── vehicles/           # 211 vehicle JSON definitions (supercars, hypercars, sports_cars, etc.)
│   └── vehicle-assets/     # Manifests and runtime configuration catalogs
├── src/
│   ├── components/         # React UI and 3D Viewport components
│   │   ├── 3d/             # Three.js canvas, lighting, camera rigs, overlays
│   │   ├── customizer/     # Customization panels (paint, aero, wheels, interior)
│   │   ├── modes/          # Studio, Engineering, Showroom, and Comparison modes
│   │   └── studio/         # StudioView HUD, certificate modal, vehicle selector
│   ├── geometry/           # Automotive Authentic Geometry Engine (AAGE V2)
│   │   ├── archetypes/     # Model-specific archetype generators (Coupe, Supercar, Hypercar, GT)
│   │   ├── materials/      # Physically based automotive paint & material shaders
│   │   ├── migration/      # Schema V2 migrator and normalization pipeline
│   │   ├── panelization/   # Continuous panel cutter and shutline builder
│   │   ├── surfacing/      # Parametric lofting and spline curvature evaluators
│   │   ├── validation/     # 18-gate quality assurance engine
│   │   └── wheels/         # 4-corner parametric wheel and brake assemblers
│   ├── hooks/              # Zustand global state stores (useVehicleStore)
│   ├── types/              # TypeScript schemas for vehicles, geometry, and components
│   └── utils/              # Color math, parsers, and GTA compatibility utilities
├── tests/                  # 19 Vitest test suites (133 automated tests)
└── tools/                  # Evaluation pipelines and headless screenshot tools
```

## 3. Technology Stack & Runtime Dependencies
- **UI Framework**: React 18.3.1
- **3D Graphics**: Three.js 0.174.0, `@react-three/fiber` 8.18.0, `@react-three/drei` 9.122.0
- **Build & Bundler**: Vite 6.2.0, TypeScript 5.7.3
- **State Management**: Zustand 5.0.3 with history undo/redo stack
- **Styling**: Tailwind CSS 3.4.17 with custom automotive dark palette
- **Testing Engine**: Vitest 3.0.7
- **Headless Validation**: Puppeteer-core 25.17.0
