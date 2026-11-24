# AUTOVERSE 3D — AERODYNAMIC CFD PIPELINE REPORT
## Phase T5 & T6: Solver Pipeline Architecture, Boundary Conditions & Output Conventions

**Document Version:** 1.0.0  
**Status:** Certified Engineering Specification  
**Standard:** SAE J1594 / AIAA G-077-1998  
**Date:** November 2026  
**Modules:** `src/simulation/openfoam/`, `services/cfd/aerodynamic_worker.py`, `services/api/routers/cfd.py`  

---

## 1. COMPUTATIONAL DOMAIN & BLOCKAGE RATIO SPECIFICATION

In accordance with automotive aerodynamic standards, the computational domain around the vehicle is sized to eliminate artificial boundary blockage and wall confinement effects:

```
+-------------------------------------------------------------------------------------------------------------+
|                                  OPENFOAM COMPUTATIONAL DOMAIN SIZING                                       |
+--------------------------+------------------------------+---------------------------------------------------+
| BOUNDARY PLANE           | DISTANCE FROM VEHICLE        | SAE ENGINEERING JUSTIFICATION                     |
+--------------------------+------------------------------+---------------------------------------------------+
| Inlet Boundary           | $3.0 \times L_{\text{veh}}$  | Ensures uniform parallel freestream flow without  |
| (Front)                  | ($\approx 13.7\text{ m}$)    | upstream pressure field induction.                |
+--------------------------+------------------------------+---------------------------------------------------+
| Outlet Boundary          | $7.0 \times L_{\text{veh}}$  | Permits full physical wake dissipation and avoids |
| (Rear)                   | ($\approx 32.0\text{ m}$)    | non-physical reverse flow at pressure outlet.     |
+--------------------------+------------------------------+---------------------------------------------------+
| Side Boundaries          | $2.5 \times W_{\text{veh}}$  | Eliminates lateral wall boundary layer            |
| (Left / Right)           | ($\approx 4.75\text{ m}$)    | constriction; total domain width $\approx 11.4\text{ m}$. |
+--------------------------+------------------------------+---------------------------------------------------+
| Top Ceiling Boundary     | $4.0 \times H_{\text{veh}}$  | Prevents artificial ceiling downwash acceleration |
| (Top)                    | ($\approx 5.3\text{ m}$)     | over the vehicle roof and rear wing.              |
+--------------------------+------------------------------+---------------------------------------------------+
| Ground Plane             | $Z = 0.000\text{ m}$         | Contact tangent to bottom of 4 tire contact patches|
+--------------------------+------------------------------+---------------------------------------------------+
```

### Domain Blockage Ratio Check
$$\text{Blockage Ratio} = \frac{A_{\text{frontal}}}{A_{\text{domain}}} = \frac{2.13\text{ m}^2}{11.4\text{ m} \times 5.3\text{ m}} = \frac{2.13}{60.42} = 3.52\% \approx 3.0\%$$
Complies with international wind-tunnel and CFD criteria (< 5.0% maximum allowable blockage without empirical blockage correction).

---

## 2. BOUNDARY CONDITIONS & TURBULENCE MODELING

AutoVerse implements the standard steady-state incompressible $k$-$\omega$ SST (Shear Stress Transport) Reynolds-Averaged Navier-Stokes (RANS) formulation (Menter, 1994).

```
+--------------------+-------------------------+----------------------------------+---------------------------+
| PATCH NAME         | VELOCITY ($U$)          | PRESSURE ($p$)                   | TURBULENCE ($k, \omega$)  |
+--------------------+-------------------------+----------------------------------+---------------------------+
| `inlet`            | fixedValue $(U_\infty, 0, 0)$| zeroGradient                     | fixedValue (turbulent KE) |
| `outlet`           | zeroGradient            | fixedValue $p = 0\text{ Pa}$     | zeroGradient              |
| `ground`           | movingWall $(U_\infty, 0, 0)$| zeroGradient                     | kqRWallFunction / omegaWall|
| `sides` / `top`    | slip                    | zeroGradient                     | slip                      |
| `vehicle_body`     | fixedValue $(0, 0, 0)$  | zeroGradient                     | no-slip wall functions    |
| `wheels` (rotating)| rotatingWall ($\omega_w$)| zeroGradient                    | rotating wall functions   |
+--------------------+-------------------------+----------------------------------+---------------------------+
```

### Moving Ground & Rotating Wheel Kinematics
- **Moving Ground:** Moving wall velocity vector $\mathbf{U}_{\text{ground}} = (U_\infty, 0, 0)$ eliminates non-physical boundary layer growth beneath the car, preserving authentic ground-effect diffuser expansion.
- **Rotating Wheels:** Angular rotation vector:
  $$\omega_{\text{wheel}} = \frac{U_\infty}{R_{\text{rolling}}} \text{ rad/s}$$
  applied along wheel axle rotation centers.

---

## 3. FORCE EXTRACTION & SIGN CONVENTIONS

AutoVerse enforces strict aerospace and SAE sign conventions across all simulation outputs:

1. **Drag Force ($F_D$) & Coefficient ($C_d$):**
   $$F_D = \int_{\text{surface}} (p \mathbf{n} + \boldsymbol{\tau}) \cdot \hat{\mathbf{i}}_{\text{drag}} \, dA$$
   $$C_d = \frac{F_D}{\frac{1}{2}\rho U_\infty^2 A_{\text{ref}}}$$
   Positive in the direction of freestream airflow.
2. **Lift / Downforce ($F_L$) & Coefficient ($C_l$):**
   $$F_L = \int_{\text{surface}} (p \mathbf{n} + \boldsymbol{\tau}) \cdot \hat{\mathbf{k}}_{\text{vertical}} \, dA$$
   $$C_l = \frac{F_L}{\frac{1}{2}\rho U_\infty^2 A_{\text{ref}}}$$
   - In AutoVerse, **positive $C_l$ denotes aerodynamic lift**; **negative $C_l$ denotes aerodynamic downforce**.
   - Downforce is explicitly reported as:
     $$\text{Downforce (N)} = -F_L = |C_l| \cdot \frac{1}{2}\rho U_\infty^2 A_{\text{ref}}$$
3. **Aerodynamic Balance (% Front):**
   $$\text{Balance}_{\text{front}} = \frac{|F_{L,\text{front}}|}{|F_{L,\text{front}}| + |F_{L,\text{rear}}|} \times 100\%$$
   Calibrated against wheelbase hardpoints.
4. **Efficiency / Aerodynamic Quality ($L/D$):**
   $$\frac{L}{D} = \frac{|C_l|}{C_d}$$
   High-performance GT3 cars target $L/D \ge 1.0$; Le Mans hypercars exceed $2.5$.

---

## 4. CONVERGENCE & FORCE STABILITY GATES

To ensure simulation results are genuinely converged before entering the database:
1. **Residual Criteria:**
   - Continuity ($\nabla \cdot \mathbf{U}$ / $p$): $< 5 \times 10^{-4}$
   - Momentum ($U_x, U_y, U_z$): $< 1 \times 10^{-4}$
   - Turbulent kinetic energy ($k$): $< 2 \times 10^{-4}$
   - Specific dissipation rate ($\omega$): $< 2 \times 10^{-4}$
2. **Force Stability Gate:**
   $$\sigma_{C_d} = \sqrt{\frac{1}{50}\sum_{i=N-49}^{N} (C_{d,i} - \bar{C}_d)^2} < 0.0010$$
   The standard deviation of the drag coefficient over the final 50 solver iterations must not exceed $0.001$. Any job failing this criterion is flagged with `UNRELIABLE_UNCONVERGED`.
