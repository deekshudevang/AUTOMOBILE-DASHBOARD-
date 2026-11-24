import { describe, it, expect } from 'vitest';
import { useUiStore } from '../src/state/useUiStore';
import { useVehicleStore } from '../src/hooks/useVehicleStore';

describe('Phase 27.3b: Car Studio Blade Content, Speedforms & Wheel Fitment', () => {
  describe('Paint Studio & Speedforms (Defect 08)', () => {
    it('applies custom primary paint colors to the vehicle store', () => {
      const rossoCorsa = { r: 212, g: 0, b: 0 };
      useVehicleStore.getState().setCustomPrimaryColor(rossoCorsa);

      const cfg = useVehicleStore.getState().activeConfig;
      expect(cfg.isPrimaryColorCustom).toBe(true);
      expect(cfg.customPrimaryColor).toEqual(rossoCorsa);
    });

    it('applies custom secondary accent colors', () => {
      const carbonBlack = { r: 26, g: 26, b: 26 };
      useVehicleStore.getState().setCustomSecondaryColor(carbonBlack);

      const cfg = useVehicleStore.getState().activeConfig;
      expect(cfg.customSecondaryColor).toEqual(carbonBlack);
    });
  });

  describe('Wheel Fitment & Stance Calibration (Defect 16)', () => {
    it('updates wheel diameter across all 4 corners simultaneously', () => {
      const testDiameter = 21;
      const corners = [
        'wheel_front_left',
        'wheel_front_right',
        'wheel_rear_left',
        'wheel_rear_right',
        'wheel_fl',
        'wheel_fr',
        'wheel_rl',
        'wheel_rr'
      ];

      corners.forEach(c => {
        useVehicleStore.getState().updateComponentOverride(c, { wheelDiameterInches: testDiameter }, false);
      });

      const overrides = useVehicleStore.getState().componentOverrides;
      expect(overrides['wheel_fl']?.wheelDiameterInches).toBe(testDiameter);
      expect(overrides['wheel_fr']?.wheelDiameterInches).toBe(testDiameter);
    });

    it('updates wheel spacer offset poke across all corners', () => {
      const testSpacerMm = 15;
      const corners = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'];

      corners.forEach(c => {
        useVehicleStore.getState().updateComponentOverride(c, { wheelSpacerMm: testSpacerMm }, false);
      });

      const overrides = useVehicleStore.getState().componentOverrides;
      expect(overrides['wheel_fl']?.wheelSpacerMm).toBe(testSpacerMm);
      expect(overrides['wheel_rr']?.wheelSpacerMm).toBe(testSpacerMm);
    });
  });

  describe('Atelier Studio Tabs & Accordion Switching', () => {
    it('switches between all 5 studio customization tabs', () => {
      const tabs = ['paint', 'wheels', 'access', 'aero', 'cockpit'];

      tabs.forEach(tab => {
        useUiStore.getState().setActiveStudioTab(tab);
        expect(useUiStore.getState().activeStudioTab).toBe(tab);
      });
    });
  });
});
