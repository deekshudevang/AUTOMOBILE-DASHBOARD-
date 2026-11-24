# AutoVerse 3D — Vehicle Opening System Audit & Kinematics Specification

**Date:** November 23, 2026  
**Auditor:** AutoVerse Lead Automotive Mechanical & Animation Engineer  
**Repository:** `deekshudevang/AUTOMOBILE-DASHBOARD-`  
**Working Branch:** `feat/interiors-engines-openings`  

---

## 1. Executive Summary & Opening Kinematics Audit

An inspection of `src/components/3d/VehicleRenderer.tsx`, `packages/vehicle-generation-engine/src/geometry/editableVehicleAssembler.ts`, and `CustomizationPanel.tsx` reveals:
- **Existing Opening Mechanism:** **NONE.**
- In `editableVehicleAssembler.ts`:
  - `front_left_door`, `front_right_door`, `hood`, and `rear_bumper`/boot are added as static objects directly to the vehicle root group at their neutral resting coordinates.
  - There are **no hinge pivot groups**, no local rotation offsets, and no opening state controllers.
  - The UI has zero opening buttons or animations.
- **Classification Status:** Exactly **50 out of 50 vehicles** are currently classified as `OPENING MECHANISM MISSING`.
- **Engineering Commitment:** We will build a unified Kinematic Opening System (`src/geometry/openings/vehicleOpeningController.ts` / `@autoverse/vehicle-generation-engine`) that:
  1. Wraps doors, hood, and boot in dedicated Three.js `HingePivotGroup` objects positioned at the authentic geometric hinge coordinates.
  2. Implements real rotational kinematics (not hide/show or transparency hacks!).
  3. Supports special vehicle-specific door mechanisms: Conventional, Scissor, Butterfly, Dihedral Synchro-Helix, Gullwing, and Coach Doors.
  4. Provides a dedicated **Vehicle Access Panel** with individual controls for every available door, hood, boot, plus "Open All" and "Close All".

---

## 2. Vehicle-by-Vehicle Door, Hood & Boot Mechanism Matrix (50 Vehicles)

