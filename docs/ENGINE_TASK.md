# ENGINE_TASK.md — Vehicle Geometry Engine Reconstruction Task Log

## Stack Detection & Build Environment
- **Target OS**: Windows 11 (64-bit), NVIDIA GeForce RTX 4060 (8GB VRAM)
- **Node.js**: v24.19.0
- **Language**: TypeScript 5.7.3
- **3D Graphics Engine**: Three.js r174 (`three`), React Three Fiber v8 (`@react-three/fiber`), Drei v9 (`@react-three/drei`)
- **UI Framework**: React 18.3.1, Tailwind CSS 3.4.17, Zustand 5.0.3, Framer Motion 12.4.10
- **XML / File Processing**: `fast-xml-parser` v5.12.0, `jszip` v3.10.1
- **Backend / DB**: Fastify v5.12.8, Native `node:sqlite` (WAL Mode)
- **Commands**:
  - **Build**: `npm run build` (`tsc && vite build`)
  - **Test**: `npm test -- --run` (`vitest run --run`)
  - **Typecheck**: `npx tsc --noEmit`
  - **Backend Server**: `npm run backend` (`tsx backend/src/server.ts`)
  - **Dev Server**: `npm run dev` (`vite`)

---

## Reconstruction Phase Tracking

| Phase | Description | Status | Deliverables / Evidence |
| :--- | :--- | :--- | :--- |
| **Phase 1: Audit (Read-Only)** | Primitive usage, root cause, proportion defects, asset inventory, test baseline | **COMPLETED** | [`GEOMETRY_DEFECT_REPORT.md`](GEOMETRY_DEFECT_REPORT.md), baseline screenshots in `artifacts/screenshots/baseline/` |
| **Phase 2: Parametric Body Engine** | Longitudinal profiles, cross-section generator (≥24 stations), surface lofting (`BufferGeometry`), analytic normals, wheel arches, separate panels, fascias | **COMPLETED** | `packages/vehicle-generation-engine/src/geometry/` (`surfaceLofter.ts`, `crossSectionGenerator.ts`, `longitudinalProfile.ts`, `panelSeparator.ts`) |
| **Phase 3: Geometry Profiles** | Typed `VehicleGeometryProfile` schema, validation rules, 7 archetype templates (Sedan, Coupe, Sports car, Supercar, SUV, Muscle, Pickup) | **COMPLETED** | `packages/vehicle-generation-engine/src/templates/geometryProfiles.ts` |
| **Phase 4: Detailed Components** | Component metadata, anchors, transforms, compatibility validation in `AssemblyGraph` | **COMPLETED** | `packages/vehicle-generation-engine/src/assembly/assemblyGraph.ts` |
| **Phase 5: Wheels & Suspension** | 4 independent wheels, toroidal tyres, rim spokes/barrel/lip, ventilated discs, calipers, camber/toe/spin | **COMPLETED** | `packages/vehicle-generation-engine/src/geometry/wheelGenerator.ts`, `src/components/3d/WheelAssembly.tsx` |
| **Phase 6: Materials & Diagnostics** | UV unwrapping, PBR clearcoat/tint, automated geometry diagnostics (anti-box check, NaN, watertightness, clearance) | **COMPLETED** | `packages/vehicle-generation-engine/src/validation/geometryDiagnostics.ts` |
| **Phase 7: Asset Priority** | 5-tier resolution logging, rejection reasons, tests for every tier | **COMPLETED** | `packages/vehicle-asset-pipeline/src/index.ts` (`AssetResolver`) |
| **Phase 8: Visual Quality Gate** | Fixed resolution screenshots (1600x900) across all 7 archetypes, wireframe + flat normals | **COMPLETED** | 42 screenshots in `artifacts/screenshots/`, [`VISUAL_QA_REPORT.md`](VISUAL_QA_REPORT.md) |
| **Phase 9: Deliverables & Handoff** | Documentation updates, `GEOMETRY_ENGINE.md`, `BLOCKERS.md`, final verification pass | **COMPLETED** | [`GEOMETRY_ENGINE.md`](GEOMETRY_ENGINE.md), [`BLOCKERS.md`](BLOCKERS.md), 65/65 passing tests (100%) |
