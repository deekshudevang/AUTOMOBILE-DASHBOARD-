import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import fs from 'fs';
import path from 'path';
import { ParametricGeometryBuilder, ParametricVehicleGeometry } from '../packages/vehicle-generation-engine/src';
import { UniversalLoader } from '../packages/authentic-geometry-engine/src/loaders/universalLoader';
import { AuthenticGeometryEngine } from '../packages/authentic-geometry-engine/src';
import { parseVehicleJson } from '../src/utils/jsonParser';

describe('AutoVerse 3D — Parametric Vehicle Geometry Engine Suite', () => {
  const jsonPath = path.resolve(__dirname, '../public/vehicles/porsche_911_gt3_rs_992_2022.json');
  const jsonRaw = fs.readFileSync(jsonPath, 'utf-8');
  const spec: ParametricVehicleGeometry = JSON.parse(jsonRaw);

  describe('Specification & Schema Validation', () => {
    it('loads the Porsche 911 GT3 RS parametric definition', () => {
      expect(spec.asset_id).toBe('porsche_911_gt3_rs_992_2022');
      expect(spec.vehicle.manufacturer).toBe('Porsche');
      expect(spec.vehicle.model).toBe('911 GT3 RS');
      expect(spec.vehicle.generation).toBe('992');
      expect(spec.dimensions.overall_length_m).toBe(4.572);
      expect(spec.dimensions.wheelbase_m).toBe(2.457);
      expect(spec.dimensions.front_track_m).toBe(1.63);
      expect(spec.dimensions.rear_track_m).toBe(1.582);
    });

    it('has 15 longitudinal stations defining the body loft', () => {
      const sections = spec.geometry.body_shell.longitudinal_sections;
      expect(sections.length).toBe(15);
      expect(sections[0].z_m).toBe(2.286); // Front nose
      expect(sections[sections.length - 1].z_m).toBe(-2.286); // Rear tail
      expect(sections[0].z_m - sections[sections.length - 1].z_m).toBeCloseTo(4.572, 3);
    });

    it('is parsed accurately by parseVehicleJson', () => {
      const result = parseVehicleJson(jsonRaw);
      expect(result.success).toBe(true);
      expect(result.format).toBe('Parametric Vehicle');
      expect(result.config).toBeDefined();
      expect(result.config?.model).toBe(706080074);
      expect(result.config?.isPrimaryColorCustom).toBe(true);
      expect(result.config?.parametricSpec).toBeDefined();
    });
  });

  describe('3D Parametric Reconstruction & Assembly', () => {
    const carGroup = ParametricGeometryBuilder.build(spec);

    it('generates a complete Three.js hierarchy with valid children', () => {
      expect(carGroup).toBeInstanceOf(THREE.Group);
      expect(carGroup.children.length).toBeGreaterThanOrEqual(4);
      expect(carGroup.name).toBe('parametric_vehicle_porsche_911_gt3_rs_992_2022');
    });

    it('lofts the body shell with watertight vertex geometry', () => {
      const bodyShell = carGroup.getObjectByName('component_body_shell') as THREE.Mesh;
      expect(bodyShell).toBeDefined();
      expect(bodyShell.geometry).toBeInstanceOf(THREE.BufferGeometry);

      const positions = bodyShell.geometry.getAttribute('position');
      expect(positions.count).toBeGreaterThan(100);

      // Verify no NaN values
      for (let i = 0; i < positions.count; i++) {
        expect(Number.isNaN(positions.getX(i))).toBe(false);
        expect(Number.isNaN(positions.getY(i))).toBe(false);
        expect(Number.isNaN(positions.getZ(i))).toBe(false);
      }
    });

    it('builds authentic dual-element swan-neck rear wing aerodynamics', () => {
      const mainBlade = carGroup.getObjectByName('aero_rear_wing_main_blade');
      const upperFlap = carGroup.getObjectByName('aero_rear_wing_upper_flap');
      const leftPylon = carGroup.getObjectByName('aero_swan_neck_pylon_left');
      const rightPylon = carGroup.getObjectByName('aero_swan_neck_pylon_right');
      const leftEndplate = carGroup.getObjectByName('aero_wing_endplate_left');
      const rightEndplate = carGroup.getObjectByName('aero_wing_endplate_right');

      expect(mainBlade).toBeDefined();
      expect(upperFlap).toBeDefined();
      expect(leftPylon).toBeDefined();
      expect(rightPylon).toBeDefined();
      expect(leftEndplate).toBeDefined();
      expect(rightEndplate).toBeDefined();
    });

    it('builds front splitter, hood vents, fender louvres, and rear diffuser', () => {
      const splitter = carGroup.getObjectByName('aero_front_splitter');
      const diffuser = carGroup.getObjectByName('aero_rear_diffuser');
      const hoodVentLeft = carGroup.getObjectByName('aero_hood_vent_left');
      const louvreLeft = carGroup.getObjectByName('aero_fender_louvres_left');

      expect(splitter).toBeDefined();
      expect(diffuser).toBeDefined();
      expect(hoodVentLeft).toBeDefined();
      expect(louvreLeft).toBeDefined();
    });

    it('generates 4 staggered performance wheels with exact coordinates', () => {
      const wheelFL = carGroup.getObjectByName('wheel_front_left');
      const wheelFR = carGroup.getObjectByName('wheel_front_right');
      const wheelRL = carGroup.getObjectByName('wheel_rear_left');
      const wheelRR = carGroup.getObjectByName('wheel_rear_right');

      expect(wheelFL).toBeDefined();
      expect(wheelFR).toBeDefined();
      expect(wheelRL).toBeDefined();
      expect(wheelRR).toBeDefined();

      // Check coordinates matching JSON specs
      expect(wheelFL?.position.x).toBeCloseTo(-0.815, 2);
      expect(wheelFL?.position.z).toBeCloseTo(1.2285, 2);
      expect(wheelFR?.position.x).toBeCloseTo(0.815, 2);
      expect(wheelRL?.position.x).toBeCloseTo(-0.791, 2);
      expect(wheelRL?.position.z).toBeCloseTo(-1.2285, 2);
      expect(wheelRR?.position.x).toBeCloseTo(0.791, 2);
    });

    it('enforces mandatory Rule 6 watermark and provenance metadata', () => {
      expect(carGroup.userData.accuracyClass).toBe('D_APPROXIMATE');
      expect(carGroup.userData.accuracyLabel).toContain('APPROXIMATE PROCEDURAL VEHICLE');
      expect(carGroup.userData.provenance.reference_specification.publisher).toBe('Porsche Newsroom');
    });
  });

  describe('UniversalLoader Ingestion & AAGE Integration', () => {
    it('loads the parametric JSON directly through UniversalLoader.load', async () => {
      const loadResult = await UniversalLoader.load(jsonRaw, 'json');
      expect(loadResult.format).toBe('json');
      expect(loadResult.vertexCount).toBeGreaterThan(200);
      expect(loadResult.triangleCount).toBeGreaterThan(100);
      expect(loadResult.root.children.length).toBeGreaterThan(0);
    });

    it('processes the parametric vehicle asset through AuthenticGeometryEngine', async () => {
      const processed = await AuthenticGeometryEngine.processAsset(
        jsonRaw,
        'json',
        'porsche_911_gt3_rs_992_2022',
        {
          id: 'porsche_911_gt3_rs_992_2022',
          modelHash: 706080074,
          modelCode: 'comet_gt3rs',
          manufacturer: 'Porsche',
          vehicleName: '911 GT3 RS',
          modelYear: 2022,
          generation: '992',
          trim: 'GT3 RS',
          market: 'Global',
          license: 'Porsche Newsroom Reference',
          originalDimensions: {
            length: 4.572,
            width: 1.900,
            height: 1.322,
            wheelbase: 2.457,
            trackFront: 1.630,
            trackRear: 1.582,
            frontOverhang: 1.0575,
            rearOverhang: 1.0575,
            groundClearance: 0.100
          }
        }
      );

      expect(processed.root).toBeDefined();
      expect(processed.certificate).toBeDefined();
      expect(processed.validationReport.vehicleName).toBeDefined();
      expect(processed.certificate.classification).toBeDefined();
    });
  });

  describe('AutoVerse 50-Vehicle Parametric Supercar Library Audit', () => {
    const indexPath = path.resolve(__dirname, '../public/vehicles/AUTOVERSE_VEHICLE_LIBRARY_INDEX.json');
    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

    it('indexes exactly 50 authentic vehicle definitions', () => {
      expect(indexData.assets).toBeDefined();
      expect(indexData.assets.length).toBe(50);
      expect(indexData.asset_count).toBe(50);
    });

    it('verifies all 50 vehicle files parse and generate valid 3D geometry without errors', () => {
      for (const asset of indexData.assets) {
        const filePath = path.resolve(__dirname, '../public/vehicles', asset.file);
        expect(fs.existsSync(filePath)).toBe(true);

        const raw = fs.readFileSync(filePath, 'utf-8');
        const parseResult = parseVehicleJson(raw);
        expect(parseResult.success).toBe(true);
        expect(parseResult.format).toBe('Parametric Vehicle');
        expect(parseResult.config?.parametricSpec).toBeDefined();

        const carGroup = ParametricGeometryBuilder.build(parseResult.config!.parametricSpec);
        expect(carGroup).toBeDefined();

        const bodyShell = carGroup.getObjectByName('component_body_shell') as THREE.Mesh;
        expect(bodyShell).toBeDefined();
        const positions = bodyShell.geometry.getAttribute('position');
        expect(positions.count).toBeGreaterThan(100);

        // Verify no NaNs in vertices
        for (let i = 0; i < positions.count; i++) {
          expect(Number.isNaN(positions.getX(i))).toBe(false);
          expect(Number.isNaN(positions.getY(i))).toBe(false);
          expect(Number.isNaN(positions.getZ(i))).toBe(false);
        }

        // Verify 4 wheels
        const wheels = carGroup.getObjectByName('group_wheels');
        expect(wheels?.children.length).toBe(4);

        // Verify aerodynamics & glass
        expect(carGroup.getObjectByName('group_aerodynamics')).toBeDefined();
        expect(carGroup.getObjectByName('component_greenhouse_glass')).toBeDefined();
      }
    });
  });
});
