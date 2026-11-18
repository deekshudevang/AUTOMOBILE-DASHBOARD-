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
