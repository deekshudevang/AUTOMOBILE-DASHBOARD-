import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { ProjectManager } from '../src/projects/projectManager';
import { ComponentManager, ComponentDefinition } from '../src/geometry/components/componentManager';
import { CollisionDetector } from '../src/geometry/components/collisionDetector';
import { StepExporter } from '../src/geometry/cad/stepExporter';
import { AIRFOIL_CATALOG, ParametricAeroLibrary, RearWingParameters } from '../src/geometry/aero/parametricAeroLibrary';
import { WheelRuleValidator, WheelFitmentInput } from '@autoverse/vehicle-generation-engine';

describe('AutoVerse Platform — Phase 25: First Complete Vertical Slice', () => {
  it('executes the full 11-step end-to-end automotive engineering vertical slice', () => {
    // ---------------------------------------------------------
    // STEP 1: Select and load modular vehicle concept
    // ---------------------------------------------------------
    const project = ProjectManager.forkReferenceVehicle(
      'porsche_911_gt3_rs_992',
      'Vertical Slice Sprint Aero Package',
      'End-to-end integration vertical slice'
    );
    expect(project).toBeDefined();
    expect(project.meta.name).toBe('Vertical Slice Sprint Aero Package');
    expect(project.featureDag.getAllFeatures().length).toBeGreaterThan(0);

    // ---------------------------------------------------------
    // STEP 2: Inspect component hierarchy
    // ---------------------------------------------------------
    const compManager = new ComponentManager();
    const wingComp: ComponentDefinition = {
      id: 'comp_rear_wing_gt3rs',
      name: 'Active Swan-Neck Dual-Element Rear Wing',
      semanticType: 'rear_wing',
      attachmentPoints: [],
      material: { materialId: 'carbon', type: 'carbon_fiber' },
      provenance: 'photo-reconstruction',
      massEstimateKg: { value: 7.2, isEstimate: true },
      locked: false,
      visible: true,
      geometryHash: 'hash_wing_initial',
      bounds: {
        min: [-0.86, -0.2, 0.95],
        max: [0.86, 0.2, 1.25]
      }
    };
    compManager.registerComponent(wingComp);
    const registered = compManager.getComponent('comp_rear_wing_gt3rs');
    expect(registered).toBeDefined();

    // ---------------------------------------------------------
    // STEP 3 & 4: Select component and modify parametric dimension
    // ---------------------------------------------------------
    // Baseline geometry generation
    const baselineParams: RearWingParameters = {
      spanM: 1.65,
      chordM: 0.32,
      angleDegrees: 8.5,
      airfoilCode: 'SELIG_S1223',
      mountType: 'swan_neck',
      mountSpacingM: 0.8,
      endplates: { heightM: 0.25, lengthM: 0.38, thicknessM: 0.008 }
    };
    const baselineWingGeo = ParametricAeroLibrary.generateRearWingGeometry(baselineParams);
    const baselinePositions = baselineWingGeo.getAttribute('position');
    expect(baselinePositions).toBeDefined();
    expect(baselinePositions.count).toBeGreaterThan(100);

    // Modify dimension: increase span from 1.65m to 1.82m and angle to 12.0 deg
    const modifiedParams: RearWingParameters = {
      spanM: 1.82,
      chordM: 0.32,
      angleDegrees: 12.0,
      airfoilCode: 'SELIG_S1223',
      mountType: 'swan_neck',
      mountSpacingM: 0.8,
      endplates: { heightM: 0.25, lengthM: 0.38, thicknessM: 0.008 }
    };
    const modifiedWingGeo = ParametricAeroLibrary.generateRearWingGeometry(modifiedParams);
    const modifiedPositions = modifiedWingGeo.getAttribute('position');

    // ---------------------------------------------------------
    // STEP 5: Regenerate geometry and verify new vertex coordinates/hashes
    // ---------------------------------------------------------
    expect(modifiedPositions).toBeDefined();
    modifiedWingGeo.computeBoundingBox();
    baselineWingGeo.computeBoundingBox();
    const baselineSpan = baselineWingGeo.boundingBox!.max.y - baselineWingGeo.boundingBox!.min.y;
    const modifiedSpan = modifiedWingGeo.boundingBox!.max.y - modifiedWingGeo.boundingBox!.min.y;
    expect(modifiedSpan).toBeGreaterThan(baselineSpan);
    expect(Math.abs(modifiedSpan - 1.82)).toBeLessThan(0.01);

    // ---------------------------------------------------------
    // STEP 6: Select wheel component
    // ---------------------------------------------------------
    const oemBaseline: WheelFitmentInput = {
      rimDiameterInches: 20,
      nominalSectionWidthMm: 265,
      aspectRatio: 35,
      rimWidthInches: 9.5,
      offsetMm: 45
    };
    const oemDiam = WheelRuleValidator.calculateRollingDiameter(20, 265, 35);
    expect(oemDiam).toBeCloseTo(693.5, 1);

    // ---------------------------------------------------------
    // STEP 7: Replace with compatible alternative wheel
    // ---------------------------------------------------------
    const proposed: WheelFitmentInput = {
      rimDiameterInches: 21,
      nominalSectionWidthMm: 265,
      aspectRatio: 30,
      rimWidthInches: 10,
      offsetMm: 42
    };

    // ---------------------------------------------------------
    // STEP 8: Run compatibility & clearance validation
    // ---------------------------------------------------------
    const fitmentReport = WheelRuleValidator.validateFitment(proposed, oemBaseline);
    expect(fitmentReport.isValid).toBe(true);
    expect(Math.abs(fitmentReport.diameterDeviationPercent)).toBeLessThan(1.0);

    const wheelBox = {
      min: [1.2, 0.75, 0.05] as [number, number, number],
      max: [1.8, 0.95, 0.70] as [number, number, number]
    };
    const archBox = {
      min: [1.15, 0.72, 0.0] as [number, number, number],
      max: [1.85, 0.98, 0.75] as [number, number, number]
    };
    const clearance = CollisionDetector.computeAABBClearance(wheelBox, archBox);
    expect(clearance.clearanceM).toBeDefined();

    // ---------------------------------------------------------
    // STEP 9: Add feature to DAG and save project revision
    // ---------------------------------------------------------
    const initialFeatureCount = project.featureDag.getAllFeatures().length;
    project.featureDag.addFeature({
      id: 'feature_modified_wing',
      name: 'Extended Rear Wing to 1.82m',
      type: 'SWEEP_AERO',
      parameters: { spanM: 1.82, chordM: 0.32, angleDeg: 12.0 },
      parentIds: ['body_shell']
    });
    ProjectManager.saveProject(project);
    expect(project.featureDag.getAllFeatures().length).toBe(initialFeatureCount + 1);

    // ---------------------------------------------------------
    // STEP 10: Verify persistence and revision history
    // ---------------------------------------------------------
    const retrieved = ProjectManager.getProject(project.meta.id);
    expect(retrieved).toBeDefined();
    const wingFeature = retrieved!.featureDag.getFeature('feature_modified_wing');
    expect(wingFeature).toBeDefined();
    expect(wingFeature?.name).toBe('Extended Rear Wing to 1.82m');

    // ---------------------------------------------------------
    // STEP 11: Export STEP AP214 and assert validity
    // ---------------------------------------------------------
    const stepOutput = StepExporter.exportToStep(modifiedWingGeo, {
      modelName: 'AUTOVERSE_VERTICAL_SLICE_WING',
      schema: 'AP214',
      unit: 'METRE'
    });
    expect(stepOutput.startsWith('ISO-10303-21;')).toBe(true);
    expect(stepOutput).toContain('FILE_NAME');
    expect(stepOutput).toContain('AUTOMOTIVE_DESIGN');
    expect(stepOutput).toContain('MANIFOLD_SOLID_BREP');
    expect(stepOutput).toContain('ENDSEC;');
  });
});

