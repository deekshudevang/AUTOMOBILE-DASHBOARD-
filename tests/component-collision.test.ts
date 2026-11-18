import { describe, it, expect } from 'vitest';
import { ComponentManager, ComponentDefinition } from '../src/geometry/components/componentManager';
import { CollisionDetector, DynamicSuspensionState } from '../src/geometry/components/collisionDetector';

describe('AutoVerse 3D — Component Manager & Collision Detection Suite (Phase 6)', () => {
  it('registers components, builds hierarchy tree, and detects cycles', () => {
    const manager = new ComponentManager();

    const chassis: ComponentDefinition = {
      id: 'chassis_frame',
      name: 'Chassis Monocoque',
      semanticType: 'chassis_frame',
      attachmentPoints: [],
      material: { materialId: 'carbon', type: 'carbon_fiber' },
      provenance: 'photo-reconstruction',
      massEstimateKg: { value: 180, isEstimate: true },
      locked: true,
      visible: true,
      geometryHash: 'hash_chassis_001'
    };

    const rearDeck: ComponentDefinition = {
      id: 'rear_deck',
      name: 'Rear Decklid',
      semanticType: 'rear_deck',
      parentId: 'chassis_frame',
      attachmentPoints: [{ name: 'wing_mount_l', anchorId: 'anc_w_l', localPosition: [-1.8, 0.4, 0.9], required: true }],
      material: { materialId: 'paint', type: 'body_paint' },
      provenance: 'photo-reconstruction',
      massEstimateKg: { value: 12, isEstimate: true },
      locked: false,
      visible: true,
      geometryHash: 'hash_rear_deck_001'
    };

    const rearWing: ComponentDefinition = {
      id: 'rear_wing',
      name: 'GT3 Swan-Neck Wing',
      semanticType: 'rear_wing',
      parentId: 'rear_deck',
      attachmentPoints: [{ name: 'deck_mount_l', anchorId: 'anc_w_l', localPosition: [-1.8, 0.4, 1.2], required: true }],
      material: { materialId: 'carbon', type: 'carbon_fiber' },
      provenance: 'photo-reconstruction',
      massEstimateKg: { value: 6.5, isEstimate: true },
      locked: false,
      visible: true,
      geometryHash: 'hash_rear_wing_001'
    };

    manager.registerComponent(chassis);
    manager.registerComponent(rearDeck);
    manager.registerComponent(rearWing);

    const hierarchy = manager.buildHierarchy();
    expect(hierarchy.length).toBe(3);

    const chassisNode = hierarchy.find(n => n.id === 'chassis_frame');
    expect(chassisNode?.childrenIds).toContain('rear_deck');

    const deckNode = hierarchy.find(n => n.id === 'rear_deck');
    expect(deckNode?.childrenIds).toContain('rear_wing');

    // Test cycle detection
    const cyclicComp: ComponentDefinition = {
      id: 'loop_child',
      name: 'Loop Child',
      semanticType: 'custom',
      parentId: 'loop_child', // Self-loop
      attachmentPoints: [],
      material: { materialId: 'paint', type: 'body_paint' },
      provenance: 'user-created',
      massEstimateKg: { value: 5, isEstimate: true },
      locked: false,
      visible: true,
      geometryHash: 'hash_loop'
    };
    const cycleManager = new ComponentManager();
    cycleManager.registerComponent(cyclicComp);
    expect(() => cycleManager.buildHierarchy()).toThrow(/Cycle detected/);
  });

  it('mirrors components across the SAE symmetry plane (Y=0)', () => {
    const manager = new ComponentManager();

    const fenderL: ComponentDefinition = {
      id: 'fender_front_l',
      name: 'Front Left Fender',
      semanticType: 'fender_front_l',
      attachmentPoints: [
        { name: 'mount_a_left', anchorId: 'anc_f_l', localPosition: [1.2, 0.85, 0.65], required: true }
      ],
      bounds: {
        min: [0.8, 0.75, 0.3],
        max: [1.6, 0.95, 0.8]
      },
      material: { materialId: 'paint', type: 'body_paint' },
      provenance: 'photo-reconstruction',
      massEstimateKg: { value: 4.2, isEstimate: true },
      locked: false,
      visible: true,
      geometryHash: 'hash_fender_l'
    };

    manager.registerComponent(fenderL);
    const fenderR = manager.mirrorComponent('fender_front_l', 'fender_front_r', 'Front Right Fender');

    expect(fenderR.id).toBe('fender_front_r');
    expect(fenderR.semanticType).toBe('fender_front_r');
    // Check mirrored attachment point Y inverted
    expect(fenderR.attachmentPoints[0].localPosition[1]).toBeCloseTo(-0.85);
    expect(fenderR.attachmentPoints[0].name).toBe('mount_a_right');
    // Check mirrored bounds
    expect(fenderR.bounds?.min[1]).toBeCloseTo(-0.95);
    expect(fenderR.bounds?.max[1]).toBeCloseTo(-0.75);
  });

  it('calculates total vehicle mass estimate with explicit estimate flag', () => {
    const manager = new ComponentManager([
      {
        id: 'comp_1',
        name: 'Body',
        semanticType: 'body_shell',
        attachmentPoints: [],
        material: { materialId: 'paint', type: 'body_paint' },
        provenance: 'photo-reconstruction',
        massEstimateKg: { value: 350.5, isEstimate: true },
        locked: false,
        visible: true,
        geometryHash: 'h1'
      },
      {
        id: 'comp_2',
        name: 'Engine',
        semanticType: 'engine_block',
        attachmentPoints: [],
        material: { materialId: 'metal', type: 'aluminum' },
        provenance: 'photo-reconstruction',
        massEstimateKg: { value: 210.2, isEstimate: true },
        locked: false,
        visible: true,
        geometryHash: 'h2'
      }
    ]);

    const massReport = manager.calculateTotalMassEstimate();
    expect(massReport.totalMassKg).toBe(560.7);
    expect(massReport.isEstimate).toBe(true);
    expect(massReport.componentCount).toBe(2);
  });

  it('accurately computes AABB clearances and contact points', () => {
    // Two separated boxes along X axis
    const boxA = { min: [0, 0, 0] as [number, number, number], max: [1, 1, 1] as [number, number, number] };
    const boxB = { min: [1.05, 0, 0] as [number, number, number], max: [2, 1, 1] as [number, number, number] };

    const separated = CollisionDetector.computeAABBClearance(boxA, boxB);
    expect(separated.clearanceM).toBeCloseTo(0.05);

    // Two intersecting boxes (penetrating by 0.1m along X)
    const boxC = { min: [0.9, 0, 0] as [number, number, number], max: [2, 1, 1] as [number, number, number] };
    const intersecting = CollisionDetector.computeAABBClearance(boxA, boxC);
    expect(intersecting.clearanceM).toBeLessThan(0);
    expect(intersecting.clearanceM).toBeCloseTo(-0.1);
  });

  it('evaluates dynamic wheel arch clearance under steering lock and bump travel', () => {
    // Wheel centered at X=1.2, Y=0.8, Z=0.35, radius 0.35m, width 0.28m
    const wheelComp: ComponentDefinition = {
      id: 'wheel_fl',
      name: 'Front Left Wheel',
      semanticType: 'wheel_fl',
      attachmentPoints: [],
      bounds: {
        min: [1.2 - 0.35, 0.8 - 0.14, 0],
        max: [1.2 + 0.35, 0.8 + 0.14, 0.7]
      },
      material: { materialId: 'rubber', type: 'rubber' },
      provenance: 'photo-reconstruction',
      massEstimateKg: { value: 22, isEstimate: true },
      locked: false,
      visible: true,
      geometryHash: 'wheel_fl_hash'
    };

    // Tight fender arch located right above the wheel (clearance = 10mm in static, collides in +50mm bump)
    const tightFenderComp: ComponentDefinition = {
      id: 'fender_front_l',
      name: 'Front Left Fender',
      semanticType: 'fender_front_l',
      attachmentPoints: [],
      bounds: {
        min: [1.2 - 0.38, 0.8 - 0.16, 0.71], // 10mm above top of wheel (0.71 vs 0.70)
        max: [1.2 + 0.38, 0.8 + 0.16, 1.0]
      },
      material: { materialId: 'paint', type: 'body_paint' },
      provenance: 'photo-reconstruction',
      massEstimateKg: { value: 4, isEstimate: true },
      locked: false,
      visible: true,
      geometryHash: 'fender_l_hash'
    };

    const warnings = CollisionDetector.checkWheelArchClearance(wheelComp, tightFenderComp, {
      bumpTravelM: 0.05, // 50mm bump pushes wheel top to Z=0.75m -> penetrating fender by 40mm
      reboundTravelM: -0.03,
      steeringAngleDeg: 35
    });

    expect(warnings.length).toBeGreaterThan(0);
    const critical = warnings.find(w => w.severity === 'CRITICAL');
    expect(critical).toBeDefined();
    expect(critical?.blocksCFD).toBe(true);
    expect(critical?.description).toContain('Tire collision detected');
  });

  it('detects ground plane collision for low aero splitters', () => {
    // Splitter penetrating ground (lowest Z = -0.01m)
    const scrapingSplitter: ComponentDefinition = {
      id: 'front_splitter',
      name: 'Front Carbon Splitter',
      semanticType: 'front_splitter',
      attachmentPoints: [],
      bounds: {
        min: [1.8, -0.9, -0.01], // Negative Z -> ground penetration
        max: [2.2, 0.9, 0.05]
      },
      material: { materialId: 'carbon', type: 'carbon_fiber' },
      provenance: 'photo-reconstruction',
      massEstimateKg: { value: 5, isEstimate: true },
      locked: false,
      visible: true,
      geometryHash: 'splitter_hash'
    };

    const warnings = CollisionDetector.checkGroundClearance(scrapingSplitter, 30);
    expect(warnings.length).toBe(1);
    expect(warnings[0].severity).toBe('CRITICAL');
    expect(warnings[0].blocksCFD).toBe(true);
    expect(warnings[0].description).toContain('penetrates ground plane');
  });

  it('runs complete assembly clearance audit and gates CFD readiness', () => {
    const validChassis: ComponentDefinition = {
      id: 'chassis',
      name: 'Chassis',
      semanticType: 'chassis_frame',
      attachmentPoints: [],
      material: { materialId: 'm', type: 'aluminum' },
      provenance: 'photo-reconstruction',
      massEstimateKg: { value: 500, isEstimate: true },
      locked: false,
      visible: true,
      geometryHash: 'h'
    };

    const validSplitter: ComponentDefinition = {
      id: 'front_splitter',
      name: 'Aero Splitter',
      semanticType: 'front_splitter',
      parentId: 'chassis',
      attachmentPoints: [],
      bounds: {
        min: [1.8, -0.8, 0.06], // 60mm ground clearance -> safe (> 30mm)
        max: [2.2, 0.8, 0.1]
      },
      material: { materialId: 'm', type: 'carbon_fiber' },
      provenance: 'photo-reconstruction',
      massEstimateKg: { value: 6, isEstimate: true },
      locked: false,
      visible: true,
      geometryHash: 'h'
    };

    const audit1 = CollisionDetector.auditAssemblyClearances([validChassis, validSplitter]);
    expect(audit1.passed).toBe(true);
    expect(audit1.canProceedToCFD).toBe(true);
    expect(audit1.criticalCount).toBe(0);

    // Unanchored component pointing to non-existent parent
    const orphanWing: ComponentDefinition = {
      id: 'rear_wing',
      name: 'Rear Wing',
      semanticType: 'rear_wing',
      parentId: 'non_existent_trunk',
      attachmentPoints: [],
      material: { materialId: 'm', type: 'carbon_fiber' },
      provenance: 'photo-reconstruction',
      massEstimateKg: { value: 8, isEstimate: true },
      locked: false,
      visible: true,
      geometryHash: 'h'
    };

    const audit2 = CollisionDetector.auditAssemblyClearances([validChassis, validSplitter, orphanWing]);
    expect(audit2.passed).toBe(false);
    expect(audit2.canProceedToCFD).toBe(false);
    expect(audit2.criticalCount).toBe(1);
    expect(audit2.warnings[0].id).toContain('MNT-MISSING-PARENT');
  });
});
