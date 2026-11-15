import {
  VehicleGeometryDefinition,
  ChassisArchetype,
  FidelityTier,
  CoachworkDimensions,
  WheelAssemblySpec,
  MaterialDefinition
} from '../types';

export class SchemaV2Migrator {
  /**
   * Detects the vehicle data schema version and format
   */
  public static detectFormat(raw: any): 'schema_v2' | 'schema_v1_parametric' | 'cherax_legacy' | 'unknown' {
    if (!raw || typeof raw !== 'object') return 'unknown';

    if (raw.schemaVersion === 2 || raw.schemaVersion === '2.0' || raw.schemaVersion === '2.0.0') {
      return 'schema_v2';
    }

    if (
      raw.$schema?.includes('parametric') ||
      raw.schema_version === '1.0.0' ||
      raw.asset_type === 'parametric_vehicle_geometry'
    ) {
      return 'schema_v1_parametric';
    }

    if (raw.format === 'Cherax Entity' || raw.mods !== undefined) {
      return 'cherax_legacy';
    }

    if (raw.vehicle && raw.dimensions) {
      return 'schema_v2';
    }

    return 'unknown';
  }

  /**
   * Migrates any vehicle format cleanly into a complete, normalized VehicleGeometryDefinition
   */
  public static migrate(raw: any, fallbackId = 'unnamed_vehicle'): VehicleGeometryDefinition {
    const format = this.detectFormat(raw);

    switch (format) {
      case 'schema_v2':
        return this.migrateFromSchemaV2(raw, fallbackId);
      case 'schema_v1_parametric':
        return this.migrateFromSchemaV1Parametric(raw, fallbackId);
      case 'cherax_legacy':
        return this.migrateFromCherax(raw, fallbackId);
      case 'unknown':
      default:
        return this.createFallbackDefinition(raw, fallbackId);
    }
  }

  private static migrateFromSchemaV2(raw: any, fallbackId: string): VehicleGeometryDefinition {
    const vehicle = raw.vehicle || {};
    const dims = raw.dimensions || {};
    const id = vehicle.id || fallbackId;

    const dimensions: CoachworkDimensions = {
      overall_length_m: Number(dims.length ?? dims.overall_length_m ?? 4.5),
      overall_width_m: Number(dims.width ?? dims.overall_width_m ?? 1.9),
      overall_height_m: Number(dims.height ?? dims.overall_height_m ?? 1.3),
      wheelbase_m: Number(dims.wheelbase ?? dims.wheelbase_m ?? 2.5),
      front_track_m: Number(dims.frontTrack ?? dims.front_track_m ?? 1.6),
      rear_track_m: Number(dims.rearTrack ?? dims.rear_track_m ?? 1.6),
      ground_clearance_m: Number(dims.groundClearance ?? dims.ground_clearance_m ?? 0.1)
    };

    const archetype = this.mapToArchetype(vehicle.category || vehicle.bodyStyle || '');

    const frontWheel: WheelAssemblySpec = {
      rimDiameterInches: raw.wheels?.front?.rimDiameterInches ?? 20,
      rimWidthInches: raw.wheels?.front?.rimWidthInches ?? 9.5,
      nominalSectionWidthMm: raw.wheels?.front?.nominalSectionWidthMm ?? 265,
      aspectRatio: raw.wheels?.front?.aspectRatio ?? 35,
      offsetMm: raw.wheels?.front?.offsetMm ?? 40,
      spokeStyle: raw.wheels?.front?.spokeStyle ?? 'center_lock_y_spoke',
      finish: raw.wheels?.front?.finish ?? 'satin_black',
      brakeDiscType: raw.wheels?.front?.brakeDiscType ?? 'carbon_ceramic',
      caliperColor: raw.wheels?.front?.caliperColor ?? '#00F0FF'
    };

    const rearWheel: WheelAssemblySpec = {
      rimDiameterInches: raw.wheels?.rear?.rimDiameterInches ?? 21,
      rimWidthInches: raw.wheels?.rear?.rimWidthInches ?? 12.0,
      nominalSectionWidthMm: raw.wheels?.rear?.nominalSectionWidthMm ?? 325,
      aspectRatio: raw.wheels?.rear?.aspectRatio ?? 30,
      offsetMm: raw.wheels?.rear?.offsetMm ?? 45,
      spokeStyle: raw.wheels?.rear?.spokeStyle ?? 'center_lock_y_spoke',
      finish: raw.wheels?.rear?.finish ?? 'satin_black',
      brakeDiscType: raw.wheels?.rear?.brakeDiscType ?? 'carbon_ceramic',
      caliperColor: raw.wheels?.rear?.caliperColor ?? '#00F0FF'
    };

    return {
      schemaVersion: 2,
      meta: {
        id,
        manufacturer: vehicle.manufacturer || 'AutoVerse',
        model: vehicle.model || id,
        generation: vehicle.generation || '',
        year: Number(vehicle.year || 2024),
        archetype,
        provenanceLevel: 'derived'
      },
      geometry: {
        generatorId: 'coachwork_generator_v2',
        generatorVersion: '2.0.0',
        fidelityTier: 'Tier B – Spec-accurate',
        units: 'meters',
        origin: 'ground_center',
        dimensions
      },
      reference: {
        specs: {
          overall_length_m: { value: dimensions.overall_length_m, provenance: 'derived' },
          wheelbase_m: { value: dimensions.wheelbase_m, provenance: 'derived' }
        }
      },
      wheels: {
        front: frontWheel,
        rear: rearWheel
      },
      materials: {
        body_paint: {
          type: 'clearcoat_paint',
          color: raw.renderSettings?.defaultPaintColor || '#00E5FF',
          roughness: 0.18,
          metalness: 0.35,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04
        }
      },
      shutLineGapMm: 3
    };
  }

