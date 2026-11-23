# AutoVerse 3D — Vehicle Asset & Component Inventory

**Date of Audit:** November 23, 2026  
**Auditor:** AutoVerse Lead Automotive Software & Graphics Engineering Team  
**Repository:** `deekshudevang/AUTOMOBILE-DASHBOARD-`  
**Working Branch:** `feat/car-studio-overhaul`  

---

## 1. Executive Summary & Asset Reality Check

| Metric | Recorded Value | Engineering Reality |
|---|---|---|
| **Raw JSON Vehicle Files** | 211 files | Mixed formats (Schema 2.0, Parametric definitions, Legacy Cherax tuning dumps) |
| **Physical 3D Binary Files (.glb / .obj / .fbx)** | **0 files** | `public/vehicle-assets/cars/` contains **0** binary files. All manifest paths are phantom references. |
| **Schema 2.0 Discrete 30-Part Vehicles** | **50 vehicles** | High-fidelity 30-component structured JSON with dimensional bounding boxes, anchors, and materials. |
| **Dedicated Procedural Archetypes (V2 Engine)** | **3 vehicles** | Fully bespoke procedural Class-A panels (Lamborghini SVJ, Ferrari 488 Pista, Porsche 911 GT3 RS). |
| **Parametric Geometry Fallbacks** | 51 vehicles | Procedural parameter sets driven by dimensional envelopes. |
| **Legacy Tuning Files** | 110 vehicles | No 3D geometry; vehicle handling, transmission, and torque curves only. |
| **Catalog Modular Swappable Components** | **48+ items** | Discrete modular 3D geometry generators in `vehicleComponentCatalog.ts` across 6 categories. |

---

## 2. Binary 3D File Inventory

An exhaustive file-system traversal of `public/` and `src/assets/` reveals:
- `public/vehicle-assets/cars/`: **EMPTY** (0 bytes)
- `public/vehicle-assets/manifest.json`: Lists GLB endpoints (e.g. `/vehicle-assets/cars/porsche_911_gt3_rs.glb`, `/vehicle-assets/cars/ferrari_488_pista.glb`), but these files **do not exist on disk**.
- **Geometry Source**: 100% of the 3D car rendering in AutoVerse is generated **procedurally on-the-fly in WebGL/Three.js** via two complementary geometry engines:
  1. `VehicleGeometryEngine` (`packages/vehicle-generation-engine`): Procedural panel meshes with custom curvature curves.
  2. `EditableVehicleAssembler` (`src/geometry/schema2Body.ts` & `@autoverse/vehicle-generation-engine`): Assembles 30 discrete components per car with real-time parametric transforms.

---

## 3. Schema 2.0 Vehicle Catalog (50 Fully-Structured Models)

Each Schema 2.0 vehicle definition contains **30 discrete, individually addressable and swappable components**:
1. `body_shell`
2. `hood`
3. `front_bumper`
4. `rear_bumper`
5. `front_splitter`
6. `rear_diffuser`
7. `rear_wing`
8. `roof`
9. `front_left_fender`
10. `front_right_fender`
11. `rear_left_fender`
12. `rear_right_fender`
13. `front_left_door`
14. `front_right_door`
15. `side_skirt_left`
16. `side_skirt_right`
17. `headlights_housing`
18. `taillights_bar`
19. `exhaust_system`
20. `front_windshield`
21. `rear_windshield`
22. `side_windows`
23. `wheel_front_left`
24. `wheel_front_right`
25. `wheel_rear_left`
26. `wheel_rear_right`
27. `interior_cockpit`
28. `steering_wheel`
29. `seats_assembly`
30. `roll_cage`

### Inventory Table by Category:

