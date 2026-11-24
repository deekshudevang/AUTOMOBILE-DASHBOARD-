# AUTOVERSE 3D — Authentic Automotive Geometry Engine (AAGE) Schema 2.0 Specification

## 1. Specification Overview

**Schema ID:** `https://autoverse3d.local/schemas/vehicle-schema-2.0.json`  
**Current Version:** `2.0.0`  
**Units:** Metric (meters, radians/degrees, kilograms, seconds)  
**Coordinate Space:** Three.js Right-Handed System  
- **+X**: Vehicle Right (Starboard)
- **-X**: Vehicle Left (Port)
- **+Y**: Vehicle Up (Vertical Normal)
- **-Y**: Ground / Road Surface ($Y = 0.000\text{m}$ ground contact datum)
- **+Z**: Vehicle Front (Nose / Bumper)
- **-Z**: Vehicle Rear (Tail / Diffuser)

---

## 2. Root Structure Definition

```json
{
  "schemaVersion": "2.0",
  "vehicle": { ... },
  "dimensions": { ... },
  "bodyGeometry": { ... },
  "components": [ ... ],
  "wheels": { ... },
  "materials": [ ... ],
  "validation": { ... }
}
```

### 2.1 Vehicle Identification Block (`vehicle`)

| Field | Type | Required | Description | Example |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `string` | Yes | Unique slug identifier | `"lamborghini_aventador_svj"` |
| `manufacturer` | `string` | Yes | Automotive OEM name | `"Lamborghini"` |
| `model` | `string` | Yes | Commercial model badge | `"Aventador SVJ"` |
| `generation` | `string` | Yes | Internal code / generation | `"LP 770-4"` |
| `year` | `number` | Yes | Reference model year | `2021` |
| `category` | `enum` | Yes | Vehicle market segment | `"supercar"` |
| `geometryClass` | `enum` | Yes | Provenance classifier | `"procedural"` |
| `geometrySource`| `string` | Yes | Design source declaration | `"original_autoverse_parametric_design"` |
| `units` | `string` | Yes | Dimensional unit | `"meters"` |

---

### 2.2 Vehicle Dimensions Block (`dimensions`)

Defines bounding boundaries, wheelbase, track widths, and overhangs:

```typescript
export interface VehicleDimensions {
  length: number;           // Total bumper-to-bumper length (m)
  width: number;            // Total mirror-to-mirror or body width (m)
  height: number;           // Highest roof crown point above ground (m)
  wheelbase: number;        // Center-of-front-axle to center-of-rear-axle (m)
  frontTrack: number;       // Centerline distance between front wheels (m)
  rearTrack: number;        // Centerline distance between rear wheels (m)
  frontOverhang: number;    // Front axle center to front bumper extremity (m)
  rearOverhang: number;     // Rear axle center to rear bumper extremity (m)
  groundClearance?: number; // Lowest chassis underside point above ground (m)
}
```

---

### 2.3 Monocoque Cross-Sections (`bodyGeometry.crossSections`)

The monocoque body shell is generated through lofted longitudinal transverse cross-sections along the $Z$-axis:

```typescript
export interface LongitudinalCrossSection {
  z_m: number;              // Longitudinal station coordinate (m)
  half_width_m: number;     // Maximum lateral half-width at waistline (m)
  lower_y_m: number;        // Bottom edge / side-skirt height (m)
  shoulder_y_m: number;     // Shoulder line / window sill bottom height (m)
  belt_y_m: number;         // A/B/C-pillar base height (m)
  upper_center_y_m: number; // Cowl / hood / trunk deck center height (m)
  roof_half_width_m: number;// Lateral half-width at the roof rail (m)
  roof_crown_y_m: number;   // Center roof apex height (m)
}
```

---

### 2.4 Hierarchical Component Architecture (`components`)

Each component is a self-contained, addressable node in the vehicle's scene graph:

