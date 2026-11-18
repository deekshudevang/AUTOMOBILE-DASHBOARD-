import * as THREE from 'three';
import { ReferenceImagePlane } from '../../reference/referenceVehicleLibrary';

export interface ViewportPlaneTransform {
  position: [number, number, number]; // SAE [x, y, z] in meters
  rotation: [number, number, number]; // Euler angles [rx, ry, rz]
  planeWidthM: number;
  planeHeightM: number;
  scaleTicks: {
    intervalM: number;
    tickCount: number;
    label: string;
  };
}

export class CalibratedPlaneManager {
  /**
   * Compute 3D world positioning and physical dimensions for orthographic image planes
   * aligned with SAE vehicle coordinate frame:
   * +X = forward, +Y = left, +Z = up
   */
  public static calculatePlaneTransform(
    plane: ReferenceImagePlane,
    vehicleDimensions: { lengthM: number; widthM: number; heightM: number; groundClearanceM: number }
  ): ViewportPlaneTransform {
    const { lengthM, widthM, heightM, groundClearanceM } = vehicleDimensions;

    switch (plane.view) {
      case 'left':
        // Plane positioned on right side facing left (-Y looking towards +Y)
        return {
          position: [0, -widthM / 2 - 0.2, heightM / 2],
          rotation: [Math.PI / 2, 0, 0],
          planeWidthM: lengthM * 1.15,
          planeHeightM: heightM * 1.15,
          scaleTicks: {
            intervalM: 1.0,
            tickCount: Math.ceil(lengthM),
            label: '1m SAE X-Axis Grid'
          }
        };

      case 'right':
        // Plane positioned on left side facing right (+Y looking towards -Y)
        return {
          position: [0, widthM / 2 + 0.2, heightM / 2],
          rotation: [-Math.PI / 2, 0, Math.PI],
          planeWidthM: lengthM * 1.15,
          planeHeightM: heightM * 1.15,
          scaleTicks: {
            intervalM: 1.0,
            tickCount: Math.ceil(lengthM),
            label: '1m SAE X-Axis Grid'
          }
        };

      case 'front':
        // Plane positioned ahead of vehicle (+X facing backwards towards origin)
        return {
          position: [lengthM / 2 + 0.2, 0, heightM / 2],
          rotation: [0, Math.PI / 2, 0],
          planeWidthM: widthM * 1.2,
          planeHeightM: heightM * 1.2,
          scaleTicks: {
            intervalM: 0.5,
            tickCount: Math.ceil(widthM * 2),
            label: '0.5m SAE Y-Axis Grid'
          }
        };

      case 'rear':
        // Plane positioned behind vehicle (-X facing forward towards origin)
        return {
          position: [-lengthM / 2 - 0.2, 0, heightM / 2],
          rotation: [0, -Math.PI / 2, 0],
          planeWidthM: widthM * 1.2,
          planeHeightM: heightM * 1.2,
          scaleTicks: {
            intervalM: 0.5,
            tickCount: Math.ceil(widthM * 2),
            label: '0.5m SAE Y-Axis Grid'
          }
        };

      case 'top':
      default:
        // Plane positioned above vehicle (+Z looking down)
        return {
          position: [0, 0, heightM + 0.2],
          rotation: [0, 0, 0],
          planeWidthM: lengthM * 1.15,
          planeHeightM: widthM * 1.2,
          scaleTicks: {
            intervalM: 1.0,
            tickCount: Math.ceil(lengthM),
            label: '1m SAE Top Plan Grid'
          }
        };
    }
  }

  /**
   * Create Three.js PlaneMesh with calibrated shader material and opacity
   */
  public static createCalibratedPlaneMesh(
    plane: ReferenceImagePlane,
    transform: ViewportPlaneTransform,
    texture?: THREE.Texture
  ): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(transform.planeWidthM, transform.planeHeightM);

    const material = new THREE.MeshBasicMaterial({
      map: texture || null,
      color: texture ? 0xffffff : 0x334155,
      transparent: true,
      opacity: plane.opacity,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `ref_plane_${plane.view}`;
    // SAE to Three.js coordinate mapping: x3D = -ySAE, y3D = zSAE, z3D = -xSAE
    mesh.position.set(-transform.position[1], transform.position[2], -transform.position[0]);
    mesh.visible = plane.visible;

    return mesh;
  }
}
