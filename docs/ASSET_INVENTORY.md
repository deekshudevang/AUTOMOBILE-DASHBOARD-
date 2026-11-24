# AUTOVERSE 3D — Asset Inventory & Compatibility Audit

> **Generated**: 2026-11-10  
> **Source Directory**: `c:\Users\deeks\Downloads\cars`  

---

## 1. Discovered 3D Assets

| Category | File Count | Supported Formats | Location | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Incoming 3D Meshes** | **0** | `.glb`, `.gltf`, `.fbx`, `.obj` | `Vehicles/` | No incoming 3D geometries present in user directory |
| **Native GTA Formats** | **0** | `.yft`, `.ytd` | `Vehicles/` | Native game archives not directly loadable in Three.js |
| **Textures / Images** | **0** | `.png`, `.jpg`, `.dds` | `Vehicles/` | No standalone textures in source folder |
| **HDR Environments** | **0** | `.hdr`, `.exr` | `Vehicles/` | Three.js Drei procedural studio presets used as baseline |

---

## 2. Asset Strategy & Zero-Fabrication Enforcement

In compliance with Non-Negotiable Rule 4 ("Never treat a model hash as an asset path") and Rule 5 ("Never substitute an approximate model without a visible label"):

1. **Explicit Missing Asset States**:
   When a model hash has no mapped asset path in `vehicle-assets/manifest.json`, the viewer renders:
   - A diagnostic holographic wireframe chassis with target wheel hubs.
   - An actionable missing asset overlay card displaying:
     * Model Joaat Hash (Hex & Decimal)
     * Detected Manufacturer and GTA archetype
     * Detected tuning specifications
     * A one-click file uploader allowing the user to import and bind custom `.glb` / `.gltf` / `.obj` / `.fbx` models.

2. **Parametric Procedural Chassis (Approximate Templates)**:
   For demonstration and baseline visualization, procedural geometric chassis are generated using real lathe, extruded, and spline surfaces. Every procedural assembly carries the mandatory UI banner:
   > ⚠️ **APPROXIMATE TEMPLATE — Not Authentic Manufacturer Geometry**

3. **Runtime Asset Importer**:
   The **Asset Manager** allows users to drag and drop legally exported Blender `.glb` assets, calibrate wheel attachment points, assign material slots, and bind them directly to any vehicle model hash.

