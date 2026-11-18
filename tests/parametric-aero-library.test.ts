import { describe, it, expect } from 'vitest';
import {
  ParametricAeroLibrary,
  AIRFOIL_CATALOG,
  RearWingParameters,
  FrontSplitterParameters,
  RearDiffuserParameters
} from '../src/geometry/aero/parametricAeroLibrary';

describe('AutoVerse 3D — Parametric Aerodynamic Component Library (Phase 8)', () => {
  it('loads canonical airfoil catalog with literature provenance and geometric properties', () => {
    expect(AIRFOIL_CATALOG['NACA_0012']).toBeDefined();
    expect(AIRFOIL_CATALOG['NACA_2412']).toBeDefined();
    expect(AIRFOIL_CATALOG['SELIG_S1223']).toBeDefined();

    const naca2412 = AIRFOIL_CATALOG['NACA_2412'];
    expect(naca2412.citation).toContain('Abbott');
    expect(naca2412.thicknessRatio).toBeCloseTo(0.12);
    expect(naca2412.maxCamberRatio).toBeCloseTo(0.02);
    expect(naca2412.coordinates.length).toBeGreaterThan(40);

    // Selig S1223 high-downforce motorsport aerofoil
    const selig = AIRFOIL_CATALOG['SELIG_S1223'];
    expect(selig.citation).toContain('Selig');
    expect(selig.maxCamberRatio).toBeGreaterThan(0.08); // High camber
  });

  it('generates 3D mesh geometry for a parametric rear wing assembly', () => {
    const wingParams: RearWingParameters = {
      airfoilCode: 'NACA_2412',
      spanM: 1.65,
      chordM: 0.32,
      angleDegrees: 8.5,
      mountType: 'swan_neck',
      mountSpacingM: 0.8,
      endplates: { heightM: 0.25, lengthM: 0.38, thicknessM: 0.008 },
      gurneyFlap: { enabled: true, heightMm: 10 }
    };

    const geometry = ParametricAeroLibrary.generateRearWingGeometry(wingParams);
    expect(geometry).toBeDefined();

    const positions = geometry.getAttribute('position');
    const normals = geometry.getAttribute('normal');
    const uvs = geometry.getAttribute('uv');
    const indices = geometry.getIndex();

    expect(positions.count).toBeGreaterThan(100);
    expect(normals.count).toBe(positions.count);
    expect(uvs.count).toBe(positions.count);
    expect(indices).not.toBeNull();
    expect(indices!.count).toBeGreaterThan(150);

    // Compute bounding box
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    // Span along Y in SAE: from -0.825 to +0.825
    expect(box.max.y - box.min.y).toBeCloseTo(1.65, 2);
  });

  it('generates 3D mesh geometry for a parametric front splitter', () => {
    const splitterParams: FrontSplitterParameters = {
      forwardExtensionM: 0.12,
      widthM: 1.85,
      thicknessM: 0.015,
      angleDegrees: 1.5,
      edgeRadiusM: 0.005,
      sideEndplates: { enabled: true, heightM: 0.08 }
    };

    const geometry = ParametricAeroLibrary.generateFrontSplitterGeometry(splitterParams);
    expect(geometry).toBeDefined();

    const positions = geometry.getAttribute('position');
    expect(positions.count).toBeGreaterThan(50);

    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    expect(box.max.y - box.min.y).toBeCloseTo(1.85, 2);
    expect(box.max.x).toBeGreaterThan(0.10); // Forward extension
  });

  it('generates 3D mesh geometry for a parametric rear diffuser', () => {
    const diffuserParams: RearDiffuserParameters = {
      lengthM: 0.75,
      widthM: 1.40,
      expansionAngleDegrees: 12.0,
      strakeCount: 4,
      strakeHeightM: 0.06
    };

    const geometry = ParametricAeroLibrary.generateRearDiffuserGeometry(diffuserParams);
    expect(geometry).toBeDefined();

    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    expect(box.max.y - box.min.y).toBeCloseTo(1.40, 2);
    // Expansion upwards in Z
    expect(box.max.z).toBeGreaterThan(box.min.z);
  });

  it('computes analytical aerodynamic estimates with strict provenance and citations', () => {
    const wingParams: RearWingParameters = {
      airfoilCode: 'NACA_2412',
      spanM: 1.60,
      chordM: 0.30,
      angleDegrees: 10.0,
      mountType: 'swan_neck',
      mountSpacingM: 0.8,
      endplates: { heightM: 0.25, lengthM: 0.35, thicknessM: 0.008 },
      gurneyFlap: { enabled: true, heightMm: 8 }
    };

    const aeroEstimate = ParametricAeroLibrary.calculateAnalyticAeroEstimates(wingParams, 55.56); // 200 km/h

    expect(aeroEstimate.provenance).toBe('ANALYTIC');
    expect(aeroEstimate.cl).toBeLessThan(0); // Inverted aerofoil -> negative lift (downforce)
    expect(aeroEstimate.downforceNewtons).toBeGreaterThan(500); // Substantial downforce at 200 km/h
    expect(aeroEstimate.dragNewtons).toBeGreaterThan(50);
    expect(aeroEstimate.assumptions.length).toBeGreaterThanOrEqual(3);
    expect(aeroEstimate.assumptions[0]).toContain('Prandtl lifting-line');
  });
});
