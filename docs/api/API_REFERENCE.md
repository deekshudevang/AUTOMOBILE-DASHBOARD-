# AUTOVERSE API REFERENCE — VERSION 1.0 (v1)
## Authoritative FastAPI Endpoints Specification

**Base URL:** `http://localhost:8000` (Dev) / `https://api.autoverse.engineering` (Prod)  
**Specification Standard:** OpenAPI 3.1 / JSON REST  
**Authentication:** Session Token / Bearer Header (`Authorization: Bearer <token>`)  

---

### 1. Health & System Diagnostics

#### `GET /api/v1/health`
Checks actual application process and database health.
- **Response 200 OK:**
  ```json
  {
    "status": "ONLINE",
    "service": "autoverse-api",
    "version": "2.1.0",
    "timestamp": "2026-11-23T21:30:00Z",
    "active_mode": "student",
    "database_connected": true,
    "details": {
      "database_engine": "sqlite",
      "database_latency_ms": 1.15,
      "cfd_worker_integrated": false,
      "cad_kernel_mode": "PARAMETRIC_MESH"
    }
  }
  ```

#### `GET /api/v1/health/ready`
Readiness probe for reverse proxies and Kubernetes clusters.
- **Response 200 OK:** `{"status": "READY", "timestamp": "2026-11-23T21:30:00Z"}`
- **Response 503 Service Unavailable:** `{"detail": "Service not ready: Database check failed"}`

#### `GET /api/v1/system/info`
Returns platform telemetry, entity counts, and database metadata.
- **Response 200 OK:**
  ```json
  {
    "service": "autoverse-api",
    "version": "2.1.0",
    "database": "sqlite",
    "database_connected": true,
    "vehicle_count": 50,
    "project_count": 4,
    "build_count": 12,
    "uptime_seconds": 1248.5,
    "timestamp": "2026-11-23T21:30:00Z"
  }
  ```

---

### 2. Vehicle Catalog & Engineering Specs

#### `GET /api/v1/vehicles`
List certified vehicles with search and filtering.
- **Query Parameters:**
  - `q` (string, optional): Keyword search matching name, manufacturer, or model code.
  - `category` (string, optional): Filter by category (`Supercar`, `GT3 Racecar`, `CFD Benchmark`).
  - `manufacturer` (string, optional): Filter by brand (`Porsche`, `BMW`, `Ferrari`).
  - `skip` (integer, default 0): Offset for pagination.
  - `limit` (integer, default 100): Page limit.

#### `GET /api/v1/vehicles/{vehicle_id}`
Retrieve a single vehicle specification by ID, slug, or model hash.

#### `GET /api/v1/vehicles/{vehicle_id}/specification`
Retrieve dimensional and aerodynamic baseline specifications.

#### `GET /api/v1/vehicles/{vehicle_id}/components`
Retrieve canonical component hierarchy and mount datums for a vehicle.

---

### 3. Projects Management (CRUD)

#### `GET /api/v1/projects`
List active engineering projects.
- **Query Parameters:** `include_archived` (boolean, default false).

#### `POST /api/v1/projects`
Create a new engineering project forked from a base vehicle.
- **Request Body:**
  ```json
  {
    "name": "GT3 RS Nurburgring Aero Setup",
    "base_vehicle_id": "veh_porsche_911_gt3rs",
    "description": "High downforce package evaluation",
    "active_branch": "main"
  }
  ```

#### `GET /api/v1/projects/{project_id}`
Retrieve detailed project metadata and revision history.

#### `PUT /api/v1/projects/{project_id}`
Update project details (name, description, active branch, archive status).

#### `DELETE /api/v1/projects/{project_id}`
Soft-delete (archive) or hard-delete an engineering project.

---

### 4. Revision DAG & Snapshot Restore

#### `GET /api/v1/projects/{project_id}/revisions`
Retrieve full immutable revision history for a project.

#### `POST /api/v1/projects/{project_id}/revisions`
Commit a new immutable snapshot revision to the project DAG.
- **Request Body:**
  ```json
  {
    "commit_message": "Upgraded front splitter angle to +4 deg",
    "author_name": "Chief Aerodynamicist",
    "geometry_digest": "sha256_geom_digest_here",
    "parent_revision_hash": "a9dba04f",
    "serialized_bundle": "{\"splitterAngle\": 4}",
    "is_manifold": true
  }
  ```

#### `POST /api/v1/revisions/{revision_id}/restore`
Restores the project configuration to match a prior revision snapshot, creating an audited restore commit in the DAG.

---

### 5. Saved Builds & Custom Overrides

#### `GET /api/v1/builds`
List saved custom builds.
- **Query Parameters:**
  - `project_id` (string, optional): Filter by associated project.
  - `vehicle_id` (string, optional): Filter by base vehicle slug.

#### `POST /api/v1/builds`
Save a customized vehicle build configuration.
- **Request Body:**
  ```json
  {
    "name": "Track Aero Spec #1",
    "vehicle_id": "porsche_911_gt3_rs_992_2022",
    "base_vehicle_file": "porsche_911_gt3_rs_992_2022.json",
    "project_id": null,
    "base_model_hash": 706080074,
    "configuration_json": "{\"front_splitter\":{\"componentId\":\"splitter_track\",\"scale\":[1,1,1]}}",
    "primary_color": 12,
    "is_primary_color_custom": false,
    "wheel_color": 156
  }
  ```

#### `GET /api/v1/builds/{build_id}`
Retrieve complete build configuration and component overrides.

#### `PUT /api/v1/builds/{build_id}`
Update build name, colorways, or component configuration JSON.

#### `DELETE /api/v1/builds/{build_id}`
Permanently delete a saved build.

#### `POST /api/v1/builds/{build_id}/duplicate`
Create an exact cloned duplicate of an existing build with `"(Copy)"` suffix.
