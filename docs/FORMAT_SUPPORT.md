# AUTOVERSE 3D — 3D FILE FORMAT SPECIFICATION & SUPPORT MATRIX
## Technical Documentation for Multi-Format Automotive Geometry Ingestion

**Document**: `FORMAT_SUPPORT.md`  
**System**: AutoVerse 3D AAGE Format Pipeline  
**Version**: 1.0.0  
**Date**: November 2026  

---

## 1. Supported Format Matrix Overview

The Authentic Automotive Geometry Engine (AAGE) provides a universal ingestion pipeline supporting 8 distinct 3D geometry and configuration formats.

| Format Extension | Format Standard / Specification | Parser Subsystem | Primary Use Case | Materials / Textures | Animation / Rigging | Spatial Scale Normalization |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`.glb`** | glTF 2.0 Binary (Khronos Group) | Three.js `GLTFLoader` | Production web assets, Draco compressed | PBR Metallic/Roughness, Embedded | Yes (Bones, Morph Targets) | Automatic to Meters |
| **`.gltf`** | glTF 2.0 JSON (Khronos Group) | Three.js `GLTFLoader` | Human-readable transmission format | PBR External / Embedded | Yes | Automatic to Meters |
| **`.obj`** | Wavefront Polygonal Geometry | Three.js `OBJLoader` | DCC exchange (Blender, Maya, 3ds Max) | Supported via companion `.mtl` | No | Automatic to Meters |
| **`.fbx`** | Autodesk Filmbox Exchange | Three.js `FBXLoader` | Studio game assets, complex hierarchies | Phong / Standard Materials | Yes (Full skeletal rigging)| Automatic to Meters |
| **`.stl`** | Stereolithography (3D Systems) | Three.js `STLLoader` | Rapid prototyping, wind tunnel scan | Raw facet normals (Single color) | No | Automatic to Meters |
| **`.ply`** | Stanford Polygon File Format | Three.js `PLYLoader` | LiDAR 3D scanning, point clouds | Vertex colors / Face properties | No | Automatic to Meters |
| **`.step` / `.stp`**| ISO 10303-21 Industrial CAD B-rep | Native `StepLoader` | Engineering OEM CAD models (CATIA, NX) | B-rep tessellated PBR surface | No | Automatic to Meters |
| **`.json`** | AutoVerse / Cherax / FiveM XML | `@autoverse/json-intelligence` | Vehicle tuning & customization state | Procedural shader parameters | No | N/A (Configuration only) |

---

## 2. Deep Technical Breakdown by Format

### 2.1 GLB / GLTF (glTF 2.0)
- **Standard**: ISO/IEC 12113:2022.
- **Engine Implementation**: Three.js `GLTFLoader`.
- **Capabilities**:
  - Full node hierarchy with preservation of part naming (`hood`, `wheel_fl`, `door_fr`).
  - Native PBR metallic-roughness materials, normal maps, occlusion maps, and emissive channels.
  - Efficient binary chunk storage for vertex attributes (`POSITION`, `NORMAL`, `TEXCOORD_0`, `TANGENT`).
- **Optimization**: Compatible with Draco mesh compression for low memory footprint on web clients.

### 2.2 STEP / STP (ISO 10303-21)
- **Standard**: Standard for the Exchange of Product Model Data (STEP AP214 / AP242).
- **Engine Implementation**: Native `StepLoader` in `packages/authentic-geometry-engine/src/loaders/stepLoader.ts`.
- **Capabilities**:
  - Direct client-side parsing of text-based STEP exchange structures without requiring cloud licensing or server-side CAD kernels.
  - Evaluates topological entities:
    * `CARTESIAN_POINT`: 3D coordinates $(X, Y, Z)$.
    * `DIRECTION`: Unit direction vectors.
    * `VERTEX_POINT`: Topological boundary nodes.
    * `EDGE_CURVE`: 3D boundary curves.
    * `FACE_OUTER_BOUND`: Closed perimeter loop for surface patches.
    * `ADVANCED_FACE`: 3D geometric surfaces.
    * `MANIFOLD_SOLID_BREP`: Watertight 3D solids.
  - Polygonal Ear-Clipping and Fan Tessellation: Decomposes arbitrary $N$-sided B-rep face loops into indexed triangle meshes with analytical surface unit normals.

