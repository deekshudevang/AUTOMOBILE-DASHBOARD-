import { VehicleProject, ProjectManager } from '../projects/projectManager';

export type WorkflowStage =
  | 'SELECT_REFERENCE'
  | 'FORK_PROJECT'
  | 'PARAMETRIC_DIMENSIONS'
  | 'BODY_STYLING'
  | 'AERO_DEVELOPMENT'
  | 'PACKAGING_VALIDATION'
  | 'CFD_SIMULATION'
  | 'COMPARISON'
  | 'EXPORT';

export interface WorkflowStageState {
  stage: WorkflowStage;
  title: string;
  isComplete: boolean;
  canNavigateTo: boolean;
  notes?: string;
}

export class VehicleDevelopmentWorkflow {
  private currentStageIndex: number = 0;
  private project: VehicleProject;

  public static readonly STAGES: { stage: WorkflowStage; title: string }[] = [
    { stage: 'SELECT_REFERENCE', title: '1. Select Reference Vehicle' },
    { stage: 'FORK_PROJECT', title: '2. Fork Independent Project' },
    { stage: 'PARAMETRIC_DIMENSIONS', title: '3. Dimension & Constraint Solver' },
    { stage: 'BODY_STYLING', title: '4. Class-A Surfacing & Panelization' },
    { stage: 'AERO_DEVELOPMENT', title: '5. Aerodynamic Component Library' },
    { stage: 'PACKAGING_VALIDATION', title: '6. Suspension & Packaging Checks' },
    { stage: 'CFD_SIMULATION', title: '7. OpenFOAM CFD Simulation' },
    { stage: 'COMPARISON', title: '8. Engineering Comparison Diff' },
    { stage: 'EXPORT', title: '9. STEP / STL / Report Export' }
  ];

  constructor(project: VehicleProject) {
    this.project = project;
  }

  public getCurrentStage(): WorkflowStage {
    return VehicleDevelopmentWorkflow.STAGES[this.currentStageIndex].stage;
  }

  public getCurrentStageIndex(): number {
    return this.currentStageIndex;
  }

  public getStagesOverview(): WorkflowStageState[] {
    return VehicleDevelopmentWorkflow.STAGES.map((s, idx) => ({
      stage: s.stage,
      title: s.title,
      isComplete: idx < this.currentStageIndex,
      canNavigateTo: true // Allow non-linear jumping
    }));
  }

  /**
   * Jump to specific workflow stage (non-linear support)
   */
  public navigateTo(stage: WorkflowStage): void {
    const idx = VehicleDevelopmentWorkflow.STAGES.findIndex(s => s.stage === stage);
    if (idx === -1) throw new Error(`Invalid workflow stage: ${stage}`);
    this.currentStageIndex = idx;
  }

  /**
   * Advance to next stage
   */
  public nextStage(): WorkflowStage {
    if (this.currentStageIndex < VehicleDevelopmentWorkflow.STAGES.length - 1) {
      this.currentStageIndex++;
    }
    return this.getCurrentStage();
  }

  /**
   * Go back to previous stage
   */
  public previousStage(): WorkflowStage {
    if (this.currentStageIndex > 0) {
      this.currentStageIndex--;
    }
    return this.getCurrentStage();
  }

  /**
   * Branch a sibling design variant from current workflow state
   */
  public createVariantBranch(variantName: string): VehicleDevelopmentWorkflow {
    const variantProj = ProjectManager.forkProjectVariant(this.project.meta.id, variantName);
    return new VehicleDevelopmentWorkflow(variantProj);
  }

  public getProject(): VehicleProject {
    return this.project;
  }
}
