import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { EditableVehicleAssembler } from '@autoverse/vehicle-generation-engine';
import { VehicleSchema2, ComponentOverride } from '@autoverse/shared-types';
import aventadorRaw from '../public/vehicles/supercars/lamborghini_aventador_svj.json';

describe('AutoVerse 3D — Geometry Invariants & Non-Mutation Suite', () => {
  const spec = aventadorRaw as unknown as VehicleSchema2;

  function measureInvariants(root: THREE.Group) {
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Locate wheel assemblies
    const wheelFL = root.getObjectByName('wheel_front_left');
    const wheelFR = root.getObjectByName('wheel_front_right');
    const wheelRL = root.getObjectByName('wheel_rear_left');

    const posFL = new THREE.Vector3();
    const posFR = new THREE.Vector3();
    const posRL = new THREE.Vector3();

    wheelFL?.getWorldPosition(posFL);
    wheelFR?.getWorldPosition(posFR);
    wheelRL?.getWorldPosition(posRL);

    const frontTrack = Math.abs(posFR.x - posFL.x);
    const wheelbase = Math.abs(posFL.z - posRL.z);

    return {
      boundingBox: {
        length: size.z,
        width: size.x,
        height: size.y,
        minY: box.min.y
      },
      frontTrack,
      wheelbase,
      posFL,
      posFR,
      posRL
    };
  }

  it('preserves wheelbase, track width, and ground clearance across baseline build', () => {
    const baselineScene = EditableVehicleAssembler.build(spec);
    const invariants = measureInvariants(baselineScene);

    // Invariants check
    expect(invariants.boundingBox.length).toBeGreaterThan(4.0);
    expect(invariants.boundingBox.width).toBeGreaterThan(1.8);
    expect(invariants.boundingBox.height).toBeGreaterThan(1.0);
    expect(invariants.wheelbase).toBeGreaterThan(2.0);
    expect(invariants.frontTrack).toBeGreaterThan(1.4);
    // Ground plane datum check (tires make contact within 0.12m of ground datum)
    expect(Math.abs(invariants.boundingBox.minY)).toBeLessThan(0.12);
  });

  it('guarantees source specification is never mutated during customization and reset', () => {
    const originalJson = JSON.stringify(spec);

    // 1. Build pristine baseline
    const sceneBaseline = EditableVehicleAssembler.build(spec);
    const baselineInvariants = measureInvariants(sceneBaseline);

    // 2. Battery of radical configuration overrides
    const testOverrides: Record<string, ComponentOverride> = {
      rear_wing: {
        componentId: 'rear_wing',
        position: [0, 1.4, -2.1],
        rotation: [0.35, 0, 0],
        scale: [1.2, 1.2, 1.2],
        customColorHex: '#DC2626'
      },
      front_splitter: {
        componentId: 'front_splitter',
        position: [0, 0.12, 2.3],
        visible: false
      },
      wheel_front_left: {
        componentId: 'wheel_front_left',
        contextSettings: { camberDeg: -6.0 }
      }
    };

    // 3. Render customized scene
    const sceneCustom = EditableVehicleAssembler.build(spec, {
      componentOverrides: testOverrides
    });

    // 4. Assert customized scene changed
    const customWing = sceneCustom.getObjectByName('rear_wing');
    expect(customWing?.position.y).toBeCloseTo(1.4, 2);

    // 5. Assert source spec string is 100% UNCHANGED
    expect(JSON.stringify(spec)).toBe(originalJson);

    // 6. Reset (empty overrides)
    const sceneReset = EditableVehicleAssembler.build(spec, {
      componentOverrides: {}
    });
    const resetInvariants = measureInvariants(sceneReset);

    // 7. Verify all geometric invariants restore exactly to pristine baseline
    expect(resetInvariants.boundingBox.length).toBeCloseTo(baselineInvariants.boundingBox.length, 3);
    expect(resetInvariants.boundingBox.width).toBeCloseTo(baselineInvariants.boundingBox.width, 3);
    expect(resetInvariants.boundingBox.height).toBeCloseTo(baselineInvariants.boundingBox.height, 3);
    expect(resetInvariants.wheelbase).toBeCloseTo(baselineInvariants.wheelbase, 3);
    expect(resetInvariants.frontTrack).toBeCloseTo(baselineInvariants.frontTrack, 3);
    expect(resetInvariants.boundingBox.minY).toBeCloseTo(baselineInvariants.boundingBox.minY, 3);
  });

  it('asserts materials are cloned per vehicle instance and never share mutated references', () => {
    const sceneA = EditableVehicleAssembler.build(spec, {
      componentOverrides: {
        hood: { componentId: 'hood', customColorHex: '#FF0000' }
      }
    });

    const sceneB = EditableVehicleAssembler.build(spec, {
      componentOverrides: {
        hood: { componentId: 'hood', customColorHex: '#00FF00' }
      }
    });

    const hoodMeshA = sceneA.getObjectByName('hood') as THREE.Mesh;
    const hoodMeshB = sceneB.getObjectByName('hood') as THREE.Mesh;

    expect(hoodMeshA).toBeDefined();
    expect(hoodMeshB).toBeDefined();
    expect(hoodMeshA.material).not.toBe(hoodMeshB.material);
  });
});
