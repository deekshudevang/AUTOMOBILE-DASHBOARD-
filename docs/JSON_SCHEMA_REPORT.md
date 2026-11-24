# AUTOVERSE 3D — JSON Intelligence & Schema Analysis Report

> **Generated**: 2026-11-10T13:39:39.180Z  
> **Source Directory**: `Vehicles/`  
> **Total Files Scanned**: 108  
> **Total Valid JSON Files**: 108  
> **Unique Vehicle Models Detected**: 74  
> **Duplicate Configuration Sets Detected**: 1  

---

## 1. Executive Summary & Format Overview

Every configuration file in the repository conforms to the **Cherax Entity Specification (Type 1: Vehicle)**.
- **Root Format Identifier**: `"Cherax Entity"` (108/108, 100%)
- **Entity Type**: `1` (Vehicle) (108/108, 100%)
- **Model Identifier Scheme**: 32-bit unsigned Jenkins One-At-A-Time (`joaat`) hash corresponding to GTA vehicle hashes.
- **Reverse Hash Resolution**: 100% of all 74 unique model IDs successfully mapped to their GTA vehicle archetype and real-world automotive counterpart.

---

## 2. Property Frequency & Schema Analysis

The table below catalogs every discovered key in the JSON dataset, its frequency, data type, and implementation status in AUTOVERSE 3D:

| Property | Occurrences | Frequency | Type | Schema Description | Customizer Support |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `format` | 108/108 | 100% | `string` | File format declaration (`"Cherax Entity"`) | Core Header |
| `type` | 108/108 | 100% | `integer` | Entity type index (1 = Vehicle) | Core Header |
| `model` | 108/108 | 100% | `integer (u32)` | 32-bit vehicle hash mapping to 3D asset | Asset Loader |
| `baseFlags` | 108/108 | 100% | `integer` | Game engine entity state flags | Inspected / Preserved |
| `mods` | 108/108 | 100% | `object (mod0..mod49)` | Vehicle tuning mod slots with index & variation | Mod Engine |
| `extras` | 87/108 | 80.5% | `object (extra0..extra15)` | Auxiliary vehicle sub-parts / toggles | Extras Manager |
| `wheelType` | 108/108 | 100% | `integer (0..12)` | Rim category (Sport, Tuner, Bennys, etc.) | Wheel Engine |
| `wheelColor` | 108/108 | 100% | `integer (0..160)` | Palette color index for rims | Wheel Paint |
| `primaryColor` | 108/108 | 100% | `integer (0..160)` | Palette color index for primary bodywork | Body Paint |
| `isPrimaryColorCustom` | 108/108 | 100% | `boolean` | Whether custom RGB overrides palette index | Body Paint |
| `customPrimaryColor` | 108/108 | 100% | `{ r, g, b }` | Direct 24-bit sRGB color for primary paint | Body Paint |
| `secondaryColor` | 108/108 | 100% | `integer (0..160)` | Palette color index for secondary accents | Body Paint |
| `isSecondaryColorCustom` | 108/108 | 100% | `boolean` | Whether custom RGB overrides secondary index | Body Paint |
| `customSecondaryColor` | 108/108 | 100% | `{ r, g, b }` | Direct 24-bit sRGB color for secondary paint | Body Paint |
| `pearlescentColor` | 108/108 | 100% | `integer (0..160)` | Pearlescent optical clearcoat shift index | Clearcoat Shader |
| `windowTint` | 108/108 | 100% | `integer (0..6)` | Glass opacity & tint level | PBR Glass Material |
| `neonKits` | 108/108 | 100% | `{ left, right, front, back, color }` | Underglow lighting status and RGB color | Neon Engine |
| `tyreSmokeColor` | 108/108 | 100% | `{ r, g, b }` | Particle burnout smoke RGB color | Physics & FX |
| `interiorColor` | 108/108 | 100% | `integer (0..160)` | Cabin trim and seat leather palette color | Interior PBR |
| `dashBoardColor` | 108/108 | 100% | `integer (0..160)` | Instrument cluster & dashboard trim color | Interior PBR |
| `plateText` | 108/108 | 100% | `string (8 chars)` | License plate alphanumeric string | Plate Generator |
| `plateTextIndex` | 108/108 | 100% | `integer (0..5)` | Plate background style (Blue, Yellow, Yankton) | Plate Generator |
| `bulletproofTyres` | 87/108 | 80.5% | `boolean` | Tyre puncture resistance flag | Chassis Physics |
| `driftTyres` | 87/108 | 80.5% | `boolean` | Low-friction compound drift tyres | Chassis Physics |
| `attachments` | 5/108 | 4.6% | `array of entities` | Linked child objects (e.g. broomstick rocket pods) | Modular Mesh Engine |
| `_creatorSignature` | 3/108 | 2.8% | `string` | Metadata signature from custom export tools | Metadata Tag |

