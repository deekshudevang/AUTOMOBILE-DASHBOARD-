# AutoVerse — REST API Documentation (`API_DOCUMENTATION.md`)

AutoVerse exposes a FastAPI asynchronous REST API with full OpenAPI / Swagger documentation (`/docs` and `/redoc`).

---

## 1. Core Endpoints

### 1.1 Vehicles & Reference Library
- `GET /api/v1/vehicles`: List reference vehicles with pagination and category filters.
- `GET /api/v1/vehicles/{id}`: Get complete sourced vehicle specifications and provenance metadata.
- `GET /api/v1/vehicles/{id}/components`: Retrieve vehicle component tree.

### 1.2 Projects & Revisions
- `POST /api/v1/projects`: Create or fork an independent vehicle project from reference.
- `GET /api/v1/projects`: List user projects.
- `GET /api/v1/projects/{id}`: Get project details, active revision, and dimensions.
- `POST /api/v1/projects/{id}/fork`: Fork project into a new design variant.
- `POST /api/v1/projects/{id}/revisions`: Create an immutable append-only project revision.
- `GET /api/v1/projects/{id}/revisions`: Retrieve project revision history.

### 1.3 Components & Compatibility
- `GET /api/v1/components`: Query pre-built interchangeable component library.
- `POST /api/v1/projects/{id}/components/{compId}/replace`: Replace component with compatible alternative.
- `POST /api/v1/projects/{id}/validate`: Run assembly compatibility and dynamic clearance sweeps.

### 1.4 CAD & Geometry Engine
- `POST /api/v1/cad/features`: Append or update feature DAG node.
- `POST /api/v1/cad/rebuild`: Deterministic rebuild of CAD geometry.
- `GET /api/v1/cad/export/{format}`: Export CAD model (STEP, STL, OBJ, GLB).

### 1.5 Meshing & CFD Simulation
- `POST /api/v1/mesh/generate`: Dispatch mesh generation job (Gmsh / snappyHexMesh).
- `GET /api/v1/mesh/jobs/{jobId}`: Get mesh quality diagnostics and cell statistics.
- `POST /api/v1/cfd/jobs`: Dispatch OpenFOAM RANS simulation job.
- `GET /api/v1/cfd/jobs/{jobId}`: Stream residual history and force convergence.
- `GET /api/v1/cfd/jobs/{jobId}/results`: Retrieve Cd, Cl, and surface pressure contours.

### 1.6 Engineering Reports & Benchmarks
- `GET /api/v1/benchmarks/ahmed`: Retrieve Ahmed Body benchmark verification report.
- `GET /api/v1/benchmarks/drivaer`: Retrieve DrivAer Generic Car benchmark verification report.
- `POST /api/v1/reports/generate`: Generate 20-section academic engineering report.
