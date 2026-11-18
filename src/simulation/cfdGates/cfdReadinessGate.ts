import * as THREE from 'three';

export interface CfdGateCheck {
  name: string;
  passed: boolean;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  value: number | string;
  threshold: number | string;
  violatingElements?: number;
}

export interface CfdReadinessResult {
  isReadyForCfd: boolean;
  overallStatus: 'PASSED' | 'WARNING' | 'REJECTED';
  checks: CfdGateCheck[];
  recommendedRefinementLevel: number;
  estimatedSurfaceCellCount: number;
}

export class CfdReadinessGate {
  /**
   * Audit Three.js BufferGeometry against OpenFOAM snappyHexMesh surface meshing standards
   */
  public static evaluateGeometry(
    geometry: THREE.BufferGeometry,
    options: {
      minFeatureSizeM?: number; // e.g. 0.002m (2mm)
      maxSliverAspectRatio?: number; // e.g. 40
      minGroundClearanceM?: number; // e.g. 0.020m (20mm)
    } = {}
  ): CfdReadinessResult {
    const minFeatureSize = options.minFeatureSizeM ?? 0.002;
    const maxAspectRatio = options.maxSliverAspectRatio ?? 40;
    const minGroundClearance = options.minGroundClearanceM ?? 0.020;

    const checks: CfdGateCheck[] = [];
    const positions = geometry.getAttribute('position');
    const index = geometry.getIndex();

    if (!positions || positions.count === 0) {
      return {
        isReadyForCfd: false,
        overallStatus: 'REJECTED',
        checks: [
          {
            name: 'Geometry Existence',
            passed: false,
            severity: 'CRITICAL',
            message: 'BufferGeometry contains zero vertices.',
            value: 0,
            threshold: '> 0'
          }
        ],
        recommendedRefinementLevel: 0,
        estimatedSurfaceCellCount: 0
      };
    }

    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;

    // 1. Ground clearance check (SAE Z axis: Z=0 is ground)
    const lowestZ = box.min.z;
    const groundCollision = lowestZ < 0;
    const groundClearancePass = lowestZ >= minGroundClearance;

    checks.push({
      name: 'Ground Plane Penetration',
      passed: !groundCollision,
      severity: groundCollision ? 'CRITICAL' : 'INFO',
      message: groundCollision
        ? `Geometry penetrates ground plane by ${Math.abs(Math.round(lowestZ * 1000))} mm (Z = ${lowestZ.toFixed(3)}m). Mesh snapping will fail.`
        : `Ground clearance is safe (${Math.round(lowestZ * 1000)} mm).`,
      value: lowestZ,
      threshold: `>= 0.000m`
    });

    if (!groundClearancePass && !groundCollision) {
      checks.push({
        name: 'Minimum Ground Clearance',
        passed: false,
        severity: 'WARNING',
        message: `Ground clearance is below recommended threshold (${Math.round(lowestZ * 1000)} mm vs ${Math.round(minGroundClearance * 1000)} mm). High risk of boundary layer cell pinching.`,
        value: lowestZ,
        threshold: `>= ${minGroundClearance.toFixed(3)}m`
      });
    }

    // 2. Micro-feature & sliver triangle analysis
    let microTriangleCount = 0;
    let sliverTriangleCount = 0;
    let degenerateTriangleCount = 0;
    let totalTriangles = 0;

    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();

    const triangleCount = index ? index.count / 3 : positions.count / 3;
    totalTriangles = triangleCount;

    for (let i = 0; i < triangleCount; i++) {
      const idxA = index ? index.getX(i * 3) : i * 3;
      const idxB = index ? index.getX(i * 3 + 1) : i * 3 + 1;
      const idxC = index ? index.getX(i * 3 + 2) : i * 3 + 2;

      vA.fromBufferAttribute(positions, idxA);
      vB.fromBufferAttribute(positions, idxB);
      vC.fromBufferAttribute(positions, idxC);

      const dAB = vA.distanceTo(vB);
      const dBC = vB.distanceTo(vC);
      const dCA = vC.distanceTo(vA);

      const maxEdge = Math.max(dAB, dBC, dCA);
      const minEdge = Math.min(dAB, dBC, dCA);

      // Area using Heron's formula
      const s = (dAB + dBC + dCA) / 2;
      const areaSq = s * (s - dAB) * (s - dBC) * (s - dCA);

      if (areaSq <= 1e-12 || maxEdge <= 1e-6) {
        degenerateTriangleCount++;
      } else {
        if (maxEdge < minFeatureSize) {
          microTriangleCount++;
        }
        const aspectRatio = minEdge > 1e-6 ? maxEdge / minEdge : 999;
        if (aspectRatio > maxAspectRatio) {
          sliverTriangleCount++;
        }
      }
    }

    // Check Degenerate Triangles
    checks.push({
      name: 'Degenerate Triangles',
      passed: degenerateTriangleCount === 0,
      severity: degenerateTriangleCount > 0 ? 'CRITICAL' : 'INFO',
      message: degenerateTriangleCount > 0
        ? `Found ${degenerateTriangleCount} zero-area degenerate triangles. Will cause OpenFOAM surfaceCheck face errors.`
        : 'Zero degenerate triangles detected.',
      value: degenerateTriangleCount,
      threshold: 0,
      violatingElements: degenerateTriangleCount
    });

    // Check Micro Triangles (< minFeatureSize)
    const microThreshold = Math.ceil(totalTriangles * 0.05); // Warn if > 5% are micro
    checks.push({
      name: 'Micro-Feature Size',
      passed: microTriangleCount <= microThreshold,
      severity: microTriangleCount > microThreshold ? 'WARNING' : 'INFO',
      message: microTriangleCount > 0
        ? `${microTriangleCount} triangles smaller than ${Math.round(minFeatureSize * 1000)} mm. Refinement level 6+ recommended to avoid surface wrapping collapse.`
        : 'All triangles exceed minimum feature size.',
      value: microTriangleCount,
      threshold: `<= ${microThreshold}`,
      violatingElements: microTriangleCount
    });

    // Check Slivers (Aspect Ratio > maxAspectRatio)
    const sliverThreshold = Math.ceil(totalTriangles * 0.03); // Warn if > 3% are slivers
    checks.push({
      name: 'Sliver Aspect Ratio',
      passed: sliverTriangleCount <= sliverThreshold,
      severity: sliverTriangleCount > sliverThreshold ? 'WARNING' : 'INFO',
      message: sliverTriangleCount > 0
        ? `${sliverTriangleCount} triangles have aspect ratio > ${maxAspectRatio}. May cause non-orthogonality during snappyHexMesh snapping.`
        : 'Aspect ratios within acceptable CFD meshing bounds.',
      value: sliverTriangleCount,
      threshold: `<= ${sliverThreshold}`,
      violatingElements: sliverTriangleCount
    });

    // Overall readiness verdict
    const hasCritical = checks.some(c => c.severity === 'CRITICAL' && !c.passed);
    const hasWarning = checks.some(c => c.severity === 'WARNING' && !c.passed);

    let overallStatus: CfdReadinessResult['overallStatus'] = 'PASSED';
    if (hasCritical) overallStatus = 'REJECTED';
    else if (hasWarning) overallStatus = 'WARNING';

    const isReadyForCfd = !hasCritical;

    // Refinement recommendations based on micro features
    let recommendedRefinementLevel = 4;
    if (microTriangleCount > 0) recommendedRefinementLevel = 6;
    if (microTriangleCount > totalTriangles * 0.1) recommendedRefinementLevel = 7;

    const estimatedSurfaceCellCount = Math.round(totalTriangles * Math.pow(2, Math.max(0, recommendedRefinementLevel - 4)));

    return {
      isReadyForCfd,
      overallStatus,
      checks,
      recommendedRefinementLevel,
      estimatedSurfaceCellCount
    };
  }
}
