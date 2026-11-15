import * as THREE from 'three';
import { TopologyAnalysisResult, GeometryUnitSystem } from '../types';

/**
 * Phase 3: Mesh Topology Analysis & Geometry Validation Engine
 * Validates non-manifold geometry, surface normals, vertices, faces,
 * duplicate geometry, bounding box, and metric scale.
 */
export class MeshTopologyAnalyzer {
  /**
   * Performs full topological and geometric inspection of a 3D object hierarchy
   */
  static analyze(root: THREE.Object3D): TopologyAnalysisResult {
    let vertexCount = 0;
    let triangleCount = 0;
    let meshCount = 0;
    let nonManifoldEdgeCount = 0;
    let degenerateTriangleCount = 0;
    let hasNanOrInfinity = false;
    let nonUnitNormalCount = 0;
    let duplicateVertexCount = 0;

    // Edge hash map for manifold analysis: edgeKey -> count of incident faces
    const edgeFaceMap = new Map<string, number>();

    // Vertex spatial hash for duplicate vertex detection
    const vertexMap = new Map<string, number>();

    root.traverse(child => {
      if ((child as any).isMesh) {
        meshCount++;
        const mesh = child as THREE.Mesh;
        const geom = mesh.geometry;
        if (!geom) return;

        const posAttr = geom.getAttribute('position');
        const normAttr = geom.getAttribute('normal');
        const indexAttr = geom.getIndex();

        if (posAttr) {
          vertexCount += posAttr.count;

          // 1. Check for NaN / Infinity and duplicate vertices
          for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            const z = posAttr.getZ(i);

            if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
              hasNanOrInfinity = true;
            }

            // Spatial hash rounded to 0.1mm (1e-4m)
            const key = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
            if (vertexMap.has(key)) {
              duplicateVertexCount++;
            } else {
              vertexMap.set(key, i);
            }
          }
        }

        // 2. Normal unit length check
        if (normAttr) {
          for (let i = 0; i < normAttr.count; i++) {
            const nx = normAttr.getX(i);
            const ny = normAttr.getY(i);
            const nz = normAttr.getZ(i);
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
            if (Math.abs(len - 1.0) > 0.05) {
              nonUnitNormalCount++;
            }
          }
        }

        // 3. Triangle Face & Edge Topology Analysis
        if (indexAttr && posAttr) {
          const count = indexAttr.count;
          triangleCount += count / 3;

          for (let i = 0; i < count; i += 3) {
            const a = indexAttr.getX(i);
            const b = indexAttr.getX(i + 1);
            const c = indexAttr.getX(i + 2);

            if (a < posAttr.count && b < posAttr.count && c < posAttr.count) {
              const vA = new THREE.Vector3(posAttr.getX(a), posAttr.getY(a), posAttr.getZ(a));
              const vB = new THREE.Vector3(posAttr.getX(b), posAttr.getY(b), posAttr.getZ(b));
              const vC = new THREE.Vector3(posAttr.getX(c), posAttr.getY(c), posAttr.getZ(c));

              // Zero-area triangle test
              const edge1 = new THREE.Vector3().subVectors(vB, vA);
              const edge2 = new THREE.Vector3().subVectors(vC, vA);
              const cross = new THREE.Vector3().crossVectors(edge1, edge2);
              const area = cross.length() * 0.5;

              if (area < 1e-7) {
                degenerateTriangleCount++;
              }

              // Edge manifold hash (minIdx-maxIdx)
              this.recordEdge(edgeFaceMap, a, b);
              this.recordEdge(edgeFaceMap, b, c);
              this.recordEdge(edgeFaceMap, c, a);
            }
          }
        } else if (posAttr) {
          triangleCount += posAttr.count / 3;
        }
      }
    });

    // Check for non-manifold edges (> 2 faces sharing a single edge)
    for (const count of edgeFaceMap.values()) {
      if (count > 2) {
        nonManifoldEdgeCount++;
      }
    }

    // 4. Bounding Box & Scale Detection
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);

    const { detectedUnit, scaleFactorToMeters } = this.detectUnitScale(size);

    return {
      vertexCount,
      triangleCount,
      meshCount,
      hasNonManifoldEdges: nonManifoldEdgeCount > 0,
      nonManifoldEdgeCount,
      degenerateTriangleCount,
      hasNanOrInfinity,
      hasUnitNormals: nonUnitNormalCount === 0,
      nonUnitNormalCount,
      duplicateVertexCount,
      detectedUnit,
      scaleFactorToMeters,
      boundingBox: {
        min: [box.min.x, box.min.y, box.min.z],
        max: [box.max.x, box.max.y, box.max.z],
        dimensions: [size.x, size.y, size.z]
      }
    };
  }

  private static recordEdge(map: Map<string, number>, idx1: number, idx2: number): void {
    const min = Math.min(idx1, idx2);
    const max = Math.max(idx1, idx2);
    const key = `${min}_${max}`;
    map.set(key, (map.get(key) || 0) + 1);
  }

  /**
   * Determines model unit system based on standard automotive dimensions (approx 3.5m to 6.5m length)
   */
  static detectUnitScale(size: THREE.Vector3): { detectedUnit: GeometryUnitSystem; scaleFactorToMeters: number } {
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim > 2000 && maxDim < 8000) {
      // Millimeters (e.g. 4500mm = 4.5m)
      return { detectedUnit: 'mm', scaleFactorToMeters: 0.001 };
    } else if (maxDim > 200 && maxDim < 800) {
      // Centimeters (e.g. 450cm = 4.5m)
      return { detectedUnit: 'cm', scaleFactorToMeters: 0.01 };
    } else if (maxDim > 100 && maxDim < 350) {
      // Inches (e.g. 177 inches = 4.5m)
      return { detectedUnit: 'in', scaleFactorToMeters: 0.0254 };
    } else if (maxDim > 8 && maxDim < 30) {
      // Feet (e.g. 15 feet = 4.57m)
      return { detectedUnit: 'ft', scaleFactorToMeters: 0.3048 };
    }

    // Default: Metres
    return { detectedUnit: 'm', scaleFactorToMeters: 1.0 };
  }

  /**
   * Recomputes area-weighted vertex normals and fixes un-normalized vectors
   */
  static normalizeNormals(root: THREE.Object3D): void {
    root.traverse(child => {
      if ((child as any).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.computeVertexNormals();
        }
      }
    });
  }

  /**
   * Rescales an object hierarchy to standard metric units (meters)
   */
  static scaleToMeters(root: THREE.Object3D, scaleFactor: number): void {
    if (Math.abs(scaleFactor - 1.0) > 1e-5) {
      root.scale.multiplyScalar(scaleFactor);
      root.updateMatrixWorld(true);
    }
  }
}

