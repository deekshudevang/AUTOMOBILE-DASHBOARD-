/**
 * AUTOVERSE 3D — Aerodynamic Multi-Objective Optimization Engine
 * Implements Design of Experiments (DoE), parameter sweeping, constraint enforcement,
 * and Pareto-optimal frontier generation (minimizing Cd vs maximizing Downforce -Cl).
 */

export interface DesignVariableRange {
  name: string;
  min: number;
  max: number;
  step: number;
  current: number;
  unit: string;
}

export interface OptimizationConstraints {
  minGroundClearanceMm: number;
  maxWingSpanM: number;
  targetBalanceFrontPct: number;
  maxAllowableBalanceDeviationPct: number;
  maxDragCoefficient?: number;
}

export interface CandidateEvaluation {
  id: string;
  variables: {
    wingSpanM: number;
    wingAoADeg: number;
    splitterExtensionM: number;
    diffuserAngleDeg: number;
  };
  metrics: {
    cd: number;
    cl: number;
    downforceN: number;
    dragN: number;
    lOverD: number;
    frontBalancePct: number;
    groundClearanceMm: number;
  };
  isFeasible: boolean;
  constraintViolations: string[];
  isParetoOptimal: boolean;
  rank: number;
}

export interface OptimizationResult {
  vehicleId: string;
  baseline: CandidateEvaluation;
  totalEvaluated: number;
  feasibleCount: number;
  paretoFrontCount: number;
  paretoFront: CandidateEvaluation[];
  candidates: CandidateEvaluation[];
  recommendedBest: CandidateEvaluation;
  executionDurationMs: number;
}

