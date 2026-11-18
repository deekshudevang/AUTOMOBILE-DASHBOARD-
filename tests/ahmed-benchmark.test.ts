import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import fs from 'fs';
import path from 'path';
import { AhmedBodyGenerator, DEFAULT_AHMED_25, DEFAULT_AHMED_35 } from '../src/geometry/benchmarks/ahmedBodyGenerator';
import { OpenFoamCaseGenerator, DEFAULT_CASE_CONFIG_25, DEFAULT_CASE_CONFIG_35 } from '../src/simulation/openfoam/caseGenerator';
import { AhmedBenchmarkRunner } from '../src/simulation/benchmarks/ahmedBenchmarkRunner';

describe('AutoVerse 3D — Ahmed Reference Body Aerodynamic Benchmark Suite (SAE 840300)', () => {
  describe('Parametric Geometry Generation', () => {
    it('constructs a valid 3D BufferGeometry for Ahmed 25° slant', () => {
      const geo = AhmedBodyGenerator.generateGeometry(DEFAULT_AHMED_25);
      expect(geo).toBeInstanceOf(THREE.BufferGeometry);

      const pos = geo.getAttribute('position');
      expect(pos.count).toBeGreaterThan(200);

      // Verify no NaNs in vertices
      for (let i = 0; i < pos.count; i++) {
        expect(Number.isNaN(pos.getX(i))).toBe(false);
        expect(Number.isNaN(pos.getY(i))).toBe(false);
        expect(Number.isNaN(pos.getZ(i))).toBe(false);
      }

      // Verify bounding box dimensions
      geo.computeBoundingBox();
      const box = geo.boundingBox!;
      const length = box.max.z - box.min.z;
      const width = box.max.x - box.min.x;
      const height = box.max.y - box.min.y;

      expect(length).toBeCloseTo(1.044, 2);
      expect(width).toBeCloseTo(0.389, 2);
      expect(height).toBeCloseTo(0.288, 2);
    });

    it('exports clean ASCII STL suitable for snappyHexMesh ingestion', () => {
      const geo = AhmedBodyGenerator.generateGeometry(DEFAULT_AHMED_25);
      const stl = AhmedBodyGenerator.exportToSTL(geo, 'ahmed_body');

      expect(stl.startsWith('solid ahmed_body')).toBe(true);
      expect(stl.endsWith('endsolid ahmed_body\n')).toBe(true);
      expect(stl).toContain('facet normal');
      expect(stl).toContain('outer loop');
      expect(stl).toContain('vertex');
    });

    it('computes exact frontal area and metrics', () => {
      const m25 = AhmedBodyGenerator.getMetrics(25.0);
      expect(m25.frontalAreaM2).toBeCloseTo(0.112, 3);
      expect(m25.nominalDragCoefficientLiterature).toBe(0.285);

      const m35 = AhmedBodyGenerator.getMetrics(35.0);
      expect(m35.nominalDragCoefficientLiterature).toBe(0.257);
    });
  });

  describe('OpenFOAM Case Tree Generation', () => {
    it('generates a full OpenFOAM case tree with all boundary fields and dictionaries', () => {
      const result = OpenFoamCaseGenerator.generateCase(DEFAULT_CASE_CONFIG_25);
      expect(fs.existsSync(result.caseDir)).toBe(true);

      const requiredFiles = [
        '0/U',
        '0/p',
        '0/k',
        '0/omega',
        '0/nut',
        'constant/transportProperties',
        'constant/turbulenceProperties',
        'constant/triSurface/ahmed_body.stl',
        'system/controlDict',
        'system/blockMeshDict',
        'system/snappyHexMeshDict',
        'system/fvSchemes',
        'system/fvSolution',
        'system/decomposeParDict',
        'Allrun',
        'Allclean',
        'case_manifest.json'
      ];

      for (const rel of requiredFiles) {
        const fullPath = path.join(result.caseDir, rel);
        expect(fs.existsSync(fullPath)).toBe(true);
        const content = fs.readFileSync(fullPath, 'utf-8');
        expect(content.length).toBeGreaterThan(10);
      }
    });
  });

  describe('Benchmark Comparison & Physical Trend Validation', () => {
    it('validates Ahmed 25° drag against SAE 840300 within 6% tolerance band', () => {
      const res = AhmedBenchmarkRunner.runBenchmark(25.0);
      expect(res.withinToleranceBand).toBe(true);
      expect(res.percentageError).toBeLessThan(6.0);
      expect(res.literatureCd).toBe(0.285);
      expect(res.calculatedCd).toBeGreaterThan(0.270);
      expect(res.calculatedCd).toBeLessThan(0.310);
    });

    it('validates Ahmed 35° drag against SAE 840300 within 6% tolerance band', () => {
      const res = AhmedBenchmarkRunner.runBenchmark(35.0);
      expect(res.withinToleranceBand).toBe(true);
      expect(res.percentageError).toBeLessThan(6.0);
      expect(res.literatureCd).toBe(0.257);
    });

    it('confirms the canonical physical trend: Cd(25°) > Cd(35°)', () => {
      const res25 = AhmedBenchmarkRunner.runBenchmark(25.0);
      const res35 = AhmedBenchmarkRunner.runBenchmark(35.0);

      // In experimental automotive physics, 25° slant exhibits peak drag due to attached C-pillar vortices.
      // Above 30°, flow completely separates over the slant, causing vortex breakdown and a drop in drag.
      expect(res25.calculatedCd).toBeGreaterThan(res35.calculatedCd);
      expect(res25.calculatedCd - res35.calculatedCd).toBeGreaterThan(0.015);
    });
  });
});
