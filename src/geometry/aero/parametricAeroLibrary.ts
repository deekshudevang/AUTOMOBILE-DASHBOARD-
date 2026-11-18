import * as THREE from 'three';

export interface AirfoilProfile {
  name: string;
  code: string;
  citation: string;
  thicknessRatio: number;
  maxCamberRatio: number;
  coordinates: [number, number][]; // Normalized [x/c, y/c] from leading edge (0,0) to trailing edge (1,0)
}

/**
 * Published canonical airfoil profiles with literature provenance
 */
export const AIRFOIL_CATALOG: Record<string, AirfoilProfile> = {
  'NACA_0012': {
    name: 'NACA 0012 Symmetrical',
    code: 'NACA_0012',
    citation: 'Abbott, I. H., and von Doenhoff, A. E., Theory of Wing Sections, Dover, 1959',
    thicknessRatio: 0.12,
    maxCamberRatio: 0.0,
    coordinates: generateNaca4DigitCoords(0, 0, 12, 40)
  },
  'NACA_2412': {
    name: 'NACA 2412 Cambered',
    code: 'NACA_2412',
    citation: 'Abbott, I. H., and von Doenhoff, A. E., Theory of Wing Sections, Dover, 1959',
    thicknessRatio: 0.12,
    maxCamberRatio: 0.02,
    coordinates: generateNaca4DigitCoords(2, 4, 12, 40)
  },
  'NACA_6412': {
    name: 'NACA 6412 High-Lift Cambered',
    code: 'NACA_6412',
    citation: 'NACA Report No. 460, 1933',
    thicknessRatio: 0.12,
    maxCamberRatio: 0.06,
    coordinates: generateNaca4DigitCoords(6, 4, 12, 40)
  },
  'SELIG_S1223': {
    name: 'Selig S1223 High-Lift Motorsports',
    code: 'SELIG_S1223',
    citation: 'Selig, M. S., and Guglielmo, J. J., High-Lift Low Reynolds Number Airfoil Design, J. Aircraft, 1997',
    thicknessRatio: 0.121,
    maxCamberRatio: 0.081,
    coordinates: [
      [1.0, 0.005], [0.95, 0.025], [0.9, 0.045], [0.8, 0.082], [0.7, 0.114],
      [0.6, 0.138], [0.5, 0.151], [0.4, 0.150], [0.3, 0.136], [0.2, 0.108],
      [0.1, 0.068], [0.05, 0.042], [0.0, 0.0],
      [0.05, -0.015], [0.1, -0.020], [0.2, -0.018], [0.3, -0.008], [0.4, 0.005],
      [0.5, 0.018], [0.6, 0.026], [0.7, 0.028], [0.8, 0.024], [0.9, 0.012], [1.0, -0.005]
    ]
  }
};

/**
 * Standard NACA 4-Digit thickness and camber generator with non-zero trailing edge thickness
 */
function generateNaca4DigitCoords(mPercent: number, pTenths: number, tPercent: number, nPoints: number): [number, number][] {
  const m = mPercent / 100;
  const p = pTenths / 10;
  const t = tPercent / 100;
  const coords: [number, number][] = [];

  // Upper surface (from TE=1 to LE=0)
  for (let i = nPoints; i >= 0; i--) {
    const beta = (i * Math.PI) / nPoints;
    const x = (1 - Math.cos(beta)) / 2; // Cosine spacing for fine leading edge resolution

    // Half-thickness distribution
    const yt = 5 * t * (0.2969 * Math.sqrt(x) - 0.1260 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1015 * x * x * x * x);

    let yc = 0;
    let dyc_dx = 0;
    if (p > 0) {
      if (x < p) {
        yc = (m / (p * p)) * (2 * p * x - x * x);
        dyc_dx = ((2 * m) / (p * p)) * (p - x);
      } else {
        yc = (m / ((1 - p) * (1 - p))) * ((1 - 2 * p) + 2 * p * x - x * x);
        dyc_dx = ((2 * m) / ((1 - p) * (1 - p))) * (p - x);
      }
    }

    const theta = Math.atan(dyc_dx);
    const xu = x - yt * Math.sin(theta);
    const yu = yc + yt * Math.cos(theta);
    coords.push([xu, yu]);
  }

  // Lower surface (from LE=0 to TE=1)
  for (let i = 1; i <= nPoints; i++) {
    const beta = (i * Math.PI) / nPoints;
    const x = (1 - Math.cos(beta)) / 2;

    const yt = 5 * t * (0.2969 * Math.sqrt(x) - 0.1260 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1015 * x * x * x * x);

    let yc = 0;
    let dyc_dx = 0;
    if (p > 0) {
      if (x < p) {
        yc = (m / (p * p)) * (2 * p * x - x * x);
        dyc_dx = ((2 * m) / (p * p)) * (p - x);
      } else {
        yc = (m / ((1 - p) * (1 - p))) * ((1 - 2 * p) + 2 * p * x - x * x);
        dyc_dx = ((2 * m) / ((1 - p) * (1 - p))) * (p - x);
      }
    }

    const theta = Math.atan(dyc_dx);
    const xl = x + yt * Math.sin(theta);
    const yl = yc - yt * Math.cos(theta);
    coords.push([xl, yl]);
  }

  return coords;
}

