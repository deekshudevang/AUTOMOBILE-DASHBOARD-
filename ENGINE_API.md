# AUTOVERSE 3D — Standalone Engine API Reference (`ENGINE_API.md`)

## 1. Engine Architecture & Decoupling

The Vehicle Generation Engine operates completely decoupled from React, Vite, or the browser DOM. It can be imported in Node.js automated testing environments, headless CLI tools, or browser runtime contexts.

```typescript
import {
  discoverVehicleFiles,
  detectJSONSchema,
  parseVehicleConfiguration,
  normalizeVehicleSpecification,
  resolveVehicleIdentity,
  resolveVehicleAssets,
  generateVehicleGeometry,
  applyVehicleModifications,
  applyVehicleMaterials,
  applyVehicleLighting,
  assembleVehicle,
  validateVehicleAssembly,
  exportVehicleConfiguration,
  exportVehicleGeometry
} from '@autoverse/vehicle-generation-engine';
```

---

## 2. API Method Signatures & Contracts

### `discoverVehicleFiles(dir: string): Promise<DiscoveredFile[]>`
Recursively scans target directory for `.json` and `.xml` vehicle files, computing SHA-256 hashes for content deduplication.

### `detectJSONSchema(raw: string): SchemaDetectionResult`
Inspects raw text to determine whether the document is a `Cherax Entity (Type 1)`, `FiveM Metadata XML`, or `Generic Vehicle JSON`.

### `parseVehicleConfiguration(raw: string, filename?: string): ParseResult`
Parses the input string with strict schema validation. Returns normalized configuration and collects unrecognized fields into the lossless preservation bag.

### `resolveVehicleIdentity(spec: VehicleSpecification): VehicleIdentityResolution`
Computes unsigned and signed 32-bit Joaat hashes, querying the vehicle registry to retrieve GTA archetype, manufacturer, real-world model equivalent, and resolution confidence (`VERIFIED_NATIVE`, `ADDON_MATCH`, `MANUAL_MAPPING`, `UNRESOLVED`).

### `resolveVehicleAssets(spec: VehicleSpecification): AssetResolutionResult`
Queries `vehicle-assets/manifest.json`. Returns the asset path, material mappings, wheel attachment points, and camera presets, or flags an explicit `MISSING_ASSET` state.

### `generateVehicleGeometry(spec: VehicleSpecification, profile: GeometryProfile): VehicleAssembly`
Constructs the procedural 3D automotive assembly (chassis, greenhouse, splitters, diffusers, wheel assemblies) using lathe, extruded, and spline surfaces. Attaches the approximate template banner if procedural.

### `assembleVehicle(spec: VehicleSpecification, components: ComponentMap): ValidatedSceneGraph`
Assembles the complete Three.js hierarchical scene graph with local transforms, anchor attachment points, and bounding box collision proxies.

### `exportVehicleConfiguration(spec: VehicleSpecification, format: 'cherax' | 'fivem_xml' | 'generic'): string`
Serializes the vehicle specification back to disk. Guarantees byte-identical fidelity if unmodified, and lossless preservation of unknown properties if edited.

