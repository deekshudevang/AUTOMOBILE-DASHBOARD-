import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { GeometryCachePool } from '../src/utils/geometryCachePool';

describe('AutoVerse 3D — GeometryCachePool & WebGL Memory Lifecycle Suite', () => {
  it('acquires and caches resources with reference counting', () => {
    const pool = new GeometryCachePool(5);

    let factoryCallCount = 0;
    const factory = () => {
      factoryCallCount++;
      return new THREE.BoxGeometry(1, 1, 1);
    };

    // First acquire: cache miss, factory called
    const geom1 = pool.acquire('box_1', factory);
    expect(factoryCallCount).toBe(1);
    expect(pool.getStats().missCount).toBe(1);
    expect(pool.getStats().hitCount).toBe(0);
    expect(pool.getStats().activeRefs).toBe(1);

    // Second acquire: cache hit, factory not called
    const geom2 = pool.acquire('box_1', factory);
    expect(factoryCallCount).toBe(1);
    expect(pool.getStats().hitCount).toBe(1);
    expect(pool.getStats().activeRefs).toBe(2);
    expect(geom1).toBe(geom2);

    // Release once: still referenced
    pool.release('box_1');
    expect(pool.getStats().activeRefs).toBe(1);

    // Release twice: refCount reaches 0
    pool.release('box_1');
    expect(pool.getStats().activeRefs).toBe(0);
  });

  it('evicts unreferenced resources in LRU order when capacity is exceeded', () => {
    const pool = new GeometryCachePool(3);

    const disposed: string[] = [];

    const createTrackedMesh = (name: string) => {
      const geom = new THREE.BoxGeometry(1, 1, 1);
      const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      geom.addEventListener('dispose', () => disposed.push(`${name}_geom`));
      mat.addEventListener('dispose', () => disposed.push(`${name}_mat`));
      const mesh = new THREE.Mesh(geom, mat);
      mesh.name = name;
      return mesh;
    };

    // Fill pool to capacity (3 entries)
    pool.acquire('car_a', () => createTrackedMesh('car_a'));
    pool.acquire('car_b', () => createTrackedMesh('car_b'));
    pool.acquire('car_c', () => createTrackedMesh('car_c'));

    expect(pool.getStats().totalEntries).toBe(3);

    // Release car_a so its refCount is 0 (oldest unreferenced)
    pool.release('car_a');

    // Adding car_d should trigger LRU eviction of car_a
    pool.acquire('car_d', () => createTrackedMesh('car_d'));

    expect(pool.getStats().totalEntries).toBe(3);
    expect(disposed).toContain('car_a_geom');
    expect(disposed).toContain('car_a_mat');
    expect(pool.getStats().evictionCount).toBe(1);
  });

  it('protects actively referenced resources from being evicted', () => {
    const pool = new GeometryCachePool(2);

    const disposed: string[] = [];
    const createTracked = (name: string) => {
      const geom = new THREE.SphereGeometry(1);
      geom.addEventListener('dispose', () => disposed.push(name));
      return geom;
    };

    pool.acquire('active_1', () => createTracked('active_1'));
    pool.acquire('active_2', () => createTracked('active_2'));

    // Both have refCount = 1
    // Attempting to add a 3rd should not evict active resources
    pool.acquire('item_3', () => createTracked('item_3'));

    // active_1 and active_2 should not be disposed
    expect(disposed).not.toContain('active_1');
    expect(disposed).not.toContain('active_2');
  });

  it('recursively disposes Object3D trees and materials on clear', () => {
    const pool = new GeometryCachePool(5);

    let disposedGeom = false;
    let disposedMat = false;

    const group = new THREE.Group();
    const box = new THREE.BoxGeometry(2, 2, 2);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.5 });

    box.addEventListener('dispose', () => { disposedGeom = true; });
    mat.addEventListener('dispose', () => { disposedMat = true; });

    group.add(new THREE.Mesh(box, mat));

    pool.acquire('chassis_group', () => group);
    pool.clear();

    expect(disposedGeom).toBe(true);
    expect(disposedMat).toBe(true);
    expect(pool.getStats().totalEntries).toBe(0);
  });
});
