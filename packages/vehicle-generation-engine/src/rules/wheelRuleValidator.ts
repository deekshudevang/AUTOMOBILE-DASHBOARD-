/**
 * AUTOVERSE 3D — Rule-Based Wheel & Tyre Fitment Validator
 * Enforces automotive engineering rules:
 * 1. Overall rolling diameter must remain within +/-3% of OEM specification.
 * 2. Arithmetic consistency between rim diameter, section width, and aspect ratio.
 * 3. Fender clearance and inner suspension strut clearance calculations.
 */

export interface WheelFitmentInput {
  nominalSectionWidthMm: number; // e.g. 265
  aspectRatio: number;           // e.g. 35
  rimDiameterInches: number;     // e.g. 20
  rimWidthInches: number;        // e.g. 9.5
  offsetMm: number;              // e.g. 40
}

export interface WheelFitmentReport {
  isValid: boolean;
  rollingDiameterMm: number;
  originalDiameterMm: number;
  diameterDeviationPercent: number;
  outerPokeMm: number;
  innerClearanceMm: number;
  warnings: string[];
  errors: string[];
}

export class WheelRuleValidator {
  /**
   * Calculates total tire rolling diameter in millimeters:
   * Diameter = (Rim Diameter * 25.4) + 2 * (Section Width * Aspect Ratio / 100)
   */
  public static calculateRollingDiameter(
    rimDiameterIn: number,
    sectionWidthMm: number,
    aspectRatio: number
  ): number {
    const rimMm = rimDiameterIn * 25.4;
    const sidewallMm = (sectionWidthMm * aspectRatio) / 100;
    return rimMm + 2 * sidewallMm;
  }

  /**
   * Validates proposed wheel & tyre combination against baseline OEM specification
   */
  public static validateFitment(
    proposed: WheelFitmentInput,
    baseline: WheelFitmentInput,
    fenderLipLimitMm: number = 85.0
  ): WheelFitmentReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Arithmetic Consistency Check
    if (proposed.nominalSectionWidthMm < 175 || proposed.nominalSectionWidthMm > 375) {
      errors.push(`Section width ${proposed.nominalSectionWidthMm}mm is outside standard automotive sizing.`);
    }
    if (proposed.aspectRatio < 20 || proposed.aspectRatio > 70) {
      errors.push(`Aspect ratio ${proposed.aspectRatio} is invalid.`);
    }
    if (proposed.rimDiameterInches < 15 || proposed.rimDiameterInches > 24) {
      errors.push(`Rim diameter ${proposed.rimDiameterInches}" is outside compatible sports car ranges.`);
    }

    // 2. Rolling Diameter Tolerance Check (+/- 3%)
    const originalDiameter = this.calculateRollingDiameter(
      baseline.rimDiameterInches,
      baseline.nominalSectionWidthMm,
      baseline.aspectRatio
    );
    const proposedDiameter = this.calculateRollingDiameter(
      proposed.rimDiameterInches,
      proposed.nominalSectionWidthMm,
      proposed.aspectRatio
    );

    const deviationPercent = ((proposedDiameter - originalDiameter) / originalDiameter) * 100;

    if (Math.abs(deviationPercent) > 3.0) {
      const sign = deviationPercent > 0 ? '+' : '';
      errors.push(
        `Rolling diameter deviation ${sign}${deviationPercent.toFixed(1)}% exceeds the ±3.0% engineering tolerance. Speedometer calibration and ride height compromised.`
      );
    } else if (Math.abs(deviationPercent) > 1.5) {
      warnings.push(`Rolling diameter deviation of ${deviationPercent.toFixed(1)}% is near allowable limit.`);
    }

    // 3. Wheel Outer Poke Calculation: (RimWidth * 25.4 / 2) - Offset
    const halfWidthMm = (proposed.rimWidthInches * 25.4) / 2;
    const outerPokeMm = halfWidthMm - proposed.offsetMm;
    const innerClearanceMm = halfWidthMm + proposed.offsetMm;

    if (outerPokeMm > fenderLipLimitMm) {
      errors.push(
        `Wheel poke (${outerPokeMm.toFixed(1)}mm) exceeds fender boundary (${fenderLipLimitMm}mm). Tire will scrub under compression.`
      );
    }

    return {
      isValid: errors.length === 0,
      rollingDiameterMm: Number(proposedDiameter.toFixed(1)),
      originalDiameterMm: Number(originalDiameter.toFixed(1)),
      diameterDeviationPercent: Number(deviationPercent.toFixed(2)),
      outerPokeMm: Number(outerPokeMm.toFixed(1)),
      innerClearanceMm: Number(innerClearanceMm.toFixed(1)),
      warnings,
      errors
    };
  }
}
