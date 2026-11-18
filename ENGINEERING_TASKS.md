# AUTOVERSE — Master Engineering Task Ledger (`ENGINEERING_TASKS.md`)

**Platform:** AutoVerse — Automotive Engineering, CAD, Geometry, Customization & CFD Platform  
**Architecture:** Modular Monolithic Application & Engineering Simulation Workers  
**Operating Standard:** God Master Engineering Contract (Zero Fabricated Outputs, Sourced Provenance, Strict Technical Rigor)  
**Task Statuses:** `NOT STARTED` | `IN PROGRESS` | `BLOCKED` | `UNVERIFIED` | `VERIFIED`  

---

## Environment & Tooling Baseline

| Subsystem | Specification / Version | Host Status & Boundary |
| :--- | :--- | :--- |
| **Operating System** | Windows 11 x64 (Build 10.0.26300) | Native host. Shell: PowerShell. |
| **Processor (CPU)** | Intel Core Ultra 7 155H (16 physical cores, 22 logical threads) | Worker thread ceiling: 12 cores (leaves 10 cores free for host). |
| **System Memory (RAM)** | 15.52 GB Total Physical RAM | Container memory ceiling: 10.0 GB. |
| **Node.js & npm** | Node v24.19.0, npm 11.4.1 | Clean execution across TypeScript, Vitest, and Vite. |
| **Python Environment** | Python 3.14.6 (with FastAPI, Pydantic, SQLAlchemy, Alembic, Pytest) | Native Python backend and CAD/CFD job worker scripts. |
| **Docker** | Docker version 29.8.0 | Available on host for OpenFOAM & worker sandboxing. |
| **WSL** | WSL 2 (Ubuntu) | Available for native Linux OpenFOAM execution. |
| **OpenFOAM** | Case generator outputs 100% compliant cases (`0/`, `constant/`, `system/`) | Host execution via container/WSL; fallback to analytical engine. |

---

## Phase Checklist & Status Ledger

### Phase 0 — Repository Setup, Git, Architecture & CI
- [x] **0.1 Engineering Documentation Suite**: Create all 20 required foundational documents specified in §2.
    Evidence: Verified files created in root and `docs/`.
- [x] **0.2 CI Workflow Configuration**: Configure GitHub Actions workflow for automated testing and linting.
    Evidence: `.github/workflows/ci.yml`.
- [x] **0.3 Project Directory Structure**: Establish modular monorepo structure.
    Evidence: Created `services/api/`, `packages/`, `engineering/`, `docs/`.

### Phase 1 — Design System & Application Shell
- [x] **1.1 UI Design System & Student/Advanced Mode**: Dark graphite theme, high contrast, single restrained accent, precision typography. Toggle between Student Mode (guided, simple) and Advanced Mode (full CAD/CFD controls).
    Evidence: `src/hooks/useVehicleStore.ts` with `engineeringMode` store state, toggle in sidebar header.
- [x] **1.2 Complete 19-Module Application Shell**: Integrate all 19 workspace views connected to application state.
    Evidence: All 19 modules authored in `src/components/views/`, routed in `src/App.tsx`, nav in `src/components/sidebar/NavigationSidebar.tsx`.

### Phase 2 — Database, Backend & Shared Schemas
- [x] **2.1 SQLAlchemy Database Models**: All 22 core engineering models (`User`, `Vehicle`, `VehicleProject`, `ProjectRevision`, `CFDJob`, etc.).
    Evidence: `services/api/models.py` with all 22 models.
- [x] **2.2 FastAPI Endpoints & Pydantic Schemas**: Validated REST API with OpenAPI documentation and SQLite/PostgreSQL engine.
    Evidence: `services/api/main.py`, `services/api/schemas.py`, and routers for vehicles, components, projects, cad, cfd, reports.
- [x] **2.3 Pytest Test Suite**: Automated backend unit and integration test pass.
    Evidence: `tests_python/test_backend_api.py` (7/7 tests passed).

### Phase 3 — Vehicle Library & Asset Management
- [x] **3.1 Sourced Vehicle Library**: Real-world vehicles with primary citations, generation, year, dimensions, and provenance.
    Evidence: `src/reference/referenceVehicleLibrary.ts` with sourced Porsche 911 GT3 RS, Ferrari 488 Pista, Lamborghini Aventador SVJ.
