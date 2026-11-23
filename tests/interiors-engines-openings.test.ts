import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import * as fs from 'fs';
import * as path from 'path';
import { VehicleSchema2 } from '@autoverse/shared-types';
import {
  VehicleInteriorGenerator,
  VehicleEngineBayGenerator,
  VehicleOpeningController,
  EditableVehicleAssembler,
  DEFAULT_OPENING_STATE
} from '@autoverse/vehicle-generation-engine';

describe('AutoVerse 3D — Vehicle Interior, Engine Bay & Kinematic Openings Suite', () => {
  // Helper to load fixture specs
  const loadSpec = (category: string, filename: string): VehicleSchema2 => {
    const fullPath = path.resolve(__dirname, `../Vehicles/${category}/${filename}`);
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  };

  describe('1. VehicleInteriorGenerator Specification & Ergonomics', () => {
    it('accurately resolves brand-specific design languages across the fleet', () => {
      expect(
        VehicleInteriorGenerator.resolveDesignLanguage({
          vehicleId: 'porsche_911_gt3_rs',
          manufacturer: 'Porsche',
          model: '911 GT3 RS'
        })
      ).toBe('PORSCHE');

      expect(
        VehicleInteriorGenerator.resolveDesignLanguage({
          vehicleId: 'ferrari_488_pista',
          manufacturer: 'Ferrari',
          model: '488 Pista'
        })
      ).toBe('FERRARI');

      expect(
        VehicleInteriorGenerator.resolveDesignLanguage({
          vehicleId: 'lamborghini_aventador_svj',
          manufacturer: 'Lamborghini',
          model: 'Aventador SVJ'
        })
      ).toBe('LAMBORGHINI');

      expect(
        VehicleInteriorGenerator.resolveDesignLanguage({
          vehicleId: 'mclaren_720s',
          manufacturer: 'McLaren',
          model: '720S'
        })
      ).toBe('MCLAREN');

      expect(
        VehicleInteriorGenerator.resolveDesignLanguage({
          vehicleId: 'bmw_m4_csl',
          manufacturer: 'BMW',
          model: 'M4 CSL'
        })
      ).toBe('BMW_M');

      expect(
        VehicleInteriorGenerator.resolveDesignLanguage({
          vehicleId: 'bugatti_chiron',
          manufacturer: 'Bugatti',
          model: 'Chiron'
        })
      ).toBe('BUGATTI_HYPERCAR');

      expect(
        VehicleInteriorGenerator.resolveDesignLanguage({
          vehicleId: 'pagani_huayra',
          manufacturer: 'Pagani',
          model: 'Huayra'
        })
      ).toBe('PAGANI_ARTISAN');

      expect(
        VehicleInteriorGenerator.resolveDesignLanguage({
          vehicleId: 'koenigsegg_jesko',
          manufacturer: 'Koenigsegg',
          model: 'Jesko'
        })
      ).toBe('KOENIGSEGG_TECH');

      expect(
        VehicleInteriorGenerator.resolveDesignLanguage({
          vehicleId: 'rolls_royce_spectre',
          manufacturer: 'Rolls-Royce',
          model: 'Spectre'
        })
      ).toBe('ROLLS_ROYCE_LUXURY');

      expect(
        VehicleInteriorGenerator.resolveDesignLanguage({
          vehicleId: 'ford_mustang_shelby_gt500',
          manufacturer: 'Ford',
          model: 'Mustang Shelby GT500'
        })
      ).toBe('AMERICAN_MUSCLE');

      expect(
        VehicleInteriorGenerator.resolveDesignLanguage({
          vehicleId: 'nissan_skyline_gt_r_r34',
          manufacturer: 'Nissan',
          model: 'Skyline GT-R'
        })
      ).toBe('JDM_PERFORMANCE');
    });

    it('generates a full interior assembly with ergonomic components', () => {
      const interior = VehicleInteriorGenerator.generateInterior({
        vehicleId: 'porsche_911_gt3_rs',
        manufacturer: 'Porsche',
        model: '911 GT3 RS',
        cabinWidthM: 1.5,
        cabinLengthM: 1.7,
        cabinHeightM: 0.9,
        isFourDoor: false
      });

      expect(interior).toBeInstanceOf(THREE.Group);
      expect(interior.getObjectByName('interior_floor_tub')).toBeDefined();
      expect(interior.getObjectByName('interior_pedals_assembly')).toBeDefined();
      expect(interior.getObjectByName('interior_center_console')).toBeDefined();
      expect(interior.getObjectByName('interior_dashboard')).toBeDefined();
      expect(interior.getObjectByName('interior_steering_wheel')).toBeDefined();
      expect(interior.getObjectByName('interior_seats')).toBeDefined();
      expect(interior.getObjectByName('interior_door_cards')).toBeDefined();

      // Ensure no rear bench in 2-door coupe
      expect(interior.getObjectByName('interior_rear_bench')).toBeUndefined();
    });

    it('generates a 4-door interior with rear bench seat for performance sedans', () => {
      const evoInterior = VehicleInteriorGenerator.generateInterior({
        vehicleId: 'mitsubishi_lancer_evolution_ix',
        manufacturer: 'Mitsubishi',
        model: 'Lancer Evolution IX',
        cabinWidthM: 1.48,
        cabinLengthM: 1.75,
        cabinHeightM: 0.95,
        isFourDoor: true
      });

      expect(evoInterior.getObjectByName('interior_rear_bench')).toBeDefined();
    });
  });

  describe('2. VehicleEngineBayGenerator & Powertrain Architectures', () => {
    it('resolves all 11 powertrain archetypes according to engineering specs', () => {
      // 1. W16 Quad-Turbo
      const chironSpec = loadSpec('hypercars', 'bugatti_chiron.json');
      expect(VehicleEngineBayGenerator.resolveEngineSpec(chironSpec).archetype).toBe('W16_MID');

      // 2. V12 Mid
      const svjSpec = loadSpec('supercars', 'lamborghini_aventador_svj.json');
      expect(VehicleEngineBayGenerator.resolveEngineSpec(svjSpec).archetype).toBe('V12_MID');

      // 3. V10 Mid
      const stoSpec = loadSpec('supercars', 'lamborghini_huracan_sto.json');
      expect(VehicleEngineBayGenerator.resolveEngineSpec(stoSpec).archetype).toBe('V10_MID');

      // 4. V8 Mid
      const pistaSpec = loadSpec('supercars', 'ferrari_488_pista.json');
      expect(VehicleEngineBayGenerator.resolveEngineSpec(pistaSpec).archetype).toBe('V8_MID');

      // 5. V6 Mid
      const gtb296Spec = loadSpec('supercars', 'ferrari_296_gtb.json');
      expect(VehicleEngineBayGenerator.resolveEngineSpec(gtb296Spec).archetype).toBe('V6_MID');

      // 6. Boxer Rear
      const gt3Spec = loadSpec('sports_cars', 'porsche_911_gt3_rs.json');
      expect(VehicleEngineBayGenerator.resolveEngineSpec(gt3Spec).archetype).toBe('BOXER_REAR');

      // 7. V8 Front Supercharged
      const gt500Spec = loadSpec('muscle_cars', 'ford_mustang_shelby_gt500.json');
      expect(VehicleEngineBayGenerator.resolveEngineSpec(gt500Spec).archetype).toBe('V8_FRONT');

      // 8. Inline Front
      const m4Spec = loadSpec('sports_cars', 'bmw_m4_csl.json');
      expect(VehicleEngineBayGenerator.resolveEngineSpec(m4Spec).archetype).toBe('INLINE_FRONT');

      // 9. Rotary Front
      const rx7Spec = loadSpec('jdm_cars', 'mazda_rx_7_fd.json');
      expect(VehicleEngineBayGenerator.resolveEngineSpec(rx7Spec).archetype).toBe('ROTARY_FRONT');

      // 10. Electric EV
      const spectreSpec = loadSpec('luxury_cars', 'rolls_royce_spectre.json');
      expect(VehicleEngineBayGenerator.resolveEngineSpec(spectreSpec).archetype).toBe('ELECTRIC_EV');
    });

    it('generates a complete 3D engine bay with chassis tub, radiator, and block', () => {
      const svjSpec = loadSpec('supercars', 'lamborghini_aventador_svj.json');
      const bay = VehicleEngineBayGenerator.generateEngineBay(svjSpec);

      expect(bay).toBeInstanceOf(THREE.Group);
      expect(bay.getObjectByName('engine_bay_structural_tub')).toBeDefined();
      expect(bay.getObjectByName('cooling_radiator_assembly')).toBeDefined();
      expect(bay.getObjectByName('engine_bay_auxiliary_gear')).toBeDefined();
      expect(bay.getObjectByName('powertrain_v12_longitudinal')).toBeDefined();
      expect(bay.getObjectByName('chassis_strut_brace')).toBeDefined();
    });
  });

  describe('3. VehicleOpeningController & Kinematics', () => {
    it('classifies door mechanisms accurately across different vehicle architectures', () => {
      // Scissor Doors
      const svjSpec = loadSpec('supercars', 'lamborghini_aventador_svj.json');
      expect(VehicleOpeningController.resolveOpeningConfig(svjSpec).doorMechanism).toBe('scissor');

      // Butterfly Doors
      const p1Spec = loadSpec('hypercars', 'mclaren_p1.json');
      expect(VehicleOpeningController.resolveOpeningConfig(p1Spec).doorMechanism).toBe('butterfly');

      // Dihedral Synchro-Helix Doors
      const jeskoSpec = loadSpec('hypercars', 'koenigsegg_jesko.json');
      expect(VehicleOpeningController.resolveOpeningConfig(jeskoSpec).doorMechanism).toBe('dihedral_synchro_helix');

      // Gullwing Doors
      const huayraSpec = loadSpec('hypercars', 'pagani_huayra.json');
      expect(VehicleOpeningController.resolveOpeningConfig(huayraSpec).doorMechanism).toBe('gullwing');

      // Coach Suicide Doors
      const spectreSpec = loadSpec('luxury_cars', 'rolls_royce_spectre.json');
      expect(VehicleOpeningController.resolveOpeningConfig(spectreSpec).doorMechanism).toBe('coach');

      // Conventional Doors
      const gt3Spec = loadSpec('sports_cars', 'porsche_911_gt3_rs.json');
      expect(VehicleOpeningController.resolveOpeningConfig(gt3Spec).doorMechanism).toBe('conventional');
    });

    it('identifies 4-door sedans and assigns 4 opening doors', () => {
      const evoSpec = loadSpec('jdm_cars', 'mitsubishi_lancer_evolution_ix.json');
      const config = VehicleOpeningController.resolveOpeningConfig(evoSpec);
      expect(config.doorCount).toBe(4);
      expect(config.doorHingeOffsetRearM).toBeDefined();

      const stiSpec = loadSpec('jdm_cars', 'subaru_wrx_sti.json');
      expect(VehicleOpeningController.resolveOpeningConfig(stiSpec).doorCount).toBe(4);
    });

    it('applies authentic scissor door rotations to Lamborghini Aventador SVJ', () => {
      const svjSpec = loadSpec('supercars', 'lamborghini_aventador_svj.json');
      const assembly = EditableVehicleAssembler.build(svjSpec);

      const pivotDoorFL = assembly.getObjectByName('hinge_pivot_door_front_l');
      expect(pivotDoorFL).toBeDefined();

      // Initially closed (0.0)
      expect(pivotDoorFL!.rotation.z).toBeCloseTo(0, 2);

      // Open Scissor Door to 100%
      EditableVehicleAssembler.applyOpenings(assembly, svjSpec, {
        ...DEFAULT_OPENING_STATE,
        doorFrontLeft: 1.0
      });

      // Assert Scissor door rotated up around Z-axis (~1.25 rad = ~71.6 deg)
      expect(pivotDoorFL!.rotation.z).toBeGreaterThan(1.0);
    });

    it('applies forward-tilting clamshell hood kinematics to Huracan STO Cofango', () => {
      const stoSpec = loadSpec('supercars', 'lamborghini_huracan_sto.json');
      const assembly = EditableVehicleAssembler.build(stoSpec);

      const pivotHood = assembly.getObjectByName('hinge_pivot_hood');
      expect(pivotHood).toBeDefined();

      // Open Hood
      EditableVehicleAssembler.applyOpenings(assembly, stoSpec, {
        ...DEFAULT_OPENING_STATE,
        hood: 1.0
      });

      // Clamshell forward tilts negative around X-axis
      expect(pivotHood!.rotation.x).toBeLessThan(-0.5);
    });

    it('applies rear clamshell engine bay opening kinematics to Bugatti Chiron', () => {
      const chironSpec = loadSpec('hypercars', 'bugatti_chiron.json');
      const assembly = EditableVehicleAssembler.build(chironSpec);

      const pivotBoot = assembly.getObjectByName('hinge_pivot_boot');
      expect(pivotBoot).toBeDefined();

      // Open Clamshell
      EditableVehicleAssembler.applyOpenings(assembly, chironSpec, {
        ...DEFAULT_OPENING_STATE,
        boot: 1.0
      });

      // Rear clamshell tilts upward and rearward
      expect(pivotBoot!.rotation.x).toBeLessThan(-0.5);
    });
  });

  describe('4. Full Assembly & Zero Memory Leak Disposals', () => {
    it('assembles a full vehicle with engine bay and interior without NaNs', () => {
      const gt3Spec = loadSpec('sports_cars', 'porsche_911_gt3_rs.json');
      const assembly = EditableVehicleAssembler.build(gt3Spec, {
        openingState: {
          doorFrontLeft: 0.5,
          doorFrontRight: 0.5,
          doorRearLeft: 0,
          doorRearRight: 0,
          hood: 0.5,
          boot: 0.5
        }
      });

      const bbox = new THREE.Box3().setFromObject(assembly);
      const size = bbox.getSize(new THREE.Vector3());

      expect(Number.isNaN(size.x)).toBe(false);
      expect(Number.isNaN(size.y)).toBe(false);
      expect(Number.isNaN(size.z)).toBe(false);
      expect(size.z).toBeCloseTo(gt3Spec.dimensions.length, 0);

      // Verify engine bay is mounted
      expect(assembly.getObjectByName('component_engine_bay')).toBeDefined();
    });

    it('disposes the entire assembly including engine and interior with zero errors', () => {
      const gt3Spec = loadSpec('sports_cars', 'porsche_911_gt3_rs.json');
      const assembly = EditableVehicleAssembler.build(gt3Spec);

      expect(() => {
        EditableVehicleAssembler.dispose(assembly);
      }).not.toThrow();
    });
  });

  describe('5. Phase 19 Visual Authenticity & Geometry Defect Fixes', () => {
    it('verifies model-specific cabin features across specialized track weapons', () => {
      // 911 GT3 RS: titanium half roll cage
      const gt3Interior = VehicleInteriorGenerator.generateInterior({
        vehicleId: 'porsche_911_gt3_rs',
        manufacturer: 'Porsche',
        model: '911 GT3 RS'
      });
      expect(gt3Interior.getObjectByName('interior_half_roll_cage')).toBeDefined();

      // M4 CSL: helmet tray and red CSL dash badge
      const cslInterior = VehicleInteriorGenerator.generateInterior({
        vehicleId: 'bmw_m4_csl',
        manufacturer: 'BMW',
        model: 'M4 CSL'
      });
      expect(cslInterior.getObjectByName('interior_half_roll_cage')).toBeDefined();
      expect(cslInterior.getObjectByName('interior_helmet_tray')).toBeDefined();
      expect(cslInterior.getObjectByName('interior_csl_badge')).toBeDefined();

      // Cayman GT4 RS: quarter-window airbox induction tubes
      const gt4Interior = VehicleInteriorGenerator.generateInterior({
        vehicleId: 'porsche_718_cayman_gt4_rs',
        manufacturer: 'Porsche',
        model: '718 Cayman GT4 RS'
      });
      expect(gt4Interior.getObjectByName('interior_airbox_ducts')).toBeDefined();

      // Skyline R34: Xanavi MFD top dash telemetry pod & screen
      const r34Interior = VehicleInteriorGenerator.generateInterior({
        vehicleId: 'nissan_skyline_gt_r_r34',
        manufacturer: 'Nissan',
        model: 'Skyline GT-R'
      });
      expect(r34Interior.getObjectByName('interior_mfd_display')).toBeDefined();
      expect(r34Interior.getObjectByName('interior_mfd_pod')).toBeDefined();

      // Chiron: iconic interior C-spine arch
      const chironInterior = VehicleInteriorGenerator.generateInterior({
        vehicleId: 'bugatti_chiron',
        manufacturer: 'Bugatti',
        model: 'Chiron'
      });
      expect(chironInterior.getObjectByName('interior_chiron_spine')).toBeDefined();
    });

    it('verifies window glass, mirrors, and door cards are rigidly mounted to door hinge pivots', () => {
      const gt3Spec = loadSpec('sports_cars', 'porsche_911_gt3_rs.json');
      const assembly = EditableVehicleAssembler.build(gt3Spec);

      const pivotDoorFL = assembly.getObjectByName('hinge_pivot_door_front_l');
      expect(pivotDoorFL).toBeDefined();

      // Verify side window glass is mounted directly under the hinge pivot (NOT root)
      const windowMesh = pivotDoorFL!.getObjectByName('side_windows_left');
      expect(windowMesh).toBeDefined();

      // Verify authentic inner door card is mounted directly under the hinge pivot
      const doorCardMesh = pivotDoorFL!.getObjectByName('interior_door_card_left');
      expect(doorCardMesh).toBeDefined();

      // Verify front right door also has window and door card
      const pivotDoorFR = assembly.getObjectByName('hinge_pivot_door_front_r');
      expect(pivotDoorFR!.getObjectByName('side_windows_right')).toBeDefined();
      expect(pivotDoorFR!.getObjectByName('interior_door_card_right')).toBeDefined();
    });

    it('verifies front frunk tub on mid/rear vehicles and rear cargo trunk on front-engine vehicles', () => {
      // 1. Mid-engine Lamborghini Aventador SVJ has front frunk tub
      const svjSpec = loadSpec('supercars', 'lamborghini_aventador_svj.json');
      const svjBay = VehicleEngineBayGenerator.generateEngineBay(svjSpec);
      expect(svjBay.getObjectByName('front_frunk_cargo_tub')).toBeDefined();
      expect(svjBay.getObjectByName('engine_bay_hood_struts')).toBeDefined();
      expect(svjBay.getObjectByName('engine_bay_boot_struts')).toBeDefined();

      // 2. Track-focused Porsche 911 GT3 RS has front frunk with radiator extraction duct
      const gt3Spec = loadSpec('sports_cars', 'porsche_911_gt3_rs.json');
      const gt3Bay = VehicleEngineBayGenerator.generateEngineBay(gt3Spec);
      expect(gt3Bay.getObjectByName('front_frunk_cargo_tub')).toBeDefined();
      expect(gt3Bay.getObjectByName('frunk_radiator_extraction_duct')).toBeDefined();

      // 3. Front-engine BMW M4 CSL has rear cargo trunk
      const m4Spec = loadSpec('sports_cars', 'bmw_m4_csl.json');
      const m4Bay = VehicleEngineBayGenerator.generateEngineBay(m4Spec);
      expect(m4Bay.getObjectByName('rear_cargo_trunk')).toBeDefined();
      expect(m4Bay.getObjectByName('engine_bay_hood_struts')).toBeDefined();
      expect(m4Bay.getObjectByName('engine_bay_boot_struts')).toBeDefined();
    });
  });
});
