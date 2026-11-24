import * as THREE from 'three';

/**
 * Procedural PBR Texture Generator
 * Generates seamless, zero-asset DataTextures for automotive clearcoat,
 * carbon fiber twill weave, metallic paint flakes, tire siping, and perforated leather.
 * Works identically in headless Node.js/Vitest and browser WebGL runtimes.
 */
export class ProceduralPbrTextures {
  private static orangePeelTex: THREE.DataTexture | null = null;
  private static carbonWeaveTex: THREE.DataTexture | null = null;
  private static metallicFlakeTex: THREE.DataTexture | null = null;
  private static tireTreadTex: THREE.DataTexture | null = null;
  private static perforatedLeatherTex: THREE.DataTexture | null = null;

  /**
   * Generates or returns cached 128x128 periodic orange peel normal map for automotive clearcoats.
   * Creates subtle, continuous surface slope variations simulating real urethane clearcoat flow.
   */
  public static getOrangePeelNormalMap(size = 128): THREE.DataTexture {
    if (this.orangePeelTex) return this.orangePeelTex;

    const data = new Uint8Array(size * size * 4);
    const kStrength = 0.022;

    for (let y = 0; y < size; y++) {
      const v = (y / size) * Math.PI * 2;
      for (let x = 0; x < size; x++) {
        const u = (x / size) * Math.PI * 2;

        // Multi-frequency harmonic surface derivative
        const dhdu =
          0.5 * 6 * Math.cos(6 * u) * Math.cos(6 * v) -
          0.3 * 12 * Math.sin(12 * u + 0.8) * Math.sin(12 * v + 0.4) +
          0.2 * 18 * Math.cos(18 * u + 1.5) * Math.cos(18 * v + 1.2);

        const dhdv =
          -0.5 * 6 * Math.sin(6 * u) * Math.sin(6 * v) +
          0.3 * 12 * Math.cos(12 * u + 0.8) * Math.cos(12 * v + 0.4) -
          0.2 * 18 * Math.sin(18 * u + 1.5) * Math.sin(18 * v + 1.2);

        // Compute tangent space normal
        let nx = -kStrength * dhdu;
        let ny = -kStrength * dhdv;
        let nz = 1.0;
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        nx /= len;
        ny /= len;
        nz /= len;

        const idx = (y * size + x) * 4;
        data[idx] = Math.round((nx * 0.5 + 0.5) * 255);
        data[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
        data[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
        data[idx + 3] = 255;
      }
    }

    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(16, 16);
    tex.needsUpdate = true;
    this.orangePeelTex = tex;
    return tex;
  }

  /**
   * Generates or returns cached 128x128 2x2 diagonal twill weave normal map for carbon fiber parts.
   */
  public static getCarbonWeaveNormalMap(size = 128): THREE.DataTexture {
    if (this.carbonWeaveTex) return this.carbonWeaveTex;

    const data = new Uint8Array(size * size * 4);
    const bundleWidth = 8; // 16 bundles per axis

    for (let y = 0; y < size; y++) {
      const bundleY = Math.floor(y / bundleWidth);
      const fracY = (y % bundleWidth) / bundleWidth; // [0, 1]

      for (let x = 0; x < size; x++) {
        const bundleX = Math.floor(x / bundleWidth);
        const fracX = (x % bundleWidth) / bundleWidth; // [0, 1]

        // 2x2 twill diagonal logic: (bundleX + bundleY) mod 4 < 2 -> warp on top, else weft on top
        const isWarpOnTop = (bundleX + bundleY) % 4 < 2;

        let nx = 0;
        let ny = 0;
        const strength = 0.55;

        if (isWarpOnTop) {
          // Horizontal fiber bundle: curvature across Y
          ny = -Math.sin((fracY - 0.5) * Math.PI) * strength;
          nx = (Math.random() - 0.5) * 0.05; // Micro fiber noise
        } else {
          // Vertical fiber bundle: curvature across X
          nx = -Math.sin((fracX - 0.5) * Math.PI) * strength;
          ny = (Math.random() - 0.5) * 0.05;
        }

        const nz = Math.sqrt(Math.max(0, 1.0 - (nx * nx + ny * ny)));
        const idx = (y * size + x) * 4;
        data[idx] = Math.round((nx * 0.5 + 0.5) * 255);
        data[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
        data[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
        data[idx + 3] = 255;
      }
    }

    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(32, 32);
    tex.needsUpdate = true;
    this.carbonWeaveTex = tex;
    return tex;
  }

  /**
   * Generates or returns cached 128x128 metallic flake normal perturbation map.
   * Simulates micro aluminum / mica platelets embedded in automotive basecoats.
   */
  public static getMetallicFlakeTexture(size = 128): THREE.DataTexture {
    if (this.metallicFlakeTex) return this.metallicFlakeTex;

    const data = new Uint8Array(size * size * 4);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Pseudo-random deterministic hash
        const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const rand = h - Math.floor(h);

        let nx = 0;
        let ny = 0;
        let nz = 1.0;

        if (rand > 0.65) {
          // Individual reflective flake platelet
          const theta = ((rand - 0.65) / 0.35) * (14.0 * (Math.PI / 180)); // +/- 14 deg tilt
          const phi = (rand * 6.28318) % (Math.PI * 2);
          nx = Math.sin(theta) * Math.cos(phi);
          ny = Math.sin(theta) * Math.sin(phi);
          nz = Math.cos(theta);
        }

        const idx = (y * size + x) * 4;
        data[idx] = Math.round((nx * 0.5 + 0.5) * 255);
        data[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
        data[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
        data[idx + 3] = 255;
      }
    }

    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(48, 48);
    tex.needsUpdate = true;
    this.metallicFlakeTex = tex;
    return tex;
  }

  /**
   * Generates or returns cached 128x128 tire rubber siped tread normal map.
   */
  public static getTireTreadNormalMap(size = 128): THREE.DataTexture {
    if (this.tireTreadTex) return this.tireTreadTex;

    const data = new Uint8Array(size * size * 4);

    for (let y = 0; y < size; y++) {
      const v = y / size;
      for (let x = 0; x < size; x++) {
        const u = x / size;

        let nx = 0;
        let ny = 0;

        // Circumferential main drainage grooves at u = 0.22, 0.50, 0.78
        const inGroove1 = Math.abs(u - 0.22) < 0.035;
        const inGroove2 = Math.abs(u - 0.50) < 0.040;
        const inGroove3 = Math.abs(u - 0.78) < 0.035;

        if (inGroove1) {
          nx = (u - 0.22) / 0.035;
        } else if (inGroove2) {
          nx = (u - 0.50) / 0.040;
        } else if (inGroove3) {
          nx = (u - 0.78) / 0.035;
        } else {
          // Lateral shoulder siping
          const sipeU = (u * 12 + v * 3) % 1.0;
          if (sipeU < 0.15) {
            ny = (sipeU - 0.075) / 0.075;
          }
        }

        const nz = Math.sqrt(Math.max(0.01, 1.0 - (nx * nx + ny * ny)));
        const idx = (y * size + x) * 4;
        data[idx] = Math.round((nx * 0.5 + 0.5) * 255);
        data[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
        data[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
        data[idx + 3] = 255;
      }
    }

    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 24);
    tex.needsUpdate = true;
    this.tireTreadTex = tex;
    return tex;
  }

  /**
   * Generates or returns cached 128x128 perforated leather dimple normal map for sport bucket seats.
   */
  public static getPerforatedLeatherNormalMap(size = 128): THREE.DataTexture {
    if (this.perforatedLeatherTex) return this.perforatedLeatherTex;

    const data = new Uint8Array(size * size * 4);
    const spacing = 16; // 8x8 holes
    const radius = 3.5;

    for (let y = 0; y < size; y++) {
      const cy = Math.floor(y / spacing) * spacing + spacing / 2;
      const dy = y - cy;

      for (let x = 0; x < size; x++) {
        // Stagger every second row
        const rowOffset = (Math.floor(y / spacing) % 2) * (spacing / 2);
        const cx = Math.floor((x - rowOffset) / spacing) * spacing + spacing / 2 + rowOffset;
        const dx = x - cx;

        const dist = Math.sqrt(dx * dx + dy * dy);
        let nx = 0;
        let ny = 0;
        let nz = 1.0;

        if (dist < radius) {
          // Spherical hole depression
          const rNorm = dist / radius;
          nx = -(dx / radius) * 0.8;
          ny = -(dy / radius) * 0.8;
          nz = Math.sqrt(Math.max(0.1, 1.0 - rNorm * rNorm));
        } else {
          // Subtle leather grain noise
          nx = (Math.random() - 0.5) * 0.12;
          ny = (Math.random() - 0.5) * 0.12;
          nz = Math.sqrt(Math.max(0.1, 1.0 - (nx * nx + ny * ny)));
        }

        const idx = (y * size + x) * 4;
        data[idx] = Math.round((nx * 0.5 + 0.5) * 255);
        data[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
        data[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
        data[idx + 3] = 255;
      }
    }

    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(24, 24);
    tex.needsUpdate = true;
    this.perforatedLeatherTex = tex;
    return tex;
  }

  // ==========================================
  // Factory Helper Methods
  // ==========================================

  public static createClearcoatPaintMaterial(
    color: string | number,
    finish: 'metallic' | 'gloss' | 'matte' | 'pearl' = 'metallic'
  ): THREE.MeshPhysicalMaterial {
    const isMetallic = finish === 'metallic';
    const isMatte = finish === 'matte';
    const isPearl = finish === 'pearl';

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      metalness: isMatte ? 0.15 : isMetallic ? 0.78 : isPearl ? 0.65 : 0.40,
      roughness: isMatte ? 0.62 : isMetallic ? 0.18 : 0.14,
      clearcoat: isMatte ? 0.0 : 1.0,
      clearcoatRoughness: isMatte ? 0.0 : 0.035,
      clearcoatNormalMap: isMatte ? null : this.getOrangePeelNormalMap(),
      clearcoatNormalScale: new THREE.Vector2(0.06, 0.06),
      normalMap: isMetallic ? this.getMetallicFlakeTexture() : null,
      normalScale: isMetallic ? new THREE.Vector2(0.08, 0.08) : new THREE.Vector2(0, 0),
      side: THREE.DoubleSide
    });

    return mat;
  }

  public static createCarbonFiberMaterial(color: string | number = '#15171a'): THREE.MeshPhysicalMaterial {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      metalness: 0.35,
      roughness: 0.38,
      clearcoat: 0.45,
      clearcoatRoughness: 0.12,
      normalMap: this.getCarbonWeaveNormalMap(),
      normalScale: new THREE.Vector2(0.35, 0.35),
      side: THREE.DoubleSide
    });

    return mat;
  }

  public static createGlassMaterial(
    color: string | number = '#0e1724',
    transmission = 0.85
  ): THREE.MeshPhysicalMaterial {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      transmission,
      transparent: true,
      opacity: 0.90,
      roughness: 0.02,
      ior: 1.52, // Automotive float glass
      thickness: 0.005,
      side: THREE.DoubleSide
    });
  }

  public static createHeadlightProjectorLensMaterial(): THREE.MeshPhysicalMaterial {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf0f8ff),
      transmission: 0.96,
      transparent: true,
      opacity: 0.95,
      roughness: 0.01,
      ior: 1.58, // Optical polycarbonate condensing lens
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      side: THREE.DoubleSide
    });
  }
}
