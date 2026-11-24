# AutoVerse — Geometry Standard & Coordinate Conventions (`GEOMETRY_STANDARD.md`)

This standard defines all geometric representations, tolerances, and conventions used across CAD, meshing, and rendering engines.

---

## 1. Coordinate Standard (ISO 8855 / SAE J670)

AutoVerse adopts the **ISO 8855 / SAE right-handed vehicle dynamics coordinate system**:
- **$+X$**: Vehicle forward travel direction (longitudinal axis).
- **$+Y$**: Vehicle left / port side (lateral axis).
- **$+Z$**: Upwards perpendicular to road plane (vertical axis).
- **Origin $(0, 0, 0)$**: Front axle center projected onto ground plane, or wheelbase center on ground.
- **Symmetry Plane**: $Y = 0$.

---

## 2. Tolerance Policy

| Parameter | Symbol | Value | Automotive Standard / Purpose |
| :--- | :--- | :--- | :--- |
| **Model Precision** | $\epsilon_\text{model}$ | $10^{-5}\text{ m}$ ($0.01\text{mm}$) | Coincident vertex tolerance in B-rep operations. |
| **Sewing Tolerance** | $\epsilon_\text{sew}$ | $10^{-4}\text{ m}$ ($0.1\text{mm}$) | Maximum gap permitted across adjacent surface patches. |
| **Minimum Feature Size** | $\delta_\text{min}$ | $10^{-3}\text{ m}$ ($1.0\text{mm}$) | Minimum edge length allowed into CFD volume meshing. |
| **Crease Angle Threshold**| $\theta_\text{crease}$ | $15.0^\circ$ | Boundary between smooth Class-A lofting and declared crease lines. |

---

## 3. Surface Continuity Criteria

- **G0 (Position):** Gap between adjacent boundary curves $\le \epsilon_\text{sew}$.
- **G1 (Tangent):** Normal deviation across boundary $\le 0.5^\circ$ for smooth panels.
- **G2 (Curvature):** Curvature radius change across seam continuous without abrupt kinks. Verified via interactive Zebra stripe reflection analysis.
