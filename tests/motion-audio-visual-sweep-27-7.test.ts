import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { useUiStore } from '../src/state/useUiStore';
import {
  playCameraClick,
  playSliderDetent,
  playApertureLatch,
  playToggleClick
} from '../src/utils/audioFeedback';
import { tokens } from '../src/theme/tokens';

/**
 * AUTOVERSE PHASE 27.7 — Motion Polish, Web Audio Synth & Visual Consistency Sweep Suite
 */

describe('AutoVerse 3D — Phase 27.7: Motion Polish, Audio Synthesizer & Visual Consistency Sweep', () => {

  describe('1. Motion System & Precision Mechanical Timings', () => {
    it('defines standard automotive transition durations and cubic bezier easing curves', () => {
      expect(tokens.motion.durations.fast).toBe('150ms');
      expect(tokens.motion.durations.normal).toBe('250ms');
      expect(tokens.motion.durations.slow).toBe('400ms');

      expect(tokens.motion.easing.standard).toContain('cubic-bezier');
      expect(tokens.motion.easing.decelerate).toContain('cubic-bezier');
    });

    it('enforces reduced-motion suppression in stylesheet', () => {
      const cssContent = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf-8');
      expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
      expect(cssContent).toContain('animation-duration: 0.01ms !important');
      expect(cssContent).toContain('transition-duration: 0.01ms !important');
    });
  });

  describe('2. Procedural Web Audio Mechanical Synthesizer', () => {
    it('safely handles audio triggers when sound is disabled or running headless', () => {
      // Ensure sounds disabled initially
      useUiStore.setState({ uiSoundsEnabled: false });

      // None of these should throw or allocate audio contexts when disabled
      expect(() => playCameraClick()).not.toThrow();
      expect(() => playSliderDetent()).not.toThrow();
      expect(() => playApertureLatch()).not.toThrow();
      expect(() => playToggleClick()).not.toThrow();
    });

    it('toggles uiSoundsEnabled state in useUiStore cleanly', () => {
      const initial = useUiStore.getState().uiSoundsEnabled;
      useUiStore.getState().toggleUiSounds();
      expect(useUiStore.getState().uiSoundsEnabled).toBe(!initial);

      // Revert back
      useUiStore.getState().toggleUiSounds();
      expect(useUiStore.getState().uiSoundsEnabled).toBe(initial);
    });

    it('has volume feedback toggle button in GranTurismoHeader', () => {
      const headerContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/shell/GranTurismoHeader.tsx'), 'utf-8');
      expect(headerContent).toContain('toggleUiSounds');
      expect(headerContent).toContain('uiSoundsEnabled');
      expect(headerContent).toContain('Volume2');
      expect(headerContent).toContain('VolumeX');
    });
  });

  describe('3. Zero AI-Slop Visual Consistency Sweep', () => {
    const viewsDir = path.resolve(process.cwd(), 'src/components/views');
    const viewFiles = fs.readdirSync(viewsDir).filter(f => f.endsWith('.tsx'));

    it('ensures no purple AI-slop background or shadow utility classes exist in views', () => {
      for (const file of viewFiles) {
        const content = fs.readFileSync(path.join(viewsDir, file), 'utf-8');
        expect(content).not.toMatch(/bg-purple-/);
        expect(content).not.toMatch(/shadow-purple-/);
        expect(content).not.toMatch(/from-purple-/);
      }
    });

    it('ensures no AI-slop marketing emojis exist in views', () => {
      for (const file of viewFiles) {
        const content = fs.readFileSync(path.join(viewsDir, file), 'utf-8');
        expect(content).not.toMatch(/[🚀✨🔥🎉]/u);
      }
    });

    it('adheres to 4px spacing scale and single Rosso Corsa accent token', () => {
      expect(tokens.spacing[1]).toBe('4px');
      expect(tokens.spacing[2]).toBe('8px');
      expect(tokens.spacing[4]).toBe('16px');

      const cssContent = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf-8');
      expect(cssContent).toContain('--accent: #DC2626;'); // Rosso Corsa (WCAG AA compliant)
    });
  });

  describe('4. Three.js Atelier Studio Lighting & Material Fidelity', () => {
    const canvasContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/3d/SceneCanvas.tsx'), 'utf-8');

    it('configures ACESFilmicToneMapping and polished onyx reflective showroom floor', () => {
      expect(canvasContent).toContain('THREE.ACESFilmicToneMapping');
      expect(canvasContent).toContain('toneMappingExposure: 1.15');
      expect(canvasContent).toContain('color="#07090E"'); // Polished Onyx
      expect(canvasContent).toContain('roughness={0.24}');
      expect(canvasContent).toContain('metalness={0.38}');
    });

    it('configures soft contact shadows and dynamic 3200K interior warm fill light', () => {
      expect(canvasContent).toContain('ContactShadows');
      expect(canvasContent).toContain('color="#FFF0D4"'); // 3200K interior warm light
      expect(canvasContent).toContain('isCockpitActive');
    });
  });

});
