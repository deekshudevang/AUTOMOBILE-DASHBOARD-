# AUTOVERSE 3D — Comprehensive Fleet Geometry & Defect Audit

Generated: Sun, 15 Nov 2026 15:01:53 GMT

## 1. Fleet Reconciliation & Exact Inventory

The user noted an apparent disparity between **58 in the fleet library** and **188 in the general library**. Our exact audit reconciles these numbers:

| Inventory Dimension | Count | Description / Root Cause |
| :--- | :--- | :--- |
| **Fleet Library Assets** | **58** | 50 high-detail Schema 2.0 models in category subfolders + 8 core parametric templates. |
| **Registered Library Models** | **188** | 108 legacy Cherax entity definitions + 50 Schema 2.0 models + 8 manifest bindings + 22 addon variants registered in `useVehicleStore`. |
| **Total Vehicle Files on Disk** | **210** | 160 vehicle files in `public/vehicles/` root + 50 Schema 2.0 files in subfolders. |

---

## 2. Geometry Format & Fidelity Tier Distribution

| Format | Count | Fidelity Tier | Geometry Architecture | Componentization |
| :--- | :--- | :--- | :--- | :--- |
| **Schema 2.0** | 50 | **Tier B – Spec-accurate** | Discrete 3D mesh nodes with lofted body cross-sections | 25 – 35 separable components per vehicle |
| **Parametric V1** | 51 | **Tier B – Spec-accurate** | Lofted longitudinal cross-sections & procedural appendages | 8 separable groups |
| **Cherax Legacy** | 108 | **Tier C – Approximate** | Monolithic single-mesh primitive body | 0 separable components (Wheels/Panels baked in) |
| **Total Fleet** | **209** | — | — | — |

---

## 3. Fleet Archetype Grouping

Shared procedural coachbuilding generators are grouped by automotive chassis layout and aerodynamic packaging:

| Archetype ID | Archetype Description | Vehicle Count | Key Representative Models |
| :--- | :--- | :--- | :--- |
| `front_engine_gt_coupe` | front_engine_gt_coupe | **109** | 10F Red-Carbon, 2018_AudiRS3_Sedan, 2018_AudiRS5_Coupe |
| `rear_engine_coupe` | rear_engine_coupe | **11** | 2011_Porsche_911GT2RS_997-2, CometS2, Pfister Growler  Oak Green |
| `mid_engine_supercar` | mid_engine_supercar | **32** | 2015_LamborghiniHuracan_LP620-2, NSX Type S, audi r8 ( custom ) |
| `mid_engine_hypercar` | mid_engine_hypercar | **18** | 2020_Koenigsegg_Jesko_Absolut, Valkyrie, Chiron Super Sport |
| `front_engine_sports_car` | front_engine_sports_car | **18** | 2F2FSUPRA, 2F2FSUPRA_Retro_Shade, blue buffalo |
| `jdm_tuner_performance` | jdm_tuner_performance | **15** | Elegy Retro Custom, FXX-K Evo, gtr |
| `track_special_prototype` | track_special_prototype | **1** | Essenza SCV12 |
| `luxury_super_sedan` | luxury_super_sedan | **4** | Flying Spur, S-Class, Panamera Turbo |
| `super_suv_crossover` | super_suv_crossover | **1** | urus |

---

## 4. Defect Ranking & Pilot Selection

To systematically resolve geometry defects without risky broad churn, three representative vehicles have been selected as the **Phase E Pilot Set**:

### Pilot Vehicle 1: Porsche 911 GT3 RS (992, 2022)
- **Archetype**: `rear_engine_coupe`
- **Defects Observed**: Monolithic body in Cherax legacy; faceted hood/roof; hovering detached slats; wheels not integrated; rear wing uprights floating without anchor points.
- **Pilot Objective**: Establish continuous fastback roofline, flared haunches, cutout wheel arches, swan-neck wing mount, and discrete wheel/tyre/caliper assemblies.

### Pilot Vehicle 2: Ferrari 488 Pista (2018)
- **Archetype**: `mid_engine_supercar`
- **Defects Observed**: Missing S-duct front bonnet downforce channel; lacks flying buttress air intakes; generic materials; missing rear diffuser strakes.
- **Pilot Objective**: Establish mid-engine aerodynamic packaging with front S-duct channel, side intercooler scoops, and rear blown spoiler.

