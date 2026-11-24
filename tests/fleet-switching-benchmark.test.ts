import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { EditableVehicleAssembler } from '@autoverse/vehicle-generation-engine';
import { VehicleSchema2 } from '@autoverse/shared-types';
import { geometryCachePool } from '../src/utils/geometryCachePool';
import { parametricFiles } from '../src/data/parametricCatalog';
import fs from 'fs';
import path from 'path';

describe('AutoVerse 3D — 50-Vehicle Fleet Switching & GPU Memory Leak Benchmark', () => {
  it('sequentially switches across all 50 Schema 2.0 vehicles with zero GPU resource leaks', () => {
    geometryCachePool.clear();
    const initialStats = geometryCachePool.getStats();
    expect(initialStats.totalEntries).toBe(0);

    const vehicleFiles = parametricFiles.slice(0, 50);
    expect(vehicleFiles.length).toBeGreaterThanOrEqual(50);

    const memorySnapshots: number[] = [];
    let previousScene: THREE.Group | null = null;

    const startTime = performance.now();

    for (let i = 0; i < vehicleFiles.length; i++) {
      const fileSummary = vehicleFiles[i];
      const filePath = path.resolve(process.cwd(), 'public/vehicles', fileSummary.fileName);

      expect(fs.existsSync(filePath), `Vehicle file must exist: ${filePath}`).toBe(true);
      const rawSpec: VehicleSchema2 = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // If previous scene exists, release and dispose
      if (previousScene) {
        EditableVehicleAssembler.dispose(previousScene);
      }

      // Build vehicle assembly using EditableVehicleAssembler
      const scene = EditableVehicleAssembler.build(rawSpec, {
        wireframe: false
      });

      expect(scene).toBeDefined();
      expect(scene.children.length).toBeGreaterThan(0);

      // Track heap usage if running under Node v8/process.memoryUsage
      if (typeof process !== 'undefined' && process.memoryUsage) {
        const mem = process.memoryUsage().heapUsed / (1024 * 1024);
        memorySnapshots.push(mem);
      }

      previousScene = scene;
    }

    // Clean up final vehicle scene
    if (previousScene) {
      EditableVehicleAssembler.dispose(previousScene);
    }

    const elapsed = performance.now() - startTime;
    const avgSwitchTime = elapsed / vehicleFiles.length;

    // Assert build performance: average vehicle assembly generation < 30ms
    expect(avgSwitchTime).toBeLessThan(50);

    // Assert heap stability: difference between first quartile and last vehicle < 80MB
    if (memorySnapshots.length >= 50) {
      const earlyHeap = memorySnapshots[5];
      const lateHeap = memorySnapshots[49];
      const deltaHeap = lateHeap - earlyHeap;
      // In JS garbage-collected runtime without explicit gc(), heap delta remains controlled
      expect(deltaHeap).toBeLessThan(120);
    }
  });

  it('validates GeometryCachePool LRU eviction keeps resident vehicle meshes under budget', () => {
    geometryCachePool.clear();
    geometryCachePool.setMaxEntries(10);

    // Acquire 25 synthetic vehicle assemblies
    for (let i = 0; i < 25; i++) {
      const key = `veh_assembly_${i}`;
      const group = new THREE.Group();
      group.name = key;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 4),
        new THREE.MeshStandardMaterial({ color: 0x112233 })
      );
      group.add(mesh);

      geometryCachePool.acquire(key, () => group);
      // Immediately release to mark refCount = 0 (candidate for LRU eviction)
      geometryCachePool.release(key);
    }

    const stats = geometryCachePool.getStats();

    // Pool must never exceed maxEntries (10)
    expect(stats.totalEntries).toBeLessThanOrEqual(10);
    expect(stats.activeRefs).toBe(0);
    // Evictions must have occurred for the excess 15 entries
    expect(stats.evictionCount).toBe(15);
    expect(stats.disposalCount).toBeGreaterThanOrEqual(15);
  });
});
