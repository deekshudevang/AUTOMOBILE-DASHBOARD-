import { describe, it, expect, beforeEach } from 'vitest';
import { useUiStore } from '../src/state/useUiStore';

describe('AutoVerse Gran Turismo Design System Foundation — Phase 27.0', () => {
  beforeEach(() => {
    // Reset state before tests
    useUiStore.setState({
      activeWorkspace: 'atelier',
      isBladeCollapsed: false,
      bladeWidth: 360,
      activeStudioTab: 'exterior',
      isCommandPaletteOpen: false,
      isShortcutHelpOpen: false,
      uiSoundsEnabled: false,
      reducedMotionOverride: null,
      showEngineeringGrid: false,
      toasts: [],
    });
  });

  describe('1. UI State Management (useUiStore)', () => {
    it('initializes with default workspace "atelier" and expands blade', () => {
      const state = useUiStore.getState();
      expect(state.activeWorkspace).toBe('atelier');
      expect(state.isBladeCollapsed).toBe(false);
      expect(state.bladeWidth).toBe(360);
    });

    it('smoothly switches between Atelier, Telemetry, and Engineering workspaces', () => {
      const { setActiveWorkspace } = useUiStore.getState();

      setActiveWorkspace('telemetry');
      expect(useUiStore.getState().activeWorkspace).toBe('telemetry');

      setActiveWorkspace('engineering');
      expect(useUiStore.getState().activeWorkspace).toBe('engineering');

      setActiveWorkspace('atelier');
      expect(useUiStore.getState().activeWorkspace).toBe('atelier');
    });

    it('toggles blade collapse and bounds blade width between 280px and 500px', () => {
      const { toggleBladeCollapsed, setBladeWidth } = useUiStore.getState();

      toggleBladeCollapsed();
      expect(useUiStore.getState().isBladeCollapsed).toBe(true);

      toggleBladeCollapsed();
      expect(useUiStore.getState().isBladeCollapsed).toBe(false);

      setBladeWidth(150); // Under min (280)
      expect(useUiStore.getState().bladeWidth).toBe(280);

      setBladeWidth(600); // Over max (500)
      expect(useUiStore.getState().bladeWidth).toBe(500);

      setBladeWidth(380);
      expect(useUiStore.getState().bladeWidth).toBe(380);
    });

    it('manages command palette and shortcut help dialog visibility', () => {
      const { setCommandPaletteOpen, setShortcutHelpOpen, toggleCommandPalette } = useUiStore.getState();

      expect(useUiStore.getState().isCommandPaletteOpen).toBe(false);
      toggleCommandPalette();
      expect(useUiStore.getState().isCommandPaletteOpen).toBe(true);
      toggleCommandPalette();
      expect(useUiStore.getState().isCommandPaletteOpen).toBe(false);

      setShortcutHelpOpen(true);
      expect(useUiStore.getState().isShortcutHelpOpen).toBe(true);
    });

    it('adds and removes toast notifications reliably', () => {
      const { addToast, removeToast } = useUiStore.getState();

      addToast({ type: 'ok', title: 'Build Saved', message: 'Porsche 911 GT3 RS synced to cloud', durationMs: 0 });
      const toasts = useUiStore.getState().toasts;
      expect(toasts.length).toBe(1);
      expect(toasts[0].title).toBe('Build Saved');
      expect(toasts[0].type).toBe('ok');

      removeToast(toasts[0].id);
      expect(useUiStore.getState().toasts.length).toBe(0);
    });
  });

  describe('2. Design Tokens Contrast & WCAG 2.1 AA Compliance', () => {
    // Relative luminance calculation per W3C WCAG 2.1
    function getLuminance(r: number, g: number, b: number): number {
      const a = [r, g, b].map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
      const lum1 = getLuminance(...rgb1);
      const lum2 = getLuminance(...rgb2);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return (brightest + 0.05) / (darkest + 0.05);
    }

    it('verifies primary text (#F0F1F2) passes WCAG AAA contrast (> 7:1) on Obsidian background (#050608)', () => {
      const textPrimary: [number, number, number] = [240, 241, 242];
      const bgObsidian: [number, number, number] = [5, 6, 8];
      const ratio = getContrastRatio(textPrimary, bgObsidian);

      expect(ratio).toBeGreaterThan(15.0); // Measured > 18:1
    });

    it('verifies secondary text (#A6ABB1) passes WCAG AA contrast (>= 4.5:1) on Basalt surface (#0F1216)', () => {
      const textSecondary: [number, number, number] = [166, 171, 177];
      const bgBasalt: [number, number, number] = [15, 18, 22];
      const ratio = getContrastRatio(textSecondary, bgBasalt);

      expect(ratio).toBeGreaterThanOrEqual(4.5); // Measured > 8:1
    });

    it('verifies secondary text (#A6ABB1) passes WCAG AA contrast (>= 4.5:1) on Graphite surface (#1A1E23)', () => {
      const textSecondary: [number, number, number] = [166, 171, 177];
      const bgGraphite: [number, number, number] = [26, 30, 35];
      const ratio = getContrastRatio(textSecondary, bgGraphite);

      expect(ratio).toBeGreaterThanOrEqual(4.5); // Measured > 7:1
    });

    it('verifies Motorsport Redline accent (#E53935) reaches >= 3:1 against text-primary for focus ring perception', () => {
      const accentRed: [number, number, number] = [229, 57, 53];
      const textPrimary: [number, number, number] = [240, 241, 242];
      const ratio = getContrastRatio(accentRed, textPrimary);

      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });
  });
});
