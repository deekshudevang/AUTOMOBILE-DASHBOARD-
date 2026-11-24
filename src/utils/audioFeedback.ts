/**
 * AUTOVERSE — Precision Automotive Web Audio Synthesizer
 * Zero external audio assets needed. Generates procedural, tactile mechanical
 * feedback for camera clicks, slider detents, and door/aperture latches.
 */

import { useUiStore } from '../state/useUiStore';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtxClass) return null;

  if (!audioCtx) {
    try {
      audioCtx = new AudioCtxClass();
    } catch {
      return null;
    }
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a high-precision camera rail shutter/preset tick
 */
export function playCameraClick(): void {
  if (!useUiStore.getState().uiSoundsEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.015);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.018);
  } catch {
    // Ignore audio playback failure
  }
}

/**
 * Play tactile detent tick for sliders and numeric steppers
 */
export function playSliderDetent(): void {
  if (!useUiStore.getState().uiSoundsEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.01);

    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.01);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.012);
  } catch {
    // Ignore audio playback failure
  }
}

/**
 * Play mechanical latch sound for door/bonnet/boot aperture toggle
 */
export function playApertureLatch(): void {
  if (!useUiStore.getState().uiSoundsEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Ignore audio playback failure
  }
}

/**
 * Play clean mechanical switch tick
 */
export function playToggleClick(): void {
  if (!useUiStore.getState().uiSoundsEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.012);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  } catch {
    // Ignore audio playback failure
  }
}
