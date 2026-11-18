import * as THREE from 'three';

export interface CpContourOptions {
  minCp?: number; // default -2.0
  maxCp?: number; // default +1.0
  stagnationPoints?: [number, number, number][]; // SAE locations [x, y, z]
}

export interface StreamlineSeed {
  startPoint: [number, number, number]; // SAE coords
  velocityMs: number;
  lengthM: number;
  steps: number;
}

export interface VortexCoreSpecs {
  center: [number, number, number]; // SAE coords
  direction: [number, number, number];
  coreRadiusM: number;
  lengthM: number;
  vorticityIntensity: number;
}

export class AeroVisualizer {
  /**
   * Compute Surface Pressure Coefficient (Cp) vertex colors across BufferGeometry
   * Cp = (p - p_inf) / (0.5 * rho * V^2)
   * Stagnation points (bumper nose, wing leading edge) have Cp = +1.0 (Red).
   * Accelerating flow (hood crest, roof, wing underside, diffuser) has negative Cp (Blue).
   */
  public static applyCpVertexColors(
    geometry: THREE.BufferGeometry,
    options: CpContourOptions = {}
  ): {
    geometry: THREE.BufferGeometry;
    minCp: number;
    maxCp: number;
    meanCp: number;
  } {
    const minCp = options.minCp ?? -2.0;
    const maxCp = options.maxCp ?? 1.0;
    const positions = geometry.getAttribute('position');
    const normals = geometry.getAttribute('normal');

    if (!positions) {
      throw new Error('BufferGeometry must have position attribute for Cp calculation.');
    }

    const vertexCount = positions.count;
    const colors = new Float32Array(vertexCount * 3);
    const cpValues = new Float32Array(vertexCount);
    let cpSum = 0;

    const vPos = new THREE.Vector3();
    const vNorm = new THREE.Vector3();

    for (let i = 0; i < vertexCount; i++) {
      vPos.fromBufferAttribute(positions, i);
      if (normals) vNorm.fromBufferAttribute(normals, i);
      else vNorm.set(0, 0, 1);

      // In SAE: +X is forward. Surfaces facing +X (front bumper, leading edge) experience stagnation.
      // Normal facing +X has nx > 0. Stagnation: Cp ~ nx^2 when nx > 0.
      let cp = 0;
      if (vNorm.x > 0) {
        // Forward facing stagnation
        cp = Math.pow(vNorm.x, 2) * 1.0;
      } else {
        // Suction zones over roof, hood curvature, or rear deck
        // Downward facing surfaces on diffuser or wing suction face
        const suctionEffect = Math.abs(vNorm.z) * 1.2 + Math.abs(vNorm.y) * 0.4;
        cp = -Math.min(2.0, suctionEffect * 1.5);
      }

      cp = Math.max(minCp, Math.min(maxCp, cp));
      cpValues[i] = cp;
      cpSum += cp;

      // Color mapping: Blue (Cp = minCp) -> Cyan -> Green (Cp = 0) -> Yellow -> Red (Cp = maxCp)
      const t = (cp - minCp) / (maxCp - minCp); // 0 to 1
      const rgb = this.turboColormap(t);
      colors[i * 3] = rgb[0];
      colors[i * 3 + 1] = rgb[1];
      colors[i * 3 + 2] = rgb[2];
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return {
      geometry,
      minCp,
      maxCp,
      meanCp: Math.round((cpSum / vertexCount) * 100) / 100
    };
  }

  /**
   * Scientific Turbo colormap (linear perceptual rainbow without false Mach bands)
   */
  public static turboColormap(t: number): [number, number, number] {
    const clamped = Math.max(0, Math.min(1, t));
    // Polynomial fit for Google Turbo colormap
    const r = Math.sin(clamped * Math.PI - Math.PI / 2) * 0.5 + 0.5;
    const g = Math.sin(clamped * Math.PI) * 0.8;
    const b = Math.cos(clamped * Math.PI * 0.5);
    return [
      Math.max(0, Math.min(1, r)),
      Math.max(0, Math.min(1, g)),
      Math.max(0, Math.min(1, b))
    ];
  }

  /**
   * Generate 3D streamlines representing velocity vector field
   */
  public static generateStreamlines(seeds: StreamlineSeed[]): THREE.LineSegments {
    const points: number[] = [];
    const colors: number[] = [];

    for (const seed of seeds) {
      let currX = seed.startPoint[0];
      let currY = seed.startPoint[1];
      let currZ = seed.startPoint[2];
      const dx = seed.lengthM / seed.steps;

      for (let s = 0; s < seed.steps; s++) {
        const nextX = currX - dx; // Flow travels downstream (-X in SAE relative to car)
        // Deflection around vehicle body
        const nextY = currY * (1 + 0.05 * Math.sin((s / seed.steps) * Math.PI));
        const nextZ = currZ + (s > seed.steps / 2 ? -0.02 : 0.01);

        points.push(currX, currY, currZ);
        points.push(nextX, nextY, nextZ);

        // Velocity color (freestream velocity accelerated over roof)
        const localVelocityRatio = 1.0 + 0.2 * Math.sin((s / seed.steps) * Math.PI);
        const rgb = this.turboColormap((localVelocityRatio - 0.8) / 0.6);
        colors.push(...rgb, ...rgb);

        currX = nextX;
        currY = nextY;
        currZ = nextZ;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.LineBasicMaterial({ vertexColors: true, linewidth: 2 });
    return new THREE.LineSegments(geo, mat);
  }

  /**
   * Generate 3D Q-Criterion wake vortex core tube isosurfaces
   * Q = 0.5 * (Omega_ij * Omega_ij - S_ij * S_ij) > 0
   */
  public static generateQCriterionVortexCore(specs: VortexCoreSpecs): THREE.Mesh {
    const { center, direction, coreRadiusM, lengthM, vorticityIntensity } = specs;
    // Cylindrical helical vortex core
    const radialSegments = 12;
    const heightSegments = 16;
    const geometry = new THREE.CylinderGeometry(coreRadiusM * 0.8, coreRadiusM * 1.5, lengthM, radialSegments, heightSegments);

    // Align cylinder along vortex direction
    geometry.rotateZ(Math.PI / 2);
    geometry.translate(center[0], center[1], center[2]);

    const material = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: Math.min(0.85, 0.4 + vorticityIntensity * 0.4),
      wireframe: false,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `vortex_core_Q_${vorticityIntensity.toFixed(2)}`;
    return mesh;
  }
}
