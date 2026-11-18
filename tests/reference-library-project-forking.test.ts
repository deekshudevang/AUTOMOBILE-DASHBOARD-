import { describe, it, expect } from 'vitest';
import {
  ReferenceVehicleLibrary,
  ReferenceVehicleReadOnlyError
} from '../src/reference/referenceVehicleLibrary';
import { ProjectManager } from '../src/projects/projectManager';
import { CalibratedPlaneManager } from '../src/geometry/reference/calibratedPlanes';

describe('AutoVerse 3D — Reference Vehicle Library & Lineage Forking (Phase 7)', () => {
  it('loads sourced reference vehicles with verified provenance metadata', () => {
    const references = ReferenceVehicleLibrary.getAllReferences();
    expect(references.length).toBeGreaterThanOrEqual(3);

    const gt3rs = ReferenceVehicleLibrary.getReference('porsche_911_gt3_rs_992');
    expect(gt3rs).toBeDefined();
    expect(gt3rs?.isReadOnly).toBe(true);

    // Verify manufacturer sourcing
    expect(gt3rs?.manufacturer.value).toBe('Porsche');
    expect(gt3rs?.manufacturer.confidence).toBe('verified');
    expect(gt3rs?.manufacturer.source).toContain('Porsche');

    // Verify dimensions sourcing
    expect(gt3rs?.dimensions.lengthM.value).toBeCloseTo(4.572);
    expect(gt3rs?.dimensions.lengthM.confidence).toBe('verified');
    expect(gt3rs?.dimensions.frontalAreaM2.value).toBeCloseTo(2.12);

    // Verify aero features sourcing
    expect(gt3rs?.aeroFeatures.value.length).toBeGreaterThan(0);
    expect(gt3rs?.aeroFeatures.value[0]).toContain('radiator');

    // Verify read-only enforcement
    expect(() => ReferenceVehicleLibrary.attemptUpdate('porsche_911_gt3_rs_992')).toThrow(
      ReferenceVehicleReadOnlyError
    );
  });

  it('forks an immutable reference vehicle into an independent project with preserved lineage', () => {
    const ref = ReferenceVehicleLibrary.getReference('porsche_911_gt3_rs_992')!;
    const originalLength = ref.dimensions.lengthM.value;

    const project = ProjectManager.forkReferenceVehicle(
      'porsche_911_gt3_rs_992',
      'Track Day Evo 1',
      'Aerodynamic downforce optimization package'
    );

    expect(project.meta.id).toMatch(/^proj_/);
    expect(project.meta.name).toBe('Track Day Evo 1');
    expect(project.meta.lineage.referenceVehicleId).toBe('porsche_911_gt3_rs_992');
    expect(project.meta.lineage.parentProjectId).toBeUndefined();
    expect(project.meta.lineage.designerNotes).toContain('Aerodynamic downforce');

    // Check initialized components and feature DAG
    expect(project.components.length).toBeGreaterThanOrEqual(3);
    expect(project.components.some(c => c.id === 'front_splitter')).toBe(true);
    expect(project.featureDag.getAllFeatures().length).toBe(1);

    // Modify project dimensions
    project.dimensions.overallLengthM = 4.650;
    project.dimensions.overallWidthM = 2.020;

    // Verify original reference is strictly unmodified
    expect(ref.dimensions.lengthM.value).toBeCloseTo(originalLength);
    expect(ref.dimensions.lengthM.value).toBeCloseTo(4.572);
  });

  it('forks an existing project into a sub-variant preserving multi-generation lineage', () => {
    const parentProj = ProjectManager.forkReferenceVehicle(
      'ferrari_488_pista',
      'Pista Clubsport'
    );

    // Create child variant
    const childProj = ProjectManager.forkProjectVariant(parentProj.meta.id, 'Pista Clubsport Aero High-Downforce');

    expect(childProj.meta.id).not.toBe(parentProj.meta.id);
    expect(childProj.meta.lineage.parentProjectId).toBe(parentProj.meta.id);
    expect(childProj.meta.lineage.referenceVehicleId).toBe('ferrari_488_pista');
    expect(childProj.meta.lineage.forkReason).toContain('Variant branch of Pista Clubsport');

    // Modifying child does not alter parent
    childProj.dimensions.overallHeightM = 1.180;
    expect(parentProj.dimensions.overallHeightM).toBeCloseTo(1.206);
  });

  it('computes calibrated orthographic plane transforms with scale tick intervals', () => {
    const dimensions = { lengthM: 4.572, widthM: 1.900, heightM: 1.322, groundClearanceM: 0.100 };

    const sidePlane = CalibratedPlaneManager.calculatePlaneTransform(
      { view: 'left', url: '/test.png', scalePixelsPerMeter: 400, originPixel: [0, 0], opacity: 0.8, visible: true },
      dimensions
    );

    expect(sidePlane.planeWidthM).toBeGreaterThan(dimensions.lengthM);
    expect(sidePlane.planeHeightM).toBeGreaterThan(dimensions.heightM);
    expect(sidePlane.scaleTicks.intervalM).toBe(1.0);
    expect(sidePlane.scaleTicks.tickCount).toBe(5);

    const frontPlane = CalibratedPlaneManager.calculatePlaneTransform(
      { view: 'front', url: '/test.png', scalePixelsPerMeter: 400, originPixel: [0, 0], opacity: 0.8, visible: true },
      dimensions
    );

    expect(frontPlane.position[0]).toBeGreaterThan(dimensions.lengthM / 2); // Placed ahead of vehicle
    expect(frontPlane.scaleTicks.intervalM).toBe(0.5);

    // Create Three.js mesh
    const mesh = CalibratedPlaneManager.createCalibratedPlaneMesh(
      { view: 'left', url: '', scalePixelsPerMeter: 400, originPixel: [0, 0], opacity: 0.8, visible: true },
      sidePlane
    );
    expect(mesh.name).toBe('ref_plane_left');
    expect(mesh.visible).toBe(true);
  });
});
