import * as THREE from 'three';
import { VehicleGeometryProfile, BodyStyle } from '../templates/geometryProfiles';
import { ComponentDefinition } from '@autoverse/shared-types';

export interface ComponentMetadata {
  id: string;
  name: string;
  type: string;
  compatibleBodyStyles: BodyStyle[];
  compatibleProfileIds?: string[];
  requiredAnchorPoint: string;
  mirrorable: boolean;
  materialSlot: string;
  triangleBudget: number;
}

export interface AttachmentAnchor {
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface AttachmentResult {
  success: boolean;
  componentId: string;
  anchorName: string;
  worldPosition?: [number, number, number];
  reasonRejected?: string;
}

/**
 * AssemblyGraph manages component snapping to named profile-derived anchor points.
 * Enforces component compatibility validation and eliminates magic number offsets.
 */
export class AssemblyGraph {
  private profile: VehicleGeometryProfile;
  private anchors: Map<string, AttachmentAnchor> = new Map();
  private attachedComponents: Map<string, { component: ComponentDefinition; metadata: ComponentMetadata; mesh: THREE.Object3D }> = new Map();
  private rootGroup: THREE.Group;

  constructor(profile: VehicleGeometryProfile) {
    this.profile = profile;
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = `assembly_graph_${profile.id}`;
    this.computeAnchors();
  }

  /**
   * Dynamically computes all named anchor points strictly from profile dimensions
   */
  private computeAnchors(): void {
    const p = this.profile;
    const frontAxleZ = p.wheelbase / 2;
    const rearAxleZ = -p.wheelbase / 2;
    const noseZ = frontAxleZ + p.frontOverhang;
    const tailZ = rearAxleZ - p.rearOverhang;

    // 1. Wheel Hub Anchors (Y exactly equals wheel radius so bottom of tyre rests on ground at Y = 0)
    this.anchors.set('mount_wheel_fl', {
      name: 'mount_wheel_fl',
      position: [-p.trackFront / 2, p.wheelRadiusFront, frontAxleZ],
      rotation: [0, 0, 0]
    });
    this.anchors.set('mount_wheel_fr', {
      name: 'mount_wheel_fr',
      position: [p.trackFront / 2, p.wheelRadiusFront, frontAxleZ],
      rotation: [0, 0, 0]
    });
    this.anchors.set('mount_wheel_rl', {
      name: 'mount_wheel_rl',
      position: [-p.trackRear / 2, p.wheelRadiusRear, rearAxleZ],
      rotation: [0, 0, 0]
    });
    this.anchors.set('mount_wheel_rr', {
      name: 'mount_wheel_rr',
      position: [p.trackRear / 2, p.wheelRadiusRear, rearAxleZ],
      rotation: [0, 0, 0]
    });

    // 2. Fascia & Bumper Anchors
    this.anchors.set('mount_bumper_f', {
      name: 'mount_bumper_f',
      position: [0, p.groundClearance + 0.22, noseZ - 0.05],
      rotation: [0, 0, 0]
    });
    this.anchors.set('mount_bumper_r', {
      name: 'mount_bumper_r',
      position: [0, p.groundClearance + 0.24, tailZ + 0.06],
      rotation: [0, Math.PI, 0]
    });

    // 3. Body Panel Anchors
    this.anchors.set('mount_bonnet', {
      name: 'mount_bonnet',
      position: [0, p.beltlineHeight * 0.95, frontAxleZ + (p.frontOverhang * 0.35)],
      rotation: [0, 0, 0]
    });
    this.anchors.set('mount_roof', {
      name: 'mount_roof',
      position: [0, p.roofHeight, p.roofPeakX],
      rotation: [0, 0, 0]
    });
    this.anchors.set('mount_wing', {
      name: 'mount_wing',
      position: [0, p.beltlineHeight + 0.06, tailZ + 0.25],
      rotation: [0, 0, 0]
    });
    this.anchors.set('mount_exhaust', {
      name: 'mount_exhaust',
      position: [0, p.groundClearance + 0.12, tailZ + 0.02],
      rotation: [0, Math.PI, 0]
    });

    // 4. Cockpit & Interior Anchors
    this.anchors.set('mount_seat_driver', {
      name: 'mount_seat_driver',
      position: [-p.trackFront * 0.22, p.groundClearance + 0.25, 0],
      rotation: [0, 0, 0]
    });
    this.anchors.set('mount_seat_passenger', {
      name: 'mount_seat_passenger',
      position: [p.trackFront * 0.22, p.groundClearance + 0.25, 0],
      rotation: [0, 0, 0]
    });
    this.anchors.set('mount_dashboard', {
      name: 'mount_dashboard',
      position: [0, p.beltlineHeight * 0.82, frontAxleZ * 0.45],
      rotation: [0, 0, 0]
    });
    this.anchors.set('mount_steering', {
      name: 'mount_steering',
      position: [-p.trackFront * 0.22, p.beltlineHeight * 0.80, frontAxleZ * 0.35],
      rotation: [-0.3, 0, 0]
    });

    // 5. License Plates
    this.anchors.set('mount_plate_f', {
      name: 'mount_plate_f',
      position: [0, p.groundClearance + 0.16, noseZ + 0.01],
      rotation: [0, 0, 0]
    });
    this.anchors.set('mount_plate_r', {
      name: 'mount_plate_r',
      position: [0, p.groundClearance + 0.32, tailZ - 0.01],
      rotation: [0, Math.PI, 0]
    });
  }

