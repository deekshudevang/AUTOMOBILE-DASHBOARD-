import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { CfdReadinessGate } from '../src/simulation/cfdGates/cfdReadinessGate';
import { MultiSpeedSetup } from '../src/simulation/cfdGates/multiSpeedSetup';

describe('AutoVerse 3D — CFD-Readiness Gates & Multi-Speed Setup (Phase 9)', () => {
  it('detects ground plane collision and rejects invalid geometry before OpenFOAM meshing', () => {
    // Box penetrating ground (min Z = -0.05m)
    const penetratingBox = new THREE.BoxGeometry(2.0, 1.0, 0.5);
    penetratingBox.translate(0, 0, -0.02); // Lowest point at Z = -0.27m

    const result = CfdReadinessGate.evaluateGeometry(penetratingBox);
    expect(result.isReadyForCfd).toBe(false);
    expect(result.overallStatus).toBe('REJECTED');

    const groundCheck = result.checks.find(c => c.name === 'Ground Plane Penetration');
    expect(groundCheck).toBeDefined();
    expect(groundCheck?.passed).toBe(false);
    expect(groundCheck?.severity).toBe('CRITICAL');
  });

  it('detects degenerate zero-area triangles and flags them as critical defects', () => {
    const geom = new THREE.BufferGeometry();
    // 3 vertices with two identical coordinates -> zero area
    const positions = new Float32Array([
      0, 0, 0.1,
      0, 0, 0.1,
      1, 0, 0.1
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const result = CfdReadinessGate.evaluateGeometry(geom);
    expect(result.isReadyForCfd).toBe(false);
    expect(result.overallStatus).toBe('REJECTED');

    const degenCheck = result.checks.find(c => c.name === 'Degenerate Triangles');
    expect(degenCheck?.passed).toBe(false);
    expect(degenCheck?.violatingElements).toBe(1);
  });

  it('evaluates compliant, elevated geometry as CFD-ready and recommends refinement levels', () => {
    // Clean elevated box above ground (clearance 50mm)
    const validGeom = new THREE.BoxGeometry(1.5, 0.8, 0.4);
    validGeom.translate(0, 0, 0.25); // Z range: 0.05 to 0.45m

    const result = CfdReadinessGate.evaluateGeometry(validGeom, { minGroundClearanceM: 0.03 });
    expect(result.isReadyForCfd).toBe(true);
    expect(result.overallStatus).toBe('PASSED');
    expect(result.recommendedRefinementLevel).toBeGreaterThanOrEqual(4);
    expect(result.estimatedSurfaceCellCount).toBeGreaterThan(0);
  });

  it('generates multi-speed aerodynamic configuration with non-linear Reynolds number dependence', () => {
    const characteristicLengthM = 4.5;
    const frontalAreaM2 = 2.1;
    const speedsKmh = [50, 100, 200, 300];

    const study = MultiSpeedSetup.configureSpeedStudy(
      characteristicLengthM,
      frontalAreaM2,
      speedsKmh
    );

    expect(study.provenance).toBe('CFD_CONFIG');
    expect(study.operatingPoints.length).toBe(4);
    expect(study.reynoldsDependenceNote).toContain('Reynolds');

    const pt50 = study.operatingPoints[0];
    const pt300 = study.operatingPoints[3];

    // Re scales with speed
    expect(pt50.reynoldsNumber).toBeGreaterThan(3e6);
    expect(pt300.reynoldsNumber).toBeGreaterThan(2e7);

    // Dynamic pressure scales with V^2
    expect(pt300.dynamicPressurePa).toBeCloseTo(pt50.dynamicPressurePa * 36, -2);

    // Wall shear stress increases at higher speeds
    expect(pt300.wallShearStressPa).toBeGreaterThan(pt50.wallShearStressPa);

    // First cell height for y+ = 30 gets smaller at higher speeds (thinner viscous sublayer)
    expect(pt300.firstCellHeightMm_yPlus30).toBeLessThan(pt50.firstCellHeightMm_yPlus30);

    // Boundary conditions vectors properly formed for OpenFOAM
    expect(pt300.openFoamBoundaryVelocity[0]).toBeCloseTo(83.33, 1);
    expect(pt300.turbulentKineticEnergy_k).toBeGreaterThan(0);
    expect(pt300.specificDissipationRate_omega).toBeGreaterThan(0);
  });
});
