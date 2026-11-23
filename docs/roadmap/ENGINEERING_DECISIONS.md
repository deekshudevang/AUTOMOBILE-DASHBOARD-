# AUTOVERSE 3D — ARCHITECTURAL & ENGINEERING DECISIONS (ADR)

**Last Updated:** November 23, 2026  
**Auditor:** Principal Software Architect  

---

### ADR-001: Standardization on FastAPI as the Sole Authoritative Backend
- **Context:** The repository previously contained both a Node.js Fastify backend (`backend/`) and a Python FastAPI backend (`services/api/`).
- **Decision:** Consolidate on **FastAPI** on port 8000. Fastify is deprecated and scheduled for deletion in Phase 22.
- **Rationale:** Automotive engineering, aerodynamic math, and CFD execution natively interface with Python scientific toolchains (NumPy, SciPy, OpenFOAM, PyVista). FastAPI provides automatic OpenAPI documentation, Pydantic V2 schema validation, and async lifecycle management.

---

### ADR-002: Dual-Layer Persistence with Optimistic Concurrency Locking
- **Context:** Users customize vehicles both online and offline. Server failures or network drops could lead to stale local builds overwriting newer server records.
- **Decision:** Implement **Optimistic Concurrency Control (OCC)** using `config_version` and `expected_version`.
- **Rules:**
  1. Local writes to `localStorage` occur immediately with a `dirtyState: true` flag.
  2. Updates to `PUT /api/v1/builds/{id}` pass `expected_version`.
  3. If server detects `expected_version != build.config_version`, it rejects the write with **HTTP 409 Conflict**.
  4. On synchronization conflict, the client preserves the user's modifications as an unconflicted local fork (`"${name} (Local Fork)"`), ensuring user engineering data is never silently overwritten or destroyed.

---

### ADR-003: Version-Controlled Relational Database Migrations via Alembic
- **Context:** Early phases executed dynamic `ALTER TABLE` introspection queries during application startup.
- **Decision:** Adopt **Alembic** versioned migrations with `render_as_batch=True` for SQLite and PostgreSQL compatibility.
- **Rationale:** Ensures clean audit trails, rollback capability, reproducible CI environments, and prevents table lock deadlocks.

---

### ADR-004: Non-Destructive Append-Only Revision DAG
- **Context:** Project revisions must maintain historical integrity without destructive Git-rebase style rewrites.
- **Decision:** When restoring a historical revision (`POST /api/v1/revisions/{id}/restore`), create an append-only new revision snapshot referencing the historical parent, rather than overwriting existing branches.
- **Rationale:** Meets automotive engineering provenance and regulatory traceability requirements.