### 2.3 OBJ (Wavefront)
- **Standard**: ASCII Wavefront Geometry Definition.
- **Engine Implementation**: Three.js `OBJLoader`.
- **Capabilities**:
  - Evaluates vertex vectors (`v`), texture coordinates (`vt`), vertex normals (`vn`), and polygonal face indices (`f`).
  - Supports arbitrary polygon sizes (quads, $N$-gons) automatically decomposed into triangle strips.
  - Groups (`g`) and object identifiers (`o`) are preserved to feed the `ComponentRecognizer`.

### 2.4 FBX (Autodesk Filmbox)
- **Standard**: Binary & ASCII FBX (2014–2020 format revisions).
- **Engine Implementation**: Three.js `FBXLoader`.
- **Capabilities**:
  - Preserves multi-level assembly hierarchies, transform origins, and coordinate frames.
  - Converts embedded materials to Three.js `MeshStandardMaterial` for automotive PBR shading.

### 2.5 STL (Stereolithography)
- **Standard**: Binary & ASCII STL.
- **Engine Implementation**: Three.js `STLLoader`.
- **Capabilities**:
  - Ingests raw triangle facet buffers.
  - Computes vertex adjacency and welded topology via `BufferGeometryUtils` or `MeshTopologyAnalyzer`.
  - Ideal for rapid ingestion of aerodynamic computational fluid dynamics (CFD) surfaces.

### 2.6 PLY (Stanford Polygon File Format)
- **Standard**: PLY Polygon File Format (ASCII & Little-Endian Binary).
- **Engine Implementation**: Three.js `PLYLoader`.
- **Capabilities**:
  - Ingests scanned surface meshes and point clouds.
  - Supports RGB vertex colors for scan visualization.
  - Evaluates range-image data from laser scanners.

### 2.7 JSON (AutoVerse / Cherax / FiveM)
- **Standard**: Cherax Entity JSON / FiveM `vehicles.meta` XML.
- **Engine Implementation**: `@autoverse/json-intelligence`.
- **Capabilities**:
  - Ingests customization states: colors (primary, secondary, pearlescent, neon), GTA mod slots (`mod0` to `mod49`), extras bitmasks, wheel types, window tint, and license plate text.
  - **Note**: Vehicle JSON files contain zero 3D vertices; they configure the appearance and mechanical properties of the bound 3D geometry.

---

## 3. Spatial Unit Detection & Automatic Scaling

Automotive CAD files are exported in different dimensional units depending on the engineering software used. AAGE detects and scales all assets to metric **meters ($m$)**:

```
+--------------------------------------------------------------------------------+
|                        SPATIAL UNIT DETECTION LOGIC                            |
+--------------------------------------------------------------------------------+
| Raw Length > 1500      -->  MILLIMETERS (mm)   -->  Scale Multiplier: 0.0010   |
| Raw Length in 150-1500 -->  CENTIMETERS (cm)   -->  Scale Multiplier: 0.0100   |
| Raw Length in 60-150   -->  INCHES (in)        -->  Scale Multiplier: 0.0254   |
| Raw Length in 5-25     -->  FEET (ft)          -->  Scale Multiplier: 0.3048   |
| Raw Length in 1.5-6.0  -->  METERS (m)         -->  Scale Multiplier: 1.0000   |
+--------------------------------------------------------------------------------+
```

### 3.1 Normalization Algorithm
```typescript
function detectUnitScale(bbox: THREE.Box3): { unit: string; scaleMultiplier: number } {
  const size = bbox.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  if (maxDim > 1500) {
    return { unit: 'mm', scaleMultiplier: 0.001 };
  } else if (maxDim > 150) {
    return { unit: 'cm', scaleMultiplier: 0.01 };
  } else if (maxDim > 60) {
    return { unit: 'in', scaleMultiplier: 0.0254 };
  } else if (maxDim > 5) {
    return { unit: 'ft', scaleMultiplier: 0.3048 };
  } else {
    return { unit: 'm', scaleMultiplier: 1.0 };
  }
}
```

---

## 4. Format Selection Guidelines for Users

| User Goal | Recommended Format | Reason |
| :--- | :--- | :--- |
| **Maximum Web Rendering Performance** | `.glb` | Smallest file size, fastest GPU loading, Draco compression supported. |
| **Engineering CAD / OEM Data** | `.step` / `.stp` | Pure mathematical B-rep, zero polygonal decimation, exact curvature. |
| **DCC & Custom 3D Modeling (Blender)** | `.glb` or `.obj` | Preserves mesh component names, UV coordinates, and material assignments. |
| **3D Laser Scans / Photogrammetry** | `.ply` or `.stl` | High-density point clouds and watertight facet tessellations. |
| **Game Asset Modification** | `.fbx` or `.glb` | Complete hierarchy with separated wheels, doors, and glass meshes. |

