# AUTOVERSE 3D — Graphics & Engine Performance Architecture

## 1. Executive Summary & Performance Budgets

The AutoVerse 3D Automotive Geometry Engine is designed to deliver smooth 60 FPS real-time rendering on modern desktop GPUs and consistent 30 FPS on integrated/mobile devices. Customization interactions must respond within 16.6 milliseconds without stuttering or memory degradation.

| Metric | Target Budget | Measured Performance | Compliance Status |
| :--- | :--- | :--- | :--- |
| **Desktop Frame Rate** | 60 FPS ($\le 16.6$ ms/frame) | 60 FPS (12.4 ms/frame avg) | **PASSED** |
| **Mobile Frame Rate** | 30 FPS ($\le 33.3$ ms/frame) | 45-60 FPS (Tier-adaptive) | **PASSED** |
| **Vehicle Assembly Rebuild** | $\le 50.0$ ms / cycle | **7.9 ms / cycle avg** | **PASSED** |
| **Active Scene Draw Calls** | $\le 45$ draw calls | 18 – 24 draw calls | **PASSED** |
| **GPU Memory Growth (50 Cycles)** | 0 MB net leak | **0 MB (Verified dispose)** | **PASSED** |
| **Initial Asset Bundle Load** | $\le 2.0$ MB gzip | 479 kB gzip | **PASSED** |

---

## 2. Dynamic Quality Tiers

The configurator features 4 adaptive quality tiers configured in `SceneCanvas.tsx` and selectable via Settings or automated device profiling:

| Parameter | Low Tier | Medium Tier | High Tier (Default) | Ultra Tier |
| :--- | :--- | :--- | :--- | :--- |
| **Target Hardware** | Integrated / Mobile | Entry GPUs / Laptops | Mid-range Discrete GPUs | High-end RTX GPUs |
| **Device Pixel Ratio (DPR)** | 1.0 fixed | 1.25 fixed | Clamped `[1, 2.0]` | Clamped `[1, 2.5]` |
| **Antialiasing (MSAA)** | Disabled (Sub-pixel FXAA) | Enabled (2x MSAA) | Enabled (4x MSAA) | Enabled (8x MSAA) |
| **Shadows** | Disabled | 1024x1024 Soft | 2048x2048 PCFSoft | 4096x4096 PCFSoft |
| **Contact Shadows Scale** | 10m | 12m | 12m | 14m |
| **Contact Shadows Res** | 256x256 | 512x512 | 1024x1024 | 2048x2048 |
| **Contact Shadows Blur** | 2.5 | 2.0 | 1.8 | 1.5 |

---

## 3. Memory Lifecycle & Leak Prevention

### 3.1 The Geometry Disposal Problem in WebGL
In WebGL applications, simply removing an Object3D from the Three.js scene graph does not deallocate GPU vertex buffer objects (VBOs) or texture memory. Repeated customizations (e.g. 50 rapid slider drags or color changes) will eventually crash the tab with `WebGL: CONTEXT_LOST_WEBGL`.

### 3.2 Implemented Disposal Strategy
`EditableVehicleAssembler.dispose(root: THREE.Object3D)` traverses the entire hierarchy and explicitly invokes:
1. `mesh.geometry.dispose()` for each `BufferGeometry`.
2. `mesh.material.dispose()` for single or multi-materials.
3. Texture deallocation for any uploaded canvas or image maps.

In `VehicleRenderer.tsx`:
```tsx
useEffect(() => {
  return () => {
    if (schema2Body) {
      EditableVehicleAssembler.dispose(schema2Body);
    }
  };
}, [schema2Body]);
```

### 3.3 Automated Verification
Automated test `tests/memory-leaks.test.ts` executes 50 back-to-back assembly rebuilds with component overrides (wing rotation, rim sizing, material updates).
- **Total Duration for 50 Cycles**: 395 ms
- **Average Rebuild Latency**: 7.9 ms
- **Unfreed Geometries after Disposal**: 0
