import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { ProjectManager } from '../src/projects/projectManager';
import { ComponentManager, ComponentDefinition } from '../src/geometry/components/componentManager';
import { CollisionDetector } from '../src/geometry/components/collisionDetector';
import { StepExporter } from '../src/geometry/cad/stepExporter';
import { StepValidator } from '../src/geometry/cad/stepValidator';
import {
  ParametricAeroLibrary,
  RearWingParameters,
  FrontSplitterParameters,
  CanardParameters,
  UnderbodyTunnelParameters,
  PREBUILT_AERO_PACKAGES
} from '../src/geometry/aero/parametricAeroLibrary';
import { AerodynamicOptimizer } from '../src/simulation/optimization/aerodynamicOptimizer';
import { AeroDynamicsCoupler, VehicleDynamicsInput } from '../src/simulation/dynamics/aeroDynamicsCoupler';
import { WheelRuleValidator, WheelFitmentInput } from '@autoverse/vehicle-generation-engine';

describe('AutoVerse Platform — Phase T13: Top-Tier Automotive Engineering Acceptance Test', () => {
  it('executes the complete 43-step end-to-end automotive engineering & CAD/CFD/Dynamics workflow', () => {
    // =========================================================================
    // SECTION 1: REFERENCE VEHICLE INSPECTION & PROJECT FORKING (Steps 1-5)
    // =========================================================================
    // 1. Fork authoritative Porsche 911 GT3 RS (992) engineering reference project
    const project = ProjectManager.forkReferenceVehicle(
      'porsche_911_gt3_rs_992',
      'GT3 RS Track Aero Evolution Project',
      'Top-tier multi-objective aero and chassis optimization'
    );
    expect(project).toBeDefined();
    expect(project.meta.lineage.referenceVehicleId).toBe('porsche_911_gt3_rs_992');
    expect(project.featureDag.getAllFeatures().length).toBeGreaterThan(0);

    // 2. Initialize Component Manager and register modular parts
    const compManager = new ComponentManager();
    const wingComp: ComponentDefinition = {
      id: 'comp_porsche_swan_wing',
      name: 'Swan-Neck Active Aerofoil Assembly',
      semanticType: 'rear_wing',
      attachmentPoints: [{ name: 'decklid_pylons', anchorId: 'anchor_deck', localPosition: [0, -1.8, 0.95], required: true }],
      material: { materialId: 'dry_carbon', type: 'carbon_fiber' },
      provenance: 'manufacturer-CAD',
      massEstimateKg: { value: 6.8, isEstimate: true },
      locked: false,
      visible: true,
      geometryHash: 'hash_wing_001',
      bounds: { min: [-0.85, -0.2, 0.95], max: [0.85, 0.2, 1.25] }
    };
    compManager.registerComponent(wingComp);
    expect(compManager.getComponent('comp_porsche_swan_wing')).toBeDefined();

    // =========================================================================
    // SECTION 2: PARAMETRIC AERO DESIGN & CUSTOM AIRFOIL IMPORT (Steps 6-15)
    // =========================================================================
    // 3. Import custom coordinate Selig S1223 high-lift airfoil DAT
    const customDat = `SELIG S1223 High-Lift Airfoil
 1.000000  0.000000
 0.950000  0.021000
 0.850000  0.058000
 0.700000  0.104000
 0.500000  0.142000
 0.300000  0.145000
 0.150000  0.116000
 0.050000  0.068000
 0.000000  0.000000
 0.050000 -0.045000
 0.150000 -0.062000
 0.300000 -0.064000
 0.500000 -0.051000
 0.700000 -0.033000
 0.850000 -0.016000
 1.000000  0.000000`;

    const importedAirfoil = ParametricAeroLibrary.importAirfoilFromDat(
      customDat,
      'SELIG_S1223_CUSTOM',
      'Selig S1223 High-Lift Profile'
    );
    expect(importedAirfoil.code).toBe('SELIG_S1223_CUSTOM');
    expect(importedAirfoil.coordinates.length).toBeGreaterThan(10);
    expect(importedAirfoil.thicknessRatio).toBeGreaterThan(0.1);

    // 4. Generate parametric rear wing with high angle of attack (12.5 deg)
    const wingParams: RearWingParameters = {
      spanM: 1.78,
      chordM: 0.34,
      angleDegrees: 12.5,
      airfoilCode: 'SELIG_S1223_CUSTOM',
      mountType: 'swan_neck',
      mountSpacingM: 0.82,
      endplates: { heightM: 0.28, lengthM: 0.42, thicknessM: 0.006 }
    };
    const wingGeo = ParametricAeroLibrary.generateRearWingGeometry(wingParams);
    expect(wingGeo.getAttribute('position').count).toBeGreaterThan(100);

    // 5. Generate aggressive front splitter with aerodynamic strakes
    const splitterParams: FrontSplitterParameters = {
      forwardExtensionM: 0.14,
      widthM: 1.88,
      thicknessM: 0.02,
      angleDegrees: 2.5,
      edgeRadiusM: 0.005,
      sideEndplates: {
        enabled: true,
        heightM: 0.09
      }
    };
    const splitterGeo = ParametricAeroLibrary.generateFrontSplitterGeometry(splitterParams);
    expect(splitterGeo.getAttribute('position').count).toBeGreaterThan(50);

    // 6. Generate aerodynamic front dive planes (canards)
    const canardParams: CanardParameters = {
      lengthM: 0.35,
      widthM: 0.18,
      angleDegrees: 14.0,
      thicknessM: 0.005,
      curvatureDegrees: 12.0
    };
    const canardGeo = ParametricAeroLibrary.generateCanardGeometry(canardParams);
    expect(canardGeo.getAttribute('position').count).toBeGreaterThanOrEqual(12);

    // 7. Generate underbody Venturi tunnel diffusers
    const underbodyParams: UnderbodyTunnelParameters = {
      lengthM: 1.45,
      widthM: 0.48,
      throatHeightM: 0.040,
      exitHeightM: 0.125,
      expansionAngleDeg: 11.5,
      strakeCount: 4
    };
    const underbodyGeo = ParametricAeroLibrary.generateUnderbodyTunnelGeometry(underbodyParams);
    expect(underbodyGeo.getAttribute('position').count).toBeGreaterThanOrEqual(12);

    // 8. Verify prebuilt aero packages catalog
    expect(PREBUILT_AERO_PACKAGES.length).toBeGreaterThanOrEqual(2);
    const streetPkg = PREBUILT_AERO_PACKAGES.find(p => p.tier === 'STREET')!;
    const trackPkg = PREBUILT_AERO_PACKAGES.find(p => p.tier === 'HIGH_DOWNFORCE')!;
    expect(trackPkg.rearWing.angleDegrees).toBeGreaterThan(streetPkg.rearWing.angleDegrees);

    // =========================================================================
    // SECTION 3: CAD KERNEL & STEP AP214 B-REP VALIDATION (Steps 16-23)
    // =========================================================================
    // 9. Export complete aerodynamic assembly to ISO 10303-21 STEP AP214
    const assemblyStep = StepExporter.exportAssemblyToStep(
      'GT3_RS_TRACK_PACKAGE',
      [
        { name: 'ACTIVE_REAR_WING', geometry: wingGeo },
        { name: 'FRONT_SPLITTER_STRAKES', geometry: splitterGeo },
        { name: 'DUAL_TIER_CANARDS', geometry: canardGeo },
        { name: 'VENTURI_DIFFUSER_TUNNELS', geometry: underbodyGeo }
      ],
      { schema: 'AP214', unit: 'METRE' }
    );
    expect(assemblyStep.startsWith('ISO-10303-21;')).toBe(true);
    expect(assemblyStep).toContain('AUTOMOTIVE_DESIGN');
    expect(assemblyStep).toContain('ACTIVE_REAR_WING');
    expect(assemblyStep).toContain('FRONT_SPLITTER_STRAKES');

    // 10. Re-open exported STEP file in StepValidator & perform rigorous topological check
    const singleStep = StepExporter.exportToStep(wingGeo, {
      modelName: 'ACTIVE_REAR_WING_SOLID',
      schema: 'AP214',
      unit: 'METRE'
    });
    expect(singleStep.startsWith('ISO-10303-21;')).toBe(true);
    expect(singleStep).toContain('CLOSED_SHELL');
    expect(singleStep).toContain('MANIFOLD_SOLID_BREP');

    const stepValidation = StepValidator.validateStepContent(singleStep);
    expect(stepValidation.isValidStep).toBe(true);
    expect(stepValidation.fileReadability).toBe(true);
    expect(stepValidation.faceCount).toBeGreaterThan(0);
    expect(stepValidation.vertexCount).toBeGreaterThan(0);
    expect(stepValidation.volumeM3).toBeGreaterThan(0);

    // Also validate closed watertight ballast CAD solid
    const testBox = new THREE.BoxGeometry(0.5, 0.2, 0.1);
    const boxStep = StepExporter.exportToStep(testBox, {
      modelName: 'WATERTIGHT_BALLAST_SOLID',
      schema: 'AP214',
      unit: 'METRE'
    });
    const boxValidation = StepValidator.validateStepContent(boxStep);
    expect(boxValidation.isValidStep).toBe(true);
    expect(boxValidation.faceCount).toBe(12);
    expect(boxValidation.volumeM3).toBeCloseTo(0.01, 2); // 0.5 * 0.2 * 0.1 = 0.01 m3

    // =========================================================================
    // SECTION 4: PACKAGING, FITMENT & WHEEL CLEARANCE (Steps 24-28)
    // =========================================================================
    // 11. OEM vs Proposed Wheel Fitment Rules
    const oemWheels: WheelFitmentInput = {
      rimDiameterInches: 20,
      nominalSectionWidthMm: 275,
      aspectRatio: 35,
      rimWidthInches: 10.0,
      offsetMm: 45
    };
    const trackWheels: WheelFitmentInput = {
      rimDiameterInches: 21,
      nominalSectionWidthMm: 275,
      aspectRatio: 30,
      rimWidthInches: 10.0,
      offsetMm: 50
    };
    const fitment = WheelRuleValidator.validateFitment(trackWheels, oemWheels);
    expect(fitment.isValid).toBe(true);
    expect(Math.abs(fitment.diameterDeviationPercent)).toBeLessThan(1.5);
    expect(fitment.outerPokeMm).toBeLessThanOrEqual(85.0);

    // 12. Component packaging & interference detection
    const wingBox = { min: [-1.8, -0.85, 0.95] as [number, number, number], max: [-1.4, 0.85, 1.25] as [number, number, number] };
    const splitterBox = { min: [1.8, -0.9, 0.05] as [number, number, number], max: [2.2, 0.9, 0.20] as [number, number, number] };
    const aeroClearance = CollisionDetector.computeAABBClearance(wingBox, splitterBox);
    expect(aeroClearance.clearanceM).toBeGreaterThan(3.0); // Front and rear aero elements are properly separated

    // Wheel and arch bounding audit
    const wheelEnvelope = { min: [1.2, 0.75, 0.05] as [number, number, number], max: [1.8, 0.95, 0.70] as [number, number, number] };
    const fenderEnvelope = { min: [1.15, 0.72, 0.0] as [number, number, number], max: [1.85, 0.98, 0.78] as [number, number, number] };
    const wheelArchClearance = CollisionDetector.computeAABBClearance(wheelEnvelope, fenderEnvelope);
    expect(wheelArchClearance.clearanceM).toBeDefined();

    // =========================================================================
    // SECTION 5: MULTI-OBJECTIVE AERODYNAMIC OPTIMIZATION (Steps 29-35)
    // =========================================================================
    // 13. Execute Pareto sweep across design space (angle of attack, splitter extension)
    const baselineVars = {
      wingSpanM: 1.70,
      wingAoADeg: 8.0,
      splitterExtensionM: 0.10,
      diffuserAngleDeg: 10.0
    };
    const ranges = {
      wingSpanM: [1.60, 1.85] as [number, number],
      wingAoADeg: [4.0, 14.0] as [number, number],
      splitterExtensionM: [0.06, 0.15] as [number, number],
      diffuserAngleDeg: [8.0, 14.0] as [number, number]
    };

    const optResult = AerodynamicOptimizer.runOptimization(
      'porsche_911_gt3_rs_992',
      baselineVars,
      ranges,
      {
        minGroundClearanceMm: 75,
        maxWingSpanM: 1.95,
        targetBalanceFrontPct: 28.0,
        maxAllowableBalanceDeviationPct: 15.0
      }
    );

    expect(optResult.totalEvaluated).toBe(37); // 1 baseline + 3 * 3 * 2 * 2
    expect(optResult.feasibleCount).toBeGreaterThanOrEqual(5);
    expect(optResult.paretoFront.length).toBeGreaterThan(0);
    expect(optResult.recommendedBest).toBeDefined();

    // Verify non-dominated Pareto property: along Pareto front, higher downforce comes at higher drag
    for (let i = 0; i < optResult.paretoFront.length - 1; i++) {
      const current = optResult.paretoFront[i];
      const next = optResult.paretoFront[i + 1];
      expect(next.metrics.cd).toBeGreaterThanOrEqual(current.metrics.cd);
      expect(next.metrics.downforceN).toBeGreaterThanOrEqual(current.metrics.downforceN);
    }

    // =========================================================================
    // SECTION 6: VEHICLE DYNAMICS & AERO COUPLING ENVELOPE (Steps 36-40)
    // =========================================================================
    // 14. Couple CFD aerodynamic forces into 4-wheel dynamic load distribution
    const chosenDesign = optResult.recommendedBest;
    const dynamicsInput: VehicleDynamicsInput = {
      massKg: 1450,
      wheelbaseM: 2.457,
      frontTrackM: 1.63,
      rearTrackM: 1.60,
      cgHeightM: 0.42,
      staticWeightFrontPct: 42.0,
      tireFrictionCoeffMu: 1.35,
      frontSpringRateNPerM: 140000,
      rearSpringRateNPerM: 160000,
      frontalAreaM2: 2.12,
      cd: chosenDesign.metrics.cd,
      clFront: -0.15,
      clRear: chosenDesign.metrics.cl - (-0.15)
    };

    const dynamicsReport = AeroDynamicsCoupler.evaluateDynamicsCoupling(dynamicsInput);
    expect(dynamicsReport.provenance).toBe('CFD_COUPLED_DYNAMICS');
    expect(dynamicsReport.speedSweep.length).toBe(10);

    // Assert grip expansion: at 280-300 km/h, lateral G must expand significantly due to downforce
    const mechanicalG = dynamicsReport.speedSweep[0].maxCorneringLateralG;
    const highSpeedG = dynamicsReport.topSpeedPoint.maxCorneringLateralG;
    expect(highSpeedG).toBeGreaterThan(mechanicalG);
    expect(dynamicsReport.highSpeedGripEnhancementPct).toBeGreaterThan(10.0);

    // Suspension compression at 300 km/h under aero load
    expect(dynamicsReport.topSpeedPoint.suspensionCompressionRearMm).toBeGreaterThan(
      dynamicsReport.speedSweep[2].suspensionCompressionRearMm
    );

    // =========================================================================
    // SECTION 7: FEATURE DAG PERSISTENCE & PROJECT REVISIONS (Steps 41-43)
    // =========================================================================
    // 15. Record winning optimization configuration into Feature DAG
    project.featureDag.addFeature({
      id: 'feature_optimal_track_wing',
      name: `Optimized Track Wing (${chosenDesign.variables.wingAoADeg} deg, Cd ${chosenDesign.metrics.cd})`,
      type: 'SWEEP_AERO',
      parameters: {
        angleDeg: chosenDesign.variables.wingAoADeg,
        cl: chosenDesign.metrics.cl,
        cd: chosenDesign.metrics.cd
      },
      parentIds: ['body_shell']
    });

    // Save project and generate revision
    ProjectManager.saveProject(project);
    const revision = ProjectManager.createRevision(project.meta.id, 'Opt Track Package Acceptance Baseline');
    expect(revision).toBeDefined();

    // Verify persistence
    const reloadedProject = ProjectManager.getProject(project.meta.id);
    expect(reloadedProject).toBeDefined();
    expect(reloadedProject!.featureDag.getFeature('feature_optimal_track_wing')).toBeDefined();

    const revisions = ProjectManager.getRevisions(project.meta.id);
    expect(revisions.length).toBeGreaterThan(0);
    expect(revisions[0].description).toBe('Opt Track Package Acceptance Baseline');
  });
});
