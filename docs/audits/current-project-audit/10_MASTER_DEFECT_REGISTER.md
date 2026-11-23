# AUTOVERSE — COMPREHENSIVE TECHNICAL AUDIT
## 10. MASTER DEFECT REGISTER (POST-PHASE 21)

**Audit Date:** November 23, 2026  
**Auditor:** Principal Software Architect & QA Lead  
**Repository:** `AUTOMOBILE-DASHBOARD-`  
**Current Branch:** `feat/phase21-backend-integration`  

---

### Priority Breakdown

| Severity | Count | Criteria |
| :--- | :---: | :--- |
| **CRITICAL** | 0 | Application-breaking, data loss, or systemic architectural disconnect. *(Prior 2 Critical defects resolved in Phase 21)* |
| **HIGH** | 3 | Major feature impairment, large performance bottleneck, or misleading file exports. |
| **MEDIUM** | 8 | Noticeable functional compromise, environment blockers, or minor data risks. |
| **LOW** | 5 | Visual edge-case artifacts, minor accessibility gaps, or cosmetic inconsistencies. |
| **INFORMATIONAL** | 4 | Architectural observations, dead code, or documentation notes. |

---

### Master Defect Ledger

```
====================================================================================================
DEF-001 | CRITICAL | Frontend-to-Backend Complete Disconnection
====================================================================================================
STATUS:          RESOLVED IN PHASE 21
Subsystem:       Architecture / Networking
Resolution:      Wired React frontend to authoritative FastAPI backend via `src/services/apiClient.ts`.
                 Replaced hardcoded status pill in `TopContextBar.tsx` with live `/api/v1/health` polling.
Evidence:        Tests in `tests/apiClient.test.ts` (5/5 pass) and `tests_python/test_v1_api.py` (6/6 pass).
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-002 | CRITICAL | Dual Competing Backend Architecture with Schema Divergence
====================================================================================================
STATUS:          RESOLVED IN PHASE 21
Subsystem:       Backend Infrastructure
Resolution:      FastAPI (`services/api/`) selected as sole authoritative application API.
                 Fastify (`backend/`) deprecated. Documented in `BACKEND_ARCHITECTURE_DECISION.md`.
Evidence:        All v1 API routes implemented and verified in `services/api/`.
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-003 | HIGH | Monolithic 2.4 MB Unsplit JavaScript Bundle
====================================================================================================
STATUS:          OPEN (Target for Phase 22)
Subsystem:       Build / Performance
Exact File/Line: vite.config.ts:1
Problem:         Production build outputs a single monolithic JavaScript chunk of 2,410.80 kB (629.66 kB gzip).
Root Cause:      Eager synchronous imports of Three.js, R3F, CAD tools, Aero, and CFD in the main root bundle.
Impact:          Slow initial page load on mobile/cellular networks; exceeds standard 500 kB performance budget.
Evidence:        Vite build log: `dist/assets/index-BE1TztLs.js  2,410.80 kB`.
Recommendation:  Implement `React.lazy()` for all heavy tabs and configure Rollup `output.manualChunks`.
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-004 | HIGH | STEP AP214 Exporter Outputs Faceted Polygons, Not True B-Rep Solids
====================================================================================================
STATUS:          OPEN (Target for Phase 23)
Subsystem:       CAD / Geometry Export
Exact File/Line: packages/vehicle-exporter/src/step.ts:85 & src/utils/cadExporter.ts:140
Problem:         Exported STEP AP214 files cannot be parametrically edited in CATIA, SolidWorks, or NX.
Root Cause:      The exporter wraps WebGL triangular meshes in `FACETED_BREP` and `POLY_LOOP` containers.
Impact:          Engineers receive faceted tessellations rather than smooth analytical NURBS CAD bodies.
Evidence:        Inspection of exported STEP file reveals thousands of 3-point `POLY_LOOP` entries.
Recommendation:  Document export as "Faceted STEP" and integrate an OpenCASCADE.js WASM kernel for true B-Rep.
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-005 | HIGH | Native OpenFOAM Execution Blocked on Windows Host (BLK-001)
====================================================================================================
STATUS:          OPEN (Target for Phase 24)
Subsystem:       CFD Laboratory
Exact File/Line: src/components/cfd/CfdLab.tsx:112
Problem:         Clicking "Run CFD Simulation" cannot execute genuine Navier-Stokes solves on standard Windows host.
Root Cause:      OpenFOAM binaries (`simpleFoam`, `snappyHexMesh`) require a native Linux environment.
Impact:          Platform must fall back to empirical/analytical calculations.
Evidence:        Windows shell lacks OpenFOAM executables; UI flags fallback to `[ANALYTIC APPROXIMATION]`.
Recommendation:  Deploy a remote containerized worker service or require WSL2 Docker execution.
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-006 | MEDIUM | GPU Geometry Buffer Accumulation During Rapid Vehicle Switching
====================================================================================================
STATUS:          OPEN (Target for Phase 22)
Subsystem:       3D Graphics / Memory Management
Exact File/Line: src/components/studio/EditableVehicleAssembler.tsx:180
Problem:         Rapidly switching between vehicles accumulates uncollected WebGL geometries in browser memory.
Root Cause:      Sub-assembly geometries created procedurally are not evicted via a centralized LRU cache.
Impact:          Heap size expands from 84 MB to 218 MB after 50 vehicle switches, risking tab crash on low-VRAM devices.
Evidence:        Chrome DevTools memory profiling during automated vehicle cycling test.
Recommendation:  Implement a centralized `GeometryPool` with bounded LRU memory disposal.
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-007 | MEDIUM | Visual Mesh Penetration in Cross-Car Body Panel Swapping
====================================================================================================
STATUS:          OPEN (Target for Phase 25)
Subsystem:       Car Studio / Customization
Exact File/Line: src/components/studio/CrossCarPartSwapper.tsx:94
Problem:         Swapping curved body panels (hoods, front bumpers) between dissimilar vehicles causes mesh clipping.
Root Cause:      Linear scaling ($S_x, S_z$) does not adapt surface curvature to recipient body contours.
Impact:          Aero parts visibly clip through recipient headlights or wheel arches.
Evidence:        Mounting Jesko aero elements onto Lancer Evo IX produces visible edge overlap.
Recommendation:  Implement lattice deformation / bounding-box non-linear cage warping.
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-008 | MEDIUM | 450+ Legacy GTA Car Entries Pollute Vehicle Database
====================================================================================================
STATUS:          OPEN
Subsystem:       Vehicle Asset Pipeline
Exact File/Line: public/vehicleDatabase.json:1
Problem:         Database contains 450+ legacy GTA vehicle hashes that lack Schema 2.0 component hierarchies.
Root Cause:      Historical asset import was never fully migrated or pruned.
Impact:          Consumes 1.2 MB download bandwidth; causes errors if selected without Fleet Tier Filter active.
Evidence:        `vehicleDatabase.json` is 1.2 MB in `public/`.
Recommendation:  Prune legacy entries or migrate them into full Schema 2.0 definitions.
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-009 | MEDIUM | Procedural Coachwork Exhibits G0/G1 Curvature Discontinuities
====================================================================================================
STATUS:          OPEN (Target for Phase 25)
Subsystem:       3D Modeling / Shading
Exact File/Line: packages/vehicle-generation-engine/src/chassis.ts:65
Problem:         Subtle polygonal pinch lines visible along A-pillars and rear haunches under specular reflections.
Root Cause:      Parametric lofts use cubic Bezier slices without cross-patch G2 curvature matching.
Impact:          Reflections break across panel transitions; does not meet automotive Class-A surfacing standards.
Evidence:        Specular zebra striping shader reveals broken reflection bands.
Recommendation:  Apply Catmull-Clark subdivision or bi-cubic Hermite patch smoothing.
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-010 | MEDIUM | Suspension Kinematics Ignores Multi-Link Bushing Compliance
====================================================================================================
STATUS:          OPEN (Target for Phase 26)
Subsystem:       Vehicle Dynamics
Exact File/Line: src/utils/vehicleDynamics.ts:145
Problem:         Suspension roll angle calculation assumes rigid geometric linkages.
Root Cause:      Elasto-kinematic compliance of rubber suspension bushings is omitted for compute efficiency.
Impact:          Dynamic toe and camber changes under heavy lateral loading are understated by ~15%.
Evidence:        Formulas use fixed geometric roll center height ($h_{rc}$).
Recommendation:  Add linear bushing compliance factors to roll steer and dynamic camber equations.
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-011 | MEDIUM | Boundary Layer Prism Inflation is 2D/3D Visual Only
====================================================================================================
STATUS:          OPEN (Target for Phase 24)
Subsystem:       Mesh Generator
Exact File/Line: src/components/mesh/MeshGenerator.tsx:88
Problem:         Boundary layer inflation option renders visual prisms but does not generate volume mesh.
Root Cause:      Full 3D unstructured hybrid mesh generation is too compute-intensive for client-side JS.
Impact:          Users cannot export a true volumetric CFD mesh for external solvers.
Evidence:        Mesh exporter outputs 2D surface triangle facets only.
Recommendation:  Label boundary layer feature as "Surface Prism Visualization".
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-012 | MEDIUM | Code Duplication Between Exporter Package and src/utils
====================================================================================================
STATUS:          OPEN
Subsystem:       Monorepo Hygiene
Exact File/Line: packages/vehicle-exporter/ & src/utils/cadExporter.ts
Problem:         STEP and STL export logic is duplicated across the workspace package and the frontend utility.
Root Cause:      Frontend needed direct browser blob downloads without linking workspace package build output.
Impact:          Fixes applied to one exporter are not mirrored in the other.
Evidence:        Parallel implementations of `exportToSTEP` in both locations.
Recommendation:  Refactor `packages/vehicle-exporter` to export browser-compatible blob utilities directly.
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-013 | LOW | Sub-Optimal Label Contrast in Dark Theme Viewport (WCAG AA)
====================================================================================================
STATUS:          OPEN
Subsystem:       UI / Accessibility
Exact File/Line: src/components/studio/StanceControls.tsx:54
Problem:         Inactive axis labels use `text-slate-500` on `bg-slate-950` with contrast ratio of 4.1:1.
Root Cause:      Subtle styling intended for secondary telemetry fails strict WCAG 2.1 AA small text threshold (4.5:1).
Impact:          Reduced readability for users with low-contrast visual impairments.
Evidence:        Color contrast analyzer measurement.
Recommendation:  Elevate label color to `text-slate-400` (5.8:1 contrast ratio).
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-014 | LOW | Custom Range Sliders Lack ARIA Attributes
====================================================================================================
STATUS:          OPEN
Subsystem:       UI / Accessibility
Exact File/Line: src/components/studio/SuspensionDock.tsx:78
Problem:         Custom styled `<input type="range">` elements lack `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
Root Cause:      Tailwind styling wrapped input elements without propagating ARIA accessibility props.
Impact:          Screen readers cannot announce dynamic slider value changes to visually impaired users.
Evidence:        HTML DOM inspection of suspension controls.
Recommendation:  Add standard ARIA slider attributes to all tuning inputs.
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-015 | LOW | Headlight and Taillight Optics Lack Internal Reflector Detail
====================================================================================================
STATUS:          OPEN (Target for Phase 25)
Subsystem:       3D Assets / Visual Realism
Exact File/Line: packages/authentic-geometry-engine/src/lighting.ts:32
Problem:         Vehicle lighting assemblies use simple flat emissive glass lenses without internal projector optics.
Root Cause:      Light assemblies were simplified to keep total vehicle triangle counts under 60k.
Impact:          Headlights appear flat and non-photorealistic when viewed close-up in the studio.
Evidence:        Visual inspection of Porsche and Ferrari headlight lenses.
Recommendation:  Add instanced parabolic reflector and LED projector geometries inside the housing.
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-016 | LOW | Mobile Viewport Side Drawer Ergonomics
====================================================================================================
STATUS:          OPEN (Target for Phase 26)
Subsystem:       UI / Mobile Responsiveness
Exact File/Line: src/components/studio/StudioLayout.tsx:120
Problem:         Opening the right control dock on mobile screens (< 640px) obscures 90% of the 3D viewport.
Root Cause:      Side drawer uses desktop-oriented width ($340\,\text{px}$) on all breakpoints.
Impact:          Difficult to observe real-time 3D vehicle changes on smartphones while adjusting sliders.
Evidence:        Mobile emulation testing at 375x812 viewport.
Recommendation:  Implement responsive bottom sheet (`h-1/2 bottom-0`) for viewports below 768px.
----------------------------------------------------------------------------------------------------

====================================================================================================
DEF-017 | LOW | Absence of Photographic Texture Maps
====================================================================================================
STATUS:          OPEN (Target for Phase 25)
Subsystem:       3D Assets / Materials
Exact File/Line: public/textures/
Problem:         No photographic texture maps exist in `public/textures/`; materials rely entirely on procedural math.
Root Cause:      Designed to minimize bundle download size and avoid asset loading latency.
Impact:          Interior leather stitching, carbon fiber weave, and tire tread sidewalls lack tactile realism.
Evidence:        `public/textures/` contains zero bitmap assets.
Recommendation:  Include compressed WebP/KTX2 normal maps for tire tread and carbon fiber weave.
----------------------------------------------------------------------------------------------------
```