---

## 3. Duplicate Configurations Detected

The following files share 100% identical JSON serialization:
1. **Duplicate Set**: `2F2FSUPRA_Retro_Shade.json` <==> `lulli.json`

---

## 4. Vehicle Model Registry (74 Unique Models)

Categorized breakdown across all 74 unique models:

| Manufacturer | In-Game Archetype | Real-World Vehicle | Model Hash | Configurations | Category |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Obey** | `tenf2` (10F Widebody) | **Audi R8 Gen 2 Widebody (Prior Design)** | `274946574` | 2 config(s) | Supercar |
| **Pfister** | `comet5` (Comet SR) | **Porsche 911 GT2 RS (997.2)** | `661493923` | 1 config(s) | Sports Car |
| **Pegassi** | `tempesta` (Tempesta) | **Lamborghini Huracán LP610-4 / LP620-2 Super Trofeo** | `272929391` | 1 config(s) | Supercar |
| **Obey** | `tailgater2` (Tailgater S) | **Audi RS3 Sedan (8Y)** | `3050505892` | 1 config(s) | Sports Car |
| **Obey** | `drafter` (8F Drafter) | **Audi RS5 Coupe (B9)** | `686471183` | 1 config(s) | Sports Car |
| **Overflod** | `entity3` (Entity MT) | **Koenigsegg Jesko Absolut** | `1748565021` | 1 config(s) | Supercar |
| **Dinka** | `jester3` (Jester Classic) | **Toyota Supra RZ (JZA80 / MK4)** | `4080061290` | 3 config(s) | Sports Car |
| **Overflod** | `horus` (Horus / 760 LH) | **Pagani Zonda 760 LH** | `4017955470` | 3 config(s) | Supercar |
| **Pegassi** | `velenogt` (Veleno GT) | **Lamborghini Revuelto / Aventador SVJ** | `3316510914` | 2 config(s) | Supercar |
| **Dinka** | `jester4` (Jester RR) | **Toyota GR Supra (A90 / MK5)** | `2712905841` | 1 config(s) | Sports Car |
| **Lampadati** | `komoda` (Komoda) | **Alfa Romeo Giulia Quadrifoglio** | `3460613305` | 1 config(s) | SPORT |
| **Coil** | `cyclone2` (Cyclone II) | **Rimac Nevera** | `386089410` | 3 config(s) | Supercar |
| **Annis** | `driftzr350` (ZR350) | **Mazda RX-7 FD (Drift Spec)** | `1923534526` | 2 config(s) | Sports Car |
| **Obey** | `iwagen` (I-Wagen) | **Audi e-tron GT / Q4 e-tron** | `662793086` | 1 config(s) | SUV / Offroad |
| **Bravado** | `banshee3` (Banshee GTS) | **Dodge Viper ACR (GTS Edition)** | `3634959571` | 2 config(s) | Sports Car |
| **Benefactor** | `lrcgt` (SM722 LRC GT) | **Mercedes-Benz SLR McLaren Stirling Moss** | `1494708164` | 4 config(s) | Sports Car |
| **Enus** | `deity` (Deity) | **Bentley Flying Spur Gen 3** | `1532171089` | 1 config(s) | SEDAN |
| **Declasse** | `scramjet` (Scramjet) | **Speed Racer Mach 5 (Anime Concept)** | `3656405053` | 1 config(s) | Special / Concept |
| **Dinka** | `blista3` (Go Go Monkey Blista) | **Honda Civic Type R (Custom Monkey Edition)** | `3703315515` | 1 config(s) | Tuner / Compact |
| **Bravado** | `buffalo4` (Buffalo STX) | **Dodge Charger SRT Hellcat Redeye (STX)** | `3675036420` | 2 config(s) | Muscle |
| **Vapid** | `sandking` (Sandking XL) | **Ford F-350 Super Duty Dually** | `3105951696` | 1 config(s) | OFF_ROAD |
| **Ubermacht** | `sentinel5` (Sentinel GTS) | **BMW M3 Competition (G80)** | `2709293299` | 8 config(s) | Sports Car |
| **Bravado** | `polgauntlet` (Gauntlet Interceptor) | **Dodge Challenger SRT Hellcat (Police Interceptor)** | `3061199846` | 1 config(s) | Muscle |
| **Pegassi** | `oppressor2` (Oppressor Mk II) | **Pegassi Hover Bike Concept** | `2069146067` | 2 config(s) | Special / Concept |
| **Invetero** | `coquette6` (Coquette D5) | **Chevrolet Corvette C5** | `127317925` | 1 config(s) | SPORT |
| **Grotti** | `cartuccia` (Cartuccia GT) | **Ferrari 812 Superfast** | `2271995207` | 4 config(s) | Supercar |
| **Pfister** | `comet6` (Comet S2) | **Porsche 911 GT3 (992)** | `2568944644` | 1 config(s) | Sports Car |
| **Declasse** | `vigero2` (Vigero ZX) | **Chevrolet Camaro ZL1 1LE (Copo)** | `2536587772` | 1 config(s) | Muscle |
| **Ubermacht** | `cypher` (Cypher) | **BMW M2 CS (F87)** | `1755697647` | 2 config(s) | Sports Car |
| **Vapid / Custom** | `defendybob` (Defendy Bob) | **Land Rover Defender V8** | `2362851406` | 1 config(s) | SUV / Offroad |
| **Imponte** | `deluxo` (Deluxo) | **DeLorean DMC-12** | `1483171323` | 2 config(s) | SPORT_CLASSIC |
| **Annis** | `elegy` (Elegy Retro Custom) | **Nissan Skyline GT-R (BNR32/BCNR33/BNR34 Custom)** | `196747873` | 1 config(s) | Sports Car |
| **Enus** | `cogcabrio` (Cognoscenti Cabrio) | **Bentley Continental GT Convertible** | `330661258` | 1 config(s) | COUPE |
| **Annis** | `euros` (Euros) | **Nissan 370Z (Z34) / Fairlady Z** | `2038480341` | 1 config(s) | Sports Car |
| **Nagasaki** | `shinobi` (Shinobi) | **Kawasaki Ninja H2 / ZX-10R** | `1353120668` | 1 config(s) | MOTORCYCLE |
| **Vapid** | `fmj2` (FMJ MK V) | **Ford GT Gen 2 MK V** | `3287642921` | 1 config(s) | SUPER |
| **Grotti** | `italirsx` (Itali RSX) | **Ferrari SF90 Stradale** | `3145241962` | 3 config(s) | Supercar |
| **Annis** | `elegy2` (Elegy RH8) | **Nissan GT-R NISMO (R35)** | `3728579874` | 1 config(s) | Sports Car |
| **Shitzu** | `hakuchou2` (Hakuchou Drag) | **Suzuki Hayabusa GSX1300R Drag Spec** | `4039289119` | 1 config(s) | MOTORCYCLE |
| **Dinka** | `kanjo` (Blista Kanjo) | **Honda Civic Type R (EK9)** | `409049982` | 3 config(s) | Tuner / Compact |
| **Karin** | `sultan3` (Sultan RS Classic) | **Subaru Impreza WRX STI 22B** | `4003946083` | 1 config(s) | SPORT |
| **Karin** | `kuruma2` (Kuruma (Armored)) | **Mitsubishi Lancer Evolution X (Armored)** | `410882957` | 1 config(s) | SPORT |
| **Lampadati** | `corsita` (Corsita) | **Maserati MC20** | `3540279623` | 1 config(s) | SPORT |
| **Obey** | `tenf` (10F) | **Audi R8 Gen 2 (4S)** | `3400983137` | 1 config(s) | Supercar |
| **Declasse** | `sabregt2` (Sabre Turbo Custom) | **Oldsmobile 442 Cutlass Lowrider** | `223258115` | 1 config(s) | MUSCLE |
| **Dinka** | `jester5` (Jester RR Widebody) | **Toyota GR Supra Widebody (HKS)** | `1484920335` | 1 config(s) | Sports Car |
| **Progen** | `luiva` (Luiva) | **McLaren Elva** | `3356898886` | 2 config(s) | Supercar |
| **Invetero** | `polcoquette4` (Coquette D10 Pursuit) | **Chevrolet Corvette C8 (Police Pursuit)** | `2042703219` | 1 config(s) | EMERGENCY |
| **Benefactor** | `schlagen` (Schlagen GT) | **Mercedes-AMG GT R Coupe** | `3787471536` | 1 config(s) | Sports Car |
| **HVY** | `nightshark` (Nightshark) | **Terradyne Gurkha LAPV** | `433954513` | 2 config(s) | OFF_ROAD |
| **Ubermacht** | `niobe` (Niobe) | **Porsche 918 Spyder Concept** | `1881415402` | 1 config(s) | Supercar |
| **Enus** | `paragon3` (Paragon S) | **Bentley Mulliner Batur** | `3348919626` | 1 config(s) | SPORT |
| **Enus** | `paragon2` (Paragon R (Armored)) | **Bentley Continental GT Armored** | `1416466158` | 1 config(s) | SPORT |
| **Ocelot** | `pariah` (Pariah) | **Aston Martin Vanquish Zagato** | `867799010` | 1 config(s) | SPORT |
| **Pfister** | `growler` (Growler) | **Porsche 718 Cayman GT4 RS** | `1304459735` | 1 config(s) | Sports Car |
| **Pfister** | `astrale` (Astrale) | **Porsche Taycan Cross Turismo** | `1596736441` | 1 config(s) | SPORT_CLASSIC |
| **Overflod** | `suzume` (Suzume) | **Koenigsegg Gemera** | `687627128` | 2 config(s) | SUPER |
| **Overflod** | `pipistrello` (Pipistrello) | **Estrema Fulminea / Lotus Evija** | `4071505793` | 1 config(s) | Supercar |
| **Pfister** | `xtreme` (X-treme) | **Porsche 911 GT3 R Rennsport** | `2515968713` | 1 config(s) | Sports Car |
| **Pfister** | `comet3` (Comet Retro Custom) | **Porsche 911 (930 Retro Custom)** | `2272483501` | 1 config(s) | Sports Car |
| **Pegassi** | `polignus` (Weaponized Ignus (Pursuit)) | **Lamborghini Sián FKP 37** | `4255883207` | 1 config(s) | Supercar |
| **null** | `alkonost` (RO-86 Alkonost) | **Tupolev Tu-160 Supersonic Bomber** | `3929093893` | 1 config(s) | Special / Concept |
| **Dewbauchee** | `specter2` (Specter Custom) | **Aston Martin DB10 Custom** | `1074745671` | 1 config(s) | SPORT |
| **Progen** | `t20` (T20) | **McLaren P1** | `1663218586` | 1 config(s) | Supercar |
| **null** | `khanjali` (TM-02 Khanjali) | **PL-01 Concept Stealth Tank** | `2859440138` | 1 config(s) | Special / Concept |
| **Pegassi** | `tezeract` (Tezeract) | **Lamborghini Terzo Millennio** | `1031562256` | 1 config(s) | Supercar |
| **Pegassi** | `toros` (Toros) | **Lamborghini Urus** | `3126015148` | 1 config(s) | SUV / Offroad |
| **null** | `vigilante` (Vigilante) | **Batmobile (1989 Concept)** | `3052358707` | 1 config(s) | Special / Concept |
| **Benefactor** | `driftvorschlag` (Vorschlaghammer) | **Mercedes-Benz W124 E-Class AMG (Hammer)** | `4151380270` | 1 config(s) | SEDAN |
| **Lampadati** | `cinquemila` (Cinquemila) | **Maserati Ghibli Trofeo** | `2767531027` | 1 config(s) | SEDAN |
| **Vapid** | `dominator3` (Dominator GTX) | **Ford Mustang Shelby GT500 (S550)** | `3308022675` | 1 config(s) | Muscle |
| **Grotti** | `turismo3` (Turismo Omaggio) | **Ferrari F8 Tributo (Turismo Omaggio)** | `4171974011` | 1 config(s) | Supercar |
| **Pegassi** | `zorrusso` (Zorrusso) | **Italdesign Zerouno / Pagani Zonda** | `3612858749` | 1 config(s) | Supercar |
| **Annis** | `zr350` (ZR350) | **Mazda RX-7 FD3S** | `2436313176` | 1 config(s) | Sports Car |

