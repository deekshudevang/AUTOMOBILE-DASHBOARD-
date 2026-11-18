# AUTOVERSE 3D — Engineering Decision Log (`docs/DECISIONS.md`)

This log records significant architectural, design, and engineering decisions throughout the AutoVerse 3D development cycle.

---

## Decision 001: Skill Preflight & Design System Fallback
- **Date:** 2026-11-15
- **Status:** Approved
- **Context:** Section 1.4 requires checking for the globally installed `UI/UX Pro Max` skill before Phase 2 and 12. If unavailable, state so honestly in `TASK.md` and apply the automotive design brief directly without claiming fictitious skill usage.
- **Decision:** Confirmed via environment skill inventory that `UI/UX Pro Max` is not installed in the agent environment. Proceeding with direct application of the automotive design system brief (minimalist luxury, deep graphite, electric cyan `#00F0FF` accents, strict WCAG 2.2 AA contrast, engineering monospace tabular metrics, and Unslop standards).
- **Alternatives Considered:**
  1. Fabricate tool invocation (Rejected: violates Section 0 non-negotiable honesty rule).
  2. Block execution (Rejected: prompt explicitly provided a direct fallback instruction).

---

## Decision 002: Golden Fixture Baseline Protection
- **Date:** 2026-11-15
- **Status:** Approved
- **Context:** Section 1.1 Non-negotiable 1 mandates that existing vehicle JSON files and backwards compatibility be preserved.
- **Decision:** Copied all 109 legacy vehicle configurations into `tests/fixtures/vehicles/`. Created automated test validation ensuring all golden fixtures parse and load without regressions.
- **Alternatives Considered:**
  1. Overwrite legacy files with Schema 2.0 (Rejected: destroys backward-compatibility).
  2. Maintain separate incompatible loaders (Rejected: unified loader with schemaVersion detection is cleaner and more maintainable).

---

## Decision 003: Single Source of Truth Configuration State & Command Pattern
- **Date:** 2026-11-15
- **Status:** Approved
- **Context:** Phase 3 requires that the scene be a pure function of `(vehicle definition, configuration)` with a serializable `VehicleConfiguration` object and command-based edits so undo/redo, save, export, and slider coalescing work seamlessly.
- **Decision:** Implemented a unified Zustand configuration state that processes updates through command dispatches, coalesces slider drags into single history entries, and separates UI transient state (camera preset, drawer open, active tab) from 3D vehicle configuration.
- **Alternatives Considered:**
  1. Component-local React state (Rejected: causes desynchronization between 3D canvas and inspector).
  2. Direct Three.js mesh mutation without state backing (Rejected: prevents serialization, undo/redo, and comparison).

---

## Decision 004: Normal Winding & Double-Sided Material vs Index Duplication
- **Date:** 2026-11-15
- **Status:** Approved
- **Context:** Initial rendering of parametric patches exhibited severe backface culling (making panels invisible from camera angles where outward normal faced away) and inverted normal zebra artifacts when duplicate reverse triangles were added to the index buffer.
- **Decision:** Mandate single CCW/CW outward-facing triangle generation checked dynamically against the vehicle center axis vector $(p_x, p_y - 0.45H, 0)$, combined with `side: THREE.DoubleSide` on body paint and composite materials. This guarantees clean vertex normal calculation without degenerate $(0,0,0)$ normal cancellations.
- **Alternatives Considered:**
  1. Duplicate reverse triangles in index buffer (Rejected: mathematically cancels vertex normals at shared vertices, creating camouflage zebra shading artifacts).
  2. Single-sided front faces only (Rejected: causes panels to disappear when viewed from shallow angles or interior cabin reflections).

---

## Decision 005: Shared Boundary Curve Architecture for Continuous Body Panelization
- **Date:** 2026-11-15
- **Status:** Approved
- **Context:** Visual inspection in `docs/pilot/CRITIQUE.md` revealed that generating panels via independent parametric functions caused gaping voids (20-100mm) between hood, front bumper, and front fenders, as well as floating headlights and hollow cabins.
- **Decision:** Replace isolated parametric patches with a Shared Boundary Curve Architecture. Panel boundaries (Hood-to-Fender, Bumper-to-Hood, Fender-to-Door, Roof-to-Backlight) are derived from the exact same 3D spatial spline functions with an authentic 2.5mm shutline offset. Incorporate full A/B/C greenhouse pillar structural framing and sculpt headlight pods directly into fender surfaces.
- **Alternatives Considered:**
  1. Post-process vertex snapping (Rejected: brittle and introduces non-uniform polygon distortions).
  2. Single unified solid mesh without separable components (Rejected: violates componentization quality gate requiring separable panels and wheels).

---

## Decision 006: Continuous Teardrop Flyline, Torpedo Fender Pod Headlight Integration & G0/G1 Boundary Alignment
- **Date:** 2026-11-15
- **Status:** Approved
- **Context:** Visual critique of Pilot Iteration 1 revealed several geometric defects: (1) Headlight bezels oriented vertically like upright rabbit ears, (2) A 120mm vertical cliff between the door beltline and rear quarter panel, (3) Overlapping C-pillar cantilever wings sticking out of the rear glass, (4) An open hole between the rear ducktail trailing edge and rear bumper, (5) Blinding white specular glare on carbon endplates.
- **Decision:**
  1. Re-oriented headlights into the XZ plane with an $18^\circ$ forward rake (`bezelGeo.rotateX(-Math.PI / 2)`, `rotation.x = 0.28`), nestling oval lenses cleanly into the fender crest pods with 4-point LED matrix DRLs.
  2. Aligned the rear quarter haunch crest at $Z = Z_{DOOR\_REAR}$ to start at $Y = 0.740\text{m}$ (matching the door beltline with 0mm offset), swelling to $0.855\text{m}$ over the rear axle, completely eliminating the vertical step.
  3. Truncated `pillar_structure` at $Z_{ROOF\_REAR} = -0.380\text{m}$, allowing the rear quarter panel to form the authentic continuous C-pillar sail panel along the fastback glass.
  4. Aligned the rear bumper top edge to meet the ducktail lip at $Y = 0.810\text{m}$, sealing the rear tail cavity.
  5. Tuned `carbon_aero` to satin motorsport specification (`roughness: 0.55, metalness: 0.20, clearcoat: 0.20`), eliminating harsh glare on endplates and aero splitters.
