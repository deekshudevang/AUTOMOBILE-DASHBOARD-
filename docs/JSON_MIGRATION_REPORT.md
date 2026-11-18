# AUTOVERSE 3D — JSON REPOSITORY MIGRATION REPORT

## 1. Migration Overview
To bridge the legacy Cherax entity format, Schema 1.0 parametric definitions, and modern Schema 2.0 component hierarchies into a unified geometry pipeline, we implemented `SchemaV2Migrator` (`src/geometry/migration/schemaV2Migrator.ts`).

## 2. Format Ingestion Matrix

| Source Format | Detection Heuristic | Transformation Strategy | Resulting Object |
|---|---|---|---|
| **Schema 2.0** | `raw.schemaVersion === '2.0'` | Normalized dimensions, wheel aspect ratio calculation, panel mapping | `VehicleGeometryDefinition` |
| **Schema 1.0 Parametric** | `raw.asset_type === 'parametric_vehicle_geometry'` | Section lofting, wheel arch offset extraction, aero mapping | `VehicleGeometryDefinition` |
| **Cherax Legacy Entity** | `raw.format === 'Cherax Entity'` or `raw.mods !== undefined` | Database lookup via model hash, OEM dimensions injection | `VehicleGeometryDefinition` |

## 3. Backward Compatibility Preservation
- The original JSON files in `public/vehicles/` remain untouched and pristine.
- User-created vehicle configuration presets and color settings are preserved through the runtime migrator without altering storage schemas.
- 0 breaking API changes across legacy import/export endpoints.
