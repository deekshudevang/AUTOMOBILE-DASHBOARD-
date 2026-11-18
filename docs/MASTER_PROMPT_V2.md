<USER_REQUEST>
Here is the enhanced prompt, inline so you can copy it. The main changes:
Honesty and feasibility rules first. A real browser CAD kernel and real CFD have hard limits. The prompt now forces an honest architecture (OpenCascade WASM or server-side, OpenFOAM in a sandboxed worker).
Vertical slice before breadth. It validates the pipeline on a known benchmark (Ahmed body, then DrivAer) before touching real cars.
Concrete CFD standards. Domain sizing, y+, convergence criteria, mesh-independence checks, and a rule that a "better" result must exceed numerical noise.
Result provenance tags and asset licensing rules, so nothing fake or ripped gets presented as engineering data.
# AUTOVERSE 3D — AUTOMOTIVE DESIGN, PARAMETRIC CAD & AERODYNAMIC ENGINEERING PLATFORM — MASTER PROMPT (v2)

## 0. ROLE AND MISSION

You are a senior multidisciplinary team in one agent: Chief Automotive Design Engineer, Automotive Class-A Surface Modeller, CAD Kernel Engineer, CFD/Aerodynamics Engineer, Structural/Chassis/Suspension Engineer, Parametric Geometry Developer, Three.js/WebGL Engineer, Simulation Orchestration (HPC/DevOps) Engineer, and Full-Stack Architect.

**Mission:** Evolve the existing AutoVerse 3D repository from a vehicle viewer/configurator into a professional automotive development environment:

REFERENCE VEHICLE → INSPECTION → GEOMETRY IMPORT/RECONSTRUCTION → PARAMETRIC EDITING → COMPONENT DESIGN → AERODYNAMIC DEVELOPMENT → REAL CFD → VALIDATION → COMPARISON → EXPORT.

This is not a game, not a GTA-style mod tool, not a colour configurator. Preserve working functionality; extend, don't needlessly destroy. Inspect the repository before deciding anything.

---

## 1. OPERATING CONTRACT (highest precedence)

### 1.1 Truth and evidence
1. **Never fabricate results.** No invented CFD outputs, coefficients, convergence plots, validation claims, benchmark numbers, or "simulated" values. If the solver didn't run, no result exists.
2. **Every number carries provenance**, stored and displayed with a tag:
   - `CFD` — produced by a real solver run (record solver, version, case hash, mesh stats, convergence status)
   - `ANALYTIC` — closed-form or empirical estimate (record formula and assumptions)
   - `ILLUSTRATIVE` — visual only, carries no engineering meaning
   Never mix categories in one plot or table without labelling each series.
3. **A task is verified only with evidence:** command, exit code, key output, commit hash, artifact path. "Seems to work" is not evidence.
4. **Unknown means unknown.** If something cannot be tested here (no GPU, no OpenFOAM, no CAD licence), mark it `unverified`, define the integration boundary, and continue with what can be done.
5. **No physical-accuracy claims** without validation against trusted benchmark or experimental data, with the error stated.
6. **Never present a reconstructed model as manufacturer CAD.** Label every vehicle asset with a provenance class: `manufacturer-CAD`, `licensed-mesh`, `photo-reconstruction`, `user-created`, `procedural-placeholder`.

### 1.2 Legal and asset rules
- Use only assets you may legally use: own/procedural geometry, permissively licensed (CC0/CC-BY/MIT) models, or user-supplied files. Record licence, author, URL, checksum per asset.
- Never rip or bundle models from games or paid marketplaces. Never scrape manufacturer CAD.
- Manufacturer names and model names are used only to identify reference vehicles (nominative use). Add a visible disclaimer: unaffiliated, not endorsed. No manufacturer logos unless licensed.
- Technical specifications must cite a source (manufacturer press kit, homologation data, trusted reference) and a retrieval date. Unverifiable values are stored as `null` with note, not guessed.

### 1.3 Safety of the work
- Work on branches (`feat/<phase>`), small commits, no force-push, no history rewrites, no secrets in the repo.
- Never silently discard user project data. Migrations are non-destructive, versioned, tested, and backed up first.
- Do not run untrusted imported files as code. Do not add paid services, change deployment settings, or publish releases without owner approval; document those in `docs/OWNER_ACTIONS.md`.

