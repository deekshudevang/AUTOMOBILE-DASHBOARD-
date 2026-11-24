import * as THREE from 'three';
import { ChassisArchetype, CoachworkDimensions, GeometryNodeMetadata } from '../types';
import { RearEngineCoupeGenerator } from './rearEngineCoupeGenerator';
import { MidEngineSupercarGenerator } from './midEngineSupercarGenerator';
import { MidEngineHypercarGenerator } from './midEngineHypercarGenerator';
import { FrontEngineGtGenerator } from './frontEngineGtGenerator';
import { getBrandDesignLanguage, BrandDesignLanguage } from '../../vehicles/brandDesign';

export interface ArchetypeBuildResult {
  group: THREE.Group;
  nodes: GeometryNodeMetadata[];
}

export class ArchetypeRegistry {
  /**
   * Dispatches chassis and panel construction to the authentic styling archetype generator
   * based on the vehicle identity and brand design language.
   */
  public static buildChassis(
    archetype: ChassisArchetype | string,
    dims: CoachworkDimensions,
    materials: Record<string, THREE.Material>,
    shutLineGapM = 0.0025,
    vehicleId?: string
  ): ArchetypeBuildResult {
    const vId = (vehicleId || '').toLowerCase();
    const brand = getBrandDesignLanguage(vId, archetype as string);

    // Dispatch by Brand Design Language Silhouette Family
    switch (brand.silhouetteFamily) {
      case 'rear_engine_flyline':
        return RearEngineCoupeGenerator.build(dims, materials, shutLineGapM, brand);

      case 'wedge_monovolume':
      case 'low_hypercar_teardrop':
        return MidEngineHypercarGenerator.build(dims, materials, shutLineGapM, brand);

      case 'flowing_mid_engine':
        return MidEngineSupercarGenerator.build(dims, materials, shutLineGapM, brand);

      case 'long_hood_short_deck':
      case 'cab_backward_gt':
      default:
        // Direct vehicle identity check for mid-engine vs front-engine
        if (
          vId.includes('pista') ||
          vId.includes('ferrari') ||
          vId.includes('488') ||
          vId.includes('f8') ||
          vId.includes('720s') ||
          vId.includes('mclaren') ||
          vId.includes('corvette')
        ) {
          return MidEngineSupercarGenerator.build(dims, materials, shutLineGapM, brand);
        }
        if (
          vId.includes('svj') ||
          vId.includes('aventador') ||
          vId.includes('huracan') ||
          vId.includes('lamborghini') ||
          vId.includes('chiron') ||
          vId.includes('jesko') ||
          vId.includes('valkyrie') ||
          vId.includes('pagani')
        ) {
          return MidEngineHypercarGenerator.build(dims, materials, shutLineGapM, brand);
        }
        if (vId.includes('911') || vId.includes('gt3') || vId.includes('porsche')) {
          return RearEngineCoupeGenerator.build(dims, materials, shutLineGapM, brand);
        }

        return FrontEngineGtGenerator.build(dims, materials, shutLineGapM, brand);
    }
  }
}
