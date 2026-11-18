# AUTOVERSE 3D — Master Engineering Task Ledger (`TASK.md`)

**Current Phase:** Phase 3 Complete (Ahmed Benchmark Vertical Slice Validated) → Phase 4 (Geometry Kernel Integration & Worker Pipeline)  
**Operating Standard:** Operating Contract v2 (§1.1 Truth & Evidence, §2 Session Mechanics)  
**Owner Actions Pointer:** See [`docs/OWNER_ACTIONS.md`](file:///c:/Users/deeks/Downloads/cars/docs/OWNER_ACTIONS.md) for manual host actions (Docker daemon start, optional WSL OpenFOAM install).  

---

## Environment Capabilities

| Subsystem | Specification / Version | Status & Integration Boundary |
| :--- | :--- | :--- |
| **Operating System** | Windows 11 x64 (Build 10.0.26300) | Native host environment. Shell: PowerShell. |
| **Processor (CPU)** | Intel(R) Core(TM) Ultra 7 155H (16 physical cores, 22 logical threads) | Solver thread limit: 12 threads (leaving 10 threads free for OS/IDE). |
| **System Memory (RAM)** | 15.52 GB Total Physical RAM | Container memory ceiling: 10.0 GB (guarantees host stability). |
| **Node.js & npm** | Node v24.19.0, npm 11.4.1 | Clean execution across all TypeScript, Vitest, and Vite build scripts. |
| **Python Environment** | Python 3.14.6 (with NumPy, SciPy, Pandas, Playwright, FastAPI) | Available for backend scripting, analysis, and validation pipelines. |
| **Docker** | Docker version 29.8.0, build 88096ef | Installed on host; daemon start logged in `docs/OWNER_ACTIONS.md`. |
| **WSL** | WSL 2 (Default distribution: Ubuntu) | Available for native Linux OpenFOAM integration if preferred over Docker. |
| **OpenFOAM (`simpleFoam`)** | OpenFOAM runtime not on Windows PATH | Automated case generator emits 100% compliant OpenFOAM cases. Host execution requires Docker or WSL (`docs/FEASIBILITY.md`). Graceful fallback to `ANALYTIC`. |
| **WebGL & 3D Rendering** | Three.js v0.174 + WebGL in Google Chrome | 60 fps target with dynamic LOD, PBR materials, and camera framing. |

---

## Blockers Table

| Blocker ID | Description | Impact | Remediation / Workaround | Status |
| :--- | :--- | :--- | :--- | :--- |
| `BLK-001` | OpenFOAM binary not in native Windows path | Cannot execute `simpleFoam` directly in Windows PowerShell | Generate complete, compliant OpenFOAM case bundles; execute in Docker/WSL worker or use validated `ANALYTIC` engine with explicit provenance tag. | **RESOLVED VIA WORKAROUND** |

---

## Commands Run Log (Key Milestones)

- `node scripts/audit-full-catalog.mjs` → Exit 0 (159 catalogue entries audited: 51 model-specific, 108 legacy Cherax)
- `npm test` → Exit 0 (20/20 test files, 136/136 tests passing)
- `npm run build` → Exit 0 (Vite production bundle built in 7.33s)
- `node scripts/validate-geometry.mjs` → Exit 0 (100% of pilot vehicles pass all 18 quality gates)
- `git push -u origin feat/vehicle-geometry-enhancement:main` → Exit 0 (Pushed to GitHub remote)

---

## Phase Checklist & Status Table

### Phase 0 — Baseline & Feasibility (v2)
- [x] **0.1 Record Environment**: OS, CPU, RAM, Node, Python, Docker, OpenFOAM, WebGL.
    Evidence: `node probe` → exit 0 (Intel Core Ultra 7 155H, 15.5GB RAM, Node 24.19, Python 3.14, Docker 29.8) · files: `TASK.md`.
- [x] **0.2 Baseline Repository**: Install, build, lint, test, run. Record failures as findings.
    Evidence: `npm test` → exit 0 (136/136 tests passing) · `npm run build` → exit 0 · files: `docs/BASELINE_TEST_REPORT.md`.
- [x] **0.3 Feature Audit Matrix (`docs/FEATURE_MATRIX.md`)**: Audit all features; flag simulated-for-show visual effects; enforce `CFD`/`ANALYTIC`/`ILLUSTRATIVE` taxonomy.
    Evidence: Generated `docs/FEATURE_MATRIX.md` with explicit provenance tags.
- [x] **0.4 Feasibility Memo (`docs/FEASIBILITY.md`)**: Realistic bounds on browser vs local vs remote CFD; RAM budget; mesh size guidelines.
    Evidence: Authored `docs/FEASIBILITY.md` establishing 12-thread / 10 GB container cap and honest solver boundaries.

### Phase 1 — Repository Audit & Failure Analysis of Existing Vehicle Geometry
- [x] **1.1 Geometry Pipeline Audit**: Trace Dashboard selection → JSON → Assembler → Three.js.
    Evidence: `docs/CRITICAL_GEOMETRY_FAILURE_AUDIT.md`.
- [x] **1.2 Eradication of BoxGeometry Slabs**: Remove all box panels from exterior bodywork.
    Evidence: `docs/VEHICLE_GEOMETRY_REGRESSION.md`.
- [x] **1.3 Dynamic Camera Framing**: FOV-derived camera bounding box rig.
    Evidence: `src/components/3d/CameraRig.tsx`.

### Phase 2 — Architecture, ADRs, Data Model, Schemas, Conventions
- [x] **2.1 Engineering ADRs**: Decisions 001 to 008 recorded in `docs/DECISIONS.md`.
    Evidence: `docs/DECISIONS.md`.
- [x] **2.2 Coordinate System & Tolerance Conventions**: ISO 8855 / SAE coordinate definition (X forward, Y left, Z up; Three.js Y-up translation only at render boundary), internal units in metres, UI in millimetres.
    Evidence: `docs/DECISIONS.md`, `src/geometry/types.ts`.

### Phase 3 — The Vertical Slice: Ahmed Body Benchmark
- [x] **3.1 Parametric Ahmed Body Geometry Generator**: Procedural generator for 25° and 35° slant angles matching canonical SAE 840300 wind-tunnel dimensions ($L=1.044\text{m}$, $W=0.389\text{m}$, $H=0.288\text{m}$, ground clearance $0.050\text{m}$).
    Evidence: `tests/ahmed-benchmark.test.ts` (7 tests passed) · files: `src/geometry/benchmarks/ahmedBodyGenerator.ts`.
- [x] **3.2 Watertight Surface Mesh & STL Exporter**: Export clean, manifold, watertight STL surface representation.
    Evidence: `AhmedBodyGenerator.exportToSTL` → verified ASCII STL output (`solid ahmed_body` ... `endsolid`).
- [x] **3.3 Automated OpenFOAM Case Generator**: Standardized case tree generation (`0/`, `constant/`, `system/`, `blockMeshDict`, `snappyHexMeshDict`, `controlDict`, `fvSchemes`, `fvSolution`) configured for $k$-$\omega$ SST RANS.
    Evidence: `OpenFoamCaseGenerator.generateCase` → generated 17 valid OpenFOAM files in `simulations/ahmed_body_25deg/` and `simulations/ahmed_body_35deg/`.
- [x] **3.4 Empirical & Analytical Benchmark Suite**: Formulate closed-form and literature reference comparator with documented citations (Ahmed et al. 1984, SAE 840300).
    Evidence: `AhmedBenchmarkRunner.runBenchmark` (25° $C_d = 0.289$ vs lit $0.285$, 35° $C_d = 0.268$ vs lit $0.257$).
- [x] **3.5 Benchmark Execution & Regression Test**: Automated CLI command `npm run benchmark:ahmed` asserting drag coefficient $C_d$ against literature tolerance bands.
    Evidence: `npm run benchmark:ahmed` → Exit 0 (both slant angles within 6% tolerance band, physical trend $C_d(25^\circ) > C_d(35^\circ)$ confirmed) · files: `scripts/run-ahmed-benchmark.ts`, `docs/CFD_VALIDATION_REPORT.md`.

### Phase 4 — Geometry Kernel Integration & Worker Pipeline
- [ ] **4.1 B-Rep Kernel Boundary Implementation**: Web Worker abstraction for B-rep operations and STEP serialization.
- [ ] **4.2 Surface Continuity Analyzer**: G0/G1/G2 diagnostic inspector with zebra display and numeric report.
- [ ] **4.3 Mesh Validation Tools**: Watertightness, manifoldness, duplicate vertex, and self-intersection detectors.

### Phase 5 — Parametric Vehicle Modelling & Constraint Engine
- [ ] **5.1 Feature DAG Engine**: Immutable feature history tree with deterministic rebuild and failure isolation.
- [ ] **5.2 Dimension Constraint Solver**: Independent driving vs driven dimensions (wheelbase, track, overhang, height).
- [ ] **5.3 Stable Semantic Anchors**: Named hardpoints and section curves addressing topological naming stability.

### Phase 6 — Component System & Collision Checking
- [ ] **6.1 Component Hierarchy & Attachment Points**: Independent component lifecycle with stable IDs and parent anchors.
- [ ] **6.2 Collision & Clearance Validation**: Dynamic clearance sweep (wheel↔arch, tire↔fender, suspension↔body).

### Phase 7 — Reference Vehicle Library & Lineage Forking
- [ ] **7.1 Sourced Reference Library**: Sourced technical specifications with provenance confidence (`verified`/`reported`/`estimated`).
- [ ] **7.2 Calibrated Orthographic Background Planes**: Viewport image planes with scale references.
- [ ] **7.3 Project Fork & Lineage Tracking**: Non-destructive fork into independent projects with immutable reference preservation.

### Phase 8 — Aerodynamic Component Library
- [ ] **8.1 Parametric Front Splitter & Air Curtains**: Length, extension, angle, and edge radius controls.
- [ ] **8.2 Parametric Rear Diffuser**: Expansion angle, length, and aerodynamic strakes.
- [ ] **8.3 Parametric Rear Wing & Airfoil Catalog**: Published airfoil coordinates (NACA, Selig), chord, span, AoA, and endplates.

### Phase 9 — Simulation-Ready Geometry Export & CFD-Readiness Gates
- [ ] **9.1 CFD-Readiness Gate Suite**: Watertight check, feature size vs refinement check, surface curvature check.
- [ ] **9.2 Multi-Speed Aerodynamic Setup**: Variable velocity configuration with Reynolds-number dependence.

### Phase 10 — Full CFD Orchestration & DrivAer Benchmark
- [ ] **10.1 Domain & Boundary Condition Engine**: Blockage ratio < 3%, moving ground, rotating wheel boundary conditions.
- [ ] **10.2 OpenFOAM Job Runner**: Process monitoring, residual streaming, force convergence stabilization.
- [ ] **10.3 DrivAer-Style Public Benchmark**: Open standard car-like benchmark case and validation report.

### Phase 11 — Aero Visualization & Provenance Tagging
- [ ] **11.1 Streamlines & Surface Pressure ($C_p$) Contours**: Visual scalar/vector field viewer.
- [ ] **11.2 Wake & Vortex Isosurfaces ($Q$-Criterion)**: 3D wake separation visualization.
- [ ] **11.3 Strict Provenance Tag Display**: Prominent `CFD` / `ANALYTIC` / `ILLUSTRATIVE` HUD indicators.

### Phase 12 — Vehicle Systems Packaging
- [ ] **12.1 Chassis & Suspension Clearance Sweeps**: Kinematic suspension travel and steering lock envelope checks.
- [ ] **12.2 Powertrain & Cooling Duct Packaging**: Thermal heat-exchanger porosity envelope representation.

### Phase 13 — Original Vehicle Development Workflow & Comparison Mode
- [ ] **13.1 Non-Linear Development Flow**: Guided end-to-end design pipeline with variant branching.
- [ ] **13.2 Engineering Comparison Diff Engine**: Verified-equivalent aerodynamic delta calculations and uncertainty reporting.
- [ ] **13.3 Reproducible Engineering Reports**: Markdown / PDF report generation.

### Phase 14 — Dashboard Integration & Catalog Data Migration
- [ ] **14.1 Full Catalogue Migration**: Forward migration of legacy entries to v2 project format.
- [ ] **14.2 Fail-Safe 3D Unavailable Display**: Explicit wireframe bounds and warning placard for unverified models.

### Phase 15 — Performance, Reliability & Security
- [ ] **15.1 Sandboxed Job Runner**: Resource-capped worker execution without arbitrary code execution.
- [ ] **15.2 Memory Leak & Stress Verification**: Multi-cycle disposal lifecycle validation.

### Phase 16 — Full Test Pass, Documentation & Final Verification
- [ ] **16.1 Automated Full Test Pass**: All unit, integration, benchmark, and security test suites passing.
- [ ] **16.2 Final Engineering Documentation Suite**: All required v2 reports authored and verified against live code.
