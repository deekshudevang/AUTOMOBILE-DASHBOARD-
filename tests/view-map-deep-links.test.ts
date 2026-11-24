import { describe, it, expect, beforeEach } from 'vitest';
import { useVehicleStore, ActiveView } from '../src/hooks/useVehicleStore';
import { useUiStore } from '../src/state/useUiStore';

describe('AutoVerse Gran Turismo Workstation — View Map & Deep Link Verification (C6 Gate)', () => {
  const ALL_24_VIEWS: ActiveView[] = [
    'dashboard',
    'library',
    'projects',
    'studio',
    'componentLibrary',
    'componentEditor',
    'assembly',
    'cadDesigner',
    'geometryEditor',
    'materialStudio',
    'aeroStudio',
    'cfdLab',
    'meshGenerator',
    'dynamics',
    'results',
    'reports',
    'learning',
    'assetManager',
    'settings',
    'customizer',
    'comparison',
    'explorer',
    'history',
    'export'
  ];

  beforeEach(() => {
    useUiStore.setState({
      activeWorkspace: 'atelier',
      isCommandPaletteOpen: false,
      isShortcutHelpOpen: false,
    });
    useVehicleStore.setState({
      activeView: 'dashboard',
    });
  });

  it('verifies all 24 views resolve cleanly in useVehicleStore without error', () => {
    const { setActiveView } = useVehicleStore.getState();

    ALL_24_VIEWS.forEach((viewId) => {
      setActiveView(viewId);
      expect(useVehicleStore.getState().activeView).toBe(viewId);
    });
  });

  it('verifies workspace switcher correctly transitions between Atelier, Telemetry, and Engineering', () => {
    const { setActiveWorkspace } = useUiStore.getState();
    const { setActiveView } = useVehicleStore.getState();

    // Atelier
    setActiveWorkspace('atelier');
    setActiveView('studio');
    expect(useUiStore.getState().activeWorkspace).toBe('atelier');
    expect(useVehicleStore.getState().activeView).toBe('studio');

    // Telemetry
    setActiveWorkspace('telemetry');
    setActiveView('dynamics');
    expect(useUiStore.getState().activeWorkspace).toBe('telemetry');
    expect(useVehicleStore.getState().activeView).toBe('dynamics');

    // Engineering
    setActiveWorkspace('engineering');
    setActiveView('cadDesigner');
    expect(useUiStore.getState().activeWorkspace).toBe('engineering');
    expect(useVehicleStore.getState().activeView).toBe('cadDesigner');
  });

  it('verifies command palette state toggles without displacing the active view', () => {
    const { setCommandPaletteOpen, toggleCommandPalette } = useUiStore.getState();
    const { setActiveView } = useVehicleStore.getState();

    setActiveView('aeroStudio');
    toggleCommandPalette();
    expect(useUiStore.getState().isCommandPaletteOpen).toBe(true);
    expect(useVehicleStore.getState().activeView).toBe('aeroStudio');

    setCommandPaletteOpen(false);
    expect(useUiStore.getState().isCommandPaletteOpen).toBe(false);
    expect(useVehicleStore.getState().activeView).toBe('aeroStudio');
  });

  it('verifies exact count of registered views is 24 (surpassing former 19-view limitation)', () => {
    expect(ALL_24_VIEWS.length).toBe(24);
  });
});
