# AutoVerse 3D — Engineering Root Cause Diagnosis (Phase 0)

Date: 2026-11-15  
Status: Retraction and Root Cause Analysis of Previous Engine Output  
Author: Senior Automotive CAD & Computational Geometry Engineer  

---

## 1. Trace: Is the v2 Engine Actually Rendering in the Viewport?

### Root Cause Analysis & Code Path Trace:
**Finding: THE V2 GEOMETRY ENGINE (`src/geometry/engine.ts`) WAS NOT WIRED INTO `VehicleRenderer.tsx`.**

Tracing the execution flow from vehicle selection to the viewport scene:
1. User selects vehicle (e.g. `porsche_911_gt3_rs_992_2022.json` or `supercars/ferrari_488_pista.json`) via `useVehicleStore.loadVehicleByFile(fileName)` in `src/hooks/useVehicleStore.ts`.
2. The JSON payload is stored in `activeConfig.parametricSpec` or `activeConfig`.
3. `src/components/3d/VehicleRenderer.tsx` evaluates its `useMemo` hooks:
   - **Line 64–74**: Checks `rawSpec?.schemaVersion === '2.0'`. If true (e.g. `ferrari_488_pista.json` and `lamborghini_aventador_svj.json`), it delegates to `EditableVehicleAssembler.build(rawSpec as VehicleSchema2, ...)` from `@autoverse/vehicle-generation-engine`.
   - **Line 86–95**: If false (e.g. `porsche_911_gt3_rs_992_2022.json` which has `$schema` and `schema_version: "1.0.0"`), it falls through to `ParametricGeometryBuilder.build(spec, ...)` from `@autoverse/vehicle-generation-engine`.
   - **Line 98–111**: Fallback procedural chassis generator.
4. **Primary Bug Identified**:
   `src/geometry/engine.ts` (`VehicleGeometryEngine`) and `src/geometry/migration/schemaV2Migrator.ts` were only invoked in `tests/geometry-engine-v2.test.ts` and `tools/evaluate-pilots.ts`. `VehicleRenderer.tsx` never imported or called `src/geometry/engine.ts`.
   Consequently, the viewport continued to render either `EditableVehicleAssembler` (which generated box slabs) or `ParametricGeometryBuilder` (which generated floating window quads and detached license plates).
   Furthermore, the badge displayed `CLASS D: APPROXIMATE TEMPLATE (Parametric Template)` because `StudioView.tsx` read `binding?.qualityClass` which defaulted to `CLASS_D_APPROXIMATE` instead of reading the active geometry fidelity tier.

---

## 2. Why Did Triangle Count Equal Exactly 10,036 for Every Car?

### Root Cause Analysis:
In `src/geometry/engine.ts` and `tools/evaluate-pilots.ts`, `VehicleGeometryEngine.loadVehicle()` delegates component generation to `PanelCutter.buildComponentAssembly()` (`src/geometry/panelization/panelCutter.ts`).

In `panelCutter.ts`:
- Every panel was constructed using hardcoded primitive constructors:
  - 14 separate `new THREE.BoxGeometry(...)` meshes (12 triangles each) = 168 triangles
  - 4 `THREE.CylinderGeometry(...)` (32 segments) = ~128 triangles
  - 4 corner wheel assemblies (`WheelAssemblyGenerator.buildCornerAssembly`):
    - Revolved tyre lathe: 32 segments × 10 rings × 2 = 640 triangles
    - Rim barrel cylinder: 32 segments × 2 = 64 triangles
    - Hub, nut, spokes: ~500 triangles
    - Brake rotor cylinder: 32 segments = ~64 triangles
    - Caliper box: 12 triangles
    - Total per wheel: 2,467 triangles × 4 wheels = 9,868 triangles
- Total vehicle triangle count: 9,868 (wheels) + 168 (box panels) = **exactly 10,036 triangles**.
- The cross-section stations in the vehicle definitions were never lofted into the panels. The code took $(L, W, H, WB)$ and scaled identical box geometry. Thus, every vehicle produced the exact same 10,036 triangle count regardless of make, model, or silhouette.

