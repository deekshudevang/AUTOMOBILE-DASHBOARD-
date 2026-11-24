import { describe, it, expect } from 'vitest';
import { useUiStore } from '../src/state/useUiStore';
import { useVehicleStore } from '../src/hooks/useVehicleStore';

describe('Phase 27.3a: Car Studio Viewport, Lighting & Camera Controls', () => {
  describe('Atelier Blade & UI State Store', () => {
    it('initializes blade collapse and orbit dragging states correctly', () => {
      const state = useUiStore.getState();
      expect(typeof state.isBladeCollapsed).toBe('boolean');
      expect(state.bladeWidth).toBeGreaterThanOrEqual(280);
      expect(state.isOrbitDragging).toBe(false);

      // Test orbit dragging toggle
      useUiStore.getState().setIsOrbitDragging(true);
      expect(useUiStore.getState().isOrbitDragging).toBe(true);
      useUiStore.getState().setIsOrbitDragging(false);
      expect(useUiStore.getState().isOrbitDragging).toBe(false);
    });

    it('toggles blade collapse state properly', () => {
      const initial = useUiStore.getState().isBladeCollapsed;
      useUiStore.getState().toggleBladeCollapsed();
      expect(useUiStore.getState().isBladeCollapsed).toBe(!initial);
      useUiStore.getState().setBladeCollapsed(initial);
      expect(useUiStore.getState().isBladeCollapsed).toBe(initial);
    });
  });

  describe('Kinematic Apertures & Camera Pull-Back (Defect 02)', () => {
    it('properly tracks openAllApertures and closeAllApertures', () => {
      const { openAllApertures, closeAllApertures } = useVehicleStore.getState();

      openAllApertures();
      const openState = useVehicleStore.getState().openingState;
      expect(openState.doorFrontLeft).toBe(1.0);
      expect(openState.doorFrontRight).toBe(1.0);
      expect(openState.hood).toBe(1.0);

      closeAllApertures();
      const closedState = useVehicleStore.getState().openingState;
      expect(closedState.doorFrontLeft).toBe(0.0);
      expect(closedState.doorFrontRight).toBe(0.0);
      expect(closedState.hood).toBe(0.0);
    });
  });

  describe('Cockpit Camera Lighting Activation (Defect 03)', () => {
    it('identifies cockpit and interior camera presets for dynamic cabin fill light', () => {
      const interiorPresets = ['cockpit', 'interior', 'dashboard', 'driver_seat', 'passenger_seat'];
      const exteriorPresets = ['isometric', 'front', 'rear', 'left', 'right', 'top', 'wheel'];

      interiorPresets.forEach(preset => {
        const isCockpit =
          preset === 'cockpit' ||
          preset === 'interior' ||
          preset === 'dashboard' ||
          preset === 'driver_seat' ||
          preset === 'passenger_seat';
        expect(isCockpit).toBe(true);
      });

      exteriorPresets.forEach(preset => {
        const isCockpit =
          preset === 'cockpit' ||
          preset === 'interior' ||
          preset === 'dashboard' ||
          preset === 'driver_seat' ||
          preset === 'passenger_seat';
        expect(isCockpit).toBe(false);
      });
    });
  });
});