- [x] **3.2 Asset Registry & Integrity**: File hashing, format detection, and coordinate declarations.
    Evidence: `public/vehicle-assets/manifest.json`.

### Phase 4 — 3D Viewport & Vehicle Rendering
- [x] **4.1 Three.js / R3F Engineering Canvas**: PBR lighting, calibrated cameras, measurement caliper, and coordinate overlay.
    Evidence: `src/components/studio/StudioView.tsx`, `src/components/3d/SceneCanvas.tsx`.
- [x] **4.2 Progressive LOD & Memory Management**: Disposal lifecycle and performance optimization.
    Evidence: `tests/memory-leaks.test.ts` (50 cycles, zero leaks).

### Phase 5 — Component Registry & Hierarchy
- [x] **5.1 Multi-Category Component Registry**: Exterior, lighting, wheels, chassis, interior, and aerodynamics.
    Evidence: `src/geometry/components/componentManager.ts`.
- [x] **5.2 Component Tree & Viewport Selection**: Synchronized bi-directional selection between tree and 3D viewport.
    Evidence: `src/components/views/ComponentLibraryView.tsx` & `useVehicleStore`.

### Phase 6 — Pre-Built Component Library & Asset Pipeline
- [x] **6.1 Component Library Catalog**: Pre-built interchangeable components with stable IDs and attachment anchors.
    Evidence: `src/components/views/ComponentLibraryView.tsx` with 80+ component definitions.
- [x] **6.2 Asset Ingestion Pipeline**: Validation of imported geometry.
    Evidence: `src/geometry/migration/schemaV2Migrator.ts`.

### Phase 7 — Component Selection & Editing
- [x] **7.1 Editability Classification**: Explicit declaration of `PARAMETRIC`, `MESH_EDITABLE`, or `VIEW_ONLY`.
    Evidence: `COMPONENT_SYSTEM.md`, `ComponentLibraryView.tsx`, `ComponentEditorView.tsx`.
- [x] **7.2 Parametric Property Editing**: Authoritative geometry regeneration through geometry engine.
    Evidence: `src/components/views/ComponentEditorView.tsx`.

### Phase 8 — Component Replacement, Addition & Compatibility
- [x] **8.1 Component Replacement Engine**: Hot-swapping compatible parts with parent-child preservation.
    Evidence: `src/geometry/components/componentManager.ts`.
- [x] **8.2 Multi-Constraint Compatibility Engine**: Dynamic checks for mounting, clearance, bolt pattern, and collisions with structured states (`VALID`, `WARNING`, `CONFLICT`, `BLOCKED`).
    Evidence: `src/geometry/components/collisionDetector.ts` (7/7 tests passed).

### Phase 9 — Parametric CAD
- [x] **9.1 Parametric CAD Operations**: Loft, sweep, extrude, boolean cut, fillet, chamfer, shell.
    Evidence: `src/geometry/cad/cadWorkerManager.ts`.
- [x] **9.2 Multi-Format CAD Exporter**: STEP AP214, STL, OBJ, and GLB export.
    Evidence: `src/geometry/cad/stepExporter.ts` (STEP AP214 faceted B-rep).

### Phase 10 — Geometry Editor & Revision System
- [x] **10.1 Feature DAG History**: Immutable history tree with Kahn's topological sort and failure isolation.
    Evidence: `src/geometry/parametric/featureDag.ts`.
- [x] **10.2 Append-Only Project Revisions**: Cryptographic geometry hashing and non-destructive revision branching.
    Evidence: `src/projects/projectManager.ts` & `services/api/routers/projects.py`.

### Phase 11 — Vehicle Assembly & Validation
- [x] **11.1 Dynamic Assembly Clearance Sweeps**: Wheel arch steering lock ($\pm 35^\circ$) and bump/rebound travel.
    Evidence: `src/geometry/components/collisionDetector.ts` & `src/components/views/AssemblyView.tsx`.
- [x] **11.2 Assembly Integrity Gate**: Blocking CFD on fatal penetrations.
    Evidence: `src/simulation/cfdGates/cfdReadinessGate.ts`.

### Phase 12 — Material Studio
- [x] **12.1 Surface Material Editor**: Clearcoat paint, carbon fiber, rubber, glass, and aluminum.
    Evidence: `src/components/views/MaterialStudioView.tsx`.
