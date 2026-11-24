# AUTOVERSE 3D — VEHICLE GEOMETRY VALIDATION STANDARDS
## Dimensional Tolerances, Topology Rules & Provenance Verification Protocol

**Document**: `VEHICLE_GEOMETRY_VALIDATION.md`  
**Standard**: AAGE-STD-2026-V1  
**Applicability**: All vehicle 3D assets, procedural lofting templates, and imported CAD files  
**Date**: November 2026  

---

## 1. Engineering Dimensional Methodology

All vehicle geometry within AutoVerse 3D must align with the SAE J1100 standard coordinate system and international automotive engineering conventions.

### 1.1 Reference Coordinate System
The 3D space uses standard Three.js right-handed Cartesian coordinates in metric meters:
- **Lateral Axis ($X$)**: Width across vehicle. Positive $+X$ is Right; negative $-X$ is Left. Vehicle centerline is aligned strictly at $X = 0.000\text{ m}$.
- **Vertical Axis ($Y$)**: Height above ground. Positive $+Y$ is Upwards; $Y = 0.000\text{ m}$ is the tire contact ground plane.
- **Longitudinal Axis ($Z$)**: Length along vehicle. Positive $+Z$ is Rearward; negative $-Z$ is Forward. Vehicle center of wheelbase or mid-chassis is registered at $Z = 0.000\text{ m}$.

```
                 +Y (Up)
                  ^
                  |    -Z (Front)
                  |   /
                  |  /
                  | /
  -X (Left) <-----+-----> +X (Right)
                 /|
                / |
               /  |
      +Z (Rear)   v
                 Ground Plane (Y = 0)
```

### 1.2 Metric Dimensional Parameters

| Metric Symbol | Parameter Name | Engineering Definition | Measured Geometry Boundary |
| :--- | :--- | :--- | :--- |
| **$L$** | Overall Length | Distance between foremost and rearmost vehicle points | $Z_{\max} - Z_{\min}$ |
| **$W$** | Overall Width | Body width excluding side mirrors (unless specified) | $X_{\max} - X_{\min}$ |
| **$H$** | Overall Height | Vertical distance from ground plane ($Y=0$) to roof peak | $Y_{\max} - Y_{\min}$ (with $Y_{\min} \approx 0$) |
| **$WB$** | Wheelbase | Longitudinal distance between front and rear axle centers | $\|Z_{\text{wheel,rear}} - Z_{\text{wheel,front}}\|$ |
| **$TF$** | Front Track | Lateral distance between front tire centerlines | $\|X_{\text{wheel,FR}} - X_{\text{wheel,FL}}\|$ |
| **$TR$** | Rear Track | Lateral distance between rear tire centerlines | $\|X_{\text{wheel,RR}} - X_{\text{wheel,RL}}\|$ |
| **$GC$** | Ground Clearance | Lowest point of sprung chassis/diffuser above ground | $\min(Y_{\text{chassis}})$ above $Y = 0$ |

---

## 2. Accuracy Quality Classifications

AutoVerse 3D enforces four distinct accuracy tiers. No unverified asset may be upgraded to a higher classification without satisfying both provenance documentation and tolerance constraints.

```
+-------------------------------------------------------------------------------+
|                      AAGE ACCURACY CLASSIFICATION TIERS                       |
+-------------------------------------------------------------------------------+
|  CLASS A: VERIFIED OEM CAD               |  Tolerance: <= 0.5% error          |
|  Manufacturer-authorized engineering     |  Watertight manifold B-rep         |
+------------------------------------------+------------------------------------+
|  CLASS B: VERIFIED PRODUCTION MODEL      |  Tolerance: <= 3.5% error          |
|  Documented year, generation, hierarchy  |  Licensed high-poly mesh           |
+------------------------------------------+------------------------------------+
|  CLASS C: RECONSTRUCTED GEOMETRY         |  Tolerance: <= 5.0% error          |
|  Photogrammetry or laser 3D scan data    |  Physical vehicle reference        |
+------------------------------------------+------------------------------------+
|  CLASS D: APPROXIMATE / PROCEDURAL       |  Tolerance: > 5.0% error           |
|  Lofted hull or unverified mesh          |  MANDATORY RULE 6 WATERMARK        |
+-------------------------------------------------------------------------------+
```

### 2.1 Class A — Verified OEM CAD
- **Criteria**:
  - Source: Official manufacturer engineering CAD (CATIA, Siemens NX, STEP AP214/AP242) or authorized design studio asset.
  - Dimensional Error: $\le 0.5\%$ deviation from official OEM factory technical specifications across length, width, height, and wheelbase.
  - Topology: Watertight manifold surface; clean boundary loops; zero non-manifold edges.
  - Verification: Digital signature and manufacturer provenance audit logged.

### 2.2 Class B — Verified Production Model
- **Criteria**:
  - Source: Commercial or licensed high-fidelity 3D production model with verified provenance.
  - Documented Model Year and Generation code (e.g. BMW G80, Porsche 992, Nissan R34).
  - Dimensional Error: $\le 3.5\%$ deviation from OEM specifications.
  - Component Hierarchy: Distinctly separated exterior panels, wheel assemblies, and glass panes.

### 2.3 Class C — Reconstructed Geometry
- **Criteria**:
  - Source: Multi-view photogrammetry or laser LiDAR 3D scanning of an actual physical vehicle.
  - Dimensional Error: $\le 5.0\%$ deviation from OEM specifications.
  - Documentation: Calibration notes, physical vehicle registration or chassis reference.
  - Permitted Defects: Minor scan tessellation artifacts or isolated open boundaries allowed if overall envelope conforms.

