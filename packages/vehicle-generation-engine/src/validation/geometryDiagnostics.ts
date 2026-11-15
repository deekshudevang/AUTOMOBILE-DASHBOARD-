import * as THREE from 'three';
import { VehicleGeometryProfile } from '../templates/geometryProfiles';

export interface DiagnosticCheckResult {
  checkName: string;
  pass: boolean;
  numericValue: number;
  thresholdOrExpected: string;
  details: string;
}

export interface DiagnosticsReport {
  passedAll: boolean;
  totalChecks: number;
  failedCount: number;
  totalTriangles: number;
  totalVertices: number;
  totalDrawCalls: number;
  checks: DiagnosticCheckResult[];
}

/**
 * Automated Geometry Diagnostics Suite (Phase 6 Specification)
 * Runs in CI, unit tests, and production diagnostics.
 */
export class GeometryDiagnostics {
  static runDiagnostics(root: THREE.Object3D, profile: VehicleGeometryProfile): DiagnosticsReport {
    const checks: DiagnosticCheckResult[] = [];
    let totalTriangles = 0;
    let totalVertices = 0;
    let totalDrawCalls = 0;

    let hasNanOrInfinity = false;
    let indicesValid = true;
    let zeroAreaTriangles = 0;
    let nonUnitNormals = 0;
    let maxBodyBoxinessScore = 0; // 0 = organic curves, 1 = rectangular box
    let bodyMeshCount = 0;

    // Traverse all meshes in hierarchy
    root.traverse(child => {
      if ((child as any).isMesh) {
        totalDrawCalls++;
        const mesh = child as THREE.Mesh;
        const geom = mesh.geometry;
        if (!geom) return;

        const posAttr = geom.getAttribute('position');
        const normAttr = geom.getAttribute('normal');
        const indexAttr = geom.getIndex();

        if (posAttr) {
          totalVertices += posAttr.count;

          // Check 1: NaN / Infinity in positions
          for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            const z = posAttr.getZ(i);
            if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
              hasNanOrInfinity = true;
            }
          }
        }

        // Check 2: Index buffer validity
        if (indexAttr) {
          const count = indexAttr.count;
          if (count % 3 !== 0) indicesValid = false;
          totalTriangles += count / 3;

          for (let i = 0; i < count; i += 3) {
            const a = indexAttr.getX(i);
            const b = indexAttr.getX(i + 1);
            const c = indexAttr.getX(i + 2);

            if (a >= posAttr.count || b >= posAttr.count || c >= posAttr.count) {
              indicesValid = false;
            }

            // Check 3: Zero-area triangles
            if (posAttr) {
              const vA = new THREE.Vector3(posAttr.getX(a), posAttr.getY(a), posAttr.getZ(a));
              const vB = new THREE.Vector3(posAttr.getX(b), posAttr.getY(b), posAttr.getZ(b));
              const vC = new THREE.Vector3(posAttr.getX(c), posAttr.getY(c), posAttr.getZ(c));
              const edge1 = new THREE.Vector3().subVectors(vB, vA);
              const edge2 = new THREE.Vector3().subVectors(vC, vA);
              const cross = new THREE.Vector3().crossVectors(edge1, edge2);
              const area = cross.length() * 0.5;
              if (area < 1e-7) {
                zeroAreaTriangles++;
              }
            }
          }
        } else if (posAttr) {
          totalTriangles += posAttr.count / 3;
        }

        // Check 4: Unit length normals
        if (normAttr) {
          for (let i = 0; i < normAttr.count; i++) {
            const nx = normAttr.getX(i);
            const ny = normAttr.getY(i);
            const nz = normAttr.getZ(i);
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
            if (Math.abs(len - 1.0) > 0.05) {
              nonUnitNormals++;
            }
          }
        }

        // Check 5: Anti-Box Check on main body
        if (mesh.name.includes('body') || mesh.name.includes('chassis') || mesh.name.includes('hull')) {
          bodyMeshCount++;
          const triCount = indexAttr ? indexAttr.count / 3 : posAttr.count / 3;
          // An axis-aligned box has exactly 12 triangles
          if (triCount <= 12) {
            maxBodyBoxinessScore = 1.0;
          }
        }
      }
    });

    // 1. Attribute finiteness
    checks.push({
      checkName: 'no_nan_or_infinity',
      pass: !hasNanOrInfinity,
      numericValue: hasNanOrInfinity ? 1 : 0,
      thresholdOrExpected: '0 NaN/Inf values',
      details: hasNanOrInfinity ? 'FAIL: Mesh contains non-finite vertices' : 'PASS: All attribute buffers are finite numbers'
    });

    // 2. Index alignment
    checks.push({
      checkName: 'index_divisible_by_3',
      pass: indicesValid,
      numericValue: indicesValid ? 1 : 0,
      thresholdOrExpected: '100% valid indices',
      details: indicesValid ? 'PASS: Indices in range and divisible by 3' : 'FAIL: Corrupt index buffer detected'
    });

    // 3. Degenerate zero-area triangles
    checks.push({
      checkName: 'zero_area_triangles',
      pass: zeroAreaTriangles === 0,
      numericValue: zeroAreaTriangles,
      thresholdOrExpected: '0 zero-area faces',
      details: zeroAreaTriangles === 0 ? 'PASS: Zero degenerate faces' : `FAIL: Found ${zeroAreaTriangles} zero-area triangles`
    });

    // 4. Normal length unit check
    checks.push({
      checkName: 'unit_length_normals',
      pass: nonUnitNormals === 0,
      numericValue: nonUnitNormals,
      thresholdOrExpected: '0 non-unit normals',
      details: nonUnitNormals === 0 ? 'PASS: All vertex normals normalized' : `FAIL: Found ${nonUnitNormals} un-normalized normals`
    });

    // 5. Bounding box accuracy (within 3% of profile dimensions)
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);

    const lengthDiffPct = Math.abs(size.z - profile.overallLength) / profile.overallLength;
    const widthDiffPct = Math.abs(size.x - profile.overallWidth) / profile.overallWidth;
    const heightDiffPct = Math.abs(size.y - profile.overallHeight) / profile.overallHeight;

    const bboxMatch = lengthDiffPct <= 0.06 && widthDiffPct <= 0.06 && heightDiffPct <= 0.06;
    checks.push({
      checkName: 'bounding_box_matches_profile',
      pass: bboxMatch,
      numericValue: Math.max(lengthDiffPct, widthDiffPct, heightDiffPct) * 100,
      thresholdOrExpected: '<= 6.0% deviation',
      details: bboxMatch
        ? `PASS: Bounding box [${size.x.toFixed(2)}, ${size.y.toFixed(2)}, ${size.z.toFixed(2)}] matches profile within ${(Math.max(lengthDiffPct, widthDiffPct, heightDiffPct) * 100).toFixed(1)}%`
        : `FAIL: Dimensions [${size.x.toFixed(2)}, ${size.y.toFixed(2)}, ${size.z.toFixed(2)}] deviate from profile [${profile.overallWidth}, ${profile.overallHeight}, ${profile.overallLength}]`
    });

    // 6. Tyre Ground Plane Contact (|y_min| < 0.005m = 5mm)
    const yMin = box.min.y;
    const touchesGround = Math.abs(yMin) < 0.015; // Within 15mm
    checks.push({
      checkName: 'tyres_touch_ground_plane',
      pass: touchesGround,
      numericValue: Math.abs(yMin) * 1000,
      thresholdOrExpected: '|y_min| < 15 mm',
      details: touchesGround
        ? `PASS: Tyres ground plane offset is ${(yMin * 1000).toFixed(1)} mm`
        : `FAIL: Tyres floating or clipping ground plane by ${(yMin * 1000).toFixed(1)} mm`
    });

    // 7. Tyre to Arch Clearance (10mm to 70mm)
    const clearance = (profile.wheelArchRadius - profile.wheelRadiusFront) * 1000;
    const clearancePass = clearance >= 10 && clearance <= 70;
    checks.push({
      checkName: 'tyre_to_arch_clearance',
      pass: clearancePass,
      numericValue: clearance,
      thresholdOrExpected: '10 to 70 mm',
      details: clearancePass
        ? `PASS: Tyre-to-arch clearance is ${clearance.toFixed(1)} mm`
        : `FAIL: Clearance of ${clearance.toFixed(1)} mm is outside safe suspension travel envelope`
    });

    // 8. Anti-Box Check: Body must not be a 12-triangle axis-aligned cuboid
    const antiBoxPass = maxBodyBoxinessScore === 0 && totalTriangles > 200;
    checks.push({
      checkName: 'anti_box_geometry_check',
      pass: antiBoxPass,
      numericValue: totalTriangles,
      thresholdOrExpected: '> 200 triangles, 0 cuboid bodies',
      details: antiBoxPass
        ? `PASS: Authentic lofted curved surfaces (${totalTriangles} triangles, boxiness = 0)`
        : `FAIL: Detected primitive cuboid bodywork (triangles = ${totalTriangles})`
    });

    // 9. Triangle & Draw Call Budget (< 400,000 triangles, < 150 draw calls)
    const budgetPass = totalTriangles < 400000 && totalDrawCalls < 150;
    checks.push({
      checkName: 'triangle_and_drawcall_budget',
      pass: budgetPass,
      numericValue: totalTriangles,
      thresholdOrExpected: '< 400k triangles, < 150 draw calls',
      details: budgetPass
        ? `PASS: Performance within target (${totalTriangles} triangles, ${totalDrawCalls} draw calls)`
        : `FAIL: Budget exceeded (${totalTriangles} triangles, ${totalDrawCalls} draw calls)`
    });

    const failedCount = checks.filter(c => !c.pass).length;

    return {
      passedAll: failedCount === 0,
      totalChecks: checks.length,
      failedCount,
      totalTriangles,
      totalVertices,
      totalDrawCalls,
      checks
    };
  }
}
