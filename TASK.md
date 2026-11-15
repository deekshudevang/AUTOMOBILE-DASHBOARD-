# AUTOVERSE 3D — Enhanced Engineering Roadmap (`TASK.md`)

## Status Vocabulary Standard (Section 1.3)
- **Verified**: Implemented AND tested; evidence linked (test name, screenshot path, log, or measurement).
- **Implemented (untested)**: Code exists, no passing test yet. Never report as complete.
- **Blocked**: Cannot proceed; exact missing dependency named.
- **Not applicable**: Vehicle data does not support it; reason stated.
- **Failed**: Test fails; failure and next action recorded.

---

## Skill Preflight Declaration (Section 1.4)
- **UI/UX Pro Max Skill**: Preflight check executed. The skill is **NOT globally installed** in this environment. As required by Section 1.4, this absence is explicitly noted here, and the automotive design brief (minimalist luxury, deep graphite, electric cyan `#00F0FF`, WCAG 2.2 AA contrast, engineering monospace tabular metrics, and Unslop standards) is applied directly across all phases.

---

## Phase Checklist & Status Table

### Phase 0 — Preflight
- [x] **0.1 Node & Package Manager Verification**: Verified. Node v24.19.0, npm 11.4.1. Evidence: `docs/baseline/BASELINE_REPORT.md`.
- [x] **0.2 Git Branch & Baseline Tag**: Verified. Branch `feat/autoverse-configurator`, Tag `pre-configurator-baseline`. Evidence: `git branch`, `git tag`.
- [x] **0.3 Golden Fixture Set**: Verified. 109 legacy vehicle configurations copied into `tests/fixtures/vehicles/`. Evidence: `tests/fixtures/vehicles/`.
- [x] **0.4 Decision Log**: Verified. `docs/DECISIONS.md` created.
- [x] **0.5 Baseline Execution**: Verified. Build clean (6.68s), 102/102 tests passing, baseline screenshots stored in `docs/baseline/screenshots/`. Evidence: `docs/baseline/BASELINE_REPORT.md`.

### Phase 1 — Project Audit & Vehicle Capability Matrix
- [x] **1.1 Architectural & Dependency Audit**: Verified. Documented React 18, Vite 6, Three.js 0.174, loaders, and state pipeline in `docs/AUTOVERSE_UI_UX_AUDIT.md`.
- [x] **1.2 Individual Vehicle JSON Audit**: Verified. Audited all 210 vehicle definitions across Schema 2.0, Parametric 1.0, and Cherax Entity formats.
- [x] **1.3 Vehicle Capability Matrix**: Verified. Generated `docs/vehicle_capability_matrix.json` and capability table in `docs/AUTOVERSE_UI_UX_AUDIT.md` driving UI visibility.
- [x] **1.4 Performance & Bottlenecks Audit**: Verified. Measured draw calls (28-42), triangles (18.4k-32.8k), frame times (1.4ms-2.8ms), and memory in `docs/AUTOVERSE_UI_UX_AUDIT.md`.

### Phase 2 — Design System & Component Gallery
- [x] **2.1 Automotive Design System Tokens**: Verified. Token definition (graphite surfaces, cyan accents, WCAG 2.2 AA contrast, 4px spacing). Deliver `docs/design-system.md`.
- [x] **2.2 Design System Component Gallery**: Verified. Component gallery in `src/components/gallery/ComponentGalleryModal.tsx` showing active/hover/disabled/touch states.

### Phase 3 — Main Configurator Interface
- [ ] **3.1 Top Navigation Bar**: Pending. AUTOVERSE 3D logo, vehicle selector, editable config name, Save, Reset (with confirmation), Undo/Redo, Fullscreen, Settings.
- [ ] **3.2 Hero Central Viewport**: Pending. Damped OrbitControls, bounding-box-derived framing & camera presets (front, rear, side, top, 3/4, interior if exists), contact shadows, studio environment.
- [ ] **3.3 Capability-Driven Right Configuration Panel**: Pending. Categories appear ONLY if capability matrix indicates vehicle support; unsupported items collapsed with explanatory note.
- [ ] **3.4 Serializable Configuration & Command Pattern**: Pending. Single `VehicleConfiguration` source of truth; pure rendering function; coalescing slider drag commands.