### 3.1 Supercars (7 Vehicles)
| Vehicle ID | Make & Model | Year | Wheelbase | Track F/R | Hub Type | Geometry Status |
|---|---|---|---|---|---|---|
| `lamborghini_aventador_svj` | Lamborghini Aventador SVJ | 2020 | 2700mm | 1720 / 1680mm | Center-Lock 84mm | Bespoke V2 Archetype + Schema 2.0 |
| `ferrari_488_pista` | Ferrari 488 Pista | 2019 | 2650mm | 1679 / 1647mm | 5x114.3mm | Bespoke V2 Archetype + Schema 2.0 |
| `mclaren_720s` | McLaren 720S | 2021 | 2670mm | 1674 / 1629mm | 5x112mm | Schema 2.0 Procedural Assembly |
| `porsche_911_turbo_s` | Porsche 911 Turbo S (992) | 2022 | 2450mm | 1583 / 1600mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `audi_r8_v10_performance` | Audi R8 V10 Performance | 2021 | 2650mm | 1638 / 1599mm | 5x112mm | Schema 2.0 Procedural Assembly |
| `ford_gt_2020` | Ford GT Liquid Carbon | 2020 | 2710mm | 1694 / 1664mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `chevrolet_corvette_z06` | Chevrolet Corvette Z06 (C8) | 2023 | 2722mm | 1685 / 1678mm | 5x120mm | Schema 2.0 Procedural Assembly |

### 3.2 Hypercars (7 Vehicles)
| Vehicle ID | Make & Model | Year | Wheelbase | Track F/R | Hub Type | Geometry Status |
|---|---|---|---|---|---|---|
| `bugatti_chiron_pur_sport` | Bugatti Chiron Pur Sport | 2021 | 2711mm | 1749 / 1661mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `koenigsegg_jesko_attack` | Koenigsegg Jesko Attack | 2022 | 2700mm | 1698 / 1655mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `pagani_huayra_bc` | Pagani Huayra BC | 2017 | 2795mm | 1654 / 1660mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `mclaren_speedtail` | McLaren Speedtail | 2020 | 2720mm | 1690 / 1630mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `aston_martin_valkyrie` | Aston Martin Valkyrie | 2022 | 2760mm | 1700 / 1630mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `rimac_nevera` | Rimac Nevera | 2022 | 2745mm | 1672 / 1704mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `hennessey_venom_f5` | Hennessey Venom F5 | 2021 | 2800mm | 1680 / 1620mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |

### 3.3 Sports Cars (6 Vehicles)
| Vehicle ID | Make & Model | Year | Wheelbase | Track F/R | Hub Type | Geometry Status |
|---|---|---|---|---|---|---|
| `porsche_911_gt3_rs` | Porsche 911 GT3 RS (992) | 2023 | 2457mm | 1630 / 1608mm | Center-Lock 84mm | Bespoke V2 Archetype + Schema 2.0 |
| `bmw_m4_csl` | BMW M4 CSL (G82) | 2023 | 2857mm | 1617 / 1605mm | 5x112mm | Schema 2.0 Procedural Assembly |
| `mercedes_amg_gt_black_series`| Mercedes-AMG GT Black Series | 2021 | 2630mm | 1684 / 1651mm | 5x112mm | Schema 2.0 Procedural Assembly |
| `chevrolet_camaro_zl1_1le`| Chevrolet Camaro ZL1 1LE | 2022 | 2811mm | 1610 / 1591mm | 5x120mm | Schema 2.0 Procedural Assembly |
| `jaguar_f_type_svr` | Jaguar F-Type SVR | 2020 | 2622mm | 1585 / 1628mm | 5x108mm | Schema 2.0 Procedural Assembly |
| `alpine_a110_r` | Alpine A110 R | 2023 | 2420mm | 1556 / 1553mm | 5x114.3mm | Schema 2.0 Procedural Assembly |

### 3.4 JDM Legends & Modern (6 Vehicles)
| Vehicle ID | Make & Model | Year | Wheelbase | Track F/R | Hub Type | Geometry Status |
|---|---|---|---|---|---|---|
| `nissan_gtr_r35_nismo` | Nissan GT-R Nismo (R35) | 2022 | 2780mm | 1600 / 1600mm | 5x114.3mm | Schema 2.0 Procedural Assembly |
| `toyota_supra_a90_gr` | Toyota GR Supra (A90) | 2021 | 2470mm | 1594 / 1589mm | 5x112mm | Schema 2.0 Procedural Assembly |
| `mazda_rx7_fd3s_spirit_r` | Mazda RX-7 Spirit R (FD3S) | 2002 | 2425mm | 1460 / 1460mm | 5x114.3mm | Schema 2.0 Procedural Assembly |
| `honda_nsx_type_s` | Honda/Acura NSX Type S (NC1)| 2022 | 2630mm | 1656 / 1618mm | 5x120mm | Schema 2.0 Procedural Assembly |
| `nissan_skyline_gtr_r34_vspec`| Nissan Skyline GT-R R34 V-Spec| 2001 | 2665mm | 1480 / 1490mm | 5x114.3mm | Schema 2.0 Procedural Assembly |
| `subaru_wrx_sti_s209` | Subaru WRX STI S209 | 2020 | 2650mm | 1540 / 1540mm | 5x114.3mm | Schema 2.0 Procedural Assembly |

