# AutoVerse 3D — Vehicle Interior Inventory & Audit

**Date:** November 23, 2026  
**Auditor:** AutoVerse Lead Automotive 3D & Graphics Specialist  
**Repository:** `deekshudevang/AUTOMOBILE-DASHBOARD-`  
**Working Branch:** `feat/interiors-engines-openings`  

---

## 1. Executive Summary & Audit Methodology

Each vehicle available in AutoVerse was forensically audited across:
- **Existing Interior Mesh Implementation:** Investigated `EditableVehicleAssembler.ts` (lines 768–801) and `@autoverse/vehicle-generation-engine`.
- **Observed Geometry:**
  - `steering_wheel`: Primitive `THREE.TorusGeometry` (uniform circle with no spoke detail, hub, or brand emblem).
  - `seats_assembly`: Primitive `THREE.BoxGeometry(0.42, height, length)` (two rectangular blocks with zero bolsters, headrests, or harnesses).
  - `interior_cockpit`: Flat box extrusion with zero center console, dashboard curvature, infotainment screen, or AC vents.
  - `door_cards`: Missing on all doors; opening a door reveals hollow exterior panel backfaces.
  - Footwell / pedals / rear seating: Completely unmodeled.
- **Audit Verdict:** Currently, **0 out of 50 vehicles** have authentic brand-specific interiors. Every vehicle has been relying on the generic procedural fallback.

---

## 2. Vehicle Interior Classification Table (50 Vehicles)

**Classification Codes:**
- `COMPLETE`: Fully modeled bespoke interior with dashboard, instrument cluster, brand-specific steering, seats, console, door panels, and pedals.
- `PARTIALLY MODELED`: Basic layout with placeholders, missing brand-specific styling or details.
- `INTERIOR MISSING`: Only generic box blocks; no recognizable brand interior.
- `EXTERIOR ONLY`: Body shell only; interior completely absent.

