import * as THREE from 'three';
import { ChassisArchetype, CoachworkDimensions, GeometryNodeMetadata } from '../types';
import { RearEngineCoupeGenerator } from './rearEngineCoupeGenerator';
import { MidEngineSupercarGenerator } from './midEngineSupercarGenerator';
import { MidEngineHypercarGenerator } from './midEngineHypercarGenerator';
import { FrontEngineGtGenerator } from './frontEngineGtGenerator';

export interface ArchetypeBuildResult {
  group: THREE.Group;
  nodes: GeometryNodeMetadata[];
}

export class ArchetypeRegistry {
  /**
   * Dispatches chassis and panel construction to the authentic styling archetype generator
   */
  public static buildChassis(
    archetype: ChassisArchetype | string,
    dims: CoachworkDimensions,
    materials: Record<string, THREE.Material>,
    shutLineGapM = 0.0025,
    vehicleId?: string
  ): ArchetypeBuildResult {
    const arch = (archetype || '').toLowerCase();
    const vId = (vehicleId || '').toLowerCase();

    // 1. Direct Vehicle Identity Specificity (Overrides generic category if needed)
    if (vId.includes('pista') || vId.includes('ferrari') || vId.includes('488') || vId.includes('f8') || vId.includes('720s')) {
      return MidEngineSupercarGenerator.build(dims, materials, shutLineGapM);
    }

    if (vId.includes('svj') || vId.includes('aventador') || vId.includes('chiron') || vId.includes('jesko') || vId.includes('valkyrie') || vId.includes('pagani') || vId.includes('huayra')) {
      return MidEngineHypercarGenerator.build(dims, materials, shutLineGapM);
    }

    if (vId.includes('911') || vId.includes('gt3') || vId.includes('porsche')) {
      return RearEngineCoupeGenerator.build(dims, materials, shutLineGapM);
    }

    // 2. Chassis Archetype Dispatch
    switch (arch) {
      case 'mid_engine_supercar':
        return MidEngineSupercarGenerator.build(dims, materials, shutLineGapM);

      case 'mid_engine_hypercar':
        return MidEngineHypercarGenerator.build(dims, materials, shutLineGapM);

      case 'rear_engine_coupe':
        return RearEngineCoupeGenerator.build(dims, materials, shutLineGapM);

      case 'front_engine_gt_coupe':
      case 'front_engine_sports_car':
      case 'jdm_tuner_performance':
      case 'luxury_super_sedan':
      case 'super_suv_crossover':
      default:
        return FrontEngineGtGenerator.build(dims, materials, shutLineGapM);
    }
  }
}
