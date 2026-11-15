import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { SchemaDetector, normalizeCheraxConfig } from '@autoverse/json-intelligence';
import { VehicleRegistry } from '@autoverse/vehicle-registry';
import { StandaloneVehicleGenerationEngine } from '@autoverse/vehicle-generation-engine';
import { VehicleExporter } from '@autoverse/vehicle-exporter';
import { AssetResolver, AssetManifest } from '@autoverse/vehicle-asset-pipeline';

describe('Milestone 1: BMW M3 MINT GREEN Reference Verification', () => {
  const filePath = path.resolve(process.cwd(), 'Vehicles', 'BMW M3 MINT GREEN.json');
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const rawJson = JSON.parse(rawContent);

  it('detects schema as Cherax Entity Type 1', () => {
    const detector = new SchemaDetector();
    const result = detector.detect(rawJson);
    expect(result.format).toBe('Cherax Entity');
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('normalizes BMW M3 specification accurately', () => {
    const spec = normalizeCheraxConfig(rawJson, 'BMW M3 MINT GREEN.json');
    expect(spec.modelHashUnsigned).toBe(2709293299);
    expect(spec.modelHashSigned).toBe(-1585673997);
    expect(spec.primaryPaint.isCustom).toBe(true);
    expect(spec.primaryPaint.customRgb).toEqual({ r: 0, g: 234, b: 255 });
    expect(spec.wheels.type).toBe(8);
    expect(spec.wheels.bulletproofTyres).toBe(true);
    expect(spec.wheels.driftTyres).toBe(false);
    expect(spec.lighting.neonKits.left).toBe(true);
    expect(spec.lighting.neonKits.color).toEqual({ r: 0, g: 234, b: 255 });
    expect(spec.licensePlate.text.trim()).toBe('BMW M3');
  });

  it('resolves vehicle identity to Sentinel GTS / BMW M3 in registry', () => {
    const registry = new VehicleRegistry();
    const resolved = registry.resolve(2709293299);
    expect(resolved).not.toBeNull();
    expect(resolved?.codeName).toBe('sentinel5');
    expect(resolved?.manufacturer).toBe('Ubermacht');
    expect(resolved?.realWorldModel).toContain('BMW M3');
  });

  it('generates a complete 3D vehicle scene graph via StandaloneVehicleGenerationEngine', async () => {
    const spec = normalizeCheraxConfig(rawJson, 'BMW M3 MINT GREEN.json');
    const engine = new StandaloneVehicleGenerationEngine();
    const result = await engine.generate(spec);

    expect(result.statusReport.levelA.status).toBe('VALID');
    expect(result.statusReport.levelB.status).toBe('IDENTIFIED');
    expect(result.statusReport.levelD.totalApplied).toBeGreaterThan(0);
    expect(result.assembly.sceneGraph).toBeDefined();
    expect(result.assembly.components.length).toBeGreaterThan(0);
  });

  it('losslessly serializes back to Cherax JSON matching original properties', () => {
    const spec = normalizeCheraxConfig(rawJson, 'BMW M3 MINT GREEN.json');
    const exported = VehicleExporter.exportCheraxJson(spec, {
      isModified: false,
      originalRawText: rawContent
    });
    const parsed = JSON.parse(exported);
    expect(parsed.model).toBe(2709293299);
    expect(parsed.baseFlags).toBe(66831);
    expect(parsed.customPrimaryColor).toEqual({ r: 0, g: 234, b: 255 });
    expect(parsed.wheelType).toBe(8);
    expect(parsed.mods.mod0.index).toBe(6);
  });

  it('exports FiveM vehicles.meta XML resource string for sentinel5', () => {
    const spec = normalizeCheraxConfig(rawJson, 'BMW M3 MINT GREEN.json');
    const xml = VehicleExporter.exportFiveMVehiclesMeta(spec, 'sentinel5');
    expect(xml).toContain('<modelName>sentinel5</modelName>');
    expect(xml).toContain('<modelHash>2709293299</modelHash>');
    expect(xml).toContain('<wheelType>8</wheelType>');
  });

  it('resolves authentic asset via AssetResolver when present in manifest', () => {
    const manifestPath = path.resolve(process.cwd(), 'public', 'vehicle-assets', 'manifest.json');
    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as AssetManifest;
    const resolver = new AssetResolver(manifestContent);

    const res = resolver.resolve(2709293299);
    expect(res.status).toBe('AUTHENTIC_ASSET');
    expect(res.isApproximate).toBe(false);
    expect(res.entry?.modelCode).toBe('sentinel5');
  });
});