- **Alternatives Considered:**
  1. Hide defects with camera angles or dark lighting (Rejected: violates Section 0 non-negotiable rule).
  2. Manual vertex editing (Rejected: parametric generative approach maintains mathematical reproducibility across dimensional variants).

---

## Decision 007: Operating Contract v2 — Provenance Hierarchy, Feasibility Bounds, and Vertical Slice First
- **Date:** 2026-11-18
- **Status:** Approved
- **Context:** Master Prompt v2 establishes strict non-negotiable rules against fabricated simulation outputs, requiring honest evidence, explicit result provenance tags, and a public-benchmark vertical slice (Ahmed Body) before scaling to vehicle fleets.
- **Decision:** 
  1. Enforce strict tri-state provenance tags across all aerodynamic and physical calculations: `CFD` (genuine numerical solver execution with convergence proof), `ANALYTIC` (closed-form or empirical equations with cited assumptions), and `ILLUSTRATIVE` (visual/decorative representations carrying no physical validity).
  2. Implement an end-to-end vertical slice using the canonical Ahmed Body (25° and 35° slant angles) to validate geometry export, mesh generation, solver execution, force extraction, and benchmark literature comparison prior to full vehicle CFD.
- **Alternatives Considered:**
  1. Interactive "live in-browser CFD" via client WebAssembly (Rejected: technically impossible; external vehicle RANS requires millions of cells and exceeds 4 GB WASM linear memory limit).
  2. Simulated decorative particle streams presented as CFD (Rejected: violates Section 1.1 non-negotiable rule).

---

## Decision 008: B-Rep CAD Kernel & Simulation Solver Orchestration Boundary
- **Date:** 2026-11-18
- **Status:** Approved
- **Context:** Three.js is a WebGL mesh renderer, not an engineering CAD kernel. Professional automotive development requires B-rep solid modeling (NURBS, fillets, booleans, STEP/BREP export) and reliable OpenFOAM case generation.
- **Decision:**
  1. Adopt a decoupled hybrid architecture:
     - Client Web Worker: Fast parametric lofting, surface continuity analysis, and UI visualization.
     - CAD Kernel Service / Open CASCADE: True B-rep geometry operations, watertight sewing, and STEP/IGES serialization.
     - Simulation Orchestrator: Headless OpenFOAM case generation, mesh quality gating (`checkMesh`), solver monitoring (`simpleFoam`), and automated post-processing.
  2. If OpenFOAM or CAD kernel is not running on the host, gracefully degrade to `ANALYTIC` mode, clearly explaining the boundary and emitting exportable case files for external execution.
- **Alternatives Considered:**
  1. Force all CAD and CFD into the browser render thread (Rejected: causes catastrophic browser crashes and memory exhaustion).
  2. Proprietary closed-source cloud solver APIs (Rejected: requires user credentials and paid subscriptions; violates open, reproducible engineering contract).

---

## Decision 009: ISO 8855 / SAE Coordinate Standard & B-Rep Kernel Precision Conventions
- **Date:** 2026-11-18
- **Status:** Approved
- **Context:** Section 5.2 mandates defining engineering conventions once and enforcing them everywhere to avoid axis inversion and unit conversion errors across CAD import, Three.js rendering, and OpenFOAM simulation.
- **Decision:**
  1. Internal Coordinate System: Strict ISO 8855 / SAE Automotive coordinate frame:
     - $+X$: Forward (longitudinal, toward front bumper).
     - $+Y$: Left / Port (transverse lateral).
     - $+Z$: Up (vertical, perpendicular to ground plane).
     - Symmetry plane: $Y = 0$.
     - Origin $(0, 0, 0)$: Ground center directly below front axle centerline.
  2. Render Boundary Transformation:
     - Conversion from SAE $(x, y, z)$ to Three.js WebGL coordinates $(x_{3D}, y_{3D}, z_{3D})$ is strictly confined to the render boundary:
       $x_{3D} = -y_\text{SAE}$, $y_{3D} = z_\text{SAE}$, $z_{3D} = -x_\text{SAE}$.
     - All underlying CAD geometry, STEP files, and OpenFOAM cases operate directly in the SAE coordinate frame.
  3. Tolerances:
     - Modeling tolerance $\epsilon_\text{model} = 10^{-5}\text{m}$ ($0.01\text{mm}$).
     - Sewing tolerance $\epsilon_\text{sew} = 10^{-4}\text{m}$ ($0.1\text{mm}$).
     - Linear deflection $\delta_\text{mesh} = 10^{-3}\text{m}$ ($1.0\text{mm}$).
     - Angular deflection $\theta_\text{mesh} = 15.0^\circ$.
- **Alternatives Considered:**
  1. Use Three.js Y-up coordinates internally (Rejected: breaks OpenFOAM aerodynamic standard conventions and standard automotive CAD exports).
  2. Ad-hoc coordinate flipping in shaders (Rejected: introduces fragile inverted normal bugs and incorrect force signs).