  getAnchor(name: string): AttachmentAnchor | undefined {
    return this.anchors.get(name);
  }

  listAnchors(): AttachmentAnchor[] {
    return Array.from(this.anchors.values());
  }

  /**
   * Snaps a component mesh to its named profile anchor after verifying compatibility
   */
  attachComponent(
    component: ComponentDefinition,
    metadata: ComponentMetadata,
    mesh: THREE.Object3D
  ): AttachmentResult {
    // 1. Compatibility Check: Body Style
    if (metadata.compatibleBodyStyles.length > 0 && !metadata.compatibleBodyStyles.includes(this.profile.bodyStyle)) {
      return {
        success: false,
        componentId: component.id,
        anchorName: metadata.requiredAnchorPoint,
        reasonRejected: `Incompatible body style: Component "${metadata.name}" is designed for [${metadata.compatibleBodyStyles.join(', ')}], but current vehicle profile is "${this.profile.bodyStyle}".`
      };
    }

    // 2. Compatibility Check: Specific Profile IDs
    if (metadata.compatibleProfileIds && metadata.compatibleProfileIds.length > 0 && !metadata.compatibleProfileIds.includes(this.profile.id)) {
      return {
        success: false,
        componentId: component.id,
        anchorName: metadata.requiredAnchorPoint,
        reasonRejected: `Incompatible profile: Component "${metadata.name}" does not support profile "${this.profile.id}".`
      };
    }

    // 3. Anchor existence check
    const anchor = this.anchors.get(metadata.requiredAnchorPoint);
    if (!anchor) {
      return {
        success: false,
        componentId: component.id,
        anchorName: metadata.requiredAnchorPoint,
        reasonRejected: `Anchor point "${metadata.requiredAnchorPoint}" does not exist in geometry profile "${this.profile.id}".`
      };
    }

    // Position mesh at named anchor
    mesh.position.set(...anchor.position);
    mesh.rotation.set(...anchor.rotation);
    this.rootGroup.add(mesh);

    this.attachedComponents.set(component.id, { component, metadata, mesh });

    return {
      success: true,
      componentId: component.id,
      anchorName: anchor.name,
      worldPosition: anchor.position
    };
  }

  getRootGroup(): THREE.Group {
    return this.rootGroup;
  }
}