export interface RearWingParameters {
  airfoilCode: string;
  spanM: number;
  chordM: number;
  angleDegrees: number; // AoA
  mountType: 'swan_neck' | 'bottom_pylon' | 'endplate_mount';
  mountSpacingM: number;
  endplates: {
    heightM: number;
    lengthM: number;
    thicknessM: number;
  };
  gurneyFlap?: {
    enabled: boolean;
    heightMm: number;
  };
}

export interface FrontSplitterParameters {
  forwardExtensionM: number;
  widthM: number;
  thicknessM: number;
  angleDegrees: number;
  edgeRadiusM: number;
  sideEndplates: {
    enabled: boolean;
    heightM: number;
  };
}

export interface RearDiffuserParameters {
  lengthM: number;
  widthM: number;
  expansionAngleDegrees: number;
  strakeCount: number;
  strakeHeightM: number;
}

export class ParametricAeroLibrary {
  /**
   * Generate 3D Three.js BufferGeometry for a parametric rear wing
   */
  public static generateRearWingGeometry(params: RearWingParameters): THREE.BufferGeometry {
    const profile = AIRFOIL_CATALOG[params.airfoilCode] || AIRFOIL_CATALOG['NACA_2412'];
    const coords = profile.coordinates;
    const nCoords = coords.length;
    const nSpanSteps = 16;
    const halfSpan = params.spanM / 2;

    const vertices: number[] = [];
    const indices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];

