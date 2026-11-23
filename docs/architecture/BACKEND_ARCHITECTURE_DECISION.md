# BACKEND ARCHITECTURE DECISION RECORD (ADR)
## Selection of Authoritative Application Backend for AutoVerse

**Status:** APPROVED  
**Date:** November 23, 2026  
**Architect:** Principal Software Architect & Systems Lead  
**Context:** AutoVerse Milestone Phase 21  

---

### 1. Context & Problem Statement

The repository audit revealed two competing backend implementations operating in isolation:
1. `backend/`: Fastify 4.x + Node.js `node:sqlite` in TypeScript.
2. `services/api/`: FastAPI 0.115.x + SQLAlchemy 2.x + Pydantic V2 in Python 3.14.

Neither backend was connected to the React/Three.js frontend. The platform requires a single, authoritative application backend that owns user sessions, vehicle metadata, project management, saved builds, component overrides, revision history, and simulation records.

Maintaining two application backends introduces architectural schizophrenia, duplicate data stores, schema drift, double maintenance overhead, and developer confusion. Exactly one backend must be selected as the authoritative application API.

---

### 2. Comparative Evaluation Matrix

| Evaluation Criteria | Fastify Backend (`backend/`) | FastAPI Backend (`services/api/`) | Winner |
| :--- | :--- | :--- | :---: |
| **Existing Feature Completeness** | Minimal. Implements only vehicle hash table, offline job queue, and batch Cherax ZIP export. Zero models for projects, revisions, builds, CAD, or CFD. | **Advanced.** Contains 22 ORM models covering Users, Projects, Revisions, GeometryArtifacts, CAD/CFD Jobs, Dynamics, Reports, and Specifications. | **FastAPI** |
| **Database & ORM Maturity** | Raw SQL strings via `node:sqlite` `DatabaseSync`. No migrations, no relationship modeling, no foreign key cascade handling. | Declarative SQLAlchemy ORM with connection pooling (`pool_pre_ping=True`), schema validation, and multi-database support (SQLite / PostgreSQL). | **FastAPI** |
| **Automotive Engineering Alignment** | Requires wrapping or shelling out to external processes for CFD, OpenFOAM dictionary generation, mesh calculations, and scientific math. | Native Python ecosystem (NumPy, SciPy, OpenFOAM wrappers, PyVista, CAD kernels). Natural home for automotive simulation. | **FastAPI** |
| **API Architecture & Validation** | Manual Fastify route parameter checks. | Automatic OpenAPI/Swagger generation, Pydantic V2 schema validation, and typed response serialization. | **FastAPI** |
| **Frontend Integration Complexity** | Low (TypeScript types shared), but lacks 85% of necessary automotive domain endpoints. | Low (OpenAPI schema can generate TypeScript client definitions; REST JSON is standard). | **FastAPI** |
| **Testing State** | 1 test file (`tests/backend.test.ts`) covering basic vehicle CRUD. | Comprehensive test file (`tests_python/test_backend_api.py`) passing 7/7 tests cleanly. | **FastAPI** |

---

### 3. Authoritative Decision

**FastAPI (`services/api/`) is designated as the sole Authoritative Application Backend for AutoVerse.**

#### Implementation Plan:
1. **Primary Application API:**
   All frontend requests (`/api/v1/health`, `/api/v1/projects`, `/api/v1/builds`, `/api/v1/vehicles`, `/api/v1/revisions`) will be routed to the FastAPI backend running on port 8000.
2. **Deprecation of Fastify:**
   The `backend/` directory will be archived. No new application endpoints will be added to Fastify. Its utility routines for Cherax legacy vehicle batch conversion will be consolidated into the Python service or workspace tools.
3. **Database Architecture:**
   SQLAlchemy with SQLite will be used for rapid local single-developer workflows (`autoverse.db`), while supporting zero-code-change migration to PostgreSQL for enterprise production deployments via `DATABASE_URL`.
4. **Specialized Engineering Workers:**
   Any future heavy computational workers (OpenFOAM CFD solver runners, OpenCASCADE CAD tessellators) will communicate with this authoritative FastAPI backend via internal worker queues or service interfaces. They will NEVER act as independent sources of truth for user projects or builds.

---

### 4. Consequences & Benefits

- **Single Source of Truth:** Eliminates duplicate database schemas and inconsistent project IDs.
- **Immediate Feature Access:** Unlocks pre-existing project, revision, component, and simulation models already built in `services/api/models.py`.
- **Engineering Cohesion:** Enables direct server-side execution of analytical aerodynamics, vehicle dynamics checks, and report generation in native Python.
- **Clear Maintenance Path:** Developers only need to maintain one backend server during local development and CI/CD pipelines.