```typescript
export interface VehicleComponentDef {
  id: string;               // Unique component slug (e.g. "front_splitter")
  name: string;             // Human-readable title ("Front Splitter Aerodynamic Blade")
  group: ComponentGroup;    // 'body_panels' | 'aerodynamics' | 'lighting' | 'windows' | 'wheels' | 'exhaust' | 'interior'
  parentId?: string;        // Optional parent component ID for relative transforms
  transform: {
    position: [number, number, number]; // [x, y, z] in meters
    rotation: [number, number, number]; // [pitch, yaw, roll] in radians
    scale: [number, number, number];    // [sx, sy, sz] multipliers
  };
  dimensions?: {
    width?: number;         // Lateral span (m)
    height?: number;        // Vertical profile (m)
    length?: number;        // Longitudinal reach (m)
    thickness?: number;     // Material extrusion gauge (m)
  };
  materialRef: string;      // ID linking to materials definition table
  editable: boolean;        // Enables UI inspector sliders
  geometryType: string;     // Procedural generator archetype (e.g. "spline_wing")
  customizationOptions: {
    allowPosition?: boolean;
    allowRotation?: boolean;
    allowScale?: boolean;
    ranges?: {
      positionX?: [number, number];
      rotationX?: [number, number];
      scale?: [number, number];
      width?: [number, number];
      height?: [number, number];
    };
    specificOptions?: Record<string, any>;
  };
}
```

---

### 2.5 4-Wheel Assembly Specification (`wheels`)

AutoVerse Schema 2.0 defines four discrete, independently aligned wheel corners:

```typescript
export interface WheelComponentSpec {
  id: string;               // "wheel_fl" | "wheel_fr" | "wheel_rl" | "wheel_rr"
  axle: 'front' | 'rear';
  side: 'left' | 'right';
  center_m: { x: number; y: number; z: number };
  tire: {
    size: string;           // Standard ISO metric sizing (e.g. "255/35ZR20")
    nominal_section_width_mm: number;
    aspect_ratio: number;
    rim_diameter_in: number;
    calculated_outer_diameter_mm: number;
    calculated_radius_m: number;
    treadPattern?: 'slick' | 'semi-slick' | 'performance_tread' | 'all_season';
  };
  rim: {
    size: string;
    width_m: number;
    diameter_m: number;
    style: string;          // "split_y_spoke" | "monoblock" | "turbofan"
    spokeCount: number;     // e.g. 5, 7, 10
    offset_mm: number;      // ET offset
  };
  brakes: {
    discDiameter_m: number; // e.g. 0.380 (380mm carbon-ceramic)
    caliperColor: string;   // Hex color code (e.g. "#00F0FF")
    pistonCount: number;    // e.g. 6 or 8
  };
  alignment: {
    camberDeg: number;      // Static negative camber (e.g. -3.5)
    toeDeg: number;         // Static toe alignment (e.g. 0.05)
  };
}
```

---

### 2.6 Physically-Based Rendering Materials (`materials`)

```typescript
export interface MaterialDef {
  id: string;               // "body_paint" | "carbon_fiber" | "wheel_alloy"
  name: string;             // "Verde Alceo Matte Finish"
  type: MaterialFinishType; // 'paint_metallic' | 'paint_gloss' | 'paint_matte' | 'carbon_fiber' | 'forged_carbon' | 'chrome' | 'alloy' | 'glass' | 'leather'
  color: string;            // Hex color code
  metalness: number;        // 0.0 (dielectric) to 1.0 (conductor)
  roughness: number;        // 0.0 (mirror) to 1.0 (diffuse)
  clearcoat?: number;       // PBR automotive clearcoat layer intensity (0.0 to 1.0)
  clearcoatRoughness?: number;
  transmission?: number;    // For architectural & glass materials
  transparent?: boolean;
}
```

---

## 3. Real-Time Customization Overrides

When a user modifies a vehicle inside the 3D Studio or Customizer, their overrides are tracked non-destructively:

```typescript
export interface ComponentOverride {
  componentId: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  dimensions?: ComponentDimensions;
  materialRef?: string;
  customColorHex?: string;
  materialFinish?: MaterialFinishType;
  visible?: boolean;
  locked?: boolean;
  contextSettings?: Record<string, any>; // e.g. { camberDeg: -4.5, aoaDeg: 18 }
}
```

---

## 4. Accuracy Notice & Rule 6 Compliance

All Schema 2.0 assets carry an explicit metadata watermark:

```json
"validation": {
  "accuracyClass": "D_APPROXIMATE",
  "accuracyLabel": "APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY",
  "provenanceVerified": true,
  "watertightMesh": true
}
```

