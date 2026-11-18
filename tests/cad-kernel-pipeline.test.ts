import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { CoordinateConventions, CAD_TOLERANCES } from '../src/geometry/cad/conventions';
import { ContinuityAnalyzer } from '../src/geometry/cad/continuityAnalyzer';
import { MeshDiagnostics } from '../src/geometry/cad/meshDiagnostics';
import { StepExporter } from '../src/geometry/cad/stepExporter';
import { CadWorkerManager } from '../src/geometry/cad/cadWorkerManager';

describe('AutoVerse 3D — Phase 4: CAD Kernel & Geometry Pipeline Suite', () => {
  describe('Coordinate Conventions (ISO 8855 / SAE to Three.js)', () => {
    it('accurately transforms SAE coordinates to Three.js WebGL frame', () => {
      // SAE: X forward 2.0m, Y left 0.8m, Z up 1.2m
      const threeVec = CoordinateConventions.saeToThree(2.0, 0.8, 1.2);
      expect(threeVec.x).toBeCloseTo(-0.8); // Three.js X = -SAE Y
      expect(threeVec.y).toBeCloseTo(1.2);  // Three.js Y = SAE Z
      expect(threeVec.z).toBeCloseTo(-2.0); // Three.js Z = -SAE X

      // Round-trip identity
      const saeRoundTrip = CoordinateConventions.threeToSae(threeVec.x, threeVec.y, threeVec.z);
      expect(saeRoundTrip.x).toBeCloseTo(2.0);
      expect(saeRoundTrip.y).toBeCloseTo(0.8);
      expect(saeRoundTrip.z).toBeCloseTo(1.2);
    });

    it('converts an array of SAE points to a packed Float32Array', () => {
      const points: Array<[number, number, number]> = [
        [1.0, 0.5, 0.2],
        [2.0, -0.5, 0.4]
      ];
      const buffer = CoordinateConventions.saePointsToThreeBuffer(points);
      expect(buffer.length).toBe(6);
      expect(buffer[0]).toBeCloseTo(-0.5);
      expect(buffer[1]).toBeCloseTo(0.2);
      expect(buffer[2]).toBeCloseTo(-1.0);
    });
  });

  describe('Surface Continuity Analyzer (G0, G1, G2)', () => {
    it('detects G0 and G1 continuity across two flush coplanar patches', () => {
      const geoA = new THREE.PlaneGeometry(1, 1, 4, 4);
      geoA.translate(-0.5, 0, 0);
      const meshA = new THREE.Mesh(geoA);
      meshA.name = 'patchA';

      const geoB = new THREE.PlaneGeometry(1, 1, 4, 4);
      geoB.translate(0.5, 0, 0);
      const meshB = new THREE.Mesh(geoB);
      meshB.name = 'patchB';

      const report = ContinuityAnalyzer.analyzePatchPair(meshA, meshB);
      expect(report.g0Passed).toBe(true);
      expect(report.g0MaxDistanceMm).toBeLessThan(1.0); // Seam gap within tolerance
      expect(report.g1Passed).toBe(true);
      expect(report.g1MaxAngleDeg).toBeLessThan(0.1); // Coplanar normals
    });

    it('creates a valid Zebra reflection inspection shader', () => {
      const mat = ContinuityAnalyzer.createZebraMaterial(25.0);
      expect(mat).toBeInstanceOf(THREE.ShaderMaterial);
      expect(mat.uniforms.stripeFrequency.value).toBe(25.0);
      expect(mat.vertexShader).toContain('vNormal');
      expect(mat.fragmentShader).toContain('stripeFrequency');
    });

    it('generates 3D curvature comb line segments', () => {
      const curve = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 0.2, 0),
        new THREE.Vector3(2, 0.8, 0),
        new THREE.Vector3(3, 1.8, 0)
      ];
      const comb = ContinuityAnalyzer.generateCurvatureComb(curve);
      expect(comb).toBeInstanceOf(THREE.LineSegments);
      expect(comb.geometry.getAttribute('position').count).toBe(4); // 2 inner segments * 2 points
    });
  });

  describe('Mesh Diagnostics & Topological Healing', () => {
    it('verifies a closed BoxGeometry is 100% watertight and 2-manifold', () => {
      const box = new THREE.BoxGeometry(1, 1, 1);
      const report = MeshDiagnostics.auditGeometry(box);

      expect(report.isWatertight).toBe(true);
      expect(report.is2Manifold).toBe(true);
      expect(report.boundaryEdgeCount).toBe(0);
      expect(report.nonManifoldEdgeCount).toBe(0);
      expect(report.cfdReady).toBe(true);
    });

    it('identifies open boundary edges on an open sheet', () => {
      const sheet = new THREE.PlaneGeometry(1, 1);
      const report = MeshDiagnostics.auditGeometry(sheet);

      expect(report.isWatertight).toBe(false);
      expect(report.boundaryEdgeCount).toBe(4);
      expect(report.issues.length).toBeGreaterThan(0);
      expect(report.issues[0].type).toBe('HOLE_BOUNDARY_EDGE');
    });

    it('heals a geometry by welding duplicate vertices', () => {
      // Create geometry with duplicate vertices
      const pos = new Float32Array([
        0, 0, 0,  1, 0, 0,  0, 1, 0, // Triangle 1
        0, 0, 0,  1, 0, 0,  1, 1, 0  // Triangle 2 (repeating (0,0,0) and (1,0,0))
      ]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

      const { healedGeo, verticesWelded } = MeshDiagnostics.healGeometry(geo);
      expect(verticesWelded).toBe(2);
      expect(healedGeo.getAttribute('position').count).toBe(4); // 4 unique vertices instead of 6
      expect(healedGeo.getIndex()?.count).toBe(6);
    });
  });

  describe('STEP AP214 Exporter & Parser', () => {
    it('exports a valid ISO 10303-21 STEP file', () => {
      const box = new THREE.BoxGeometry(2, 1, 4);
      const stepContent = StepExporter.exportToStep(box, {
        modelName: 'chassis_monocoque',
        schema: 'AP214'
      });

      expect(stepContent.startsWith('ISO-10303-21;')).toBe(true);
      expect(stepContent).toContain('FILE_SCHEMA((\'AUTOMOTIVE_DESIGN');
      expect(stepContent).toContain('MANIFOLD_SOLID_BREP(\'chassis_monocoque\'');
      expect(stepContent).toContain('CLOSED_SHELL');
      expect(stepContent.endsWith('END-ISO-10303-21;\n')).toBe(true);

      // Verify metadata parser
      const meta = StepExporter.parseStepMetadata(stepContent);
      expect(meta.isValidStep).toBe(true);
      expect(meta.schema).toContain('AUTOMOTIVE_DESIGN');
    });
  });

  describe('Asynchronous CAD Worker Manager', () => {
    it('executes background STEP export with progress events', async () => {
      const box = new THREE.BoxGeometry(1, 1, 1);
      const progressSteps: number[] = [];

      const step = await CadWorkerManager.exportToStepAsync(box, { modelName: 'test_box' }, (p) => {
        progressSteps.push(p.percent);
      });

      expect(step.length).toBeGreaterThan(100);
      expect(progressSteps).toContain(10);
      expect(progressSteps).toContain(50);
      expect(progressSteps).toContain(100);
    });

    it('asynchronously audits and heals a mesh', async () => {
      const box = new THREE.BoxGeometry(1, 1, 1);
      const { audit } = await CadWorkerManager.auditAndHealAsync(box);

      expect(audit.isWatertight).toBe(true);
      expect(audit.cfdReady).toBe(true);
    });
  });
});
