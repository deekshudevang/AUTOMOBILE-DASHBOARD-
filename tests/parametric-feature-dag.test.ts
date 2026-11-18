import { describe, it, expect } from 'vitest';
import { FeatureDagEngine, FeatureNode } from '../src/geometry/parametric/featureDag';
import { DimensionConstraintSolver, DrivingDimensions } from '../src/geometry/parametric/constraintSolver';
import { SemanticAnchorRegistry } from '../src/geometry/parametric/semanticAnchors';

describe('AutoVerse 3D — Phase 5: Parametric Feature DAG & Constraint Engine Suite', () => {
  describe('Feature DAG Engine', () => {
    it('constructs a dependency tree and executes topological sorting', () => {
      const dag = new FeatureDagEngine();

      dag.addFeature({
        id: 'datum_plane_1',
        name: 'Front Axle Ground Datum',
        type: 'DATUM_PLANE',
        parameters: { z: 0.0 },
        parentIds: []
      });

      dag.addFeature({
        id: 'sketch_section_1',
        name: 'Front Cowl Cross Section',
        type: 'SKETCH_SECTION',
        parameters: { width: 1.8, height: 0.8 },
        parentIds: ['datum_plane_1']
      });

      dag.addFeature({
        id: 'loft_body_1',
        name: 'Aerodynamic Monocoque Loft',
        type: 'LOFT_BODY',
        parameters: { sections: ['sketch_section_1'] },
        parentIds: ['sketch_section_1']
      });

      dag.addFeature({
        id: 'fillet_1',
        name: 'A-Pillar Corner Fillet',
        type: 'FILLET_CHAMFER',
        parameters: { radius: 0.05 },
        parentIds: ['loft_body_1']
      });

      const order = dag.getTopologicalOrder();
      expect(order).toEqual(['datum_plane_1', 'sketch_section_1', 'loft_body_1', 'fillet_1']);
    });

    it('isolates failures when a downstream feature rebuild fails without corrupting valid upstream nodes', () => {
      const dag = new FeatureDagEngine();

      dag.addFeature({ id: 'root', name: 'Root Datum', type: 'DATUM_PLANE', parameters: { val: 1 }, parentIds: [] });
      dag.addFeature({ id: 'child1', name: 'Child 1', type: 'SKETCH_SECTION', parameters: { val: 2 }, parentIds: ['root'] });
      dag.addFeature({ id: 'child2', name: 'Child 2 (Faulty)', type: 'FILLET_CHAMFER', parameters: { val: -99 }, parentIds: ['child1'] });
      dag.addFeature({ id: 'grandchild', name: 'Grandchild', type: 'SHELL_HOLLOW', parameters: { val: 4 }, parentIds: ['child2'] });

      // Simulate a rebuilder that fails on negative values
      const { failedNodeId } = dag.updateFeature('root', { val: 10 }, (node) => {
        if (node.parameters.val < 0) {
          return { success: false, hash: '', error: 'Negative fillet radius rejected by kernel' };
        }
        return { success: true, hash: `hash_${node.id}` };
      });

      expect(failedNodeId).toBe('child2');
      expect(dag.getFeature('root')?.status).toBe('VALID');
      expect(dag.getFeature('child1')?.status).toBe('VALID');
      expect(dag.getFeature('child2')?.status).toBe('FAILED');
      expect(dag.getFeature('child2')?.errorMessage).toContain('Negative fillet radius');
      expect(dag.getFeature('grandchild')?.status).toBe('STALE');
    });

    it('supports undo and redo of parameter states', () => {
      const dag = new FeatureDagEngine();
      dag.addFeature({ id: 'p1', name: 'Param 1', type: 'DATUM_PLANE', parameters: { x: 10 }, parentIds: [] });

      dag.updateFeature('p1', { x: 20 });
      expect(dag.getFeature('p1')?.parameters.x).toBe(20);

      const didUndo = dag.undo();
      expect(didUndo).toBe(true);
      expect(dag.getFeature('p1')?.parameters.x).toBe(10);

      const didRedo = dag.redo();
      expect(didRedo).toBe(true);
      expect(dag.getFeature('p1')?.parameters.x).toBe(20);
    });
  });

  describe('Dimension Constraint Solver', () => {
    const validDriving: DrivingDimensions = {
      wheelbase: 2.70,
      frontOverhang: 0.95,
      rearOverhang: 1.05,
      overallWidth: 2.05,
      frontTrack: 1.70,
      rearTrack: 1.72,
      groundClearance: 0.10,
      cabinHeight: 1.15
    };

    it('solves driven dimensions and validates mathematical consistency', () => {
      const { driven, hardpoints, conflicts } = DimensionConstraintSolver.solveDimensions(validDriving);

      expect(conflicts.length).toBe(0);
      expect(driven.overallLength).toBeCloseTo(4.70, 2); // 0.95 + 2.70 + 1.05
      expect(driven.overallHeight).toBeCloseTo(1.25, 2); // 0.10 + 1.15
      expect(driven.aspectRatioLtoW).toBeGreaterThan(2.0);

      // Verify SAE hardpoint coordinates
      // Front axle at X = 0, Rear axle at X = -2.70
      expect(hardpoints.frontAxleCenter[0]).toBe(0.0);
      expect(hardpoints.rearAxleCenter[0]).toBe(-2.70);
      // Front bumper tip at X = +0.95
      expect(hardpoints.frontBumperTip[0]).toBe(0.95);
      // Rear bumper tip at X = -2.70 - 1.05 = -3.75
      expect(hardpoints.rearBumperTip[0]).toBe(-3.75);
    });

    it('detects out-of-bounds parameters and over-constrained states', () => {
      const invalidDriving: DrivingDimensions = {
        ...validDriving,
        wheelbase: 0.8, // Impossibly short (< 1.6m)
        frontTrack: 2.20 // Exceeds overallWidth 2.05m
      };

      const { conflicts } = DimensionConstraintSolver.solveDimensions(invalidDriving);
      expect(conflicts.length).toBeGreaterThanOrEqual(2);

      const wbConflict = conflicts.find(c => c.parameter === 'wheelbase');
      expect(wbConflict).toBeDefined();
      expect(wbConflict?.type).toBe('OUT_OF_BOUNDS');

      const trackConflict = conflicts.find(c => c.parameter === 'track');
      expect(trackConflict).toBeDefined();
      expect(trackConflict?.type).toBe('OVER_CONSTRAINED');
    });
  });

  describe('Semantic Anchor Registry', () => {
    it('registers and retrieves stable automotive datum anchors', () => {
      const reg = SemanticAnchorRegistry.createStandardVehicleAnchors();
      const frontAxle = reg.getAnchor('DATUM_FRONT_AXLE');
      const wingDeck = reg.getAnchor('ANCHOR_REAR_WING_DECK');

      expect(frontAxle).toBeDefined();
      expect(frontAxle?.isDatum).toBe(true);
      expect(frontAxle?.nominalCoordinates).toEqual([0.0, 0.0, 0.33]);

      expect(wingDeck).toBeDefined();
      expect(wingDeck?.parentComponentId).toBe('engine_cover');
      expect(wingDeck?.nominalCoordinates[0]).toBeLessThan(0); // Rear of vehicle (-X)
    });
  });
});
