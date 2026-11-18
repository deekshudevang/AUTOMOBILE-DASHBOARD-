# AUTOVERSE 3D — TECHNICAL FEASIBILITY MEMO (`docs/FEASIBILITY.md`)

**Date:** 2026-11-18  
**Scope:** Operating Contract v2 (§3 Phase 0: Feasibility Memo)  
**Host Architecture:** Windows 11 x64, Intel Core Ultra 7 155H (22 logical threads), 15.52 GB RAM, Node v24.19.0, Python 3.14.6, Docker available.

---

## 1. Executive Feasibility Statement

**Live interactive CFD in a web browser is technically impossible and must never be implied or simulated for show.**

Full external vehicle aerodynamics via 3D Reynolds-Averaged Navier-Stokes (RANS) with $k$-$\omega$ SST turbulence modeling requires between 2 million and 15 million mesh cells to resolve boundary layer separation, wheel wakes, and underbody ground effect. Solving these linear systems requires multiple gigabytes of RAM and hundreds of CPU core-minutes. WebAssembly has a hard 4 GB linear memory ceiling and cannot run OpenFOAM at production scale.

Therefore, AutoVerse 3D adopts a strict, honest three-tier architecture:
1. **Tier 1: Client Browser (Three.js & Web Worker)**: Real-time class-A parametric surface rendering, 3D caliper measurement, interactive component editing, and instant empirical/closed-form calculations (`ANALYTIC` tag).
2. **Tier 2: Local Containerized Solver (Docker / WSL 2 OpenFOAM)**: Automated case generation, surface feature extraction, `snappyHexMesh`, and `simpleFoam` steady-state RANS execution with coarse/medium resolution presets (`CFD` tag).
3. **Tier 3: Remote HPC Cluster (Future Integration)**: Unbounded fine-mesh runs (>10M cells, transient DDES/LES).

---

## 2. Capability Matrix Across Execution Tiers

| Capability | In-Browser (WASM / Web Worker) | Local Backend / Container (Intel Ultra 7 155H, 15.5 GB RAM) | Remote HPC Cluster | Expected Runtime & Constraints |
| :--- | :--- | :--- | :--- | :--- |
| **Parametric Surface Lofts & Panel Editing** | **YES** (`Worker`) | **YES** (`Python / C++`) | Optional | **< 100 ms** in Web Worker. Real-time responsive. |
| **B-Rep CAD Kernel Operations (STEP/BREP)** | **YES** (`opencascade.js` WASM) | **YES** (`cadquery / pythonocc`) | Optional | **200 ms – 3 s** per boolean/fillet. 4 GB WASM memory limit. |
| **Watertightness & Manifold Validation** | **YES** (Three.js & custom BVH) | **YES** | Optional | **< 50 ms** for typical 50k-triangle vehicle skins. |
| **Projected Frontal Area ($A$) Calculation** | **YES** (Depth-buffer orthographic integration) | **YES** | Optional | **< 15 ms**. Precise to $\pm 0.002\text{ m}^2$. |
| **Empirical Aerodynamic Estimates ($C_d$, $C_l$, balance)** | **YES** (`ANALYTIC` formula engine) | **YES** | Optional | **< 5 ms**. Form drag, skin friction, and wing lift via thin-airfoil theory. |
| **OpenFOAM Case Generation & Golden Bundling** | **YES** (Node / TypeScript template engine) | **YES** | Optional | **< 500 ms**. Emits complete `0/`, `constant/`, and `system/` trees. |
| **Fast Coarse CFD Preset (Symmetry Half-Model, ~0.6M cells)** | **NO** | **YES** (Docker / WSL OpenFOAM `simpleFoam`) | **YES** | **3 – 8 minutes** on 8-12 cores. Labelled as low-fidelity fast scan. |
| **Medium Vehicle CFD (~2.5M cells)** | **NO** | **YES** (Within 12 GB RAM allocation) | **YES** | **18 – 35 minutes** on 12-16 threads. Minimum engineering threshold. |
| **Fine Vehicle CFD (> 8M cells, full wheel rotation)** | **NO** | **NO** (Exceeds 15.5 GB host RAM ceiling) | **YES** | **2 – 6 hours** on 32-64 cores. Remote HPC required. |
| **CFD Post-Processing (Streamlines, $C_p$, $Q$-criterion)** | **YES** (Render pre-extracted VTK/GLTF meshes) | **YES** (`postProcess / foamToVTK`) | **YES** | Extraction: 30s - 2min. Rendering in Three.js: **60 fps**. |

---

## 3. Solver Resource Allocation Policy (Host Intel Ultra 7 155H)

To prevent host freezing or out-of-memory kernel panics:
1. **Thread Allocation**:
   - The Intel Core Ultra 7 155H has 22 logical threads (6 Performance cores, 8 Efficient cores, 2 Low-Power E-cores).
   - Solver execution is capped at **12 threads** (`numberOfSubdomains 12;` in `decomposeParDict`), leaving 10 threads free for the operating system, browser, and background tasks.
2. **Memory Ceiling**:
   - Total host RAM: 15.52 GB.
   - Container memory limit is capped at **10.0 GB** (`--memory=10g --memory-swap=12g`), guaranteeing that Windows, IDE, and client applications never experience thrashing.
3. **Execution Gating**:
   - If Docker or OpenFOAM is not running, the application **never fakes CFD**.
   - It outputs:
     `SOLVER STATUS: OpenFOAM runtime not detected on host. Operating in ANALYTIC PREPARATION MODE.`
     `Exported case directory: simulations/ahmed_body_25deg/`
     `Ready for external execution via: bash Allrun`
