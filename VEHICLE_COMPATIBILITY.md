# AUTOVERSE 3D — Vehicle & Component Compatibility Matrix (`VEHICLE_COMPATIBILITY.md`)

**Document Version:** 2.0.0  
**Standard:** Multi-Constraint Assembly Engineering Validation  
**Operating Standard:** Strict Physics & Geometry Bounds, Zero Plausibility Guessing

---

## 1. Multi-Constraint Validation Framework

AutoVerse evaluates component compatibility through a strict five-state multi-constraint solver:

```
[VALID]   -> All mounting anchors, clearances, and bolt patterns satisfied.
[WARNING] -> Physical clearance within 5-15mm margin or minor aero balance shift.
[CONFLICT]-> Non-fatal dimensional mismatch (e.g. requires complementary front splitter).
[BLOCKED] -> Fatal collision, ground clearance < 100mm, wheel rub, or bolt pattern mismatch.
[UNKNOWN] -> Parameter not provided or verified by OEM. Unstated dimensions remain UNKNOWN.
```

---

## 2. OEM Mechanical & Bolt Pattern Standards

| Manufacturer / Model | Hub Bore (mm) | Bolt Circle Pattern | Pitch / Thread | OEM Wheel Offset ($ET$ mm) | Caliper Clearance Envelope ($R_{min}$ mm) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Porsche 911 GT3 RS (992)** | Center-Lock (84mm) | Center-Lock Spline | Center-Lock M36 | Front: +45 / Rear: +45 | 225 mm (PCCB 410mm ceramic rotor) |
| **Lamborghini Aventador SVJ** | Center-Lock (84mm) | Center-Lock Spline | Center-Lock M36 | Front: +42 / Rear: +38 | 220 mm (CCB 400mm ceramic rotor) |
| **Ferrari 488 Pista** | 67.1 mm | 5 × 114.3 mm | M14 × 1.5 | Front: +46 / Rear: +48 | 218 mm (CCM 398mm carbon ceramic) |
| **McLaren 720S** | 67.1 mm | 5 × 112 mm | M14 × 1.5 | Front: +40 / Rear: +42 | 215 mm (CCM 390mm rotor) |
| **Bugatti Chiron** | 72.5 mm | 5 × 130 mm | M16 × 1.5 | Front: +52 / Rear: +50 | 230 mm (420mm front rotor) |
| **Audi R8 V10 Performance** | 57.1 mm | 5 × 112 mm | M14 × 1.5 | Front: +42 / Rear: +47 | 212 mm (380mm wave rotor) |
| **Chevrolet Corvette C8 Z06** | 66.9 mm | 5 × 120 mm | M14 × 1.5 | Front: +38 / Rear: +45 | 220 mm (400mm Brembo package) |
| **Nissan GT-R R35** | 66.1 mm | 5 × 114.3 mm | M12 × 1.25 | Front: +45 / Rear: +25 | 215 mm (390mm floating disc) |
| **Toyota GR Supra A90** | 66.6 mm | 5 × 112 mm | M14 × 1.25 | Front: +32 / Rear: +40 | 195 mm (348mm Brembo caliper) |
| **Ford Mustang Shelby GT500** | 70.5 mm | 5 × 114.3 mm | M14 × 1.5 | Front: +32 / Rear: +48 | 228 mm (420mm SHW rotor) |
| **BMW M4 Competition G82** | 66.6 mm | 5 × 112 mm | M14 × 1.25 | Front: +20 / Rear: +20 | 218 mm (M Carbon Ceramic 400mm) |
| **Mercedes-AMG GT R** | 66.6 mm | 5 × 112 mm | M14 × 1.5 | Front: +53 / Rear: +45 | 220 mm (Carbon Ceramic 402mm) |

---

## 3. Dynamic Clearance Envelopes & Sweeps

### 3.1 Wheel Arch & Steering Sweep Rule
- **Steering Angle Lock:** $\pm 35.0^\circ$ continuous front sweep.
- **Vertical Suspension Travel:** $+50\text{ mm}$ (Full bump/compression) to $-30\text{ mm}$ (Full rebound/droop).
- **Minimum Clearance Threshold:**
  - Dynamic Wheel-to-Fender: $\ge 15.0\text{ mm}$ -> `VALID`.
  - Margin $5.0\text{ mm} - 14.9\text{ mm}$ -> `WARNING`.
  - Interference $< 5.0\text{ mm}$ or contact -> `BLOCKED`.

### 3.2 Rolling Diameter Deviation Rule
- Formula: $\text{Dev}\% = \frac{D_\text{proposed} - D_\text{OEM}}{D_\text{OEM}} \times 100\%$
- Thresholds:
  - $|\text{Dev}| \le 1.5\%$ -> `VALID`.
  - $1.5\% < |\text{Dev}| \le 3.0\%$ -> `WARNING` (Speedometer recalibration advisory).
  - $|\text{Dev}| > 3.0\%$ -> `BLOCKED` (Exceeds ABS/TCS traction control tolerance).

### 3.3 Static Ground Clearance Rule
- Statutory minimum: $100\text{ mm}$ above road plane.
- Front Splitter Track Minimum: $70\text{ mm}$ (Track mode only; warning emitted for street use).
- Measured at lowest chassis hardpoint across $-X \le x \le +X$.

---

## 4. Vehicle-Specific Component Compatibility Table

| Component Identifier | Category | Porsche 911 GT3 RS | Lamborghini Aventador SVJ | Ferrari 488 Pista | Validation Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `comp_wing_gt3rs_active` | Aero | `VALID` | `CONFLICT` | `CONFLICT` | Specific swan-neck decklid stanchion spacing (0.80m) matches 911 rear deck nodes. Requires custom pylons on SVJ/Pista. |
| `comp_wing_svj_ala` | Aero | `CONFLICT` | `VALID` | `CONFLICT` | Requires ALA 2.0 internal air ducting solenoids present only on SVJ engine bonnet. |
| `comp_splitter_pista_sduct` | Aero | `BLOCKED` | `BLOCKED` | `VALID` | Integrated into Ferrari S-Duct front hood exhaust tunnel. Front crash structure prevents retrofitting to rear-engine 911. |
| `comp_wheel_centerlock_20in` | Wheels | `VALID` | `VALID` | `BLOCKED` | 84mm Center-Lock spline matches 911 and SVJ hubs. Ferrari 488 Pista uses 5x114.3mm 5-lug hub (`BLOCKED`). |
| `comp_wheel_forged_5lug_20in` | Wheels | `BLOCKED` | `BLOCKED` | `VALID` | 5x114.3mm bolt pattern matches Ferrari 488 Pista. Center-lock Porsche and Lamborghini hubs reject 5-lug pattern. |
| `comp_diffuser_venturi_4strake` | Aero | `VALID` | `VALID` | `VALID` | Universal underbody subframe mounting with adjustable bracket envelope. |
| `comp_porous_radiator_core` | Cooling | `VALID` | `WARNING` | `VALID` | Angled central pack packaging fits 911 and Pista nostrils; SVJ requires dual side pod radiators. |