### 2.4 Class D — Approximate / Procedural Geometry
- **Criteria**:
  - Source: Parametric lofter (`SurfaceLofter`), template archetype generator, or unverified community 3D asset.
  - Dimensional Error: $> 5.0\%$ deviation, or geometric features unverified against physical production blueprints.
  - **MANDATORY RULE 6 WATERMARK**:
    Every viewport render, exported file, screenshot overlay, and UI card MUST carry the explicit disclaimer:
    > **APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY**

---

## 3. Mesh Topology Validation Protocol

The `MeshTopologyAnalyzer` automatically evaluates 3D assets upon ingestion against the following quality rules:

### 3.1 Spatial Unit Detection & Normalization
Incoming CAD and polygonal models vary in unit systems. AutoVerse 3D normalizes all assets to meters ($m$):

$$\text{Scale Multiplier} = \begin{cases} 
0.001 & \text{if length } > 1500 \text{ (Millimeters)} \\
0.010 & \text{if length } \in [150, 1500] \text{ (Centimeters)} \\
0.0254 & \text{if length } \in [60, 150] \text{ (Inches)} \\
0.3048 & \text{if length } \in [5, 25] \text{ (Feet)} \\
1.000 & \text{if length } \in [1.5, 6.0] \text{ (Meters)}
\end{cases}$$

### 3.2 Manifold Edge Topology
- **Manifold Edge**: Shared by exactly two faces.
- **Boundary Edge**: Shared by exactly one face (valid on open convertible tops or window cutouts; flagged for Class A inspection).
- **Non-Manifold Edge**: Shared by $> 2$ faces or connected across divergent shells. Assets with $> 0$ non-manifold edges are rejected from Class A certification.

### 3.3 Degenerate Triangle Elimination
- Triangles with surface area $< 10^{-7}\text{ m}^2$ or collinear vertices are flagged as degenerate faces.
- Zero-area triangles cause division-by-zero artifacts during WebGL normal shading and shadow mapping.

### 3.4 Unit Normal Verification
- Every vertex normal vector $\vec{N} = (N_x, N_y, N_z)$ must satisfy:
  $$\left|\sqrt{N_x^2 + N_y^2 + N_z^2} - 1.0\right| < 10^{-4}$$
- Zero-length or unnormalized vectors are recomputed automatically using area-weighted adjacent face cross products.

---

## 4. Verified OEM Manufacturer Specifications Database

AutoVerse 3D includes a verified technical specifications registry (`vehicleAssetDatabase.ts`) for key production vehicles:

| Manufacturer | Model & Generation | Year | Length ($mm$) | Width ($mm$) | Height ($mm$) | Wheelbase ($mm$) | Front Track ($mm$) | Rear Track ($mm$) | Max Class |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BMW** | M3 Competition (G80) | 2021+ | 4794 | 1903 | 1433 | 2857 | 1617 | 1605 | Class A / B |
| **Porsche** | 911 GT3 (992) | 2022+ | 4573 | 1852 | 1279 | 2457 | 1601 | 1553 | Class A / B |
| **Audi** | R8 V10 Performance | 2020+ | 4429 | 1940 | 1236 | 2650 | 1638 | 1599 | Class A / B |
| **Lamborghini** | Huracán EVO | 2020+ | 4520 | 1933 | 1165 | 2620 | 1668 | 1620 | Class A / B |
| **Ferrari** | 812 Superfast | 2018+ | 4657 | 1971 | 1276 | 2720 | 1672 | 1645 | Class A / B |
| **Toyota** | Supra RZ (A80 / Mk4) | 1993–2002 | 4515 | 1810 | 1275 | 2550 | 1520 | 1525 | Class A / B |
| **Nissan** | Skyline GT-R V-Spec II (BNR34) | 1999–2002 | 4600 | 1785 | 1360 | 2665 | 1480 | 1490 | Class A / B |
| **Koenigsegg** | Jesko Absolut | 2021+ | 4845 | 2030 | 1210 | 2700 | 1698 | 1695 | Class A / B |

---

## 5. Automated Validation & Verification Procedures

### 5.1 Unit & Integration Testing
The test suite in `tests/authentic-geometry-engine.test.ts` executes the validation protocol across 18 specialized tests:
1. STEP CAD B-rep entity parsing and tessellation.
2. OBJ and STL raw stream loading and vertex decoding.
3. Spatial unit scale auto-detection ($mm \rightarrow m$).
4. Topology checks: non-manifold edge detection, boundary edge analysis, degenerate triangle detection.
5. Semantic component recognition across exterior bodywork, cockpit, and 4-quadrant road wheel assemblies.
6. Dimensional measurement calculation against OEM tolerance bands ($0.5\%, 3.5\%, 5.0\%$).
7. Provenance certification issuance and Rule 6 watermark enforcement.
8. Runtime GPU optimization (frustum culling, bounding spheres, resource disposal).

### 5.2 Manual Studio Verification Checklist
When a new 3D model is ingested into the Asset Manager:
1. Ingest asset via drag-and-drop or file selector.
2. Verify detected spatial unit is correctly converted to meters.
3. Check measured dimensions against vehicle blueprint in the live Dimensional Validation table.
4. Verify Quality Badge:
   - Green `Class A` / `Class B` confirms authentic geometry.
   - Amber `Class C` indicates scan reconstruction.
   - Yellow `Class D` confirms approximate geometry with active Rule 6 watermark banner.
5. Switch camera to Orthographic Front, Left, and Top views to inspect silhouette alignment.
6. Confirm component recognition separates hood, doors, glass, and wheels for customization shaders.