### Phase 4 — Vehicle Customization
- [ ] **4.1 Exterior Components Engine**: Pending. Click-to-select, hierarchy list, highlight, per-component visibility/material/color, unmapped meshes listed cleanly.
- [ ] **4.2 Paint Studio**: Pending. Solid, metallic, pearl, matte, satin, gloss, carbon-fiber finishes; flake, roughness, clearcoat using `MeshPhysicalMaterial`.
- [ ] **4.3 Wheels, Tyres, Brakes & Rule-Based Validation**: Pending. Diameter +/-3% rule, width/offset fender clearance, arithmetic tire sizes, invalid combination blocking.
- [ ] **4.4 Interior Studio**: Pending. Mapped interior meshes (seats, dash, steering wheel, trims) rendered only where geometry exists.

### Phase 5 — Geometry Integrity & Invariants
- [ ] **5.1 Pristine Source Preservation**: Pending. No source geometry mutation; per-instance cloned materials; flawless Reset.
- [ ] **5.2 Geometry Validation on Load**: Pending. NaN/degenerate face check, missing normals, unit scaling, bounding box calculator.
- [ ] **5.3 Automated Invariants Test**: Pending. Pre/post configuration change comparison asserting wheelbase, track width, ground clearance, and bounding boxes.

### Phase 6 — Vehicle JSON Configuration Engine
- [ ] **6.1 Versioned Schema & Validation**: Pending. Schema validator (Zod/Ajv) returning exact JSON paths; corrupted-input protection.
- [ ] **6.2 Golden Fixture Compatibility Test**: Pending. Load all 109 golden fixtures with 100% pass rate.
- [ ] **6.3 Import/Export & Storage**: Pending. Round-trip export-then-import; per-vehicle isolated persistence; missing data as "Not specified". Deliver `docs/vehicle-schema.md`.

### Phase 7 — Interactions and Motion
- [ ] **7.1 Restrained Automotive Motion**: Pending. Camera easing, panel slides, selection outlines, smooth paint/material transitions.
- [ ] **7.2 Reduced-Motion Support**: Pending. Global `prefers-reduced-motion` detection and in-app toggle disabling camera tweens.

### Phase 8 — Presentation Modes
- [ ] **8.1 Studio Mode**: Pending. Dark studio, grounded shadows, minimal UI chrome.
- [ ] **8.2 Engineering Mode**: Pending. Hierarchy tree, triangle/mesh metrics, derived vs verified dimensions, 2-point 3D measurement tool, wireframe/normal inspector.
- [ ] **8.3 Showroom Mode**: Pending. Smooth auto-orbit, clean presentation lighting, pause on any interaction.
- [ ] **8.4 Comparison Mode**: Pending. Side-by-side / A/B slider of 2 configs of same vehicle with parameter diff table.

### Phase 9 — Performance & RTX Optimization
- [ ] **9.1 Performance Budgets & Profiling**: Pending. 60 fps desktop / 30 fps mobile, frame < 50ms, zero memory growth over 50 configuration cycles. Deliver `docs/performance.md`.
- [ ] **9.2 Dynamic Quality Tiers**: Pending. Low, Medium, High, and Auto tiers adapting DPR, shadows, and reflection resolution.

### Phase 10 — Responsive & Accessible Input
- [ ] **10.1 Responsive Breakpoints**: Pending. Ultrawide, desktop, laptop, tablet, and mobile with bottom-sheet drawer.
- [ ] **10.2 Touch & Keyboard Navigation**: Pending. 1-finger orbit, 2-finger pan/pinch, keyboard shortcuts, WCAG 2.2 AA focus rings, and ARIA announcements.

### Phase 11 — Quality Assurance & Test Matrix
- [ ] **11.1 Automated Full Test Suite**: Pending. Vitest & Playwright automation for startup, load, customization, export, and reset.
- [ ] **11.2 Failure Paths Testing**: Pending. Corrupted JSON, WebGL context loss/restore, storage quota, rapid vehicle switching. Deliver `docs/verification/`.

### Phase 12 — Final Audit and Reporting
- [ ] **12.1 Comprehensive UI/UX Audit Report**: Pending. Deliver `docs/AUTOVERSE_FINAL_UI_UX_REPORT.md` comparing against Phase 1 baseline.
- [ ] **12.2 Deliverables Verification**: Pending. Final signoff of all deliverables, clean git commits on `feat/autoverse-configurator`.
