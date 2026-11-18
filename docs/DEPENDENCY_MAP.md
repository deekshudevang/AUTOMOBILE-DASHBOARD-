# AUTOVERSE 3D — SYSTEM DEPENDENCY MAP

## 1. Data Flow & Component Hierarchy

```mermaid
flowchart TD
    User["User Selection in UI (StudioView / VehicleLibrary)"] --> Store["Zustand Vehicle Store (useVehicleStore.ts)"]
    Store --> LoadFile["loadVehicleByFile(fileName)"]
    LoadFile --> FetchJSON["Fetch public/vehicles/[category]/[model].json"]
    FetchJSON --> Parser["parseVehicleJson(text)"]
    Parser --> Migrator["SchemaV2Migrator.migrate(rawSpec, vehicleId)"]
    Migrator --> Engine["VehicleGeometryEngine.loadVehicle(def)"]
    
    subgraph AAGE_V2 ["Automotive Authentic Geometry Engine (V2)"]
        Engine --> MatFactory["PbrMaterialFactory (Paint, Glass, Carbon, Rubber)"]
        Engine --> Registry["ArchetypeRegistry.buildChassis(...)"]
        Registry --> Archetypes["Archetype Generators (Coupe, Supercar, Hypercar, GT)"]
        Archetypes --> PanelCutter["Panelization & 2.5mm Shut Lines"]
        Engine --> Wheels["WheelAssemblyGenerator (4-Corner Rims, Tyres, Discs, Calipers)"]
        Engine --> Gates["QualityGates.evaluateAssembly (18 Hardened Physical Gates)"]
    end
    
    Engine --> Renderer["VehicleRenderer.tsx (Three.js Scene Canvas)"]
    Renderer --> HUD["StudioView HUD (Class B Verified Production Model Badge)"]
```

## 2. Core Package Dependencies
- `@autoverse/shared-types`: Canonical vehicle types and component override schemas.
- `@autoverse/vehicle-generation-engine`: Parametric geometry builders and diagnostic tools.
- `@autoverse/gta-compat`: Joaat hash calculation and GTA color palette utilities.
- `@autoverse/authentic-geometry-engine`: Quality classifier and provenance certification.
