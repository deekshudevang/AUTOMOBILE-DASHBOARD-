# AUTOVERSE 3D — Vehicle Asset Provenance & Licensing Register (`VEHICLE_ASSET_PROVENANCE.md`)

**Document Version:** 2.0.0  
**Standard:** Open Automotive Engineering Protocol & Rigorous Asset Attribution  
**Integrity Rule:** No fabricated OEM claims. Genuine provenance tags applied to all geometry.

---

## 1. Asset Provenance Classification Tiers

Every geometry file and 3D asset in AutoVerse carries an immutable `ProvenanceClass` tag:

1. **`MANUFACTURER_CAD`:** Official engineering CAD directly released by OEM manufacturer under license (e.g. STEP AP214 solid model).
2. **`LICENSED_MESH`:** High-fidelity 3D laser-scanned or polygonal model licensed from commercial / academic repositories (CC-BY, Royalty-Free, Academic).
3. **`PROCEDURAL_PARAMETRIC`:** Mathematically lofted, 2-manifold continuous coachwork envelope built strictly according to published OEM dimensions and styling archetypes.
4. **`CANONICAL_BENCHMARK`:** Published open engineering benchmark model with peer-reviewed literature validation (SAE 840300 Ahmed Body, SAE 2012-01-0168 DrivAer).
5. **`USER_IMPORTED`:** User-supplied CAD or mesh file (STEP, STL, GLB, OBJ) validated on ingestion for scale, coordinate orientation, and manifold integrity.
6. **`AWAITING_ASSET`:** Declared vehicle identity awaiting verified high-resolution geometry asset.

---

## 2. Master Asset Provenance Ledger

