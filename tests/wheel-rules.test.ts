import { describe, it, expect } from 'vitest';
import { WheelRuleValidator, WheelFitmentInput } from '@autoverse/vehicle-generation-engine';

describe('AutoVerse 3D — Rule-Based Wheel & Tyre Fitment Suite', () => {
  const oemBaseline: WheelFitmentInput = {
    rimDiameterInches: 20,
    nominalSectionWidthMm: 265,
    aspectRatio: 35,
    rimWidthInches: 9.5,
    offsetMm: 45
  };

  it('calculates correct rolling diameter for OEM baseline', () => {
    // 20 * 25.4 + 2 * (265 * 0.35) = 508 + 185.5 = 693.5mm
    const diam = WheelRuleValidator.calculateRollingDiameter(20, 265, 35);
    expect(diam).toBeCloseTo(693.5, 1);
  });

  it('validates a compatible plus-size wheel setup within 3% tolerance', () => {
    // 21" rim with 265/30: 21 * 25.4 + 2 * (265 * 0.30) = 533.4 + 159 = 692.4mm (-0.16% diff)
    const proposed: WheelFitmentInput = {
      rimDiameterInches: 21,
      nominalSectionWidthMm: 265,
      aspectRatio: 30,
      rimWidthInches: 10,
      offsetMm: 42
    };

    const report = WheelRuleValidator.validateFitment(proposed, oemBaseline);
    expect(report.isValid).toBe(true);
    expect(report.errors.length).toBe(0);
    expect(Math.abs(report.diameterDeviationPercent)).toBeLessThan(1.0);
  });

  it('blocks incompatible wheel setup with > 3% rolling diameter deviation', () => {
    // 22" rim with 305/45: massive rolling diameter increase (>10%)
    const oversized: WheelFitmentInput = {
      rimDiameterInches: 22,
      nominalSectionWidthMm: 305,
      aspectRatio: 45,
      rimWidthInches: 11,
      offsetMm: 35
    };

    const report = WheelRuleValidator.validateFitment(oversized, oemBaseline);
    expect(report.isValid).toBe(false);
    expect(report.errors.some(e => e.includes('±3.0% engineering tolerance'))).toBe(true);
  });

  it('detects and blocks excessive wheel poke beyond fender limit', () => {
    const aggressivePoke: WheelFitmentInput = {
      rimDiameterInches: 20,
      nominalSectionWidthMm: 265,
      aspectRatio: 35,
      rimWidthInches: 12, // 12" = 304.8mm half-width = 152.4mm
      offsetMm: 5         // Poke = 152.4 - 5 = 147.4mm > 85mm limit
    };

    const report = WheelRuleValidator.validateFitment(aggressivePoke, oemBaseline, 85);
    expect(report.isValid).toBe(false);
    expect(report.errors.some(e => e.includes('scrub under compression'))).toBe(true);
  });
});
