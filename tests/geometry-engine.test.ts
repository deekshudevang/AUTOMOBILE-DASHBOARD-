import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  ARCHETYPE_TEMPLATES,
  validateGeometryProfile,
  LongitudinalProfileGenerator,
  CrossSectionGenerator,
  SurfaceLofter,
  PanelSeparator,
  WheelGenerator,
  ProceduralChassisGenerator,
  GeometryDiagnostics,
  AssemblyGraph
} from '../packages/vehicle-generation-engine/src';
import { AssetResolver, AssetManifest } from '../packages/vehicle-asset-pipeline/src';

describe('AutoVerse 3D — Geometry Engine Reconstruction Suite', () => {

  describe('Phase 3: Geometry Profiles & Archetypes', () => {
    const archetypes = Object.keys(ARCHETYPE_TEMPLATES) as (keyof typeof ARCHETYPE_TEMPLATES)[];

    it('has exactly 7 distinct archetype templates defined', () => {
      expect(archetypes.length).toBe(7);
      expect(archetypes).toContain('sedan');
      expect(archetypes).toContain('coupe');
      expect(archetypes).toContain('sports_car');
      expect(archetypes).toContain('supercar');
      expect(archetypes).toContain('suv');
      expect(archetypes).toContain('muscle_car');
      expect(archetypes).toContain('pickup');
    });

    archetypes.forEach(name => {
      it(`validates template archetype "${name}" successfully`, () => {
        const profile = ARCHETYPE_TEMPLATES[name];
        const validation = validateGeometryProfile(profile);
        expect(validation.valid).toBe(true);
        expect(validation.errors).toHaveLength(0);
        expect(profile.wheelbase).toBeGreaterThan(2.0);
        expect(profile.overallLength).toBeGreaterThan(profile.wheelbase);
        expect(profile.wheelRadiusFront).toBeGreaterThan(0.28);
      });
    });

    it('rejects physically invalid geometry profile configurations', () => {
      const invalidProfile = {
        ...ARCHETYPE_TEMPLATES.coupe,
        wheelbase: 5.5,
        overallLength: 4.5 // Wheelbase exceeds overall length!
      };
      const validation = validateGeometryProfile(invalidProfile);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors[0]).toMatch(/wheelbase/i);
    });
  });

  describe('Phase 2: Longitudinal Profile & Cross-Section Generation', () => {
    const profile = ARCHETYPE_TEMPLATES.sports_car;

    it('samples longitudinal elevation curves across the vehicle length', () => {
      const longGen = new LongitudinalProfileGenerator(profile);
      const frontZ = profile.wheelbase / 2 + profile.frontOverhang;
      const rearZ = -profile.wheelbase / 2 - profile.rearOverhang;
      const centerZ = 0;

      const frontSample = longGen.sampleStation(frontZ - 0.1);
      const centerSample = longGen.sampleStation(centerZ);
      const rearSample = longGen.sampleStation(rearZ + 0.1);

      expect(frontSample.yTop).toBeLessThan(centerSample.yTop);
      expect(centerSample.yTop).toBeGreaterThan(profile.beltlineHeight);
      expect(rearSample.yTop).toBeLessThan(centerSample.yTop);
    });

    it('generates >= 24 transverse cross-section stations with wheel arch cutouts', () => {
      const csGen = new CrossSectionGenerator(profile);
      const stations = csGen.generateAllStations(28);

      expect(stations.length).toBeGreaterThanOrEqual(24);

      // Axle stations should have wheel arch cutouts detected
      const frontAxleZ = profile.wheelbase / 2;
      const rearAxleZ = -profile.wheelbase / 2;

      const frontAxleStation = stations.find(s => Math.abs(s.z - frontAxleZ) < 0.15);
      const rearAxleStation = stations.find(s => Math.abs(s.z - rearAxleZ) < 0.15);

      expect(frontAxleStation).toBeDefined();
      expect(frontAxleStation?.hasWheelArchCutout).toBe(true);
      expect(rearAxleStation).toBeDefined();
      expect(rearAxleStation?.hasWheelArchCutout).toBe(true);

      // Verify symmetry and finite coordinates in each station
      for (const station of stations) {
        expect(station.pointsLeft.length).toBeGreaterThan(4);
        expect(station.pointsRight.length).toBe(station.pointsLeft.length);
        for (const pt of station.pointsLeft) {
          expect(Number.isFinite(pt.position.x)).toBe(true);
          expect(Number.isFinite(pt.position.y)).toBe(true);
          expect(Number.isFinite(pt.position.z)).toBe(true);
          expect(pt.position.x).toBeLessThanOrEqual(0); // Left side has negative X
        }
        for (const pt of station.pointsRight) {
          expect(pt.position.x).toBeGreaterThanOrEqual(0); // Right side has positive X
        }
      }
    });

    it('lofts cross-section stations into continuous BufferGeometry with valid normals', () => {
      const csGen = new CrossSectionGenerator(profile);
      const stations = csGen.generateAllStations(28);
      const loftResult = SurfaceLofter.loftStations(stations);

      expect(loftResult.geometry).toBeDefined();
      expect(loftResult.vertexCount).toBeGreaterThan(100);
      expect(loftResult.triangleCount).toBeGreaterThan(150);

      const posAttr = loftResult.geometry.getAttribute('position');
      const normAttr = loftResult.geometry.getAttribute('normal');
      const indexAttr = loftResult.geometry.getIndex();

      expect(posAttr).toBeDefined();
      expect(normAttr).toBeDefined();
      expect(indexAttr).toBeDefined();
      expect(indexAttr!.count % 3).toBe(0);

      // Check all normals are normalized unit vectors
      for (let i = 0; i < normAttr.count; i++) {
        const nx = normAttr.getX(i);
        const ny = normAttr.getY(i);
        const nz = normAttr.getZ(i);
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        expect(len).toBeCloseTo(1.0, 1);
      }
    });
  });

  describe('Phase 4 & 5: Panels, Assembly Graph & Radial Wheels', () => {
    it('generates separate body panels with 3mm shut-line offsets', () => {
      const profile = ARCHETYPE_TEMPLATES.coupe;
      const bodyMat = new THREE.MeshBasicMaterial();
      const trimMat = new THREE.MeshBasicMaterial();

      const panelResult = PanelSeparator.generatePanels(profile, bodyMat, trimMat);
      expect(panelResult.group.children.length).toBeGreaterThanOrEqual(4);

      const panelIds = panelResult.panels.map(p => p.id);
      expect(panelIds).toContain('panel_bonnet');
      expect(panelIds).toContain('panel_fascia_front');
      expect(panelIds).toContain('panel_fascia_rear');
      expect(panelIds).toContain('panel_door_l');
      expect(panelIds).toContain('panel_door_r');
    });

    it('constructs an AssemblyGraph with profile-derived mount anchors', () => {
      const profile = ARCHETYPE_TEMPLATES.supercar;
      const graph = new AssemblyGraph(profile);

      expect(graph.getAnchor('mount_wheel_fl')).toBeDefined();
      expect(graph.getAnchor('mount_wheel_fr')).toBeDefined();
      expect(graph.getAnchor('mount_wheel_rl')).toBeDefined();
      expect(graph.getAnchor('mount_wheel_rr')).toBeDefined();
      expect(graph.getAnchor('mount_bonnet')).toBeDefined();
      expect(graph.getAnchor('mount_bumper_f')).toBeDefined();
      expect(graph.getAnchor('mount_bumper_r')).toBeDefined();

      const wheelFL = graph.getAnchor('mount_wheel_fl')!;
      expect(wheelFL.position[2]).toBeCloseTo(profile.wheelbase / 2, 2);
      expect(wheelFL.position[1]).toBeCloseTo(profile.wheelRadiusFront, 2);
    });

    it('generates authentic radial wheel with toroidal tyre profile, rim, and brake disc', () => {
      const wheelResult = WheelGenerator.generateWheel({
        wheelRadius: 0.34,
        tyreWidth: 0.265,
        rimRadius: 0.25,
        camberDeg: -0.04,
        isRightSide: false
      });

      expect(wheelResult.group).toBeDefined();
      expect(wheelResult.tyreMesh).toBeDefined();
      expect(wheelResult.rimMesh).toBeDefined();
      expect(wheelResult.discMesh).toBeDefined();
      expect(wheelResult.caliperMesh).toBeDefined();
      expect(wheelResult.triangleCount).toBeGreaterThan(150);

      // Verify tyre is LatheGeometry (radial profile), not flat cylinder
      expect(wheelResult.tyreMesh.geometry).toBeInstanceOf(THREE.LatheGeometry);
    });
  });

  describe('Phase 6: Quality Diagnostics & Anti-Box Verification', () => {
    it('passes all 9 automated geometry diagnostics on procedural vehicle', () => {
      const profile = ARCHETYPE_TEMPLATES.coupe;
      const carGroup = ProceduralChassisGenerator.generateSculptedBody(profile, 0x00F0FF, 0x111317);

      const report = GeometryDiagnostics.runDiagnostics(carGroup, profile);
      if (!report.passedAll) {
        console.log('Failed checks:', report.checks.filter(c => !c.pass));
      }

      expect(report.passedAll).toBe(true);
      expect(report.failedCount).toBe(0);
      expect(report.totalTriangles).toBeGreaterThan(500);

      const antiBoxCheck = report.checks.find(c => c.checkName === 'anti_box_geometry_check');
      expect(antiBoxCheck?.pass).toBe(true);

      const nanCheck = report.checks.find(c => c.checkName === 'no_nan_or_infinity');
      expect(nanCheck?.pass).toBe(true);

      const groundCheck = report.checks.find(c => c.checkName === 'tyres_touch_ground_plane');
      expect(groundCheck?.pass).toBe(true);
    });

    it('correctly catches and flags a primitive box geometry as a defect', () => {
      const fakeCuboidCar = new THREE.Group();
      const hull = new THREE.Mesh(
        new THREE.BoxGeometry(1.76, 0.46, 4.2),
        new THREE.MeshBasicMaterial()
      );
      hull.name = "mesh_chassis_hull";
      fakeCuboidCar.add(hull);

      const report = GeometryDiagnostics.runDiagnostics(fakeCuboidCar, ARCHETYPE_TEMPLATES.coupe);
      expect(report.passedAll).toBe(false);

      const antiBoxCheck = report.checks.find(c => c.checkName === 'anti_box_geometry_check');
      expect(antiBoxCheck?.pass).toBe(false);
      expect(antiBoxCheck?.details).toContain('FAIL');
    });

    it('enforces mandatory approximation label on all procedural geometry root nodes', () => {
      const carGroup = ProceduralChassisGenerator.generateSculptedBody('coupe');
      expect(carGroup.userData.isApproximateProcedural).toBe(true);
      expect(carGroup.userData.approximationLabel).toBe(
        'APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY'
      );
    });
  });

  describe('Phase 7: Asset Priority Resolution & Rejection Logging', () => {
    const manifest: AssetManifest = {
      version: '1.0.0',
      name: 'autoverse-manifest',
      vehicles: [
        {
          modelCode: 'sentinel5',
          modelHash: 2709293299,
          displayName: 'Sentinel Classic Widebody',
          manufacturer: 'Übermacht',
          assetPath: '/vehicle-assets/cars/sentinel5/model.glb',
          assetFormat: 'glb'
        }
      ]
    };

    it('Tier 1: resolves exact GLB asset when present in manifest', () => {
      const resolver = new AssetResolver(manifest);
      const res = resolver.resolve(2709293299);

      expect(res.status).toBe('AUTHENTIC_ASSET');
      expect(res.tier).toBe('TIER_1_EXACT_GLB');
      expect(res.isApproximate).toBe(false);
      expect(res.matchConfidence).toBe(1.0);
    });

    it('Tier 2 & 3: resolves imported custom base mesh supplied by user', () => {
      const resolver = new AssetResolver(manifest);
      resolver.registerImportedBaseMesh('custom_tuner', { mesh: 'valid_mesh_data' });

      const resBase = resolver.resolve('custom_tuner', false);
      expect(resBase.status).toBe('AUTHENTIC_ASSET');
      expect(resBase.tier).toBe('TIER_2_BASE_MESH');

      const resMods = resolver.resolve('custom_tuner', true);
      expect(resMods.status).toBe('AUTHENTIC_ASSET');
      expect(resMods.tier).toBe('TIER_3_BASE_PLUS_MODS');
    });

    it('Tier 4: falls back to parametric procedural template with explicit rejection log', () => {
      const resolver = new AssetResolver(manifest, true);
      const res = resolver.resolve(88888888);

      expect(res.status).toBe('APPROXIMATE_TEMPLATE');
      expect(res.tier).toBe('TIER_4_PROCEDURAL_TEMPLATE');
      expect(res.isApproximate).toBe(true);
      expect(res.approximateNotice).toBe('APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY');
      expect(res.reasonsRejected.length).toBeGreaterThanOrEqual(2);
      expect(res.reasonsRejected[0]).toContain('Tier 1: No pre-compiled GLB/GLTF');
    });

    it('Tier 5: returns explicit missing asset state when procedural fallback is disabled', () => {
      const resolver = new AssetResolver(manifest, false); // Fallback disabled
      const res = resolver.resolve(88888888);

      expect(res.status).toBe('MISSING_ASSET');
      expect(res.tier).toBe('TIER_5_MISSING_ASSET');
      expect(res.matchConfidence).toBe(0.0);
      expect(res.reasonsRejected.some(r => r.includes('Tier 4'))).toBe(true);
    });
  });

});
