import * as THREE from 'three';
import { StationCrossSection, CrossSectionPoint } from './crossSectionGenerator';

export interface LoftedMeshResult {
  geometry: THREE.BufferGeometry;
  vertexCount: number;
  triangleCount: number;
}

/**
 * Lofts transverse cross-sections into watertight BufferGeometry.
 * Computes area-weighted vertex normals with intentional crease splits.
 */
export class SurfaceLofter {
  /**
   * Constructs full body surface geometry from station cross-sections
   */
  static loftStations(stations: StationCrossSection[]): LoftedMeshResult {
    if (stations.length < 2) {
      throw new Error("Cannot loft fewer than 2 stations");
    }

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    // We loft left half and right half independently to guarantee centerline symmetry and crisp crease normals
    const numStations = stations.length;

    // Build unified grid of vertices
    // To allow crease normal splitting, we generate indexed triangles per quad
    for (let s = 0; s < numStations - 1; s++) {
      const s0 = stations[s];
      const s1 = stations[s + 1];

      // Loft Left Side
      this.loftStationPair(s0.pointsLeft, s1.pointsLeft, positions, normals, uvs, indices, s, numStations, false);

      // Loft Right Side
      this.loftStationPair(s0.pointsRight, s1.pointsRight, positions, normals, uvs, indices, s, numStations, true);
    }

    // Front Cap (Nose cone closure)
    this.capStation(stations[numStations - 1], positions, normals, uvs, indices, true);

    // Rear Cap (Tail closure)
    this.capStation(stations[0], positions, normals, uvs, indices, false);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

    // Ensure unit normals
    geometry.computeVertexNormals();

    return {
      geometry,
      vertexCount: positions.length / 3,
      triangleCount: indices.length / 3
    };
  }

  private static loftStationPair(
    ptsA: CrossSectionPoint[],
    ptsB: CrossSectionPoint[],
    positions: number[],
    normals: number[],
    uvs: number[],
    indices: number[],
    stationIdx: number,
    totalStations: number,
    isRight: boolean
  ): void {
    const numPoints = Math.min(ptsA.length, ptsB.length);

    for (let p = 0; p < numPoints - 1; p++) {
      const p00 = ptsA[p].position;
      const p01 = ptsA[p + 1].position;
      const p10 = ptsB[p].position;
      const p11 = ptsB[p + 1].position;

      const baseIdx = positions.length / 3;

      // Add 4 vertices for this quad
      positions.push(p00.x, p00.y, p00.z);
      positions.push(p10.x, p10.y, p10.z);
      positions.push(p11.x, p11.y, p11.z);
      positions.push(p01.x, p01.y, p01.z);

      // UVs
      const u0 = stationIdx / (totalStations - 1);
      const u1 = (stationIdx + 1) / (totalStations - 1);
      const v0 = p / (numPoints - 1);
      const v1 = (p + 1) / (numPoints - 1);

      uvs.push(u0, v0);
      uvs.push(u1, v0);
      uvs.push(u1, v1);
      uvs.push(u0, v1);

      // Initial Normals (will be normalized via computeVertexNormals)
      const n0 = ptsA[p].normal;
      const n1 = ptsB[p].normal;
      normals.push(n0.x, n0.y, n0.z);
      normals.push(n1.x, n1.y, n1.z);
      normals.push(n1.x, n1.y, n1.z);
      normals.push(n0.x, n0.y, n0.z);

      // 2 triangles per quad with consistent CCW winding
      if (isRight) {
        indices.push(baseIdx, baseIdx + 2, baseIdx + 1);
        indices.push(baseIdx, baseIdx + 3, baseIdx + 2);
      } else {
        indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
        indices.push(baseIdx, baseIdx + 2, baseIdx + 3);
      }
    }
  }

  private static capStation(
    station: StationCrossSection,
    positions: number[],
    normals: number[],
    uvs: number[],
    indices: number[],
    isFront: boolean
  ): void {
    const centerPoint = isFront
      ? new THREE.Vector3(0, station.sample.yTop * 0.5, station.z)
      : new THREE.Vector3(0, station.sample.yBeltline * 0.7, station.z);

    const normal = isFront ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 0, -1);
    const centerIdx = positions.length / 3;

    positions.push(centerPoint.x, centerPoint.y, centerPoint.z);
    normals.push(normal.x, normal.y, normal.z);
    uvs.push(0.5, 0.5);

    // Fan cap around station contour (slice to eliminate duplicate center vertices at crown and underbody)
    const rightReversed = station.pointsRight.slice(1, -1).reverse();
    const allPts = [...station.pointsLeft, ...rightReversed];
    const startIdx = positions.length / 3;

    for (let i = 0; i < allPts.length; i++) {
      const pt = allPts[i].position;
      positions.push(pt.x, pt.y, pt.z);
      normals.push(normal.x, normal.y, normal.z);
      uvs.push(0.5 + (pt.x / 4), 0.5 + (pt.y / 4));
    }

    const count = allPts.length;
    for (let i = 0; i < count; i++) {
      const next = (i + 1) % count;
      if (isFront) {
        indices.push(centerIdx, startIdx + next, startIdx + i);
      } else {
        indices.push(centerIdx, startIdx + i, startIdx + next);
      }
    }
  }
}
