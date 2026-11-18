import { describe, it, expect } from 'vitest';
import { CatalogProjectMigrator } from '../src/migration/catalogProjectMigrator';

describe('AutoVerse 3D — Catalog Migration & Dashboard Integration Suite (Phase 14)', () => {
  it('migrates Schema 2.0 vehicle catalog entry into standard v2 Project Bundle layout (§6)', () => {
    const rawSchema2 = {
      schemaVersion: 2,
      vehicle: {
        id: 'porsche_911_gt3_rs',
        manufacturer: 'Porsche',
        model: '911 GT3 RS',
        year: 2023,
        category: 'supercars'
      },
      dimensions: {
        length: 4.572,
        width: 1.900,
        height: 1.322,
        wheelbase: 2.457,
        frontTrack: 1.630,
        rearTrack: 1.588,
        groundClearance: 0.100
      }
    };

    const bundle = CatalogProjectMigrator.migrateToV2Bundle(rawSchema2, 'porsche_911_gt3_rs');

    // Verify all required files exist
    expect(bundle['project.json']).toBeDefined();
    expect(bundle['project.json'].schemaVersion).toBe('2.0.0');
    expect(bundle['project.json'].lineage.migratedFromFormat).toBe('schema_v2');

    expect(bundle['vehicle_identity.json'].manufacturer).toBe('Porsche');
    expect(bundle['vehicle_identity.json'].model).toBe('911 GT3 RS');

    expect(bundle['dimensions.json'].overallLengthM).toBeCloseTo(4.572);
    expect(bundle['dimensions.json'].overallWidthM).toBeCloseTo(1.900);

    expect(bundle['components.json'].length).toBeGreaterThanOrEqual(3);
    expect(bundle['geometry_manifest.json'].files.length).toBeGreaterThan(0);
    expect(bundle['geometry_manifest.json'].files[0].coordSystem).toBe('ISO_8855_SAE');

    expect(bundle['history.json']).toBeDefined();
    expect(bundle['validation.json'].isValid).toBe(true);
    expect(bundle['references.json'].licence).toContain('CC-BY-4.0');
  });

  it('migrates legacy Cherax vehicle entity format into v2 Project Bundle', () => {
    const rawCherax = {
      format: 'Cherax Entity',
      modelHash: 0x12345678,
      name: 'Custom Tuner GT',
      primaryColor: 42,
      mods: {
        spoiler: 3,
        frontBumper: 2
      }
    };

    const bundle = CatalogProjectMigrator.migrateToV2Bundle(rawCherax, 'custom_tuner_gt');

    expect(bundle['project.json'].lineage.migratedFromFormat).toBe('cherax_legacy');
    expect(bundle['dimensions.json'].overallLengthM).toBeGreaterThan(3.5);
    expect(bundle['dimensions.json'].overallWidthM).toBeGreaterThan(1.5);
    expect(bundle['components.json'].some(c => c.id === 'body_shell')).toBe(true);
  });
});
