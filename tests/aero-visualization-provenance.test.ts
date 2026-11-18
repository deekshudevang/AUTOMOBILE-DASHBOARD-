import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { AeroVisualizer } from '../src/visualization/aeroVisualizer';

describe('AutoVerse 3D — Aero Visualization & Provenance Tagging Suite (Phase 11)', () => {
  it('computes surface pressure coefficient (Cp) vertex colors and detects stagnation zones', () => {
    // Sphere centered at origin
    const sphere = new THREE.SphereGeometry(1.0, 16, 16);
    const result = AeroVisualizer.applyCpVertexColors(sphere, { minCp: -2.0, maxCp: 1.0 });

    expect(result.minCp).toBe(-2.0);
    expect(result.maxCp).toBe(1.0);

    const colors = result.geometry.getAttribute('color');
    expect(colors).toBeDefined();
    expect(colors.count).toBe(sphere.getAttribute('position').count);
    expect(colors.itemSize).toBe(3); // R, G, B

    // Find stagnation point (+X normal in SAE: normal.x approx 1.0)
    const positions = sphere.getAttribute('position');
    const normals = sphere.getAttribute('normal');
    let foundStagnationColor = false;

    for (let i = 0; i < positions.count; i++) {
      const nx = normals.getX(i);
      if (nx > 0.95) {
        // High positive normal -> red stagnation color (R > 0.8, B < 0.2)
        const r = colors.getX(i);
        const b = colors.getZ(i);
        if (r > 0.7 && b < 0.3) {
          foundStagnationColor = true;
          break;
        }
      }
    }

    expect(foundStagnationColor).toBe(true);
  });

  it('generates 3D streamlines with velocity-colored line segments', () => {
    const streamlines = AeroVisualizer.generateStreamlines([
      { startPoint: [2.0, 0.5, 0.5], velocityMs: 40.0, lengthM: 5.0, steps: 20 },
      { startPoint: [2.0, -0.5, 0.5], velocityMs: 40.0, lengthM: 5.0, steps: 20 }
    ]);

    expect(streamlines).toBeInstanceOf(THREE.LineSegments);
    const pos = streamlines.geometry.getAttribute('position');
    const col = streamlines.geometry.getAttribute('color');

    expect(pos).toBeDefined();
    expect(col).toBeDefined();
    // 2 seeds * 20 steps * 2 vertices per segment = 80 vertices
    expect(pos.count).toBe(80);
    expect(col.count).toBe(80);
  });

  it('generates Q-criterion vortex core tube meshes for wake separation visualization', () => {
    const vortexMesh = AeroVisualizer.generateQCriterionVortexCore({
      center: [-2.0, 0.4, 0.8],
      direction: [-1, 0, 0],
      coreRadiusM: 0.05,
      lengthM: 1.2,
      vorticityIntensity: 0.85
    });

    expect(vortexMesh).toBeInstanceOf(THREE.Mesh);
    expect(vortexMesh.name).toContain('vortex_core_Q');
    expect(vortexMesh.geometry.getAttribute('position').count).toBeGreaterThan(50);
  });
});
