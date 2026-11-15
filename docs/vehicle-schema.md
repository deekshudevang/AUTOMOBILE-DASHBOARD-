# AUTOVERSE 3D — Vehicle Specification Schema Documentation (`docs/vehicle-schema.md`)

## 1. Schema Evolution & Migration Strategy

AutoVerse 3D supports three schema generations simultaneously through automated backward-compatible migration:

| Generation | Identifier | Ingestion Handler | Customization Level |
| :--- | :--- | :--- | :--- |
| **Schema 2.0** | `schemaVersion: "2.0"` | `EditableVehicleAssembler` | Full discrete component hierarchy, 4-wheel assemblies, PBR finishes |
| **Parametric 1.0** | `asset_type: "parametric_vehicle_geometry"` | `ParametricGeometryBuilder` | Multi-station lofting, swan-neck aero, ISO metric radial wheels |
| **Cherax Entity (Legacy)** | `format: "Cherax Entity"` or `model: <hash>` | `ProceduralChassisGenerator` | GTA V Joaat hash lookup, mod slots 0-49, GTA color palette swatches |

---

## 2. Legacy Migration Mapping Table

When an older vehicle file is loaded, the `VehicleSchemaValidator` and normalizer seamlessly map legacy properties to the unified configuration:

| Legacy Cherax Field | Schema 2.0 Normalized Target | Migration Behavior |
| :--- | :--- | :--- |
| `model` (signed/unsigned 32-bit int) | `vehicle.id` & `modelHashUnsigned` | Normalized to positive 32-bit integer via `joaat >>> 0` |
| `primaryColor` (0-160) | `materials[body_paint].color` | Resolved through `GTA_COLOR_PALETTE` mapping |
| `customPrimaryColor` (`{ r, g, b }`) | `materials[body_paint].color` | Converted to hex `#RRGGBB` with clearcoat $1.0$ |
| `wheelType` + `wheelColor` | `wheels[FL/FR/RL/RR].rim` | Mapped to rim style and PBR alloy material finish |
| `neonKits` (4 booleans + RGB) | Underglow lighting attachment | Preserved with ground reflection bounce lights |
| `windowTint` (0-6) | `materials[glass].transmission` | Scaled to physical transmission ($0.15$ limo to $0.85$ clear) |
| Missing specifications | Spec readouts | Surface as `"Not specified"`, never fabricated |

---

## 3. Schema 2.0 Example Specification

```json
{
  "schemaVersion": "2.0",
  "vehicle": {
    "id": "porsche_911_gt3_rs",
    "manufacturer": "Porsche",
    "model": "911 GT3 RS",
    "generation": "992",
    "year": 2022,
    "category": "sports_car",
    "geometryClass": "procedural",
    "geometrySource": "original_autoverse_parametric_design",
    "units": "meters"
  },
  "dimensions": {
    "length": 4.572,
    "width": 1.900,
    "height": 1.322,
    "wheelbase": 2.457,
    "frontTrack": 1.630,
    "rearTrack": 1.582,
    "frontOverhang": 1.050,
    "rearOverhang": 1.065
  },
  "components": [
    {
      "id": "rear_wing",
      "name": "Swan-Neck Airfoil Wing Blade",
      "group": "aerodynamics",
      "transform": {
        "position": [0, 1.25, -2.05],
        "rotation": [0.21, 0, 0],
        "scale": [1, 1, 1]
      },
      "dimensions": {
        "width": 1.78,
        "height": 0.12,
        "length": 0.42,
        "thickness": 0.025
      },
      "materialRef": "carbon_fiber",
      "editable": true,
      "geometryType": "swan_neck_wing",
      "customizationOptions": {
        "allowPosition": true,
        "allowRotation": true,
        "allowScale": true
      }
    }
  ],
  "wheels": {
    "frontLeft": {
      "axle": "front",
      "side": "left",
      "center_m": { "x": -0.815, "y": 0.35, "z": 1.228 },
      "tire": {
        "size": "275/35ZR20",
        "nominal_section_width_mm": 275,
        "aspect_ratio": 35,
        "rim_diameter_in": 20,
        "calculated_radius_m": 0.35025
      },
      "rim": {
        "width_m": 0.241,
        "diameter_m": 0.508,
        "style": "forged_centerlock",
        "spokeCount": 10,
        "offset_mm": 45
      },
      "brakes": {
        "discDiameter_m": 0.408,
        "caliperColor": "#EAB308",
        "pistonCount": 6
      },
      "alignment": {
        "camberDeg": -2.0,
        "toeDeg": 0.05
      }
    }
  },
  "materials": [
    {
      "id": "carbon_fiber",
      "name": "Twill Carbon Fiber",
      "type": "carbon_fiber",
      "color": "#18181B",
      "metalness": 0.35,
      "roughness": 0.42
    }
  ]
}
```
