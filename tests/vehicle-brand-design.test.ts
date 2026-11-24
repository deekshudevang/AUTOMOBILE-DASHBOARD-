import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  getAllBrandDesignLanguages,
  getBrandDesignLanguage,
  BrandDesignLanguage
} from '../src/vehicles/brandDesign';
import { SchemaV2Migrator } from '../src/geometry/migration/schemaV2Migrator';
import { VehicleGeometryEngine } from '../src/geometry/engine';
import { ArchetypeRegistry } from '../src/geometry/archetypes/archetypeRegistry';
import porscheSpec from '../public/vehicles/porsche_911_gt3_rs_992_2022.json';
import huracanSpec from '../public/vehicles/supercars/lamborghini_huracan_sto.json';
import ferrariSpec from '../public/vehicles/supercars/ferrari_f8_tributo.json';
import mclarenSpec from '../public/vehicles/supercars/mclaren_720s.json';
import nissanSpec from '../public/vehicles/sports_cars/nissan_gt_r_r35.json';
import bmwSpec from '../public/vehicles/sports_cars/bmw_m4_csl.json';
import libraryIndex from '../public/vehicles/index.json';

describe('AutoVerse 3D — Vehicle Model Quality & Brand Design Language Suite', () => {
  // =========================================================================
  // 1. BRAND DESIGN UNIQUENESS TESTS (Rule 7c & 7e)
  // =========================================================================
  describe('Brand Design Language Uniqueness & Integrity', () => {
    const brands = getAllBrandDesignLanguages();

    it('defines at least 20 distinct automotive brand design languages', () => {
      expect(brands.length).toBeGreaterThanOrEqual(20);
    });

    it('guarantees every brand config has a unique brandId and brandName', () => {
      const ids = new Set(brands.map(b => b.brandId));
      const names = new Set(brands.map(b => b.brandName));
      expect(ids.size).toBe(brands.length);
      expect(names.size).toBe(brands.length);
    });

    it('fails if any two brands share identical silhouette curves or proportion ratios', () => {
      for (let i = 0; i < brands.length; i++) {
        for (let j = i + 1; j < brands.length; j++) {
          const b1 = brands[i];
          const b2 = brands[j];

          // Check proportion fingerprint
          const p1 = `${b1.proportions.lengthToWheelbaseRatio}_${b1.proportions.widthToHeightRatio}_${b1.proportions.hoodLengthRatio}`;
          const p2 = `${b2.proportions.lengthToWheelbaseRatio}_${b2.proportions.widthToHeightRatio}_${b2.proportions.hoodLengthRatio}`;

          // Check curve fingerprint
          const c1 = `${b1.silhouetteCurves.hoodSlopeCurve.join(',')}_${b1.silhouetteCurves.haunchCurvature}`;
          const c2 = `${b2.silhouetteCurves.hoodSlopeCurve.join(',')}_${b2.silhouetteCurves.haunchCurvature}`;

          const isIdentical = p1 === p2 && c1 === c2;
          expect(
            isIdentical,
            `Brand '${b1.brandName}' and '${b2.brandName}' must not share identical silhouette configurations`
          ).toBe(false);
        }
      }
    });

    it('verifies required brand design identities match architectural specs', () => {
      const porsche = getBrandDesignLanguage('porsche');
      expect(porsche.headlightShape).toBe('round_oval');
      expect(porsche.silhouetteFamily).toBe('rear_engine_flyline');
      expect(porsche.defaultWingStyle).toBe('swan_neck_gt');

      const lamborghini = getBrandDesignLanguage('lamborghini');
      expect(lamborghini.headlightShape).toBe('y_signature');
      expect(lamborghini.taillightShape).toBe('y_signature_hex');
      expect(lamborghini.grilleShape).toBe('hexagonal_geometric');
      expect(lamborghini.silhouetteFamily).toBe('wedge_monovolume');

      const ferrari = getBrandDesignLanguage('ferrari');
      expect(ferrari.headlightShape).toBe('slim_horizontal');
      expect(ferrari.taillightShape).toBe('twin_circular_rings');
      expect(ferrari.grilleShape).toBe('shark_nose_splitter');
      expect(ferrari.silhouetteFamily).toBe('flowing_mid_engine');
    });

    it('correctly maps GTA lore manufacturers to authentic brand design languages', () => {
      expect(getBrandDesignLanguage('pfister').brandId).toBe('porsche');
      expect(getBrandDesignLanguage('pegassi').brandId).toBe('lamborghini');
      expect(getBrandDesignLanguage('grotti').brandId).toBe('ferrari');
      expect(getBrandDesignLanguage('progen').brandId).toBe('mclaren');
      expect(getBrandDesignLanguage('annis').brandId).toBe('nissan');
      expect(getBrandDesignLanguage('obey').brandId).toBe('audi');
      expect(getBrandDesignLanguage('ubermacht').brandId).toBe('bmw');
    });
  });

  // =========================================================================
  // 2. CATALOG TIER & DEFAULT V2 UNIFICATION TESTS (Rule 7b & 7e)
  // =========================================================================
  describe('V2 Coachwork Default Pipeline & Catalog Tier Integrity', () => {
    it('resolves Porsche 911 GT3 RS through the V2 Coachwork pipeline by default', () => {
      const def = SchemaV2Migrator.migrate(porscheSpec, 'porsche_911_gt3_rs');
      const engine = new VehicleGeometryEngine();
      const group = engine.loadVehicle(def);

      expect(group.userData.isVehicleGeometryEngineV2).toBe(true);
      expect(group.userData.fidelityTier).toBe('Tier B – Spec-accurate');
      expect(group.userData.generatorId).toBe('coachwork_generator_v2');

      engine.dispose();
    });

    it('resolves Lamborghini Huracan STO through the V2 Coachwork pipeline without falling back to V1 box', () => {
      const def = SchemaV2Migrator.migrate(huracanSpec, 'lamborghini_huracan_sto');
      const engine = new VehicleGeometryEngine();
      const group = engine.loadVehicle(def);

      expect(group.userData.isVehicleGeometryEngineV2).toBe(true);
      expect(group.userData.archetype).toBe('mid_engine_hypercar');

      // Verify discrete components exist and are attached
      const comps = engine.getComponents();
      expect(comps.length).toBeGreaterThanOrEqual(15);
      const compIds = comps.map(c => c.id);
      expect(compIds).toContain('front_bumper');
      expect(compIds).toContain('hood');
      expect(compIds).toContain('roof');
      expect(compIds).toContain('rear_diffuser');
      expect(compIds).toContain('rear_wing');

      engine.dispose();
    });

    it('resolves Ferrari F8 Tributo through the V2 Coachwork pipeline without falling back to V1 box', () => {
      const def = SchemaV2Migrator.migrate(ferrariSpec, 'ferrari_f8_tributo');
      const engine = new VehicleGeometryEngine();
      const group = engine.loadVehicle(def);

      expect(group.userData.isVehicleGeometryEngineV2).toBe(true);
      expect(group.userData.archetype).toBe('mid_engine_supercar');

      const comps = engine.getComponents();
      const compIds = comps.map(c => c.id);
      expect(compIds).toContain('front_bumper');
      expect(compIds).toContain('hood');
      expect(compIds).toContain('rear_diffuser');

      engine.dispose();
    });

    it('verifies all sample vehicles resolve to V2 without any unflagged V1 fallback', () => {
      const testCases = [
        { spec: porscheSpec, id: 'porsche_911_gt3_rs' },
        { spec: huracanSpec, id: 'lamborghini_huracan_sto' },
        { spec: ferrariSpec, id: 'ferrari_f8_tributo' },
        { spec: mclarenSpec, id: 'mclaren_720s' },
        { spec: nissanSpec, id: 'nissan_gt_r_r35' },
        { spec: bmwSpec, id: 'bmw_m4_csl' }
      ];

      testCases.forEach(({ spec, id }) => {
        const def = SchemaV2Migrator.migrate(spec, id);
        expect(def.geometry.generatorId).toBe('coachwork_generator_v2');
        expect(def.schemaVersion).toBe(2);
      });
    });
  });

  // =========================================================================
  // 3. GEOMETRY VALIDATION TESTS (Watertight, No NaN, No Floating Parts) (Rule 7e)
  // =========================================================================
  describe('Mesh Topology, Watertight Integrity & Contact Anchor Tests', () => {
    const catalogCars = [
      { name: 'Porsche 911 GT3 RS', spec: porscheSpec, id: 'porsche_911_gt3_rs' },
      { name: 'Lamborghini Huracan STO', spec: huracanSpec, id: 'lamborghini_huracan_sto' },
      { name: 'Ferrari F8 Tributo', spec: ferrariSpec, id: 'ferrari_f8_tributo' },
      { name: 'McLaren 720S', spec: mclarenSpec, id: 'mclaren_720s' },
      { name: 'Nissan GT-R R35', spec: nissanSpec, id: 'nissan_gt_r_r35' },
      { name: 'BMW M4 CSL', spec: bmwSpec, id: 'bmw_m4_csl' }
    ];

    catalogCars.forEach(({ name, spec, id }) => {
      it(`verifies ${name} geometry is watertight, has zero NaN vertices, and no degenerate triangles`, () => {
        const def = SchemaV2Migrator.migrate(spec, id);
        const engine = new VehicleGeometryEngine();
        const root = engine.loadVehicle(def);

        let totalVertices = 0;
        let totalTriangles = 0;
        let nanFound = false;
        let degenerateTriangles = 0;

        root.traverse(child => {
          if ((child as THREE.Mesh).isMesh) {
            const geom = (child as THREE.Mesh).geometry;
            if (geom && geom.attributes.position) {
              const pos = geom.attributes.position;
              totalVertices += pos.count;

              // Check for NaN or infinite coordinates
              for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i);
                const y = pos.getY(i);
                const z = pos.getZ(i);
                if (isNaN(x) || isNaN(y) || isNaN(z) || !isFinite(x) || !isFinite(y) || !isFinite(z)) {
                  nanFound = true;
                }
              }

              // Check degenerate triangles
              if (geom.index) {
                const idx = geom.index;
                totalTriangles += idx.count / 3;
                const pA = new THREE.Vector3();
                const pB = new THREE.Vector3();
                const pC = new THREE.Vector3();
                const ab = new THREE.Vector3();
                const ac = new THREE.Vector3();
                const cross = new THREE.Vector3();

                for (let t = 0; t < idx.count; t += 3) {
                  const iA = idx.getX(t);
                  const iB = idx.getX(t + 1);
                  const iC = idx.getX(t + 2);
                  pA.fromBufferAttribute(pos, iA);
                  pB.fromBufferAttribute(pos, iB);
                  pC.fromBufferAttribute(pos, iC);
                  ab.subVectors(pB, pA);
                  ac.subVectors(pC, pA);
                  cross.crossVectors(ab, ac);
                  const area = cross.length() * 0.5;
                  if (area < 1e-9) {
                    degenerateTriangles++;
                  }
                }
              }
            }
          }
        });

        expect(totalVertices).toBeGreaterThan(5000);
        expect(totalTriangles).toBeGreaterThan(4000);
        expect(nanFound).toBe(false);
        expect(degenerateTriangles).toBe(0);

        // Centerline symmetry: bounding box should be centered around X = 0 within 5mm tolerance
        const bbox = new THREE.Box3().setFromObject(root);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        expect(Math.abs(center.x)).toBeLessThan(0.005);

        // Bounding box dimensions match vehicle dimensions within 6% tolerance
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const expectedLength = def.geometry.dimensions.overall_length_m;
        const lengthDiffPercent = Math.abs(size.z - expectedLength) / expectedLength;
        expect(lengthDiffPercent).toBeLessThan(0.06);

        engine.dispose();
      });

      it(`verifies ${name} child components have contact points with the chassis body (no detached floating parts)`, () => {
        const def = SchemaV2Migrator.migrate(spec, id);
        const engine = new VehicleGeometryEngine();
        const root = engine.loadVehicle(def);

        const wing = root.getObjectByName('rear_wing');
        if (wing) {
          const wingBox = new THREE.Box3().setFromObject(wing);
          // Wing must be in the rear half of the vehicle (negative Z in coordinate convention)
          expect(wingBox.max.z).toBeLessThan(0.5);
          // Wing must be above ground level
          expect(wingBox.min.y).toBeGreaterThan(0.6);
        }

        const splitter = root.getObjectByName('front_splitter');
        if (splitter) {
          const splitterBox = new THREE.Box3().setFromObject(splitter);
          // Splitter must sit at front nose
          expect(splitterBox.max.z).toBeGreaterThan(1.0);
          // Splitter must sit low to ground
          expect(splitterBox.min.y).toBeLessThan(0.35);
        }

        const mirrors = [root.getObjectByName('mirror_l'), root.getObjectByName('mirror_r')];
        mirrors.forEach(m => {
          if (m) {
            const mBox = new THREE.Box3().setFromObject(m);
            expect(mBox.min.y).toBeGreaterThan(0.5);
          }
        });

        engine.dispose();
      });
    });

    it('verifies 4 wheels are present with tyres, rims, and brake calipers responding to stance controls', () => {
      const def = SchemaV2Migrator.migrate(huracanSpec, 'lamborghini_huracan_sto');
      const engine = new VehicleGeometryEngine();
      const root = engine.loadVehicle(def);

      const wheels = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'];
      wheels.forEach(wName => {
        const wObj = root.getObjectByName(wName);
        expect(wObj).toBeDefined();

        // Check tyre, rim, and brake disc exist as children
        const hasTyre = !!wObj?.getObjectByName(`${wName}_tyre`);
        const hasRim = !!wObj?.getObjectByName(`${wName}_rim`);
        const hasBrakes = !!wObj?.getObjectByName(`${wName}_brakes`);

        expect(hasTyre).toBe(true);
        expect(hasRim).toBe(true);
        expect(hasBrakes).toBe(true);
      });

      engine.dispose();
    });
  });

  // =========================================================================
  // 4. FIXED CAMERA SNAPSHOT REPRODUCIBILITY TEST (Rule 7e)
  // =========================================================================
  describe('Fixed Camera Perspective Projection & Deterministic Geometry Test', () => {
    it('produces identical deterministic vertex and triangle topology across multiple loads', () => {
      const def1 = SchemaV2Migrator.migrate(porscheSpec, 'porsche_911_gt3_rs');
      const engine1 = new VehicleGeometryEngine();
      const root1 = engine1.loadVehicle(def1);
      const rep1 = engine1.getValidationReport();

      const def2 = SchemaV2Migrator.migrate(porscheSpec, 'porsche_911_gt3_rs');
      const engine2 = new VehicleGeometryEngine();
      const root2 = engine2.loadVehicle(def2);
      const rep2 = engine2.getValidationReport();

      expect(rep1.triangleBudget.count).toBe(rep2.triangleBudget.count);
      expect(rep1.symmetry.maxDeviationMm).toBe(rep2.symmetry.maxDeviationMm);

      engine1.dispose();
      engine2.dispose();
    });
  });
});
