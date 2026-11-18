import * as THREE from 'three';

export interface SuspensionHardpoints {
  upperControlArmInboardFront: [number, number, number]; // SAE [x, y, z]
  upperControlArmInboardRear: [number, number, number];
  upperControlArmOutboard: [number, number, number];
  lowerControlArmInboardFront: [number, number, number];
  lowerControlArmInboardRear: [number, number, number];
  lowerControlArmOutboard: [number, number, number];
  damperChassisMount: [number, number, number];
  damperUprightMount: [number, number, number];
  tieRodInboard: [number, number, number];
  tieRodOutboard: [number, number, number];
}

export interface SuspensionKinematicState {
  bumpTravelM: number;
  steeringAngleDeg: number;
  camberAngleDeg: number;
  casterAngleDeg: number;
  toeAngleDeg: number;
  scrubRadiusMm: number;
  damperLengthM: number;
}

export interface HeatExchangerCoreSpecs {
  id: string;
  name: string;
  coreWidthM: number;
  coreHeightM: number;
  coreThicknessM: number;
  centerLocation: [number, number, number]; // SAE [x, y, z]
  tiltAngleDeg: number; // Pitch tilt angle
  porosity: number; // Core porosity ratio 0.0 - 1.0 (default 0.70)
  darcyInertialLossF: number; // Forchheimer inertial loss coefficient (1/m)
  darcyViscousLossD: number; // Darcy viscous resistance coefficient (1/m2)
}

export class VehiclePackagingSystem {
  /**
   * Evaluate suspension kinematic hardpoints across vertical travel and steering
   */
  public static evaluateSuspensionKinematics(
    hardpoints: SuspensionHardpoints,
    bumpTravelM: number = 0.0,
    steeringAngleDeg: number = 0.0
  ): SuspensionKinematicState {
    const ucaOut = hardpoints.upperControlArmOutboard;
    const lcaOut = hardpoints.lowerControlArmOutboard;
    const dChassis = hardpoints.damperChassisMount;
    const dUpright = hardpoints.damperUprightMount;

    // Upright vertical translation with camber gain
    // Camber gain approx -0.8 deg per 10mm bump for standard SLA suspension
    const camberGainPerMeter = -80.0; // deg/m
    const camberAngle = camberGainPerMeter * bumpTravelM;

    // Caster angle: arctan(dx / dz) between UCA and LCA outboard ball joints
    const dxOut = ucaOut[0] - lcaOut[0];
    const dzOut = ucaOut[2] - lcaOut[2];
    const casterAngle = Math.atan2(-dxOut, Math.max(0.01, dzOut)) * (180 / Math.PI);

    // Damper compressed length
    const currentDamperUprightZ = dUpright[2] + bumpTravelM;
    const damperDx = dChassis[0] - dUpright[0];
    const damperDy = dChassis[1] - dUpright[1];
    const damperDz = dChassis[2] - currentDamperUprightZ;
    const damperLength = Math.sqrt(damperDx * damperDx + damperDy * damperDy + damperDz * damperDz);

    // Kingpin inclination & scrub radius
    const kingpinSlope = (ucaOut[1] - lcaOut[1]) / Math.max(0.01, ucaOut[2] - lcaOut[2]);
    const groundInterceptY = lcaOut[1] - lcaOut[2] * kingpinSlope;
    const wheelCenterY = (ucaOut[1] + lcaOut[1]) / 2 + 0.12; // Nominal wheel offset
    const scrubRadiusMm = (wheelCenterY - groundInterceptY) * 1000;

    return {
      bumpTravelM,
      steeringAngleDeg,
      camberAngleDeg: Math.round(camberAngle * 100) / 100,
      casterAngleDeg: Math.round(casterAngle * 10) / 10,
      toeAngleDeg: Math.round(steeringAngleDeg * 0.95 * 10) / 10, // Ackerman toe approximation
      scrubRadiusMm: Math.round(scrubRadiusMm * 10) / 10,
      damperLengthM: Math.round(damperLength * 1000) / 1000
    };
  }

  /**
   * Generate 3D porous medium box geometry and Darcy-Forchheimer parameters for radiator / intercooler core
   * Model: Delta P / Delta x = - (mu * D * v + 0.5 * rho * F * v^2)
   */
  public static generateHeatExchangerModel(specs: HeatExchangerCoreSpecs): {
    geometry: THREE.BufferGeometry;
    frontalAreaM2: number;
    volumeM3: number;
    darcyForchheimerEq: string;
    disclaimer: string;
  } {
    const { coreWidthM, coreHeightM, coreThicknessM, centerLocation, tiltAngleDeg, darcyViscousLossD, darcyInertialLossF } = specs;
    // SAE coords: width along Y, thickness along X, height along Z
    const geometry = new THREE.BoxGeometry(coreThicknessM, coreWidthM, coreHeightM);
    geometry.rotateY((tiltAngleDeg * Math.PI) / 180);
    geometry.translate(centerLocation[0], centerLocation[1], centerLocation[2]);

    const frontalAreaM2 = Math.round(coreWidthM * coreHeightM * 1000) / 1000;
    const volumeM3 = Math.round(frontalAreaM2 * coreThicknessM * 10000) / 10000;

    const darcyForchheimerEq = `ΔP / Δx = - (μ · ${darcyViscousLossD} · v + 0.5 · ρ · ${darcyInertialLossF} · v²)`;
    const disclaimer = 'NON-STRUCTURAL PACKAGING: Geometry validity does not imply structural crashworthiness, fatigue endurance, or thermodynamic heat-rejection adequacy.';

    return {
      geometry,
      frontalAreaM2,
      volumeM3,
      darcyForchheimerEq,
      disclaimer
    };
  }
}
