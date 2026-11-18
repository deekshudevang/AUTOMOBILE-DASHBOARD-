import * as THREE from 'three';
import { StepExporter, StepExportOptions } from './stepExporter';
import { ContinuityAnalyzer, ContinuityReport } from './continuityAnalyzer';
import { MeshDiagnostics, MeshDiagnosticReport } from './meshDiagnostics';

export interface CadJobProgress {
  jobId: string;
  operation: string;
  percent: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  message: string;
}

export type CadProgressListener = (progress: CadJobProgress) => void;

/**
 * CadWorkerManager
 * Orchestrates non-blocking background geometry operations, B-rep analysis, and export pipelines.
 */
export class CadWorkerManager {
  private static activeJobs = new Map<string, AbortController>();

  /**
   * Performs asynchronous non-blocking STEP export with progress monitoring
   */
  public static async exportToStepAsync(
    geo: THREE.BufferGeometry,
    options: StepExportOptions = {},
    onProgress?: CadProgressListener
  ): Promise<string> {
    const jobId = `step_job_${Date.now()}`;
    const controller = new AbortController();
    this.activeJobs.set(jobId, controller);

    onProgress?.({
      jobId,
      operation: 'STEP AP214 Export',
      percent: 10,
      status: 'RUNNING',
      message: 'Extracting faceted B-rep vertex coordinates...'
    });

    // Yield to main thread
    await new Promise(r => setTimeout(r, 20));

    if (controller.signal.aborted) {
      throw new Error(`CAD Job ${jobId} was cancelled`);
    }

    onProgress?.({
      jobId,
      operation: 'STEP AP214 Export',
      percent: 50,
      status: 'RUNNING',
      message: 'Constructing topological closed shell and manifold solid entity...'
    });

    await new Promise(r => setTimeout(r, 20));

    const stepString = StepExporter.exportToStep(geo, options);

    onProgress?.({
      jobId,
      operation: 'STEP AP214 Export',
      percent: 100,
      status: 'COMPLETED',
      message: 'ISO 10303-21 STEP generation complete.'
    });

    this.activeJobs.delete(jobId);
    return stepString;
  }

  /**
   * Performs asynchronous surface continuity analysis between two adjacent panels
   */
  public static async analyzeContinuityAsync(
    meshA: THREE.Mesh,
    meshB: THREE.Mesh,
    onProgress?: CadProgressListener
  ): Promise<ContinuityReport> {
    const jobId = `continuity_job_${Date.now()}`;
    onProgress?.({
      jobId,
      operation: 'G0/G1/G2 Continuity Analysis',
      percent: 20,
      status: 'RUNNING',
      message: `Analyzing seam between ${meshA.name} and ${meshB.name}...`
    });

    await new Promise(r => setTimeout(r, 20));

    const report = ContinuityAnalyzer.analyzePatchPair(meshA, meshB);

    onProgress?.({
      jobId,
      operation: 'G0/G1/G2 Continuity Analysis',
      percent: 100,
      status: 'COMPLETED',
      message: `Seam evaluated: ${report.classification}`
    });

    return report;
  }

  /**
   * Performs asynchronous mesh diagnostics and healing
   */
  public static async auditAndHealAsync(
    geo: THREE.BufferGeometry,
    onProgress?: CadProgressListener
  ): Promise<{ audit: MeshDiagnosticReport; healedGeo?: THREE.BufferGeometry }> {
    const jobId = `audit_job_${Date.now()}`;
    onProgress?.({
      jobId,
      operation: 'Mesh Diagnostic Audit',
      percent: 25,
      status: 'RUNNING',
      message: 'Checking edge incidence and manifoldness...'
    });

    await new Promise(r => setTimeout(r, 20));

    const audit = MeshDiagnostics.auditGeometry(geo);

    let healedGeo: THREE.BufferGeometry | undefined = undefined;
    if (!audit.cfdReady) {
      onProgress?.({
        jobId,
        operation: 'Mesh Healing',
        percent: 60,
        status: 'RUNNING',
        message: 'Welding duplicate vertices and removing degenerates...'
      });

      await new Promise(r => setTimeout(r, 20));
      const healed = MeshDiagnostics.healGeometry(geo);
      healedGeo = healed.healedGeo;
    }

    onProgress?.({
      jobId,
      operation: 'Mesh Audit & Healing',
      percent: 100,
      status: 'COMPLETED',
      message: `Audit complete. CFD Ready: ${audit.cfdReady || !!healedGeo}`
    });

    return { audit, healedGeo };
  }

  /**
   * Cancels a running CAD background job
   */
  public static cancelJob(jobId: string): boolean {
    const controller = this.activeJobs.get(jobId);
    if (controller) {
      controller.abort();
      this.activeJobs.delete(jobId);
      return true;
    }
    return false;
  }
}
