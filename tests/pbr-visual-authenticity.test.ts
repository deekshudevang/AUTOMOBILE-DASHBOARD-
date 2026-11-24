import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import * as fs from 'fs';
import * as path from 'path';
import {
  ProceduralPbrTextures,
  EditableVehicleAssembler,
  VehicleInteriorGenerator,
  VehicleEngineBayGenerator
} from '@autoverse/vehicle-generation-engine';
import { VehicleSchema2 } from '@autoverse/shared-types';
import { PbrMaterialFactory } from '../src/geometry/materials/pbrMaterialFactory';

describe('AutoVerse 3D — Phase 25: PBR Materials, Optical Fidelity & Vehicle Authenticity Suite', () => {

  describe('1. Procedural Automotive Normal Map Synthesis', () => {
    it('generates continuous periodic orange peel normal map for automotive clearcoats', () => {
      const tex = ProceduralPbrTextures.getOrangePeelNormalMap(128);
      expect(tex).toBeDefined();
      expect(tex.isDataTexture).toBe(true);
      expect(tex.image.width).toBe(128);
      expect(tex.image.height).toBe(128);
      expect(tex.wrapS).toBe(THREE.RepeatWrapping);
      expect(tex.wrapT).toBe(THREE.RepeatWrapping);

      // Verify normal vector encoding range in Uint8Array
      const data = tex.image.data as Uint8Array;
      expect(data.length).toBe(128 * 128 * 4);

      // Check center texel
      const midIdx = (64 * 128 + 64) * 4;
      const nz = (data[midIdx + 2] / 255) * 2 - 1;
      expect(nz).toBeGreaterThan(0.9); // Normal vector predominantly points outwards (+Z)
      expect(data[midIdx + 3]).toBe(255); // Alpha = 1
    });

    it('generates 2x2 diagonal twill weave normal map for carbon fiber components', () => {
      const tex = ProceduralPbrTextures.getCarbonWeaveNormalMap(128);
      expect(tex).toBeDefined();
      expect(tex.isDataTexture).toBe(true);
      expect(tex.wrapS).toBe(THREE.RepeatWrapping);
      expect(tex.repeat.x).toBe(32);

      const data = tex.image.data as Uint8Array;
      let hasPositiveSlope = false;
      let hasNegativeSlope = false;

      for (let i = 0; i < data.length; i += 4) {
        const nx = (data[i] / 255) * 2 - 1;
        if (nx > 0.15) hasPositiveSlope = true;
        if (nx < -0.15) hasNegativeSlope = true;
      }

      expect(hasPositiveSlope).toBe(true);
      expect(hasNegativeSlope).toBe(true);
    });

    it('generates micro-facet metallic flake normal perturbance map', () => {
      const tex = ProceduralPbrTextures.getMetallicFlakeTexture(128);
      expect(tex).toBeDefined();
      expect(tex.isDataTexture).toBe(true);

      const data = tex.image.data as Uint8Array;
      let flakeCount = 0;

      for (let i = 0; i < data.length; i += 4) {
        const nx = (data[i] / 255) * 2 - 1;
        const ny = (data[i + 1] / 255) * 2 - 1;
        if (Math.abs(nx) > 0.05 || Math.abs(ny) > 0.05) {
          flakeCount++;
        }
      }

      // Metallic flakes should occur on ~30-40% of texels
      expect(flakeCount).toBeGreaterThan(3000);
      expect(flakeCount).toBeLessThan(12000);
    });

    it('generates siped tyre tread normal map', () => {
      const tex = ProceduralPbrTextures.getTireTreadNormalMap(128);
      expect(tex).toBeDefined();
      expect(tex.isDataTexture).toBe(true);
      expect(tex.repeat.y).toBe(24);
    });

    it('generates perforated leather dimple normal map for sport bucket seats', () => {
      const tex = ProceduralPbrTextures.getPerforatedLeatherNormalMap(128);
      expect(tex).toBeDefined();
      expect(tex.isDataTexture).toBe(true);
      expect(tex.repeat.x).toBe(24);
    });
  });

  describe('2. PbrMaterialFactory Automotive Shaders', () => {
    it('creates clearcoat automotive paint with orange peel and metallic flake normal maps', () => {
      const mat = PbrMaterialFactory.createMaterial({
        type: 'clearcoat_paint',
        color: '#00F0FF',
        metalness: 0.85,
        roughness: 0.16,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03
      }) as THREE.MeshPhysicalMaterial;

      expect(mat.isMeshPhysicalMaterial).toBe(true);
      expect(mat.clearcoat).toBe(1.0);
      expect(mat.clearcoatRoughness).toBe(0.03);
      expect(mat.clearcoatNormalMap).toBeDefined();
      expect(mat.normalMap).toBeDefined(); // Metallic flake enabled when metalness > 0.4
    });

    it('creates optical glass with exact refractive index (IOR 1.52) and transmission', () => {
      const mat = PbrMaterialFactory.createMaterial({
        type: 'transmissive_glass',
        color: '#0E1724',
        transmission: 0.90
      }) as THREE.MeshPhysicalMaterial;

      expect(mat.isMeshPhysicalMaterial).toBe(true);
      expect(mat.transmission).toBe(0.90);
      expect(mat.ior).toBe(1.52);
      expect(mat.transparent).toBe(true);
      expect(mat.roughness).toBe(0.02);
    });

    it('creates high-performance carbon fiber with twill normal map and clearcoat', () => {
      const mat = PbrMaterialFactory.createMaterial({
        type: 'carbon_fiber',
        color: '#15171A'
      }) as THREE.MeshPhysicalMaterial;

      expect(mat.isMeshPhysicalMaterial).toBe(true);
      expect(mat.clearcoat).toBe(0.45);
      expect(mat.normalMap).toBeDefined();
    });
  });

  describe('3. Automotive Optical Assemblies & Projector Optics', () => {
    const pistaPath = path.resolve(process.cwd(), 'public/vehicles/supercars/ferrari_488_pista.json');
    const pistaSpec: VehicleSchema2 = JSON.parse(fs.readFileSync(pistaPath, 'utf-8'));

    it('assembles multi-element Bi-LED projector headlight optics with condensing lens, shroud, and DRL blade', () => {
      const root = EditableVehicleAssembler.build(pistaSpec);
      const headlight = root.getObjectByName('headlights_left');
      expect(headlight).toBeDefined();

      // Verify optical sub-components
      const outerLens = headlight?.getObjectByName('headlight_outer_lens');
      const bucket = headlight?.getObjectByName('headlight_reflector_bucket');
      const proj1 = headlight?.getObjectByName('projector_optic_1');
      const proj2 = headlight?.getObjectByName('projector_optic_2');
      const drl = headlight?.getObjectByName('headlight_drl_blade');

      expect(outerLens).toBeDefined();
      expect(bucket).toBeDefined();
      expect(proj1).toBeDefined();
      expect(proj2).toBeDefined();
      expect(drl).toBeDefined();
    });

    it('assembles aerodynamic window glass with OEM black ceramic frit border enamel', () => {
      const root = EditableVehicleAssembler.build(pistaSpec);
      const windshield = root.getObjectByName('windshield');
      expect(windshield).toBeDefined();

      const mainGlass = windshield?.getObjectByName('windshield_mesh');
      const fritBorder = windshield?.getObjectByName('windshield_frit_border');

      expect(mainGlass).toBeDefined();
      expect(fritBorder).toBeDefined();
    });
  });

  describe('4. Complete 50-Vehicle Fleet Visual Quality & Authenticity Audit', () => {
    const indexPath = path.resolve(process.cwd(), 'public/vehicles/index.json');
    const libraryIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    const vehicles: any[] = libraryIndex.assets;

    it('contains exactly 50 production-grade Schema 2.0 vehicle specifications', () => {
      expect(vehicles.length).toBe(50);
    });

    it('verifies all 50 vehicles build with authentic interior cabin and engine bay plumbing', () => {
      let totalPassed = 0;

      for (const asset of vehicles) {
        const filePath = path.resolve(process.cwd(), 'public/vehicles', asset.file);
        expect(fs.existsSync(filePath), `Vehicle file must exist: ${asset.file}`).toBe(true);

        const rawSpec: VehicleSchema2 = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        expect(Number(rawSpec.schemaVersion)).toBe(2);
        expect(rawSpec.vehicle.manufacturer).toBe(asset.manufacturer);

        // Build vehicle 3D scene
        const scene = EditableVehicleAssembler.build(rawSpec);
        expect(scene).toBeDefined();

        // 1. Interior Cabin Verification
        const cabin = scene.getObjectByName('component_interior_cabin') || scene.getObjectByName(`interior_${rawSpec.vehicle.id}`);
        expect(cabin, `Vehicle ${rawSpec.vehicle.id} must include interior cabin`).toBeDefined();

        // 2. Engine Bay & Powertrain Verification
        const engineBay = scene.getObjectByName('component_engine_bay');
        expect(engineBay, `Vehicle ${rawSpec.vehicle.id} must include authentic engine bay`).toBeDefined();

        // 3. Engine archetype consistency
        const resolvedEngine = VehicleEngineBayGenerator.resolveEngineSpec(rawSpec);
        expect(resolvedEngine.archetype).toBeDefined();
        expect(resolvedEngine.displacementCc).toBeGreaterThanOrEqual(0);

        // 4. Kinematic aperture hinges verification
        const doorFL = scene.getObjectByName('hinge_pivot_door_front_l');
        const hoodHinge = scene.getObjectByName('hinge_pivot_hood');
        const bootHinge = scene.getObjectByName('hinge_pivot_boot');

        expect(doorFL, `Vehicle ${rawSpec.vehicle.id} must have door FL hinge`).toBeDefined();
        expect(hoodHinge, `Vehicle ${rawSpec.vehicle.id} must have hood hinge`).toBeDefined();
        expect(bootHinge, `Vehicle ${rawSpec.vehicle.id} must have boot hinge`).toBeDefined();

        // Clean up
        EditableVehicleAssembler.dispose(scene);
        totalPassed++;
      }

      expect(totalPassed).toBe(50);
    });
  });

});
