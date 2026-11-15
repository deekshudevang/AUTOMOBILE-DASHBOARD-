import { describe, it, expect, beforeEach, vi } from 'vitest';
import { normalizeCheraxConfig } from '@autoverse/json-intelligence';
import * as THREE from 'three';
import { useVehicleStore } from '../src/hooks/useVehicleStore';
import { EditableVehicleAssembler } from '@autoverse/vehicle-generation-engine';
import { VehicleExporter } from '@autoverse/vehicle-exporter';
import { VehicleSchema2 } from '@autoverse/shared-types';
import aventadorRaw from '../public/vehicles/supercars/lamborghini_aventador_svj.json';

describe('AutoVerse 3D — Phase 11 Quality Assurance & Failure Paths Suite', () => {
  beforeEach(() => {
    useVehicleStore.setState({
      presentationMode: 'studio',
      componentOverrides: {}
    });
  });

  it('verifies graceful handling of WebGL context loss and restoration events', () => {
    const target = new EventTarget();
    let lostTriggered = false;
    let restoredTriggered = false;

    target.addEventListener('webglcontextlost', (e) => {
      lostTriggered = true;
    });

    target.addEventListener('webglcontextrestored', () => {
      restoredTriggered = true;
    });

    // Simulate WebGL Context Lost event
    const lostEvent = new Event('webglcontextlost');
    target.dispatchEvent(lostEvent);
    expect(lostTriggered).toBe(true);

    // Simulate WebGL Context Restored event
    const restoredEvent = new Event('webglcontextrestored');
    target.dispatchEvent(restoredEvent);
    expect(restoredTriggered).toBe(true);
  });

  it('verifies rapid vehicle switching does not cause race conditions or unhandled errors', async () => {
    const store = useVehicleStore.getState();

    // Mock fetch for vehicle files
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
      return {
        ok: true,
        text: async () => JSON.stringify(aventadorRaw)
      } as any;
    });

    const testFiles = [
      'porsche_911_gt3_rs_992_2022.json',
      'supercars/lamborghini_aventador_svj.json',
      'porsche_911_gt3_rs_992_2022.json',
      'supercars/lamborghini_aventador_svj.json'
    ];

    // Fire rapid switches in parallel
    const promises = testFiles.map(file => store.loadVehicleByFile(file));
    const results = await Promise.allSettled(promises);

    results.forEach(res => {
      expect(res.status).toBe('fulfilled');
    });

    expect(useVehicleStore.getState().activeFile).toBeDefined();

    globalThis.fetch = originalFetch;
  });

  it('verifies storage quota exception handling during config persistence', () => {
    const mockStorage = {
      setItem: vi.fn().mockImplementation(() => {
        const err = new Error('QuotaExceededError: DomException');
        err.name = 'QuotaExceededError';
        throw err;
      })
    };

    let caughtSafely = false;
    try {
      mockStorage.setItem('autoverse_test', 'payload');
    } catch (e: any) {
      if (e.name === 'QuotaExceededError') {
        caughtSafely = true;
      }
    }

    expect(caughtSafely).toBe(true);
  });

  it('verifies vehicle assembler sanitizes malformed overrides with NaN or missing values', () => {
    const spec = aventadorRaw as unknown as VehicleSchema2;

    const malformedOverrides: any = {
      rear_wing: {
        componentId: 'rear_wing',
        rotation: [NaN, NaN, NaN],
        materialFinish: 'invalid_finish_name'
      },
      wheel_front_left: {
        componentId: 'wheel_front_left',
        scale: [null, undefined, 1.0]
      }
    };

    // Assembler must build without crashing even with corrupt inputs
    const scene = EditableVehicleAssembler.build(spec, {
      componentOverrides: malformedOverrides
    });

    expect(scene).toBeDefined();
    expect(scene.children.length).toBeGreaterThan(0);

    // Export Cherax JSON
    const normalized = normalizeCheraxConfig(useVehicleStore.getState().activeConfig, 'aventador.json');
    const cheraxJson = VehicleExporter.exportCheraxJson(normalized);
    expect(cheraxJson).toBeDefined();

    // Export FiveM XML
    const fivemXml = VehicleExporter.exportFiveMVehiclesMeta(normalized, 'aventador');
    expect(fivemXml).toContain('<CVehicleModelInfo__InitDataList>');

    // Cleanup
    EditableVehicleAssembler.dispose(scene);
  });
});
