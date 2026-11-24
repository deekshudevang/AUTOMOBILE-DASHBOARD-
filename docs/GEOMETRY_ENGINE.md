# AUTOVERSE 3D — VEHICLE GEOMETRY ENGINE SPECIFICATION & ARCHITECTURE
**Document**: `GEOMETRY_ENGINE.md` | **Version**: 2.0.0 | **Status**: Production Verified

---

## 1. Engine Overview & Core Principles

AutoVerse 3D's Vehicle Geometry Engine replaces generic cuboid mocks with a parametric, mathematically grounded procedural automotive surface generator.

### 1.1 Non-Negotiable Directives
1. **No Primitive Cuboids for Car Bodies**: No vehicle body may be constructed from un-lofted boxes (`BoxGeometry`). All car hulls are lofted through continuous cross-sections.
2. **Authentic Radial Wheels**: Tyres must be toroidal radial cross-sections (`LatheGeometry`) with sidewall bulge and crown tread. Flat cylinders are strictly prohibited.
3. **Discrete Panels & Shut Lines**: Bonnets, fascias, diffusers, doors, and skirts are separated by calibrated 3.0mm–3.5mm shut lines.
4. **Mandatory Approximation Notice (Rule 6)**:
   Any procedural or non-authentic model must carry the immutable user-data tag and visible viewer label:
   ```
   APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY
   ```
5. **Deterministic Proportions**: Proportions are derived from typed `VehicleGeometryProfile` definitions or verified real-world vehicle dimensions.

---

## 2. Subsystem Architecture

The geometry reconstruction is divided into 7 distinct, decoupled packages and modules:

```
packages/vehicle-generation-engine/src/
├── templates/
│   └── geometryProfiles.ts         # Profile schema, validation rules, 7 archetype templates
├── geometry/
│   ├── longitudinalProfile.ts      # Side-view elevation & width curves along Z axis
│   ├── crossSectionGenerator.ts    # Transverse stations with wheel arch cutouts & lip flares
│   ├── surfaceLofter.ts            # Watertight BufferGeometry lofting with crease splits
│   ├── panelSeparator.ts           # Discrete panels (bonnet, fascias, doors, skirts) with 3mm gaps
│   ├── wheelGenerator.ts           # Toroidal radial tyre, multi-piece stepped rim, brake disc & caliper
│   └── proceduralChassis.ts        # High-level procedural chassis orchestrator
├── assembly/
│   └── assemblyGraph.ts            # Profile-derived anchor points and component compatibility
├── validation/
│   └── geometryDiagnostics.ts      # Automated 9-point CI quality and anti-box test suite
└── core/
    └── engine.ts                   # Standalone vehicle generation engine
```

---

## 3. Parametric Geometry Pipeline

### Step 1: Profile Validation & Resolution
A vehicle category string or profile is resolved via `ProceduralChassisGenerator.resolveProfile(categoryOrProfile)`. Profiles must pass all 7 physical constraints in `validateGeometryProfile`:
- Overall Length $\ge$ Wheelbase + Front Overhang + Rear Overhang (within 50mm tolerance).
- Wheelbase $>$ 2.0m.
- Front and Rear Overhangs $>$ 0.3m.
- Ground Clearance between 0.05m and 0.40m.
- Wheel Radii between 0.25m and 0.55m.

### Step 2: Longitudinal Elevation & Width Sampling (`LongitudinalProfileGenerator`)
Samples vehicle height, beltline height, sill height, beltline half-width, and roof half-width along the longitudinal Z axis. The vehicle Z origin ($Z = 0$) sits midway between the front and rear axles.

### Step 3: Transverse Station Generation (`CrossSectionGenerator`)
Samples $\ge 28$ transverse cross-sections from rear bumper to front nosecone.
For each station $Z$:
1. Determines distance to front axle ($Z = +\text{wheelbase}/2$) and rear axle ($Z = -\text{wheelbase}/2$).
2. If $|Z - Z_{\text{axle}}| < R_{\text{arch}}$, cuts out the lower hull and creates an authentic circular wheel arch opening ($R_{\text{arch}} = R_{\text{wheel}} + \text{gap}$) and flares the fender outer lip outward by $\Delta X$.
3. Constructs half-sections (Left & Right) with underbody, rocker sill crease, lower door swell, beltline shoulder, cantrail, and roof crown points.

