# AUTOVERSE 3D — MASTER DEFECT REGISTER

**Last Updated:** November 23, 2026  
**Auditor:** Principal Software Architect & QA Lead  

```
┌──────────┬───────────────────────────┬───────────────────────────────────────────┬──────────┬──────────────┬──────────────────────────┐
│ ID       │ Subsystem                 │ Description                               │ Severity │ Status       │ Target Phase             │
├──────────┼───────────────────────────┼───────────────────────────────────────────┼──────────┼──────────────┼──────────────────────────┤
│ DEF-001  │ Backend Integration       │ Frontend disconnected from FastAPI        │ CRITICAL │ **RESOLVED** │ Resolved in Phase 21     │
│ DEF-002  │ Status Monitoring         │ Hardcoded fake "ENGINE READY" status pill │ HIGH     │ **RESOLVED** │ Resolved in Phase 21     │
│ DEF-003  │ Build / Bundle Size       │ Monolithic 2.41 MB JavaScript bundle      │ HIGH     │ IN PROGRESS  │ Phase 22 (Code Splitting)│
│ DEF-004  │ CAD Kernel / STEP Export  │ STEP exporter emits faceted triangles     │ HIGH     │ PLANNED      │ Phase 23 (OpenCASCADE.js)│
│ DEF-005  │ CFD Execution             │ OpenFOAM blocked on Windows host (BLK-001)│ HIGH     │ PLANNED      │ Phase 24 (Docker Worker) │
│ DEF-006  │ Memory / WebGL Lifecycle  │ GPU memory accumulation on rapid car swap │ HIGH     │ IN PROGRESS  │ Phase 22 (GeometryPool)  │
│ DEF-007  │ Vehicle Database          │ 450+ unpruned legacy GTA database entries │ MEDIUM   │ PLANNED      │ Phase 22 (Pruning)       │
│ DEF-008  │ Geometry Authenticity     │ 49 vehicles are procedural lofts, not CAD │ MEDIUM   │ PLANNED      │ Phase 25 (Refinement)    │
│ DEF-009  │ Cross-Car Part Swapper    │ Swapped hoods/bumpers clip curved bodies  │ MEDIUM   │ PLANNED      │ Phase 25 (Fitting)       │
│ DEF-010  │ Architecture Cleanup      │ Inactive Fastify server remains in repo   │ LOW      │ PLANNED      │ Phase 22 (Archival)      │
│ DEF-011  │ Mobile Ergonomics         │ Fixed 340px side drawer obscures viewport │ LOW      │ PLANNED      │ Phase 26 (Bottom Sheet)  │
│ DEF-012  │ UI Accessibility          │ Sliders lack explicit ARIA range tags     │ LOW      │ PLANNED      │ Phase 26 (ARIA Tagging)  │
│ DEF-013  │ PBR Material Quality      │ Tire treads lack normal displacement maps │ LOW      │ PLANNED      │ Phase 25 (PBR Textures)  │
│ DEF-014  │ Color Accessibility       │ Swatches lack descriptive screen labels   │ LOW      │ PLANNED      │ Phase 26 (ARIA Tagging)  │
│ DEF-015  │ Lighting Geometry         │ Lighting assemblies lack projector optics │ LOW      │ PLANNED      │ Phase 25 (Optics)        │
│ DEF-016  │ Code Duplication          │ Exporter logic duplicated in src/utils    │ LOW      │ PLANNED      │ Phase 23 (Consolidation) │
│ DEF-017  │ CFD Volumetric Meshing    │ Surface triangles emitted instead of prism│ LOW      │ PLANNED      │ Phase 24 (snappyHexMesh) │
│ DEF-018  │ Vehicle Dynamics          │ Elastokinematic bushing deflection omitted│ LOW      │ PLANNED      │ Phase 25 (Refinement)    │
│ DEF-019  │ Automated E2E Testing     │ Lacks automated Three.js canvas testing   │ LOW      │ PLANNED      │ Phase 26 (Automated E2E) │
│ DEF-020  │ Aero Polar Batching       │ Polar sweep runs calculations sequentially│ LOW      │ PLANNED      │ Phase 24 (Web Worker)    │
│ DEF-021  │ Concurrency Conflicts     │ Stale cached build overwriting server     │ HIGH     │ **RESOLVED** │ Resolved in Phase 21.6   │
│ DEF-022  │ DB Schema Migrations      │ Dynamic ALTER TABLE startup risk          │ MEDIUM   │ **RESOLVED** │ Resolved in Phase 21.6   │
└──────────┴───────────────────────────┴───────────────────────────────────────────┴──────────┴──────────────┴──────────────────────────┘
```
