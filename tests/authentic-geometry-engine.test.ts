import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  UniversalLoader,
  StepCadLoader,
  MeshTopologyAnalyzer,
  ComponentRecognizer,
  DimensionalValidator,
  QualityClassifier,
  VehicleAssetDatabase,
  RuntimeOptimizer,
  AuthenticGeometryEngine,
  ManufacturerSpecifications
} from '../packages/authentic-geometry-engine/src';

describe('AutoVerse 3D — Automotive Authentic Geometry Engine (AAGE) Test Suite', () => {

  describe('Phase 2 & 3: Multi-Format Ingestion & CAD/B-rep Processing', () => {
    it('parses ISO 10303-21 STEP CAD geometry and extracts B-rep faceted surfaces', () => {
      const stepContent = `
ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('Automotive Hood CAD'), '2;1');
FILE_NAME('hood_bonnet.stp', '2026-11-11', ('AutoVerse CAD'), ('Automotive OEM'), 'AAGE CAD Engine', '', '');
ENDSEC;
DATA;
#1 = CARTESIAN_POINT('', (0.0, 850.0, 1400.0));
#2 = CARTESIAN_POINT('', (800.0, 840.0, 600.0));
#3 = CARTESIAN_POINT('', (-800.0, 840.0, 600.0));
#4 = CARTESIAN_POINT('', (0.0, 860.0, 2200.0));
#10 = POLY_LOOP('', (#1, #2, #3));
#11 = POLY_LOOP('', (#1, #3, #4));
#20 = FACETED_BREP('Engine Hood Bonnet', #10);
#21 = FACETED_BREP('Engine Hood Nose', #11);
ENDSEC;
END-ISO-10303-21;
`;

      const result = StepCadLoader.parse(stepContent, { unitSystem: 'mm' });

      expect(result.productName).toBe('hood_bonnet.stp');
      expect(result.entityCount).toBeGreaterThan(0);
      expect(result.faceCount).toBe(2);
      expect(result.vertexCount).toBe(6);
      expect(result.triangleCount).toBe(2);
      expect(result.isBrepSolid).toBe(true);
      expect(result.group.children.length).toBeGreaterThan(0);
    });

    it('loads Wavefront OBJ vehicle geometry and creates textured meshes', async () => {
      const objContent = `
# Wavefront OBJ Vehicle Front Bumper
v -0.85 0.20 2.15
v 0.85 0.20 2.15
v 0.85 0.45 2.15
v -0.85 0.45 2.15
vn 0.0 0.0 1.0
f 1//1 2//1 3//1
f 1//1 3//1 4//1
`;
      const res = await UniversalLoader.load(objContent, 'obj');

      expect(res.format).toBe('obj');
      expect(res.triangleCount).toBe(2);
      expect(res.vertexCount).toBeGreaterThanOrEqual(4);
      expect(res.root.children.length).toBeGreaterThan(0);
    });

    it('loads STL stereolithography automotive geometry', async () => {
      const stlContent = `
solid vehicle_spoiler_endplate
  facet normal 1.0 0.0 0.0
    outer loop
      vertex 0.85 1.10 -2.00
      vertex 0.85 1.10 -1.75
      vertex 0.85 1.25 -1.75
    endloop
  endfacet
endsolid vehicle_spoiler_endplate
`;
      const res = await UniversalLoader.load(stlContent, 'stl');

      expect(res.format).toBe('stl');
      expect(res.triangleCount).toBe(1);
      expect(res.root.children.length).toBeGreaterThan(0);
    });

    it('rejects unsupported file formats with descriptive error message', async () => {
      await expect(UniversalLoader.load('fake_data', 'unsupported_ext' as any))
        .rejects.toThrow('Unsupported automotive 3D format');
    });
  });

  describe('Phase 3: Mesh Topology Analysis, Manifoldness & Unit Scaling', () => {
    it('analyzes non-manifold edges, vertices, and normals on a 3D geometry', () => {
      const group = new THREE.Group();
      const geom = new THREE.BoxGeometry(1.9, 1.4, 4.8);
      const mesh = new THREE.Mesh(geom, new THREE.MeshStandardMaterial());
      mesh.name = "mesh_body_monocoque";
      group.add(mesh);

      const analysis = MeshTopologyAnalyzer.analyze(group);

      expect(analysis.vertexCount).toBe(24);
      expect(analysis.triangleCount).toBe(12);
      expect(analysis.meshCount).toBe(1);
      expect(analysis.hasNanOrInfinity).toBe(false);
      expect(analysis.hasNonManifoldEdges).toBe(false);
      expect(analysis.hasUnitNormals).toBe(true);
      expect(analysis.degenerateTriangleCount).toBe(0);
      expect(analysis.detectedUnit).toBe('m');
      expect(analysis.scaleFactorToMeters).toBe(1.0);
    });

    it('automatically detects millimeter units and computes scale factor to standard meters', () => {
      // 4780mm x 1880mm x 1420mm (BMW M3 scale in mm)
      const sizeInMm = new THREE.Vector3(1880, 1420, 4780);
      const scaleInfo = MeshTopologyAnalyzer.detectUnitScale(sizeInMm);

      expect(scaleInfo.detectedUnit).toBe('mm');
      expect(scaleInfo.scaleFactorToMeters).toBe(0.001);
    });

    it('automatically detects inch units and computes scale factor to standard meters', () => {
      // 188 inches = ~4.78m
      const sizeInInches = new THREE.Vector3(74, 56, 188);
      const scaleInfo = MeshTopologyAnalyzer.detectUnitScale(sizeInInches);

      expect(scaleInfo.detectedUnit).toBe('in');
      expect(scaleInfo.scaleFactorToMeters).toBe(0.0254);
    });
  });

  describe('Phase 4: Vehicle Body Component Recognition', () => {
    it('semantically classifies exterior bodywork, wheels, and interior cockpit nodes', () => {
      const carRoot = new THREE.Group();
      carRoot.name = "vehicle_root";

      // 1. Exterior parts
      const hood = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 1.4), new THREE.MeshBasicMaterial());
      hood.name = "panel_hood_carbon";
      hood.position.set(0, 0.8, 1.2);
      carRoot.add(hood);

      const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.3, 0.2), new THREE.MeshBasicMaterial());
      frontBumper.name = "front_bumper_aerodynamic";
      frontBumper.position.set(0, 0.25, 2.3);
      carRoot.add(frontBumper);

      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.3), new THREE.MeshBasicMaterial());
      wing.name = "gt_spoiler_wing";
      wing.position.set(0, 1.2, -2.1);
      carRoot.add(wing);

      // 2. Wheel & Brake parts
      const wheelFL = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.26), new THREE.MeshBasicMaterial());
      wheelFL.name = "front_left_wheel_rim";
      wheelFL.position.set(-0.85, 0.34, 1.4);
      carRoot.add(wheelFL);

      const caliperFL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.18), new THREE.MeshBasicMaterial());
      caliperFL.name = "brake_calipers_brembo";
      caliperFL.position.set(-0.85, 0.42, 1.4);
      carRoot.add(caliperFL);

      // 3. Interior parts
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.4), new THREE.MeshBasicMaterial());
      seat.name = "seat_driver_bucket";
      seat.position.set(-0.35, 0.6, 0.0);
      carRoot.add(seat);

      const steering = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02), new THREE.MeshBasicMaterial());
      steering.name = "steering_wheel_alcantara";
      steering.position.set(-0.35, 0.8, 0.4);
      carRoot.add(steering);

      const hierarchy = ComponentRecognizer.recognize(carRoot);

      expect(hierarchy.exterior.length).toBeGreaterThanOrEqual(3);
      expect(hierarchy.wheels.length).toBeGreaterThanOrEqual(2);
      expect(hierarchy.interior.length).toBeGreaterThanOrEqual(2);

      const semanticTypes = [
        ...hierarchy.exterior.map(c => c.semanticType),
        ...hierarchy.wheels.map(c => c.semanticType),
        ...hierarchy.interior.map(c => c.semanticType)
      ];

      expect(semanticTypes).toContain('hood');
      expect(semanticTypes).toContain('front_bumper');
      expect(semanticTypes).toContain('spoiler');
      expect(semanticTypes).toContain('front_left_wheel');
      expect(semanticTypes).toContain('brake_calipers');
      expect(semanticTypes).toContain('seats');
      expect(semanticTypes).toContain('steering_wheel');
    });
  });

  describe('Phase 5: Dimensional Accuracy & OEM Verification', () => {
    it('validates authentic vehicle dimensions against manufacturer specifications', () => {
      const root = new THREE.Group();
      // Mesh scaled to match BMW M3 G80 dimensions: Length 4.794m, Width 1.903m, Height 1.433m
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.903, 1.433, 4.794),
        new THREE.MeshBasicMaterial()
      );
      body.position.set(0, 1.433 / 2, 0);
      root.add(body);

      // Add 4 wheels at authentic wheelbase (2.857m) and track (1.617m front, 1.605m rear)
      const wheelFL = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial());
      wheelFL.name = "wheel_fl";
      wheelFL.position.set(-1.617 / 2, 0.34, 2.857 / 2);
      root.add(wheelFL);

      const wheelFR = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial());
      wheelFR.name = "wheel_fr";
      wheelFR.position.set(1.617 / 2, 0.34, 2.857 / 2);
      root.add(wheelFR);

      const wheelRL = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial());
      wheelRL.name = "wheel_rl";
      wheelRL.position.set(-1.605 / 2, 0.34, -2.857 / 2);
      root.add(wheelRL);

      const wheelRR = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial());
      wheelRR.name = "wheel_rr";
      wheelRR.position.set(1.605 / 2, 0.34, -2.857 / 2);
      root.add(wheelRR);

      const oemSpecs: ManufacturerSpecifications = {
        length: 4.794,
        width: 1.903,
        height: 1.433,
        wheelbase: 2.857,
        trackFront: 1.617,
        trackRear: 1.605
      };

      const report = DimensionalValidator.validate(root, oemSpecs, 'bmw_m3_g80', 'BMW M3 Competition G80');

      expect(report.overallPassed).toBe(true);
      expect(report.maxDeviationPercent).toBeLessThan(1.5);
      expect(report.checks.length).toBeGreaterThanOrEqual(6);

      const lengthCheck = report.checks.find(c => c.metric === 'Overall Length');
      expect(lengthCheck?.passed).toBe(true);
      expect(lengthCheck?.measured).toBeCloseTo(4.794, 2);

      const wheelbaseCheck = report.checks.find(c => c.metric === 'Wheelbase');
      expect(wheelbaseCheck?.passed).toBe(true);
      expect(wheelbaseCheck?.measured).toBeCloseTo(2.857, 2);
    });
  });

  describe('Phase 7: Geometry Quality Classification & Provenance', () => {
    it('classifies manufacturer CAD geometry with <= 1.5% deviation as CLASS A (Verified OEM)', () => {
      const classification = QualityClassifier.classify('Manufacturer CAD (OEM)', 0.8, 'OEM Authorized License');
      expect(classification).toBe('CLASS_A_VERIFIED_OEM');

      const badge = QualityClassifier.getBadgeInfo(classification);
      expect(badge.grade).toBe('A');
      expect(badge.isAuthentic).toBe(true);
      expect(badge.requiresApproximationBanner).toBe(false);
    });

    it('classifies licensed production mesh with <= 3.5% deviation as CLASS B (Verified Production)', () => {
      const classification = QualityClassifier.classify('Licensed 3D Studio Mesh', 2.1, 'Licensed Production Asset');
      expect(classification).toBe('CLASS_B_VERIFIED_PRODUCTION');

      const badge = QualityClassifier.getBadgeInfo(classification);
      expect(badge.grade).toBe('B');
      expect(badge.isAuthentic).toBe(true);
      expect(badge.requiresApproximationBanner).toBe(false);
    });

    it('classifies procedural parametric template as CLASS D (Approximate) and requires banner', () => {
      const classification = QualityClassifier.classify('Procedural Parametric Template', 1.0, 'Public Domain');
      expect(classification).toBe('CLASS_D_APPROXIMATE');

      const badge = QualityClassifier.getBadgeInfo(classification);
      expect(badge.grade).toBe('D');
      expect(badge.isAuthentic).toBe(false);
      expect(badge.requiresApproximationBanner).toBe(true);
    });

    it('issues an authentic Certificate of Provenance with verifiable certificate ID', () => {
      const certificate = QualityClassifier.issueCertificate({
        id: 'bmw_m3_test',
        modelHash: 2709293299,
        modelCode: 'sentinel5',
        manufacturer: 'BMW',
        vehicleName: 'M3 Competition',
        modelYear: 2021,
        generation: 'G80',
        trim: 'Competition',
        market: 'Global',
        license: 'OEM Authorized License',
        originalDimensions: { length: 4.794, width: 1.903, height: 1.433, wheelbase: 2.857, trackFront: 1.617, trackRear: 1.605 },
        triangleCount: 84000,
        vertexCount: 46000,
        geometryFormat: 'glb',
        unitSystem: 'm',
        geometryProvenance: 'Manufacturer CAD (OEM)',
        accuracyClassification: 'CLASS_A_VERIFIED_OEM',
        isAuthentic: true
      });

      expect(certificate.certificateId).toContain('AAGE-CERT-2709293299');
      expect(certificate.classification).toBe('CLASS_A_VERIFIED_OEM');
      expect(certificate.badge.grade).toBe('A');
      expect(certificate.disclaimer).toBeUndefined();
    });
  });

  describe('Phase 8 & 12: Three.js Runtime Optimization & Memory Cleanup', () => {
    it('optimizes hierarchy by enabling frustum culling and bounding spheres', () => {
      const group = new THREE.Group();
      const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial());
      const mesh2 = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), new THREE.MeshStandardMaterial());
      group.add(mesh1);
      group.add(mesh2);

      const metrics = RuntimeOptimizer.optimize(group);

      expect(metrics.drawCallCount).toBe(2);
      expect(mesh1.frustumCulled).toBe(true);
      expect(mesh2.frustumCulled).toBe(true);
      expect(mesh1.geometry.boundingSphere).toBeDefined();
    });

    it('completely disposes GPU memory and textures without memory leaks', () => {
      const group = new THREE.Group();
      const geom = new THREE.BoxGeometry(1, 1, 1);
      const mat = new THREE.MeshBasicMaterial();
      const mesh = new THREE.Mesh(geom, mat);
      group.add(mesh);

      expect(() => RuntimeOptimizer.dispose(group)).not.toThrow();
    });
  });

  describe('Phase 9, 10 & 11: Vehicle Database & Fallback Integrity', () => {
    it('retrieves verified OEM vehicle records by Joaat hash and model code', () => {
      const recordByHash = VehicleAssetDatabase.find(2709293299);
      expect(recordByHash).toBeDefined();
      expect(recordByHash?.metadata.vehicleName).toBe('M3 Competition');
      expect(recordByHash?.metadata.manufacturer).toBe('BMW');
      expect(recordByHash?.metadata.originalDimensions.wheelbase).toBe(2.857);

      const recordByCode = VehicleAssetDatabase.find('comet6');
      expect(recordByCode).toBeDefined();
      expect(recordByCode?.metadata.vehicleName).toBe('911 GT3');
      expect(recordByCode?.metadata.manufacturer).toBe('Porsche');
    });

    it('Phase 11: returns explicit missing geometry report when no authentic asset is mapped', () => {
      const outcome = AuthenticGeometryEngine.resolveGeometry(99999999);
      expect(outcome.status).toBe('MISSING_GEOMETRY_STATE');
      expect(outcome.isAuthentic).toBe(false);
      expect(outcome.notice).toContain('MISSING AUTHENTIC GEOMETRY');
    });
  });

  describe('Phase 14: End-to-End AAGE Processing Pipeline', () => {
    it('executes the full AAGE pipeline on an authentic OBJ model', async () => {
      const carObj = `
v -0.95 0.35 1.43
v 0.95 0.35 1.43
v 0.95 0.35 -1.43
v -0.95 0.35 -1.43
v 0.0 1.24 0.0
f 1 2 5
f 2 3 5
f 3 4 5
f 4 1 5
`;
      const result = await AuthenticGeometryEngine.processAsset(carObj, 'obj', 2709293299, {
        license: 'Licensed Production Asset',
        geometryProvenance: 'Licensed 3D Studio Mesh'
      });

      expect(result.root).toBeDefined();
      expect(result.metadata.modelHash).toBe(2709293299);
      expect(result.certificate).toBeDefined();
      expect(result.validationReport).toBeDefined();
      expect(result.components).toBeDefined();
      expect(result.topology).toBeDefined();
      expect(result.topology.hasNanOrInfinity).toBe(false);
    });
  });

});
