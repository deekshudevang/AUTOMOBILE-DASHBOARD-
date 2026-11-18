import * as THREE from 'three';
import { CoachworkDimensions, GeometryNodeMetadata } from '../types';
import { ArchetypeRegistry, ArchetypeBuildResult } from '../archetypes/archetypeRegistry';

export interface PanelBuildResult {
  group: THREE.Group;
  nodes: GeometryNodeMetadata[];
}

export class PanelCutter {
  /**
   * Builds genuine, authentic, continuous curved automotive panels meeting along 2-3mm shut lines
   * using a Continuous Watertight Envelope Architecture dispatched by styling archetype.
   */
  public static buildComponentAssembly(
    dims: CoachworkDimensions,
    materials: Record<string, THREE.Material>,
    archetype: string,
    shutLineGapM = 0.0025,
    vehicleId?: string
  ): PanelBuildResult {
    return ArchetypeRegistry.buildChassis(archetype, dims, materials, shutLineGapM, vehicleId);
  }
}
