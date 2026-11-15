import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import {
  VehicleGeometryEngine,
  VehicleGeometryDefinition
} from '../src/geometry';

const mockPorschePilotDef: VehicleGeometryDefinition = {
  schemaVersion: 2,
  meta: {
    id: 'porsche_911_gt3_rs_992_2022',
    manufacturer: 'Porsche',
    model: '911 GT3 RS',
    generation: '992',
    year: 2022,
    archetype: 'rear_engine_coupe'
  },
  geometry: {
    generatorId: 'coachwork_generator_v2',
    generatorVersion: '2.0.0',
    fidelityTier: 'Tier B – Spec-accurate',
    units: 'meters',
    origin: 'ground_center',
    dimensions: {
      overall_length_m: 4.572,
      overall_width_m: 1.900,
      overall_height_m: 1.322,
      wheelbase_m: 2.457,
      front_track_m: 1.630,
      rear_track_m: 1.582,
      ground_clearance_m: 0.100
    },
    stations: [
      { station_z_m: 2.2, width_half_m: 0.85, floor_y_m: 0.12, rocker_y_m: 0.22, belt_y_m: 0.65, roof_y_m: 0.68 },
      { station_z_m: 1.2, width_half_m: 0.94, floor_y_m: 0.10, rocker_y_m: 0.25, belt_y_m: 0.72, roof_y_m: 0.82 },
      { station_z_m: 0.0, width_half_m: 0.95, floor_y_m: 0.10, rocker_y_m: 0.25, belt_y_m: 0.74, roof_y_m: 1.32 },
      { station_z_m: -1.2, width_half_m: 0.96, floor_y_m: 0.10, rocker_y_m: 0.26, belt_y_m: 0.74, roof_y_m: 1.15 },
      { station_z_m: -2.2, width_half_m: 0.92, floor_y_m: 0.14, rocker_y_m: 0.28, belt_y_m: 0.68, roof_y_m: 0.72 }
    ]
  },
  reference: {
    specs: {
      overall_length_m: { value: 4.572, provenance: 'verified', source: 'Porsche Newsroom' },
      wheelbase_m: { value: 2.457, provenance: 'verified', source: 'Porsche Newsroom' }
    }
  },
  wheels: {
    front: {
      rimDiameterInches: 20,
      rimWidthInches: 9.5,
      nominalSectionWidthMm: 275,
      aspectRatio: 35,
      offsetMm: 42,
      spokeStyle: 'center_lock_y_spoke',
      finish: 'satin_black',
      brakeDiscType: 'carbon_ceramic',
      caliperColor: '#00F0FF'
    },
    rear: {
      rimDiameterInches: 21,
      rimWidthInches: 12.0,
      nominalSectionWidthMm: 335,
      aspectRatio: 30,
      offsetMm: 45,
      spokeStyle: 'center_lock_y_spoke',
      finish: 'satin_black',
      brakeDiscType: 'carbon_ceramic',
      caliperColor: '#00F0FF'
    }
  },
  materials: {
    body_paint: {
      type: 'clearcoat_paint',
      color: '#B2B9C2',
      roughness: 0.18,
      metalness: 0.35,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    }
  },
  shutLineGapMm: 3
};

