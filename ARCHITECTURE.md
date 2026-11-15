# AUTOVERSE 3D — System Architecture & Technical Specification

## 1. Architectural Overview

AUTOVERSE 3D is designed with a reactive, unidirectional data flow powered by **Zustand**, driving a **React Three Fiber (Three.js)** WebGL rendering pipeline, with zero-latency bidirectional synchronization with a raw JSON editor.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              AUTOVERSE 3D                              │
└────────────────────────────────────────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌─────────────────────────┐                       ┌─────────────────────┐
│    Zustand Store        │◄─── Two-Way Sync ────►│    JSON Explorer    │
│  (useVehicleStore.ts)   │                       │  (Monaco/Textarea)  │
└─────────────────────────┘                       └─────────────────────┘
           │
           ├────────────────────────┬────────────────────────┐
           ▼                        ▼                        ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  3D Studio Engine   │  │ Vehicle Library &   │  │ Comparison Studio   │
│  - Three.js Canvas  │  │ Dashboard Analytics │  │ - Multi-Canvas      │
│  - PBR Materials    │  │ - 108 Configurations│  │   Synchronization   │
│  - Customizer Panel │  │ - 74 Unique Models  │  │ - Diff Matrix       │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## 2. Rendering Pipeline & Shaders

### A. Clearcoat Automotive Body Paint
Vehicle bodywork is rendered using `THREE.MeshPhysicalMaterial` with:
- `roughness`: 0.15 - 0.25 (tuned based on metallic vs matte palette)
- `metalness`: 0.85 - 0.95
- `clearcoat`: 0.95 - 1.0 (creates the optical illusion of deep automotive lacquer)
- `clearcoatRoughness`: 0.08
- `color`: dynamically evaluated from custom sRGB `{r, g, b}` or mapped GTA palette swatch.

### B. Realistic Glass
Window glass is rendered using high transmission PBR parameters:
- `transmission`: 0.85
- `ior` (Index of Refraction): 1.52 (automotive safety glass)
- `roughness`: 0.05
- `opacity`: dynamically scaled by `windowTint` (0.15 for clear glass to 0.98 for limo tint).

### C. 4-Channel Independent Neon Underglow
Neon underglow utilizes hardware-accelerated ground-level `THREE.PointLight` nodes with distance attenuation and quadratic decay ($decay = 2$), coupled with additive blending emissive light tubes under the rocker panels.

### D. Dynamic HTML5 Canvas License Plates
License plates are synthesized into runtime `THREE.CanvasTexture` instances with 8x anisotropic filtering, accurately rendering San Andreas and North Yankton state emblems, borders, registration tags, and uppercase 8-character vehicle identifiers.

---

## 3. Data Schema & Model Identification

### Jenkins One-At-A-Time (`joaat`) Hash Architecture
Every Cherax Entity vehicle configuration declares a 32-bit model identifier. The engine computes:

$$\text{hash} = \text{joaat}(\text{vehicle\_name})$$

All 74 distinct model IDs in the provided dataset were systematically matched against official GTA V vehicle definitions and mapped to their real-world vehicle counterparts.

### Two-Way Synchronization Architecture
To avoid circular loops between the 3D customizer controls and the text-based JSON editor:
1. Keystrokes in the raw JSON editor trigger non-recording updates (`updateConfig(updater, false)`).
2. The 3D view observes the active configuration state and updates Three.js material uniform properties directly.
3. Sliders and color pickers in the customizer push to the store and record history snapshots only on commit, preventing memory bloat.

---

## 4. Performance Optimization (RTX 4060 Target)

- **Preserve Drawing Buffer**: WebGL renderer is initialized with `preserveDrawingBuffer: true`, allowing instantaneous high-resolution snapshot captures without canvas repainting.
- **Resource Disposal**: On switching vehicles, unmounted geometry buffers, textures, and material shaders are cleanly dereferenced to prevent GPU VRAM exhaustion.
- **Tone Mapping**: `ACESFilmicToneMapping` ensures realistic highlights without blown-out specular highlights on white or chrome paint jobs.

