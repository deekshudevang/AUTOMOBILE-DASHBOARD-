# AutoVerse 3D — Vehicle Model Defects & Geometric Disconnect Registry

**Date:** November 23, 2026  
**Status:** ACTIVE DEFECT REGISTRY & TRIAGE  
**Repository:** `deekshudevang/AUTOMOBILE-DASHBOARD-`  
**Working Branch:** `feat/car-studio-overhaul`  

---

## 1. Defect Classification System

- **SEV-1 (Critical / Architecture Break):** Core functional disconnect where user actions have zero effect in the 3D viewport, or assets fail to load.
- **SEV-2 (High / Visual Misrepresentation):** Vehicles look generic, boxy, or do not reflect their iconic real-world silhouette; components clip or float.
- **SEV-3 (Medium / Missing Feature / Inconsistency):** Component naming mismatch, incomplete controls, or lack of fitment adaptation.
- **SEV-4 (Low / Polish):** Missing tooltip, minor PBR material sheen mismatch, or cosmetic badge alignment.

---

## 2. Global Architectural Defects (SEV-1 & SEV-2)

### Defect G-01: The "Phantom GLB Asset" Disconnect
- **Severity:** SEV-1 (Critical)
- **Files Affected:** `public/vehicle-assets/manifest.json`, `src/components/3d/VehicleRenderer.tsx`
- **Symptom:** Manifest promises binary `.glb` files for 50 cars, but `public/vehicle-assets/cars/` is completely empty.
- **Impact:** System silently falls back to procedural geometry. If a developer expects GLB model-level realism, they find only procedural Three.js buffers.
- **Root Cause:** External 3D CAD/GLTF assets were never committed or generated into `public/vehicle-assets/cars/`.
- **Fix:** Acknowledge procedural pipeline as primary ground truth, generate watertight multi-part procedural geometry for all Schema 2.0 models, and remove phantom fallback warnings.

### Defect G-02: V2 Geometry Engine Override Ingestion Bypass
- **Severity:** SEV-1 (Critical)
- **Files Affected:** `src/components/3d/VehicleRenderer.tsx` (Lines 87–195)
- **Symptom:** When `useGeometryEngineV2 = true` (default in Car Studio), modifying component position offsets (X, Y), rotations, scales, or swapping parts in `CustomizationPanel.tsx` **DOES NOTHING** to the rendered 3D car. Only `color` and `visible` flags are applied.
- **Root Cause:** In `VehicleRenderer.tsx`:
  ```typescript
  // Lines 113-125
  const comp = v2Result.components.get(compId);
  if (comp) {
    comp.group.visible = override.visible !== false;
    // Position, rotation, scale, replacement mesh from override ARE COMPLETELY IGNORED!
  }
  ```
- **Fix:** Explicitly extract `override.position`, `override.rotation`, `override.scale`, and `override.replacementMesh` / `donorComponentId`, and apply matrix transformations or swap child meshes on `comp.group`.

### Defect G-03: Component ID Naming Schism (Schema 2.0 vs. V2 Engine)
- **Severity:** SEV-2 (High)
- **Files Affected:** `src/components/customizer/CustomizationPanel.tsx`, `src/types/vehicle.ts`, `packages/vehicle-generation-engine`
- **Symptom:** Component IDs in the UI do not match component IDs in the 3D engine:
  - UI / Schema 2.0 uses: `front_left_fender`, `wheel_front_left`, `rear_bumper`, `taillights_bar`, `seats_assembly`
  - V2 Engine uses: `fender_front_l`, `wheel_fl`, `bumper_rear`, `taillight_l`, `interior`
- **Impact:** Overrides applied to `front_left_fender` in `CustomizationPanel` fail `v2Result.components.get('front_left_fender')` lookup, resulting in silent failure.
- **Fix:** Introduce a bi-directional canonical mapping dictionary `CANONICAL_COMPONENT_MAP` that maps both naming conventions seamlessly.

---

## 3. Visual & Geometric Defects by Vehicle Family

### 3.1 Lamborghini Aventador SVJ (`lamborghini_aventador_svj`)
| Defect ID | Description | Severity | Screenshot / Visual Evidence | Corrective Action |
|---|---|---|---|---|
| **L-01** | **Boxy Front Bumper & Missing Hexagonal Intakes** | SEV-2 | Front view displays flat extrusion rather than sharp Y-shaped wedge nose with ALA 2.0 active flaps. | Implement bespoke Y-profile polygonal nose cone with deep hexagonal lower intakes. |
| **L-02** | **Oversized Rectangular Rear Wing** | SEV-2 | Rear wing displays generic extruded slab instead of curved central-pylon ALA swan-neck wing. | Replace with genuine dual-fin swan-neck airfoil with central pylon airflow channel. |
| **L-03** | **Cylindrical Wheel Facets** | SEV-2 | Wheels render as plain grey cylinders with no directional Leirion Y-spoke geometry. | Generate radial 10-spoke Y-pattern geometry with concave dish and center-lock nut. |
| **L-04** | **Missing Greenhouse Tumblehome** | SEV-2 | Side windows are vertical rather than heavily slanted 45° inward toward roof centerline. | Adjust greenhouse loft curves with authentic narrow cockpit taper. |

