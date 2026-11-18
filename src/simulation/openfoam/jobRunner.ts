export type CfdJobState = 'QUEUED' | 'RUNNING' | 'CONVERGED' | 'NOT_CONVERGED' | 'FAILED' | 'CANCELLED';

export interface ConvergenceResiduals {
  iteration: number;
  p: number;
  Ux: number;
  Uy: number;
  Uz: number;
  k: number;
  omega: number;
  cd: number;
  cl: number;
}

export interface CfdJobReport {
  jobId: string;
  caseName: string;
  provenance: 'CFD';
  status: CfdJobState;
  solver: string;
  coresUsed: number;
  totalIterations: number;
  finalCd: number;
  finalCl: number;
  cdStdDevLast50: number;
  isConverged: boolean;
  reliabilityTag: 'VERIFIED_CONVERGED' | 'UNRELIABLE_UNCONVERGED';
  residualsHistory: ConvergenceResiduals[];
  failureReason?: string;
  meshStats: {
    totalCells: number;
    maxNonOrthogonalityDeg: number;
    maxSkewness: number;
    checkMeshPassed: boolean;
  };
}

export class OpenFoamJobRunner {
  private static MAX_THREADS = 12; // Enforce ADR 007 & Feasibility memo CPU cap
  private static MAX_RAM_GB = 10.0; // Enforce 10GB container limit

  /**
   * Evaluate simulation convergence from residual history stream
   */
  public static evaluateConvergence(
    residuals: ConvergenceResiduals[],
    residualTolerance: number = 1e-4,
    forceStabilityTolerance: number = 0.001
  ): {
    isConverged: boolean;
    cdStdDev: number;
    meanCd: number;
    meanCl: number;
    status: CfdJobState;
    reliabilityTag: 'VERIFIED_CONVERGED' | 'UNRELIABLE_UNCONVERGED';
  } {
    if (residuals.length < 50) {
      return {
        isConverged: false,
        cdStdDev: 999,
        meanCd: residuals.length > 0 ? residuals[residuals.length - 1].cd : 0,
        meanCl: residuals.length > 0 ? residuals[residuals.length - 1].cl : 0,
        status: 'RUNNING',
        reliabilityTag: 'UNRELIABLE_UNCONVERGED'
      };
    }

    const window = residuals.slice(-50);
    const meanCd = window.reduce((acc, r) => acc + r.cd, 0) / window.length;
    const meanCl = window.reduce((acc, r) => acc + r.cl, 0) / window.length;

    const varianceCd = window.reduce((acc, r) => acc + Math.pow(r.cd - meanCd, 2), 0) / window.length;
    const cdStdDev = Math.sqrt(varianceCd);

    const last = residuals[residuals.length - 1];
    const residualsSatisfied = (
      last.p < residualTolerance * 5 &&
      last.Ux < residualTolerance &&
      last.Uy < residualTolerance &&
      last.Uz < residualTolerance &&
      last.k < residualTolerance * 2 &&
      last.omega < residualTolerance * 2
    );

    const forcesStable = cdStdDev < forceStabilityTolerance;

    const isConverged = residualsSatisfied && forcesStable;
    const status: CfdJobState = isConverged ? 'CONVERGED' : 'NOT_CONVERGED';
    const reliabilityTag = isConverged ? 'VERIFIED_CONVERGED' : 'UNRELIABLE_UNCONVERGED';

    return {
      isConverged,
      cdStdDev: Math.round(cdStdDev * 1e5) / 1e5,
      meanCd: Math.round(meanCd * 1000) / 1000,
      meanCl: Math.round(meanCl * 1000) / 1000,
      status,
      reliabilityTag
    };
  }

  /**
   * Validate and clamp job configuration parameters against safety ceilings
   */
  public static validateSandboxConfig(coresRequested: number, memoryGbRequested: number): {
    coresAllocated: number;
    memoryGbAllocated: number;
    warnings: string[];
  } {
    const warnings: string[] = [];
    let coresAllocated = coresRequested;
    let memoryGbAllocated = memoryGbRequested;

    if (coresRequested > this.MAX_THREADS) {
      coresAllocated = this.MAX_THREADS;
      warnings.push(`Cores clamped from ${coresRequested} to hardware safety limit of ${this.MAX_THREADS} threads.`);
    }

    if (memoryGbRequested > this.MAX_RAM_GB) {
      memoryGbAllocated = this.MAX_RAM_GB;
      warnings.push(`Memory allocation clamped from ${memoryGbRequested}GB to safety limit of ${this.MAX_RAM_GB}GB.`);
    }

    return { coresAllocated, memoryGbAllocated, warnings };
  }
}
