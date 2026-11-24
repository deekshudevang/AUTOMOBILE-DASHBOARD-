# AUTOVERSE — PHASE 22 GPU MEMORY LIFECYCLE & CACHE POOL REPORT

**Audit Date**: 2026-11-24  
**Status**: VERIFIED & ACCEPTED  
**Component**: `GeometryCachePool` (`src/utils/geometryCachePool.ts` & `@autoverse/vehicle-generation-engine`)

---

## 1. Architecture Overview

Prior to Phase 22, repeatedly switching between vehicles or modifying procedural parameters caused GPU memory to grow steadily because discarded `THREE.BufferGeometry`, `THREE.Material`, and texture buffers were not systematically tracked or evicted.

To solve this, Phase 22 introduces `GeometryCachePool`, an LRU-evicting, reference-counted WebGL memory manager:

```
[VehicleRenderer / Assembler]
           │
           ▼
┌──────────────────────────────────────────────┐
│             GeometryCachePool                │
│  - maxEntries: 10 (configurable)             │
│  - refCount tracking per assembly            │
│  - LRU timestamp eviction queue              │
└──────────────────────────────────────────────┘
           │
           ├─► Cache Hit  ──► refCount++ (instant render)
           │
           └─► Capacity > 10 ──► Evict oldest refCount===0
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │     Recursive Resource        │
                       │          Disposal             │
                       │ - geom.dispose()              │
                       │ - mat.dispose()               │
                       │ - tex.dispose() (all channels)│
                       │ - scene.clear()               │
                       └───────────────────────────────┘
```

---

## 2. Key Capabilities & Mechanics

1. **Explicit Reference Counting**:
   - `acquire(key, factory)` increments `refCount` for actively rendered vehicle assemblies.
   - `release(key)` decrements `refCount`. Active vehicles (`refCount > 0`) are strictly immune to eviction.
2. **LRU Eviction with Strict Budget**:
   - Eviction budget set to a maximum of 10 cached vehicle assemblies.
   - When the 11th vehicle is loaded, the least recently used vehicle with `refCount === 0` is evicted and destroyed.
3. **Deep Texture & Material Disposal**:
   - In addition to geometries, the disposal pipeline inspects all 13 material texture channels: `map`, `normalMap`, `roughnessMap`, `metalnessMap`, `envMap`, `aoMap`, `alphaMap`, `emissiveMap`, `bumpMap`, `displacementMap`, `clearcoatMap`, `clearcoatRoughnessMap`, `clearcoatNormalMap`.
4. **Lifecycle Hooks in VehicleRenderer**:
   - `schema2Body`, `parametricBody`, and `proceduralBody` now possess dedicated cleanup `useEffect` hooks ensuring every intermediate 3D model is released and disposed when components change or unmount.

---

## 3. Test Suite Verification (`tests/geometry-cache-pool.test.ts`)

```
 ✓ tests/geometry-cache-pool.test.ts (4 tests) 8ms
   ✓ acquires and caches resources with reference counting
   ✓ evicts unreferenced resources in LRU order when capacity is exceeded
   ✓ protects actively referenced resources from being evicted
   ✓ recursively disposes Object3D trees and materials on clear
```

All 4 lifecycle unit tests pass with 100% assertions satisfied.
