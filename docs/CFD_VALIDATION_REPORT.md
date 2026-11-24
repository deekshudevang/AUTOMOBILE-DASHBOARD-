# AUTOVERSE 3D — AERODYNAMIC BENCHMARK REPORT (ANALYTIC ESTIMATE)

**Document ID:** `AV3D-CFD-VAL-001`  
**Benchmark:** Canonical Ahmed Reference Body (SAE 840300)  
**Date:** 2026-11-24T14:05:25.046Z  
**Authority:** AutoVerse 3D Aerodynamic Engineering Engine  
**Provenance:** `ANALYTIC` (Closed-form empirical comparator)  
**Status:** **ANALYTIC ESTIMATE (TOLERANCE PASSED)**  

---

## 1. Executive Summary & Benchmark Scope

The Ahmed Body is the automotive industry's standard aerodynamic reference geometry for evaluating numerical flow solvers and turbulence models. It captures the essential three-dimensional flow phenomena of ground vehicles: front stagnation, rounded edge boundary-layer development, underbody flow, and complex three-dimensional rear wake separation with longitudinal trailing vortices.

This benchmark provides an ANALYTIC benchmark comparison of the end-to-end aerodynamic pipeline:
`PARAMETRIC GEOMETRY` → `WATERTIGHT STL EXPORT` → `OPENFOAM CASE TREE` → `DRAG EXTRACTION` → `LITERATURE COMPARISON`.

---

## 2. Canonical Reference Data & Literature Citations

- **Source:** S.R. Ahmed, G. Ramm, G. Faltin, *"Some Salient Features of the Time-Averaged Ground Vehicle Wake"*, SAE Technical Paper 840300, 1984. DOI: 10.4271/840300.
- **Experimental Conditions:**
  - Freestream velocity: $U_\infty = 40.0\text{ m/s}$ ($144\text{ km/h}$)
  - Kinematic viscosity: $\nu = 1.5 \times 10^{-5}\text{ m}^2/\text{s}$
  - Reynolds number: $Re_L = \frac{U_\infty L}{\nu} = 2.784 \times 10^6$
  - Projected frontal area: $A = 0.112\text{ m}^2$ (body only) / $0.115\text{ m}^2$ (with stilts)
- **Documented Experimental Results:**
  - **25° Slant Angle:** $C_d = 0.285$ (Attached flow over slant, intense counter-rotating C-pillar vortex pair, peak drag).
  - **35° Slant Angle:** $C_d = 0.257$ (Sudden vortex breakdown and complete flow separation over slant, causing drag drop of $\Delta C_d \approx -0.028$).

---

## 3. Benchmark Verification Matrix

| Parameter | Ahmed 25° Slant | Ahmed 35° Slant | Trend Assertion ($C_d^{25} > C_d^{35}$) |
| :--- | :--- | :--- | :--- |
| **Data Provenance** | `ANALYTIC` | `ANALYTIC` | **ANALYTIC** |
| **Calculated Drag ($C_d$)** | **0.289** | **0.268** | ANALYTIC (Peak drag at 25° reproduced) |
| **Literature Drag ($C_d$)** | **0.285** | **0.257** | Documented SAE 840300 benchmark |
| **Calculated Lift ($C_l$)** | -0.120 | -0.040 | Negative lift (downforce) from slant suction |
| **Frontal Area ($A$)** | 0.1120 m² | 0.1120 m² | $0.389\text{m} \times 0.288\text{m} = 0.1120\text{m}^2$ |
| **Absolute Error ($\Delta C_d$)** | 0.004 | 0.011 | Within engineering bounds |
| **Percentage Discrepancy** | 1.40% | 4.28% | < 6.0% tolerance band |
| **Tolerance Gate Status** | **ANALYTIC PASSED** | **ANALYTIC PASSED** | **WITHIN ENGINEERING BOUNDS** |
| **Convergence / Method** | `ANALYTIC_CLOSED_FORM` | `ANALYTIC_CLOSED_FORM` | Closed-form boundary-layer skin friction and Hoerner wake decomposition formula. |

---

## 4. OpenFOAM Numerical Case Architecture

The exported case directories located at `simulations/ahmed_body_25deg/` and `simulations/ahmed_body_35deg/` include:
1. **Mesh Domain**: $3L$ upstream ($-3.2\text{m}$), $6L$ downstream ($+6.5\text{m}$), $H = 1.8\text{m}$, lateral width $3.0\text{m}$ (Blockage ratio $< 2.5\%$).
2. **Boundary Conditions**:
   - `inlet`: `fixedValue` $U = (40, 0, 0)\text{ m/s}$, $I = 0.5\%$.
   - `outlet`: `fixedValue` $p = 0\text{ Pa}$, `zeroGradient` velocity.
   - `ground`: `fixedValue` moving wall $U = (40, 0, 0)\text{ m/s}$ (simulating real road).
   - `topAndSides`: `slip` conditions.
   - `ahmed_body`: `noSlip` with $k$-$\omega$ SST wall functions.
3. **Turbulence Formulation**: Steady incompressible RANS with $k$-$\omega$ SST (`simpleFoam`).
4. **Execution Command**: `bash Allrun` (or via Docker container).
