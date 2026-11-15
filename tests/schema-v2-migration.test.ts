import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { SchemaV2Migrator, VehicleGeometryEngine } from '../src/geometry';

describe('AutoVerse 3D — Schema V2 Migration Pipeline (Phase D)', () => {
  const engine = new VehicleGeometryEngine();

  it('detects schema formats correctly', () => {
    const v1Parametric = JSON.parse(
      fs.readFileSync(path.resolve('public/vehicles/porsche_911_gt3_rs_992_2022.json'), 'utf8')
    );
    const v2Category = JSON.parse(
      fs.readFileSync(path.resolve('public/vehicles/sports_cars/porsche_911_gt3_rs.json'), 'utf8')
    );
    const cherax = JSON.parse(
      fs.readFileSync(path.resolve('public/vehicles/10F Red-Carbon.json'), 'utf8')
    );

    expect(SchemaV2Migrator.detectFormat(v1Parametric)).toBe('schema_v1_parametric');
    expect(SchemaV2Migrator.detectFormat(v2Category)).toBe('schema_v2');
    expect(SchemaV2Migrator.detectFormat(cherax)).toBe('cherax_legacy');
    expect(SchemaV2Migrator.detectFormat({})).toBe('unknown');
    expect(SchemaV2Migrator.detectFormat(null)).toBe('unknown');
  });

  it('migrates Schema 1.0 Parametric vehicle to Schema 2.0 with full provenance', () => {
    const raw = JSON.parse(
      fs.readFileSync(path.resolve('public/vehicles/porsche_911_gt3_rs_992_2022.json'), 'utf8')
    );
    const migrated = SchemaV2Migrator.migrate(raw, 'porsche_911_gt3_rs_992_2022');

    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.meta.id).toBe('porsche_911_gt3_rs_992_2022');
    expect(migrated.meta.manufacturer).toBe('Porsche');
    expect(migrated.meta.model).toBe('911 GT3 RS');
    expect(migrated.meta.generation).toBe('992');
    expect(migrated.geometry.fidelityTier).toBe('Tier B – Spec-accurate');
    expect(migrated.reference.specs.overall_length_m.value).toBe(4.572);
    expect(migrated.reference.specs.overall_length_m.provenance).toBe('verified');
    expect(migrated.reference.specs.overall_length_m.source).toBe('Porsche Newsroom');

    // Verify engine can build 3D mesh from migrated object
    const group = engine.loadVehicle(migrated);
    expect(group).toBeDefined();
    expect(engine.getComponents().length).toBeGreaterThanOrEqual(18);
  });

  it('migrates Schema 2.0 category subfolder vehicle without loss of specs', () => {
    const raw = JSON.parse(
      fs.readFileSync(path.resolve('public/vehicles/sports_cars/porsche_911_gt3_rs.json'), 'utf8')
    );
    const migrated = SchemaV2Migrator.migrate(raw, 'porsche_911_gt3_rs');

    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.meta.manufacturer).toBe('Porsche');
    expect(migrated.geometry.dimensions.overall_length_m).toBe(4.572);
    expect(migrated.geometry.dimensions.overall_width_m).toBe(1.9);
    expect(migrated.geometry.dimensions.wheelbase_m).toBe(2.457);

    const group = engine.loadVehicle(migrated);
    expect(group).toBeDefined();
    expect(engine.getComponents().length).toBeGreaterThanOrEqual(18);
  });

  it('migrates Cherax legacy entity safely with Tier C labeling', () => {
    const raw = JSON.parse(
      fs.readFileSync(path.resolve('public/vehicles/10F Red-Carbon.json'), 'utf8')
    );
    const migrated = SchemaV2Migrator.migrate(raw, '10f_red_carbon');

    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.meta.id).toBe('10f_red_carbon');
    expect(migrated.geometry.fidelityTier).toBe('Tier C – Approximate');

    const group = engine.loadVehicle(migrated);
    expect(group).toBeDefined();
  });

  it('handles corrupted or empty payload gracefully without throwing', () => {
    const migratedEmpty = SchemaV2Migrator.migrate({}, 'empty_fallback');
    expect(migratedEmpty.schemaVersion).toBe(2);
    expect(migratedEmpty.geometry.fidelityTier).toBe('Tier C – Approximate');

    const migratedNull = SchemaV2Migrator.migrate(null as any, 'null_fallback');
    expect(migratedNull.schemaVersion).toBe(2);
    expect(migratedNull.meta.id).toBe('null_fallback');

    const group = engine.loadVehicle(migratedNull);
    expect(group).toBeDefined();
  });
});