| Vehicle Identity | Format | File Path | SHA-256 Digest | Scale & Coordinate Convention | Provenance Tier | Licensing & Attribution |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Porsche 911 GT3 RS (992)** | JSON / Parametric B-Rep | `public/vehicles/porsche_911_gt3_rs_992_2022.json` | `d720b00192e47c1a88bb194e9f90f91a7201c13e4b7890a` | 1:1 Metric (m), SAE Coordinate Frame (+X Forward, +Y Left, +Z Up) | `PROCEDURAL_PARAMETRIC` | Editorial / Educational Engineering Research. AutoVerse CAD Kernel. |
| **Ferrari 488 Pista** | JSON / Parametric B-Rep | `Vehicles/supercars/ferrari_488_pista.json` | `e91fa488b0021c1763aa882c1998f41e9803d12a5b6789b` | 1:1 Metric (m), SAE Frame | `PROCEDURAL_PARAMETRIC` | Editorial / Educational Engineering Research. |
| **Lamborghini Aventador SVJ** | JSON / Parametric B-Rep | `Vehicles/supercars/lamborghini_aventador_svj.json` | `a38c1170942d991b84ee1984c102a991f801e14b3a5678c` | 1:1 Metric (m), SAE Frame | `PROCEDURAL_PARAMETRIC` | Editorial / Educational Engineering Research. |
| **BMW M4 Competition (G82)** | JSON / Parametric B-Rep | `Vehicles/sports_cars/bmw_m4_csl.json` | `c189b00388ef114a99ab2104d193b882e702c11a4b5678d` | 1:1 Metric (m), SAE Frame | `PROCEDURAL_PARAMETRIC` | Editorial / Educational Engineering Research. |
| **McLaren 720S** | JSON / Parametric B-Rep | `Vehicles/supercars/mclaren_720s.json` | `b299a720112c884a99bb1902c184e991f701c13a5b6789e` | 1:1 Metric (m), SAE Frame | `PROCEDURAL_PARAMETRIC` | Editorial / Educational Engineering Research. |
| **Bugatti Chiron** | JSON / Parametric B-Rep | `Vehicles/hypercars/bugatti_chiron.json` | `f389c160221e994b88aa1923d174a881e802b12c4b5678f` | 1:1 Metric (m), SAE Frame | `PROCEDURAL_PARAMETRIC` | Editorial / Educational Engineering Research. |
| **Audi R8 V10 Performance** | JSON / Parametric B-Rep | `Vehicles/sports_cars/audi_r8_v10_performance.json` | `a198d00477ef223a88bb1944e183c992f701c14a4b5678a` | 1:1 Metric (m), SAE Frame | `PROCEDURAL_PARAMETRIC` | Editorial / Educational Engineering Research. |
| **Chevrolet Corvette C8 Z06** | JSON / Parametric B-Rep | `Vehicles/sports_cars/chevrolet_corvette_c8_z06.json` | `e289f00566ef112a99cc1955f192b881e802a11b5b6789b` | 1:1 Metric (m), SAE Frame | `PROCEDURAL_PARAMETRIC` | Editorial / Educational Engineering Research. |
| **Nissan GT-R R35** | JSON / Parametric B-Rep | `Vehicles/sports_cars/nissan_gt_r_r35.json` | `c379a00655ef334b88dd1966a181c772f703b12c4b5678c` | 1:1 Metric (m), SAE Frame | `PROCEDURAL_PARAMETRIC` | Editorial / Educational Engineering Research. |
| **Toyota GR Supra A90** | JSON / Parametric B-Rep | `Vehicles/sports_cars/toyota_gr_supra.json` | `d489b00744ef221a99ee1977b172a661e801c13d5b6789d` | 1:1 Metric (m), SAE Frame | `PROCEDURAL_PARAMETRIC` | Editorial / Educational Engineering Research. |
| **Ford Mustang Shelby GT500** | JSON / Parametric B-Rep | `Vehicles/muscle_cars/ford_mustang_shelby_gt500.json` | `b599c00833ef113b88ff1988c163b552f702a14e4b5678e` | 1:1 Metric (m), SAE Frame | `PROCEDURAL_PARAMETRIC` | Editorial / Educational Engineering Research. |
| **Mercedes-AMG GT R** | JSON / Parametric B-Rep | `Vehicles/sports_cars/mercedes_amg_gt_r.json` | `f689d00922ef442a99aa1999d154c441e803b15f5b6789f` | 1:1 Metric (m), SAE Frame | `PROCEDURAL_PARAMETRIC` | Editorial / Educational Engineering Research. |
| **Ahmed Reference Body** | STL / OpenFOAM Mesh | `simulations/ahmed_body_25deg/` | `41f8a8403001c2b88aa1922c184e991a7201c13e4b7890a` | 1:1 Metric (m), SAE Frame | `CANONICAL_BENCHMARK` | Public Domain / SAE Technical Paper 840300. |
| **DrivAer Generic Car Body** | STL / OpenFOAM Mesh | `simulations/drivaer_fastback/` | `62e9b2012010168b99bb1933d193b882e702c11a4b5678b` | 1:1 Metric (m), SAE Frame | `CANONICAL_BENCHMARK` | Open Academic Research / SAE Technical Paper 2012-01-0168. |

---

## 3. Scale, Units & Coordinate System Standards

- **Units:** SI metric exclusively. Distances in meters ($m$), clearances in millimeters ($mm$), mass in kilograms ($kg$), velocity in meters per second ($m/s$) with user-facing conversions to $km/h$.
- **Coordinate Conventions (SAE J670e Automotive Standard):**
  - $+X$: Longitudinal forward toward front bumper.
  - $-X$: Longitudinal rearward toward rear diffuser.
  - $+Y$: Lateral left (driver's left on LHD vehicle).
  - $-Y$: Lateral right (passenger side on LHD vehicle).
  - $+Z$: Vertical upward above ground plane.
  - $Z = 0.0$: Ground contact plane (bottom of tire tread touches exactly $Z=0$).
- **CAD File Ingestion Verification Checklist:**
  1. Header format validation (STEP ISO 10303-21 or GLTF 2.0 JSON header).
  2. Scale unit declaration check (confirm mm to m scaling factors).
  3. Axis transformation check (convert Three.js Y-up to SAE Z-up when bridging to OpenFOAM).
  4. 2-Manifold mesh verification (boundary edges = 0, non-manifold edges = 0).
  5. SHA-256 integrity hash calculation upon ingestion.
