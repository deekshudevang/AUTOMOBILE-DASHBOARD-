import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { VehicleSchemaValidator } from '@autoverse/json-intelligence';

describe('AutoVerse 3D — JSON Validation & Hostile Input Guard Suite', () => {
  it('safely catches malformed syntax with line/path without crashing', () => {
    const broken = '{\n  "schemaVersion": "2.0",\n  "model": 12345,,\n}';
    const res = VehicleSchemaValidator.validate(broken);
    expect(res.isValid).toBe(false);
    expect(res.errors[0].path).toBe('syntax');
    expect(res.errors[0].message).toContain('Malformed JSON');
  });

  it('rejects oversized JSON payloads exceeding 10MB limit', () => {
    // Generate 11MB string
    const big = ' ' .repeat(11 * 1024 * 1024);
    const res = VehicleSchemaValidator.validate(big);
    expect(res.isValid).toBe(false);
    expect(res.errors[0].message).toContain('exceeds 10MB safety limit');
  });

  it('neutralizes hostile prototype pollution attacks (__proto__, constructor)', () => {
    const malicious = JSON.stringify({
      format: 'Cherax Entity',
      model: 12345678,
      __proto__: { isAdmin: true },
      constructor: { hacked: true }
    });

    const res = VehicleSchemaValidator.validate(malicious);
    expect(res.isValid).toBe(true);
    expect(res.warnings.some(w => w.includes('Ignored hostile/prototype key'))).toBe(true);
    expect((({} as any).isAdmin)).toBeUndefined();
  });

  it('verifies 100% backward-compatibility by loading all golden fixtures', () => {
    const fixturesDir = path.resolve('tests/fixtures/vehicles');
    expect(fs.existsSync(fixturesDir)).toBe(true);

    const files = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.json') && f !== 'index.json');
    expect(files.length).toBeGreaterThanOrEqual(100);

    let passedCount = 0;
    for (const file of files) {
      const rawText = fs.readFileSync(path.join(fixturesDir, file), 'utf-8');
      const res = VehicleSchemaValidator.validate(rawText);
      expect(res.errors.length, `Failed on fixture ${file}`).toBe(0);
      expect(res.isValid).toBe(true);
      passedCount++;
    }

    expect(passedCount).toBe(files.length);
  });

  it('verifies export-then-import round-trip preserves configuration identity', () => {
    const sample = {
      schemaVersion: '2.0',
      vehicle: {
        id: 'test_roundtrip',
        manufacturer: 'AutoVerse',
        model: 'Roundtrip Test',
        generation: '1',
        year: 2026,
        category: 'supercar',
        geometryClass: 'procedural',
        geometrySource: 'original_autoverse_parametric_design',
        units: 'meters'
      },
      dimensions: {
        length: 4.5,
        width: 2.0,
        height: 1.2,
        wheelbase: 2.65,
        frontTrack: 1.68,
        rearTrack: 1.68,
        frontOverhang: 0.95,
        rearOverhang: 0.90
      },
      bodyGeometry: {
        crossSections: []
      },
      components: [],
      wheels: {
        frontLeft: { axle: 'front', side: 'left', tire: {}, rim: {}, brakes: {}, alignment: {} },
        frontRight: { axle: 'front', side: 'right', tire: {}, rim: {}, brakes: {}, alignment: {} },
        rearLeft: { axle: 'rear', side: 'left', tire: {}, rim: {}, brakes: {}, alignment: {} },
        rearRight: { axle: 'rear', side: 'right', tire: {}, rim: {}, brakes: {}, alignment: {} }
      },
      materials: [],
      validation: { accuracyClass: 'D_APPROXIMATE' }
    };

    const exported = JSON.stringify(sample, null, 2);
    const imported = VehicleSchemaValidator.validate(exported);
    expect(imported.isValid).toBe(true);
    expect(imported.data.vehicle.id).toBe('test_roundtrip');
    expect(imported.data.dimensions.length).toBe(4.5);
  });
});
