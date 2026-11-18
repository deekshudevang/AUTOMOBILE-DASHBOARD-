# AutoVerse — System Architecture & Technical Specification

**Platform:** Automotive Engineering, Parametric CAD, Customization & CFD Simulation  
**Document ID:** `AV-ARCH-001`  
**Revision:** 2.0.0  

---

## 1. System Vision & Architecture

AutoVerse is an integrated automotive engineering environment that unites parametric Class-A surface CAD, component assembly compatibility, automated surface/volume meshing, computational fluid dynamics (OpenFOAM), multibody suspension kinematics, and academic report generation.

```text
+---------------------------------------------------------------------------------------------------+
|                                        AUTOVERSE CLIENT                                           |
|                     (React 18, TypeScript, Three.js, React Three Fiber, Tailwind CSS)             |
|                                                                                                   |
|  [Student Mode / Advanced Mode]  [19 Integrated Modules]  [Bi-directional 3D Viewport & Tree]      |
+---------------------------------------------------------------------------------------------------+
                               |                                        |
                      (REST / OpenAPI JSON)                    (Web Worker Message Bus)
                               v                                        v
+-------------------------------------------------------+    +--------------------------------------+
|             FASTAPI ENGINEERING BACKEND               |    |       CLIENT GEOMETRY ENGINE         |
|  (Python 3.14, SQLAlchemy, Pydantic, SQLite/Postgres) |    |  - Three.js WebGL Presentation       |
|                                                       |    |  - Parametric Feature DAG Rebuilder  |
|  - Vehicle & Component Registries                     |    |  - Dimension Constraint Solver       |
|  - Project Revisions & Append-Only History            |    |  - G0/G1/G2 Continuity Analyzer      |
|  - Assembly Compatibility Engine                      |    |  - Dynamic Collision Sweeper         |
|  - Engineering Report Generator                       |    |  - Calibrated Reference Planes       |
|  - Simulation Job Queue & Results Cache               |    |  - STEP AP214 & STL Exporters        |
+-------------------------------------------------------+    +--------------------------------------+
                               |
              +----------------+----------------+
              |                                 |
              v                                 v
+-----------------------------+   +-----------------------------+
|    OPENFOAM CFD WORKER      |   |   VEHICLE DYNAMICS WORKER   |
|  - Domain Generator (< 3%)  |   |  - Multibody Kinematics     |
|  - SnappyHexMesh DSL        |   |  - Suspension Travel Sweep  |
|  - k-omega SST RANS Solver  |   |  - Camber Gain / Scrub Rad  |
|  - Force Convergence Monitor|   |  - CFD Aero Downforce Map   |
|  - Residual Tracker         |   |  - Steering Lock Envelope   |
+-----------------------------+   +-----------------------------+
```

---

## 2. Directory Structure (§4)

```text
autoverse/
├── apps/
│   └── web/                   # Vite + React + Three.js Frontend
├── services/
│   ├── api/                   # Python FastAPI Backend
│   ├── cad-worker/            # Asynchronous B-rep CAD Worker
│   ├── mesh-worker/           # Gmsh / snappyHexMesh Worker
│   ├── cfd-worker/            # OpenFOAM Simulation Worker
│   └── dynamics-worker/       # Chrono Multibody Dynamics Worker
├── packages/
│   ├── shared-types/          # Universal TypeScript Types
│   ├── project-schema/        # JSON Schemas for Project Bundles
│   ├── geometry-contracts/    # Geometry Interfaces & Invariants
│   └── component-contracts/   # Component Compatibility Interfaces
├── engineering/
│   ├── cad/                   # CadQuery / OpenCascade Adapters
│   ├── geometry/              # Lofting & Surface Analysis
│   ├── meshing/               # Mesh Generation & Quality Gates
│   ├── cfd/                   # OpenFOAM Case Generators
│   ├── dynamics/              # Vehicle Kinematic Solvers
│   └── benchmarks/            # Ahmed Body & DrivAer Suites
├── docs/                      # Engineering Architecture & Standards
└── tests/                     # Unit, Integration & Regression Suites
```

---

## 3. Coordinate Systems & Engineering Conventions

- **Authoritative Internal Standard:** ISO 8855 / SAE J670 right-handed Cartesian coordinate system:
  - $+X$: Forward towards vehicle front bumper.
  - $+Y$: Port / Left towards driver side.
  - $+Z$: Upwards perpendicular to ground plane.
  - Symmetry Plane: $Y = 0$.
  - Ground Level: $Z = 0$ (vehicle stands at positive ground clearance).
- **Units:** SI Units throughout (length in metres $\text{m}$, mass in kilograms $\text{kg}$, force in Newtons $\text{N}$, pressure in Pascals $\text{Pa}$, velocity in $\text{m/s}$). UI displays convenient engineering units (millimetres $\text{mm}$, $\text{km/h}$) via explicit converters.
- **Rendering Boundary:** Three.js uses $+X$ right, $+Y$ up, $-Z$ forward. All transforms occur strictly at the view boundary:
  $$x_{3D} = -y_\text{SAE}, \quad y_{3D} = z_\text{SAE}, \quad z_{3D} = -x_\text{SAE}$$

---

## 4. Modes of Operation

1. **Student Mode**:
   - Guided step-by-step engineering workflows.
   - Recommended solver and mesh presets (Basic, Standard, Fine).
   - Clear qualitative explanations of physical phenomena (boundary layers, induced drag, camber gain).
   - Validation warning explanations with suggested remediation.
2. **Advanced Mode**:
   - Full parametric feature DAG history inspector.
   - Direct numerical constraint solver inputs.
   - OpenFOAM boundary condition and turbulence parameter tuning ($k, \omega, \nu_t, y^+$).
   - B-rep solid CAD operations and raw STEP AP214 export.

---

## 5. Truth Contract & Provenance Integrity

Every aerodynamic and dynamic result emitted by AutoVerse carries a strict tri-state provenance badge:
- `[CFD]`: Numerical solver execution with verified residual convergence and force stability.
- `[ANALYTIC]`: Closed-form empirical equation with cited literature equations.
- `[ILLUSTRATIVE]`: Visual-only rendering with zero engineering validity.
