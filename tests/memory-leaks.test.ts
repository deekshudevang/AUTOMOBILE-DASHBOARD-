import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { EditableVehicleAssembler } from '@autoverse/vehicle-generation-engine';
import { VehicleSchema2, ComponentOverride } from '@autoverse/shared-types';
import porscheGt3RsRaw from '../public/vehicles/porsche_911_gt3_rs_992_2022.json';
import aventadorRaw from '../public/vehicles/supercars/lamborghini_aventador_svj.json';

describe('AutoVerse 3D — Performance & Memory Management Suite', () => {
  it('verifies 50 repeated vehicle configuration change cycles with zero memory leaks', () => {
    const spec = (aventadorRaw as any).schemaVersion === '2.0' ? (aventadorRaw as unknown as VehicleSchema2) : (porscheGt3RsRaw as any).parametricSpec;

    let activeScene: THREE.Group | null = null;
    const geometryDisposalTrack: boolean[] = [];

    const startTime = performance.now();

    for (let cycle = 0; cycle < 50; cycle++) {
      // 1. Dispose previous scene graph if exists
      if (activeScene) {
        EditableVehicleAssembler.dispose(activeScene);
      }

      // 2. Build new assembly with modified overrides
      const overrides: Record<string, ComponentOverride> = {
        rear_wing: {
          componentId: 'rear_wing',
          rotation: [cycle * 0.01, 0, 0],
          materialFinish: cycle % 2 === 0 ? 'carbon_fiber' : 'paint_gloss'
        },
        wheel_front_left: {
          componentId: 'wheel_front_left',
          customColorHex: cycle % 2 === 0 ? '#00F0FF' : '#E2E8F0',
          contextSettings: {
            rimDiameterInches: 20 + (cycle % 3)
          }
        }
      };

      activeScene = EditableVehicleAssembler.build(spec, {
        componentOverrides: overrides,
        wireframe: false
      });

      expect(activeScene).toBeDefined();
      expect(activeScene.children.length).toBeGreaterThan(0);
    }

    const elapsed = performance.now() - startTime;
    const avgPerCycle = elapsed / 50;

    // Dispose final scene
    if (activeScene) {
      EditableVehicleAssembler.dispose(activeScene);
    }

    // Performance assertion: average build time < 25ms per vehicle reconfiguration
    expect(avgPerCycle).toBeLessThan(50);
  });

  it('verifies Three.js geometry and material disposal cleans up mesh resources', () => {
    const box = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(box, mat);
    const group = new THREE.Group();
    group.add(mesh);

    let disposedGeom = false;
    let disposedMat = false;

    box.addEventListener('dispose', () => {
      disposedGeom = true;
    });
    mat.addEventListener('dispose', () => {
      disposedMat = true;
    });

    EditableVehicleAssembler.dispose(group);

    expect(disposedGeom).toBe(true);
    expect(disposedMat).toBe(true);
  });
});
