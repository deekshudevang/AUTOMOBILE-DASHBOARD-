import { describe, it, expect, beforeEach } from 'vitest';
import { useVehicleStore } from '../src/hooks/useVehicleStore';
import libraryIndex from '../public/vehicles/index.json';
import { parametricFiles, parametricModels, parametricBindings } from '../src/data/parametricCatalog';
import { DEFAULT_OPENING_STATE, VehicleOpeningController, VehicleEngineBayGenerator } from '@autoverse/vehicle-generation-engine';
import { VehicleSchema2 } from '@autoverse/shared-types';
import fs from 'fs';
import path from 'path';

describe('AutoVerse Critical Car Visibility & One-Click Open Everything Test Suite', () => {
  beforeEach(() => {
    // Reset store to default
    const store = useVehicleStore.getState();
    store.closeAllApertures();
    store.resetAllComponentOverrides();
  });

  describe('1. Fleet Completeness & 50-Vehicle Catalog Inventory', () => {
    it('has exactly 50 production-grade Schema 2.0 vehicle specifications in libraryIndex', () => {
      expect(libraryIndex.assets).toBeDefined();
      expect(libraryIndex.assets.length).toBe(50);
    });

    it('each of the 50 assets has complete dimensional metadata and a corresponding JSON file', () => {
      for (const asset of libraryIndex.assets) {
        expect(asset.asset_id).toBeTruthy();
        expect(asset.manufacturer).toBeTruthy();
        expect(asset.model).toBeTruthy();
        expect(asset.file).toBeTruthy();
        expect(asset.dimensions).toBeDefined();
        expect(asset.dimensions.length).toBeGreaterThan(3.0);
        expect(asset.dimensions.width).toBeGreaterThan(1.5);
        expect(asset.dimensions.height).toBeGreaterThan(0.9);
        expect(asset.dimensions.wheelbase).toBeGreaterThan(2.0);

        // Verify JSON file exists on disk
        const filePath = path.join(process.cwd(), 'public', 'vehicles', asset.file);
        expect(fs.existsSync(filePath), `Vehicle file must exist: ${asset.file}`).toBe(true);

        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        expect(content.schemaVersion).toBe('2.0');
        expect(content.vehicle).toBeDefined();
        expect(content.components).toBeDefined();
        expect(content.components.length).toBeGreaterThanOrEqual(15);
      }
    });

    it('parametricCatalog binds all 50 models into initial store inventory', () => {
      const store = useVehicleStore.getState();
      expect(store.allModels.length).toBeGreaterThanOrEqual(50);
      expect(store.allFiles.length).toBeGreaterThanOrEqual(50);

      // Verify bindings exist for each asset
      for (const asset of libraryIndex.assets) {
        const found = store.allFiles.some(f => f.fileName === asset.file);
        expect(found, `Asset file ${asset.file} should be in allFiles`).toBe(true);
      }
    });
  });

  describe('2. Vehicle Switching & State Cleanup Diagnostics', () => {
    it('switches to a 2-door supercar and resets all aperture and override states', async () => {
      const store = useVehicleStore.getState();
      
      // Simulate dirty state: open doors and apply component override
      store.setOpeningState({ doorFrontLeft: 0.8, hood: 0.5 });
      store.updateComponentOverride('body_shell', { customColorHex: '#FF0055' });
      store.selectComponent('body_shell');

      expect(useVehicleStore.getState().openingState.doorFrontLeft).toBe(0.8);
      expect(useVehicleStore.getState().selectedComponentId).toBe('body_shell');
      expect(Object.keys(useVehicleStore.getState().componentOverrides).length).toBeGreaterThan(0);

      // Load Ferrari 488 Pista
      const loaded = await store.loadVehicleByFile('supercars/ferrari_488_pista.json');
      expect(loaded).toBe(true);

      const stateAfter = useVehicleStore.getState();
      expect(stateAfter.activeFile).toBe('supercars/ferrari_488_pista.json');
      expect(stateAfter.activeModel?.manufacturer).toBe('Ferrari');
      expect(stateAfter.activeModel?.displayName).toContain('488 Pista');

      // VERIFY COMPLETE STATE RESET
      expect(stateAfter.openingState).toEqual(DEFAULT_OPENING_STATE);
      expect(stateAfter.selectedComponentId).toBeNull();
      expect(Object.keys(stateAfter.componentOverrides).length).toBe(0);
      expect(stateAfter.cameraPreset).toBe('isometric');
    });

    it('resolves flexible vehicle file references by basename or full path', async () => {
      const store = useVehicleStore.getState();

      // Full path
      expect(await store.loadVehicleByFile('supercars/lamborghini_aventador_svj.json')).toBe(true);
      expect(useVehicleStore.getState().activeModel?.manufacturer).toBe('Lamborghini');

      // Basename with .json
      expect(await store.loadVehicleByFile('nissan_skyline_gt_r_r34.json')).toBe(true);
      expect(useVehicleStore.getState().activeModel?.manufacturer).toBe('Nissan');

      // Basename without .json
      expect(await store.loadVehicleByFile('bmw_m4_csl')).toBe(true);
      expect(useVehicleStore.getState().activeModel?.manufacturer).toBe('BMW');
    });
  });

  describe('3. One-Click Open Everything & Close Everything Kinematics', () => {
    it('opens all apertures on a 2-door vehicle without activating non-existent rear doors', async () => {
      const store = useVehicleStore.getState();
      await store.loadVehicleByFile('supercars/lamborghini_aventador_svj.json');

      store.openAllApertures();
      const state = useVehicleStore.getState();

      expect(state.openingState.doorFrontLeft).toBe(1.0);
      expect(state.openingState.doorFrontRight).toBe(1.0);
      expect(state.openingState.hood).toBe(1.0);
      expect(state.openingState.boot).toBe(1.0);
      // 2-Door vehicle: rear doors MUST remain closed (0.0)
      expect(state.openingState.doorRearLeft).toBe(0.0);
      expect(state.openingState.doorRearRight).toBe(0.0);

      // Camera preset auto-switches to full_inspection view
      expect(state.cameraPreset).toBe('full_inspection');
    });

    it('opens all 4 doors plus hood and boot on 4-door performance sedans (Evo IX)', async () => {
      const store = useVehicleStore.getState();
      await store.loadVehicleByFile('jdm_cars/mitsubishi_lancer_evolution_ix.json');

      store.openAllApertures();
      const state = useVehicleStore.getState();

      expect(state.openingState.doorFrontLeft).toBe(1.0);
      expect(state.openingState.doorFrontRight).toBe(1.0);
      // 4-Door vehicle: rear doors MUST open
      expect(state.openingState.doorRearLeft).toBe(1.0);
      expect(state.openingState.doorRearRight).toBe(1.0);
      expect(state.openingState.hood).toBe(1.0);
      expect(state.openingState.boot).toBe(1.0);

      expect(state.cameraPreset).toBe('full_inspection');
    });

    it('closes all apertures and returns camera to isometric preset', async () => {
      const store = useVehicleStore.getState();
      store.openAllApertures();
      expect(useVehicleStore.getState().cameraPreset).toBe('full_inspection');

      store.closeAllApertures();
      const state = useVehicleStore.getState();

      expect(state.openingState).toEqual(DEFAULT_OPENING_STATE);
      expect(state.cameraPreset).toBe('isometric');
    });
  });

  describe('4. Kinematic Mechanisms & Powertrain Resolution for Key Archetypes', () => {
    it('accurately resolves Scissor doors for Lamborghini Aventador SVJ', () => {
      const filePath = path.join(process.cwd(), 'public', 'vehicles', 'supercars', 'lamborghini_aventador_svj.json');
      const spec = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as VehicleSchema2;

      const openingConfig = VehicleOpeningController.resolveOpeningConfig(spec);
      expect(openingConfig.doorMechanism).toBe('scissor');
      expect(openingConfig.doorCount).toBe(2);

      const engineSpec = VehicleEngineBayGenerator.resolveEngineSpec(spec);
      expect(engineSpec.isMidRear).toBe(true);
      expect(engineSpec.cylinderCount).toBe(12);
      expect(engineSpec.archetype).toBe('V12_MID');
    });

    it('accurately resolves Forward-Tilting Clamshell Hood (Cofango) for Lamborghini Huracan STO', () => {
      const filePath = path.join(process.cwd(), 'public', 'vehicles', 'supercars', 'lamborghini_huracan_sto.json');
      const spec = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as VehicleSchema2;

      const openingConfig = VehicleOpeningController.resolveOpeningConfig(spec);
      expect(openingConfig.hoodMechanism).toBe('clamshell_forward');
      expect(openingConfig.doorMechanism).toBe('conventional');

      const engineSpec = VehicleEngineBayGenerator.resolveEngineSpec(spec);
      expect(engineSpec.isMidRear).toBe(true);
      expect(engineSpec.cylinderCount).toBe(10);
      expect(engineSpec.archetype).toBe('V10_MID');
    });

    it('accurately resolves Dihedral Synchro-Helix doors for Koenigsegg Jesko', () => {
      const filePath = path.join(process.cwd(), 'public', 'vehicles', 'hypercars', 'koenigsegg_jesko.json');
      const spec = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as VehicleSchema2;

      const openingConfig = VehicleOpeningController.resolveOpeningConfig(spec);
      expect(openingConfig.doorMechanism).toBe('dihedral_synchro_helix');

      const engineSpec = VehicleEngineBayGenerator.resolveEngineSpec(spec);
      expect(engineSpec.isMidRear).toBe(true);
      expect(engineSpec.isForcedInduction).toBe(true);
      expect(engineSpec.inductionType).toBe('twin_turbo');
    });

    it('accurately resolves Twin-Turbo V8 Mid-Engine for Ferrari 488 Pista', () => {
      const filePath = path.join(process.cwd(), 'public', 'vehicles', 'supercars', 'ferrari_488_pista.json');
      const spec = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as VehicleSchema2;

      const openingConfig = VehicleOpeningController.resolveOpeningConfig(spec);
      expect(openingConfig.doorMechanism).toBe('conventional');

      const engineSpec = VehicleEngineBayGenerator.resolveEngineSpec(spec);
      expect(engineSpec.isMidRear).toBe(true);
      expect(engineSpec.cylinderCount).toBe(8);
      expect(engineSpec.inductionType).toBe('twin_turbo');
    });

    it('accurately resolves Coach suicide doors for Rolls-Royce Spectre', () => {
      const filePath = path.join(process.cwd(), 'public', 'vehicles', 'luxury_cars', 'rolls_royce_spectre.json');
      const spec = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as VehicleSchema2;

      const openingConfig = VehicleOpeningController.resolveOpeningConfig(spec);
      expect(openingConfig.doorMechanism).toBe('coach');
    });
  });
});
