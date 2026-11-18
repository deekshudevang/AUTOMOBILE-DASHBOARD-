export interface SpeedOperatingPoint {
  speedKmh: number;
  velocityMs: number;
  dynamicPressurePa: number;
  reynoldsNumber: number;
  skinFrictionCoefficient: number;
  wallShearStressPa: number;
  frictionVelocityMs: number;
  firstCellHeightMm_yPlus30: number; // For standard wall functions (k-omega SST)
  firstCellHeightMm_yPlus1: number;  // For resolved boundary layer
  boundaryLayerThicknessMm: number;
  openFoamBoundaryVelocity: [number, number, number]; // Vector [u, v, w] in m/s
  turbulenceIntensityPercent: number;
  turbulentKineticEnergy_k: number;
  specificDissipationRate_omega: number;
}

export interface MultiSpeedStudyConfig {
  provenance: 'CFD_CONFIG';
  characteristicLengthM: number;
  frontalAreaM2: number;
  airDensityKgM3: number;
  kinematicViscosityM2s: number;
  operatingPoints: SpeedOperatingPoint[];
  reynoldsDependenceNote: string;
}

export class MultiSpeedSetup {
  /**
   * Formulate fluid dynamics parameters across multiple vehicle operating speeds
   * Enforces Reynolds number dependence (no linear scaling!)
   */
  public static configureSpeedStudy(
    characteristicLengthM: number,
    frontalAreaM2: number,
    speedsKmh: number[] = [50, 100, 150, 200, 250, 300],
    airProps: { densityKgM3?: number; kinematicViscosityM2s?: number } = {}
  ): MultiSpeedStudyConfig {
    const rho = airProps.densityKgM3 ?? 1.225; // ISA sea level kg/m3
    const nu = airProps.kinematicViscosityM2s ?? 1.48e-5; // Kinematic viscosity (m2/s)
    const mu = rho * nu; // Dynamic viscosity (Pa*s)

    const operatingPoints: SpeedOperatingPoint[] = speedsKmh.map(kmh => {
      const v = kmh / 3.6;
      const q = 0.5 * rho * v * v;
      const re = (v * characteristicLengthM) / nu;

      // Prandtl-Schlichting turbulent skin friction estimation
      const cf = 0.074 / Math.pow(re, 0.2);
      const tauW = cf * q;
      const uTau = Math.sqrt(tauW / rho);

      // First cell height for y+ = 30 and y+ = 1
      // y = y+ * nu / uTau
      const y1_yPlus30 = (30 * nu) / uTau;
      const y1_yPlus1 = (1 * nu) / uTau;

      // Estimated turbulent boundary layer thickness at vehicle rear
      const delta = (0.37 * characteristicLengthM) / Math.pow(re, 0.2);

      // Inlet turbulence parameters (1% freestream turbulence intensity)
      const intensity = 0.01;
      const k = 1.5 * Math.pow(v * intensity, 2);
      const turbulentLengthScale = 0.07 * characteristicLengthM;
      const omega = Math.sqrt(k) / (0.09 * turbulentLengthScale);

      return {
        speedKmh: kmh,
        velocityMs: Math.round(v * 100) / 100,
        dynamicPressurePa: Math.round(q * 10) / 10,
        reynoldsNumber: Math.round(re),
        skinFrictionCoefficient: Math.round(cf * 1e5) / 1e5,
        wallShearStressPa: Math.round(tauW * 100) / 100,
        frictionVelocityMs: Math.round(uTau * 1000) / 1000,
        firstCellHeightMm_yPlus30: Math.round(y1_yPlus30 * 1000 * 100) / 100,
        firstCellHeightMm_yPlus1: Math.round(y1_yPlus1 * 1000 * 100) / 100,
        boundaryLayerThicknessMm: Math.round(delta * 1000 * 10) / 10,
        openFoamBoundaryVelocity: [Math.round(v * 100) / 100, 0, 0],
        turbulenceIntensityPercent: intensity * 100,
        turbulentKineticEnergy_k: Math.round(k * 1000) / 1000,
        specificDissipationRate_omega: Math.round(omega * 10) / 10
      };
    });

    return {
      provenance: 'CFD_CONFIG',
      characteristicLengthM,
      frontalAreaM2,
      airDensityKgM3: rho,
      kinematicViscosityM2s: nu,
      operatingPoints,
      reynoldsDependenceNote:
        'Reynolds-number dependence: Forces at distinct velocity points exhibit non-linear boundary layer thickening and vortex detachment behavior. Each operating point requires an independent OpenFOAM solver run.'
    };
  }
}