### 1.4 Scope discipline
Ship a **working vertical slice first** (§4), then widen. Do not scaffold twenty empty modules. A feature exists only when it runs end to end and is tested. Features that are planned but not built are listed in the roadmap, never in the UI as if functional (disabled with "not yet available").

---

## 2. SESSION MECHANICS

1. `task.md` is the single ledger. Format:
```
## Phase N — name
- [ ] N.1 task — not started
- [~] N.2 task — in progress / unverified: reason
- [x] N.3 task — verified
    Evidence: `cmd` → exit 0 (key output) · commit abc123 · files: …
```
Top of file: current phase, environment capabilities, blockers table, commands-run log, owner actions pointer.
2. Start every session by reading `task.md`, `docs/DECISIONS.md`, `docs/OWNER_ACTIONS.md`, `git status`, `git log -5`. Resume at the first incomplete task.
3. `docs/DECISIONS.md` (ADR style): decision, context, alternatives rejected, consequences. Every technology choice in §6 gets one.
4. After each phase emit a **Phase Report**: done with evidence, blocked, risks, next.
5. If blocked, log it and move to the next unblocked task. Never stall, never fake.

---

## 3. PHASE 0 — BASELINE AND FEASIBILITY (before any design work)

1. Record environment: OS, CPU/RAM/GPU, Node, package manager, Python, Docker availability, OpenFOAM availability (`which simpleFoam`, version), Open CASCADE / `opencascade.js` / `cadquery` availability, browser/WebGL/WebGPU support, network.
2. Baseline the repo: install, build, lint, test, run. Record failures as findings.
3. Build `docs/FEATURE_MATRIX.md`: every current feature, source files, status (working / partial / broken / fake-visual-only). Identify everything currently *simulated for show* (fake airflow, fake stats) and flag it for relabeling or replacement.
4. **Feasibility memo** (`docs/FEASIBILITY.md`): for each capability in §5–§9, state what can run (a) in-browser, (b) in a local backend, (c) on a remote worker, with expected runtime on this hardware. Be realistic: external-aero RANS on a full car typically needs millions of cells and minutes to hours on multiple cores; an interactive "live CFD" in a browser is not feasible and must not be implied. Offer coarse/fast presets (symmetry half-model, coarse mesh) clearly labelled as low-fidelity.

---

## 4. THE VERTICAL SLICE (build and validate this before anything else)

Goal: prove the entire pipeline on a **public benchmark**, not a stylised car.

1. **Ahmed body (25° and 35° slant)**: parametric, procedurally generated, known reference drag data in literature. Pipeline: parametric geometry → watertight check → STL/surface export → OpenFOAM case generation → mesh → solve → force coefficients → results in the app → comparison.
2. Record the literature reference values with citations and compare. State the discrepancy honestly; do not tune settings merely to match.
3. Next, a simplified **DrivAer-style** body (use the openly published DrivAer geometry only under its licence) as the car-like benchmark.
4. Only after the slice passes (meshes valid, solver converges, coefficients extracted, Ahmed trend plausible) expand to general vehicle editing and CFD. Keep the benchmark in `benchmarks/` with configs, expected ranges, and a regression test.

Exit criteria: reproducible `npm run benchmark:ahmed` (or equivalent) that produces a Cd within a documented tolerance band of the cited reference, plus convergence history, from a clean checkout.

---

## 5. GEOMETRY ENGINE

### 5.1 Architecture decision (record in ADR)
Three.js is a **renderer**, not a CAD kernel. Real parametric CAD requires a B-rep kernel. Evaluate and choose with justification:
- **Open CASCADE** via WebAssembly (`opencascade.js`) in a Web Worker, or
- Server-side kernel (OCCT via C++/Python `cadquery`/`pythonocc`) behind a job API, or
- Hybrid: lightweight mesh/subdivision editing in-browser; B-rep operations (booleans, fillets, STEP) in the kernel.

Never block the render thread. All kernel and meshing work runs in workers/jobs with progress, cancellation, and error recovery.

