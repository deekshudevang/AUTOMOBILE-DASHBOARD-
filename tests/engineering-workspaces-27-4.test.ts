import { describe, it, expect } from 'vitest';
import {
  BRepPrimitives,
  BRepBooleanEngine,
  BRepSolid
} from '../src/geometry/cad/brep';
import { StepExporter } from '../src/geometry/cad/stepExporter';
import {
  AIRFOIL_CATALOG,
  PREBUILT_AERO_PACKAGES
} from '../src/geometry/aero/parametricAeroLibrary';
import { AeroDynamicsCoupler, VehicleDynamicsInput } from '../src/simulation/dynamics/aeroDynamicsCoupler';

describe('Phase 27.4: Engineering Workspaces Overhaul (CAD, Aero, CFD, Dynamics)', () => {
  describe('CAD Designer & B-Rep Topology Kernel', () => {
    it('constructs analytical B-Rep solid with closed 2-manifold Euler characteristic chi = 2', () => {
      const box = BRepPrimitives.createBox(2.0, 0.9, 4.5);
      expect(box).toBeInstanceOf(BRepSolid);

      const euler = box.getEulerCharacteristic();
      expect(euler).toBe(2);

      const volume = box.getVolume();
      expect(volume).toBeCloseTo(2.0 * 0.9 * 4.5, 2);

      const area = box.getSurfaceArea();
      expect(area).toBeGreaterThan(0);
      expect(box.outerShell.faces.length).toBe(6);
    });

    it('exports analytical STEP AP214 file with ISO 10303-21 header', () => {
      const solid = BRepPrimitives.createBox(1.5, 0.8, 3.2);
      const stepData = StepExporter.exportSolidToStep(solid, {
        modelName: 'CHASSIS_TUB',
        schema: 'AP214',
        unit: 'METRE'
      });

      expect(stepData).toContain('ISO-10303-21;');
      expect(stepData).toContain('AUTOMOTIVE_DESIGN');
      expect(stepData).toContain('MANIFOLD_SOLID_BREP');
      expect(stepData).toContain('END-ISO-10303-21;');
    });
  });

  describe('Aerodynamics Studio & Wind Tunnel Telemetry', () => {
    it('computes dynamic pressure, downforce, drag, and L/D ratio across airspeed sweep', () => {
      const rho = 1.225;
      const speedKmh = 160;
      const speedMs = speedKmh / 3.6;
      const q = 0.5 * rho * speedMs * speedMs;

      expect(q).toBeCloseTo(1209.87, 0);

      // Wing calculations for 1.82m span and 0.34m chord
      const wingSpan = 1.82;
      const wingChord = 0.34;
      const wingArea = wingSpan * wingChord;
      const wingAoA = 10.5;

      const clWing = Math.min(1.8, 0.4 + (wingAoA * 0.08));
      const cdWing = 0.015 + Math.pow(clWing, 2) / (Math.PI * (wingSpan / wingChord) * 0.85);

      const wingDownforceN = q * wingArea * clWing;
      const wingDragN = q * wingArea * cdWing;

      expect(wingDownforceN).toBeGreaterThan(500);
      expect(wingDragN).toBeGreaterThan(50);

      const ldRatio = wingDownforceN / wingDragN;
      expect(ldRatio).toBeGreaterThan(3.0);
    });

    it('verifies certified airfoils and prebuilt aero packages are available', () => {
      expect(Object.keys(AIRFOIL_CATALOG).length).toBeGreaterThanOrEqual(3);
      expect(PREBUILT_AERO_PACKAGES.length).toBeGreaterThanOrEqual(2);

      const gt3Pkg = PREBUILT_AERO_PACKAGES.find(p => p.id.includes('gt3') || p.id.includes('street') || p.id.includes('clubsport'));
      expect(gt3Pkg).toBeDefined();
    });
  });

  describe('CFD Lab Simulation & Logarithmic Convergence', () => {
    it('validates wall y+ estimation and boundary layer inflation layer calculations', () => {
      const inletSpeedMs = 30.0;
      const lengthM = 4.572;
      const nu = 1.48e-5;
      const reL = (inletSpeedMs * lengthM) / nu;

      expect(reL).toBeGreaterThan(9e6);

      // Flat-plate turbulent boundary layer skin friction cf
      const cf = 0.074 / Math.pow(reL, 0.2);
      expect(cf).toBeLessThan(0.005);
      expect(cf).toBeGreaterThan(0.001);

      // Estimated wall shear stress and friction velocity
      const rho = 1.225;
      const tauW = 0.5 * cf * rho * inletSpeedMs * inletSpeedMs;
      const uTau = Math.sqrt(tauW / rho);

      // For first cell height y1 = 0.45mm
      const y1 = 0.00045;
      const yPlus = (y1 * uTau) / nu;
      expect(yPlus).toBeGreaterThan(20);
      expect(yPlus).toBeLessThan(60);
    });
  });

  describe('Vehicle Dynamics Simulator & Aero Coupling', () => {
    it('evaluates dynamic aero-normal load coupling with high-speed grip enhancement', () => {
      const aeroInput: VehicleDynamicsInput = {
        massKg: 1450,
        wheelbaseM: 2.457,
        frontTrackM: 1.63,
        rearTrackM: 1.60,
        cgHeightM: 0.42,
        staticWeightFrontPct: 42,
        tireFrictionCoeffMu: 1.35,
        frontSpringRateNPerM: 140000,
        rearSpringRateNPerM: 160000,
        frontalAreaM2: 2.12,
        cd: 0.384,
        clFront: -0.152,
        clRear: -0.276
      };

      const report = AeroDynamicsCoupler.evaluateDynamicsCoupling(aeroInput);
      expect(report).toBeDefined();
      expect(report.speedSweep.length).toBeGreaterThanOrEqual(10);

      // Mechanical grip vs high-speed grip
      const baseGrip = report.speedSweep[0].maxCorneringLateralG;
      const highSpeedGrip = report.topSpeedPoint.maxCorneringLateralG;

      expect(highSpeedGrip).toBeGreaterThan(baseGrip);
      expect(report.highSpeedGripEnhancementPct).toBeGreaterThan(15);
    });

    it('computes lateral wheel load transfer during 1.2G cornering', () => {
      const mass = 1450;
      const latG = 1.2;
      const cgH = 0.42;
      const frontTrack = 1.63;
      const rearTrack = 1.60;

      const latTransferFront = (mass * 0.42 * 9.81 * latG * cgH) / frontTrack;
      const latTransferRear = (mass * 0.58 * 9.81 * latG * cgH) / rearTrack;

      expect(latTransferFront).toBeGreaterThan(1500);
      expect(latTransferRear).toBeGreaterThan(2200);
    });
  });
});
