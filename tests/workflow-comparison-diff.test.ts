import { describe, it, expect } from 'vitest';
import { ProjectManager, SimulationResultEntry } from '../src/projects/projectManager';
import { VehicleDevelopmentWorkflow } from '../src/workflow/vehicleDevelopmentWorkflow';
import {
  EngineeringComparisonDiff,
  NonEquivalentConditionError
} from '../src/workflow/engineeringComparisonDiff';

describe('AutoVerse 3D — Development Workflow & Engineering Comparison Diff Suite (Phase 13)', () => {
  it('manages non-linear workflow stage progression and variant branching', () => {
    const proj = ProjectManager.forkReferenceVehicle('porsche_911_gt3_rs_992', 'Workflow Test Proj');
    const workflow = new VehicleDevelopmentWorkflow(proj);

    expect(workflow.getCurrentStage()).toBe('SELECT_REFERENCE');

    // Sequential progression
    workflow.nextStage();
    expect(workflow.getCurrentStage()).toBe('FORK_PROJECT');

    // Non-linear navigation
    workflow.navigateTo('AERO_DEVELOPMENT');
    expect(workflow.getCurrentStage()).toBe('AERO_DEVELOPMENT');

    // Branching variant
    const variantWorkflow = workflow.createVariantBranch('Le Mans Low-Drag Spec');
    expect(variantWorkflow.getProject().meta.name).toBe('Le Mans Low-Drag Spec');
    expect(variantWorkflow.getProject().meta.lineage.parentProjectId).toBe(proj.meta.id);
  });

  it('computes dimensional deltas, component modifications, and mass changes', () => {
    const baseline = ProjectManager.forkReferenceVehicle('porsche_911_gt3_rs_992', 'Base 992');
    const modified = ProjectManager.forkProjectVariant(baseline.meta.id, 'Widebody 992');

    // Modify width and add carbon wing
    modified.dimensions.overallWidthM = 2.050; // +0.150m wider
    modified.components.push({
      id: 'carbon_endplates',
      name: 'Carbon Endplates',
      semanticType: 'rear_wing',
      attachmentPoints: [],
      material: { materialId: 'c', type: 'carbon_fiber' },
      provenance: 'user-created',
      massEstimateKg: { value: 1.8, isEstimate: true },
      locked: false,
      visible: true,
      geometryHash: 'hash_ep'
    });

    const report = EngineeringComparisonDiff.compareProjects(baseline, modified);
    expect(report.dimensionalDiffs.length).toBe(6);

    const widthDiff = report.dimensionalDiffs.find(d => d.param === 'Overall Width');
    expect(widthDiff?.delta).toBeCloseTo(0.150);

    expect(report.componentDiff.added).toContain('carbon_endplates');
    expect(report.massDeltaKg).toBeCloseTo(1.8);
  });

  it('enforces simulation equivalence guard rules and rejects non-equivalent comparison conditions', () => {
    const baseline = ProjectManager.forkReferenceVehicle('porsche_911_gt3_rs_992', 'Base 992');
    const modified = ProjectManager.forkProjectVariant(baseline.meta.id, 'Mod 992');

    const simA: SimulationResultEntry = {
      runId: 'RUN_001',
      timestamp: new Date().toISOString(),
      provenance: 'CFD',
      solver: 'OpenFOAM v2406 (simpleFoam)',
      cd: 0.320,
      cl: -0.450,
      balancePercentFront: 42,
      converged: true
    };

    // Different solver
    const simBDifferentSolver: SimulationResultEntry = {
      ...simA,
      runId: 'RUN_002',
      solver: 'ANSYS Fluent v2023' // Different solver
    };

    expect(() =>
      EngineeringComparisonDiff.compareProjects(baseline, modified, simA, simBDifferentSolver)
    ).toThrow(NonEquivalentConditionError);

    // Unconverged run
    const simBUnconverged: SimulationResultEntry = {
      ...simA,
      runId: 'RUN_003',
      converged: false
    };

    expect(() =>
      EngineeringComparisonDiff.compareProjects(baseline, modified, simA, simBUnconverged)
    ).toThrow(NonEquivalentConditionError);
  });

  it('evaluates statistically significant aerodynamic deltas and generates reproducible report', () => {
    const baseline = ProjectManager.forkReferenceVehicle('porsche_911_gt3_rs_992', 'Base 992');
    const modified = ProjectManager.forkProjectVariant(baseline.meta.id, 'Mod 992');

    const simA: SimulationResultEntry = {
      runId: 'RUN_BASE',
      timestamp: new Date().toISOString(),
      provenance: 'CFD',
      solver: 'OpenFOAM v2406 (simpleFoam)',
      cd: 0.325,
      cl: -0.400,
      balancePercentFront: 40,
      converged: true
    };

    // Modified has wing angle reduced -> less drag (-0.020), less downforce
    const simB: SimulationResultEntry = {
      runId: 'RUN_MOD',
      timestamp: new Date().toISOString(),
      provenance: 'CFD',
      solver: 'OpenFOAM v2406 (simpleFoam)',
      cd: 0.305, // Delta = -0.020 (exceeds 0.003 noise threshold)
      cl: -0.320,
      balancePercentFront: 44,
      converged: true
    };

    const diff = EngineeringComparisonDiff.compareProjects(baseline, modified, simA, simB);
    expect(diff.aeroDiff).toBeDefined();
    expect(diff.aeroDiff?.deltaCd).toBeCloseTo(-0.020);
    expect(diff.aeroDiff?.isImprovementSignificant).toBe(true);
    expect(diff.aeroDiff?.comparisonVerdict).toContain('drag reduction');

    const mdReport = EngineeringComparisonDiff.generateMarkdownReport(diff, 'Baseline 992', 'Low-Drag 992');
    expect(mdReport).toContain('# AutoVerse 3D — Engineering Comparison & Verification Report');
    expect(mdReport).toContain('Drag Coeff ($C_d$)');
    expect(mdReport).toContain('Honesty & Provenance Disclosure');
  });
});
