# AUTOVERSE 3D — OWNER ACTIONS LOG (`docs/OWNER_ACTIONS.md`)

This document records all manual, external, privileged, or infrastructure actions required by the repository owner / administrator that cannot or should not be automated silently by autonomous coding agents.

---

## 1. Required Host Software & Services

| Action ID | Component | Required Action | Status | Notes / Instructions |
| :--- | :--- | :--- | :--- | :--- |
| `ACT-001` | **Docker Desktop** | Start Docker Desktop daemon on Windows host | **Action Needed** | Required if running OpenFOAM solver inside the containerized sandbox (`docker run -v ... openfoam/openfoam11-paraview510`). |
| `ACT-002` | **OpenFOAM (Native / WSL)** | Optional: Install native OpenFOAM in WSL 2 (`sudo apt install openfoam2406` or `openfoam11`) | **Optional / Alternative** | If native WSL execution is preferred over Docker, install OpenFOAM inside the Ubuntu WSL environment. |
| `ACT-003` | **Deployment / Hosting** | Review production deployment targets and domain certificates | **Pending Owner Review** | Antigravity will not modify cloud hosting or domain DNS settings without explicit owner instruction. |
| `ACT-004` | **Third-Party CAD Licences** | Verify whether proprietary CAD formats (e.g. Siemens Parasolid, CATIA) require commercial SDK licences | **Noted** | AutoVerse 3D uses open-source Open CASCADE Technology (LGPL-2.1) and open standard B-rep/STEP schemas. |

---

## 2. Solver Execution Strategy Policy

1. **Local Mode (Without Docker / OpenFOAM Running)**:
   - The platform operates in **Analytic & Case-Preparation Mode**:
     - Parametric geometry generation (Ahmed body, DrivAer, vehicle bodies) is fully functional.
     - Watertightness, manifoldness, and surface quality checks run locally.
     - Complete OpenFOAM case bundles (`0/`, `constant/`, `system/`, `snappyHexMeshDict`, `blockMeshDict`, `controlDict`, `fvSchemes`, `fvSolution`) are generated and validated with golden tests.
     - Aerodynamic force estimates use documented, cited empirical/analytic formulations clearly tagged `ANALYTIC`.
     - Zero fake CFD is generated. If the solver has not executed, no CFD results are claimed.
2. **Containerized / Local CFD Mode (When Docker / WSL OpenFOAM is started)**:
   - Executes `blockMesh`, `surfaceFeatures`, `snappyHexMesh`, and `simpleFoam` via containerized job runner with resource caps and log streaming.
   - Extracts genuine converged drag ($C_d$), lift ($C_l$), and aerodynamic balance, tagged `CFD`.
