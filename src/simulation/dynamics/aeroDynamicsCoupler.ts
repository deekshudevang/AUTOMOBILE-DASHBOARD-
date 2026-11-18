/**
 * AUTOVERSE 3D — Aero-to-Vehicle Dynamics Coupling Engine
 * Couples CFD-derived aerodynamic force maps (Cd, Cl_front, Cl_rear) into
 * 4-wheel dynamic normal load distribution, suspension travel deflection,
 * and high-speed cornering lateral grip envelopes across velocity.
 */

export interface VehicleDynamicsInput {
  massKg: number;
  wheelbaseM: number;
  frontTrackM: number;
  rearTrackM: number;
  cgHeightM: number;
  staticWeightFrontPct: number; // e.g. 40.5% front, 59.5% rear for rear-engine
  tireFrictionCoeffMu: number;  // e.g. 1.35 for Michelin Cup 2 R
  frontSpringRateNPerM: number; // e.g. 120,000 N/m
  rearSpringRateNPerM: number;  // e.g. 160,000 N/m
  frontalAreaM2: number;
  cd: number;
  clFront: number; // Negative for downforce
  clRear: number;  // Negative for downforce
}

export interface SpeedSweepPoint {
  velocityKmh: number;
  velocityMs: number;
  dynamicPressurePa: number;
  dragForceN: number;
  downforceFrontN: number;
  downforceRearN: number;
  totalDownforceN: number;
  totalAxleLoadFrontN: number;
  totalAxleLoadRearN: number;
  dynamicWeightFrontPct: number;
  maxCorneringLateralG: number;
  suspensionCompressionFrontMm: number;
  suspensionCompressionRearMm: number;
  dynamicRakeChangeDeg: number;
}

export interface AeroDynamicsCouplingReport {
  provenance: 'CFD_COUPLED_DYNAMICS';
  staticWeightFrontN: number;
  staticWeightRearN: number;
  totalStaticWeightN: number;
  baselineSpeed100Kmh: SpeedSweepPoint;
  topSpeedPoint: SpeedSweepPoint;
  speedSweep: SpeedSweepPoint[];
  highSpeedGripEnhancementPct: number;
  highSpeedUndersteerShiftDegPerG: number;
}

export class AeroDynamicsCoupler {
  /**
   * Evaluates complete vehicle dynamics response across 0 to 300 km/h
   */
  public static evaluateDynamicsCoupling(input: VehicleDynamicsInput): AeroDynamicsCouplingReport {
    const g = 9.81;
    const rho = 1.225; // ISA sea level air density
    const totalWeightN = input.massKg * g;
    const staticFrontN = totalWeightN * (input.staticWeightFrontPct / 100.0);
    const staticRearN = totalWeightN * ((100.0 - input.staticWeightFrontPct) / 100.0);

    const speedSweep: SpeedSweepPoint[] = [];
    const speedsKmh = [0, 40, 80, 100, 120, 160, 200, 240, 280, 300];

    for (const vKmh of speedsKmh) {
      const vMs = vKmh / 3.6;
      const qInf = 0.5 * rho * vMs * vMs;

      // Aero Forces
      const dragN = input.cd * qInf * input.frontalAreaM2;
      const downforceFrontN = Math.abs(input.clFront) * qInf * input.frontalAreaM2;
      const downforceRearN = Math.abs(input.clRear) * qInf * input.frontalAreaM2;
      const totalDownforceN = downforceFrontN + downforceRearN;

      // Dynamic normal loads on tires
      const totalAxleLoadFrontN = staticFrontN + downforceFrontN;
      const totalAxleLoadRearN = staticRearN + downforceRearN;
      const totalDynamicVerticalN = totalAxleLoadFrontN + totalAxleLoadRearN;

      const dynamicWeightFrontPct = (totalAxleLoadFrontN / totalDynamicVerticalN) * 100.0;

      // Maximum lateral grip (friction limit): Fy_max = mu * Fz_total
      const maxLateralForceN = input.tireFrictionCoeffMu * totalDynamicVerticalN;
      const maxCorneringLateralG = maxLateralForceN / (input.massKg * g);

      // Suspension compression (2 wheels per axle)
      const deflFrontM = downforceFrontN / (2 * input.frontSpringRateNPerM);
      const deflRearM = downforceRearN / (2 * input.rearSpringRateNPerM);

      // Dynamic pitch / rake change (delta deflection between front and rear over wheelbase)
      const dynamicRakeChangeDeg = ((deflRearM - deflFrontM) / input.wheelbaseM) * (180 / Math.PI);

      speedSweep.push({
        velocityKmh: vKmh,
        velocityMs: Math.round(vMs * 10) / 10,
        dynamicPressurePa: Math.round(qInf * 10) / 10,
        dragForceN: Math.round(dragN),
        downforceFrontN: Math.round(downforceFrontN),
        downforceRearN: Math.round(downforceRearN),
        totalDownforceN: Math.round(totalDownforceN),
        totalAxleLoadFrontN: Math.round(totalAxleLoadFrontN),
        totalAxleLoadRearN: Math.round(totalAxleLoadRearN),
        dynamicWeightFrontPct: Math.round(dynamicWeightFrontPct * 10) / 10,
        maxCorneringLateralG: Math.round(maxCorneringLateralG * 100) / 100,
        suspensionCompressionFrontMm: Math.round(deflFrontM * 1000 * 10) / 10,
        suspensionCompressionRearMm: Math.round(deflRearM * 1000 * 10) / 10,
        dynamicRakeChangeDeg: Math.round(dynamicRakeChangeDeg * 100) / 100
      });
    }

    const baseline100 = speedSweep.find(p => p.velocityKmh === 100) || speedSweep[3];
    const topSpeed = speedSweep[speedSweep.length - 1];

    // High speed grip improvement percentage: lateral G at 280 km/h vs static
    const staticG = speedSweep[0].maxCorneringLateralG;
    const highSpeedG = speedSweep[speedSweep.length - 2].maxCorneringLateralG;
    const highSpeedGripEnhancementPct = Math.round(((highSpeedG - staticG) / staticG) * 1000) / 10;

    // Understeer shift: if dynamic front weight % decreases at high speed, understeer increases
    const balanceShift = topSpeed.dynamicWeightFrontPct - input.staticWeightFrontPct;
    const understeerShift = Math.round(-balanceShift * 0.12 * 100) / 100;

    return {
      provenance: 'CFD_COUPLED_DYNAMICS',
      staticWeightFrontN: Math.round(staticFrontN),
      staticWeightRearN: Math.round(staticRearN),
      totalStaticWeightN: Math.round(totalWeightN),
      baselineSpeed100Kmh: baseline100,
      topSpeedPoint: topSpeed,
      speedSweep,
      highSpeedGripEnhancementPct,
      highSpeedUndersteerShiftDegPerG: understeerShift
    };
  }
}