| # | Vehicle Model | Doors Count | Door Mechanism Type | Hinge Axis & Kinematic Behavior | Hood / Bonnet Type | Boot / Trunk Type | Status |
|---|---|---|---|---|---|---|---|
| 1 | Bugatti Chiron Super Sport | 2 | Conventional | Y-axis +25° sweep outward | Front Frunk (Luggage) | Rear Clamshell / Engine Access | `OPENING MECHANISM MISSING` |
| 2 | Koenigsegg Jesko Attack | 2 | Dihedral Synchro-Helix | Complex dual-axis: moves outward 40mm then rotates 90° vertically | Front Clamshell Hood | Rear Clamshell Engine Bay | `OPENING MECHANISM MISSING` |
| 3 | McLaren P1 | 2 | Dihedral / Butterfly | Rotates forward and upward 45° along A-pillar hinge | Front Frunk Lid | Rear Clamshell Engine Bay | `OPENING MECHANISM MISSING` |
| 4 | Ferrari LaFerrari | 2 | Butterfly | Rotates forward and upward 65° along A-pillar | Front Frunk Lid | Rear Clamshell Engine Bay | `OPENING MECHANISM MISSING` |
| 5 | Porsche 918 Spyder | 2 | Conventional | Y-axis +55° sweep outward | Front Frunk Lid | Rear Targa Engine Cover | `OPENING MECHANISM MISSING` |
| 6 | Aston Martin Valkyrie | 2 | Gullwing | Roof-hinged: rotates directly upward 85° | Front Aero Panel | Rear Clamshell Engine Bay | `OPENING MECHANISM MISSING` |
| 7 | Mercedes-AMG ONE | 2 | Butterfly | Rotates forward and upward 60° along A-pillar | Front Clamshell Hood | Rear Clamshell Engine Bay | `OPENING MECHANISM MISSING` |
| 8 | Rimac Nevera | 2 | Butterfly | Rotates forward and upward 65° along A-pillar | Front Frunk Storage | Rear Hatch Cargo Area | `OPENING MECHANISM MISSING` |
| 9 | Pagani Huayra BC | 2 | Gullwing | Roof-hinged gullwing: rotates upward 80° | Full Front Clamshell | Full Rear Clamshell Engine Bay | `OPENING MECHANISM MISSING` |
| 10 | Lamborghini Revuelto | 2 | Scissor | Forward fender hinge: rotates vertically upward 75° | Front Frunk Storage | Rear Clamshell Engine Bay | `OPENING MECHANISM MISSING` |
| 11 | Ferrari 296 GTB | 2 | Conventional | Y-axis +60° sweep outward | Front Frunk Lid | Rear Glass Engine Cover | `OPENING MECHANISM MISSING` |
| 12 | Ferrari F8 Tributo | 2 | Conventional | Y-axis +60° sweep outward | Front Frunk Lid | Louvered Rear Engine Cover | `OPENING MECHANISM MISSING` |
| 13 | Lamborghini Aventador SVJ | 2 | Scissor | Forward fender hinge: rotates vertically upward 75° | Front Frunk Storage | Rear Clamshell Engine Bay | `OPENING MECHANISM MISSING` |
| 14 | Lamborghini Huracan STO | 2 | Conventional | Y-axis +58° sweep outward | "Cofango" Forward-Tilting Clamshell | Rear Engine Cover with Roof Snorkel | `OPENING MECHANISM MISSING` |
| 15 | McLaren 720S | 2 | Dihedral / Butterfly | Rotates forward and upward 65° along A-pillar | Front Frunk Lid | Rear Glass Cargo Deck | `OPENING MECHANISM MISSING` |
| 16 | McLaren 765LT | 2 | Dihedral / Butterfly | Rotates forward and upward 65° along A-pillar | Front Frunk Lid | Rear Glass Cargo Deck | `OPENING MECHANISM MISSING` |
| 17 | McLaren Senna | 2 | Dihedral / Butterfly | Rotates forward and upward 65° along A-pillar | Front Frunk Lid | Rear Aero Decklid | `OPENING MECHANISM MISSING` |
| 18 | Ford GT | 2 | Butterfly | Rotates forward and upward 60° along A-pillar | Front Aero Access Lid | Rear Clamshell Engine Bay | `OPENING MECHANISM MISSING` |
| 19 | Chevrolet Corvette Z06 (C8) | 2 | Conventional | Y-axis +62° sweep outward | Front Frunk Lid | Rear Glass Engine Hatch | `OPENING MECHANISM MISSING` |
| 20 | Audi R8 V10 Performance | 2 | Conventional | Y-axis +60° sweep outward | Front Frunk Lid | Rear Glass Engine Hatch | `OPENING MECHANISM MISSING` |
| 21 | Nissan GT-R Nismo (R35) | 2 | Conventional | Y-axis +65° sweep outward | Front Hood (Rear-Hinged) | Rear Trunk Lid | `OPENING MECHANISM MISSING` |
| 22 | Acura NSX Type S | 2 | Conventional | Y-axis +60° sweep outward | Front Power Unit Lid | Rear Glass Engine Hatch | `OPENING MECHANISM MISSING` |
| 23 | Maserati MC20 | 2 | Butterfly | Rotates forward and upward 65° along A-pillar | Front Frunk Lid | Rear Glass Engine Hatch | `OPENING MECHANISM MISSING` |
| 24 | Lexus LFA | 2 | Conventional | Y-axis +62° sweep outward | Front Hood (Dual Gas Struts) | Rear Hatch Cargo Deck | `OPENING MECHANISM MISSING` |
| 25 | Porsche 911 GT3 RS (992) | 2 | Conventional | Y-axis +60° sweep outward | Front Central Radiator Bonnet | Rear Decklid Service Flap | `OPENING MECHANISM MISSING` |
| 26 | Porsche 911 Turbo S (992) | 2 | Conventional | Y-axis +60° sweep outward | Front Luggage Frunk | Rear Engine Lid | `OPENING MECHANISM MISSING` |
| 27 | Porsche 718 Cayman GT4 RS | 2 | Conventional | Y-axis +60° sweep outward | Front Luggage Frunk | Rear Clamshell Engine Bay | `OPENING MECHANISM MISSING` |
| 28 | BMW M4 CSL (G82) | 2 | Conventional | Y-axis +65° sweep outward | Front Hood with Twin M Lines | Rear Carbon Ducktail Trunk | `OPENING MECHANISM MISSING` |
| 29 | Toyota GR Supra (A90) | 2 | Conventional | Y-axis +65° sweep outward | Front Clamshell Hood | Rear Liftback Hatch | `OPENING MECHANISM MISSING` |
| 30 | Nissan Z Nismo | 2 | Conventional | Y-axis +65° sweep outward | Front Hood | Rear Liftback Hatch | `OPENING MECHANISM MISSING` |
| 31 | Mazda MX-5 Miata | 2 | Conventional | Y-axis +68° sweep outward | Front Hood | Rear Trunk Lid | `OPENING MECHANISM MISSING` |
| 32 | Alpine A110 R | 2 | Conventional | Y-axis +60° sweep outward | Front Luggage Compartment | Rear Carbon Engine Cover | `OPENING MECHANISM MISSING` |
| 33 | Lotus Emira V6 | 2 | Conventional | Y-axis +62° sweep outward | Front Access Panel | Rear Glass Engine Hatch | `OPENING MECHANISM MISSING` |
| 34 | Jaguar F-Type R Coupe | 2 | Conventional | Y-axis +65° sweep outward | Forward-Tilting Clamshell Hood | Rear Powered Liftback Hatch | `OPENING MECHANISM MISSING` |
| 35 | Ford Mustang Shelby GT500 | 2 | Conventional | Y-axis +65° sweep outward | Front Vented Hood with Hood Pins | Rear Trunk Lid with Wing | `OPENING MECHANISM MISSING` |
| 36 | Dodge Challenger Demon 170 | 2 | Conventional | Y-axis +65° sweep outward | Front Air-Grabber Hood | Rear Trunk Lid | `OPENING MECHANISM MISSING` |
| 37 | Chevrolet Camaro ZL1 1LE | 2 | Conventional | Y-axis +65° sweep outward | Front Hood with Carbon Insert | Rear Trunk Lid with Wing | `OPENING MECHANISM MISSING` |
| 38 | Chevrolet Corvette C7 ZR1 | 2 | Conventional | Y-axis +62° sweep outward | Front Shaker Hood | Rear Glass Hatch | `OPENING MECHANISM MISSING` |
| 39 | Nissan Skyline GT-R R34 | 2 | Conventional | Y-axis +65° sweep outward | Front Aluminum Hood | Rear Trunk Lid with Wing | `OPENING MECHANISM MISSING` |
| 40 | Honda NSX Type R (NA2) | 2 | Conventional | Y-axis +62° sweep outward | Front Radiator/Spare Lid | Rear Glass Hatch & Engine Mesh | `OPENING MECHANISM MISSING` |
| 41 | Mazda RX-7 Spirit R (FD3S) | 2 | Conventional | Y-axis +65° sweep outward | Front Aluminum Hood | Rear Glass Liftback Hatch | `OPENING MECHANISM MISSING` |
| 42 | Mitsubishi Lancer Evo IX MR | **4** | Conventional (Front & Rear) | Front +65°, Rear +65° outward | Front Aluminum Vented Hood | Rear Trunk Lid with Carbon Wing | `OPENING MECHANISM MISSING` |
| 43 | Subaru Impreza WRX STI | **4** | Conventional (Front & Rear) | Front +65°, Rear +65° outward | Front Hood with Large Scoop | Rear Trunk Lid with High Wing | `OPENING MECHANISM MISSING` |
| 44 | Toyota 2000GT | 2 | Conventional | Y-axis +60° sweep outward | Front Long Hood (Rear-Hinged) | Side Inspection Hatches & Rear Hatch | `OPENING MECHANISM MISSING` |
| 45 | Mercedes-AMG GT Black Series | 2 | Conventional | Y-axis +62° sweep outward | Front Carbon Vented Hood | Rear Carbon Liftback Hatch | `OPENING MECHANISM MISSING` |
| 46 | Porsche 911 Dakar | 2 | Conventional | Y-axis +60° sweep outward | Front Carbon Frunk Lid | Rear Decklid Flap | `OPENING MECHANISM MISSING` |
| 47 | Porsche 935 (2019) | 2 | Conventional | Y-axis +60° sweep outward | Front Lightweight Hood | Rear Extended Clamshell Deck | `OPENING MECHANISM MISSING` |
| 48 | Ferrari FXX-K Evo | 2 | Butterfly | Rotates forward and upward 65° along A-pillar | Front Aero Access Lid | Rear Track Clamshell Engine Bay | `OPENING MECHANISM MISSING` |
| 49 | Lamborghini Essenza SCV12 | 2 | Scissor | Forward fender hinge: rotates vertically upward 75° | Front Clamshell | Rear Structural Engine Cover | `OPENING MECHANISM MISSING` |
| 50 | Rolls-Royce Spectre | 2 | Reverse-Hinged Coach Doors | Rear-hinged ("Suicide"): rotates outward & rearward 65° | Front Illuminated Bonnet | Rear Powered Trunk Lid | `OPENING MECHANISM MISSING` |

