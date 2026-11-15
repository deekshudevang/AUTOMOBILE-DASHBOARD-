import { describe, it, expect } from 'vitest';
import { VehicleExporter } from '@autoverse/vehicle-exporter';
import { AssetResolver, AssetInspector, AssetManifest } from '@autoverse/vehicle-asset-pipeline';
import { normalizeCheraxConfig } from '@autoverse/json-intelligence';
import { CheraxVehicleConfig } from '@autoverse/shared-types';
import * as THREE from 'three';

const rawCheraxJson: CheraxVehicleConfig = {
  format: 'Cherax Entity',
  type: 1,
  model: 2709293299,
  baseFlags: 1073808655,
  mods: {
    mod0: { index: 2, variation: false },
    mod49: { index: 1, variation: false }
  },
  extras: {
    extra1: true
  },
  wheelType: 8,
  wheelColor: 156,
  bulletproofTyres: true,
  driftTyres: false,
  tyreSmokeColor: { r: 0, g: 234, b: 255 },
  neonKits: {
    left: true,
    right: true,
    front: true,
    back: true,
    color: { r: 0, g: 234, b: 255 }
  },
  primaryColor: 0,
  secondaryColor: 0,
  pearlescentColor: 0,
  isPrimaryColorCustom: true,
  customPrimaryColor: { r: 0, g: 234, b: 255 },
  isSecondaryColorCustom: false,
  customSecondaryColor: { r: 17, g: 17, b: 17 },
  windowTint: 1,
  interiorColor: 0,
  dashBoardColor: 0,
  plateText: 'BMW M3  ',
  plateTextIndex: 0,
  _creatorSignature: 'GallivanterBallerST',
  customFieldX: 42
};

const mockSpec = normalizeCheraxConfig(rawCheraxJson, 'BMW_M3_TEST.json');

describe('VehicleExporter', () => {
  it('exports Cherax JSON with preserved unknown properties', () => {
    const exportedJson = VehicleExporter.exportCheraxJson(mockSpec);
    expect(exportedJson).toBeDefined();
    const parsed = JSON.parse(exportedJson);
    expect(parsed.model).toBe(2709293299);
    expect(parsed.customPrimaryColor.g).toBe(234);
    expect(parsed.mods.mod0.index).toBe(2);
    // Preserved unknown properties
    expect(parsed._creatorSignature).toBe('GallivanterBallerST');
    expect(parsed.customFieldX).toBe(42);
  });

  it('exports FiveM vehicles.meta XML', () => {
    const xml = VehicleExporter.exportFiveMVehiclesMeta(mockSpec, 'sentinel5');
    expect(xml).toContain('<CVehicleModelInfo__InitDataList>');
    expect(xml).toContain('<modelName>sentinel5</modelName>');
    expect(xml).toContain('<modelHash>2709293299</modelHash>');
    expect(xml).toContain('<wheelType>8</wheelType>');
  });

  it('exports a batch fleet zip archive', async () => {
    const zipData = await VehicleExporter.exportBatchZip([mockSpec]);
    expect(zipData).toBeInstanceOf(Uint8Array);
    expect(zipData.length).toBeGreaterThan(100);
  });
});

describe('AssetPipeline & AssetResolver', () => {
  const manifest: AssetManifest = {
    version: '1.0.0',
    name: 'Test Manifest',
    vehicles: [
      {
        modelHash: 2709293299,
        modelCode: 'sentinel5',
        displayName: 'Sentinel GTS (BMW M3)',
        manufacturer: 'BMW',
        assetPath: '/vehicle-assets/cars/bmw/m3_g80.glb',
        assetFormat: 'glb'
      }
    ]
  };

  it('resolves authentic asset when hash matches', () => {
    const resolver = new AssetResolver(manifest);
    const res = resolver.resolve(2709293299);
    expect(res.status).toBe('AUTHENTIC_ASSET');
    expect(res.isApproximate).toBe(false);
    expect(res.entry?.modelCode).toBe('sentinel5');
  });

  it('returns approximate template status with clear diagnostic notice when hash not found', () => {
    const resolver = new AssetResolver(manifest);
    const res = resolver.resolve(99999999);
    expect(res.status).toBe('APPROXIMATE_TEMPLATE');
    expect(res.isApproximate).toBe(true);
    expect(res.approximateNotice).toContain('APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY');
  });

  it('inspects 3D geometry metrics accurately', () => {
    const group = new THREE.Group();
    const geom = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geom, mat);
    group.add(mesh);

    const metrics = AssetInspector.inspectObject3D(group);
    expect(metrics.meshCount).toBe(1);
    expect(metrics.vertices).toBe(24);
    expect(metrics.triangles).toBe(12);
    expect(metrics.materialsCount).toBe(1);
  });
});