| # | Vehicle Model | Year | Category | Existing Interior Geometry | Brand/Model Interior Target | Interior Classification |
|---|---|---|---|---|---|---|
| 1 | Bugatti Chiron Super Sport | 2022 | Hypercar | Generic Box Dash + Torus Wheel | Bespoke C-Line illuminated center spine, analog mechanical speedometer, diamond-quilted leather | `INTERIOR MISSING` |
| 2 | Koenigsegg Jesko Attack | 2021 | Hypercar | Generic Box Dash + Torus Wheel | SmartCluster gyroscopic steering display, ghost lighting, hollow carbon bucket seats | `INTERIOR MISSING` |
| 3 | McLaren P1 | 2014 | Hypercar | Generic Box Dash + Torus Wheel | Minimalist exposed carbon monocoque, floating center screen, race-spec switchgear | `INTERIOR MISSING` |
| 4 | Ferrari LaFerrari | 2014 | Hypercar | Generic Box Dash + Torus Wheel | F1-style squared steering wheel with Manettino dial, bridge console with F1 reverse/launch buttons | `INTERIOR MISSING` |
| 5 | Porsche 918 Spyder | 2015 | Hypercar | Generic Box Dash + Torus Wheel | Rising glass-touch center console, 3-gauge recessed pod cluster, carbon bucket seats | `INTERIOR MISSING` |
| 6 | Aston Martin Valkyrie | 2022 | Hypercar | Generic Box Dash + Torus Wheel | Feet-up Formula 1 reclined seating position, removable OLED steering wheel, twin camera mirror displays | `INTERIOR MISSING` |
| 7 | Mercedes-AMG ONE | 2023 | Hypercar | Generic Box Dash + Torus Wheel | Dual freestanding 10" digital displays, F1-style rectangular yoke with integrated shift lights | `INTERIOR MISSING` |
| 8 | Rimac Nevera | 2022 | Hypercar | Electric | Triple widescreen digital displays, machined billet rotary selector dials, minimalist EV tunnel | `INTERIOR MISSING` |
| 9 | Pagani Huayra BC | 2017 | Hypercar | Generic Box Dash + Torus Wheel | Exposed steampunk mechanical gear linkage, Swiss watchmaker analog gauges, saddle leather straps | `INTERIOR MISSING` |
| 10 | Lamborghini Revuelto | 2024 | Supercar | Generic Box Dash + Torus Wheel | Y-shaped dashboard wing motif, passenger display screen, steering wheel with dual rotary ALA/drive mode dials | `INTERIOR MISSING` |
| 11 | Ferrari 296 GTB | 2022 | Supercar | Generic Box Dash + Torus Wheel | Full digital driver display, capacitive touch haptic steering wheel, open-gate gear selector quadrant | `INTERIOR MISSING` |
| 12 | Ferrari F8 Tributo | 2020 | Supercar | Generic Box Dash + Torus Wheel | Classic round AC turbovents, central analog tachometer, passenger touch bar, deep leather sport seats | `INTERIOR MISSING` |
| 13 | Lamborghini Aventador SVJ | 2019 | Supercar | Generic Box Dash + Torus Wheel | Fighter-jet red flip-cover missile start button, angled center console, carbon door pull straps | `INTERIOR MISSING` |
| 14 | Lamborghini Huracan STO | 2021 | Supercar | Generic Box Dash + Torus Wheel | Stripped lightweight carbon door panels, titanium half-roll bar, 4-point racing harnesses | `INTERIOR MISSING` |
| 15 | McLaren 720S | 2018 | Supercar | Generic Box Dash + Torus Wheel | Folding Driver Display (flips down to slim strip in Track Mode), active dynamics rotary knobs | `INTERIOR MISSING` |
| 16 | McLaren 765LT | 2021 | Supercar | Generic Box Dash + Torus Wheel | Ultralight carbon bucket seats (-18kg), exposed carbon floor without carpet, titanium pedal box | `INTERIOR MISSING` |
| 17 | McLaren Senna | 2019 | Supercar | Generic Box Dash + Torus Wheel | Overhead roof-mounted engine start button, door release levers on roof console, glass door lower windows | `INTERIOR MISSING` |
| 18 | Ford GT | 2017 | Supercar | Generic Box Dash + Torus Wheel | Fixed seats integrated directly into carbon tub with adjustable pedal box and steering column | `INTERIOR MISSING` |
| 19 | Chevrolet Corvette Z06 (C8) | 2023 | Supercar | Generic Box Dash + Torus Wheel | "Wall of Buttons" climate divider, squared flat-top/flat-bottom steering wheel, fighter jet cockpit wrap | `INTERIOR MISSING` |
| 20 | Audi R8 V10 Performance | 2022 | Supercar | Generic Box Dash + Torus Wheel | Audi Virtual Cockpit (no center screen), climate dials with integrated LCD displays inside AC vents | `INTERIOR MISSING` |
| 21 | Nissan GT-R Nismo | 2024 | Sports | Generic Box Dash + Torus Wheel | Recaro carbon-backed bucket seats, Alcantara dash wrap, multi-function telemetry display by Polyphony Digital | `INTERIOR MISSING` |
| 22 | Acura NSX Type S | 2022 | Supercar | Generic Box Dash + Torus Wheel | Dynamic TFT cluster that shifts red in Track Mode, integrated dynamic system rotary dial | `INTERIOR MISSING` |
| 23 | Maserati MC20 | 2022 | Supercar | Generic Box Dash + Torus Wheel | Blue carbon fiber center tunnel, digital rearview mirror, minimalist luxury sport bucket seats | `INTERIOR MISSING` |
| 24 | Lexus LFA | 2012 | Supercar | Generic Box Dash + Torus Wheel | Motorized sliding tachometer bezel ring, magnesium shift paddles, remote touch joystick | `INTERIOR MISSING` |
| 25 | Porsche 911 GT3 RS (992) | 2022 | Sports | Generic Box Dash + Torus Wheel | 4 rotary steering dials (ESC/TC, PASM, PTV+, Drive Mode), DRS button, yellow 12 o'clock marker, carbon half cage | `INTERIOR MISSING` |
| 26 | Porsche 911 Turbo S (992) | 2021 | Sports | Generic Box Dash + Torus Wheel | Twin 7" HD side displays flanking analog central tachometer, 18-way adaptive sport seats, Bose/Burmester trim | `INTERIOR MISSING` |
| 27 | Porsche 718 Cayman GT4 RS | 2022 | Sports | Generic Box Dash + Torus Wheel | Carbon air intake ducts feeding air directly over driver's shoulders, RS door pull straps, Alcantara wheel | `INTERIOR MISSING` |
| 28 | BMW M4 CSL (G82) | 2023 | Sports | Generic Box Dash + Torus Wheel | M Carbon Full Bucket Seats without rear seats, lightweight center console with CSL badge, M1/M2 red buttons | `INTERIOR MISSING` |
| 29 | Toyota GR Supra (A90) | 2023 | Sports | Generic Box Dash + Torus Wheel | Driver-focused cockpit layout, console kneepads, high-bolster sport seats, floating infotainment | `INTERIOR MISSING` |
| 30 | Nissan Z Nismo | 2024 | Sports | Generic Box Dash + Torus Wheel | Triple analog dashboard-top gauge pods (Boost, Turbo Speed, Volts), Recaro two-tone leather/Alcantara | `INTERIOR MISSING` |
| 31 | Mazda MX-5 Miata | 2023 | Sports | Generic Box Dash + Torus Wheel | Retro roadster analog dials, body-color painted interior upper door cap inserts, short-throw shifter | `INTERIOR MISSING` |
| 32 | Alpine A110 R | 2023 | Sports | Generic Box Dash + Torus Wheel | Sabelt single-piece carbon bucket seats, 6-point competition harness, carbon door panels with red pull cords | `INTERIOR MISSING` |
| 33 | Lotus Emira V6 | 2023 | Sports | Generic Box Dash + Torus Wheel | Red flip-cover start button, exposed gearshift linkage mechanism below console, KEF premium audio grilles | `INTERIOR MISSING` |
| 34 | Jaguar F-Type R Coupe | 2023 | Sports | Generic Box Dash + Torus Wheel | Deployable motorized center AC vents, passenger grab handle divider, Windsor leather performance seats | `INTERIOR MISSING` |
| 35 | Ford Mustang Shelby GT500 | 2022 | Muscle | Generic Box Dash + Torus Wheel | Cobra snake emblem steering wheel, carbon dash applique, rotary gear shift dial, auxiliary oil pressure gauges | `INTERIOR MISSING` |
| 36 | Dodge Challenger SRT Demon 170| 2023 | Muscle | Generic Box Dash + Torus Wheel | Yellow-eyed Demon 170 gauge cluster graphics, passenger seat delete option, TransBrake steering buttons | `INTERIOR MISSING` |
| 37 | Chevrolet Camaro ZL1 1LE | 2022 | Muscle | Generic Box Dash + Torus Wheel | Suede flat-bottom steering wheel, Performance Data Recorder screen, turbine air vents with rotary temp rings | `INTERIOR MISSING` |
| 38 | Chevrolet Corvette C7 ZR1 | 2019 | Muscle | Generic Box Dash + Torus Wheel | Competition sport seats with pass-through harness slots, carbon fiber gauge cluster surround | `INTERIOR MISSING` |
| 39 | Nissan Skyline GT-R R34 V-Spec | 2002 | JDM | Generic Box Dash + Torus Wheel | Iconic 5.8" Multi-Function Display (MFD) showing G-force/boost/oil temp, 3-spoke Momo steering, aluminum pedals | `INTERIOR MISSING` |
| 40 | Honda NSX Type R (NA2) | 2002 | JDM | Generic Box Dash + Torus Wheel | Bright red Recaro carbon-Kevlar bucket seats, titanium teardrop shift knob, yellow-needle gauge cluster | `INTERIOR MISSING` |
| 41 | Mazda RX-7 Spirit R (FD3S) | 2002 | JDM | Generic Box Dash + Torus Wheel | Red-stitched Nardi 3-spoke steering wheel, bright red carbon-Kevlar Recaro seats, chrome ringed retro gauges | `INTERIOR MISSING` |
| 42 | Mitsubishi Lancer Evo IX MR | 2006 | JDM / 4-Door | Generic Box Dash + Torus Wheel | Momo 3-spoke leather wheel, ACD/AYC drive mode switch, Recaro suede front/rear seating (4-passenger) | `INTERIOR MISSING` |
| 43 | Subaru Impreza WRX STI | 2006 | JDM / 4-Door | Generic Box Dash + Torus Wheel | DCCD center differential thumbwheel dial, bright red STI illuminated cluster with shift buzzer, blue/black seats | `INTERIOR MISSING` |
| 44 | Toyota 2000GT | 1967 | Classic | Generic Box Dash + Torus Wheel | Rosewood veneered dashboard crafted by Yamaha piano division, dual large chrome round gauges, wood wheel | `INTERIOR MISSING` |
| 45 | Mercedes-AMG GT Black Series | 2021 | Sports | Generic Box Dash + Torus Wheel | AMG Drive Unit steering buttons, yellow traction control rotary knob (9-stage TC), orange contrast stitching | `INTERIOR MISSING` |
| 46 | Porsche 911 Dakar | 2023 | Sports | Generic Box Dash + Torus Wheel | Lightweight carbon bucket seats with Shadegreen stitching, rally-mode switchgear, rear seat delete | `INTERIOR MISSING` |
| 47 | Porsche 935 (2019) | 2019 | Race | Generic Box Dash + Torus Wheel | Carbon motorsport multifunction steering wheel with quick release, Cosworth color display, wood gear knob | `INTERIOR MISSING` |
| 48 | Ferrari FXX-K Evo | 2018 | Track | Generic Box Dash + Torus Wheel | Raw carbon fiber cockpit tub, center console dedicated telemetry screens, KERS charge dials | `INTERIOR MISSING` |
| 49 | Lamborghini Essenza SCV12 | 2021 | Track | Generic Box Dash + Torus Wheel | Multifunctional F1-style steering wheel with integrated telemetry display, OMP carbon FIA homologated seat | `INTERIOR MISSING` |
| 50 | Rolls-Royce Spectre | 2024 | Luxury EV | Generic Box Dash + Torus Wheel | Starlight Doors (4,796 fiber optic stars), illuminated fascia, open-pore Canadel wood panelling, organ-stop vents | `INTERIOR MISSING` |

---

## 3. Critical Architectural Gap in Interior Pipeline

1. **Lack of Model-Specific Generators:** In `EditableVehicleAssembler.ts`, only the component `id` string was checked (`id.includes('seats')`), producing the same two boxes regardless of whether the car was a stripped $2.5M track car or a hand-crafted luxury GT.
2. **Missing Sub-Assemblies:** Center consoles, instrument displays, pedals, gear selectors, door panels, and sun visors were never constructed.
3. **Missing Materials:** Alcantara, matte carbon, brushed titanium, wood veneers, and perforated sport leather were not mapped to the interior components.

---

## 4. Required Action Plan

Build a dedicated, brand-calibrated procedural Interior Generation System (`src/geometry/interiors/vehicleInteriorGenerator.ts` / `@autoverse/vehicle-generation-engine`) that:
- Inspects vehicle make, model, generation, and interior trim.
- Generates authentic brand-specific dashboards, instrument clusters, steering wheels (with rotary dials or F1 yokes), sport/bucket/comfort seats, door cards with handles, gear selectors, and pedals.
- Ingests into `EditableVehicleAssembler.ts` and `VehicleRenderer.tsx`.