---

## 5. Manufacturer Fleet Distribution

- **Ubermacht**: 11 vehicle configurations
- **Pegassi**: 9 vehicle configurations
- **Dinka**: 9 vehicle configurations
- **Grotti**: 8 vehicle configurations
- **Overflod**: 7 vehicle configurations
- **Obey**: 6 vehicle configurations
- **Pfister**: 6 vehicle configurations
- **Annis**: 6 vehicle configurations
- **Benefactor**: 6 vehicle configurations
- **Bravado**: 5 vehicle configurations
- **Enus**: 4 vehicle configurations
- **Lampadati**: 3 vehicle configurations
- **Coil**: 3 vehicle configurations
- **Declasse**: 3 vehicle configurations
- **Vapid**: 3 vehicle configurations
- **Progen**: 3 vehicle configurations
- **null**: 3 vehicle configurations
- **Invetero**: 2 vehicle configurations
- **Imponte**: 2 vehicle configurations
- **Karin**: 2 vehicle configurations
- **HVY**: 2 vehicle configurations
- **Vapid / Custom**: 1 vehicle configurations
- **Nagasaki**: 1 vehicle configurations
- **Shitzu**: 1 vehicle configurations
- **Ocelot**: 1 vehicle configurations
- **Dewbauchee**: 1 vehicle configurations