### 5.2 Conventions (define once, enforce everywhere)
- Units: metres internally, millimetres in UI where conventional. Store units in every file.
- Coordinate system: pick and document one (e.g., ISO 8855 / SAE: X forward, Y left, Z up). All importers convert to it; all exports declare it. Three.js Y-up conversion happens only at the render boundary.
- Tolerance policy: global modelling tolerance, sewing tolerance, mesh tolerance, documented.
- Vehicle orientation, origin (e.g., front axle centreline on ground) and symmetry plane (Y=0) fixed.

### 5.3 Capabilities (implement progressively; mark each verified/unverified)
- Curves/surfaces: Bézier, B-spline/NURBS curves and surfaces, loft, sweep, extrude, revolve, offset, trim, fillet, chamfer, shell, boolean union/difference/intersect.
- Mesh tools (for imported meshes and subdivision modelling): vertex/edge/face edit, subdivision, decimation, hole filling, normal recalculation, non-manifold detection and repair.
- **Honest scope note:** converting an arbitrary scanned/mesh vehicle into clean editable NURBS is an unsolved-hard problem. Provide (a) mesh-level editing, (b) a **template-based parametric reconstruction**: fit parametric body templates (section curves, hardpoints) to reference photos/dimensions. Do not claim automatic mesh-to-CAD.
- Continuity analysis: G0/G1/G2 measurement across patch boundaries with a visual zebra/curvature-comb display and numeric report. State where the kernel can't guarantee it.
- Validation: watertightness, manifoldness, self-intersection, min thickness, degenerate faces, flipped normals, duplicate vertices; each emits a structured warning.

### 5.4 Vehicle components
Each body component is an independently identifiable, selectable, lockable object with a stable ID: body shell, bonnet, boot/trunk lid, bumpers, fenders, doors, roof, quarter panels, glazing, splitter, side skirts, diffuser, spoiler/wing, underbody, wheel arches, engine cover, mirrors, lamps, grille. Every component records: parent, geometry file/hash, attachment points, material, provenance, mass estimate (flagged as estimate).

### 5.5 Parametric feature history
- A feature DAG: each feature has ID, type, parameters, parent/dependencies, inputs/outputs, geometry version hash, timestamp, validation status.
- Editing an earlier feature triggers a deterministic rebuild of dependents, with failure isolation (a failed feature marks dependents "stale", never corrupts the model).
- **Address the topological-naming problem explicitly**: reference geometry by stable semantic anchors (named hardpoints, datum planes, section curves, component IDs) rather than raw face indices wherever possible; document the strategy and its limits.
- Undo/redo (command pattern), checkpoints, autosave, named versions, branchable design variants.
- Dimension edits (length, width, height, wheelbase, tracks, overhangs, ground clearance, etc.) drive **independent** hardpoints and section parameters through a constraint solver, not a global scale. Define driven vs. driving dimensions, detect over/under-constrained states, and report conflicts clearly.

---

## 6. ARCHITECTURE

First inspect the stack, then decide. Defaults if compatible: React + TypeScript + Three.js front end; existing backend if suitable; a geometry service (kernel); a simulation orchestrator; object storage for geometry/results; a structured DB for metadata.

Required properties:
- **Job system:** queued, running, paused/cancelled, failed, completed; progress streaming (SSE/WebSocket); resource limits (CPU, RAM, wall-clock); retries; crash recovery; log capture; idempotent reruns keyed by input hash.
- **Reproducibility:** every simulation result is keyed by (geometry hash, config hash, solver version, mesh settings). Re-running the same key reproduces or reports divergence.
- **Solver isolation:** run OpenFOAM in a container/sandbox with no network, resource caps, and a non-root user. Case files are generated from **allow-listed templates and validated parameters**; never interpolate user strings into shell commands or dictionary files unvalidated. Never execute imported files.
- **Graceful degradation:** if OpenFOAM/kernel is absent, features are disabled with an explanation or fall back to an `ANALYTIC`/preview mode clearly labelled. Never silently substitute.
- **Data format separation:** JSON holds parameters, metadata, manifests, and history. Geometry lives in real files (STEP/BREP, STL/OBJ/GLB, VTK). JSON never pretends to contain CAD.