### 3.5 Muscle Cars (6 Vehicles)
| Vehicle ID | Make & Model | Year | Wheelbase | Track F/R | Hub Type | Geometry Status |
|---|---|---|---|---|---|---|
| `ford_mustang_shelby_gt500` | Ford Mustang Shelby GT500 | 2021 | 2720mm | 1615 / 1650mm | 5x114.3mm | Schema 2.0 Procedural Assembly |
| `dodge_challenger_demon_170`| Dodge Challenger SRT Demon 170| 2023 | 2950mm | 1667 / 1660mm | 5x115mm | Schema 2.0 Procedural Assembly |
| `chevrolet_corvette_c7_zr1` | Chevrolet Corvette ZR1 (C7) | 2019 | 2710mm | 1600 / 1580mm | 5x120.65mm | Schema 2.0 Procedural Assembly |
| `dodge_charger_hellcat_redeye`| Dodge Charger Hellcat Redeye | 2022 | 3100mm | 1667 / 1660mm | 5x115mm | Schema 2.0 Procedural Assembly |
| `cadillac_ct5_v_blackwing` | Cadillac CT5-V Blackwing | 2023 | 2947mm | 1595 / 1580mm | 5x120mm | Schema 2.0 Procedural Assembly |
| `ford_mustang_dark_horse` | Ford Mustang Dark Horse | 2024 | 2718mm | 1582 / 1613mm | 5x114.3mm | Schema 2.0 Procedural Assembly |

### 3.6 Luxury Grand Tourers (6 Vehicles)
| Vehicle ID | Make & Model | Year | Wheelbase | Track F/R | Hub Type | Geometry Status |
|---|---|---|---|---|---|---|
| `rolls_royce_phantom_viii` | Rolls-Royce Phantom VIII | 2022 | 3552mm | 1687 / 1670mm | 5x120mm | Schema 2.0 Procedural Assembly |
| `bentley_continental_gt_speed`| Bentley Continental GT Speed| 2022 | 2851mm | 1672 / 1664mm | 5x130mm | Schema 2.0 Procedural Assembly |
| `mercedes_amg_s63_e_perf` | Mercedes-AMG S63 E Perf. | 2023 | 3216mm | 1655 / 1683mm | 5x112mm | Schema 2.0 Procedural Assembly |
| `aston_martin_dbs_superleggera`| Aston Martin DBS Superleggera| 2021 | 2805mm | 1665 / 1645mm | 5x128mm | Schema 2.0 Procedural Assembly |
| `porsche_panamera_turbo_s` | Porsche Panamera Turbo S | 2022 | 2950mm | 1671 / 1650mm | 5x130mm | Schema 2.0 Procedural Assembly |
| `bmw_m8_competition_coupe` | BMW M8 Competition Coupe | 2022 | 2827mm | 1627 / 1632mm | 5x112mm | Schema 2.0 Procedural Assembly |

### 3.7 Track & Prototype Cars (6 Vehicles)
| Vehicle ID | Make & Model | Year | Wheelbase | Track F/R | Hub Type | Geometry Status |
|---|---|---|---|---|---|---|
| `ktm_x_bow_gtx` | KTM X-Bow GTX | 2021 | 2600mm | 1640 / 1610mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `bac_mono_r` | BAC Mono R | 2020 | 2565mm | 1485 / 1485mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `radical_sr10` | Radical SR10 | 2021 | 2370mm | 1340 / 1380mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `caterham_seven_620r` | Caterham Seven 620R | 2020 | 2225mm | 1336 / 1336mm | 4x108mm | Schema 2.0 Procedural Assembly |
| `donkervoort_d8_gto_jd70` | Donkervoort D8 GTO-JD70 | 2020 | 2350mm | 1400 / 1440mm | 5x108mm | Schema 2.0 Procedural Assembly |
| `ariel_atom_4` | Ariel Atom 4 | 2021 | 2345mm | 1600 / 1600mm | 4x100mm | Schema 2.0 Procedural Assembly |