### Pilot Vehicle 3: Lamborghini Aventador SVJ (2018)
- **Archetype**: `mid_engine_hypercar`
- **Defects Observed**: Overly soft curvature on an angular wedge supercar; ALA 2.0 active aero wing floating; generic wheels.
- **Pilot Objective**: Establish low wedge geometry, crisp character creases, hexagonal motifs, and authentic center-lock wheel fitment.

---

## 5. Detailed Vehicle Audit Manifest

| File | Archetype | Format | Tier | Components | Triangle Est. | Defect Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `10F Red-Carbon.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `2011_Porsche_911GT2RS_997-2.json` | `rear_engine_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `2015_LamborghiniHuracan_LP620-2.json` | `mid_engine_supercar` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `2018_AudiRS3_Sedan.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `2018_AudiRS5_Coupe.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `2020_Koenigsegg_Jesko_Absolut.json` | `mid_engine_hypercar` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `2F2FSUPRA.json` | `front_engine_sports_car` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `2F2FSUPRA_Retro_Shade.json` | `front_engine_sports_car` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `760 LH.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `AA  max upgraded.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `acura_nsx_type_s_2022.json` | `mid_engine_supercar` | `parametric_v1` | **Tier** | 8 | 82,400 | `MEDIUM` |
| `AElhAfs.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `alfa romeo giulia red.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `all blue circuit board electric.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `alpine_a110_r_2023.json` | `front_engine_gt_coupe` | `parametric_v1` | **Tier** | 8 | 82,400 | `MEDIUM` |
| `ANNIS ZR360 DRIFT.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `aston_martin_valkyrie_2022.json` | `mid_engine_hypercar` | `parametric_v1` | **Tier** | 8 | 82,400 | `MEDIUM` |
| `audi r8 ( custom ).json` | `mid_engine_supercar` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `AudiBenny.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `audi_r8_v10_performance_2022.json` | `mid_engine_supercar` | `parametric_v1` | **Tier** | 8 | 82,400 | `MEDIUM` |
| `Banshee GTS.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `Benefactor LRC GT v1.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `Benefactor LRC GT v2.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `BEntley.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `blackblueScramjet.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `Blista F1.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `blue buffalo.json` | `front_engine_sports_car` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `blue collar rig.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `bmw (1).json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `BMW M3 MINT GREEN.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `BMW.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `Bmw5.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `bmw_m4_csl_2023.json` | `front_engine_sports_car` | `parametric_v1` | **Tier** | 8 | 82,400 | `MEDIUM` |
| `Bravado Gauntled Mod.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `broomstick.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `bugatti_chiron_super_sport_2022.json` | `mid_engine_hypercar` | `parametric_v1` | **Tier** | 8 | 82,400 | `MEDIUM` |
| `C6.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `CANTUCCIA.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `Cartuccia GT.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `chevrolet_camaro_zl1_1le_2022.json` | `front_engine_sports_car` | `parametric_v1` | **Tier** | 8 | 82,400 | `MEDIUM` |
| `chevrolet_corvette_c7_zr1_2019.json` | `front_engine_sports_car` | `parametric_v1` | **Tier** | 8 | 82,400 | `MEDIUM` |
| `chevrolet_corvette_z06_2023.json` | `front_engine_gt_coupe` | `parametric_v1` | **Tier** | 8 | 82,400 | `MEDIUM` |
| `coil 2.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `CometS2.json` | `rear_engine_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `copo.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `Cyclone II by Ram.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `cyper.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `defendybob.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `Deluxo Modded.json` | `front_engine_gt_coupe` | `cherax_entity_legacy` | **Tier** | 0 | 14,200 | `HIGH` |
| `dodge_challenger_srt_demon_170_2023.json` | `front_engine_sports_car` | `parametric_v1` | **Tier** | 8 | 82,400 | `MEDIUM` |
| *(and 159 additional vehicles detailed in `docs/vehicle-audit.json`)* | — | — | — | — | — | — |
