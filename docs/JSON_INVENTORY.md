# AUTOVERSE 3D — COMPLETE JSON INVENTORY

## 1. Schema Classification Breakdown
The 211 JSON files in `public/vehicles/` fall into three architectural categories:

| Category | File Count | Schema Format | Description |
|---|---|---|---|
| **AutoVerse 50 Vehicle Library** | 50 | `schemaVersion: "2.0"` | High-detail componentized vehicles organized into category subdirectories (`supercars`, `hypercars`, `sports_cars`, `luxury_cars`, `jdm_cars`, `muscle_cars`, `track_cars`, `special_edition`). |
| **Parametric Reference Pilots** | 8 | `schema_version: "1.0.0"` / `parametric` | Fully dimension-anchored reference files with longitudinal sections, wheel coordinates, and aerodynamics. |
| **Cherax Legacy Ingests** | 153 | `format: "Cherax Entity"` | GTA V entity dump files containing model hashes, wheel types, extras, and color palettes. |
| **Total Inventory** | **211** | Full Catalog | 100% indexed and tracked. |

## 2. AutoVerse 50 Model Inventory by Category

### Hypercars (10 models)
1. `hypercars/aston_martin_valkyrie.json` (Aston Martin Valkyrie)
2. `hypercars/bugatti_bolide.json` (Bugatti Bolide)
3. `hypercars/bugatti_chiron.json` (Bugatti Chiron)
4. `hypercars/ferrari_laferrari.json` (Ferrari LaFerrari)
5. `hypercars/koenigsegg_jesko.json` (Koenigsegg Jesko)
6. `hypercars/koenigsegg_regera.json` (Koenigsegg Regera)
7. `hypercars/mclaren_p1.json` (McLaren P1)
8. `hypercars/pagani_huayra.json` (Pagani Huayra)
9. `hypercars/pagani_utopia.json` (Pagani Utopia)
10. `hypercars/porsche_918_spyder.json` (Porsche 918 Spyder)

### Supercars (10 models)
1. `supercars/ferrari_296_gtb.json` (Ferrari 296 GTB)
2. `supercars/ferrari_488_pista.json` (Ferrari 488 Pista)
3. `supercars/ferrari_f8_tributo.json` (Ferrari F8 Tributo)
4. `supercars/ferrari_sf90_stradale.json` (Ferrari SF90 Stradale)
5. `supercars/lamborghini_aventador_svj.json` (Lamborghini Aventador SVJ)
6. `supercars/lamborghini_huracan_sto.json` (Lamborghini Huracán STO)
7. `supercars/lamborghini_revuelto.json` (Lamborghini Revuelto)
8. `supercars/mclaren_720s.json` (McLaren 720S)
9. `supercars/mclaren_765lt.json` (McLaren 765LT)
10. `supercars/mclaren_artura.json` (McLaren Artura)

### Sports Cars (10 models)
1. `sports_cars/audi_r8_v10_performance.json` (Audi R8 V10 Performance)
2. `sports_cars/bmw_m4_csl.json` (BMW M4 CSL)
3. `sports_cars/chevrolet_corvette_c8_z06.json` (Chevrolet Corvette C8 Z06)
4. `sports_cars/ford_gt.json` (Ford GT)
5. `sports_cars/lexus_lfa.json` (Lexus LFA)
6. `sports_cars/mercedes_amg_gt_r.json` (Mercedes-AMG GT R)
7. `sports_cars/nissan_gt_r_r35.json` (Nissan GT-R R35)
8. `sports_cars/porsche_911_gt3_rs.json` (Porsche 911 GT3 RS)
9. `sports_cars/porsche_911_turbo_s.json` (Porsche 911 Turbo S)
10. `sports_cars/toyota_gr_supra.json` (Toyota GR Supra)

### Luxury Cars (10 models)
1. `luxury_cars/aston_martin_db12.json` (Aston Martin DB12)
2. `luxury_cars/bentley_continental_gt.json` (Bentley Continental GT)
3. `luxury_cars/bentley_flying_spur.json` (Bentley Flying Spur)
4. `luxury_cars/bmw_7_series.json` (BMW 7 Series)
5. `luxury_cars/maserati_mc20.json` (Maserati MC20)
6. `luxury_cars/mercedes_benz_s_class.json` (Mercedes-Benz S-Class)
7. `luxury_cars/mercedes_maybach_s_class.json` (Mercedes-Maybach S-Class)
8. `luxury_cars/porsche_panamera_turbo.json` (Porsche Panamera Turbo)
9. `luxury_cars/rolls_royce_spectre.json` (Rolls-Royce Spectre)
10. `luxury_cars/rolls_royce_wraith.json` (Rolls-Royce Wraith)

### JDM Performance (5 models)
1. `jdm_cars/honda_nsx.json` (Honda NSX NA1)
2. `jdm_cars/mazda_rx_7_fd.json` (Mazda RX-7 FD3S)
3. `jdm_cars/mitsubishi_lancer_evolution_ix.json` (Mitsubishi Lancer Evolution IX)
4. `jdm_cars/nissan_skyline_gt_r_r34.json` (Nissan Skyline GT-R R34)
5. `jdm_cars/subaru_wrx_sti.json` (Subaru WRX STI)

### Muscle Cars (3 models)
1. `muscle_cars/chevrolet_camaro_zl1.json` (Chevrolet Camaro ZL1)
2. `muscle_cars/dodge_challenger_srt_demon_170.json` (Dodge Challenger SRT Demon 170)
3. `muscle_cars/ford_mustang_shelby_gt500.json` (Ford Mustang Shelby GT500)

### Track Special & Special Edition (2 models)
1. `track_cars/ferrari_fxx_k_evo.json` (Ferrari FXX-K Evo)
2. `special_edition/porsche_935.json` (Porsche 935)
