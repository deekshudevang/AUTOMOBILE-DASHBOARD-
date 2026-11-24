# AutoVerse — Component Asset Standard (`COMPONENT_ASSET_STANDARD.md`)

This standard defines the schema, metadata, geometry, and packaging requirements for all vehicle component assets in AutoVerse.

---

## 1. Component Schema Specification

Every component asset must conform to the following JSON structure:

```json
{
  "id": "comp_uuid_or_stable_id",
  "name": "Human Readable Component Name",
  "category": "exterior | lighting | wheels | chassis | interior | aerodynamics",
  "semanticType": "front_splitter | rear_wing | wheel_fl | ...",
  "editability": "PARAMETRIC | MESH_EDITABLE | VIEW_ONLY",
  "parentId": "parent_comp_id",
  "parentAnchorName": "anchor_name",
  "attachmentPoints": [
    {
      "name": "mount_point_a",
      "anchorId": "anc_01",
      "localPosition": [x, y, z],
      "localRotation": [rx, ry, rz],
      "required": true
    }
  ],
  "material": {
    "materialId": "carbon_fiber_gloss",
    "type": "carbon_fiber | body_paint | rubber | aluminum | glass",
    "colorHex": "#1E293B",
    "roughness": 0.25,
    "metalness": 0.8
  },
  "provenance": "manufacturer-CAD | licensed-mesh | photo-reconstruction | user-created | procedural-placeholder",
  "massEstimateKg": {
    "value": 6.5,
    "isEstimate": true,
    "formula": "density * volume"
  },
  "locked": false,
  "visible": true,
  "geometryHash": "sha256_hash_of_underlying_mesh",
  "bounds": {
    "min": [xMin, yMin, zMin],
    "max": [xMax, yMax, zMax]
  }
}
```

---

## 2. Geometric Requirements

1. **Coordinate System:** Defined in ISO 8855 / SAE coordinates in metres.
2. **Watertightness:** Exterior aerodynamic parts must form closed 2-manifold shells.
3. **Finite Trailing Edges:** Wings and diffusers must feature trailing edge thickness $t_\text{TE} \ge 1\text{mm}$ to allow prism boundary-layer mesh generation.
4. **Mirroring Rule:** Right-side components ($+Y \rightarrow -Y$) must be generated with inverted Y coordinates and mirrored normal vectors.
