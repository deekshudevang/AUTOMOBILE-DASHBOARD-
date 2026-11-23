# AUTOVERSE — INDEPENDENT TECHNICAL AUDIT
## 11. RECOMMENDED UPGRADE ROADMAP

**Audit Date:** November 23, 2026  
**Auditor:** Principal Software Architect & Product Roadmap Lead  
**Repository:** `AUTOMOBILE-DASHBOARD-`  
**Current Branch:** `feat/phase21-backend-integration`  
**Base Commit:** `0dec8ef`  

---

### Phase 21: True Backend Integration, Database Architecture & Persistent Workspace
**STATUS: COMPLETED & VERIFIED IN PHASE 21**  
**Objectives Achieved:**
1. **Authoritative Backend Standardized:** Standardized on FastAPI (`services/api/`) as the single source of truth for engineering calculations, database persistence, and project lifecycle. Deprecated Fastify (`backend/`) duplication.
2. **Typed Client Architecture:** Implemented `src/services/apiClient.ts` featuring automatic fallback, exponential backoff, type-safe API envelopes, and health probe queries.
3. **Real Health Status Indicator:** Eliminated hardcoded `useState(true)` in `TopContextBar.tsx`; now actively queries `/api/v1/health` and live database connectivity (`SELECT 1`), displaying truthful `ONLINE`, `DEGRADED`, or `OFFLINE (LOCAL)` status.
4. **Dual-Layer Persistence:** Saved vehicle builds and customized configurations now persist dual-layer: immediately in local storage for offline responsiveness, and synchronized to the SQLite database `saved_builds` table (Model #23) via `POST /api/v1/builds`.
5. **Legacy Migration Pipeline:** Built `src/services/legacyMigration.ts` and `LegacyMigrationModal.tsx` allowing one-click migration of legacy browser configurations into database records without data loss.
6. **Automated Verification:** Added 6 backend Pytests (`tests_python/test_phase21_api.py`) and 5 frontend Vitest tests (`tests/apiClient.test.ts`), bringing totals to 13 Pytests and 248 Vitests passing.

---

### Phase 22: Bundle Optimization, Dynamic Code-Splitting & Memory Lifecycle
**STATUS: PLANNED (IMMEDIATE NEXT PRIORITY — P0)**  
**Objective:** Eliminate the monolithic 2.41 MB JavaScript bundle (DEF-003) and prevent WebGL memory accumulation during vehicle cycling (DEF-006).

1. **Route-Based & Tab-Based Lazy Loading:**
   - Refactor heavy engineering modules into dynamic imports via `React.lazy()`:
     ```typescript
     const CadDesigner = React.lazy(() => import('./components/cad/CadDesigner'));
     const AeroStudio = React.lazy(() => import('./components/aero/AeroStudio'));
     const CfdLab = React.lazy(() => import('./components/cfd/CfdLab'));
     const DynamicsSimulator = React.lazy(() => import('./components/dynamics/DynamicsSimulator'));
     ```
2. **Vite Rollup Chunk Configuration:**
   - Configure `manualChunks` in `vite.config.ts` to isolate `@react-three/fiber`, Three.js core math, and exporter utilities into independent cached chunks.
   - Target: Initial entry bundle $< 450\,\text{kB}$ (gzip $< 120\,\text{kB}$).
3. **Centralized Geometry Disposal Pool:**
   - Create a `GeometryCachePool` managing all procedurally generated vehicle sub-assemblies with a strict LRU limit (max 10 vehicles in cache).
   - Ensure all abandoned Three.js vertex buffer attributes, textures, and materials are explicitly disposed to maintain browser heap memory $< 120\,\text{MB}$.

---

### Phase 23: OpenCASCADE.js / True B-Rep Solid CAD & Analytical STEP AP214
**STATUS: PLANNED (P1 PRIORITY)**  
**Objective:** Elevate the CAD Designer from a polygonal mesh modifier to an authentic solid modeling CAD system (DEF-004).

1. **OpenCASCADE.js WebAssembly Integration:**
   - Integrate `opencascade.js` (WebAssembly compilation of the Open CASCADE Technology C++ CAD kernel).
   - Allow true topological operations: solid extrusion, boolean union/difference, edge filleting, and analytic surface lofts.
2. **Analytical STEP AP214 / AP242 Export:**
   - Upgrade the STEP exporter to output genuine analytic `B_SPLINE_SURFACE_WITH_KNOTS`, `CYLINDRICAL_SURFACE`, and exact `TOPOLOGICAL_REPRESENTATION_ITEM` entities.
   - Ensure exported STEP files open in SolidWorks, CATIA, and NX as fully editable parametric solid bodies rather than faceted graphics bodies.
3. **G1/G2 Curvature Inspection Shader:**
   - Add zebra-striping curvature reflection shaders in the CAD viewport to evaluate surface smoothness across automotive panels.

---

### Phase 24: Remote Containerized CFD Solver (OpenFOAM Worker Service)
**STATUS: PLANNED (P1 PRIORITY)**  
**Objective:** Enable genuine 3D finite-volume Navier-Stokes simulations by resolving the Windows execution barrier (DEF-005, BLK-001).

1. **Containerized OpenFOAM Worker:**
   - Build a lightweight Docker container image (`autoverse-cfd-worker`) running Ubuntu 22.04 LTS with OpenFOAM v2312 pre-installed.
   - Configure a Celery/Redis or FastAPI background task worker queue to accept OpenFOAM case directories from AutoVerse.
2. **Automated Mesh Generation & Solver Execution:**
   - Worker automatically runs `surfaceFeatures`, `blockMesh`, `snappyHexMesh`, and `simpleFoam` in parallel using MPI.
   - Stream convergence residual plots ($p, U_x, U_y, U_z, k, \omega$) back to the AutoVerse client in real time via WebSockets.
3. **Paraview / VTK Slice Visualizer:**
   - Extract 2D cutting plane slices and streamline coordinates from OpenFOAM runtime outputs and render them directly in the Three.js viewport.

---

### Phase 25: Photorealistic PBR Material Pipeline & Interior Optics
**STATUS: PLANNED (P2 PRIORITY)**  
**Objective:** Enhance the visual realism of vehicle interiors, lighting assemblies, and materials (DEF-013, DEF-015).

1. **Compressed KTX2 / Basis Universal Textures:**
   - Introduce compressed GPU texture maps for tire sidewall lettering, carbon fiber twill weave, and interior leather grain.
2. **Detailed Headlight & Taillight Optic Geometries:**
   - Model internal multi-element LED projectors, faceted parabolic reflectors, and distinct lens glass indices of refraction ($n = 1.52$).
3. **Lattice Deformation Fitting for Swapped Parts:**
   - Implement Mean Value Coordinates or Thin-Plate Spline deformation grids to seamlessly contour swapped body components to recipient body panels without clipping.

---

### Phase 26: Mobile Bottom-Sheet Ergonomics & WCAG 2.1 AAA Accessibility
**STATUS: PLANNED (P2 PRIORITY)**  
**Objective:** Ensure workstation ergonomics and accessibility across all screen sizes (DEF-011, DEF-012, DEF-014).

1. **Responsive Bottom-Sheet Drawer:**
   - On screens $< 768\,\text{px}$, replace the right-hand inspection drawer with an expandable swipeable bottom sheet, preserving 80% viewport visibility while tuning suspension and colors.
2. **Comprehensive ARIA Propagation:**
   - Add full ARIA role, value, and label tags to all custom sliders, dropdowns, and canvas control triggers to achieve 100% WCAG 2.1 AA/AAA compliance.