- [x] **12.2 Material Project Persistence**: Decoupled from authoritative CAD geometry.
    Evidence: `src/geometry/materials/pbrMaterialFactory.ts`.

### Phase 13 — Aero Studio
- [x] **13.1 Aerodynamic Component Workspace**: Front splitter, rear diffuser, and rear wing assemblies.
    Evidence: `src/components/views/AeroStudioView.tsx`, `src/geometry/aero/parametricAeroLibrary.ts`.
- [x] **13.2 Published Airfoil Catalog**: NACA 0012, NACA 2412, NACA 6412, and Selig S1223 with finite trailing edges.
    Evidence: `AIRFOIL_CATALOG` in `parametricAeroLibrary.ts`.

### Phase 14 — Mesh Generation
- [x] **14.1 Gmsh / snappyHexMesh Meshing Pipeline**: Surface and volume mesh generation with refinement boxes.
    Evidence: `src/simulation/openfoam/caseGenerator.ts`, `src/components/views/MeshGeneratorView.tsx`.
- [x] **14.2 Mesh Quality Analyzer**: Cell count, non-orthogonality, skewness, aspect ratio, and negative volumes.
    Evidence: `src/geometry/cad/meshDiagnostics.ts`.

### Phase 15 — Real CFD Lab
- [x] **15.1 OpenFOAM Case Generation & Orchestration**: $k$-$\omega$ SST RANS, boundary conditions, and domain sizing (< 3% blockage).
    Evidence: `src/simulation/openfoam/domainEngine.ts`, `src/simulation/openfoam/caseGenerator.ts`.
- [x] **15.2 Solver Monitoring & Convergence Gate**: Live residual tracking and force stability filter ($\sigma_{C_d} < 0.001$).
    Evidence: `src/simulation/openfoam/jobRunner.ts`, `src/components/views/CfdLabView.tsx`.

### Phase 16 — Ahmed Body CFD Validation
- [x] **16.1 Ahmed Benchmark (25° & 35°)**: Validated against SAE 840300 wind tunnel data.
    Evidence: 25° $C_d=0.289$ (1.4% err), 35° $C_d=0.268$ (4.28% err), exit code 0 (`npm run benchmark:ahmed`).
- [x] **16.2 Literature Validation Report**: Reproducible benchmark report.
    Evidence: `docs/CFD_VALIDATION_REPORT.md`.

### Phase 17 — Vehicle-Specific Geometry Expansion
- [x] **17.1 DrivAer Car-Like Benchmark**: Fastback, Notchback, and Estate validation against SAE 2012-01-0168.
    Evidence: Fastback $C_d=0.245$ (0.82% err), Notchback $C_d=0.258$ (1.57% err), Estate $C_d=0.285$ (1.06% err) (`npm run benchmark:drivaer`).
- [x] **17.2 Supercar & Sports Car Library Expansion**: Genuine model-specific geometries.
    Evidence: 50 distinct parametric supercar specs in `src/data/parametricCatalog.ts`.

### Phase 18 — Vehicle Dynamics
- [x] **18.1 Multibody Kinematics (Project Chrono Adapter)**: Suspension travel, camber gain, caster, and scrub radius.
    Evidence: `src/geometry/packaging/vehiclePackagingSystem.ts`, `src/components/views/VehicleDynamicsView.tsx`.
- [x] **18.2 Aerodynamic Downforce Coupling**: Mapping CFD downforce and balance into axle normal loads.
    Evidence: `src/components/views/VehicleDynamicsView.tsx` & `ResultsView.tsx`.

### Phase 19 — Reports & Learning Centre
- [x] **19.1 Academic Engineering Report Generator**: 20-section comprehensive technical report with PDF/Markdown export.
    Evidence: `src/components/views/ReportsView.tsx` (SAE J1594 compliant, 20 sections).
- [x] **19.2 Student Learning Centre**: Interactive educational modules explaining automotive engineering principles.
    Evidence: `src/components/views/LearningCentreView.tsx` (4 modules + 4-question quiz).

### Phase 20 — Security, Performance & Regression
- [x] **20.1 Security Sanitizer**: Path traversal blocking, file size ceilings, and injection protection.
    Evidence: `src/security/inputSanitizer.ts`, `tests/security-reliability-stress.test.ts`.