### 3.2 Ferrari 488 Pista (`ferrari_488_pista`)
| Defect ID | Description | Severity | Screenshot / Visual Evidence | Corrective Action |
|---|---|---|---|---|
| **F-01** | **Missing S-Duct Hood Channel** | SEV-2 | Front hood is flat; missing the iconic patented aerodynamic S-Duct that routes air from front bumper through the hood. | Model negative depression cavity in hood center with contrasting carbon flow ramp. |
| **F-02** | **Blown Rear Spoiler Clipping** | SEV-2 | Rear deck spoiler is rendered as a disconnected floating horizontal slab that clips through taillights. | Integrate blown spoiler into rear quarter fenders with continuous trailing edge loft. |
| **F-03** | **Wheel Arch Clearance & Track Width** | SEV-3 | Wheels are recessed 60mm inside the fenders, giving the car a sunken, un-athletic stance. | Correct wheel offset to flush track width (Front ET40, Rear ET38.5). |
| **F-04** | **Exhaust Placement Height** | SEV-3 | Dual exhaust pipes render at ground level instead of high-mounted mid-bumper flanking the license plate. | Relocate exhaust geometry to Y=+0.42m above diffuser plane. |

### 3.3 Porsche 911 GT3 RS (`porsche_911_gt3_rs`)
| Defect ID | Description | Severity | Screenshot / Visual Evidence | Corrective Action |
|---|---|---|---|---|
| **P-01** | **Swan-Neck DRS Wing Proportion & Height** | SEV-2 | Wing is mounted too low and lacks upper swan-neck mounts; DRS hydraulic actuator is missing. | Construct true roof-height swan-neck dual brackets with adjustable main plane and DRS flap. |
| **P-02** | **Front Fender Air Outlet Louvers Missing** | SEV-2 | Front fenders are smooth; missing the signature motorsport louvers and rear wheel cutout blades. | Generate 5-slat carbon louver array on top fender crest + cutaway aerodynamic relief behind tire. |
| **P-03** | **Round Headlight Bezel Flattening** | SEV-3 | Headlights look like flat oval decals rather than recessed dual-projector matrix LED clusters. | Model spherical glass outer lenses with internal quad-LED daytime running light points. |
| **P-04** | **Rear Bumper Underbody Tunnels** | SEV-3 | Rear diffuser lacks vertical aerodynamic strakes and diffuser flow expansion angle. | Extrude 4 deep vertical Venturi strakes extending 300mm under the rear axle. |

### 3.4 JDM Legends (Nissan GT-R R35, Mazda RX-7 FD3S, Toyota Supra A90)
| Defect ID | Description | Severity | Visual Evidence & Cause | Corrective Action |
|---|---|---|---|---|
| **J-01** | **Generic Box Silhouette** | SEV-2 | In Schema 2.0 fallback, RX-7 curves are flattened into generic angular boxes. | Re-parameterize RX-7 FD3S with smooth organic radius curves (fillet radius R > 80mm). |
| **J-02** | **Four-Lug Wheel Hub False Representation** | SEV-3 | Wheels render with 4-lug nuts on cars specified with 5x114.3mm bolt pattern. | Parametrically generate 5 lug nut recesses for 5-lug PCDs, 4 for 4-lug, single center nut for CL. |

---

## 4. Cross-Car Part Swapping Defect Registry

### Defect CS-01: Zero Donor Part Linking Mechanism
- **Severity:** SEV-1 (Critical)
- **Status:** Unimplemented
- **Description:** No data structure or service exists to load component $C_k$ from Donor Car $B$ and graft it onto Target Car $A$.
- **Correction:** Implement `CrossCarPartSwapper` service with:
  1. Component extraction from donor vehicle definition.
  2. Bounding box ratio calculation:
     $$S_{adapt} = \left(\frac{W_{target}}{W_{donor}}, \frac{H_{target}}{H_{donor}}, \frac{L_{target}}{L_{donor}}\right)$$
  3. Physical anchor coordinate mapping:
     $$P_{target} = P_{target\_anchor} + (P_{donor} - P_{donor\_anchor})$$
  4. Automatic fitment badge classification (`DIRECT_FIT`, `ADAPTABLE`, `INCOMPATIBLE`).

### Defect CS-02: Missing Wheel Hub Compatibility Checking
- **Severity:** SEV-1 (Critical)
- **Status:** Unimplemented
- **Description:** A user could attempt to install an 84mm Center-Lock Porsche GT3 RS wheel on a 5-lug Ferrari 488 without any compatibility check or adapter kit warning.
- **Correction:** Implement kinematic hub rule engine checking:
  - Center-Lock to Center-Lock: `DIRECT_FIT`
  - 5x114.3 to 5x114.3: `DIRECT_FIT`
  - 5x112 to 5x114.3: `ADAPTABLE` (Wobble bolts / conversion spacer)
  - 5-Lug to Center-Lock: `ADAPTABLE` with Center-Lock Hub Conversion Kit (+25mm track width offset)
  - 4-Lug to Center-Lock: `INCOMPATIBLE` (Structural stress limits exceeded)

---

## 5. UI & Interactivity Defect Registry

### Defect UI-01: Slider Axes Truncated to 2 Dimensions
- **Severity:** SEV-2 (High)
- **Files Affected:** `src/components/customizer/CustomizationPanel.tsx` (Lines 370–420)
- **Description:** The position controls only offer Offset X and Offset Y. Automotive components exist in 3D space: Depth / Longitude (Z) is critical for wings, splitters, diffusers, and wheels.
- **Correction:** Add Position Z, Rotation X (Pitch), Rotation Y (Yaw), Rotation Z (Roll), and Scale (Uniform & Non-Uniform).

### Defect UI-02: Component Gallery is a Dummy Design-System Showcase
- **Severity:** SEV-2 (High)
- **Files Affected:** `src/components/gallery/ComponentGalleryModal.tsx`
- **Description:** Opening the component gallery shows mock badge and button variants rather than actual vehicle components available for installation.
- **Correction:** Completely replace with `GlobalPartsLibraryModal.tsx` featuring real-time category filters, donor car selectors, live fitment status, and 1-click installation.