---

## 3. Why Do Body Panels Look Like Boxes?

### Root Cause Analysis:
In `packages/vehicle-generation-engine/src/geometry/editableVehicleAssembler.ts`:
- **Lines 775–789 (`buildBodyPanelComponent`)**:
  ```ts
  private static buildBodyPanelComponent(id: string, width: number, height: number, length: number, material: THREE.Material): THREE.Mesh {
    const geo = new THREE.BoxGeometry(width, height, length);
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, material);
  }
  ```
- In `src/geometry/panelization/panelCutter.ts`:
  - `hoodGeo`: `new THREE.BoxGeometry(hoodW, 0.03, hoodL)` (Line 79)
  - `fBumperGeo`: `new THREE.BoxGeometry(W * 0.94, H * 0.44, 0.22)` (Line 86)
  - `doorGeo`: `new THREE.BoxGeometry(doorW, doorH, doorL - shutLineGapM * 2)` (Line 125)
  - `fenderFrontGeo`: `new THREE.BoxGeometry(0.12, H * 0.54, WB * 0.45)` (Line 136)
  - `rearFenderGeo`: `new THREE.BoxGeometry(0.15, H * 0.58, WB * 0.52)` (Line 146)
  - `roofGeo`: `new THREE.BoxGeometry(roofW, 0.03, roofL)` (Line 101)
  - `rearDeckGeo`: `new THREE.BoxGeometry(W * 0.76, 0.03, WB * 0.42)` (Line 156)
  - `rBumperGeo`: `new THREE.BoxGeometry(W * 0.94, H * 0.46, 0.24)` (Line 161)
- **Conclusion**: Panels were literal axis-aligned rectangular box primitives positioned around the car. There was no surfacing, no curvature, no tumblehome, no shoulder contour, and no wheel arch cutout.

---

## 4. What Are the Floating Slabs in the Porsche 911 GT3 RS Viewport?

### Root Cause Analysis & Mesh Identification (Image 3):
In `packages/vehicle-generation-engine/src/geometry/parametricGeometryBuilder.ts`:
1. **Floating Side Glass Blades**:
   - Component IDs: `glass_side_window_left_0`, `glass_side_window_left_1`, `glass_side_window_left_2`, `glass_side_window_right_0`, etc.
   - Lines 478–508: Extrudes a 2D quad in the XY plane, then rotates it around Y by $\pm \pi / 2$. Because the extrusion origin was not centered and lacked tumblehome curvature, the windows projected outwards as hovering vertical black blades completely detached from the roof and beltline.
2. **Floating Hood Aero Ducts**:
   - Component IDs: `aero_hood_vent_left`, `aero_hood_vent_right`
   - Lines 714–722: Created as `new THREE.BoxGeometry(0.16, 0.02, 0.36)` tilted at $-0.28\text{ rad}$ at $(x=\pm 0.24, y=hoodY + 0.01, z=hoodZ)$. They hovered in mid-air above the curved hood surface.
3. **Floating Fender Louvres**:
   - Component IDs: `aero_fender_louvres_left`, `aero_fender_louvres_right`
   - Lines 725–740: Stacks of box slats floating above the front fender curvature.
4. **Floating License Plate**:
   - Component: `LicensePlate3D` in `src/components/3d/VehicleRenderer.tsx` lines 188–198.
   - Position hardcoded to `position={[0, frontPlateY, frontPlateZ]}` where `frontPlateZ = sortedSecs[0].z_m + 0.02`. It hovered in empty space in front of the vehicle with zero bumper recess or mounting bracket.

---

## 5. Why Are Wheels Hidden or Wrong?

