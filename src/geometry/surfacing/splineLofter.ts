import * as THREE from 'three';
import { StationCrossSection } from '../types';

export interface LoftOptions {
  radialSegments?: number;
  longitudinalSteps?: number;
  creaseAngleDeg?: number;
  wireframe?: boolean;
}

export class SplineLofter {
  /**
   * Lofts continuous smooth-shaded vehicle body geometry from station cross-sections
   * with bilateral symmetry and centerline seam welding.
   */
  public static buildLoftedShell(
    stations: StationCrossSection[],
    options: LoftOptions = {}
  ): THREE.BufferGeometry {
    const radialSegs = options.radialSegments || 16;
    const sortedStations = [...stations].sort((a, b) => b.station_z_m - a.station_z_m); // Front (+Z) to Rear (-Z)

    if (sortedStations.length < 2) {
      throw new Error('At least 2 station cross-sections are required for lofting');
    }

    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    const numStations = sortedStations.length;
    const pointsPerStation = (radialSegs * 2); // Full cross-section ring (left + right)

    // Generate vertex rings for each station
    for (let sIdx = 0; sIdx < numStations; sIdx++) {
      const st = sortedStations[sIdx];
      const z = st.station_z_m;
      const w = Math.max(st.width_half_m, 0.05);
      const floorY = st.floor_y_m;
      const rockerY = st.rocker_y_m;
      const beltY = st.belt_y_m;
      const roofY = st.roof_y_m;
      const flare = st.shoulder_flare_m || 0;
      const tumblehome = st.tumblehome_m || 0;

      // Profile curve from bottom centerline (x=0) up through rocker, belt, roof
      // Right half (x >= 0)
      const rightHalf: [number, number][] = [];
      
      // Bottom centerline
      rightHalf.push([0, floorY]);

      // Rocker
      const rockerT = 0.3;
      rightHalf.push([w * 0.85, floorY + (rockerY - floorY) * rockerT]);
      rightHalf.push([w, rockerY]);

      // Shoulder / Belt
      rightHalf.push([w + flare, beltY]);

      // Tumblehome up to Roof
      rightHalf.push([(w + flare) * (1 - tumblehome * 0.4), beltY + (roofY - beltY) * 0.55]);
      rightHalf.push([(w * 0.45) * (1 - tumblehome), roofY * 0.98]);

      // Roof centerline
      rightHalf.push([0, roofY]);

      // Sample along right profile
      const sampledRight = this.resampleSpline(rightHalf, radialSegs);

      // Build full ring: Right half from bottom to top, then Left half from top to bottom
      const fullRing: [number, number][] = [];

      // Right half (0 to radialSegs - 1)
      for (let i = 0; i < sampledRight.length - 1; i++) {
        fullRing.push(sampledRight[i]);
      }

      // Roof Centerline (Top apex)
      fullRing.push([0, roofY]);

      // Left half (mirrored -x)
      for (let i = sampledRight.length - 2; i > 0; i--) {
        fullRing.push([-sampledRight[i][0], sampledRight[i][1]]);
      }

      // Add vertices to buffer
      for (let pIdx = 0; pIdx < fullRing.length; pIdx++) {
        const [x, y] = fullRing[pIdx];
        
        // Exact centerline seam welding: clamp points near X=0 to exactly 0.0
        const weldedX = Math.abs(x) < 0.002 ? 0.0 : x;

        vertices.push(weldedX, y, z);
        uvs.push(pIdx / fullRing.length, sIdx / (numStations - 1));
      }
    }

    // Connect stations into quad quads (triangulated)
    const ringSize = vertices.length / (3 * numStations);

    for (let sIdx = 0; sIdx < numStations - 1; sIdx++) {
      const ringA = sIdx * ringSize;
      const ringB = (sIdx + 1) * ringSize;

      for (let p = 0; p < ringSize; p++) {
        const nextP = (p + 1) % ringSize;

        const a1 = ringA + p;
        const a2 = ringA + nextP;
        const b1 = ringB + p;
        const b2 = ringB + nextP;

        // Two triangles per quad
        indices.push(a1, b1, a2);
        indices.push(a2, b1, b2);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

    // Compute continuous vertex normals
    geometry.computeVertexNormals();

    return geometry;
  }

  /**
   * Resamples 2D control points along a smooth Catmull-Rom spline
   */
  private static resampleSpline(points: [number, number][], targetCount: number): [number, number][] {
    if (points.length < 2) return points;

    const curvePoints = points.map(p => new THREE.Vector2(p[0], p[1]));
    const curve = new THREE.SplineCurve(curvePoints);
    const divisions = Math.max(targetCount, 2);
    const samples = curve.getPoints(divisions);

    return samples.map(pt => [pt.x, pt.y]);
  }
}
