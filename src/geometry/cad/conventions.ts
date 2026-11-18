import * as THREE from 'three';

/**
 * ISO 8855 / SAE Automotive Coordinate Frame Conventions
 * +X: Forward (towards front bumper)
 * +Y: Left / Port (towards driver side in LHD)
 * +Z: Upward (vertical, perpendicular to road surface)
 * Origin (0,0,0): Ground center below front axle centerline
 * Symmetry plane: Y = 0
 */
export const CAD_TOLERANCES = {
  MODELING_METERS: 1e-5,        // 0.01 mm
  SEWING_METERS: 1e-4,          // 0.1 mm
  LINEAR_DEFLECTION_METERS: 1e-3, // 1.0 mm for mesh tessellation
  ANGULAR_DEFLECTION_DEG: 15.0  // 15 deg max facet angle
} as const;

export class CoordinateConventions {
  /**
   * Converts an SAE coordinate (X forward, Y left, Z up) to Three.js WebGL frame (X right, Y up, Z backwards)
   */
  public static saeToThree(xSae: number, ySae: number, zSae: number): THREE.Vector3 {
    return new THREE.Vector3(
      -ySae, // Three.js X = -SAE Y (Right is +X)
       zSae, // Three.js Y =  SAE Z (Up is +Y)
      -xSae  // Three.js Z = -SAE X (Backwards is +Z)
    );
  }

  /**
   * Converts a Three.js WebGL coordinate back to canonical SAE frame
   */
  public static threeToSae(xThree: number, yThree: number, zThree: number): THREE.Vector3 {
    return new THREE.Vector3(
      -zThree, // SAE X = -Three.js Z (Forward is +X)
      -xThree, // SAE Y = -Three.js X (Left is +Y)
       yThree  // SAE Z =  Three.js Y (Up is +Z)
    );
  }

  /**
   * Converts an array of SAE points to a Three.js BufferAttribute position array
   */
  public static saePointsToThreeBuffer(points: Array<[number, number, number]>): Float32Array {
    const buffer = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      const [xSae, ySae, zSae] = points[i];
      buffer[i * 3 + 0] = -ySae;
      buffer[i * 3 + 1] =  zSae;
      buffer[i * 3 + 2] = -xSae;
    }
    return buffer;
  }
}