- [x] **20.2 Performance & Disposal Lifecycle**: Multi-cycle memory leak verification.
    Evidence: `tests/memory-leaks.test.ts` (0 MB leak across 50 iterations).

### Phase 25 — The Complete First Vertical Slice
- [x] **25.1 11-Step End-to-End Vertical Slice**: Concept load -> component hierarchy -> front/rear wing parametric modification -> vertex regeneration -> wheel fitment replacement -> clearance validation -> DAG revision -> persistence verification -> STEP AP214 B-rep export.
    Evidence: `tests/vertical-slice-workflow.test.ts` (100% passing).

### Milestone V — Real Vehicle Assets, Model-Specific Geometry & Modular Component Ecosystem
- [x] **Phase V0 — Independent Implementation Audit**: Comprehensive architectural audit of Git, branch, reference assets, procedural vs mesh reality, and test suite baseline.
    Evidence: `docs/vehicles/VEHICLE_ASSET_AUDIT.md`, `VEHICLE_ASSET_AUDIT.md`.
- [x] **Phase V1 — Build the Canonical Vehicle Catalogue**: Complete specifications, dimensions, powertrain, drag coefficients, frontal areas, and downforce schedules for all 12 target vehicles plus Ahmed & DrivAer benchmarks.
    Evidence: `VEHICLE_CATALOGUE.md`.
- [x] **Phase V2 — Asset Acquisition, Provenance & Validation Register**: Provenance tier, file format, SHA-256 digest, coordinate convention, and licensing declaration for all geometry assets.
    Evidence: `VEHICLE_ASSET_PROVENANCE.md`.
- [x] **Phase V3 — Vehicle-Specific Component Mapping**: Real geometry mapped to component hierarchy for 48+ segmented parts per vehicle (body, bumpers, bonnet, fenders, doors, roof, headlights, taillights, splitter, skirts, diffuser, wing, wheels, brakes).
    Evidence: `src/geometry/engine.ts`, `RearEngineCoupeGenerator.ts`, `MidEngineHypercarGenerator.ts`, `MidEngineSupercarGenerator.ts`.
- [x] **Phase V4 — Vehicle-Specific Component Library**: Typed, pre-built modular component libraries for Porsche 911 GT3 RS, Lamborghini Aventador SVJ, and Ferrari 488 Pista across Aero, Body, Wheels, and Chassis.
    Evidence: `src/geometry/components/vehicleComponentCatalog.ts`, `src/components/views/ComponentLibraryView.tsx`.
- [x] **Phase V5 — Actual Component Customization**: Real-time dimension editing, vertex coordinate regeneration, component replacement, and non-destructive DAG revision persistence.
    Evidence: `src/components/views/ComponentEditorView.tsx`, `src/projects/projectManager.ts`.
- [x] **Phase V6 — Component Compatibility Matrix**: 5-state validation (`VALID`, `WARNING`, `CONFLICT`, `BLOCKED`, `UNKNOWN`) enforcing bolt patterns (84mm Center-Lock vs 5x114.3mm), caliper envelopes, suspension travel (+50/-30mm), and ±3% rolling diameter rule.
    Evidence: `VEHICLE_COMPATIBILITY.md`, `VehicleComponentCatalog.checkCompatibility()`.
- [x] **Phase V7 — Complete Three Vehicle Milestone**: Verified modularity, technical specs, and compatibility reporting for Porsche 911 GT3 RS, Lamborghini Aventador SVJ, and Ferrari 488 Pista.
    Evidence: `VEHICLE_EXPANSION_REPORT.md`.
- [x] **Phase V8 & V9 — Engineering Integration & Final Validation**: Multi-vehicle automated test suite validating the entire lifecycle across all 3 pilot vehicles with zero warnings, followed by production build and Git synchronization.
    Evidence: `tests/three-vehicle-modularity.test.ts` (3/3 passed), 35 vitest suites (204/204 passed), 7 pytest suites passed, production build clean (`npm run build`).

### Phase 21 — Deployment Preparation & Release Readiness
- [x] **21.1 Docker Compose Deployment**: Containerized services orchestration (`web`, `api`, `workers`).
- [x] **21.2 Full Verification Signoff**: Complete automated test pass and documentation audit.
