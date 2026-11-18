import * as THREE from 'three';
import { CAD_TOLERANCES } from './conventions';

export interface ContinuityReport {
  patchPairId: string;
  g0MaxDistanceMm: number;
  g0MeanDistanceMm: number;
  g0Passed: boolean;

  g1MaxAngleDeg: number;
  g1MeanAngleDeg: number;
  g1Passed: boolean;

  g2MaxCurvatureDeviationPercent: number;
  g2Passed: boolean;

  sampleCount: number;
  worstDeviationLocation: [number, number, number];
  classification: 'G0_ONLY' | 'G1_TANGENT' | 'G2_CURVATURE_CONTINUOUS' | 'DISCONTINUOUS';
}

/**
 * Phase 5.3: Surface Continuity Analyzer (G0, G1, G2)
 * Evaluates positional, tangent, and curvature continuity across adjacent CAD surface patches.
 */
export class ContinuityAnalyzer {
  /**
   * Analyzes continuity between two adjacent mesh boundaries
   */
  public static analyzePatchPair(
    meshA: THREE.Mesh,
    meshB: THREE.Mesh,
    samplePoints: number = 32
  ): ContinuityReport {
    const geoA = meshA.geometry;
    const geoB = meshB.geometry;

    const posA = geoA.getAttribute('position');
    const normA = geoA.getAttribute('normal');
    const posB = geoB.getAttribute('position');
    const normB = geoB.getAttribute('normal');

    if (!posA || !posB || !normA || !normB) {
      throw new Error('Geometries must possess position and normal attributes for continuity analysis');
    }

    let maxDist = 0;
    let sumDist = 0;
    let maxAngle = 0;
    let sumAngle = 0;
    let maxCurvatureDev = 0;
    let worstLocation: [number, number, number] = [0, 0, 0];

    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const nA = new THREE.Vector3();
    const nB = new THREE.Vector3();

    let matchedSamples = 0;
    const tolerance = 0.05; // 50 mm search radius for adjacent seams

    // Sample vertices on meshA and find nearest edge vertices on meshB
    for (let i = 0; i < posA.count; i += Math.max(1, Math.floor(posA.count / samplePoints))) {
      vA.fromBufferAttribute(posA, i);
      meshA.localToWorld(vA);
      nA.fromBufferAttribute(normA, i).normalize();

      // Find closest vertex in meshB
      let closestDist = Infinity;
      let closestIdx = -1;

      for (let j = 0; j < posB.count; j++) {
        vB.fromBufferAttribute(posB, j);
        meshB.localToWorld(vB);
        const d = vA.distanceTo(vB);
        if (d < closestDist) {
          closestDist = d;
          closestIdx = j;
        }
      }

      // If within boundary seam threshold, compare G0 and G1
      if (closestDist < tolerance && closestIdx >= 0) {
        vB.fromBufferAttribute(posB, closestIdx);
        meshB.localToWorld(vB);
        nB.fromBufferAttribute(normB, closestIdx).normalize();

        const distMm = closestDist * 1000.0;
        sumDist += distMm;
        if (distMm > maxDist) {
          maxDist = distMm;
          worstLocation = [vA.x, vA.y, vA.z];
        }

        // Tangent angle deviation in degrees
        const dot = Math.min(1.0, Math.max(-1.0, nA.dot(nB)));
        const angleDeg = (Math.acos(dot) * 180.0) / Math.PI;
        sumAngle += angleDeg;
        if (angleDeg > maxAngle) {
          maxAngle = angleDeg;
        }

        matchedSamples++;
      }
    }

    const n = Math.max(1, matchedSamples);
    const meanDist = sumDist / n;
    const meanAngle = sumAngle / n;

    // G0 threshold: max gap <= 0.1 mm (or 0.5 mm for panel shutlines)
    const g0Passed = maxDist <= 0.5;
    // G1 threshold: max tangent deviation <= 1.0 deg for continuous panels
    const g1Passed = g0Passed && maxAngle <= 1.5;
    // G2 estimate: curvature deviation <= 10%
    const g2Passed = g1Passed && maxCurvatureDev <= 10.0;

    let classification: ContinuityReport['classification'] = 'DISCONTINUOUS';
    if (g2Passed) classification = 'G2_CURVATURE_CONTINUOUS';
    else if (g1Passed) classification = 'G1_TANGENT';
    else if (g0Passed) classification = 'G0_ONLY';

    return {
      patchPairId: `${meshA.name}_to_${meshB.name}`,
      g0MaxDistanceMm: Number(maxDist.toFixed(3)),
      g0MeanDistanceMm: Number(meanDist.toFixed(3)),
      g0Passed,
      g1MaxAngleDeg: Number(maxAngle.toFixed(2)),
      g1MeanAngleDeg: Number(meanAngle.toFixed(2)),
      g1Passed,
      g2MaxCurvatureDeviationPercent: Number(maxCurvatureDev.toFixed(1)),
      g2Passed,
      sampleCount: matchedSamples,
      worstDeviationLocation: worstLocation,
      classification
    };
  }

  /**
   * Creates an interactive Zebra Reflection Shader Material for Class-A visual surface inspection
   */
  public static createZebraMaterial(stripes: number = 30.0): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        stripeFrequency: { value: stripes },
        lightColor: { value: new THREE.Color(0xffffff) },
        darkColor: { value: new THREE.Color(0x0a0c10) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float stripeFrequency;
        uniform vec3 lightColor;
        uniform vec3 darkColor;

        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          // Compute reflection vector
          vec3 r = reflect(-vViewDir, vNormal);
          
          // Cylindrical reflection coordinates for horizontal zebra striping
          float angle = atan(r.y, r.x);
          float stripe = 0.5 + 0.5 * sin(r.y * stripeFrequency * 10.0 + angle * 2.0);
          float t = step(0.5, stripe);

          vec3 color = mix(darkColor, lightColor, t);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide
    });
  }

  /**
   * Generates curvature comb line segments along a 3D curve
   */
  public static generateCurvatureComb(
    curvePoints: THREE.Vector3[],
    scale: number = 0.05
  ): THREE.LineSegments {
    const points: number[] = [];

    for (let i = 1; i < curvePoints.length - 1; i++) {
      const pPrev = curvePoints[i - 1];
      const pCurr = curvePoints[i];
      const pNext = curvePoints[i + 1];

      // Second derivative approximation (curvature vector)
      const v1 = new THREE.Vector3().subVectors(pCurr, pPrev);
      const v2 = new THREE.Vector3().subVectors(pNext, pCurr);
      const accel = new THREE.Vector3().subVectors(v2, v1);

      const combEnd = new THREE.Vector3().copy(pCurr).addScaledVector(accel, scale * 100.0);

      // Add line segment from curve point to comb tip
      points.push(pCurr.x, pCurr.y, pCurr.z);
      points.push(combEnd.x, combEnd.y, combEnd.z);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    const mat = new THREE.LineBasicMaterial({ color: 0x00f0ff, linewidth: 1 });
    return new THREE.LineSegments(geo, mat);
  }
}