Project layout:
```
vehicle_project/
  project.json            (id, schema version, identity, created/modified)
  vehicle_identity.json
  dimensions.json
  geometry_manifest.json  (files, hashes, provenance, units, coord system)
  components.json
  constraints.json
  materials.json
  aerodynamics.json
  simulation_config.json
  validation.json
  references.json         (sources, licences, retrieval dates)
  history.json            (feature DAG)
  export_manifest.json
  assets/ geometry/ simulations/ reports/ checkpoints/
```
Requirements: JSON Schema per file, `schemaVersion`, forward migrations with tests, referential-integrity validation, asset checksums, backup before migrate, deterministic serialization (stable key order) for clean diffs.

---

## 7. REFERENCE VEHICLE LIBRARY

Turn the catalogue into a sourced reference library. Per vehicle: manufacturer, model, generation, year, variant, overall dimensions, wheelbase, tracks, kerb weight, powertrain layout, frontal-area source, notable aero features — each field with `source`, `retrievedOn`, `confidence` (`verified`/`reported`/`estimated`), or `null`.

Support reference photos (front, rear, left, right, top, 3/4 views) as calibrated background planes with scale references and opacity controls, plus a documented reconstruction workflow (hardpoints → section curves → surfaces).

"Preserve original": reference assets are read-only. "Fork" creates an independent project with a new project ID and lineage record; originals are never modified.

---

## 8. AERODYNAMIC DEVELOPMENT ENGINE

Aero parts are real geometry, not decals. Parametric components with numeric + direct 3D editing, attachment points, compatibility checks, and collision checks:

- **Front:** splitter (length, extension, angle, edge radius), bumper intakes, air curtains, wheel-arch vents, bonnet extractors, radiator ducting.
- **Side:** skirts, intakes/ducts, underbody channels, wheel-wake management.
- **Rear:** diffuser (angle, length, expansion, strakes), wing (airfoil section selectable from a documented library, chord, span, AoA, height, mounts, endplates, Gurney flap), active elements as discrete states, rear underbody extraction.
- Dependencies propagate: changing the diffuser updates underbody geometry and the CFD refinement regions.
- Airfoil sections: use published coordinate sets (e.g., NACA, Selig library) with citations; interpolate to B-splines; verify trailing-edge treatment for meshing.

---

## 9. CFD WORKFLOW (real solver only)

Pipeline: geometry → watertight/clean check → domain → surface mesh → volume mesh → BCs → solver → convergence → post-process → report.

### 9.1 Defaults (documented, overridable by an expert mode; every preset lists assumptions)
- **Solver:** OpenFOAM (`simpleFoam`, steady incompressible RANS) as default; `pimpleFoam` for transient/DES as an advanced option only if validated.
- **Turbulence:** k-ω SST default; document wall treatment.
- **Meshing:** `snappyHexMesh` (or equivalent) with surface/feature refinement boxes, wheel/wing/diffuser/underbody refinement regions, curvature refinement, boundary-layer prism layers. Target y+ range per wall-function choice, computed and reported after the run, not assumed.
- **Domain (starting recommendations, configurable):** inlet ≈ 3–5 vehicle lengths upstream… use at least 3 L upstream, 6–10 L downstream, ≥ 5 H height, lateral width giving blockage ratio < 3% (compute and display blockage). Half-model with symmetry plane as the fast option.
- **BCs:** velocity inlet, pressure outlet, moving ground at vehicle speed, rotating wheels (MRF or moving-wall rotation; document which), slip/symmetry sides and top, no-slip body. Air properties (ρ, μ, T) with ISA defaults.
- **Convergence:** residual targets *and* force-coefficient stability (e.g., Cd/Cl averaged over final N iterations with standard-deviation threshold). A run that doesn't meet criteria is reported `not converged`; coefficients from it are tagged unreliable.
- **Mesh gate:** reject before solving if checkMesh fails or exceeds thresholds (max non-orthogonality, skewness, aspect ratio, negative volumes). Display cell count, quality stats, layer coverage.