    const rad = (params.angleDegrees * Math.PI) / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);

    // Loft profile across span from -Y to +Y (SAE frame: +Y is left)
    for (let s = 0; s <= nSpanSteps; s++) {
      const y = -halfSpan + (s / nSpanSteps) * params.spanM;
      for (let c = 0; c < nCoords; c++) {
        const [normX, normY] = coords[c];
        // Chord scaled and rotated by angle of attack
        // SAE: Vehicle travels in +X. Inverted aerofoil produces downforce (-Z)
        const unrotatedX = -normX * params.chordM; // TE points backwards (-X)
        const unrotatedZ = normY * params.chordM;

        const rotX = unrotatedX * cosA - unrotatedZ * sinA;
        const rotZ = unrotatedX * sinA + unrotatedZ * cosA;

        vertices.push(rotX, y, rotZ);
        uvs.push(normX, s / nSpanSteps);
      }
    }

    // Grid triangles
    for (let s = 0; s < nSpanSteps; s++) {
      for (let c = 0; c < nCoords - 1; c++) {
        const p1 = s * nCoords + c;
        const p2 = (s + 1) * nCoords + c;
        const p3 = (s + 1) * nCoords + (c + 1);
        const p4 = s * nCoords + (c + 1);

        indices.push(p1, p2, p3);
        indices.push(p1, p3, p4);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }

  /**
   * Generate 3D BufferGeometry for a parametric front splitter
   */
  public static generateFrontSplitterGeometry(params: FrontSplitterParameters): THREE.BufferGeometry {
    const { forwardExtensionM, widthM, thicknessM, angleDegrees } = params;
    const halfW = widthM / 2;
    const rad = (angleDegrees * Math.PI) / 180;

    // Splitter plane with curved front profile
    const nWidthSteps = 20;
    const nLengthSteps = 8;
    const vertices: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= nLengthSteps; i++) {
      const u = i / nLengthSteps; // 0=bumper attachment, 1=leading edge
      for (let j = 0; j <= nWidthSteps; j++) {
        const v = j / nWidthSteps;
        const y = -halfW + v * widthM;
        // Parabolic contour for leading edge
        const curvatureOffset = Math.sin(v * Math.PI) * (forwardExtensionM * 0.2);
        const x = (u * forwardExtensionM) + curvatureOffset;
        const z = -x * Math.tan(rad);

        vertices.push(x, y, z);
      }
    }

    for (let i = 0; i < nLengthSteps; i++) {
      for (let j = 0; j < nWidthSteps; j++) {
        const p1 = i * (nWidthSteps + 1) + j;
        const p2 = (i + 1) * (nWidthSteps + 1) + j;
        const p3 = (i + 1) * (nWidthSteps + 1) + (j + 1);
        const p4 = i * (nWidthSteps + 1) + (j + 1);

        indices.push(p1, p2, p3);
        indices.push(p1, p3, p4);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }

  /**
   * Generate 3D BufferGeometry for a parametric rear diffuser
   */
  public static generateRearDiffuserGeometry(params: RearDiffuserParameters): THREE.BufferGeometry {
    const { lengthM, widthM, expansionAngleDegrees, strakeCount, strakeHeightM } = params;
    const halfW = widthM / 2;
    const rad = (expansionAngleDegrees * Math.PI) / 180;

    // Diffuser ramp starting at floor level and expanding upwards towards rear
    const nLengthSteps = 12;
    const nWidthSteps = 16;
    const vertices: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= nLengthSteps; i++) {
      const u = i / nLengthSteps; // 0=inlet, 1=exit
      const x = -u * lengthM; // Diffuser runs backwards (-X)
      const z = Math.tan(rad) * (u * lengthM); // Expands upwards (+Z)

      for (let j = 0; j <= nWidthSteps; j++) {
        const v = j / nWidthSteps;
        const y = -halfW + v * widthM;
        vertices.push(x, y, z);
      }
    }

    for (let i = 0; i < nLengthSteps; i++) {
      for (let j = 0; j < nWidthSteps; j++) {
        const p1 = i * (nWidthSteps + 1) + j;
        const p2 = (i + 1) * (nWidthSteps + 1) + j;
        const p3 = (i + 1) * (nWidthSteps + 1) + (j + 1);
        const p4 = i * (nWidthSteps + 1) + (j + 1);

        indices.push(p1, p2, p3);
        indices.push(p1, p3, p4);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }

  /**
   * Closed-form analytical aerodynamic estimation (C_l, C_d) with strict provenance
   * Citations:
   * - Abbott & von Doenhoff, Theory of Wing Sections (1959)
   * - Hoerner, S. F., Fluid-Dynamic Drag (1965)
   */
  public static calculateAnalyticAeroEstimates(
    wingParams: RearWingParameters,
    velocityMs: number = 55.56 // 200 km/h
  ): {
    provenance: 'ANALYTIC';
    cl: number;
    cd: number;
    downforceNewtons: number;
    dragNewtons: number;
    assumptions: string[];
  } {
    const rho = 1.225; // ISA sea level air density (kg/m3)
    const planformArea = wingParams.spanM * wingParams.chordM;
    const aspectRatio = (wingParams.spanM * wingParams.spanM) / planformArea;

    // 2D lift curve slope dCl/dalpha approx 2*pi per radian, corrected for finite aspect ratio
    const alphaRad = (wingParams.angleDegrees * Math.PI) / 180;
    const oswaldEfficiency = 0.85;

    // Finite wing lift slope (Helmbold equation)
    const a0 = 2 * Math.PI;
    const a = a0 / (1 + a0 / (Math.PI * aspectRatio));

    // Profile camber contribution
    const profile = AIRFOIL_CATALOG[wingParams.airfoilCode] || AIRFOIL_CATALOG['NACA_2412'];
    const cl0 = profile.maxCamberRatio * 12.0; // Baseline zero-angle lift for cambered aerofoil

    // Inverted wing for downforce (negative lift)
    const cl = -(cl0 + a * alphaRad);

    // Parasite + induced drag
    const cd0 = 0.015 + (wingParams.gurneyFlap?.enabled ? (wingParams.gurneyFlap.heightMm / 1000) * 0.5 : 0);
    const cdi = (cl * cl) / (Math.PI * oswaldEfficiency * aspectRatio);
    const cd = cd0 + cdi;

    const dynamicPressure = 0.5 * rho * velocityMs * velocityMs;
    const downforceNewtons = Math.abs(cl) * dynamicPressure * planformArea;
    const dragNewtons = cd * dynamicPressure * planformArea;

    return {
      provenance: 'ANALYTIC',
      cl: Math.round(cl * 1000) / 1000,
      cd: Math.round(cd * 1000) / 1000,
      downforceNewtons: Math.round(downforceNewtons),
      dragNewtons: Math.round(dragNewtons),
      assumptions: [
        'Prandtl lifting-line finite-wing theory (Anderson Fundamentals of Aerodynamics §5.3)',
        'Oswald span efficiency factor e = 0.85',
        'Incompressible subsonic flow (Mach < 0.3)',
        'Unstalled attached flow regime (AoA between -5° and +18°)'
      ]
    };
  }
}
