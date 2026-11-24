import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  BRepPrimitives,
  BRepBooleanEngine,
  BRepSolid,
  PlaneSurface3D,
  CylinderSurface3D,
  BSplineSurface3D
} from '../src/geometry/cad/brep';
import { StepExporter } from '../src/geometry/cad/stepExporter';
import { StepValidator } from '../src/geometry/cad/stepValidator';

describe('AutoVerse 3D — Professional B-Rep CAD Kernel & Analytical STEP Pipeline', () => {
  describe('1. Topological B-Rep Primitives', () => {
    it('constructs an exact B-Rep Solid Box with Euler characteristic = 2', () => {
      const box = BRepPrimitives.createBox(2.0, 1.0, 4.0);

      expect(box).toBeInstanceOf(BRepSolid);
      expect(box.name).toBe('Solid_Box');
      expect(box.outerShell.faces.length).toBe(6);

      // Verify all 6 faces are planar
      box.outerShell.faces.forEach(f => {
        expect(f.surface.type).toBe('PLANE');
        expect(f.surface).toBeInstanceOf(PlaneSurface3D);
      });

      // Verify Euler Characteristic: V - E + F = 2 (8 - 12 + 6 = 2)
      const euler = box.getEulerCharacteristic();
      expect(euler).toBe(2);

      // Verify exact divergence theorem volume: 2 * 1 * 4 = 8.0 m³
      const volume = box.getVolume();
      expect(volume).toBeCloseTo(8.0, 2);

      // Verify surface area: 2*(2*1 + 2*4 + 1*4) = 2*(2 + 8 + 4) = 28.0 m²
      const area = box.getSurfaceArea();
      expect(area).toBeCloseTo(28.0, 2);

      // Verify bounding box
      const bbox = box.getBoundingBox();
      expect(bbox.min).toEqual([-1.0, -0.5, -2.0]);
      expect(bbox.max).toEqual([1.0, 0.5, 2.0]);

      // Tessellation to Three.js BufferGeometry
      const mesh = box.toMesh();
      expect(mesh.getAttribute('position').count).toBe(36); // 6 faces * 2 tris * 3 verts
    });

    it('constructs an exact Analytical B-Rep Cylinder with circular edges', () => {
      const radius = 0.5;
      const height = 2.0;
      const cyl = BRepPrimitives.createCylinder(radius, height);

      expect(cyl).toBeInstanceOf(BRepSolid);
      expect(cyl.outerShell.faces.length).toBe(3); // 2 planar caps + 1 cylindrical body

      const bodyFace = cyl.outerShell.faces.find(f => f.surface.type === 'CYLINDER');
      expect(bodyFace).toBeDefined();
      expect((bodyFace?.surface as CylinderSurface3D).radius).toBe(0.5);

      const capFaces = cyl.outerShell.faces.filter(f => f.surface.type === 'PLANE');
      expect(capFaces.length).toBe(2);

      // Volume = pi * r^2 * h = pi * 0.25 * 2 = pi/2 ~= 1.5708
      const volume = cyl.getVolume();
      const expectedVol = Math.PI * radius * radius * height;
      expect(volume).toBeCloseTo(expectedVol, 1);

      // Tessellates cleanly
      const mesh = cyl.toMesh();
      expect(mesh.getAttribute('position').count).toBeGreaterThan(50);
    });

    it('constructs an exact B-spline Lofted Solid between cross-sections', () => {
      const sections = [
        {
          points: [
            [-1.0, 0.0, -1.0],
            [1.0, 0.0, -1.0],
            [1.0, 0.0, 1.0],
            [-1.0, 0.0, 1.0]
          ] as Array<[number, number, number]>
        },
        {
          points: [
            [-0.8, 1.0, -0.8],
            [0.8, 1.0, -0.8],
            [0.8, 1.0, 0.8],
            [-0.8, 1.0, 0.8]
          ] as Array<[number, number, number]>
        },
        {
          points: [
            [-0.5, 2.0, -0.5],
            [0.5, 2.0, -0.5],
            [0.5, 2.0, 0.5],
            [-0.5, 2.0, 0.5]
          ] as Array<[number, number, number]>
        }
      ];

      const loft = BRepPrimitives.createLoft(sections, 'Aero_Diffuser_Loft');
      expect(loft).toBeInstanceOf(BRepSolid);
      expect(loft.outerShell.faces.length).toBe(3);

      const skinFace = loft.outerShell.faces.find(f => f.surface.type === 'BSPLINE');
      expect(skinFace).toBeDefined();
      expect(skinFace?.surface).toBeInstanceOf(BSplineSurface3D);

      const volume = loft.getVolume();
      expect(volume).toBeGreaterThan(0);
    });
  });

  describe('2. Solid CSG Boolean Engine', () => {
    it('computes Boolean Difference carving a pocket/cavity into a block', () => {
      const block = BRepPrimitives.createBox(2.0, 2.0, 2.0, [0, 0, 0]);
      const cutter = BRepPrimitives.createBox(1.0, 1.0, 1.0, [0, 0, 0]); // Nested centered cube

      const result = BRepBooleanEngine.difference(block, cutter, 'Block_With_Cavity');
      expect(result).toBeInstanceOf(BRepSolid);

      const origVol = block.getVolume(); // 8.0
      const cutVol = cutter.getVolume(); // 1.0
      const resVol = result.getVolume();

      // Volume of difference must be approximately 8 - 1 = 7.0 m³
      expect(resVol).toBeLessThan(origVol);
      expect(resVol).toBeCloseTo(origVol - cutVol, 0.5);
    });

    it('computes Boolean Union merging two adjacent solid components', () => {
      const chassis = BRepPrimitives.createBox(2.0, 1.0, 4.0, [0, 0.5, 0]);
      const spoiler = BRepPrimitives.createBox(1.8, 0.2, 0.5, [0, 1.2, 1.8]);

      const fused = BRepBooleanEngine.union(chassis, spoiler, 'Chassis_With_Wing');
      expect(fused).toBeInstanceOf(BRepSolid);

      const volChassis = chassis.getVolume();
      const volSpoiler = spoiler.getVolume();
      const volFused = fused.getVolume();

      // Union volume must be greater than chassis alone
      expect(volFused).toBeGreaterThan(volChassis);
      expect(volFused).toBeLessThanOrEqual(volChassis + volSpoiler + 0.1);
    });
  });

  describe('3. Analytical ISO 10303-21 STEP AP214 Exporter', () => {
    it('exports a B-Rep box with analytical PLANE and ADVANCED_FACE entities', () => {
      const box = BRepPrimitives.createBox(2.0, 1.0, 3.0);
      const step = StepExporter.exportSolidToStep(box, {
        modelName: 'engine_bay_bracket',
        schema: 'AP214'
      });

      expect(step.startsWith('ISO-10303-21;')).toBe(true);
      expect(step).toContain('FILE_SCHEMA((\'AUTOMOTIVE_DESIGN');
      expect(step).toContain('MANIFOLD_SOLID_BREP(\'engine_bay_bracket\'');
      expect(step).toContain('ADVANCED_BREP_SHAPE_REPRESENTATION');
      expect(step).toContain('ADVANCED_FACE');
      expect(step).toContain('PLANE');
      expect(step).toContain('EDGE_CURVE');
      expect(step).toContain('ORIENTED_EDGE');
      expect(step).toContain('EDGE_LOOP');
      expect(step).toContain('VERTEX_POINT');
      expect(step).toContain('CLOSED_SHELL');
      expect(step.endsWith('END-ISO-10303-21;\n')).toBe(true);
    });

    it('exports a B-Rep cylinder with CYLINDRICAL_SURFACE and CIRCLE curves', () => {
      const cyl = BRepPrimitives.createCylinder(0.4, 1.5);
      const step = StepExporter.exportSolidToStep(cyl, {
        modelName: 'strut_damper_body',
        schema: 'AP214'
      });

      expect(step).toContain('CYLINDRICAL_SURFACE');
      expect(step).toContain('CIRCLE');
      expect(step).toContain('ADVANCED_FACE');
      expect(step).toContain('MANIFOLD_SOLID_BREP');
    });

    it('exports a B-spline loft with B_SPLINE_SURFACE_WITH_KNOTS', () => {
      const sections = [
        { points: [[-1, 0, -1], [1, 0, -1], [1, 0, 1], [-1, 0, 1]] as Array<[number, number, number]> },
        { points: [[-0.5, 1, -0.5], [0.5, 1, -0.5], [0.5, 1, 0.5], [-0.5, 1, 0.5]] as Array<[number, number, number]> }
      ];
      const loft = BRepPrimitives.createLoft(sections, 'Front_Splitter');
      const step = StepExporter.exportSolidToStep(loft, { modelName: 'front_splitter' });

      expect(step).toContain('B_SPLINE_SURFACE_WITH_KNOTS');
      expect(step).toContain('ADVANCED_FACE');
      expect(step).toContain('MANIFOLD_SOLID_BREP');
    });
  });

  describe('4. STEP Roundtrip Verification via StepValidator', () => {
    it('rigorously validates exported analytical STEP box in roundtrip', () => {
      const box = BRepPrimitives.createBox(2.0, 1.0, 4.0);
      const stepContent = StepExporter.exportSolidToStep(box, { modelName: 'monocoque_tub' });

      const report = StepValidator.validateStepContent(stepContent);

      expect(report.isValidStep).toBe(true);
      expect(report.isAdvancedBrep).toBe(true);
      expect(report.schema).toContain('AUTOMOTIVE_DESIGN');
      expect(report.solidCount).toBe(1);
      expect(report.shellCount).toBe(1);
      expect(report.faceCount).toBe(6);
      expect(report.surfaceTypes.planes).toBe(6);
      expect(report.surfaceTypes.cylinders).toBe(0);
      expect(report.surfaceTypes.bSplines).toBe(0);

      // Verify dimensions
      expect(report.dimensionsM.lengthX).toBeCloseTo(2.0, 2);
      expect(report.dimensionsM.widthY).toBeCloseTo(1.0, 2);
      expect(report.dimensionsM.heightZ).toBeCloseTo(4.0, 2);

      // Volume close to 8.0 m³
      expect(report.volumeM3).toBeCloseTo(8.0, 1);
    });

    it('rigorously validates exported analytical STEP cylinder in roundtrip', () => {
      const cyl = BRepPrimitives.createCylinder(0.5, 2.0);
      const stepContent = StepExporter.exportSolidToStep(cyl, { modelName: 'wheel_hub' });

      const report = StepValidator.validateStepContent(stepContent);

      expect(report.isValidStep).toBe(true);
      expect(report.isAdvancedBrep).toBe(true);
      expect(report.surfaceTypes.cylinders).toBe(1);
      expect(report.surfaceTypes.planes).toBe(2);
      expect(report.solidCount).toBe(1);
    });
  });
});
