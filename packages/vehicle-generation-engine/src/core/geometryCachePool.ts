import * as THREE from 'three';

export interface CacheEntry<T> {
  key: string;
  resource: T;
  refCount: number;
  lastUsed: number;
  metadata?: Record<string, any>;
}

export interface GeometryCacheStats {
  totalEntries: number;
  activeRefs: number;
  hitCount: number;
  missCount: number;
  evictionCount: number;
  disposalCount: number;
}

/**
 * GeometryCachePool
 * Production-grade WebGL resource cache pool with LRU eviction and reference counting.
 * Prevents GPU memory leaks during repeated vehicle switching and geometry generation.
 */
export class GeometryCachePool {
  private cache = new Map<string, CacheEntry<any>>();
  private maxEntries: number;
  private hitCount = 0;
  private missCount = 0;
  private evictionCount = 0;
  private disposalCount = 0;

  constructor(maxEntries: number = 10) {
    this.maxEntries = maxEntries;
  }

  public setMaxEntries(max: number): void {
    this.maxEntries = max;
    this.prune();
  }

  public getMaxEntries(): number {
    return this.maxEntries;
  }

  /**
   * Acquire a resource from cache, or instantiate via factory.
   * Increments reference count.
   */
  public acquire<T extends THREE.Object3D | THREE.BufferGeometry | THREE.Material>(
    key: string,
    factory: () => T,
    metadata?: Record<string, any>
  ): T {
    const existing = this.cache.get(key);
    if (existing) {
      existing.refCount++;
      existing.lastUsed = Date.now();
      if (metadata) {
        existing.metadata = { ...existing.metadata, ...metadata };
      }
      this.hitCount++;
      return existing.resource as T;
    }

    this.missCount++;

    // Prune LRU unreferenced entries if at capacity
    if (this.cache.size >= this.maxEntries) {
      this.evictLru();
    }

    const resource = factory();

    this.cache.set(key, {
      key,
      resource,
      refCount: 1,
      lastUsed: Date.now(),
      metadata
    });

    return resource;
  }

  /**
   * Release a previously acquired resource reference.
   * Decrements refCount (floor at 0).
   */
  public release(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      entry.refCount = Math.max(0, entry.refCount - 1);
      entry.lastUsed = Date.now();
    }
  }

  /**
   * Evicts the least recently used entry that has 0 active references.
   * Returns true if an entry was evicted, false if no unreferenced entries exist.
   */
  public evictLru(): boolean {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.refCount === 0 && entry.lastUsed < oldestTime) {
        oldestTime = entry.lastUsed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      const entry = this.cache.get(oldestKey)!;
      this.cache.delete(oldestKey);
      this.disposeResource(entry.resource);
      this.evictionCount++;
      return true;
    }

    return false;
  }

  /**
   * Prunes entries down to maxEntries if possible.
   */
  public prune(): number {
    let pruned = 0;
    while (this.cache.size > this.maxEntries) {
      if (!this.evictLru()) break;
      pruned++;
    }
    return pruned;
  }

  /**
   * Safely disposes Three.js Object3D hierarchies, BufferGeometries, Materials, and Textures.
   */
  public disposeResource(resource: any): void {
    if (!resource) return;
    this.disposalCount++;

    if (resource.isBufferGeometry) {
      (resource as THREE.BufferGeometry).dispose();
      return;
    }

    if (resource.isMaterial) {
      this.disposeMaterial(resource as THREE.Material);
      return;
    }

    if (resource.isTexture) {
      (resource as THREE.Texture).dispose();
      return;
    }

    if (resource.traverse && typeof resource.traverse === 'function') {
      resource.traverse((child: any) => {
        if (child.isMesh) {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m: THREE.Material) => this.disposeMaterial(m));
            } else {
              this.disposeMaterial(child.material);
            }
          }
        }
      });
      if (resource.clear && typeof resource.clear === 'function') {
        resource.clear();
      }
    }
  }

  private disposeMaterial(material: THREE.Material): void {
    const matAny = material as any;
    const textures = [
      matAny.map,
      matAny.normalMap,
      matAny.roughnessMap,
      matAny.metalnessMap,
      matAny.envMap,
      matAny.aoMap,
      matAny.alphaMap,
      matAny.emissiveMap,
      matAny.bumpMap,
      matAny.displacementMap,
      matAny.clearcoatMap,
      matAny.clearcoatRoughnessMap,
      matAny.clearcoatNormalMap
    ];

    for (const tex of textures) {
      if (tex && tex.isTexture) {
        tex.dispose();
      }
    }

    material.dispose();
  }

  /**
   * Clear all entries, immediately disposing all resources.
   */
  public clear(): void {
    for (const entry of this.cache.values()) {
      this.disposeResource(entry.resource);
    }
    this.cache.clear();
  }

  public getStats(): GeometryCacheStats {
    let activeRefs = 0;
    for (const entry of this.cache.values()) {
      activeRefs += entry.refCount;
    }
    return {
      totalEntries: this.cache.size,
      activeRefs,
      hitCount: this.hitCount,
      missCount: this.missCount,
      evictionCount: this.evictionCount,
      disposalCount: this.disposalCount
    };
  }
}

export const geometryCachePool = new GeometryCachePool(10);