### Step 4: Watertight Surface Lofting (`SurfaceLofter`)
Connects adjacent transverse stations using indexed quad-strip triangle pairs:
- Left and right sides are lofted independently to ensure sharp crease lines and symmetry along the centerline.
- Computes vertex normals with area weighting.
- Closes the front nosecone and rear fascia with non-degenerate fan caps (zero zero-area triangles).

### Step 5: Panel Separation & Fascias (`PanelSeparator`)
Generates discrete aerodynamic components with calibrated 3.0mm–3.5mm shut-line offsets:
- **Engine Bonnet (Hood)**: Beveled extrusion with cowl hinge pivot.
- **Front Fascia**: Radiator grille cutout, lower intake tray, and aerodynamic canards.
- **Rear Fascia**: Aerodynamic diffuser tray with 4 vertical fins and exhaust cutouts.
- **Doors (Left & Right)**: Rocker sill perimeter and A-pillar hinge points.
- **Side Skirts**: Rocker sill ground-effect blades.

### Step 6: Wheels & Brakes (`WheelGenerator`)
Constructs radial wheels where wheel center height strictly equals the tyre outer radius above the ground plane ($Y = R_{\text{tyre}}$):
- **Tyre Profile**: Toroidal `LatheGeometry` with inner bead, sidewall bulge, tread shoulder, and crown tread band.
- **Alloy Rim**: Stepped barrel, outer bead lip, 10-spoke wheel face, and center hub with 5 hex lug bolts.
- **Brakes**: Ventilated rotor with friction ring and radial cooling vents; 6-piston high performance caliper.

### Step 7: Quality Diagnostics (`GeometryDiagnostics`)
Automated 9-point verification check:
- `no_nan_or_infinity`: All buffer attributes are finite numbers.
- `index_divisible_by_3`: 100% valid triangle index buffer.
- `zero_area_triangles`: Exactly 0 degenerate faces.
- `unit_length_normals`: All vertex normals normalized to unit length.
- `bounding_box_matches_profile`: Bounding dimensions match profile within 6%.
- `tyres_touch_ground_plane`: Wheel contact plane $|y_{\min}| < 0.005$m.
- `tyre_to_arch_clearance`: Suspension travel clearance between 10mm and 70mm.
- `anti_box_geometry_check`: Bodywork triangle count $> 200$ and zero 12-triangle boxes.
- `triangle_and_drawcall_budget`: Triangle count $< 400,000$ and draw calls $< 150$.

---

## 4. How to Define a New Geometry Profile

To add a new vehicle profile, define an entry in `packages/vehicle-generation-engine/src/templates/geometryProfiles.ts`:

```typescript
import { VehicleGeometryProfile } from './geometryProfiles';

export const MY_CUSTOM_VEHICLE: VehicleGeometryProfile = {
  id: 'my_custom_vehicle_v1',
  displayName: 'Custom Gran Turismo',
  bodyStyle: 'sports_car',
  source: 'verified', // or 'approximate-template'

  // Dimensions in metres
  wheelbase: 2.70,
  trackFront: 1.62,
  trackRear: 1.65,
  overallLength: 4.55,
  overallWidth: 1.88,
  overallHeight: 1.30,
  frontOverhang: 0.90,
  rearOverhang: 0.95,

  // Cabin & Hood
  bonnetLength: 1.40,
  cabinStartX: 0.15,
  cabinLength: 2.05,
  roofHeight: 1.30,
  roofPeakX: -0.20,

  // Glass Angles
  windshieldAngleDeg: 62.0,
  rearWindowAngleDeg: 66.0,

  // Wheels & Arches
  wheelRadiusFront: 0.34,
  wheelRadiusRear: 0.35,
  tyreSectionWidth: 0.275,
  tyreAspectRatio: 35,
  wheelArchRadius: 0.385,
  wheelArchFlare: 0.045,

  // Clearances
  groundClearance: 0.115,
  beltlineHeight: 0.88,
  tumblehomeAngleDeg: 18.0
};
```

Register it in `ARCHETYPE_TEMPLATES` and in `GeometryProfileRepository`.
Verify with:
```bash
npm test -- tests/geometry-engine.test.ts
```

