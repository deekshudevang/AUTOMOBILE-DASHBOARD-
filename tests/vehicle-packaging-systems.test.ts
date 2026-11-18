import { describe, it, expect } from 'vitest';
import { VehiclePackagingSystem, SuspensionHardpoints, HeatExchangerCoreSpecs } from '../src/geometry/packaging/vehiclePackagingSystem';

describe('AutoVerse 3D — Vehicle Systems Packaging Suite (Phase 12)', () => {
  const frontDoubleWishbone: SuspensionHardpoints = {
    upperControlArmInboardFront: [1.25, 0.40, 0.55],
    upperControlArmInboardRear: [1.05, 0.40, 0.55],
    upperControlArmOutboard: [1.15, 0.72, 0.52],
    lowerControlArmInboardFront: [1.30, 0.30, 0.25],
    lowerControlArmInboardRear: [1.00, 0.30, 0.25],
    lowerControlArmOutboard: [1.15, 0.75, 0.22],
    damperChassisMount: [1.15, 0.45, 0.70],
    damperUprightMount: [1.15, 0.65, 0.28],
    tieRodInboard: [1.02, 0.35, 0.32],
    tieRodOutboard: [1.02, 0.74, 0.32]
  };

  it('evaluates suspension kinematics across vertical bump travel and steering sweep', () => {
    // Static state
    const staticState = VehiclePackagingSystem.evaluateSuspensionKinematics(frontDoubleWishbone, 0, 0);
    expect(staticState.bumpTravelM).toBe(0);
    expect(staticState.camberAngleDeg).toBeCloseTo(0);
    expect(staticState.damperLengthM).toBeGreaterThan(0.40);

    // Bump travel (+50mm)
    const bumpState = VehiclePackagingSystem.evaluateSuspensionKinematics(frontDoubleWishbone, 0.05, 25);
    expect(bumpState.bumpTravelM).toBe(0.05);
    // Negative camber gain under bump
    expect(bumpState.camberAngleDeg).toBeLessThan(0);
    expect(bumpState.damperLengthM).toBeLessThan(staticState.damperLengthM); // Damper compressed
    expect(bumpState.steeringAngleDeg).toBe(25);
    expect(bumpState.scrubRadiusMm).toBeDefined();
  });

  it('generates porous medium radiator core model with Darcy-Forchheimer loss parameters', () => {
    const radiatorSpecs: HeatExchangerCoreSpecs = {
      id: 'radiator_main_center',
      name: 'Central High-Performance Radiator',
      coreWidthM: 0.65,
      coreHeightM: 0.42,
      coreThicknessM: 0.055,
      centerLocation: [2.10, 0, 0.28],
      tiltAngleDeg: 15.0,
      porosity: 0.72,
      darcyViscousLossD: 1.2e6,
      darcyInertialLossF: 45.0
    };

    const model = VehiclePackagingSystem.generateHeatExchangerModel(radiatorSpecs);
    expect(model.geometry).toBeDefined();
    expect(model.frontalAreaM2).toBeCloseTo(0.65 * 0.42, 2);
    expect(model.volumeM3).toBeCloseTo(0.65 * 0.42 * 0.055, 3);
    expect(model.darcyForchheimerEq).toContain('ΔP / Δx');
    expect(model.disclaimer).toContain('NON-STRUCTURAL PACKAGING');
  });
});