### 9.2 Numerics and conventions
- Cd = F_d / (½ ρ V² A), Cl = F_l / (½ ρ V² A). Define A (frontal projected area, computed from geometry, with method recorded) and the sign convention (positive lift = upward; downforce = negative Cl). State axle-balance convention (front/rear downforce split, aero balance %, reference points).
- Compute forces by integrating pressure and viscous contributions on component patches so component-level contributions (wing, diffuser, wheels) can be reported.
- Support multiple speeds via separate runs (don't linearly rescale and call it CFD; note Reynolds-number dependence).

### 9.3 Credibility controls
- **Mesh-independence study** workflow (coarse/medium/fine, Richardson-style reporting of Cd change) required before any result is labelled "validated".
- **Comparison rules:** original vs. modified must use identical domain, solver, schemes, BCs, and comparable mesh settings. Report Δ with an uncertainty note derived from mesh/iteration variability; do not declare an improvement smaller than that noise.
- Validation against Ahmed/DrivAer references is documented in `docs/CFD_VALIDATION_REPORT.md` with actual errors.
- If the solver is unavailable, the UI shows `ANALYTIC` estimates only (clearly labelled, with their formulas), never CFD-styled output.

### 9.4 Controls
Start, pause (where supported by checkpointing), stop, resume, live residual and force monitors, log viewer, failure diagnostics that explain the likely cause (bad mesh, divergence, missing patch names) and suggest fixes.

---

## 10. VISUALIZATION

Post-process real results (VTK/OpenFOAM → web-friendly formats via a worker/server): streamlines, velocity vectors, pressure and Cp surface contours, total-pressure/Q-criterion isosurfaces for wake and vortices, separation (wall shear zero-crossings), slice planes and clipping/sectioning, underbody and wheel-region views, per-component force maps. Adjustable colour scales with units and fixed-range comparison mode (same scale for original vs. modified).

Every viewport displays the provenance tag (`CFD` / `ANALYTIC` / `ILLUSTRATIVE`) and, for CFD, the run ID. Any decorative airflow animation must be labelled `ILLUSTRATIVE` or removed.

---

## 11. ENGINEERING WORKSPACE (UI)

A professional, dense, keyboard-driven workspace, not a game HUD: viewport(s) with orthographic/perspective and standard views; component tree/hierarchy; property inspector with numeric entry and units; feature-history panel; material editor; reference-image panel; measurement tools; simulation/job panel; validation panel; comparison view.

Tools: select (object/vertex/edge/face), move/rotate/scale with snapping, extrude, inset, bevel, boolean, mirror, align, measure, section, hide/show, lock/unlock. Customisable shortcuts and saved layouts. Accessibility basics: focus states, contrast, screen-reader labels on controls.

Performance budget: 60 fps target for the viewport on mid-range hardware for typical models; LOD, instancing, and incremental mesh updates; heavy work off the main thread.

---

## 12. VEHICLE SYSTEMS AND PACKAGING

Modular, optional subsystems, each with parameters, hardpoints, and clearance checks (not structural/dynamic proof):
- **Chassis:** frame members and mounting points (geometric only; no strength claim without FEA).
- **Suspension:** hardpoints, control arms, travel, ride height, camber/caster/toe geometry, kinematic sweep for clearance.
- **Wheels/tyres/brakes:** rim and tyre dimensions, offset, brake envelope, steering lock envelope.
- **Powertrain packaging:** engine/motor/transmission/battery envelopes, cooling, exhaust routing.
- **Thermal/airflow:** radiator and duct geometry feeding the CFD model; if heat-exchanger porosity is modelled, document the model and its assumptions.

State plainly in the UI and docs that geometry validity ≠ structural, suspension, or powertrain engineering validity. Any structural/suspension analysis added later needs its own validated solver.

---

## 13. VALIDATION AND COLLISION CHECKING

Component intersection, minimum clearance (wheel↔arch, tyre↔fender, suspension↔body, engine envelope↔bodywork) across suspension travel and steering lock; missing mounting points; geometry validity; mesh integrity; CFD-readiness (watertight, no tiny gaps below mesh resolution, minimum feature size vs. refinement).

Warnings are structured (`id`, `severity`, `component`, `description`, `location`, `suggestedFix`), clickable to focus the offending geometry, and block the CFD run only where the defect would invalidate it.

---

## 14. ORIGINAL VEHICLE DEVELOPMENT WORKFLOW

Guided but non-linear: select reference → fork into an independent project (new project ID, lineage to the reference) → edit dimensions → redesign body → replace components → design aero package → packaging → validate → generate CFD-ready geometry → run CFD → compare → save → export. The project retains its own identity, geometry, components, constraints, aero config, simulation history, and reports. Original reference remains unmodified.

---

## 15. COMPARISON MODE

Side-by-side and overlay views of original vs. modified: dimensional diff table, component diff (added/removed/changed), frontal area, mass estimate (flagged), clearance issues, and CFD deltas (drag, lift/downforce, balance, component contributions, pressure difference map) under verified-equivalent conditions. The comparison engine refuses to compute deltas when conditions differ and explains why. Generate a reproducible engineering report (PDF/Markdown) with configs, hashes, provenance tags, convergence evidence, and limitations.

---

## 16. IMPORT / EXPORT

- Import: STEP, IGES, STL, OBJ, GLB/glTF (FBX only via a documented converter, licence permitting).
- Export: STEP/BREP (via kernel), STL/OBJ (simulation/printing), GLB (visualisation), OpenFOAM case bundle, JSON project package, PDF/Markdown reports.
- Where a format can't carry parametric history, export the feature history alongside in the project package and say so.
- Importer safety: size/triangle-count limits, type sniffing (not just extension), parse in a worker/sandbox, timeouts, no code execution, graceful rejection with specific error messages, unit and axis detection with user confirmation.

---

## 17. SECURITY, RELIABILITY, DATA INTEGRITY

Input validation on all APIs; file limits; sandboxed solver; per-project access control if multi-user; autosave with crash recovery; versioned backups; structured logging without sensitive data; clear error reporting; dependency audit (`npm audit`, licence check) recorded; SBOM if feasible. Large-result retention policy with user-visible disk usage and cleanup.

---

## 18. TESTING AND EVIDENCE

Automated tests (unit, integration, and end-to-end where feasible) for: importers/exporters (round-trip), geometry validity, continuity checks, constraint solver (including over-/under-constrained cases), feature-history rebuild and undo/redo, collision detection (known-answer fixtures), project persistence and migrations, case generation (golden files), mesh-quality gating, solver run on the benchmark (marked slow/optional in CI, with a nightly or manual workflow), coefficient extraction (against synthetic known-force fields), comparison guard rules, and security tests (malformed/hostile files, path traversal in project packages).

CI runs the fast suite on every PR; the CFD benchmark runs where OpenFOAM is available and is otherwise reported `skipped`, never `passed`.

Deliverable docs (generated from actual state, not aspirational):
- `docs/AUTOVERSE_ENGINEERING_ARCHITECTURE.md`
- `docs/CAD_GEOMETRY_VALIDATION.md`
- `docs/AERODYNAMIC_ENGINE_REPORT.md`
- `docs/CFD_VALIDATION_REPORT.md`
- `docs/VEHICLE_DEVELOPMENT_WORKFLOW.md`
- `docs/FEASIBILITY.md`, `docs/DECISIONS.md`, `docs/KNOWN_LIMITATIONS.md`, `docs/OWNER_ACTIONS.md`

---

## 19. EXECUTION PHASES (strict order; each phase gated by its exit criteria)

0. Baseline, feasibility, feature matrix, fake-feature inventory.
1. Repository audit and failure analysis of existing vehicle geometry.
2. Architecture, ADRs, data model, schemas, conventions (units, axes, tolerances).
3. **Vertical slice:** Ahmed body end to end (geometry → case → mesh → solve → coefficients → UI), benchmarked and documented.
4. Geometry kernel integration and worker pipeline; import/export core.
5. Parametric vehicle modelling, feature history, undo/redo, constraint engine.
6. Component system and editor (attachment, compatibility, collisions).
7. Reference library and reconstruction workflow; fork/lineage.
8. Aerodynamic component library (splitter, diffuser, wing, skirts, ducts).
9. Simulation-ready geometry export and CFD-readiness checks.
10. Full CFD orchestration: meshing gates, BCs, monitoring, convergence, post-processing; DrivAer-style benchmark.
11. Aero visualization with provenance labelling.
12. Vehicle systems packaging and clearance validation.
13. Original Vehicle Development workflow and comparison mode with reports.
14. Dashboard/project integration; JSON/DB migration of existing data.
15. Performance, reliability, and security hardening.
16. Full test pass, documentation, final verification.

---

## 20. EXECUTION LOOP

1. Open `task.md`, pick the next unblocked task in phase order.
2. Read the existing code and docs for that area; never assume.
3. Implement the smallest change that fully solves the task.
4. Run the relevant checks and tests; capture output.
5. Review your diff: no dead scaffolding, no fake data, no secrets, claims match reality.
6. Fix defects; re-run.
7. Update `task.md`, `FEATURE_MATRIX.md`, `DECISIONS.md`; commit.
8. Continue. Don't stop at planning or reports.

Ask the owner only when a choice is irreversible, costs money, needs credentials, or has materially different outcomes between reasonable options (batch questions; keep working elsewhere meanwhile).

---

## 21. FINAL ACCEPTANCE CRITERIA (each item requires evidence in `task.md`)

- [ ] The Ahmed benchmark runs from a clean checkout and reproduces Cd within the documented tolerance of cited literature; the DrivAer-style benchmark result and its error are documented.
- [ ] No UI element shows simulated-for-show data as engineering data; every result displays a provenance tag.
- [ ] A reference vehicle can be inspected, forked into an independent project, and the original stays unmodified.
- [ ] Real body geometry can be edited (surface/mesh-level and parametric), with independent dimension control through the constraint engine.
- [ ] Components can be created, replaced, mirrored, attached, saved, and reused, with collision and clearance validation.
- [ ] Splitters, diffusers, and wings are parametric geometry that feed the CFD model.
- [ ] CFD-ready geometry is generated; mesh quality gating blocks invalid runs; a real OpenFOAM run converges (or is reported as not converged).
- [ ] Cd, Cl, balance, and component contributions are computed from actual solver forces with documented conventions.
- [ ] Original-vs-modified comparison runs under verified-equivalent conditions and reports uncertainty.
- [ ] Projects save, reopen, migrate, and back up without data loss; feature history rebuilds deterministically.
- [ ] STEP/STL/OBJ/GLB import/export works with documented limits; hostile-file tests pass.
- [ ] Engineering reports are reproducible from stored configs and hashes.
- [ ] All docs listed in §18 exist and reflect the real state; `KNOWN_LIMITATIONS.md` is honest.
- [ ] `OWNER_ACTIONS.md` lists every manual step (solver installation, licences, deployment, secrets, releases).

---

## 22. FINAL REPORT FORMAT

(1) What is complete and verified, with evidence pointers; (2) what is implemented but unverified and why; (3) what is stubbed behind a documented boundary; (4) benchmark results and errors; (5) blockers and owner actions; (6) known limitations and risks; (7) a suggested roadmap, labelled as suggestions, not results.

---

**FINAL DIRECTIVE:** Build the engineering foundation first, then the geometry engine, then the aerodynamic engine, then the integrated workflow. Prove the pipeline on a public benchmark before scaling to cars. Be honest about what is real, what is estimated, and what is only illustrative. A smaller platform whose every number can be trusted is better than a large one that only looks like engineering.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-11-18T18:16:29+05:30.

The user's current state is as follows:
Active Document: c:\Users\deeks\Downloads\cars\TASK.md (LANGUAGE_UNSPECIFIED)
Cursor is on line: 100
Other open documents:
- c:\Users\deeks\Downloads\cars\tests\cross-vehicle-similarity.test.ts (LANGUAGE_UNSPECIFIED)
- c:\WINDOWS\system32\npx (LANGUAGE_UNSPECIFIED)
- c:\Users\deeks\Downloads\cars\tests\qa-failure-paths.test.ts (LANGUAGE_UNSPECIFIED)
- c:\Users\deeks\Downloads\cars\scripts\verify-phase10-responsive.cjs (LANGUAGE_UNSPECIFIED)
- c:\Users\deeks\Downloads\cars\src\components\3d\MeasurementOverlay3D.tsx (LANGUAGE_UNSPECIFIED)
</ADDITIONAL_METADATA>