---

## 6. Engineering Strategy for Missing 3D Assets

In adherence to non-negotiable architectural constraints:
1. **Zero Fabrication**: The engine never fabricates placeholder geometry under a false name.
2. **Missing Asset State**: If a vehicle hash has no registered 3D asset in `vehicle-assets/`, AUTOVERSE 3D displays an explicit, high-tech missing asset diagnostic interface showing:
   - Vehicle Identity, joaat hash, manufacturer, and detected tuning configuration.
   - Compatible 3D model formats supported (`.glb`, `.gltf`, `.obj`, `.fbx`).
   - One-click drag-and-drop asset assignment to load and bind user-supplied 3D models immediately into the runtime registry.
3. **Bundled Reference Vehicles**: The system includes fully authored 3D models and procedural PBR automotive assemblies for top tier showcase vehicles:
   - **BMW M3 Competition (G80)**
   - **Porsche 911 GT3 (992 / Comet S2)**
   - **Audi R8 V10 Plus (10F Widebody)**
   - **Lamborghini Huracán LP610-4 (Tempesta)**
   - **Ferrari SF90 Stradale (Itali RSX)**
   - **Toyota Supra RZ MK4 (Jester Classic)**
   - **Nissan RX-7 FD3S (ZR350)**
   - **Mercedes-AMG GT R (Schlagen GT)**
