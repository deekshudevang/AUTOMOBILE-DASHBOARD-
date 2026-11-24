# AutoVerse — Engineering Architecture Decision Records (`ENGINEERING_DECISIONS.md`)

This document records the architectural and technology decisions for the AutoVerse automotive platform following standard ADR format: Decision, Context, Alternatives Rejected, Consequences.

---

## Decision 001: Hybrid Monolith with Sandboxed Job Workers
- **Date:** 2026-11-18
- **Status:** Approved
- **Context:** An automotive engineering application requires fast, responsive interactive 3D UI, coupled with CPU-intensive CAD regeneration, meshing, and CFD solver jobs. Microservices and Kubernetes add unnecessary complexity and latency.
- **Decision:** Adopt a modular monolith for the core application (React frontend + Python FastAPI backend) with sandboxed background workers for expensive engineering tasks (CAD, Meshing, CFD, Dynamics).
- **Alternatives Rejected:**
  1. Distributed microservices (Rejected: operational bloat, inter-service serialization overhead).
  2. Pure browser-only execution (Rejected: live CFD and full solid B-rep modeling are computationally impossible in client WASM).
- **Consequences:** Simple single-server deployment via Docker Compose with clean worker queue scalability.

---

## Decision 002: Dual Operating Modes (Student Mode & Advanced Mode)
- **Date:** 2026-11-18
- **Status:** Approved
- **Context:** The platform serves undergraduate engineering students as well as advanced automotive aerodynamicists. Beginners need guided steps and educational context; advanced users require deep solver tuning.
- **Decision:** Implement a global mode toggle (Student vs Advanced) that dynamically switches UI complexity, default presets, and instructional explanations while sharing the identical underlying project data.
- **Alternatives Rejected:** Separate standalone applications (Rejected: duplicate codebase and project incompatibility).

---

## Decision 003: Strict Tri-State Provenance Tagging
- **Date:** 2026-11-18
- **Status:** Approved
- **Context:** Many commercial tools blur the line between real simulations, analytic estimates, and decorative graphics, misleading students and researchers.
- **Decision:** Enforce mandatory provenance tagging: `CFD` (real numerical solver), `ANALYTIC` (closed-form equations), `ILLUSTRATIVE` (visual/decorative). Never mix categories without explicit labeling.
- **Consequences:** Total credibility and defense against hallucinated or fabricated results.

---

## Decision 004: Python FastAPI + SQLAlchemy + SQLite/Postgres for Backend
- **Date:** 2026-11-18
- **Status:** Approved
- **Context:** Scientific automotive engineering libraries (CadQuery, OpenCASCADE, NumPy, SciPy) have native, first-class Python bindings. Python enables direct integration with engineering solvers while FastAPI provides automatic OpenAPI documentation.
- **Decision:** Implement the engineering backend in Python using FastAPI, Pydantic, SQLAlchemy, and Alembic, supporting SQLite for local offline development and PostgreSQL for production.
- **Consequences:** Native access to Python computational geometry and simulation tooling.

---

## Decision 005: Upstream Open-Source Tool Integration Strategy
- **Date:** 2026-11-18
- **Status:** Approved
- **Context:** Heavy third-party upstream repositories (OpenFOAM, Gmsh, CadQuery, Project Chrono) have complex native dependencies and licensing requirements.
- **Decision:** Wrap heavyweight engines in decoupled adapters and isolated background containers rather than copying third-party code into the application tree. Maintain strict version locking in `UPSTREAM_LOCK.md`.
