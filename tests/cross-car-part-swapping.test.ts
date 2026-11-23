import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  CrossCarPartSwapper,
  VEHICLE_HUB_SPECS,
  DonorPartDefinition
} from '../packages/vehicle-generation-engine/src/geometry/crossCarPartSwapper';
import { toCanonicalSchema2Id, toCanonicalV2Id } from '../src/geometry/components/canonicalComponentMap';

describe('AutoVerse Cross-Car Part Swapping & Compatibility Engine', () => {
  it('should initialize the donor parts catalog with multi-vehicle components', () => {
    const parts = CrossCarPartSwapper.getDonorParts();
    expect(parts.length).toBeGreaterThanOrEqual(8);

    const categories = new Set(parts.map(p => p.category));
    expect(categories.has('Aero')).toBe(true);
    expect(categories.has('Wheels')).toBe(true);
    expect(categories.has('Body')).toBe(true);
    expect(categories.has('Exhaust')).toBe(true);
  });

  describe('Hub Interface & Kinematic Compatibility', () => {
    it('evaluates Center-Lock to Center-Lock wheel swap as DIRECT_FIT', () => {
      const svjWheels = CrossCarPartSwapper.getDonorPartById('donor_svj_leirion_wheels')!;
      expect(svjWheels).toBeDefined();

      const porscheTarget = {
        vehicle: { id: 'porsche_911_gt3_rs' },
        dimensions: { width: 1.90, height: 1.30, length: 4.57 }
      };

      const fitment = CrossCarPartSwapper.evaluateFitment(svjWheels, porscheTarget);
      expect(fitment.status).toBe('DIRECT_FIT');
      expect(fitment.passed).toBe(true);
      expect(fitment.score).toBeGreaterThanOrEqual(90);
      expect(fitment.requiresAdapterKit).toBe(false);
    });

    it('evaluates 5-Lug to 5-Lug wheel swap as DIRECT_FIT when PCD matches', () => {
      const pistaWheels = CrossCarPartSwapper.getDonorPartById('donor_pista_carbon_wheels')!;
      expect(pistaWheels).toBeDefined();

      const gtrTarget = {
        vehicle: { id: 'nissan_gtr_r35_nismo' },
        dimensions: { width: 1.895, height: 1.37, length: 4.69 }
      };

      const fitment = CrossCarPartSwapper.evaluateFitment(pistaWheels, gtrTarget);
      expect(fitment.status).toBe('DIRECT_FIT');
      expect(fitment.passed).toBe(true);
    });

    it('evaluates Center-Lock wheel onto 5-Lug hub as ADAPTABLE with conversion kit', () => {
      const svjWheels = CrossCarPartSwapper.getDonorPartById('donor_svj_leirion_wheels')!;

      const ferrariTarget = {
        vehicle: { id: 'ferrari_488_pista' },
        dimensions: { width: 1.975, height: 1.206, length: 4.605 }
      };

      const fitment = CrossCarPartSwapper.evaluateFitment(svjWheels, ferrariTarget);
      expect(fitment.status).toBe('ADAPTABLE');
      expect(fitment.passed).toBe(true);
      expect(fitment.requiresAdapterKit).toBe(true);
      expect(fitment.mountingOffsetDelta[0]).toBe(0.025); // +25mm offset
      expect(fitment.adapterKitDescription).toContain('Conversion Spacer');
    });
  });

  describe('Aerodynamic Component Fitment & Dimensional Adaptation', () => {
    it('adapts Lamborghini SVJ active ALA wing onto Porsche 911 GT3 RS with valid scaling', () => {
      const svjWing = CrossCarPartSwapper.getDonorPartById('donor_svj_ala_wing')!;
      expect(svjWing).toBeDefined();

      const porscheTarget = {
        vehicle: { id: 'porsche_911_gt3_rs' },
        dimensions: { width: 1.90, height: 1.32, length: 4.57 }
      };

      const fitment = CrossCarPartSwapper.evaluateFitment(svjWing, porscheTarget);
      expect(fitment.passed).toBe(true);
      expect(['DIRECT_FIT', 'ADAPTABLE']).toContain(fitment.status);
      expect(fitment.scaleAdjustment[0]).toBeGreaterThan(0.9);
      expect(fitment.scaleAdjustment[0]).toBeLessThan(1.2);
    });

    it('correctly adapts Porsche GT3 RS high swan-neck DRS wing onto Ferrari 488 Pista', () => {
      const gt3rsWing = CrossCarPartSwapper.getDonorPartById('donor_gt3rs_swan_drs_wing')!;
      expect(gt3rsWing).toBeDefined();

      const ferrariTarget = {
        vehicle: { id: 'ferrari_488_pista' },
        dimensions: { width: 1.975, height: 1.206, length: 4.605 }
      };

      const fitment = CrossCarPartSwapper.evaluateFitment(gt3rsWing, ferrariTarget);
      expect(fitment.passed).toBe(true);
      expect(fitment.status).toBe('ADAPTABLE');
      expect(fitment.requiresAdapterKit).toBe(true);
      expect(fitment.adapterKitDescription).toContain('Billet Aluminum Stanchion');
    });

    it('rejects aero components when dimensional mismatch exceeds regulation tolerance', () => {
      const giantWing: DonorPartDefinition = {
        id: 'test_oversized_wing',
        name: 'Hillclimb Monster Wing',
        category: 'Aero',
        semanticType: 'rear_wing',
        sourceVehicleId: 'custom_hillclimb',
        sourceVehicleName: 'Custom Monster',
        dimensions: { width: 3.20, height: 0.8, length: 0.6 },
        massKg: 15,
        downforceKgAt200Kmh: 1200,
        dragCdDelta: 0.15,
        defaultMaterialRef: 'carbon_twill',
        description: 'Excessively wide wing for test',
        generateMesh: () => new THREE.Group()
      };

      const compactTarget = {
        vehicle: { id: 'caterham_seven' },
        dimensions: { width: 1.57, height: 1.11, length: 3.10 }
      };

      const fitment = CrossCarPartSwapper.evaluateFitment(giantWing, compactTarget);
      expect(fitment.status).toBe('INCOMPATIBLE');
      expect(fitment.passed).toBe(false);
      expect(fitment.reasons[0]).toContain('dimensional disparity');
    });
  });

  describe('Adapted 3D Geometry Generation', () => {
    it('generates genuine Three.js geometry for SVJ ALA wing with airfoil, pylon, and endplates', () => {
      const svjWing = CrossCarPartSwapper.getDonorPartById('donor_svj_ala_wing')!;
      const mesh = svjWing.generateMesh([1.0, 1.0, 1.0], [0, 0.1, 0]);

      expect(mesh).toBeInstanceOf(THREE.Group);
      expect(mesh.name).toBe('donor_svj_ala_wing');
      expect(mesh.children.length).toBeGreaterThanOrEqual(3); // blade + pylon + 2 endplates
    });

    it('generates genuine Three.js geometry for GT3 RS Swan-Neck DRS wing with dual overhead pylons', () => {
      const gt3rsWing = CrossCarPartSwapper.getDonorPartById('donor_gt3rs_swan_drs_wing')!;
      const mesh = gt3rsWing.generateMesh([1.05, 1.0, 1.0], [0, 0.15, -0.05]);

      expect(mesh).toBeInstanceOf(THREE.Group);
      expect(mesh.name).toBe('donor_gt3rs_swan_drs_wing');
      expect(mesh.children.length).toBeGreaterThanOrEqual(4); // 2 pylons + main blade + DRS flap + endplates
    });
  });

  describe('Canonical Component Map Translation', () => {
    it('correctly maps Schema 2.0 IDs to V2 Engine internal panel IDs and vice versa', () => {
      expect(toCanonicalV2Id('rear_wing')).toBe('wing_rear');
      expect(toCanonicalV2Id('front_splitter')).toBe('splitter_front');
      expect(toCanonicalV2Id('front_left_fender')).toBe('fender_front_l');
      expect(toCanonicalV2Id('wheel_front_left')).toBe('wheel_fl');

      expect(toCanonicalSchema2Id('wing_rear')).toBe('rear_wing');
      expect(toCanonicalSchema2Id('splitter_front')).toBe('front_splitter');
      expect(toCanonicalSchema2Id('fender_front_l')).toBe('front_left_fender');
      expect(toCanonicalSchema2Id('wheel_fl')).toBe('wheel_front_left');
    });
  });
});