---

## 3. Kinematic Implementation Rules

1. **Hinge Pivot Groups:**
   - Instead of rotating raw door meshes directly at their centroid, doors are placed inside a `THREE.Group` whose origin is exactly at the hinge pin:
     - Front Left Door Conventional Hinge: $[X = -W_{car}/2 + 0.05, Y = H_{belt} - 0.2, Z = WB/2 - 0.2]$
     - Front Left Scissor Door Hinge: $[X = -W_{car}/2 + 0.08, Y = H_{belt} + 0.05, Z = WB/2 - 0.1]$, rotating along Z/X pitch-up angle.
     - Front Left Butterfly Hinge: Located along A-pillar rake, rotating along compound $[Pitch: +0.4, Yaw: +0.6, Roll: -0.5]$.
     - Coach Doors (Rolls-Royce Spectre): Hinge located at B-pillar/rear quarter edge $[Z = -0.3]$, sweeping rearward.
2. **Four-Door Handling:**
   - 48 vehicles have 2 doors (Front Left, Front Right).
   - 2 vehicles (`Mitsubishi Lancer Evolution IX MR` and `Subaru Impreza WRX STI`) have **4 independent doors** (Front Left, Front Right, Rear Left, Rear Right).
3. **Smooth Interactive Animation:**
   - Dynamic slerp / lerp interpolation between $0.0$ (Closed) and $1.0$ (Open).
   - Simultaneous animation support ("Open All", "Close All").
   - Camera focus presets automatically zoom to cockpit when doors open, to engine bay when hood opens, and to boot when trunk opens.
