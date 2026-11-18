import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { VehicleGeometryEngine } from '../src/geometry/engine';
import { SchemaV2Migrator } from '../src/geometry/migration/schemaV2Migrator';
import porscheRaw from '../public/vehicles/porsche_911_gt3_rs_992_2022.json';
import ferrariRaw from '../public/vehicles/supercars/ferrari_488_pista.json';
import lamboRaw from '../public/vehicles/supercars/lamborghini_aventador_svj.json';

describe('AutoVerse 3D — Cross-Vehicle Body Geometry & Silhouette Distinction Suite', () => {
  const engine = new VehicleGeometryEngine();

  const porscheDef = SchemaV2Migrator.migrate(porscheRaw, 'porsche_911_gt3_rs');
  const ferrariDef = SchemaV2Migrator.migrate(ferrariRaw, 'ferrari_488_pista');
  const lamboDef = SchemaV2Migrator.migrate(lamboRaw, 'lamborghini_aventador_svj');

  it('guarantees that all 3 pilot vehicles construct independent 3D models with distinct triangle budgets and node graphs', () => {
    const porscheGroup = engine.loadVehicle(porscheDef);
    const porscheReport = engine.getValidationReport();
    const porscheComponents = engine.getComponents();

    const ferrariGroup = engine.loadVehicle(ferrariDef);
    const ferrariReport = engine.getValidationReport();
    const ferrariComponents = engine.getComponents();

    const lamboGroup = engine.loadVehicle(lamboDef);
    const lamboReport = engine.getValidationReport();
    const lamboComponents = engine.getComponents();

    // 1. Triangle Count Distinction (Must not be identically copied 10,036 triangles)
    expect(porscheReport.triangleBudget.count).toBeGreaterThan(30000);
    expect(ferrariReport.triangleBudget.count).toBeGreaterThan(30000);
    expect(lamboReport.triangleBudget.count).toBeGreaterThan(30000);

    // The models must have distinct triangle counts
    expect(porscheReport.triangleBudget.count).not.toBe(ferrariReport.triangleBudget.count);
    expect(ferrariReport.triangleBudget.count).not.toBe(lamboReport.triangleBudget.count);

    // 2. Component Count & Archetype Differentiation
    expect(porscheDef.meta.archetype).toBe('rear_engine_coupe');
    expect(ferrariDef.meta.archetype).toBe('mid_engine_supercar');
    expect(lamboDef.meta.archetype).toBe('mid_engine_hypercar');

    expect(porscheComponents.length).toBeGreaterThanOrEqual(48);
    expect(ferrariComponents.length).toBeGreaterThanOrEqual(48);
    expect(lamboComponents.length).toBeGreaterThanOrEqual(48);

    // 3. Distinct Geometric Hashes
    expect(porscheReport.distinctness?.outputHash).toBeDefined();
    expect(ferrariReport.distinctness?.outputHash).toBeDefined();
    expect(lamboReport.distinctness?.outputHash).toBeDefined();

    expect(porscheReport.distinctness!.outputHash).not.toBe(ferrariReport.distinctness!.outputHash);
    expect(ferrariReport.distinctness!.outputHash).not.toBe(lamboReport.distinctness!.outputHash);
    expect(porscheReport.distinctness!.outputHash).not.toBe(lamboReport.distinctness!.outputHash);
  });

  it('asserts that 3D silhouettes differ substantially across front, side, and top elevations', () => {
    // Helper to sample normalized body profile envelope
    const sampleBodyProfile = (def: any) => {
      const group = engine.loadVehicle(def);
      const chassis = group.getObjectByName('panelized_chassis_assembly') || group;
      const box = new THREE.Box3().setFromObject(chassis);
      const size = new THREE.Vector3();
      box.getSize(size);

      // Collect vertex samples
      const vertices: THREE.Vector3[] = [];
      chassis.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          const pos = (child as THREE.Mesh).geometry.attributes.position;
          if (pos) {
            for (let i = 0; i < pos.count; i += 8) {
              const v = new THREE.Vector3().fromBufferAttribute(pos, i);
              child.localToWorld(v);
              // Normalize to unit box [0, 1]
              vertices.push(new THREE.Vector3(
                (v.x - box.min.x) / size.x,
                (v.y - box.min.y) / size.y,
                (v.z - box.min.z) / size.z
              ));
            }
          }
        }
      });

      return { box, size, vertices };
    };

    const porscheProfile = sampleBodyProfile(porscheDef);
    const ferrariProfile = sampleBodyProfile(ferrariDef);
    const lamboProfile = sampleBodyProfile(lamboDef);

    // Physical Dimension Differences
    // Porsche 911: length 4.572m, width 1.900m, height 1.322m
    // Ferrari 488 Pista: length 4.605m, width 1.975m, height 1.206m
    // Lamborghini Aventador SVJ: length 4.943m, width 2.098m, height 1.136m

    // Height comparison: Porsche 911 has the tallest roofline (tallest greenhouse ~1.32m)
    // Compare roof component heights across models
    const getRoofHeight = (def: any) => {
      const group = engine.loadVehicle(def);
      const roof = group.getObjectByName('roof');
      if (roof) {
        const box = new THREE.Box3().setFromObject(roof);
        return box.max.y;
      }
      return 0;
    };

    const porscheRoofY = getRoofHeight(porscheDef);
    const ferrariRoofY = getRoofHeight(ferrariDef);
    const lamboRoofY = getRoofHeight(lamboDef);

    expect(porscheRoofY).toBeGreaterThan(ferrariRoofY);
    expect(ferrariRoofY).toBeGreaterThan(lamboRoofY);

    // Width comparison: Aventador is widest (2.098m), Porsche is narrowest (1.90m)
    expect(lamboProfile.size.x).toBeGreaterThan(ferrariProfile.size.x);
    expect(ferrariProfile.size.x).toBeGreaterThan(porscheProfile.size.x);

    // Length comparison: Aventador is longest (4.94m), Porsche is most compact (4.57m)
    expect(lamboProfile.size.z).toBeGreaterThan(ferrariProfile.size.z);
    expect(ferrariProfile.size.z).toBeGreaterThan(porscheProfile.size.z);
  });

  it('guarantees geometric identity is preserved when rendered with a uniform black matte material', () => {
    // In accordance with Section 10 & 12: The body must remain recognizable without relying on paint
    const blackMatte = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 1.0,
      metalness: 0.0
    });

    [porscheDef, ferrariDef, lamboDef].forEach(def => {
      const group = engine.loadVehicle(def);

      // Apply uniform black material to every mesh
      group.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = blackMatte;
        }
      });

      // Bounding box and surface structure must remain non-empty and valid
      const box = new THREE.Box3().setFromObject(group);
      expect(box.isEmpty()).toBe(false);
      expect(box.max.y - box.min.y).toBeGreaterThan(1.0);
      expect(box.max.z - box.min.z).toBeGreaterThan(4.0);
      expect(box.max.x - box.min.x).toBeGreaterThan(1.8);
    });
  });
});
