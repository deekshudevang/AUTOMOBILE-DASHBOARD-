import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import { EditableVehicleAssembler } from '../packages/vehicle-generation-engine/src/geometry/editableVehicleAssembler';
import { parseVehicleJson } from '../src/utils/jsonParser';
import { VehicleSchema2 } from '../packages/shared-types/src/schema2';

describe('AutoVerse 3D — Schema 2.0 Complete 50-Vehicle Library & Editable Component Suite', () => {
  const indexPath = path.resolve(__dirname, '../public/vehicles/index.json');
  const indexRaw = fs.readFileSync(indexPath, 'utf-8');
  const indexData = JSON.parse(indexRaw);

  it('indexes exactly 50 authentic Schema 2.0 vehicle models', () => {
    expect(indexData.schema_version).toBe('2.0.0');
    expect(indexData.asset_count).toBe(50);
    expect(indexData.assets.length).toBe(50);
  });

  it('contains all 8 required vehicle categories', () => {
    const categories = new Set(indexData.assets.map((a: any) => a.category));
    expect(categories.has('supercars')).toBe(true);
    expect(categories.has('hypercars')).toBe(true);
    expect(categories.has('sports_cars')).toBe(true);
    expect(categories.has('luxury_cars')).toBe(true);
    expect(categories.has('jdm_cars')).toBe(true);
    expect(categories.has('muscle_cars')).toBe(true);
    expect(categories.has('special_edition')).toBe(true);
    expect(categories.has('track_cars')).toBe(true);
  });

  it('verifies all 50 vehicle files exist, parse cleanly, and have unique IDs', () => {
    const ids = new Set<string>();

    for (const asset of indexData.assets) {
      const filePath = path.resolve(__dirname, '../public/vehicles', asset.file);
      expect(fs.existsSync(filePath)).toBe(true);

      const content = fs.readFileSync(filePath, 'utf-8');
      const data: VehicleSchema2 = JSON.parse(content);

      // Schema 2.0 integrity
      expect(data.schemaVersion).toBe('2.0');
      expect(data.vehicle.id).toBe(asset.asset_id);
      expect(ids.has(data.vehicle.id)).toBe(false);
      ids.add(data.vehicle.id);

      // Dimensions validation
      expect(data.dimensions.length).toBeGreaterThan(3.5);
      expect(data.dimensions.width).toBeGreaterThan(1.5);
      expect(data.dimensions.height).toBeGreaterThan(0.9);
      expect(data.dimensions.wheelbase).toBeGreaterThan(2.0);

      // Body geometry cross-sections
      expect(data.bodyGeometry.crossSections.length).toBeGreaterThanOrEqual(15);

      // 4 Independent Wheel Assemblies
      expect(data.wheels.frontLeft).toBeDefined();
      expect(data.wheels.frontRight).toBeDefined();
      expect(data.wheels.rearLeft).toBeDefined();
      expect(data.wheels.rearRight).toBeDefined();

      // Component hierarchy
      expect(data.components.length).toBeGreaterThanOrEqual(25);
      const compIds = new Set<string>();
      for (const comp of data.components) {
        expect(comp.id).toBeDefined();
        expect(compIds.has(comp.id)).toBe(false);
        compIds.add(comp.id);
        expect(comp.editable).toBe(true);
        expect(comp.transform).toBeDefined();
        expect(comp.materialRef).toBeDefined();
      }

      // Materials validation
      expect(data.materials.length).toBeGreaterThanOrEqual(8);
      const matIds = new Set(data.materials.map(m => m.id));
      for (const comp of data.components) {
        expect(matIds.has(comp.materialRef)).toBe(true);
      }
    }
  });

  it('verifies parseVehicleJson recognizes Schema 2.0 format', () => {
    const aventadorPath = path.resolve(__dirname, '../public/vehicles/supercars/lamborghini_aventador_svj.json');
    const raw = fs.readFileSync(aventadorPath, 'utf-8');
    const result = parseVehicleJson(raw);

    expect(result.success).toBe(true);
    expect(result.format).toBe('Parametric Vehicle');
    expect(result.config?.parametricSpec).toBeDefined();
    expect(result.config?.parametricSpec.schemaVersion).toBe('2.0');
  });

  it('assembles a high-detail 3D vehicle scene graph via EditableVehicleAssembler', () => {
    const aventadorPath = path.resolve(__dirname, '../public/vehicles/supercars/lamborghini_aventador_svj.json');
    const spec: VehicleSchema2 = JSON.parse(fs.readFileSync(aventadorPath, 'utf-8'));

    const carGroup = EditableVehicleAssembler.build(spec);
    expect(carGroup).toBeInstanceOf(THREE.Group);
    expect(carGroup.children.length).toBeGreaterThan(10);
    expect(carGroup.userData.isSchema2Vehicle).toBe(true);
    expect(carGroup.userData.vehicleId).toBe('lamborghini_aventador_svj');

    // Check specific components
    const frontBumper = carGroup.getObjectByName('front_bumper');
    const rearWing = carGroup.getObjectByName('rear_wing');
    const frontSplitter = carGroup.getObjectByName('front_splitter');
    const wheelFL = carGroup.getObjectByName('wheel_front_left');

    expect(frontBumper).toBeDefined();
    expect(rearWing).toBeDefined();
    expect(frontSplitter).toBeDefined();
    expect(wheelFL).toBeDefined();

    expect(frontBumper?.userData.componentId).toBe('front_bumper');
    expect(frontBumper?.userData.isEditableComponent).toBe(true);

    // Verify no NaNs in bounding box
    const bbox = new THREE.Box3().setFromObject(carGroup);
    const size = bbox.getSize(new THREE.Vector3());
    expect(Number.isNaN(size.x)).toBe(false);
    expect(Number.isNaN(size.y)).toBe(false);
    expect(Number.isNaN(size.z)).toBe(false);
    expect(size.z).toBeCloseTo(spec.dimensions.length, 0);
  });

  it('applies real-time component overrides (transforms, dimensions, materials, visibility)', () => {
    const aventadorPath = path.resolve(__dirname, '../public/vehicles/supercars/lamborghini_aventador_svj.json');
    const spec: VehicleSchema2 = JSON.parse(fs.readFileSync(aventadorPath, 'utf-8'));

    // Apply custom overrides on rear_wing and front_bumper
    const overrides = {
      rear_wing: {
        componentId: 'rear_wing',
        position: [0, 1.45, -2.15] as [number, number, number],
        rotation: [-0.25, 0, 0] as [number, number, number],
        scale: [1.1, 1.1, 1.1] as [number, number, number],
        materialFinish: 'carbon_fiber' as const
      },
      front_bumper: {
        componentId: 'front_bumper',
        visible: false // Hiding front bumper
      }
    };

    const modifiedGroup = EditableVehicleAssembler.build(spec, {
      componentOverrides: overrides,
      selectedComponentId: 'rear_wing'
    });

    // Check that front bumper was hidden
    const hiddenBumper = modifiedGroup.getObjectByName('front_bumper');
    expect(hiddenBumper).toBeUndefined();

    // Check rear wing transform was updated
    const modifiedWing = modifiedGroup.getObjectByName('rear_wing');
    expect(modifiedWing).toBeDefined();
    expect(modifiedWing?.position.y).toBeCloseTo(1.45, 2);
    expect(modifiedWing?.position.z).toBeCloseTo(-2.15, 2);
    expect(modifiedWing?.rotation.x).toBeCloseTo(-0.25, 2);
    expect(modifiedWing?.scale.x).toBeCloseTo(1.1, 2);
  });
});

