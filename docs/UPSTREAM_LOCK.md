# AutoVerse — Upstream Dependency & Tooling Version Lock (`UPSTREAM_LOCK.md`)

This file records the exact upstream repositories, tools, versions, and licensing terms used in AutoVerse.

---

## 1. Upstream Engineering Engines

| Engine | Upstream Repository / Authority | Version / Commit | Licence | Role & Integration Boundary |
| :--- | :--- | :--- | :--- | :--- |
| **OpenFOAM** | [OpenFOAM Foundation](https://github.com/OpenFOAM/OpenFOAM-14) / ESI-OpenCFD | v2406 / Foundation 11 | GPL-3.0 | Steady incompressible RANS ($k$-$\omega$ SST) external automotive aerodynamics. Executed via sandboxed container worker. |
| **Gmsh** | [ONELAB Gmsh](https://gitlab.onelab.info/gmsh/gmsh) | v4.13.1 | GPL-2.0+ | Automated unstructured surface & volume tetrahedral meshing. Decoupled process adapter. |
| **CadQuery / OCP** | [CadQuery](https://github.com/CadQuery/cadquery) | v2.4.0 | Apache-2.0 | Python B-rep solid CAD operations (OpenCASCADE backend) for boolean cuts, fillets, and STEP export. |
| **Project Chrono** | [Project Chrono](https://github.com/projectchrono/chrono) | v9.0.0 | BSD-3-Clause | Multibody suspension kinematics, steering geometry, and axle normal force calculations. |
| **Three.js** | [mrdoob/three.js](https://github.com/mrdoob/three.js) | v0.174.0 | MIT | WebGL 3D client visualization, PBR materials, and interactive camera navigation. |
| **React Three Fiber**| [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | v8.18.0 | MIT | Declarative Three.js scene graph management in React 18. |
| **FastAPI** | [tiangolo/fastapi](https://github.com/fastapi/fastapi) | v0.115+ | MIT | Asynchronous REST API service with automated OpenAPI documentation. |
| **SQLAlchemy** | [sqlalchemy/sqlalchemy](https://github.com/sqlalchemy/sqlalchemy) | v2.0+ | MIT | Object-relational mapping and schema management for vehicle and project models. |

---

## 2. Benchmark Reference Specifications

1. **Ahmed Reference Body**:
   - Citation: Ahmed, S. R., Ramm, G., and Faltin, G., *"Some Salient Features of the Time-Averaged Ground Vehicle Wake"*, SAE Technical Paper 840300, 1984.
   - Reference $C_d$: 25° slant = $0.285$, 35° slant = $0.257$.
2. **DrivAer Generic Car Model**:
   - Citation: Heft, A. I., Indinger, T., and Adams, N. A., *"Introduction of a New Realistic Generic Car Model for Aerodynamic Investigation"*, SAE Technical Paper 2012-01-0168, 2012.
   - Reference $C_d$: Fastback = $0.243$, Notchback = $0.254$, Estate = $0.282$.
