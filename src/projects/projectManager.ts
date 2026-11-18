import { ReferenceVehicleLibrary, ReferenceVehicle } from '../reference/referenceVehicleLibrary';
import { ComponentDefinition, ComponentManager } from '../geometry/components/componentManager';
import { FeatureDag } from '../geometry/parametric/featureDag';

export interface ProjectMetadata {
  id: string;
  name: string;
  schemaVersion: '2.0.0';
  createdAt: string;
  modifiedAt: string;
  lineage: {
    referenceVehicleId: string;
    parentProjectId?: string;
    forkedAt: string;
    forkReason: string;
    designerNotes?: string;
  };
}

export interface ProjectDimensions {
  overallLengthM: number;
  overallWidthM: number;
  overallHeightM: number;
  wheelbaseM: number;
  frontTrackM: number;
  rearTrackM: number;
  groundClearanceM: number;
  frontalAreaM2: number;
}

export interface SimulationResultEntry {
  runId: string;
  timestamp: string;
  provenance: 'CFD' | 'ANALYTIC' | 'ILLUSTRATIVE';
  solver: string;
  cd: number;
  cl: number;
  balancePercentFront: number;
  converged: boolean;
  notes?: string;
}

export interface ProjectRevision {
  id: string;
  projectId: string;
  timestamp: string;
  author: string;
  description: string;
  changesCount: number;
  hash: string;
  serializedBundle: string;
}

export interface VehicleProject {
  meta: ProjectMetadata;
  dimensions: ProjectDimensions;
  components: ComponentDefinition[];
  featureDag: FeatureDag;
  simulationHistory: SimulationResultEntry[];
  isDirty: boolean;
}

export class ProjectManager {
  private static projects: Map<string, VehicleProject> = new Map();

  /**
   * Fork an immutable reference vehicle into an independent, editable project
   */
  public static forkReferenceVehicle(
    referenceVehicleId: string,
    projectName: string,
    designerNotes?: string
  ): VehicleProject {
    const reference = ReferenceVehicleLibrary.getReference(referenceVehicleId);
    if (!reference) {
      throw new Error(`Cannot fork: Reference vehicle '${referenceVehicleId}' does not exist.`);
    }

    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();

    const dimensions: ProjectDimensions = {
      overallLengthM: reference.dimensions.lengthM.value,
      overallWidthM: reference.dimensions.widthM.value,
      overallHeightM: reference.dimensions.heightM.value,
      wheelbaseM: reference.dimensions.wheelbaseM.value,
      frontTrackM: reference.dimensions.frontTrackM.value,
      rearTrackM: reference.dimensions.rearTrackM.value,
      groundClearanceM: reference.dimensions.groundClearanceM.value,
      frontalAreaM2: reference.dimensions.frontalAreaM2.value
    };

    // Generate baseline components based on reference vehicle dimensions
    const baselineComponents: ComponentDefinition[] = [
      {
        id: 'body_shell',
        name: 'Monocoque Body Shell',
        semanticType: 'body_shell',
        attachmentPoints: [],
        material: { materialId: 'paint', type: 'body_paint' },
        provenance: 'photo-reconstruction',
        massEstimateKg: { value: reference.kerbWeightKg.value * 0.45, isEstimate: true },
        locked: false,
        visible: true,
        geometryHash: `hash_body_${referenceVehicleId}`,
        bounds: {
          min: [-dimensions.overallLengthM / 2, -dimensions.overallWidthM / 2, dimensions.groundClearanceM],
          max: [dimensions.overallLengthM / 2, dimensions.overallWidthM / 2, dimensions.overallHeightM]
        }
      },
      {
        id: 'front_splitter',
        name: 'Front Aerodynamic Splitter',
        semanticType: 'front_splitter',
        parentId: 'body_shell',
        attachmentPoints: [{ name: 'splitter_mount_c', anchorId: 'anc_spl', localPosition: [dimensions.overallLengthM / 2, 0, dimensions.groundClearanceM], required: true }],
        material: { materialId: 'carbon', type: 'carbon_fiber' },
        provenance: 'user-created',
        massEstimateKg: { value: 6.5, isEstimate: true },
        locked: false,
        visible: true,
        geometryHash: `hash_spl_${referenceVehicleId}`,
        bounds: {
          min: [dimensions.overallLengthM / 2 - 0.2, -dimensions.overallWidthM / 2, dimensions.groundClearanceM - 0.02],
          max: [dimensions.overallLengthM / 2 + 0.1, dimensions.overallWidthM / 2, dimensions.groundClearanceM + 0.05]
        }
      },
      {
        id: 'rear_diffuser',
        name: 'Underbody Rear Diffuser',
        semanticType: 'rear_diffuser',
        parentId: 'body_shell',
        attachmentPoints: [{ name: 'diffuser_mount_c', anchorId: 'anc_diff', localPosition: [-dimensions.overallLengthM / 2, 0, dimensions.groundClearanceM + 0.05], required: true }],
        material: { materialId: 'carbon', type: 'carbon_fiber' },
        provenance: 'user-created',
        massEstimateKg: { value: 8.0, isEstimate: true },
        locked: false,
        visible: true,
        geometryHash: `hash_diff_${referenceVehicleId}`,
        bounds: {
          min: [-dimensions.overallLengthM / 2 - 0.1, -dimensions.overallWidthM / 2 + 0.1, dimensions.groundClearanceM],
          max: [-dimensions.overallLengthM / 2 + 0.6, dimensions.overallWidthM / 2 - 0.1, dimensions.groundClearanceM + 0.25]
        }
      }
    ];

    const dag = new FeatureDag();
    dag.addFeature({
      id: 'feat_init_reference',
      type: 'DATUM_PLANE',
      name: `Baseline ${reference.manufacturer.value} ${reference.model.value}`,
      parameters: {
        referenceId: referenceVehicleId,
        lengthM: dimensions.overallLengthM,
        widthM: dimensions.overallWidthM,
        heightM: dimensions.overallHeightM
      },
      parentIds: []
    });

    const project: VehicleProject = {
      meta: {
        id: projectId,
        name: projectName,
        schemaVersion: '2.0.0',
        createdAt: now,
        modifiedAt: now,
        lineage: {
          referenceVehicleId,
          forkedAt: now,
          forkReason: 'Initial fork from immutable reference catalog',
          designerNotes
        }
      },
      dimensions,
      components: baselineComponents,
      featureDag: dag,
      simulationHistory: [],
      isDirty: false
    };

    this.projects.set(projectId, project);
    return project;
  }