describe('AutoVerse 3D — Geometry Engine V2 (Phase C Architecture)', () => {
  let engine: VehicleGeometryEngine;

  beforeEach(() => {
    engine = new VehicleGeometryEngine();
  });

  it('guarantees geometry engine has ZERO imports from UI layer', () => {
    const geometryDir = path.resolve('src/geometry');
    const files = fs.readdirSync(geometryDir, { recursive: true })
      .filter((f: any) => typeof f === 'string' && (f.endsWith('.ts') || f.endsWith('.tsx')));

    const forbiddenImports = ['react', 'react-dom', '@react-three/fiber', '@react-three/drei', 'lucide-react', 'components', 'hooks'];

    files.forEach((file: any) => {
      const content = fs.readFileSync(path.join(geometryDir, file), 'utf8');
      forbiddenImports.forEach(imp => {
        const regex = new RegExp(`from\\s+['"][^'"]*${imp}[^'"]*['"]`, 'i');
        expect(regex.test(content), `Forbidden UI import '${imp}' found in src/geometry/${file}`).toBe(false);
      });
    });
  });

  it('constructs a componentized vehicle with separable wheels and passing quality gates', () => {
    const group = engine.loadVehicle(mockPorschePilotDef);
    expect(group).toBeInstanceOf(THREE.Group);

    group.children.forEach(child => {
      const b = new THREE.Box3().setFromObject(child);
      console.log(`Child: ${child.name}, minY: ${b.min.y}, maxY: ${b.max.y}, minZ: ${b.min.z}, maxZ: ${b.max.z}`);
    });

    const components = engine.getComponents();
    expect(components.length).toBeGreaterThanOrEqual(18);

    // Verify all 4 corner wheel assemblies are present and separable
    const compIds = components.map(c => c.id);
    expect(compIds).toContain('wheel_fl');
    expect(compIds).toContain('wheel_fr');
    expect(compIds).toContain('wheel_rl');
    expect(compIds).toContain('wheel_rr');

    // Verify key aerodynamic and body components
    expect(compIds).toContain('rear_wing');
    expect(compIds).toContain('wing_upright_l');
    expect(compIds).toContain('wing_upright_r');
    expect(compIds).toContain('hood');
    expect(compIds).toContain('front_splitter');

    // Evaluate Quality Gates
    const report = engine.getValidationReport();
    if (!report.allPassed) {
      console.log('Quality Report Debug:', JSON.stringify(report, null, 2));
    }
    expect(report.allPassed).toBe(true);
    expect(report.groundContact.pass).toBe(true);
    expect(report.symmetry.pass).toBe(true);
    expect(report.noFloatingGeometry.pass).toBe(true);
    expect(report.componentization.pass).toBe(true);
  });

  it('supports visibility control and isolation without deformative coupling', () => {
    engine.loadVehicle(mockPorschePilotDef);

    // Hide hood
    engine.setVisible('hood', false);
    const hood = engine.getComponents().find(c => c.id === 'hood');
    expect(hood?.visible).toBe(false);

    // Isolate rear wing
    engine.isolate('rear_wing');
    const components = engine.getComponents();
    const wing = components.find(c => c.id === 'rear_wing');
    const doors = components.find(c => c.id === 'door_l');
    expect(wing?.visible).toBe(true);
    expect(doors?.visible).toBe(false);

    // Show all
    engine.showAll();
    expect(engine.getComponents().every(c => c.visible)).toBe(true);
  });

  it('applies per-instance cloned materials without mutating shared definitions', () => {
    const group = engine.loadVehicle(mockPorschePilotDef);
    const hoodMesh = group.getObjectByName('hood') as THREE.Mesh;
    const roofMesh = group.getObjectByName('roof') as THREE.Mesh;

    // Initially hood and roof share default body paint material
    expect((hoodMesh.material as any).color.getHexString()).toBe((roofMesh.material as any).color.getHexString());

    // Apply custom Racing Yellow paint specifically to hood
    engine.applyMaterial('hood', { color: '#FFD700', roughness: 0.1 });

    const newHoodColor = (hoodMesh.material as any).color.getHexString().toLowerCase();
    const roofColor = (roofMesh.material as any).color.getHexString().toLowerCase();

    expect(newHoodColor).toBe('ffd700');
    expect(roofColor).not.toBe('ffd700'); // Roof was not accidentally mutated!
  });

  it('cleans up and disposes all GPU geometry and material buffers', () => {
    const group = engine.loadVehicle(mockPorschePilotDef);
    expect(group.children.length).toBeGreaterThan(0);

    engine.dispose();
    expect(engine.getComponents().length).toBe(0);
  });
});