### 3.8 Special Edition & Concept (6 Vehicles)
| Vehicle ID | Make & Model | Year | Wheelbase | Track F/R | Hub Type | Geometry Status |
|---|---|---|---|---|---|---|
| `ferrari_monza_sp2` | Ferrari Monza SP2 | 2019 | 2720mm | 1688 / 1678mm | 5x114.3mm | Schema 2.0 Procedural Assembly |
| `aston_martin_v12_speedster`| Aston Martin V12 Speedster | 2021 | 2805mm | 1665 / 1645mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `lamborghini_sian_fkp_37` | Lamborghini Sián FKP 37 | 2020 | 2700mm | 1720 / 1680mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `bugatti_bolide` | Bugatti Bolide | 2021 | 2750mm | 1750 / 1660mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `mclaren_elva` | McLaren Elva | 2021 | 2670mm | 1674 / 1629mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |
| `porsche_935_2019` | Porsche 935 (991.2 Moby Dick)| 2019 | 2457mm | 1677 / 1657mm | Center-Lock 84mm | Schema 2.0 Procedural Assembly |

---

## 4. Modular Swappable Components Catalog (48+ Items)

Located in `src/geometry/components/vehicleComponentCatalog.ts`:

### 4.1 Aerodynamics (11 Items)
1. `svj_aero_wing`: Active ALA carbon twin-pylon swan-neck wing (Lamborghini OEM)
2. `pista_blown_spoiler`: Integrated aerodynamic decklid blown spoiler (Ferrari OEM)
3. `gt3rs_swan_drs_wing`: Multi-element hydraulic DRS swan-neck high wing (Porsche OEM)
4. `chiron_retractable_airbrake`: Variable angle hydraulic dual-ram airbrake (Bugatti OEM)
5. `gt3_cup_carbon_wing`: 1750mm high-downforce GT3 endurance race wing (Universal)
6. `f1_style_shark_fin`: Carbon longitudinal yaw stabilizer fin (Universal)
7. `vortex_generator_roof_spoilers`: 9-element delta vortex generator strip (Universal)
8. `carbon_front_splitter_gt3`: Triple-plane vented carbon front splitter with underbody diffuser tunnels
9. `svj_front_active_flaps`: Lamborghini ALA active front intake flaps
10. `venturi_rear_diffuser_extreme`: 6-channel carbon rear diffuser with strakes
11. `canards_dual_dive_planes`: Dual-element carbon dive planes (L/R)

### 4.2 Body Panels & Kits (10 Items)
1. `gt3rs_vented_fenders_front`: Carbon louvred top vents + cutaway rear wheel relief
2. `svj_side_air_scoops`: Enlarged hexagonal radiator intake nacelles
3. `pista_s_duct_hood`: Central airflow duct with high-downforce exit channel
4. `widebody_overfenders_front`: +45mm bolt-on composite flared overfenders
5. `widebody_overfenders_rear`: +65mm bolt-on composite flared overfenders
6. `carbon_fiber_lightweight_doors`: Dry carbon monocoque doors with polycarbonate window inserts
7. `roof_scoop_carbon`: NACA overhead ram-air roof scoop
8. `ducktail_decklid_spoiler`: Integrated retro ducktail trunk replacement
9. `transparent_engine_bonnet`: Polycarbonate louvered engine cover
10. `rear_bumper_delete_mesh`: Weight-saving exposed tubular crash-bar rear mesh

