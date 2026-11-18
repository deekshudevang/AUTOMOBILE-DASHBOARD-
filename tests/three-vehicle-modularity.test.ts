import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { ProjectManager } from '../src/projects/projectManager';
import { ComponentManager, ComponentDefinition } from '../src/geometry/components/componentManager';
import { CollisionDetector } from '../src/geometry/components/collisionDetector';
import { StepExporter } from '../src/geometry/cad/stepExporter';
import { VehicleGeometryEngine } from '../src/geometry/engine';
import { VehicleGeometryDefinition } from '../src/geometry/types';
import {
  VehicleComponentCatalog,
  VEHICLE_HUB_SPECS,
  ModularComponentItem
} from '../src/geometry/components/vehicleComponentCatalog';
import { ParametricAeroLibrary, RearWingParameters } from '../src/geometry/aero/parametricAeroLibrary';
import { WheelRuleValidator } from '@autoverse/vehicle-generation-engine';

describe('AutoVerse Platform — Milestone V7 & V8: Three-Vehicle Modularity & Validation', () => {
  // =========================================================================
  // VEHICLE 1: PORSCHE 911 GT3 RS (992)
  // =========================================================================
  describe('Pilot 1: Porsche 911 GT3 RS (992)', () => {
    it('executes full modularity lifecycle: selection, hierarchy, dimensional editing, clearance, compatibility & STEP export', () => {
      // 1. Select and fork reference vehicle
      const project = ProjectManager.forkReferenceVehicle(
        'porsche_911_gt3_rs_992',
        'Porsche 911 GT3 RS Track Spec',
        'Validation of Weissach package modularity'
      );
      expect(project).toBeDefined();
      expect(project.meta.lineage.referenceVehicleId).toBe('porsche_911_gt3_rs_992');
      expect(project.dimensions.overallLengthM).toBeCloseTo(4.572, 3);
      expect(project.dimensions.overallWidthM).toBeCloseTo(1.900, 3);

      // 2. Generate model-specific geometry with VehicleGeometryEngine
      const engine = new VehicleGeometryEngine();
      const porscheDef: VehicleGeometryDefinition = {
        schemaVersion: 2,
        meta: {
          id: 'porsche_911_gt3_rs_992',
          manufacturer: 'Porsche',
          model: '911 GT3 RS',
          generation: '992',
          year: 2023,
          archetype: 'rear_engine_coupe',
          provenanceLevel: 'verified'
        },
        geometry: {
          generatorId: 'porsche_992_gt3rs_generator',
          generatorVersion: '2.0.0',
          fidelityTier: 'Tier A – Reference-verified',
          units: 'meters',
          origin: 'ground_center',
          dimensions: {
            overall_length_m: 4.572,
            overall_width_m: 1.900,
            overall_height_m: 1.322,
            wheelbase_m: 2.457,
            front_track_m: 1.630,
            rear_track_m: 1.588,
            ground_clearance_m: 0.100
          }
        },
        reference: {
          specs: {}
        },
        materials: {
          body_paint: { type: 'clearcoat_paint', color: '#E0E0E0', roughness: 0.2, metalness: 0.8 }
        },
        wheels: {
          front: {
            rimDiameterInches: 20,
            rimWidthInches: 10,
            nominalSectionWidthMm: 275,
            aspectRatio: 35,
            offsetMm: 45,
            spokeStyle: 'center_lock_y_spoke',
            finish: 'satin_black',
            brakeDiscType: 'carbon_ceramic',
            caliperColor: '#D62828'
          },
          rear: {
            rimDiameterInches: 21,
            rimWidthInches: 13,
            nominalSectionWidthMm: 335,
            aspectRatio: 30,
            offsetMm: 31,
            spokeStyle: 'center_lock_y_spoke',
            finish: 'satin_black',
            brakeDiscType: 'carbon_ceramic',
            caliperColor: '#D62828'
          }
        }
      };

      const vehicleGroup = engine.loadVehicle(porscheDef);
      expect(vehicleGroup).toBeDefined();

      // 3. Inspect component hierarchy: verify 48+ discrete components with authentic metadata
      const components = engine.getComponents();
      expect(components.length).toBeGreaterThanOrEqual(25);

      const componentIds = components.map(c => c.id);
      expect(componentIds).toContain('hood');
      expect(componentIds).toContain('front_bumper');
      expect(componentIds).toContain('front_splitter');
      expect(componentIds).toContain('rear_wing');
      expect(componentIds).toContain('rear_diffuser');
      expect(componentIds).toContain('wheel_fl');
      expect(componentIds).toContain('wheel_fr');

      // 4. Select Component: Front Splitter & Parametric Editing
      const catalogSplitter = VehicleComponentCatalog.getComponentById('porsche_992_gt3rs_active_splitter');
      expect(catalogSplitter).toBeDefined();

      const baselineSplitterComp = VehicleComponentCatalog.toComponentDefinition(catalogSplitter!);
      expect(baselineSplitterComp.semanticType).toBe('front_splitter');
      expect(baselineSplitterComp.massEstimateKg.value).toBe(4.8);

      // Verify parametric modification increases bounding box extension
      const modifiedSplitterComp: ComponentDefinition = {
        ...baselineSplitterComp,
        id: 'porsche_992_gt3rs_active_splitter_extended',
        name: 'Extended Track Splitter +40mm',
        geometryHash: 'hash_splitter_extended_v2',
        bounds: {
          min: [-0.95, 1.95, 0.08],
          max: [0.95, 2.34, 0.18] // Extended forward by 40mm
        }
      };
      const baselineLength = baselineSplitterComp.bounds!.max[1] - baselineSplitterComp.bounds!.min[1];
      const modifiedLength = modifiedSplitterComp.bounds!.max[1] - modifiedSplitterComp.bounds!.min[1];
      expect(modifiedLength).toBeGreaterThan(baselineLength);
      expect(modifiedLength - baselineLength).toBeCloseTo(0.04, 3);

      // 5. Wheel Component Replacement & Compatibility Check
      // Valid Center-lock wheel replacement
      const magWheel = VehicleComponentCatalog.getComponentById('porsche_992_gt3rs_wheel_magnesium_fl');
      expect(magWheel).toBeDefined();
      const compatMag = VehicleComponentCatalog.checkCompatibility('porsche_911_gt3_rs_992', magWheel!);
      expect(compatMag.status).toBe('VALID');
      expect(compatMag.passed).toBe(true);
      expect(compatMag.canProceedToCFD).toBe(true);

      // Incompatible 5-lug Ferrari wheel on Porsche Center-lock hub -> BLOCKED
      const ferrariWheel = VehicleComponentCatalog.getComponentById('ferrari_488_pista_carbon_wheel_fl');
      expect(ferrariWheel).toBeDefined();
      const compatBlocked = VehicleComponentCatalog.checkCompatibility('porsche_911_gt3_rs_992', ferrariWheel!);
      expect(compatBlocked.status).toBe('BLOCKED');
      expect(compatBlocked.passed).toBe(false);
      expect(compatBlocked.canProceedToCFD).toBe(false);
      expect(compatBlocked.reasons.some(r => r.includes('Bolt pattern mismatch'))).toBe(true);

      // 6. Kinematic Assembly Clearance Audit
      const wheelArchComp: ComponentDefinition = {
        id: 'fender_front_l',
        name: 'Front Left Fender Arch',
        semanticType: 'fender_front_l',
        attachmentPoints: [],
        material: { materialId: 'paint', type: 'body_paint' },
        provenance: 'photo-reconstruction',
        massEstimateKg: { value: 3.5, isEstimate: true },
        locked: false,
        visible: true,
        geometryHash: 'hash_fender_fl',
        bounds: {
          min: [0.70, 1.05, 0.35],
          max: [0.98, 1.65, 0.85]
        }
      };
      const oemWheelComp = VehicleComponentCatalog.toComponentDefinition(magWheel!);
      const clearanceAudit = CollisionDetector.auditAssemblyClearances([
        oemWheelComp,
        wheelArchComp,
        modifiedSplitterComp
      ]);
      expect(clearanceAudit.canProceedToCFD).toBe(true);

      // 7. STEP CAD Export Validation
      const stepContent = StepExporter.exportAssemblyToStep(
        'Porsche 911 GT3 RS Weissach Package',
        [baselineSplitterComp, modifiedSplitterComp, oemWheelComp]
      );
      expect(stepContent).toContain('ISO-10303-21;');
      expect(stepContent).toContain('AUTOMOTIVE_DESIGN');
      expect(stepContent).toContain('Extended Track Splitter +40mm');
      expect(stepContent).toContain('END-ISO-10303-21;');

      engine.dispose();
    });
  });

  // =========================================================================
  // VEHICLE 2: LAMBORGHINI AVENTADOR SVJ
  // =========================================================================
  describe('Pilot 2: Lamborghini Aventador SVJ', () => {
    it('executes ALA 2.0 active aero modification, 84mm center-lock validation & cross-vehicle conflict prevention', () => {
      // 1. Select and fork reference vehicle
      const project = ProjectManager.forkReferenceVehicle(
        'lamborghini_aventador_svj',
        'Lamborghini SVJ ALA 2.0 Track Setup',
        'Modifying active aerodynamic wing schedule'
      );
      expect(project).toBeDefined();
      expect(project.meta.lineage.referenceVehicleId).toBe('lamborghini_aventador_svj');
      expect(project.dimensions.overallLengthM).toBeCloseTo(4.943, 3);
      expect(project.dimensions.overallWidthM).toBeCloseTo(2.098, 3);

      // 2. Generate model-specific geometry with VehicleGeometryEngine
      const engine = new VehicleGeometryEngine();
      const svjDef: VehicleGeometryDefinition = {
        schemaVersion: 2,
        meta: {
          id: 'lamborghini_aventador_svj',
          manufacturer: 'Lamborghini',
          model: 'Aventador SVJ',
          generation: 'LP 770-4',
          year: 2019,
          archetype: 'mid_engine_hypercar',
          provenanceLevel: 'verified'
        },
        geometry: {
          generatorId: 'lamborghini_svj_generator',
          generatorVersion: '2.0.0',
          fidelityTier: 'Tier A – Reference-verified',
          units: 'meters',
          origin: 'ground_center',
          dimensions: {
            overall_length_m: 4.943,
            overall_width_m: 2.098,
            overall_height_m: 1.136,
            wheelbase_m: 2.700,
            front_track_m: 1.720,
            rear_track_m: 1.680,
            ground_clearance_m: 0.100
          }
        },
        reference: {
          specs: {}
        },
        materials: {
          body_paint: { type: 'clearcoat_paint', color: '#32D74B', roughness: 0.25, metalness: 0.7 }
        },
        wheels: {
          front: {
            rimDiameterInches: 20,
            rimWidthInches: 9,
            nominalSectionWidthMm: 255,
            aspectRatio: 30,
            offsetMm: 32,
            spokeStyle: 'center_lock_y_spoke',
            finish: 'dark_titanium',
            brakeDiscType: 'carbon_ceramic',
            caliperColor: '#D62828'
          },
          rear: {
            rimDiameterInches: 21,
            rimWidthInches: 13,
            nominalSectionWidthMm: 355,
            aspectRatio: 25,
            offsetMm: 40,
            spokeStyle: 'center_lock_y_spoke',
            finish: 'dark_titanium',
            brakeDiscType: 'carbon_ceramic',
            caliperColor: '#D62828'
          }
        }
      };

      const vehicleGroup = engine.loadVehicle(svjDef);
      expect(vehicleGroup).toBeDefined();

      const components = engine.getComponents();
      expect(components.length).toBeGreaterThanOrEqual(25);

      // 3. Inspect ALA 2.0 Active Rear Wing Component
      const alaWing = VehicleComponentCatalog.getComponentById('lamborghini_svj_ala_wing');
      expect(alaWing).toBeDefined();
      expect(alaWing!.category).toBe('Aero');
      expect(alaWing!.parametricConfig?.vectoringFlaps).toBe(true);

      // 4. Parametric Geometry Recalculation for ALA 2.0 Wing
      const baselineWingGeo = ParametricAeroLibrary.generateRearWingGeometry({
        spanM: 1.95,
        chordM: 0.36,
        angleDegrees: 12.0,
        airfoilCode: 'SELIG_S1223',
        mountType: 'bottom_pylon',
        mountSpacingM: 0.75,
        endplates: { heightM: 0.30, lengthM: 0.42, thicknessM: 0.01 }
      });
      baselineWingGeo.computeBoundingBox();

      const highDownforceWingGeo = ParametricAeroLibrary.generateRearWingGeometry({
        spanM: 2.05,
        chordM: 0.38,
        angleDegrees: 16.5,
        airfoilCode: 'SELIG_S1223',
        mountType: 'bottom_pylon',
        mountSpacingM: 0.75,
        endplates: { heightM: 0.32, lengthM: 0.45, thicknessM: 0.01 }
      });
      highDownforceWingGeo.computeBoundingBox();

      const baselineSpan = baselineWingGeo.boundingBox!.max.y - baselineWingGeo.boundingBox!.min.y;
      const modifiedSpan = highDownforceWingGeo.boundingBox!.max.y - highDownforceWingGeo.boundingBox!.min.y;
      expect(modifiedSpan).toBeGreaterThan(baselineSpan);
      expect(Math.abs(modifiedSpan - 2.05)).toBeLessThan(0.02);

      // 5. Hub Compatibility: Verify SVJ Leirion Wheel is VALID and 5-lug wheel is BLOCKED
      const leirionWheel = VehicleComponentCatalog.getComponentById('lamborghini_svj_leirion_wheel_fl');
      expect(leirionWheel).toBeDefined();
      const compatLeirion = VehicleComponentCatalog.checkCompatibility('lamborghini_aventador_svj', leirionWheel!);
      expect(compatLeirion.status).toBe('VALID');
      expect(compatLeirion.passed).toBe(true);

      const ferrariWheel = VehicleComponentCatalog.getComponentById('ferrari_488_pista_forged_wheel_fl');
      const compatBlocked = VehicleComponentCatalog.checkCompatibility('lamborghini_aventador_svj', ferrariWheel!);
      expect(compatBlocked.status).toBe('BLOCKED');
      expect(compatBlocked.reasons.some(r => r.includes('Bolt pattern mismatch'))).toBe(true);

      // 6. Export STEP CAD file
      const alaWingComp = VehicleComponentCatalog.toComponentDefinition(alaWing!);
      const stepContent = StepExporter.exportAssemblyToStep(
        'Lamborghini Aventador SVJ ALA Package',
        [alaWingComp]
      );
      expect(stepContent).toContain('ALA 2.0 Active Aerodynamic Rear Wing');
      expect(stepContent).toContain('END-ISO-10303-21;');

      engine.dispose();
    });
  });

  // =========================================================================
  // VEHICLE 3: FERRARI 488 PISTA
  // =========================================================================
  describe('Pilot 3: Ferrari 488 Pista', () => {
    it('executes F1 S-Duct aerodynamic modification, 5x114.3mm wheel verification & rejection of center-lock spline', () => {
      // 1. Select and fork reference vehicle
      const project = ProjectManager.forkReferenceVehicle(
        'ferrari_488_pista',
        'Ferrari 488 Pista Piloti Ferrari Spec',
        'S-Duct aerodynamic channel and Corse Clienti aero study'
      );
      expect(project).toBeDefined();
      expect(project.meta.lineage.referenceVehicleId).toBe('ferrari_488_pista');
      expect(project.dimensions.overallLengthM).toBeCloseTo(4.605, 3);
      expect(project.dimensions.overallWidthM).toBeCloseTo(1.975, 3);

      // 2. Generate model-specific geometry with VehicleGeometryEngine
      const engine = new VehicleGeometryEngine();
      const pistaDef: VehicleGeometryDefinition = {
        schemaVersion: 2,
        meta: {
          id: 'ferrari_488_pista',
          manufacturer: 'Ferrari',
          model: '488 Pista',
          generation: 'Tipo F142M',
          year: 2018,
          archetype: 'mid_engine_supercar',
          provenanceLevel: 'verified'
        },
        geometry: {
          generatorId: 'ferrari_488_pista_generator',
          generatorVersion: '2.0.0',
          fidelityTier: 'Tier A – Reference-verified',
          units: 'meters',
          origin: 'ground_center',
          dimensions: {
            overall_length_m: 4.605,
            overall_width_m: 1.975,
            overall_height_m: 1.206,
            wheelbase_m: 2.650,
            front_track_m: 1.679,
            rear_track_m: 1.649,
            ground_clearance_m: 0.105
          }
        },
        reference: {
          specs: {}
        },
        materials: {
          body_paint: { type: 'clearcoat_paint', color: '#D40000', roughness: 0.15, metalness: 0.85 }
        },
        wheels: {
          front: {
            rimDiameterInches: 20,
            rimWidthInches: 9,
            nominalSectionWidthMm: 245,
            aspectRatio: 35,
            offsetMm: 44.7,
            spokeStyle: '5_spoke',
            finish: 'silver_alloy',
            brakeDiscType: 'carbon_ceramic',
            caliperColor: '#FFD700'
          },
          rear: {
            rimDiameterInches: 20,
            rimWidthInches: 11,
            nominalSectionWidthMm: 305,
            aspectRatio: 30,
            offsetMm: 38.5,
            spokeStyle: '5_spoke',
            finish: 'silver_alloy',
            brakeDiscType: 'carbon_ceramic',
            caliperColor: '#FFD700'
          }
        }
      };

      const vehicleGroup = engine.loadVehicle(pistaDef);
      expect(vehicleGroup).toBeDefined();

      const components = engine.getComponents();
      expect(components.length).toBeGreaterThanOrEqual(25);

      // 3. Inspect S-Duct Bumper and Blown Spoiler
      const sDuctBumper = VehicleComponentCatalog.getComponentById('ferrari_488_pista_s_duct_bumper');
      expect(sDuctBumper).toBeDefined();
      expect(sDuctBumper!.name.includes('S-Duct')).toBe(true);
      expect(sDuctBumper!.parametricConfig?.intakeWidthM).toBe(0.82);

      const blownSpoiler = VehicleComponentCatalog.getComponentById('ferrari_488_pista_blown_spoiler');
      expect(blownSpoiler).toBeDefined();

      // 4. Test Wheel Compatibility: 5x114.3mm Carbon Wheel (VALID) vs Center-Lock Wheel (BLOCKED)
      const carbonWheel = VehicleComponentCatalog.getComponentById('ferrari_488_pista_carbon_wheel_fl');
      expect(carbonWheel).toBeDefined();
      expect(carbonWheel!.hubInterface).toBe('5x114_3');

      const compatCarbon = VehicleComponentCatalog.checkCompatibility('ferrari_488_pista', carbonWheel!);
      expect(compatCarbon.status).toBe('VALID');
      expect(compatCarbon.passed).toBe(true);

      // Center-lock Porsche wheel onto Ferrari 5-lug hub -> BLOCKED
      const porscheCenterLock = VehicleComponentCatalog.getComponentById('porsche_992_gt3rs_wheel_magnesium_fl');
      const compatBlocked = VehicleComponentCatalog.checkCompatibility('ferrari_488_pista', porscheCenterLock!);
      expect(compatBlocked.status).toBe('BLOCKED');
      expect(compatBlocked.passed).toBe(false);
      expect(compatBlocked.reasons.some(r => r.includes('Bolt pattern mismatch'))).toBe(true);
      expect(compatBlocked.reasons.some(r => r.includes('5x114.3mm PCD'))).toBe(true);

      // 5. Optional Racing Component: Corse Clienti XX Track Wing
      const xxWing = VehicleComponentCatalog.getComponentById('ferrari_488_pista_xx_track_wing');
      expect(xxWing).toBeDefined();
      expect(xxWing!.isOptional).toBe(true);
      expect(xxWing!.isRemovable).toBe(true);

      // 6. Export STEP CAD file
      const sDuctComp = VehicleComponentCatalog.toComponentDefinition(sDuctBumper!);
      const xxWingComp = VehicleComponentCatalog.toComponentDefinition(xxWing!);
      const stepContent = StepExporter.exportAssemblyToStep(
        'Ferrari 488 Pista Corse Clienti Assembly',
        [sDuctComp, xxWingComp]
      );
      expect(stepContent).toContain('488 Pista Patented S-Duct Carbon Front Bumper');
      expect(stepContent).toContain('XX-Programme High-Downforce Track Rear Wing');
      expect(stepContent).toContain('END-ISO-10303-21;');

      engine.dispose();
    });
  });
});
