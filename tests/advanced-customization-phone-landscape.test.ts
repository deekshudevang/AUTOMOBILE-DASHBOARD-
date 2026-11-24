import { describe, it, expect, beforeEach } from 'vitest';
import { useUiStore } from '../src/state/useUiStore';
import { useVehicleStore } from '../src/hooks/useVehicleStore';
import fs from 'fs';
import path from 'path';

describe('Advanced Customization & Phone Landscape Studio Engine', () => {
  beforeEach(() => {
    useVehicleStore.getState().resetAllComponentOverrides();
  });

  describe('1. Multi-Zone Paint & Clearcoat Physics Customization', () => {
    it('applies custom primary and secondary colors', () => {
      const rossoCorsa = { r: 212, g: 0, b: 0 };
      const satinBlack = { r: 17, g: 18, b: 21 };

      useVehicleStore.getState().setCustomPrimaryColor(rossoCorsa);
      useVehicleStore.getState().setCustomSecondaryColor(satinBlack);

      const cfg = useVehicleStore.getState().activeConfig;
      expect(cfg.isPrimaryColorCustom).toBe(true);
      expect(cfg.customPrimaryColor).toEqual(rossoCorsa);
      expect(cfg.customSecondaryColor).toEqual(satinBlack);
    });

    it('synchronizes brake caliper color presets across all 4 wheel corners', () => {
      const acidGreen = '#84CC16';
      const corners = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'];

      corners.forEach(c => {
        useVehicleStore.getState().updateComponentOverride(c, {
          caliperColorHex: acidGreen,
          contextSettings: { caliperColor: acidGreen }
        }, false);
      });
      useVehicleStore.getState().updateComponentOverride('wheel_fl', {
        caliperColorHex: acidGreen
      }, true);

      const overrides = useVehicleStore.getState().componentOverrides;
      expect(overrides['wheel_fl']?.caliperColorHex).toBe(acidGreen);
      expect(overrides['wheel_fr']?.caliperColorHex).toBe(acidGreen);
      expect(overrides['wheel_rl']?.caliperColorHex).toBe(acidGreen);
      expect(overrides['wheel_rr']?.caliperColorHex).toBe(acidGreen);
    });

    it('persists clearcoat roughness and metallic flake density on body shell', () => {
      useVehicleStore.getState().updateComponentOverride('body_shell', {
        clearcoatRoughness: 0.25,
        metallicFlakeDensity: 65,
        clearcoatStrength: 95
      }, true);

      const bodyOverride = useVehicleStore.getState().componentOverrides['body_shell'];
      expect(bodyOverride?.clearcoatRoughness).toBe(0.25);
      expect(bodyOverride?.metallicFlakeDensity).toBe(65);
      expect(bodyOverride?.clearcoatStrength).toBe(95);
    });

    it('applies roof and mirror color masking override', () => {
      const carbonHex = '#1A1A1A';
      useVehicleStore.getState().updateComponentOverride('roof', { customColorHex: carbonHex }, false);
      useVehicleStore.getState().updateComponentOverride('mirror_left', { customColorHex: carbonHex }, false);
      useVehicleStore.getState().updateComponentOverride('mirror_right', { customColorHex: carbonHex }, true);

      const overrides = useVehicleStore.getState().componentOverrides;
      expect(overrides['roof']?.customColorHex).toBe(carbonHex);
      expect(overrides['mirror_left']?.customColorHex).toBe(carbonHex);
      expect(overrides['mirror_right']?.customColorHex).toBe(carbonHex);
    });
  });

  describe('2. Wheel Fitment, Camber & Tire Compound Calibration', () => {
    it('sets wheel diameter and track spacer offset', () => {
      const diameter = 21;
      const spacer = 18;

      useVehicleStore.getState().updateComponentOverride('wheel_fl', {
        wheelDiameterInches: diameter,
        wheelSpacerMm: spacer
      }, true);

      const fl = useVehicleStore.getState().componentOverrides['wheel_fl'];
      expect(fl?.wheelDiameterInches).toBe(21);
      expect(fl?.wheelSpacerMm).toBe(18);
    });

    it('calibrates independent front and rear negative camber', () => {
      const frontCamber = -3.2;
      const rearCamber = -2.5;

      const frontCorners = ['wheel_fl', 'wheel_fr'];
      const rearCorners = ['wheel_rl', 'wheel_rr'];

      frontCorners.forEach(c => {
        useVehicleStore.getState().updateComponentOverride(c, {
          wheelFrontCamberDeg: frontCamber,
          wheelCamberDeg: frontCamber
        }, false);
      });

      rearCorners.forEach(c => {
        useVehicleStore.getState().updateComponentOverride(c, {
          wheelRearCamberDeg: rearCamber,
          wheelCamberDeg: rearCamber
        }, false);
      });

      const overrides = useVehicleStore.getState().componentOverrides;
      expect(overrides['wheel_fl']?.wheelFrontCamberDeg).toBe(-3.2);
      expect(overrides['wheel_fr']?.wheelFrontCamberDeg).toBe(-3.2);
      expect(overrides['wheel_rl']?.wheelRearCamberDeg).toBe(-2.5);
      expect(overrides['wheel_rr']?.wheelRearCamberDeg).toBe(-2.5);
    });

    it('selects motorsport tire compounds', () => {
      const compound = 'trofeo';
      const corners = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'];

      corners.forEach(c => {
        useVehicleStore.getState().updateComponentOverride(c, {
          tireCompound: compound
        }, false);
      });

      const overrides = useVehicleStore.getState().componentOverrides;
      expect(overrides['wheel_fl']?.tireCompound).toBe('trofeo');
      expect(overrides['wheel_rr']?.tireCompound).toBe('trofeo');
    });
  });

  describe('3. Aerodynamic Surface & DRS Calibration', () => {
    it('sets active rear wing angle of attack and splitter extension', () => {
      useVehicleStore.getState().updateComponentOverride('wing_rear', {
        wingAngleDeg: 18
      }, true);

      useVehicleStore.getState().updateComponentOverride('splitter_front', {
        splitterExtensionMm: 35,
        divePlanesEnabled: true
      }, true);

      const wing = useVehicleStore.getState().componentOverrides['wing_rear'];
      const splitter = useVehicleStore.getState().componentOverrides['splitter_front'];

      expect(wing?.wingAngleDeg).toBe(18);
      expect(splitter?.splitterExtensionMm).toBe(35);
      expect(splitter?.divePlanesEnabled).toBe(true);
    });
  });

  describe('4. Exhaust & Optical Customization', () => {
    it('toggles active exhaust valves between Track (open) and Street (quiet)', () => {
      useVehicleStore.getState().updateComponentOverride('exhaust_tips', {
        exhaustTipStyle: 'burnt_titanium',
        exhaustValvesOpen: true
      }, true);

      let exhaust = useVehicleStore.getState().componentOverrides['exhaust_tips'];
      expect(exhaust?.exhaustTipStyle).toBe('burnt_titanium');
      expect(exhaust?.exhaustValvesOpen).toBe(true);

      useVehicleStore.getState().updateComponentOverride('exhaust_tips', {
        exhaustValvesOpen: false
      }, true);

      exhaust = useVehicleStore.getState().componentOverrides['exhaust_tips'];
      expect(exhaust?.exhaustValvesOpen).toBe(false);
    });

    it('sets DRL headlight optical color temperature', () => {
      useVehicleStore.getState().updateComponentOverride('headlights', {
        drlColorTemp: 'yellow'
      }, true);

      const lights = useVehicleStore.getState().componentOverrides['headlights'];
      expect(lights?.drlColorTemp).toBe('yellow');
    });
  });

  describe('5. Cockpit Upholstery & Trim Customization', () => {
    it('configures interior upholstery, trim material, and contrast stitching', () => {
      useVehicleStore.getState().updateComponentOverride('cockpit_interior', {
        upholsteryTheme: 'carbon_bucket',
        interiorTrim: 'gloss_carbon',
        stitchingColorHex: '#DC2626'
      }, true);

      const cockpit = useVehicleStore.getState().componentOverrides['cockpit_interior'];
      expect(cockpit?.upholsteryTheme).toBe('carbon_bucket');
      expect(cockpit?.interiorTrim).toBe('gloss_carbon');
      expect(cockpit?.stitchingColorHex).toBe('#DC2626');
    });
  });

  describe('6. Atelier Blade Tabs & Phone Landscape Adaptivity', () => {
    it('supports all 6 dedicated studio customization tabs', () => {
      const expectedTabs = ['paint', 'wheels', 'aero', 'exhaust', 'cockpit', 'access'];

      expectedTabs.forEach(tab => {
        useUiStore.getState().setActiveStudioTab(tab);
        expect(useUiStore.getState().activeStudioTab).toBe(tab);
      });
    });

    it('verifies phone-landscape media query rules are present in stylesheet and Tailwind config', () => {
      const cssPath = path.resolve(__dirname, '../src/index.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');

      expect(cssContent).toContain('@media (max-height: 500px) and (orientation: landscape)');
      expect(cssContent).toContain('.desktop-blade-container');
      expect(cssContent).toContain('.mobile-sheet-container');
      expect(cssContent).toContain('.phone-landscape-header');

      const tailwindPath = path.resolve(__dirname, '../tailwind.config.js');
      const tailwindContent = fs.readFileSync(tailwindPath, 'utf-8');
      expect(tailwindContent).toContain("'phone-landscape': { 'raw': '(max-height: 500px) and (orientation: landscape)' }");
    });
  });
});
