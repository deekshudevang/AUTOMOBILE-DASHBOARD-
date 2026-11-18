import { describe, it, expect } from 'vitest';
import { DomainEngine } from '../src/simulation/openfoam/domainEngine';
import { OpenFoamJobRunner, ConvergenceResiduals } from '../src/simulation/openfoam/jobRunner';
import { DrivAerBodyGenerator, CANONICAL_DRIVAER_SPECS } from '../src/geometry/benchmarks/drivaerBodyGenerator';
import { DrivAerBenchmarkRunner } from '../src/simulation/benchmarks/drivaerBenchmarkRunner';

describe('AutoVerse 3D — Full CFD Orchestration & DrivAer Benchmark Suite (Phase 10)', () => {
  it('computes computational wind tunnel domain with blockage ratio < 3.0% and correct BCs', () => {
    const domain = DomainEngine.calculateDomain(
      {
        lengthM: 4.612,
        widthM: 1.802,
        heightM: 1.419,
        wheelbaseM: 2.786,
        groundClearanceM: 0.150,
        frontalAreaM2: 2.16,
        wheelRadiusM: 0.33
      },
      40.0, // 40 m/s
      false
    );

    expect(domain.isBlockageCompliant).toBe(true);
    expect(domain.blockageRatioPercent).toBeLessThan(3.0);
    expect(domain.upstreamDistanceM).toBeGreaterThanOrEqual(4.612 * 3.0);
    expect(domain.downstreamDistanceM).toBeGreaterThanOrEqual(4.612 * 8.0);
    expect(domain.heightM).toBeGreaterThanOrEqual(1.419 * 5.0);

    // Boundary conditions
    expect(domain.boundaryConditions.inlet.velocityMs).toBe(40.0);
    expect(domain.boundaryConditions.ground.velocityMs).toBe(40.0);
    expect(domain.boundaryConditions.wheels.angularVelocityRadS).toBeCloseTo(40.0 / 0.33, 1);
  });

  it('evaluates OpenFOAM convergence and enforces force stability standard deviation filter', () => {
    // 1. Converged run (residuals drop below 1e-4, Cd standard deviation < 0.001)
    const convergedHistory: ConvergenceResiduals[] = [];
    for (let i = 1; i <= 100; i++) {
      convergedHistory.push({
        iteration: i,
        p: 1e-3 / Math.sqrt(i),
        Ux: 1e-3 / i,
        Uy: 1e-3 / i,
        Uz: 1e-3 / i,
        k: 1e-3 / i,
        omega: 1e-3 / i,
        cd: 0.285 + Math.sin(i) * 0.0001, // tightly bounded oscillation
        cl: -0.120 + Math.cos(i) * 0.0001
      });
    }

    const evalConverged = OpenFoamJobRunner.evaluateConvergence(convergedHistory);
    expect(evalConverged.isConverged).toBe(true);
    expect(evalConverged.status).toBe('CONVERGED');
    expect(evalConverged.reliabilityTag).toBe('VERIFIED_CONVERGED');
    expect(evalConverged.cdStdDev).toBeLessThan(0.001);

    // 2. Oscillating/diverging run (Cd fluctuating widely -> UNRELIABLE)
    const oscillatingHistory: ConvergenceResiduals[] = [];
    for (let i = 1; i <= 100; i++) {
      oscillatingHistory.push({
        iteration: i,
        p: 0.05,
        Ux: 0.02,
        Uy: 0.02,
        Uz: 0.02,
        k: 0.01,
        omega: 0.01,
        cd: 0.285 + Math.sin(i * 0.5) * 0.03, // Large 0.03 oscillation
        cl: -0.10
      });
    }

    const evalOscillating = OpenFoamJobRunner.evaluateConvergence(oscillatingHistory);
    expect(evalOscillating.isConverged).toBe(false);
    expect(evalOscillating.status).toBe('NOT_CONVERGED');
    expect(evalOscillating.reliabilityTag).toBe('UNRELIABLE_UNCONVERGED');
  });

  it('clamps hardware solver resources to container feasibility ceilings (12 threads, 10GB RAM)', () => {
    const clamped = OpenFoamJobRunner.validateSandboxConfig(24, 32);
    expect(clamped.coresAllocated).toBe(12);
    expect(clamped.memoryGbAllocated).toBe(10.0);
    expect(clamped.warnings.length).toBe(2);
  });

  it('generates DrivAer 3D geometry and watertight STL surfaces for all configurations', () => {
    const fastbackGeo = DrivAerBodyGenerator.generateGeometry('fastback');
    const notchbackGeo = DrivAerBodyGenerator.generateGeometry('notchback');
    const estateGeo = DrivAerBodyGenerator.generateGeometry('estate');

    expect(fastbackGeo.getAttribute('position').count).toBeGreaterThan(200);
    expect(notchbackGeo.getAttribute('position').count).toBeGreaterThan(200);
    expect(estateGeo.getAttribute('position').count).toBeGreaterThan(200);

    const stl = DrivAerBodyGenerator.exportToSTL(fastbackGeo, 'drivaer_fastback');
    expect(stl).toContain('solid drivaer_fastback');
    expect(stl).toContain('endsolid drivaer_fastback');
  });

  it('executes DrivAer benchmark suite and confirms literature tolerance and physical trends', () => {
    const report = DrivAerBenchmarkRunner.runBenchmark();
    expect(report.allPassed).toBe(true);
    expect(report.physicalTrendVerified).toBe(true);

    expect(report.results.fastback.calculatedCd).toBeCloseTo(0.245);
    expect(report.results.fastback.literatureCd).toBeCloseTo(0.243);
    expect(report.results.fastback.errorPercent).toBeLessThan(6.0);

    expect(report.results.notchback.calculatedCd).toBeCloseTo(0.258);
    expect(report.results.notchback.literatureCd).toBeCloseTo(0.254);
    expect(report.results.notchback.errorPercent).toBeLessThan(6.0);

    expect(report.results.estate.calculatedCd).toBeCloseTo(0.285);
    expect(report.results.estate.literatureCd).toBeCloseTo(0.282);
    expect(report.results.estate.errorPercent).toBeLessThan(6.0);
  });
});
