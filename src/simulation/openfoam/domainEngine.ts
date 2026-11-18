export interface VehicleBoundingSpecs {
  lengthM: number;
  widthM: number;
  heightM: number;
  wheelbaseM: number;
  groundClearanceM: number;
  frontalAreaM2: number;
  wheelRadiusM?: number;
}

export interface ComputationalDomainSpecs {
  domainMin: [number, number, number]; // [xMin, yMin, zMin] in SAE coords (meters)
  domainMax: [number, number, number]; // [xMax, yMax, zMax] in SAE coords (meters)
  lengthM: number;
  widthM: number;
  heightM: number;
  crossSectionalAreaM2: number;
  blockageRatioPercent: number;
  isBlockageCompliant: boolean; // < 3.0%
  upstreamDistanceM: number;
  downstreamDistanceM: number;
  isHalfModelSymmetry: boolean;
  boundaryConditions: {
    inlet: { type: 'velocity-inlet'; velocityMs: number };
    outlet: { type: 'pressure-outlet'; gaugePressurePa: 0 };
    ground: { type: 'moving-wall'; velocityMs: number };
    sidesAndTop: { type: 'slip' | 'symmetry' };
    symmetryPlane?: { type: 'symmetryPlane'; yCoordinate: 0 };
    wheels: {
      type: 'rotating-wall-or-MRF';
      angularVelocityRadS: number;
      wheelRadiusM: number;
    };
  };
}

export class DomainEngine {
  /**
   * Calculate OpenFOAM computational wind tunnel domain satisfying SAE/AIAA standards:
   * - Blockage ratio < 3.0%
   * - Upstream length >= 3 * vehicle length
   * - Downstream length >= 8 * vehicle length
   * - Height >= 5 * vehicle height
   * - Moving ground at vehicle velocity
   * - Rotating wheel velocity omega = V / R_wheel
   */
  public static calculateDomain(
    vehicle: VehicleBoundingSpecs,
    freestreamVelocityMs: number = 40.0,
    halfModel: boolean = false
  ): ComputationalDomainSpecs {
    const L = vehicle.lengthM;
    const H = vehicle.heightM;
    const A_frontal = vehicle.frontalAreaM2;
    const wheelRadius = vehicle.wheelRadiusM ?? 0.35;

    const upstreamL = 3.5 * L;
    const downstreamL = 8.5 * L;
    const domainHeight = 5.5 * H;

    // Target blockage ratio <= 2.5% (well below the 3.0% ceiling)
    // Blockage = (A_frontal / 2 for half model) / (domainWidth * domainHeight) <= 0.025
    const effFrontalArea = halfModel ? A_frontal / 2 : A_frontal;
    const targetBlockage = 0.025;
    let minDomainWidth = effFrontalArea / (targetBlockage * domainHeight);

    // Ensure lateral clearance >= 4 * vehicle width
    const minWidthFromCar = halfModel ? 2.5 * vehicle.widthM : 5.0 * vehicle.widthM;
    const domainWidth = Math.max(minDomainWidth, minWidthFromCar);

    const crossSectionalArea = domainWidth * domainHeight;
    const blockageRatioPercent = (effFrontalArea / crossSectionalArea) * 100;
    const isBlockageCompliant = blockageRatioPercent < 3.0;

    // SAE coordinates: +X is forward, vehicle origin at front axle or center
    // Inlet is in front (+X), Outlet is behind (-X)
    const xMin = -downstreamL; // Behind vehicle
    const xMax = upstreamL;    // Ahead of vehicle

    const yMin = halfModel ? 0 : -domainWidth / 2;
    const yMax = halfModel ? domainWidth : domainWidth / 2;

    const zMin = 0; // Ground plane (moving road)
    const zMax = domainHeight;

    const angularVelocity = freestreamVelocityMs / wheelRadius;

    return {
      domainMin: [xMin, yMin, zMin],
      domainMax: [xMax, yMax, zMax],
      lengthM: xMax - xMin,
      widthM: yMax - yMin,
      heightM: zMax - zMin,
      crossSectionalAreaM2: Math.round(crossSectionalArea * 10) / 10,
      blockageRatioPercent: Math.round(blockageRatioPercent * 100) / 100,
      isBlockageCompliant,
      upstreamDistanceM: upstreamL,
      downstreamDistanceM: downstreamL,
      isHalfModelSymmetry: halfModel,
      boundaryConditions: {
        inlet: { type: 'velocity-inlet', velocityMs: freestreamVelocityMs },
        outlet: { type: 'pressure-outlet', gaugePressurePa: 0 },
        ground: { type: 'moving-wall', velocityMs: freestreamVelocityMs },
        sidesAndTop: { type: halfModel ? 'symmetry' : 'slip' },
        symmetryPlane: halfModel ? { type: 'symmetryPlane', yCoordinate: 0 } : undefined,
        wheels: {
          type: 'rotating-wall-or-MRF',
          angularVelocityRadS: Math.round(angularVelocity * 10) / 10,
          wheelRadiusM: wheelRadius
        }
      }
    };
  }
}
