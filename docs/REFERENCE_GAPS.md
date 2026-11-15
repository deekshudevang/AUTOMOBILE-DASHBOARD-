# AUTOVERSE 3D — Reference Data Gaps & Tier A Requirements

Generated: Sun, 15 Nov 2026 15:02:40 GMT

## 1. Truth Contract & Honest Ceiling

Per Section 1.4 of the Master Truth Contract:
> Procedural generation can reach **Tier B – Spec-accurate** convincingly and **Tier A – Reference-verified** only with calibrated reference material. A true 1:1 replica requires licensed CAD/scan/GLB assets or orthographic blueprints with known scale. If those are not in the repository, Tier B is completed for all cars and this document defines the exact reference material required per car to unlock Tier A.

---

## 2. Pilot Reference Status

| Pilot Vehicle | Verified OEM Spec Source | Verified Specs | Orthographic Blueprints | Achievable Tier |
| :--- | :--- | :--- | :--- | :--- |
| **Porsche 911 GT3 RS (992)** | Porsche Newsroom Technical Data (MY2023) | **12 / 12 Verified** | Missing `reference/porsche_911_gt3_rs/{side,front,rear,top}.png` | **Tier B (Spec-accurate)** |
| **Ferrari 488 Pista** | Ferrari Media Center Technical Specifications | **12 / 12 Verified** | Missing `reference/ferrari_488_pista/{side,front,rear,top}.png` | **Tier B (Spec-accurate)** |
| **Lamborghini Aventador SVJ** | Automobili Lamborghini S.p.A. Technical Sheet | **12 / 12 Verified** | Missing `reference/lamborghini_aventador_svj/{side,front,rear,top}.png` | **Tier B (Spec-accurate)** |

---

## 3. Reference Asset Requirements to Unlock Tier A

To elevate a vehicle from Tier B to Tier A without violating the Truth Contract (no fabricated geometry), the user can supply any of the following into `reference/<vehicleId>/`:

1. **Orthographic Blueprint Pack**:
   - `side.png`: True side elevation orthographic projection with level ground plane.
   - `front.png`: True front elevation centered on vehicle centerline.
   - `rear.png`: True rear elevation centered on vehicle centerline.
   - `top.png`: True plan view aligned with wheelbase.
2. **Licensed OEM CAD / Laser Scan**:
   - STEP, IGES, or high-density OBJ/GLB scan asset.

---

## 4. Complete Fleet Gap Registry

| Vehicle | Archetype | Verified Dimensions | Missing Verified Fields | Blueprint Status | Current Ceiling |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `10F Red-Carbon` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `2011_Porsche_911GT2RS_997-2` | `rear_engine_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `2015_LamborghiniHuracan_LP620-2` | `mid_engine_supercar` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `2018_AudiRS3_Sedan` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `2018_AudiRS5_Coupe` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `2020_Koenigsegg_Jesko_Absolut` | `mid_engine_hypercar` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `2F2FSUPRA` | `front_engine_sports_car` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `2F2FSUPRA_Retro_Shade` | `front_engine_sports_car` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `760 LH` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `AA  max upgraded` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `NSX Type S` | `mid_engine_supercar` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `AElhAfs` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `alfa romeo giulia red` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `all blue circuit board electric` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `A110 R` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `ANNIS ZR360 DRIFT` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Valkyrie` | `mid_engine_hypercar` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `audi r8 ( custom )` | `mid_engine_supercar` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `AudiBenny` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `R8 V10 Performance` | `mid_engine_supercar` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Banshee GTS` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Benefactor LRC GT v1` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Benefactor LRC GT v2` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `BEntley` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `blackblueScramjet` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Blista F1` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `blue buffalo` | `front_engine_sports_car` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `blue collar rig` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `bmw (1)` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `BMW M3 MINT GREEN` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `BMW` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Bmw5` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `M4 CSL` | `front_engine_sports_car` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Bravado Gauntled Mod` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `broomstick` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Chiron Super Sport` | `mid_engine_hypercar` | 14 / 12 | None | Awaiting blueprints | **Tier** |
| `C6` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `CANTUCCIA` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Cartuccia GT` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Camaro ZL1 1LE` | `front_engine_sports_car` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Corvette C7 ZR1` | `front_engine_sports_car` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Corvette Z06` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `coil 2` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `CometS2` | `rear_engine_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `copo` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Cyclone II by Ram` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `cyper` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `defendybob` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Deluxo Modded` | `front_engine_gt_coupe` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| `Challenger SRT Demon 170` | `front_engine_sports_car` | 0 / 12 | 12 missing | Awaiting blueprints | **Tier** |
| *(and 159 additional vehicles in the registry)* | — | — | — | — | — |
