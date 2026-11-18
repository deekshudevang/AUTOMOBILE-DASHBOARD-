# AutoVerse — Component System Architecture (`COMPONENT_SYSTEM.md`)

AutoVerse models vehicles as hierarchical trees of separable, identifiable components with explicit attachment anchors, geometric boundaries, mass estimates, and editability modes.

---

## 1. Component Categories

1. **Exterior Bodywork**: Main monocoque body shell, bonnet/hood, front bumper, rear bumper, front fenders, rear quarter panels, doors, roof, trunk lid/deck, side skirts, mirrors, front splitter, rear diffuser.
2. **Glazing**: Windscreen, side door glass, rear window, roof quarter glass.
3. **Lighting**: Left and right headlights, DRLs, turn indicators, taillight clusters, center high-mounted stop light (CHMSL).
4. **Wheels, Tyres & Brakes**:
   - Four distinct positions: `wheel_fl`, `wheel_fr`, `wheel_rl`, `wheel_rr`.
   - Sub-assemblies: alloy rim, tire, brake rotor, brake caliper, hub spindle.
5. **Chassis & Suspension**:
   - Monocoque hardpoints, front subframe, rear subframe.
   - Upper and lower control arms, damper/strut assemblies, tie rods, anti-roll bars.
6. **Powertrain & Thermal Packaging**:
   - Engine block / electric drive unit envelope, transmission, differential, exhaust routing.
   - Radiators, heat exchangers (porous Darcy-Forchheimer medium).
7. **Aerodynamics**:
   - Active/passive front splitter, bumper canards, side skirts, flat floor underbody, rear diffuser strakes, rear wing element, swan-neck uprights, endplates, Gurney flaps.

---

## 2. Component Editability Classification (§7)

Every component explicitly declares its editability mode:

| Classification | Meaning & Engineering Capabilities | Permitted Modifications |
| :--- | :--- | :--- |
| **`PARAMETRIC`** | Driven by a validated mathematical feature model or B-rep definition. | Direct numeric parameter adjustment (span, chord, angle, thickness, radius). Authoritative geometry regenerates via CAD engine. |
| **`MESH_EDITABLE`** | Backed by a validated surface mesh supporting certified transforms. | Transform offsets, rotation angles, mirroring across $Y=0$, and mesh smoothing. |
| **`VIEW_ONLY`** | Geometry is locked or reference-only. | Selection, inspection, visibility toggling, and material binding. Geometry cannot be deformed. |

---

## 3. Attachment Points & Hierarchy Resolution

- Each child component references a `parentId` and named `parentAnchorName`.
- The component manager (`src/geometry/components/componentManager.ts`) builds the hierarchy tree and performs cycle detection using Depth-First Search (DFS) across all nodes.
- When an upstream component moves or is adjusted, downstream children recalculate their world position using relative anchor transforms.
