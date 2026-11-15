# AUTOVERSE 3D — Vehicle Asset Creation & Registry Guide

## 1. Overview

AUTOVERSE 3D follows a strict modular asset architecture. Vehicles are registered in `public/vehicle-assets/manifest.json`.

```
public/vehicle-assets/
├── manifest.json
├── cars/
│   ├── bmw/
│   │   └── m3_g80.glb
│   ├── porsche/
│   │   └── 911_gt3.glb
│   ├── audi/
│   │   └── r8_widebody.glb
│   ├── lamborghini/
│   │   └── huracan.glb
│   ├── ferrari/
│   │   └── sf90.glb
│   ├── toyota/
│   │   └── supra_mk4.glb
│   ├── nissan/
│   │   └── rx7_fd.glb
│   └── mercedes/
│       └── amg_gt.glb
├── environments/
└── textures/
```

---

## 2. Manifest Schema

Every vehicle entry in `manifest.json` specifies:

```json
{
  "modelHash": 2709293299,
  "modelCode": "sentinel5",
  "displayName": "Sentinel GTS (BMW M3 Competition G80)",
  "manufacturer": "Ubermacht / BMW",
  "assetPath": "/vehicle-assets/cars/bmw/m3_g80.glb",
  "assetFormat": "glb",
  "supportedModifications": ["mod0", "mod1", "mod2", "mod3", "mod4", "mod5", "mod7", "mod10", "mod15", "mod22", "mod23", "mod48"],
  "materialNames": {
    "bodyPaint": "Paint_Primary",
    "secondaryPaint": "Paint_Secondary",
    "glass": "Glass_Window",
    "wheels": "Rims_Alloy",
    "calipers": "Brake_Calipers",
    "interior": "Interior_Leather",
    "lights": "Light_Emissive"
  },
  "wheelAttachmentPoints": {
    "frontLeft": [-0.88, 0.35, 1.42],
    "frontRight": [0.88, 0.35, 1.42],
    "rearLeft": [-0.90, 0.35, -1.38],
    "rearRight": [0.90, 0.35, -1.38]
  },
  "cameraPresets": {
    "default": [3.6, 1.6, 4.4],
    "interior": [0.35, 1.05, 0.1],
    "front": [0.0, 1.2, 4.8],
    "rear": [0.0, 1.2, -4.8],
    "left": [-4.8, 1.2, 0.0],
    "right": [4.8, 1.2, 0.0],
    "top": [0.0, 6.5, 0.1]
  },
  "lodLevels": ["LOD0", "LOD1"]
}
```

---

## 3. The Zero-Fabrication Guarantee

When an unknown vehicle model hash is loaded (or an asset file has not been assigned):
1. The engine **never** fabricates an approximate model and labels it as the exact car.
2. The engine displays an explicit, high-tech missing-asset state with the detected tuning attributes and an in-app drag-and-drop 3D asset importer.
3. Users can assign custom GLB, GLTF, OBJ, or FBX models on the fly through the **Asset Manager** tab.

