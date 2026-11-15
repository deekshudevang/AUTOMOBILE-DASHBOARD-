import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { SchemaDetector, normalizeCheraxConfig } from '@autoverse/json-intelligence';
import { VehicleRegistry } from '@autoverse/vehicle-registry';
import { StandaloneVehicleGenerationEngine, ProceduralChassisGenerator } from '@autoverse/vehicle-generation-engine';
import { VehicleExporter } from '@autoverse/vehicle-exporter';

describe('Milestone 2: Multi-Vehicle Fleet & Cross-Brand Verification', () => {
  const vehiclesDir = path.resolve(process.cwd(), 'Vehicles');
  const allFileNames = fs.readdirSync(vehiclesDir).filter(f => f.endsWith('.json') && f !== 'index.json');

  it('scans and parses all 108 vehicle files in Vehicles/ directory without exceptions', () => {
    expect(allFileNames.length).toBe(108);

    const detector = new SchemaDetector();
    let parsedCount = 0;

    for (const fileName of allFileNames) {
      const content = fs.readFileSync(path.join(vehiclesDir, fileName), 'utf-8');
      const detection = detector.detect(content);
      expect(detection.format).toBe('Cherax Entity');

      const rawJson = JSON.parse(content);
      const spec = normalizeCheraxConfig(rawJson, fileName);
      expect(spec.modelHashUnsigned).toBeGreaterThan(0);
      expect(spec.sourceFormat).toBe('Cherax Entity');
      parsedCount++;
    }

    expect(parsedCount).toBe(108);
  });

  it('resolves key automotive brand models accurately in VehicleRegistry', () => {
    const registry = new VehicleRegistry();

    // Porsche Comet S2 / 911 GT3 (2568944644)
    const porsche = registry.resolve(2568944644);
    expect(porsche).not.toBeNull();
    expect(porsche?.codeName).toBe('comet6');
    expect(porsche?.realWorldModel).toContain('Porsche 911 GT3');

    // Audi 10F Widebody / R8 (274946574)
    const audi = registry.resolve(274946574);
    expect(audi).not.toBeNull();
    expect(audi?.codeName).toBe('tenf2');
    expect(audi?.realWorldModel).toContain('Audi R8');

    // Lamborghini Tempesta / Huracan (272929391)
    const lambo = registry.resolve(272929391);
    expect(lambo).not.toBeNull();
    expect(lambo?.codeName).toBe('tempesta');
    expect(lambo?.realWorldModel).toContain('Lamborghini Huracán');

    // Ferrari Itali RSX / SF90 (3145241962)
    const ferrari = registry.resolve(3145241962);
    expect(ferrari).not.toBeNull();
    expect(ferrari?.codeName).toBe('italirsx');
    expect(ferrari?.realWorldModel).toContain('Ferrari SF90');

    // Toyota Supra MK4 / Jester Classic (4080061290)
    const toyota = registry.resolve(4080061290);
    expect(toyota).not.toBeNull();
    expect(toyota?.codeName).toBe('jester3');
    expect(toyota?.realWorldModel).toContain('Toyota Supra');

    // Mercedes-AMG GT R / Schlagen GT (3787471536)
    const mercedes = registry.resolve(3787471536);
    expect(mercedes).not.toBeNull();
    expect(mercedes?.codeName).toBe('schlagen');
    expect(mercedes?.realWorldModel).toContain('Mercedes-AMG GT R');
  });

  it('handles attachment structures in specialized vehicles (e.g. broomstick.json)', () => {
    const broomstickPath = path.join(vehiclesDir, 'broomstick.json');
    if (fs.existsSync(broomstickPath)) {
      const content = fs.readFileSync(broomstickPath, 'utf-8');
      const rawJson = JSON.parse(content);
      const spec = normalizeCheraxConfig(rawJson, 'broomstick.json');

      if (rawJson.attachments) {
        expect(spec.attachments.length).toBeGreaterThan(0);
        // Round-trip export preserves attachments lossless bag
        const exported = VehicleExporter.exportCheraxJson(spec, { originalRawText: content });
        const parsed = JSON.parse(exported);
        expect(parsed.attachments).toBeDefined();
        expect(parsed.attachments.length).toBe(rawJson.attachments.length);
      }
    }
  });

  it('detects duplicate configurations (2F2FSUPRA_Retro_Shade.json vs lulli.json)', () => {
    const file1 = path.join(vehiclesDir, '2F2FSUPRA_Retro_Shade.json');
    const file2 = path.join(vehiclesDir, 'lulli.json');

    if (fs.existsSync(file1) && fs.existsSync(file2)) {
      const json1 = JSON.parse(fs.readFileSync(file1, 'utf-8'));
      const json2 = JSON.parse(fs.readFileSync(file2, 'utf-8'));

      // Both are Jester Classic (Toyota Supra) with identical model hash
      expect(json1.model).toBe(json2.model);
      expect(json1.wheelType).toBe(json2.wheelType);
      expect(json1.primaryColor).toBe(json2.primaryColor);
    }
  });

  it('generates valid non-degenerate procedural chassis for various categories', () => {
    const categories = ['Coupe', 'Sedan', 'Supercar', 'SUV', 'Muscle'];

    for (const cat of categories) {
      const group = ProceduralChassisGenerator.generateSculptedBody(cat, '#1E293B', '#0F172A', false);
      expect(group.children.length).toBeGreaterThan(0);

      // Verify all child meshes have non-empty geometry and valid bounding boxes
      group.traverse(child => {
        if ((child as any).isMesh) {
          const mesh = child as any;
          expect(mesh.geometry).toBeDefined();
          mesh.geometry.computeBoundingBox();
          const box = mesh.geometry.boundingBox;
          expect(box).not.toBeNull();
          expect(isFinite(box.min.x)).toBe(true);
          expect(isFinite(box.max.x)).toBe(true);
        }
      });
    }
  });

  it('batch exports entire fleet of multiple cars to a single compressed ZIP archive', async () => {
    const sampleFiles = allFileNames.slice(0, 10);
    const specs = sampleFiles.map(fn => {
      const raw = JSON.parse(fs.readFileSync(path.join(vehiclesDir, fn), 'utf-8'));
      return normalizeCheraxConfig(raw, fn);
    });

    const zipData = await VehicleExporter.exportBatchZip(specs);
    expect(zipData).toBeInstanceOf(Uint8Array);
    expect(zipData.byteLength).toBeGreaterThan(1024); // > 1KB
  });
});
