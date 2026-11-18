# AutoVerse — Engineering Engine Integration & Adapters (`ENGINE_INTEGRATION.md`)

This document outlines the architecture of adapters connecting AutoVerse to external engineering software engines.

---

## 1. Engine Adapters Overview

AutoVerse isolates heavy computational engines behind dedicated adapter interfaces. The frontend and API never invoke raw binaries directly without validation.

```text
+-----------------------+
|  AutoVerse Core API   |
+-----------------------+
            |
    +-------+-------+---------------+---------------+
    |               |               |               |
    v               v               v               v
+------------+  +------------+  +------------+  +------------+
| CADAdapter |  | MeshAdapter|  | CFDAdapter |  |ChronoAdapt |
| (CadQuery/ |  | (Gmsh /    |  | (OpenFOAM /|  | (Multibody |
| OpenCAS)   |  | snappyHex) |  |  simple)   |  | Kinematics)|
+------------+  +------------+  +------------+  +------------+
```

---

## 2. OpenFOAM Adapter (`src/simulation/openfoam/`)
- **Case Generation:** Automatically constructs valid case trees: `0/U`, `0/p`, `0/k`, `0/omega`, `0/nut`, `constant/transportProperties`, `constant/turbulenceProperties`, `system/blockMeshDict`, `system/snappyHexMeshDict`, `system/controlDict`, `system/fvSchemes`, `system/fvSolution`.
- **Wind Tunnel Sizing:** Computes domain bounds maintaining blockage ratio $< 3.0\%$ with moving ground and rotating wheel velocity.
- **Convergence Monitoring:** Evaluates normalized residuals ($< 10^{-4}$) and force stability ($\sigma_{C_d} < 0.001$).

---

## 3. Gmsh Meshing Adapter (`engineering/meshing/`)
- Generates 1D curves, 2D boundary surface patches, and 3D volume tetrahedral meshes.
- Gating analysis: cell count, non-orthogonality, aspect ratio, skewness, negative volume detection.

---

## 4. CadQuery / B-Rep CAD Adapter (`engineering/cad/`)
- Interfaces with OpenCASCADE geometry kernel to execute boolean operations, variable-radius fillets, lofts, and sweeps.
- Exports standard ISO 10303-21 STEP AP214 and faceted STLs.

---

## 5. Project Chrono Dynamics Adapter (`engineering/dynamics/`)
- Solves multibody kinematics for front and rear double-wishbone or multi-link suspensions.
- Computes suspension stroke, dynamic camber gain, steering geometry (Ackerman), and scrub radius.
- Bridges CFD downforce and aerodynamic balance into dynamic axle load distribution.
