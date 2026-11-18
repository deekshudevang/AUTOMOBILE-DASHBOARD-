# AutoVerse 3D v2 — Known Limitations & Technical Boundaries

In strict adherence to the **Truth Contract** (§1.1), this document records known technical boundaries, simplifications, and external dependencies of AutoVerse 3D v2.

---

## 1. Computational Fluid Dynamics (CFD)

1. **In-Browser RANS Simulation Impossibility**:
   - As documented in `docs/FEASIBILITY.md`, running 3D external vehicle RANS inside a web browser is technically impossible due to the 4 GB WebAssembly 32-bit linear memory ceiling, single-threaded execution limitations, and computational cell requirements ($2\text{M} - 15\text{M}$ cells).
   - In-browser aerodynamic exploration relies on analytical thin-airfoil models and empirical correlations, explicitly tagged `[ANALYTIC]`.
2. **OpenFOAM Host Decoupling**:
   - Native Windows systems do not include `simpleFoam` on PATH. OpenFOAM execution requires Docker or WSL 2 Ubuntu as documented in `docs/OWNER_ACTIONS.md`.
   - When the host solver daemon is offline, the platform exports complete, syntactically valid OpenFOAM case directories and falls back to verified analytical estimates without faking results.
3. **Steady-State Incompressible Assumption**:
   - The primary CFD pipeline defaults to steady incompressible RANS (`simpleFoam`). High-yaw crosswinds, transient vortex shedding, and compressibility effects (Mach $> 0.3$) are not modeled.

---

## 2. Geometry & CAD Kernel

1. **Mesh-to-CAD Reconstruction**:
   - Converting arbitrary scanned vehicle point clouds or triangular meshes into clean, editable Class-A NURBS surfaces remains an unsolved problem in computational geometry.
   - AutoVerse 3D implements template-based parametric reconstruction and continuous spline lofts; it does not claim automated reverse-engineering of arbitrary external meshes into CAD solids.
2. **STEP AP214 Faceted B-Rep**:
   - Exported STEP files represent faceted boundary representations (`MANIFOLD_SOLID_BREP`). Pure analytic NURBS curves (B-spline surface patches) in STEP format require full server-side OpenCASCADE compilation.
3. **Topological Naming Instability**:
   - Direct parametric editing of underlying sketches can cause face/edge re-indexing. AutoVerse 3D mitigates this by referencing stable named semantic anchors (`semanticAnchors.ts`) rather than raw face indices.

---

## 3. Structural, Packaging & Thermal Validity

1. **Non-Structural Packaging Disclaimer**:
   - Collision detection and suspension clearance sweeps evaluate geometric envelopes only.
   - Passing packaging checks does **not** validate structural crashworthiness, chassis torsional rigidity, fatigue life, or suspension dynamic load capacity.
2. **Porous Medium Radiator Model**:
   - The heat-exchanger model uses standard 1D Darcy-Forchheimer pressure drops. It does not solve coupled 3D conjugate heat transfer (CHT) or engine thermal balance.

---

## 4. Legal & Trademark Nominative Fair Use

1. **Unaffiliated Nominative Identification**:
   - Manufacturer and model names (e.g. "Porsche", "Ferrari", "Lamborghini", "BMW") are used exclusively for nominative reference identification of real-world production vehicles.
   - AutoVerse 3D is not endorsed by, sponsored by, or affiliated with any automotive manufacturer.
2. **No Proprietary OEM CAD Scraped**:
   - All vehicle models in AutoVerse 3D are generated from original parametric loft algorithms and publicly available homologation dimensions. No proprietary manufacturer CAD models have been ripped, scraped, or bundled.
