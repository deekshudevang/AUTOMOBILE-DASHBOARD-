# AUTOVERSE 3D — VEHICLE GEOMETRY AUDIT & DEFECT REPORT

## 1. Prior Defect Analysis
An extensive audit of the historical rendering code revealed why cars previously appeared identical:
1. **Box Panel Construction**: In `EditableVehicleAssembler.buildBodyPanelComponent()`, body panels (`front_bumper`, `rear_bumper`, `hood`, `roof`, `fenders`, `doors`) were constructed using `new THREE.BoxGeometry(width, height, length)`.
2. **Monolithic Parametric Fallback**: The earlier parametric generator scaled a single generic cross-section profile by overall dimensions, failing to recreate distinctive styling signatures like Ferrari's S-Duct or Lamborghini's extreme wedge profile.
3. **Hardcoded Engine Hooks**: In `VehicleRenderer.tsx`, the V2 authentic engine was previously bypassed unless manually toggled, allowing the application to fall back to the generic box assembler.

## 2. Geometry Engine Transformation (AAGE V2)
To eliminate generic silhouettes, we designed and implemented model-specific styling generators:
- **`RearEngineCoupeGenerator`**: Implements teardrop cabin, high torpedo fender crests, full-width 3D rear lightbar, and swan-neck aerodynamic rear wing.
- **`MidEngineSupercarGenerator`**: Implements cab-forward canopy, deep sculpted S-Duct hood downforce channel, swept-back multi-LED headlamps, deep side scallop intakes, flying buttresses, and circular twin taillights.
- **`MidEngineHypercarGenerator`**: Implements extreme low-slung wedge silhouette ($H = 1.136\text{m}$), sharp hexagonal creases, signature horizontal Y-shaped DRLs, louvered central engine spine, high-mounted center dual exhausts, and carbon ALA 2.0 active aerodynamic rear wing.
- **`FrontEngineGtGenerator`**: Implements long sculpted bonnet, set-back grand touring greenhouse, wide rear haunches, and quad exhaust diffusers.

## 3. Invariant Verification
Each vehicle's geometry must adhere to strict automotive packaging invariants:
1. **Ground Contact**: Wheel lower contact patches touch $Y=0.000\text{m} \pm 2.5\text{mm}$.
2. **Wheel Centering**: Wheel assemblies centered along longitudinal axles ($Z = \pm \text{wheelbase} / 2$).
3. **Fender Arch Clearance**: Circular wheel arches cut with positive radial clearance over tires preventing mesh clipping.
4. **Appendage Anchoring**: Aerodynamic wings, splitters, mirrors, and license plates physically anchored to host body panels with $\le 2.0\text{mm}$ separation.
