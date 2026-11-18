import * as THREE from 'three';

export type DrivAerConfiguration = 'fastback' | 'notchback' | 'estate';

export interface DrivAerDimensions {
  lengthM: number;
  widthM: number;
  heightM: number;
  wheelbaseM: number;
  groundClearanceM: number;
  frontalAreaM2: number;
}

export const CANONICAL_DRIVAER_SPECS: DrivAerDimensions = {
  lengthM: 4.612,
  widthM: 1.802,
  heightM: 1.419,
  wheelbaseM: 2.786,
  groundClearanceM: 0.150,
  frontalAreaM2: 2.16
};

export const DRIVAER_LITERATURE_VALUES: Record<
  DrivAerConfiguration,
  {
    cdLit: number;
    citation: string;
    tolerancePercent: number;
  }
> = {
  fastback: {
    cdLit: 0.243,
    citation: 'Heft, A. I., Indinger, T., and Adams, N. A., "Introduction of a New Realistic Generic Car Model for Aerodynamic Investigation", SAE 2012-01-0168',
    tolerancePercent: 6.0
  },
  notchback: {
    cdLit: 0.254,
    citation: 'Heft, A. I., Indinger, T., and Adams, N. A., SAE 2012-01-0168',
    tolerancePercent: 6.0
  },
  estate: {
    cdLit: 0.282,
    citation: 'Heft, A. I., Indinger, T., and Adams, N. A., SAE 2012-01-0168',
    tolerancePercent: 6.0
  }
};

export class DrivAerBodyGenerator {
  /**
   * Procedural generator for standard DrivAer vehicle benchmark body
   */
  public static generateGeometry(
    config: DrivAerConfiguration = 'fastback',
    dims: DrivAerDimensions = CANONICAL_DRIVAER_SPECS
  ): THREE.BufferGeometry {
    const { lengthM, widthM, heightM, groundClearanceM } = dims;

    // Cross stations along X in SAE coordinates (+X forward)
    // Vehicle spans from -lengthM/2 to +lengthM/2
    const nStations = 24;
    const nRadial = 18;
    const halfW = widthM / 2;

    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    for (let i = 0; i <= nStations; i++) {
      const u = i / nStations; // 0=rear bumper, 1=front bumper
      const x = -lengthM / 2 + u * lengthM;

      // Profile height and width along station
      let stationH = heightM - groundClearanceM;
      let stationW = halfW;
      let zFloor = groundClearanceM;

      if (u > 0.85) {
        // Front bumper / nose round taper
        const frontFrac = (u - 0.85) / 0.15;
        stationH = (heightM * 0.55) * (1 - frontFrac * 0.4);
        stationW = halfW * (1 - frontFrac * 0.35);
      } else if (u > 0.65) {
        // Windshield and hood slope
        const hoodFrac = (u - 0.65) / 0.20;
        stationH = heightM * 0.75 - hoodFrac * (heightM * 0.20);
      } else if (u > 0.35) {
        // Roof line
        stationH = heightM;
      } else {
        // Rear greenhouse according to configuration
        const rearFrac = (0.35 - u) / 0.35;
        if (config === 'fastback') {
          // Smooth sweeping fastback slope down to deck
          stationH = heightM - rearFrac * (heightM * 0.40);
        } else if (config === 'notchback') {
          // Stepped rear window and boot lid
          stationH = rearFrac > 0.5 ? heightM * 0.65 : heightM - rearFrac * (heightM * 0.35);
        } else {
          // Estate / wagon roofline extending far back
          stationH = heightM - rearFrac * (heightM * 0.15);
        }
        stationW = halfW * (1 - rearFrac * 0.20);
      }

      // Generate elliptical cross-section ring at this station
      for (let j = 0; j <= nRadial; j++) {
        const phi = (j / nRadial) * 2 * Math.PI;
        // In SAE: X=forward, Y=left, Z=up
        const y = Math.sin(phi) * stationW;
        const z = zFloor + (Math.cos(phi) + 1) * 0.5 * (stationH - zFloor);

        vertices.push(x, y, z);
        uvs.push(u, j / nRadial);
      }
    }

    // Connect station rings with triangles
    for (let i = 0; i < nStations; i++) {
      for (let j = 0; j < nRadial; j++) {
        const p1 = i * (nRadial + 1) + j;
        const p2 = (i + 1) * (nRadial + 1) + j;
        const p3 = (i + 1) * (nRadial + 1) + (j + 1);
        const p4 = i * (nRadial + 1) + (j + 1);

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
   * Export DrivAer surface geometry to ASCII STL format
   */
  public static exportToSTL(geometry: THREE.BufferGeometry, solidName: string = 'drivaer_body'): string {
    const pos = geometry.getAttribute('position');
    const idx = geometry.getIndex();
    if (!pos || !idx) return `solid ${solidName}\nendsolid ${solidName}\n`;

    let out = `solid ${solidName}\n`;
    const triCount = idx.count / 3;

    for (let i = 0; i < triCount; i++) {
      const i0 = idx.getX(i * 3);
      const i1 = idx.getX(i * 3 + 1);
      const i2 = idx.getX(i * 3 + 2);

      const x0 = pos.getX(i0), y0 = pos.getY(i0), z0 = pos.getZ(i0);
      const x1 = pos.getX(i1), y1 = pos.getY(i1), z1 = pos.getZ(i1);
      const x2 = pos.getX(i2), y2 = pos.getY(i2), z2 = pos.getZ(i2);

      // Compute normal
      const ax = x1 - x0, ay = y1 - y0, az = z1 - z0;
      const bx = x2 - x0, by = y2 - y0, bz = z2 - z0;
      let nx = ay * bz - az * by;
      let ny = az * bx - ax * bz;
      let nz = ax * by - ay * bx;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      if (len > 0) {
        nx /= len; ny /= len; nz /= len;
      }

      out += `  facet normal ${nx.toFixed(6)} ${ny.toFixed(6)} ${nz.toFixed(6)}\n`;
      out += `    outer loop\n`;
      out += `      vertex ${x0.toFixed(6)} ${y0.toFixed(6)} ${z0.toFixed(6)}\n`;
      out += `      vertex ${x1.toFixed(6)} ${y1.toFixed(6)} ${z1.toFixed(6)}\n`;
      out += `      vertex ${x2.toFixed(6)} ${y2.toFixed(6)} ${z2.toFixed(6)}\n`;
      out += `    endloop\n`;
      out += `  endfacet\n`;
    }

    out += `endsolid ${solidName}\n`;
    return out;
  }
}