export class AerodynamicOptimizer {
  /**
   * Run structured parameter sweep & multi-objective Pareto optimization
   */
  public static runOptimization(
    vehicleId: string,
    baselineVars: {
      wingSpanM: number;
      wingAoADeg: number;
      splitterExtensionM: number;
      diffuserAngleDeg: number;
    },
    ranges: {
      wingSpanM: [number, number];
      wingAoADeg: [number, number];
      splitterExtensionM: [number, number];
      diffuserAngleDeg: [number, number];
    },
    constraints: OptimizationConstraints = {
      minGroundClearanceMm: 75,
      maxWingSpanM: 1.95,
      targetBalanceFrontPct: 28.0,
      maxAllowableBalanceDeviationPct: 15.0
    },
    sampleCount: number = 36
  ): OptimizationResult {
    const startTime = performance.now();
    const candidates: CandidateEvaluation[] = [];

    // Helper: evaluate single configuration
    const evaluate = (id: string, vars: typeof baselineVars): CandidateEvaluation => {
      const rho = 1.225;
      const v = 30.0; // 30 m/s (~108 km/h) reference condition
      const frontalAreaM2 = 2.13;
      const qInf = 0.5 * rho * v * v;

      // Splitter calculation
      const splitterArea = 1.90 * vars.splitterExtensionM;
      const clSplitter = -(0.32 * (splitterArea / frontalAreaM2));
      const cdSplitter = 0.010 + 0.003 * (vars.splitterExtensionM / 0.10);

      // Wing calculation (Selig S1223 high-lift finite wing)
      const wingArea = vars.wingSpanM * 0.34;
      const ar = (vars.wingSpanM * vars.wingSpanM) / wingArea;
      const aoaRad = (vars.wingAoADeg * Math.PI) / 180;
      const a0 = 2 * Math.PI;
      const a = a0 / (1 + a0 / (Math.PI * ar));
      const clWingIso = -(0.28 + a * aoaRad);
      const clWing = clWingIso * (wingArea / frontalAreaM2);
      const cdiWing = (clWingIso * clWingIso) / (Math.PI * 0.85 * ar);
      const cdWing = (0.025 + cdiWing) * (wingArea / frontalAreaM2);

      // Diffuser calculation
      const diffArea = 1.45 * 0.75;
      const effDiffAngle = Math.min(vars.diffuserAngleDeg, 14.0);
      const clDiff = -(0.25 * Math.sin((effDiffAngle * Math.PI) / 180) * 2.2) * (diffArea / frontalAreaM2);
      const cdDiff = 0.012 + 0.0018 * vars.diffuserAngleDeg;

      // Base body
      const cdBase = 0.310;
      const clBase = 0.110;

      const totalCd = cdBase + cdSplitter + cdWing + cdDiff;
      const totalCl = clBase + clSplitter + clWing + clDiff;

      const clFront = 0.065 + clSplitter + (clDiff * 0.15);
      const clRear = 0.045 + clWing + (clDiff * 0.85);

      const frontBalancePct = (Math.abs(clFront) / (Math.abs(clFront) + Math.abs(clRear))) * 100;
      const downforceN = Math.abs(totalCl) * qInf * frontalAreaM2;
      const dragN = totalCd * qInf * frontalAreaM2;
      const lOverD = Math.abs(totalCl) / totalCd;

      // Ground clearance calculation
      const groundClearanceMm = Math.round(100 - vars.splitterExtensionM * 60);

      // Constraint checks
      const violations: string[] = [];
      if (groundClearanceMm < constraints.minGroundClearanceMm) {
        violations.push(`Ground clearance (${groundClearanceMm}mm) violates minimum ${constraints.minGroundClearanceMm}mm.`);
      }
      if (vars.wingSpanM > constraints.maxWingSpanM) {
        violations.push(`Wing span (${vars.wingSpanM}m) exceeds max packaging limit ${constraints.maxWingSpanM}m.`);
      }
      const balanceDelta = Math.abs(frontBalancePct - constraints.targetBalanceFrontPct);
      if (balanceDelta > constraints.maxAllowableBalanceDeviationPct) {
        violations.push(`Aero balance (${frontBalancePct.toFixed(1)}%) deviates by >${constraints.maxAllowableBalanceDeviationPct}% from target.`);
      }
      if (constraints.maxDragCoefficient && totalCd > constraints.maxDragCoefficient) {
        violations.push(`Drag coefficient (${totalCd.toFixed(3)}) exceeds limit ${constraints.maxDragCoefficient}.`);
      }

      return {
        id,
        variables: { ...vars },
        metrics: {
          cd: Math.round(totalCd * 1000) / 1000,
          cl: Math.round(totalCl * 1000) / 1000,
          downforceN: Math.round(downforceN),
          dragN: Math.round(dragN),
          lOverD: Math.round(lOverD * 100) / 100,
          frontBalancePct: Math.round(frontBalancePct * 10) / 10,
          groundClearanceMm
        },
        isFeasible: violations.length === 0,
        constraintViolations: violations,
        isParetoOptimal: false,
        rank: 999
      };
    };

    // 1. Evaluate baseline
    const baseline = evaluate('candidate_baseline', baselineVars);
    candidates.push(baseline);

    // 2. Structured Sampling Grid
    const spanSteps = [ranges.wingSpanM[0], (ranges.wingSpanM[0] + ranges.wingSpanM[1]) / 2, ranges.wingSpanM[1]];
    const aoaSteps = [ranges.wingAoADeg[0], (ranges.wingAoADeg[0] + ranges.wingAoADeg[1]) / 2, ranges.wingAoADeg[1]];
    const splitterSteps = [ranges.splitterExtensionM[0], ranges.splitterExtensionM[1]];
    const diffSteps = [ranges.diffuserAngleDeg[0], ranges.diffuserAngleDeg[1]];

    let idx = 1;
    for (const span of spanSteps) {
      for (const aoa of aoaSteps) {
        for (const spl of splitterSteps) {
          for (const diff of diffSteps) {
            candidates.push(
              evaluate(`candidate_${idx++}`, {
                wingSpanM: span,
                wingAoADeg: aoa,
                splitterExtensionM: spl,
                diffuserAngleDeg: diff
              })
            );
          }
        }
      }
    }

    // 3. Compute Pareto Frontier (Minimizing Cd, Maximizing Downforce = -Cl)
    const feasible = candidates.filter(c => c.isFeasible);

    for (const c1 of feasible) {
      let isDominated = false;
      for (const c2 of feasible) {
        if (c1.id === c2.id) continue;
        // c2 dominates c1 if c2 has lower Cd AND higher downforce (more negative Cl), with at least one strictly better
        const c2HasLowerDrag = c2.metrics.cd <= c1.metrics.cd;
        const c2HasMoreDownforce = c2.metrics.cl <= c1.metrics.cl; // Cl is negative for downforce
        const strictlyBetterInOne = c2.metrics.cd < c1.metrics.cd || c2.metrics.cl < c1.metrics.cl;

        if (c2HasLowerDrag && c2HasMoreDownforce && strictlyBetterInOne) {
          isDominated = true;
          break;
        }
      }
      c1.isParetoOptimal = !isDominated;
      c1.rank = isDominated ? 2 : 1;
    }

    const paretoFront = feasible.filter(c => c.isParetoOptimal).sort((a, b) => a.metrics.cd - b.metrics.cd);

    // Recommended candidate: best balance of high L/D on the Pareto front
    const recommendedBest = paretoFront.length > 0
      ? paretoFront.reduce((best, c) => (c.metrics.lOverD > best.metrics.lOverD ? c : best), paretoFront[0])
      : baseline;

    const endTime = performance.now();

    return {
      vehicleId,
      baseline,
      totalEvaluated: candidates.length,
      feasibleCount: feasible.length,
      paretoFrontCount: paretoFront.length,
      paretoFront,
      candidates,
      recommendedBest,
      executionDurationMs: Math.round(endTime - startTime)
    };
  }
}
