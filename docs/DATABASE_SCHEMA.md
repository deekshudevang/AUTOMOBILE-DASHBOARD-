# AutoVerse — Database Schema Specification (`DATABASE_SCHEMA.md`)

**ORM:** SQLAlchemy 2.0  
**Migration Tool:** Alembic  
**Dialects Supported:** SQLite (local offline/development) and PostgreSQL (production)  

---

## 1. Entity-Relationship Overview

```text
User (1) ----< (N) VehicleProject (1) ----< (N) ProjectRevision
                          |                             |
                          +-----< (N) CADJob            +-----< (N) SimulationResult
                          |                             |
                          +-----< (N) MeshJob           +-----< (N) Report
                          |
                          +-----< (N) CFDJob
                          |
                          +-----< (N) DynamicsJob

Vehicle (1) ----< (N) VehicleComponent (1) ----< (N) ComponentCompatibility
    |                         |
    +----< (N) VehicleAsset    +----< (N) ComponentAsset
```

---

## 2. Model Definitions (§19)

1. `users`: User accounts, roles (student, engineer, admin), authentication credentials.
2. `vehicles`: Vehicle identity, manufacturer, model, generation, year, category, provenance.
3. `vehicle_assets`: 3D CAD/mesh files, file formats, hashes, license, attribution.
4. `vehicle_specifications`: Sourced dimensions, wheelbase, track, kerb weight, powertrain specs.
5. `vehicle_components`: Component definitions, semantic type, parent ID, editability mode, mass estimate.
6. `component_assets`: STL/STEP/OBJ geometry artifacts, vertex/triangle counts, hashes.
7. `component_categories`: Categories (exterior, interior, chassis, wheels, lighting, aero).
8. `component_compatibilities`: Component compatibility matrix, mounting points, clearance requirements.
9. `component_dependencies`: Parent-child requirements and mutual exclusions.
10. `component_mounts`: Named attachment hardpoints in ISO 8855 coordinates.
11. `component_materials`: Material properties (paint, clearcoat, carbon fiber, rubber, glass).
12. `vehicle_projects`: User projects, name, active revision ID, created/updated timestamps.
13. `project_revisions`: Immutable append-only revision snapshots, parent revision ID, geometry hash.
14. `geometry_artifacts`: Persisted B-rep and mesh file pointers (stored in object store, never in DB blobs).
15. `cad_features`: Parametric feature DAG nodes, parameters, parent feature IDs.
16. `cad_jobs`: Asynchronous CAD regeneration jobs, status, execution logs.
17. `mesh_jobs`: Gmsh / snappyHexMesh execution jobs, cell count, skewness, non-orthogonality.
18. `cfd_jobs`: OpenFOAM simulation jobs, status, solver, iterations, convergence metrics.
19. `dynamics_jobs`: Project Chrono vehicle kinematic jobs, suspension travel, axle load balance.
20. `simulation_results`: Computed Cd, Cl, drag/downforce values with strict tri-state provenance tags.
21. `reports`: Generated academic engineering reports (Markdown/PDF).
22. `audit_logs`: User and system action audit trail.
