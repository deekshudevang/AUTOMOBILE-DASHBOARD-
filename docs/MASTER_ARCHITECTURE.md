# AUTOVERSE 3D — MASTER ENGINEERING ARCHITECTURE

## 1. System Vision & Architecture
AutoVerse 3D is a production-grade, engineering-oriented automotive digital twin configurator and 3D visualization engine. Its core objective is to deliver genuine, real-world vehicle geometry and distinct silhouettes for every production vehicle in the catalog.

```
+-----------------------------------------------------------------------------------+
|                                 USER INTERFACE                                    |
|   +---------------------------------------+   +-------------------------------+   |
|   |         Hero Central Viewport         |   | Right Customization Studio    |   |
|   | (Three.js WebGL / Dynamic Camera Rig) |   | (Paint, Aero, Wheels, Trims)  |   |
|   +---------------------------------------+   +-------------------------------+   |
|   | Top HUD: Identity, Provenance Tier    |   | Presentation Mode Switcher    |   |
|   | (Class B Verified Model / OEM Specs)  |   | (Studio, Eng, Showroom, Diff) |   |
|   +---------------------------------------+   +-------------------------------+   |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        STATE MANAGEMENT & REPOSITORY PIPELINE                     |
|  - useVehicleStore (Zustand): Active Config, History Stack, Component Overrides    |
|  - VehicleAssetDatabase: Canonical Model Catalog & Capability Matrix              |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|               AUTOMOTIVE AUTHENTIC GEOMETRY ENGINE (AAGE V2)                      |
|                                                                                   |
|   +-----------------------+     +-----------------------+                         |
|   |   Schema V2 Migrator  | --> |   PBR Material Factory| (Coatings & Finishes)   |
|   +-----------------------+     +-----------------------+                         |
|               |                                                                   |
|               v                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                       ArchetypeRegistry Dispatcher                        |   |
|   |  - RearEngineCoupeGenerator      (911 GT3 RS / Turbo S teardrop flyline)  |   |
|   |  - MidEngineSupercarGenerator    (488 Pista / F8 S-Duct & flying buttress)|   |
|   |  - MidEngineHypercarGenerator    (Aventador SVJ / Huracán razor wedge)    |   |
|   |  - FrontEngineGtGenerator        (AMG GT / Aston DBS long bonnet & quad)  |   |
|   +---------------------------------------------------------------------------+   |
|               |                                                                   |
|               +-------------------------------+                                   |
|               |                               |                                   |
|               v                               v                                   |
|   +-----------------------+     +---------------------------------------------+   |
|   | WheelAssemblyGenerator|     |       18-Gate Physical Quality Evaluator    |   |
|   | (Lathe Tyre, Rim, Disc|     | (Connectivity, Continuity, Ground Contact,  |   |
|   |  Brake Caliper)       |     |  Shutlines, Visibility, Anchoring, Hash)    |   |
|   +-----------------------+     +---------------------------------------------+   |
+-----------------------------------------------------------------------------------+
```

## 2. Core Architectural Pillars
1. **Zero Generic Body Mesh**: Universal box meshes are strictly banned from active vehicle selection. Each car resolves to a dedicated styling generator.
2. **Watertight Lofted Surfaces**: Continuous curvature generated through mathematical parametric patches meeting along realistic $2.5\text{mm}$ shut lines.
3. **Truth Contract & Provenance Transparency**: Every vehicle carries an authentic provenance tier (`Tier B – Spec-accurate` or `Tier A – Reference-verified`). Approximation banners appear only if unverified fallback geometry is loaded.
4. **Non-Destructive Customization**: User modifications (paint finishes, caliper colors, aero toggles) clone materials and update transforms without mutating source geometry buffers.