  private static migrateFromSchemaV1Parametric(raw: any, fallbackId: string): VehicleGeometryDefinition {
    const vehicle = raw.vehicle || {};
    const dims = raw.dimensions || {};
    const id = raw.asset_id || fallbackId;
    const refSpec = raw.geometry_provenance?.reference_specification;

    const dimensions: CoachworkDimensions = {
      overall_length_m: Number(dims.overall_length_m ?? 4.5),
      overall_width_m: Number(dims.body_width_without_mirrors_m ?? dims.overall_width_with_mirrors_m ?? 1.9),
      overall_height_m: Number(dims.overall_height_m ?? 1.3),
      wheelbase_m: Number(dims.wheelbase_m ?? 2.5),
      front_track_m: Number(dims.front_track_m ?? 1.6),
      rear_track_m: Number(dims.rear_track_m ?? 1.6),
      ground_clearance_m: Number(dims.ground_clearance_unladen_m ?? 0.1)
    };

    const frontTire = raw.running_gear?.wheels_and_tires?.front;
    const rearTire = raw.running_gear?.wheels_and_tires?.rear;

    const frontWheel: WheelAssemblySpec = {
      rimDiameterInches: frontTire?.wheel_diameter_inches ?? 20,
      rimWidthInches: frontTire?.wheel_width_inches ?? 9.5,
      nominalSectionWidthMm: frontTire?.tire_section_width_mm ?? 275,
      aspectRatio: frontTire?.tire_aspect_ratio ?? 35,
      offsetMm: 42,
      spokeStyle: 'center_lock_y_spoke',
      finish: 'satin_black',
      brakeDiscType: 'carbon_ceramic',
      caliperColor: '#00F0FF'
    };

    const rearWheel: WheelAssemblySpec = {
      rimDiameterInches: rearTire?.wheel_diameter_inches ?? 21,
      rimWidthInches: rearTire?.wheel_width_inches ?? 12.0,
      nominalSectionWidthMm: rearTire?.tire_section_width_mm ?? 335,
      aspectRatio: rearTire?.tire_aspect_ratio ?? 30,
      offsetMm: 45,
      spokeStyle: 'center_lock_y_spoke',
      finish: 'satin_black',
      brakeDiscType: 'carbon_ceramic',
      caliperColor: '#00F0FF'
    };

    const sourceName = refSpec?.publisher || 'Official Technical Document';

    return {
      schemaVersion: 2,
      meta: {
        id,
        manufacturer: vehicle.manufacturer || vehicle.make || 'AutoVerse',
        model: vehicle.model || id,
        generation: vehicle.generation || '',
        year: Number(vehicle.model_year_reference || 2023),
        archetype: this.mapToArchetype(vehicle.body_style || ''),
        provenanceLevel: 'verified'
      },
      geometry: {
        generatorId: 'coachwork_generator_v2',
        generatorVersion: '2.0.0',
        fidelityTier: 'Tier B – Spec-accurate',
        units: 'meters',
        origin: 'ground_center',
        dimensions
      },
      reference: {
        specs: {
          overall_length_m: { value: dimensions.overall_length_m, provenance: 'verified', source: sourceName, sourceUrl: refSpec?.url },
          wheelbase_m: { value: dimensions.wheelbase_m, provenance: 'verified', source: sourceName, sourceUrl: refSpec?.url }
        }
      },
      wheels: {
        front: frontWheel,
        rear: rearWheel
      },
      materials: {
        body_paint: {
          type: 'clearcoat_paint',
          color: '#B2B9C2',
          roughness: 0.18,
          metalness: 0.35,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04
        }
      },
      shutLineGapMm: 3
    };
  }

