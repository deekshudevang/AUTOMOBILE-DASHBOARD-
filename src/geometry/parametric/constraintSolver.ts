export interface DrivingDimensions {
  wheelbase: number;        // m
  frontOverhang: number;    // m
  rearOverhang: number;     // m
  overallWidth: number;     // m
  frontTrack: number;       // m
  rearTrack: number;        // m
  groundClearance: number;  // m
  cabinHeight: number;      // m
}

export interface DrivenDimensions {
  overallLength: number;    // m: frontOverhang + wheelbase + rearOverhang
  overallHeight: number;    // m: groundClearance + cabinHeight
  aspectRatioLtoW: number;
  trackToWheelbaseRatio: number;
}

export interface DimensionConflict {
  type: 'OVER_CONSTRAINED' | 'UNDER_CONSTRAINED' | 'OUT_OF_BOUNDS';
  parameter: string;
  message: string;
  currentValue: number;
  suggestedValue?: number;
}

export interface SolvedHardpoints {
  frontAxleCenter: [number, number, number];
  rearAxleCenter: [number, number, number];
  frontBumperTip: [number, number, number];
  rearBumperTip: [number, number, number];
  cowlBase: [number, number, number];
  roofApex: [number, number, number];
  diffuserLeadingEdge: [number, number, number];
  frontLeftWheelCenter: [number, number, number];
  frontRightWheelCenter: [number, number, number];
  rearLeftWheelCenter: [number, number, number];
  rearRightWheelCenter: [number, number, number];
}

/**
 * Phase 5.2: Dimension Constraint Solver
 * Resolves driving vs driven vehicle packaging dimensions and generates hardpoint coordinate sets.
 */
export class DimensionConstraintSolver {
  public static solveDimensions(driving: DrivingDimensions): {
    driven: DrivenDimensions;
    hardpoints: SolvedHardpoints;
    conflicts: DimensionConflict[];
  } {
    const conflicts: DimensionConflict[] = [];

    // 1. Bound checks
    if (driving.wheelbase < 1.6 || driving.wheelbase > 4.5) {
      conflicts.push({
        type: 'OUT_OF_BOUNDS',
        parameter: 'wheelbase',
        message: `Wheelbase ${driving.wheelbase}m exceeds physical automotive bounds [1.6m, 4.5m]`,
        currentValue: driving.wheelbase,
        suggestedValue: Math.min(4.5, Math.max(1.6, driving.wheelbase))
      });
    }

    if (driving.groundClearance < 0.02 || driving.groundClearance > 0.40) {
      conflicts.push({
        type: 'OUT_OF_BOUNDS',
        parameter: 'groundClearance',
        message: `Ground clearance ${driving.groundClearance}m outside valid road vehicle bounds [0.02m, 0.40m]`,
        currentValue: driving.groundClearance,
        suggestedValue: 0.10
      });
    }

    if (driving.frontTrack > driving.overallWidth || driving.rearTrack > driving.overallWidth) {
      conflicts.push({
        type: 'OVER_CONSTRAINED',
        parameter: 'track',
        message: 'Wheel track width cannot exceed overall body width',
        currentValue: Math.max(driving.frontTrack, driving.rearTrack),
        suggestedValue: driving.overallWidth - 0.20
      });
    }

    // 2. Compute driven dimensions
    const overallLength = Number((driving.frontOverhang + driving.wheelbase + driving.rearOverhang).toFixed(4));
    const overallHeight = Number((driving.groundClearance + driving.cabinHeight).toFixed(4));
    const aspectRatioLtoW = Number((overallLength / driving.overallWidth).toFixed(3));
    const trackToWheelbaseRatio = Number(((driving.frontTrack + driving.rearTrack) / (2 * driving.wheelbase)).toFixed(3));

    const driven: DrivenDimensions = {
      overallLength,
      overallHeight,
      aspectRatioLtoW,
      trackToWheelbaseRatio
    };

    // 3. Compute 3D hardpoints in canonical SAE Coordinate Frame:
    // +X is forward (front bumper is +X)
    // +Y is left
    // +Z is up
    // Origin is at front axle center, ground level (z = 0)
    const zGround = 0.0;
    const zWheelCenter = driving.groundClearance + 0.33; // ~0.33m tire radius
    const xFrontAxle = 0.0;
    const xRearAxle = -driving.wheelbase; // Rear axle is behind front axle (-X)
    const xFrontTip = xFrontAxle + driving.frontOverhang;
    const xRearTip = xRearAxle - driving.rearOverhang;

    const yHalfFrontTrack = driving.frontTrack / 2.0;
    const yHalfRearTrack = driving.rearTrack / 2.0;

    const zFloor = driving.groundClearance;
    const zRoof = zFloor + driving.cabinHeight;

    const hardpoints: SolvedHardpoints = {
      frontAxleCenter: [xFrontAxle, 0.0, zWheelCenter],
      rearAxleCenter: [xRearAxle, 0.0, zWheelCenter],
      frontBumperTip: [xFrontTip, 0.0, zFloor + 0.12],
      rearBumperTip: [xRearTip, 0.0, zFloor + 0.18],
      cowlBase: [xFrontAxle - 0.35, 0.0, zFloor + driving.cabinHeight * 0.45],
      roofApex: [xFrontAxle - driving.wheelbase * 0.45, 0.0, zRoof],
      diffuserLeadingEdge: [xRearAxle + 0.30, 0.0, zFloor],
      frontLeftWheelCenter: [xFrontAxle, yHalfFrontTrack, zWheelCenter],
      frontRightWheelCenter: [xFrontAxle, -yHalfFrontTrack, zWheelCenter],
      rearLeftWheelCenter: [xRearAxle, yHalfRearTrack, zWheelCenter],
      rearRightWheelCenter: [xRearAxle, -yHalfRearTrack, zWheelCenter]
    };

    return { driven, hardpoints, conflicts };
  }
}