### Root Cause Analysis:
1. **Ferrari 488 Pista & Lamborghini Aventador SVJ (Images 1 & 2)**:
   - `EditableVehicleAssembler` generated box fenders (`fender_front_l/r`, `quarter_panel_l/r`) as solid rectangular blocks without wheel arch cutouts.
   - Because the box fenders had depth $(0.12\text{ m} - 0.15\text{ m})$ and were placed directly at $x = \pm halfW$, they intersected and completely enclosed the wheel assemblies.
2. **Porsche 911 GT3 RS (Image 3)**:
   - Wheel center $Y$ position was decoupled from the parametric tyre radius.
   - Arch cutout in the lofted monocoque did not follow the wheel center $Z$ position, causing the tyre to be uncentered inside the arch and creating an unnatural ride height gap.

---

## 6. Why Is Shading Flat and Very Dark?

### Root Cause Analysis:
1. **Normals**:
   - `THREE.BoxGeometry.computeVertexNormals()` creates face normals with hard $90^\circ$ breaks between faces.
   - The lofted monocoque lacked proper smooth normal averaging across the centerline seams.
2. **Material Setup**:
   - Default materials in `PbrMaterialFactory` had `roughness: 0.18, metalness: 0.35` without a loaded HDR environment map in headless puppeteer tests, causing standard PBR shaders to reflect empty black backgrounds.
   - Missing tone mapping calibration (`ACESFilmicToneMapping`) and directional fill lighting caused faces angled away from the single key light to fall below the readability floor.

---

## 7. Why Did the Previous Quality Gates Pass?

### Root Cause Analysis of Flawed Quality Gates:
In `src/geometry/validation/qualityGates.ts`:
1. **`overallDimensions`**: Computed `new THREE.Box3().setFromObject(vehicleGroup)`. A stack of rectangular boxes with length $L$, width $W$, and height $H$ matches bounding box dimensions with 0 mm delta!
2. **`groundContact`**: Checked `box.min.y <= 0.0025`. Because the lowest wheel cylinder touched $y=0$, it passed.
3. **`symmetry`**: Checked $|box.max.x| - |box.min.x| \le 0.001$. Symmetrically placed boxes pass this check trivially.
4. **`noFloatingGeometry`**: Checked if `child.userData.parentId` matched another registered `componentId`. Because box panels had parent IDs assigned in code, the gate passed without testing spatial connectivity or surface contact.
5. **`manifoldBody`**: Only checked if vertex coordinates were `isNaN`. A box geometry has valid floats, so it passed.
6. **`componentization`**: Checked if `componentCount >= 18`. Having 33 box meshes passed.
7. **`triangleBudget`**: Checked if triangle count was between 10,000 and 150,000. 10,036 fell within the range.

**Conclusion**: The quality gates tested purely abstract bounding box metadata rather than actual surface curvature, panel continuity, non-primitive geometry, wheel occlusion, or silhouette faithfulness.

---

## Corrective Action Plan (Phases 1–5):
1. **Phase 1**: Implement comprehensive, strict, append-only quality gates (non-primitive verification, curvature measurement, edge-angle continuity, connectivity contact graph, wheel visibility via orthographic rendering, and silhouette plausibility). Run baseline failures test.
2. **Phase 2**: Wire the v2 geometry engine directly into `VehicleRenderer.tsx` and expose live debug diagnostics in the Engineering Overlay.
3. **Phase 3**: Rebuild the body geometry properly:
   - Continuous Catmull-Rom B-spline lofter driven by 40–80 station curves.
   - Parametric panel cutting with real shut-line gaps and circular wheel arch cutouts.
   - Anchored aerodynamic appendages (swan-neck wing, splitter, diffuser) with surface-sampled contact points.
   - Focused entirely on the **Porsche 911 GT3 RS (992)** first.
4. **Phase 4**: Automotive PBR shading with smooth normals, clearcoat paint, and balanced studio lighting.
5. **Phase 5**: Standardized 8-angle visual capture, per-image visual critique in `docs/pilot/CRITIQUE.md`, and presentation to user.