  private static migrateFromCherax(raw: any, fallbackId: string): VehicleGeometryDefinition {
    const cleanId = fallbackId.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const manufacturer = cleanId.includes('porsche') ? 'Porsche'
      : cleanId.includes('lamborghini') ? 'Lamborghini'
      : cleanId.includes('audi') ? 'Audi'
      : cleanId.includes('ferrari') ? 'Ferrari'
      : 'Custom Automotive';

    const dimensions: CoachworkDimensions = {
      overall_length_m: 4.520,
      overall_width_m: 1.910,
      overall_height_m: 1.280,
      wheelbase_m: 2.500,
      front_track_m: 1.620,
      rear_track_m: 1.600,
      ground_clearance_m: 0.105
    };

    return {
      schemaVersion: 2,
      meta: {
        id: cleanId,
        manufacturer,
        model: fallbackId,
        year: 2020,
        archetype: 'front_engine_gt_coupe',
        provenanceLevel: 'unverified'
      },
      geometry: {
        generatorId: 'coachwork_generator_v2',
        generatorVersion: '2.0.0',
        fidelityTier: 'Tier C – Approximate',
        units: 'meters',
        origin: 'ground_center',
        dimensions
      },
      reference: {
        specs: {
          overall_length_m: { value: dimensions.overall_length_m, provenance: 'estimated' }
        }
      },
      wheels: {
        front: {
          rimDiameterInches: 20,
          rimWidthInches: 9.5,
          nominalSectionWidthMm: 255,
          aspectRatio: 35,
          offsetMm: 38,
          spokeStyle: '5_spoke',
          finish: 'satin_black',
          brakeDiscType: 'drilled_steel',
          caliperColor: '#FF2A6D'
        },
        rear: {
          rimDiameterInches: 20,
          rimWidthInches: 10.5,
          nominalSectionWidthMm: 295,
          aspectRatio: 30,
          offsetMm: 40,
          spokeStyle: '5_spoke',
          finish: 'satin_black',
          brakeDiscType: 'drilled_steel',
          caliperColor: '#FF2A6D'
        }
      },
      materials: {
        body_paint: {
          type: 'clearcoat_paint',
          color: '#FF2A6D',
          roughness: 0.22,
          metalness: 0.40,
          clearcoat: 0.8
        }
      },
      shutLineGapMm: 3
    };
  }

  private static createFallbackDefinition(raw: any, fallbackId: string): VehicleGeometryDefinition {
    const id = (raw && raw.id) || fallbackId;
    const dimensions: CoachworkDimensions = {
      overall_length_m: 4.500,
      overall_width_m: 1.900,
      overall_height_m: 1.300,
      wheelbase_m: 2.500,
      front_track_m: 1.600,
      rear_track_m: 1.600,
      ground_clearance_m: 0.100
    };

    return {
      schemaVersion: 2,
      meta: {
        id,
        manufacturer: 'AutoVerse',
        model: id,
        year: 2024,
        archetype: 'front_engine_gt_coupe',
        provenanceLevel: 'unverified'
      },
      geometry: {
        generatorId: 'coachwork_generator_v2',
        generatorVersion: '2.0.0',
        fidelityTier: 'Tier C – Approximate',
        units: 'meters',
        origin: 'ground_center',
        dimensions
      },
      reference: {
        specs: {}
      },
      wheels: {
        front: {
          rimDiameterInches: 19,
          rimWidthInches: 9.0,
          nominalSectionWidthMm: 245,
          aspectRatio: 40,
          offsetMm: 35,
          spokeStyle: '5_spoke',
          finish: 'satin_black',
          brakeDiscType: 'drilled_steel',
          caliperColor: '#00F0FF'
        },
        rear: {
          rimDiameterInches: 19,
          rimWidthInches: 9.5,
          nominalSectionWidthMm: 275,
          aspectRatio: 35,
          offsetMm: 38,
          spokeStyle: '5_spoke',
          finish: 'satin_black',
          brakeDiscType: 'drilled_steel',
          caliperColor: '#00F0FF'
        }
      },
      materials: {
        body_paint: {
          type: 'clearcoat_paint',
          color: '#00E5FF',
          roughness: 0.2,
          metalness: 0.3,
          clearcoat: 1.0
        }
      },
      shutLineGapMm: 3
    };
  }

  private static mapToArchetype(str: string): ChassisArchetype {
    const s = str.toLowerCase();
    if (s.includes('rear-engine') || s.includes('rear_engine') || s.includes('911')) {
      return 'rear_engine_coupe';
    }
    if (s.includes('hypercar') || s.includes('chiron') || s.includes('jesko') || s.includes('valkyrie') || s.includes('svj')) {
      return 'mid_engine_hypercar';
    }
    if (s.includes('mid-engine') || s.includes('mid_engine') || s.includes('supercar') || s.includes('pista') || s.includes('ferrari')) {
      return 'mid_engine_supercar';
    }
    if (s.includes('sedan') || s.includes('saloon')) {
      return 'luxury_super_sedan';
    }
    if (s.includes('suv') || s.includes('crossover')) {
      return 'super_suv_crossover';
    }
    if (s.includes('muscle')) {
      return 'front_engine_gt_coupe';
    }
    if (s.includes('tuner') || s.includes('jdm') || s.includes('drift')) {
      return 'jdm_tuner_performance';
    }
    if (s.includes('prototype') || s.includes('gt3') || s.includes('cup') || s.includes('track')) {
      return 'track_special_prototype';
    }
    return 'front_engine_gt_coupe';
  }
}
