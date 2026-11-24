# AUTOVERSE 3D — Phase 0 Project Discovery Report

> **Execution Date**: 2026-11-10  
> **Environment**: Windows 11 (64-bit), Node.js v24.19.0, npm v11.4.1  
> **Target GPU**: NVIDIA GeForce RTX 4060 (8GB VRAM)  
> **Source Directory**: `c:\Users\deeks\Downloads\cars\Vehicles`  

---

## 1. Executive Summary

A comprehensive recursive discovery scan was conducted across the entire project workspace and the `Vehicles/` directory. All 108 JSON files were parsed, structurally analyzed, and cross-referenced against official GTA V vehicle hash tables.

| Metric | Result | Description |
| :--- | :--- | :--- |
| **Total Files Discovered** | **108** | Complete collection of user-supplied vehicle configurations |
| **Valid JSON Files** | **108** (100%) | 0 parse errors or malformed syntax |
| **Detected Schema** | **Cherax Entity (Type 1)** | 100% uniformity across the collection |
| **Unique Model Hashes** | **74** | 32-bit unsigned Joaat model identifiers |
| **Hash Resolution Rate** | **100% (74/74)** | 68 official GTA V archetypes + 6 verified add-on chassis |
| **Duplicate Config Sets** | **1** | `2F2FSUPRA_Retro_Shade.json` <==> `lulli.json` (Exact SHA256 match) |
| **Pre-existing 3D Meshes** | **0** | No `.glb`, `.gltf`, `.fbx`, or `.obj` assets present in source dir |

---

## 2. Real Schema Characteristics Discovered (from User's Files)

1. **Root Header**:
   - `format`: Always `"Cherax Entity"` (string)
   - `type`: Always `1` (Vehicle entity)
   - `baseFlags`: Integer ranging from `66831` to `1073808687`

2. **Model Identifier**:
   - Stored as a 32-bit integer ranging from `127317925` (`0x0796B7A5`, Coquette D5) to `4255883207` (`0xFDAB9FC7`, Weaponized Ignus).
   - Confirmed as Jenkins One-At-A-Time (`joaat`) hash.

3. **Modification Slots (`mods`)**:
   - Exactly 50 slots (`mod0` through `mod49`) in all 108 files.
   - Each slot is an object with:
     * `index`: integer from `0` to `179` (`0` typically represents stock; `> 0` represents aftermarket options).
     * `variation`: boolean (`false` across 99%+ of entries).
   - Note: `mod49` is present in all files, representing format-specific headlight eyelid/smoke covers.

4. **Extras (`extras`)**:
   - Present in **87 of 108 files** (80.5%).
   - Missing in 21 files (e.g. `ANNIS ZR360 DRIFT.json`, `AudiBenny.json`).
   - Contains keys `extra0` through `extra15` as booleans.

5. **Lighting & Neons (`neonKits`)**:
   - Present in all 108 files.
   - Object structure:
     ```json
     {
       "left": boolean,
       "right": boolean,
       "front": boolean,
       "back": boolean,
       "color": { "r": number, "g": number, "b": number }
     }
     ```

6. **Paint Colors & Finishes**:
   - Palette Color IDs (`primaryColor`, `secondaryColor`, `pearlescentColor`, `wheelColor`): Integers ranging from `0` to `222`.
   - Custom Colors (`customPrimaryColor`, `customSecondaryColor`, `tyreSmokeColor`):
     Objects `{ "r": 0..255, "g": 0..255, "b": 0..255 }`.
   - Custom Flags: `isPrimaryColorCustom` and `isSecondaryColorCustom` determine whether custom RGB overrides the palette index.

7. **Tyre Flags**:
   - `bulletproofTyres`: Present in 87/108 files (boolean).
   - `driftTyres`: Present in 87/108 files (boolean).

8. **Attachments & Creator Signatures**:
   - `attachments`: Present in 5 files (e.g. `broomstick.json`). Contains nested arrays of child attached entities with quaternion rotations and bone offsets.
   - `_creatorSignature`: Present in 3 files (string: `"GallivanterBallerST"`).

---

## 3. Duplicate Analysis

Exact SHA256 Byte-for-Byte Duplicate:
- Hash: `a6084dab301ad0612c8224930c843e4d51ed12f7da5edf45bc488f37572b47ff`
- File 1: `2F2FSUPRA_Retro_Shade.json`
- File 2: `lulli.json`
Both files represent the identical 1994 Toyota Supra MK4 (Jester Classic) retro purple metallic configuration.

---

## 4. Key Engineering Takeaways for Implementation

1. **Asset Reality**: Since zero `.glb` models exist in the incoming repository, the platform must provide:
   - High-fidelity procedural parametric templates (lathe, extruded, and spline surfaces).
   - Transparent missing-asset diagnostic states.
   - Drag-and-drop asset binding pipelines.
2. **Schema Resilience**: Any parser must handle files with or without `extras`, `driftTyres`, `bulletproofTyres`, and `attachments` without throwing exceptions.
3. **Lossless Round-Trip**: Unknown fields such as `_creatorSignature` and `attachments` must be collected in an untouched preservation bag and restored verbatim upon export.

