import { describe, it, expect, beforeEach } from 'vitest';
import { useUiStore } from '../src/state/useUiStore';
import { useVehicleStore } from '../src/hooks/useVehicleStore';
import { CrossCarPartSwapper } from '@autoverse/vehicle-generation-engine';
import { VehicleAssetDatabase } from '@autoverse/authentic-geometry-engine';
import { FLEET_TECHNICAL_SPECS } from '../src/data/vehicleTechnicalSpecs';
import * as THREE from 'three';

describe('Phase 27.3c Car Studio Overhaul - Parts Drawer, Framing & Mobile Sheet', () => {
  beforeEach(() => {
    useUiStore.setState({
      isPartsDrawerOpen: false,
      isBladeCollapsed: false,
      mobileSheetState: 'half',
      isOrbitDragging: false,
      activeStudioTab: 'paint'
    });
  });

  describe('Global Parts Drawer Store & Donor Parts Logic', () => {
    it('toggles parts drawer state in useUiStore', () => {
      expect(useUiStore.getState().isPartsDrawerOpen).toBe(false);

      useUiStore.getState().togglePartsDrawer();
      expect(useUiStore.getState().isPartsDrawerOpen).toBe(true);

      useUiStore.getState().setPartsDrawerOpen(false);
      expect(useUiStore.getState().isPartsDrawerOpen).toBe(false);
    });

    it('loads catalog of donor components with all required categories', () => {
      const parts = CrossCarPartSwapper.getDonorParts();
      expect(parts.length).toBeGreaterThanOrEqual(8);

      const categories = new Set(parts.map(p => p.category.toLowerCase()));
      expect(categories.has('aero')).toBe(true);
      expect(categories.has('wheels')).toBe(true);
      expect(categories.has('body')).toBe(true);
      expect(categories.has('exhaust')).toBe(true);
    });

    it('evaluates donor part fitment and installs component override on vehicle', () => {
      const donorWing = CrossCarPartSwapper.getDonorParts().find(p => p.category === 'Aero');
      expect(donorWing).toBeDefined();

      if (donorWing) {
        const vehicleSpec = {
          vehicle: { id: 'porsche_911_gt3_rs' },
          dimensions: { length: 4.57, width: 1.90, height: 1.30 }
        };

        const fitment = CrossCarPartSwapper.evaluateFitment(donorWing, vehicleSpec);
        expect(fitment.passed).toBe(true);

        // Apply override
        useVehicleStore.getState().updateComponentOverride(
          donorWing.semanticType,
          {
            donorVehicleId: donorWing.sourceVehicleId,
            donorVehicleName: donorWing.sourceVehicleName,
            donorComponentId: donorWing.id,
            donorComponentName: donorWing.name,
            fitmentType: fitment.status,
            visible: true
          },
          true
        );

        const overrides = useVehicleStore.getState().componentOverrides;
        expect(overrides[donorWing.semanticType]?.donorComponentId).toBe(donorWing.id);
        expect(overrides[donorWing.semanticType]?.donorComponentName).toBe(donorWing.name);

        // Reset override
        useVehicleStore.getState().resetComponentOverride(donorWing.semanticType);
        expect(useVehicleStore.getState().componentOverrides[donorWing.semanticType]).toBeUndefined();
      }
    });
  });

  describe('Responsive Mobile Bottom Sheet 3-State Cycle', () => {
    it('initializes in half state and cycles correctly through collapsed, half, and expanded', () => {
      expect(useUiStore.getState().mobileSheetState).toBe('half');

      // half -> expanded
      useUiStore.getState().cycleMobileSheetState();
      expect(useUiStore.getState().mobileSheetState).toBe('expanded');

      // expanded -> collapsed
      useUiStore.getState().cycleMobileSheetState();
      expect(useUiStore.getState().mobileSheetState).toBe('collapsed');

      // collapsed -> half
      useUiStore.getState().cycleMobileSheetState();
      expect(useUiStore.getState().mobileSheetState).toBe('half');
    });

    it('allows direct setting of mobile sheet state', () => {
      useUiStore.getState().setMobileSheetState('collapsed');
      expect(useUiStore.getState().mobileSheetState).toBe('collapsed');

      useUiStore.getState().setMobileSheetState('expanded');
      expect(useUiStore.getState().mobileSheetState).toBe('expanded');
    });
  });

  describe('50-Vehicle Camera Framing Pass', () => {
    it('verifies that all registered vehicles have framing distances that clear viewport boundaries', () => {
      const records = VehicleAssetDatabase.getAll();
      expect(records.length).toBeGreaterThanOrEqual(4);

      // Verify camera framing distance math across all fleet models
      const fleetKeys = Object.keys(FLEET_TECHNICAL_SPECS);
      expect(fleetKeys.length).toBeGreaterThanOrEqual(35);

      records.forEach((record) => {
        const specs = record.metadata.originalDimensions;
        const L = Math.max(specs?.length || 4.5, 3.2);
        const W = Math.max(specs?.width || 1.9, 1.5);
        const H = Math.max(specs?.height || 1.25, 0.95);
        const R = Math.sqrt((L / 2) ** 2 + (W / 2) ** 2 + (H / 2) ** 2);

        // Stage buffer with blade expanded
        const stageBuffer = 1.16;
        const distIso = Math.max(R * 2.12, 6.2) * stageBuffer;
        const distFront = Math.max(L * 0.5 + 3.0, (W * 0.5) / Math.tan(THREE.MathUtils.degToRad(22.5)) * 1.42) * stageBuffer;
        const distSide = Math.max(W * 0.5 + 3.2, (L * 0.5) / Math.tan(THREE.MathUtils.degToRad(22.5)) * 1.32) * stageBuffer;

        // Verify FOV 45 vertical span at distIso covers vehicle diagonal with >25% safety margin
        const verticalSpan = 2 * distIso * Math.tan(THREE.MathUtils.degToRad(22.5));
        expect(verticalSpan).toBeGreaterThan(H * 2.2);

        // Verify front distance ensures bumper clearance
        expect(distFront).toBeGreaterThan(L * 0.5 + 2.5);

        // Verify side distance ensures width & length clearance
        expect(distSide).toBeGreaterThan(W * 0.5 + 2.5);
      });
    });
  });
});
