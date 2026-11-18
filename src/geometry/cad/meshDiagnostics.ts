import * as THREE from 'three';

export interface MeshDiagnosticIssue {
  type: 'HOLE_BOUNDARY_EDGE' | 'NON_MANIFOLD_EDGE' | 'DEGENERATE_TRIANGLE' | 'DUPLICATE_VERTEX' | 'FLIPPED_NORMAL';
  severity: 'WARNING' | 'ERROR';
  count: number;
  description: string;
  suggestedFix: string;
}

export interface MeshDiagnosticReport {
  isWatertight: boolean;
  is2Manifold: boolean;
  totalTriangles: number;
  totalVertices: number;
  boundaryEdgeCount: number;
  nonManifoldEdgeCount: number;
  degenerateTriangleCount: number;
  duplicateVertexCount: number;
  issues: MeshDiagnosticIssue[];
  surfaceAreaM2: number;
  volumeM3: number;
  cfdReady: boolean;
}

export class MeshDiagnostics {
  /**
   * Audits a Three.js BufferGeometry for topological validity
   */
  public static auditGeometry(geo: THREE.BufferGeometry): MeshDiagnosticReport {
    const pos = geo.getAttribute('position');
    const index = geo.getIndex();

    if (!pos) throw new Error('Geometry missing position attribute');

    const totalVertices = pos.count;
    const totalTriangles = index ? index.count / 3 : pos.count / 3;

    // Edge map: key "minIdx_maxIdx" -> count of incident triangles
    const edgeMap = new Map<string, number>();
    let degenerateCount = 0;
    let surfaceArea = 0;

    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();
    const cb = new THREE.Vector3();
    const ab = new THREE.Vector3();

    const getIdx = (t: number, i: number) => {
      return index ? index.getX(t * 3 + i) : t * 3 + i;
    };

    // Spatial coordinate quantization for topological adjacency (handles unwelded meshes with duplicate corner vertices)
    const posToSpatialId = new Map<string, number>();
    const vertexToSpatial = new Int32Array(pos.count);
    let nextSpatialId = 0;
    let duplicateVertices = 0;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i).toFixed(4);
      const y = pos.getY(i).toFixed(4);
      const z = pos.getZ(i).toFixed(4);
      const key = `${x}_${y}_${z}`;
      if (posToSpatialId.has(key)) {
        vertexToSpatial[i] = posToSpatialId.get(key)!;
        duplicateVertices++;
      } else {
        posToSpatialId.set(key, nextSpatialId);
        vertexToSpatial[i] = nextSpatialId;
        nextSpatialId++;
      }
    }

    const addEdge = (i1: number, i2: number) => {
      const s1 = vertexToSpatial[i1];
      const s2 = vertexToSpatial[i2];
      if (s1 === s2) return;
      const k = s1 < s2 ? `${s1}_${s2}` : `${s2}_${s1}`;
      edgeMap.set(k, (edgeMap.get(k) || 0) + 1);
    };

    for (let t = 0; t < totalTriangles; t++) {
      const i0 = getIdx(t, 0);
      const i1 = getIdx(t, 1);
      const i2 = getIdx(t, 2);

      // Check degenerate indices
      if (i0 === i1 || i1 === i2 || i0 === i2) {
        degenerateCount++;
        continue;
      }

      vA.fromBufferAttribute(pos, i0);
      vB.fromBufferAttribute(pos, i1);
      vC.fromBufferAttribute(pos, i2);

      cb.subVectors(vC, vB);
      ab.subVectors(vA, vB);
      const cross = new THREE.Vector3().crossVectors(cb, ab);
      const area = cross.length() * 0.5;

      if (area < 1e-12) {
        degenerateCount++;
      } else {
        surfaceArea += area;
      }

      addEdge(i0, i1);
      addEdge(i1, i2);
      addEdge(i2, i0);
    }

    let boundaryEdges = 0;
    let nonManifoldEdges = 0;

    for (const [_, count] of edgeMap.entries()) {
      if (count === 1) {
        boundaryEdges++;
      } else if (count > 2) {
        nonManifoldEdges++;
      }
    }

    const issues: MeshDiagnosticIssue[] = [];

    if (boundaryEdges > 0) {
      issues.push({
        type: 'HOLE_BOUNDARY_EDGE',
        severity: 'ERROR',
        count: boundaryEdges,
        description: `Mesh has ${boundaryEdges} open boundary edges (holes detected).`,
        suggestedFix: 'Perform boundary loop hole-filling or edge sewing before CFD meshing.'
      });
    }

    if (nonManifoldEdges > 0) {
      issues.push({
        type: 'NON_MANIFOLD_EDGE',
        severity: 'ERROR',
        count: nonManifoldEdges,
        description: `Mesh has ${nonManifoldEdges} non-manifold edges shared by > 2 triangles.`,
        suggestedFix: 'Separate intersecting T-junctions or delete internal dividing faces.'
      });
    }

    if (degenerateCount > 0) {
      issues.push({
        type: 'DEGENERATE_TRIANGLE',
        severity: 'WARNING',
        count: degenerateCount,
        description: `Mesh has ${degenerateCount} zero-area or collinear triangles.`,
        suggestedFix: 'Collapse zero-area faces and weld collinear vertices.'
      });
    }

    const isWatertight = boundaryEdges === 0;
    const is2Manifold = nonManifoldEdges === 0;
    const cfdReady = isWatertight && is2Manifold && degenerateCount === 0;

    return {
      isWatertight,
      is2Manifold,
      totalTriangles,
      totalVertices,
      boundaryEdgeCount: boundaryEdges,
      nonManifoldEdgeCount: nonManifoldEdges,
      degenerateTriangleCount: degenerateCount,
      duplicateVertexCount: duplicateVertices,
      issues,
      surfaceAreaM2: Number(surfaceArea.toFixed(4)),
      volumeM3: 0,
      cfdReady
    };
  }

  /**
   * Automated mesh healing tool: removes degenerate triangles and welds duplicate vertices
   */
  public static healGeometry(geo: THREE.BufferGeometry): {
    healedGeo: THREE.BufferGeometry;
    trianglesRemoved: number;
    verticesWelded: number;
  } {
    const pos = geo.getAttribute('position');
    const index = geo.getIndex();
    if (!pos) throw new Error('Invalid geometry');

    const uniqueMap = new Map<string, number>();
    const newPositions: number[] = [];
    const oldToNew = new Map<number, number>();

    let weldedCount = 0;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const key = `${x.toFixed(5)}_${y.toFixed(5)}_${z.toFixed(5)}`;

      if (uniqueMap.has(key)) {
        oldToNew.set(i, uniqueMap.get(key)!);
        weldedCount++;
      } else {
        const newIdx = newPositions.length / 3;
        uniqueMap.set(key, newIdx);
        oldToNew.set(i, newIdx);
        newPositions.push(x, y, z);
      }
    }

    const newIndices: number[] = [];
    let removedTriangles = 0;
    const totalTris = index ? index.count / 3 : pos.count / 3;

    for (let t = 0; t < totalTris; t++) {
      const i0 = oldToNew.get(index ? index.getX(t * 3) : t * 3)!;
      const i1 = oldToNew.get(index ? index.getX(t * 3 + 1) : t * 3 + 1)!;
      const i2 = oldToNew.get(index ? index.getX(t * 3 + 2) : t * 3 + 2)!;

      // Drop degenerates
      if (i0 === i1 || i1 === i2 || i0 === i2) {
        removedTriangles++;
      } else {
        newIndices.push(i0, i1, i2);
      }
    }

    const healed = new THREE.BufferGeometry();
    healed.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
    healed.setIndex(newIndices);
    healed.computeVertexNormals();

    return {
      healedGeo: healed,
      trianglesRemoved: removedTriangles,
      verticesWelded: weldedCount
    };
  }
}