### 4.3 Wheels & Braking Systems (11 Items)
1. `porsche_centerlock_gt3`: 20x9.5J front, 21x12J rear Forged lightweight wheels
2. `svj_leirion_forged`: 20x9J front, 21x13J rear Center-Lock Y-spoke forged alloys
3. `bbs_fi_r_ultralight`: 19x9J front, 19x11J rear Monobloc forged 5-spoke wheels
4. `rotiform_aerodisc_turbofan`: 19x8.5J Retro turbofan aerodynamic wheel covers
5. `carbon_revolution_cr9`: Full carbon-fiber 1-piece barrel & face wheels
6. `volk_te37_ultra_track`: 19x9.5J classic 6-spoke forged JDM wheels
7. `hrewheels_p101sc`: 20x9.5J custom forged mesh wheels
8. `carbon_ceramic_rotors_420`: 420mm drilled carbon-ceramic brake discs + 10-piston calipers
9. `brembo_gt_slotted_380`: 380mm slotted steel racing discs + 6-piston monobloc calipers
10. `endurance_racing_calipers`: Monobloc billet titanium ventilated endurance calipers
11. `center_lock_titanium_nut`: Anodized red/blue safety-wired center-lock nuts

### 4.4 Interior & Cockpit (8 Items)
1. `recaro_podium_carbon_seat`: FIA-certified carbon bucket seats
2. `sparco_circuit_qrt`: Full halo head-restraint race seats
3. `gt3_rs_alcantara_steering`: 360mm Alcantara motorsport wheel with yellow 12 o'clock marker and rotary dials
4. `f1_yoke_steering_wheel`: Open-top carbon yoke with integrated OLED display and telemetry LEDs
5. `weissach_titanium_roll_cage`: Bolt-in lightweight titanium 4-point half cage
6. `fia_full_roll_cage`: 6-point weld-in T45 tubular steel roll cage
7. `stripped_interior_doorcards`: Carbon fiber bare door cards with RS pull straps
8. `digital_motec_dash_cluster`: MoTeC C127 race display with programmable shift lights

### 4.5 Exhaust Systems (5 Items)
1. `svj_high_mount_dual_exhaust`: Inconel top-mounted center flame-spitting exhaust
2. `gt3rs_titanium_center_pipes`: Dual center-exit titanium megaphone exhaust
3. `f1_screamer_quad_pipes`: Equal-length catless quad high-pitch titanium exhaust
4. `side_exit_nascar_boomtubes`: Flat oval rocker-panel side exit exhaust pipes
5. `valvetronic_titanium_catback`: Dual-mode electronically valved sport exhaust

### 4.6 Suspension & Stance (5 Items)
1. `bilstein_clubsport_coilovers`: 2-way adjustable inverted monotube coil-over suspension
2. `kw_competition_v4`: 3-way adjustable racing damper system with external reservoirs
3. `air_lift_performance_3h`: Digital air suspension with height & pressure sensors
4. `titanium_front_strut_brace`: Triangular cross-chassis strut tower reinforcement
5. `camber_caster_adjustable_plates`: Billet aluminum top-mount plates (up to -4.5° camber)

---

## 5. Hub & Fitment Compatibility Specifications

| Bolt Pattern / Hub Spec | PCD Diameter | Hub Bore | Sample OEM Cars | Fitment Rule |
|---|---|---|---|---|
| **Center-Lock 84mm** | Single Nut (0mm) | 84.0mm | Porsche GT3 RS, Lamborghini SVJ, Bugatti Chiron, Koenigsegg Jesko | Incompatible with 4/5-Lug without Hub Adapter |
| **5x114.3mm (5x4.5")** | 114.3mm | 66.1mm - 67.1mm | Ferrari 488 Pista, Nissan GT-R R35, Mazda RX-7, Toyota Supra MK4 | Direct Fit across JDM & Ferrari |
| **5x112mm** | 112.0mm | 66.6mm | Audi R8, Toyota Supra A90, BMW M4, Mercedes-AMG GT | Direct Fit across VAG, BMW G-Series & modern Supra |
| **5x120mm** | 120.0mm | 72.6mm - 70.3mm | Chevrolet Corvette C8, BMW M3 E92, Cadillac CT5-V | Direct Fit across GM & classic BMW |
| **5x130mm** | 130.0mm | 71.6mm | Porsche 911 (5-lug), Bentley Continental GT | Direct Fit across 5-lug Porsche / VAG GTs |