  /**
   * Fork an existing project into a new design variant
   */
  public static forkProjectVariant(parentProjectId: string, variantName: string): VehicleProject {
    const parent = this.projects.get(parentProjectId);
    if (!parent) {
      throw new Error(`Parent project '${parentProjectId}' not found.`);
    }

    const newId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();

    const clonedComponents = JSON.parse(JSON.stringify(parent.components)) as ComponentDefinition[];
    const clonedDimensions = { ...parent.dimensions };

    const project: VehicleProject = {
      meta: {
        id: newId,
        name: variantName,
        schemaVersion: '2.0.0',
        createdAt: now,
        modifiedAt: now,
        lineage: {
          referenceVehicleId: parent.meta.lineage.referenceVehicleId,
          parentProjectId: parent.meta.id,
          forkedAt: now,
          forkReason: `Variant branch of ${parent.meta.name}`
        }
      },
      dimensions: clonedDimensions,
      components: clonedComponents,
      featureDag: FeatureDag.deserialize(parent.featureDag.serialize()),
      simulationHistory: [], // Variant starts fresh simulation history
      isDirty: false
    };

    this.projects.set(newId, project);
    return project;
  }

  /**
   * Get project by ID
   */
  public static getProject(id: string): VehicleProject | undefined {
    return this.projects.get(id);
  }

  /**
   * List all projects
   */
  public static listProjects(): VehicleProject[] {
    return Array.from(this.projects.values());
  }

  /**
   * Save / update a project
   */
  public static saveProject(project: VehicleProject): void {
    project.meta.modifiedAt = new Date().toISOString();
    project.isDirty = false;
    this.projects.set(project.meta.id, project);
  }

  /**
   * Serialize project to bundle
   */
  public static exportProjectBundle(project: VehicleProject): string {
    const bundle = {
      'project.json': {
        id: project.meta.id,
        name: project.meta.name,
        schemaVersion: project.meta.schemaVersion,
        createdAt: project.meta.createdAt,
        modifiedAt: project.meta.modifiedAt,
        lineage: project.meta.lineage
      },
      'dimensions.json': project.dimensions,
      'components.json': project.components,
      'history.json': project.featureDag.serialize(),
      'simulations.json': project.simulationHistory
    };
    return JSON.stringify(bundle, null, 2);
  }

  private static revisions: Map<string, ProjectRevision[]> = new Map();

  /**
   * Create an append-only immutable snapshot revision of a project
   */
  public static createRevision(
    projectId: string,
    description: string,
    author: string = 'Engineer'
  ): ProjectRevision {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project '${projectId}' not found.`);
    }
    const serialized = this.exportProjectBundle(project);
    const revId = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const revList = this.revisions.get(projectId) || [];

    let hashVal = 0x811c9dc5;
    for (let i = 0; i < serialized.length; i++) {
      hashVal ^= serialized.charCodeAt(i);
      hashVal = (hashVal * 0x01000193) >>> 0;
    }
    const hash = hashVal.toString(16).padStart(8, '0');

    const revision: ProjectRevision = {
      id: revId,
      projectId,
      timestamp: new Date().toISOString(),
      author,
      description,
      changesCount: project.featureDag.getAllFeatures().length,
      hash,
      serializedBundle: serialized
    };

    revList.push(revision);
    this.revisions.set(projectId, revList);
    return revision;
  }

  /**
   * Retrieve all revisions for a project
   */
  public static getRevisions(projectId: string): ProjectRevision[] {
    return this.revisions.get(projectId) || [];
  }
}
