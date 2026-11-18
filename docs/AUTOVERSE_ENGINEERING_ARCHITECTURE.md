# AutoVerse 3D v2 — Comprehensive Engineering Architecture

**Platform Specification:** Automotive Design, Parametric CAD & Aerodynamic Engineering Platform  
**Standard Compliance:** ISO 8855 / SAE J670 Vehicle Dynamics, ISO 10303-21 STEP AP214, OpenFOAM CFD v2406  
**Revision:** 2.0.0  

---

## 1. System Overview & The Hybrid Kernel Architecture

AutoVerse 3D decouples visual scene rendering from automotive CAD geometry modeling and CFD simulation orchestration:

```
+---------------------------------------------------------------------------------------+
|                                    AUTOVERSE 3D UI                                    |
|              (React 18, Three.js v0.174, Tailwind CSS, Lucide Icons, WebGL)           |
+---------------------------------------------------------------------------------------+
        |                                   |                                   |
        | [ISO 8855 Coordinate Transform]   | [Non-Blocking Web Worker Bridge]  | [Job Queue & SSE]
        v                                   v                                   v
+-----------------------+       +-----------------------+       +-----------------------+
|  VIEWPORT & SCENE     |       |   CAD GEOMETRY CORE   |       |  SIMULATION WORKER    |
| - Three.js Renderer   |       | - Parametric Feature  |       | - OpenFOAM Case Gen   |
| - Calibrated Planes   |       |   DAG Engine          |       | - SnappyHexMesh Dsl   |
| - Dynamic Camera Rig  |       | - Dimension Solver    |       | - k-omega SST RANS    |
| - PBR Materials       |       | - G0/G1/G2 Continuity |       | - Convergence Monitor |
| - Cp Color Contour    |       | - Mesh Diagnostics    |       | - Resid & Force StdDev|
| - Streamlines / Q-iso |       | - STEP AP214 Exporter |       | - Sandbox Resource Cap|
+-----------------------+       +-----------------------+       +-----------------------+
```

### 1.1 Separation of Responsibilities (ADR 008 & ADR 009)
1. **Three.js Scene Canvas**: Operates strictly as a presentation layer at 60 fps. Y-up Three.js coordinate mapping ($x_{3D} = -y_\text{SAE}, y_{3D} = z_\text{SAE}, z_{3D} = -x_\text{SAE}$) is applied exclusively at the rendering boundary.
2. **CAD Geometry Core**: Maintains topological consistency in SI metres under the right-handed ISO 8855 SAE frame ($+X$ forward, $+Y$ port/left, $+Z$ up). Feature updates execute asynchronously without blocking UI interactions.
3. **Simulation Orchestrator**: Manages execution of numerical solvers in sandboxed container/worker environments with hard thread (12 cores) and memory (10.0 GB) ceilings.

---

## 2. Parametric Feature History DAG & Semantic Anchors

The feature history engine (`src/geometry/parametric/featureDag.ts`) treats vehicle design as an immutable directed acyclic graph:

- **Topological Sorting**: Dependency rebuild order is computed using Kahn's algorithm.
- **Failure Isolation**: If a downstream feature fails, dependents are transitioned to `STALE` without corrupting upstream geometry.
- **Topological Naming Solved**: Components reference stable datum planes and named semantic hardpoints (`src/geometry/parametric/semanticAnchors.ts`) rather than transient triangle/vertex indices.
- **Checkpoint Stack**: Supports complete deterministic undo/redo history navigation.

---

## 3. Independent Dimensional Constraint Engine

Unlike game configurators that apply non-physical global affine scaling, AutoVerse 3D's dimension engine (`src/geometry/parametric/constraintSolver.ts`) enforces driving vs driven geometric constraints:

$$\text{Length}_\text{overall} = \text{Overhang}_\text{front} + \text{Wheelbase} + \text{Overhang}_\text{rear}$$
$$\text{Height}_\text{overall} = \text{Ground Clearance} + \text{Body Roof Height}$$

Hardpoints are solved algebraically in 3D SAE space. Over-constrained or conflicting dimensions trigger structured constraint warnings.

---

## 4. Component Hierarchy & Dynamic Collision Sweeping

Body components (`src/geometry/components/componentManager.ts`) are independent entities with stable UUIDs, parent anchor bindings, materials, and mass estimates.

The collision sweep detector (`src/geometry/components/collisionDetector.ts`) audits:
1. **Wheel Arch Dynamic Clearance**: Sweeps tire clearance under $\pm 35^\circ$ front steering lock, $+50\text{mm}$ bump travel, and $-30\text{mm}$ rebound travel.
2. **Splitter Ground Clearance**: Detects ground plane penetration ($Z < 0$) or track scraping ($< 30\text{mm}$).
3. **Engine Hood Packaging**: Evaluates powertrain envelope vs bonnet clearance ($> 15\text{mm}$).
4. **CFD Readiness Gating**: Interpenetrations automatically set `blocksCFD: true`, preventing invalid meshing runs.

---

## 5. CFD Pipeline & Boundary Condition Engine

The simulation engine (`src/simulation/openfoam/domainEngine.ts`):
- Automatically configures external wind tunnel dimensions guaranteeing **Blockage Ratio $< 3.0\%$**.
- Prescribes moving ground wall velocity at vehicle speed ($U_\text{ground} = [V, 0, 0]$).
- Computes rotating wheel angular velocity ($\omega = V / R_\text{wheel}$).
- Implements standard $k$-$\omega$ SST RANS turbulence with $y^+$-guided near-wall prism layer generation.
- Enforces force-coefficient stability gating: standard deviation of $C_d$ over final 50 iterations must be $< 0.001$.

---

## 6. Sourced Reference Library & Lineage Forking

All manufacturer specifications cite primary source documentation with retrieval dates and confidence levels (`verified`, `reported`, `estimated`).
Reference vehicles in `src/reference/referenceVehicleLibrary.ts` are strictly **read-only**. Any design workflow begins by executing a non-destructive project fork (`ProjectManager.forkReferenceVehicle`), generating a new project ID with lineage pointers back to the immutable reference.
