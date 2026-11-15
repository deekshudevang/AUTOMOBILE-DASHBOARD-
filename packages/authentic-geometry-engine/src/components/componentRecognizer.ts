import * as THREE from 'three';
import {
  RecognizedComponent,
  VehicleComponentHierarchy,
  ComponentCategory,
  SemanticComponentType
} from '../types';

/**
 * Phase 4: Vehicle Body Component Recognition Engine
 * Semantically tags and maps exterior bodywork, wheels, and interior cockpit hierarchies
 * from CAD, GLTF, FBX, and OBJ node trees without fabricating false geometry.
 */
export class ComponentRecognizer {
  /**
   * Analyzes a 3D model hierarchy and extracts classified automotive components
   */
  static recognize(root: THREE.Object3D): VehicleComponentHierarchy {
    const exterior: RecognizedComponent[] = [];
    const wheels: RecognizedComponent[] = [];
    const interior: RecognizedComponent[] = [];
    const unassigned: RecognizedComponent[] = [];

    let totalTriangles = 0;

    // Overall bounding box for spatial reference
    const totalBox = new THREE.Box3().setFromObject(root);
    const center = new THREE.Vector3();
    totalBox.getCenter(center);
    const size = new THREE.Vector3();
    totalBox.getSize(size);

    root.traverse(child => {
      if ((child as any).isMesh) {
        const mesh = child as THREE.Mesh;
        const geom = mesh.geometry;
        if (!geom) return;

        const posAttr = geom.getAttribute('position');
        const indexAttr = geom.getIndex();
        const vertexCount = posAttr ? posAttr.count : 0;
        const triCount = indexAttr ? indexAttr.count / 3 : vertexCount / 3;
        totalTriangles += triCount;

        const meshBox = new THREE.Box3().setFromObject(mesh);
        const meshCenter = new THREE.Vector3();
        meshBox.getCenter(meshCenter);

        const materialNames = this.getMaterialNames(mesh);
        const { category, semanticType } = this.classifyNode(mesh.name, meshCenter, meshBox, center, size);

        const comp: RecognizedComponent = {
          id: mesh.uuid,
          name: mesh.name || `component_${mesh.id}`,
          category,
          semanticType,
          objectRef: mesh,
          boundingBox: meshBox,
          triangleCount: Math.round(triCount),
          vertexCount,
          materialNames,
          isSeparated: true
        };

        if (category === 'exterior') exterior.push(comp);
        else if (category === 'wheels') wheels.push(comp);
        else if (category === 'interior') interior.push(comp);
        else unassigned.push(comp);
      }
    });

    return {
      exterior,
      wheels,
      interior,
      unassigned,
      totalComponents: exterior.length + wheels.length + interior.length + unassigned.length,
      totalTriangles: Math.round(totalTriangles)
    };
  }

  private static classifyNode(
    name: string,
    pos: THREE.Vector3,
    box: THREE.Box3,
    center: THREE.Vector3,
    totalSize: THREE.Vector3
  ): { category: ComponentCategory; semanticType: SemanticComponentType } {
    const n = name.toLowerCase();

    // 1. Explicit Interior Matching (check steering wheel & cockpit controls BEFORE road wheels)
    if (n.includes('steer') || n.includes('seat') || n.includes('interior') || n.includes('dash') || n.includes('console') || n.includes('gauge') || n.includes('cluster') || n.includes('cockpit') || n.includes('pedal')) {
      let semanticType: SemanticComponentType = 'generic_part';
      if (n.includes('seat')) semanticType = 'seats';
      else if (n.includes('steer')) semanticType = 'steering_wheel';
      else if (n.includes('dash')) semanticType = 'dashboard';
      else if (n.includes('console')) semanticType = 'center_console';
      else if (n.includes('cluster') || n.includes('gauge')) semanticType = 'instrument_cluster';
      else if (n.includes('door_panel')) semanticType = 'door_panels';

      return { category: 'interior', semanticType };
    }

    // 2. Explicit Road Wheel & Brake Matching
    if (n.includes('wheel') || n.includes('tyre') || n.includes('tire') || n.includes('rim') || n.includes('caliper') || n.includes('brake') || n.includes('rotor') || n.includes('hub')) {
      const isFront = pos.z > center.z;
      const isLeft = pos.x < center.x;

      let semanticType: SemanticComponentType = 'generic_part';
      if (n.includes('wheel_fl') || n.includes('front_left') || (n.includes('wheel') && isFront && isLeft)) semanticType = 'front_left_wheel';
      else if (n.includes('wheel_fr') || n.includes('front_right') || (n.includes('wheel') && isFront && !isLeft)) semanticType = 'front_right_wheel';
      else if (n.includes('wheel_rl') || n.includes('rear_left') || (n.includes('wheel') && !isFront && isLeft)) semanticType = 'rear_left_wheel';
      else if (n.includes('wheel_rr') || n.includes('rear_right') || (n.includes('wheel') && !isFront && !isLeft)) semanticType = 'rear_right_wheel';
      else if (n.includes('tyre') || n.includes('tire')) semanticType = 'tyres';
      else if (n.includes('rim')) semanticType = 'rims';
      else if (n.includes('caliper')) semanticType = 'brake_calipers';
      else if (n.includes('brake') || n.includes('disc') || n.includes('rotor')) semanticType = 'brakes';
      else if (n.includes('hub')) semanticType = 'wheel_hubs';

      return { category: 'wheels', semanticType };
    }

    // 3. Explicit Exterior Panels Matching
    if (n.includes('hood') || n.includes('bonnet')) {
      return { category: 'exterior', semanticType: 'hood' };
    }
    if (n.includes('bumper_f') || n.includes('front_bumper') || n.includes('fascia_front')) {
      return { category: 'exterior', semanticType: 'front_bumper' };
    }
    if (n.includes('bumper_r') || n.includes('rear_bumper') || n.includes('fascia_rear')) {
      return { category: 'exterior', semanticType: 'rear_bumper' };
    }
    if (n.includes('diffuser')) {
      return { category: 'exterior', semanticType: 'diffuser' };
    }
    if (n.includes('spoiler') || n.includes('wing')) {
      return { category: 'exterior', semanticType: 'spoiler' };
    }
    if (n.includes('grille') || n.includes('grill')) {
      return { category: 'exterior', semanticType: 'front_grille' };
    }
    if (n.includes('skirt')) {
      return { category: 'exterior', semanticType: 'side_skirts' };
    }
    if (n.includes('roof')) {
      return { category: 'exterior', semanticType: 'roof' };
    }
    if (n.includes('fender') || n.includes('quarter')) {
      const isFront = pos.z > center.z;
      return { category: 'exterior', semanticType: isFront ? 'front_fenders' : 'rear_quarter_panels' };
    }
    if (n.includes('door')) {
      const isFront = pos.z > center.z;
      return { category: 'exterior', semanticType: isFront ? 'front_doors' : 'rear_doors' };
    }
    if (n.includes('mirror')) {
      return { category: 'exterior', semanticType: 'side_mirrors' };
    }
    if (n.includes('headlight') || n.includes('light_front') || n.includes('headlamp')) {
      return { category: 'exterior', semanticType: 'headlights' };
    }
    if (n.includes('taillight') || n.includes('light_rear') || n.includes('taillamp')) {
      return { category: 'exterior', semanticType: 'taillights' };
    }
    if (n.includes('windshield') || n.includes('windscreen')) {
      return { category: 'exterior', semanticType: 'windshield' };
    }
    if (n.includes('glass') || n.includes('window')) {
      if (pos.z > center.z + 0.3) return { category: 'exterior', semanticType: 'windshield' };
      if (pos.z < center.z - 0.5) return { category: 'exterior', semanticType: 'rear_glass' };
      return { category: 'exterior', semanticType: 'windows' };
    }
    if (n.includes('body') || n.includes('chassis') || n.includes('monocoque') || n.includes('hull')) {
      return { category: 'exterior', semanticType: 'main_body_shell' };
    }

    // 4. Spatial Position Classification for Anonymous CAD Nodes (e.g. Solid_12)
    const relZ = (pos.z - center.z) / (totalSize.z * 0.5 || 1);
    const relY = (pos.y - center.y) / (totalSize.y * 0.5 || 1);

    if (relY < -0.4) {
      // Lower zone: wheels, suspension, or underbody
      if (Math.abs(pos.x - center.x) > totalSize.x * 0.35) {
        return { category: 'wheels', semanticType: 'wheel_hubs' };
      }
    }

    // Default to exterior main bodywork
    return { category: 'exterior', semanticType: 'main_body_shell' };
  }

  private static getMaterialNames(mesh: THREE.Mesh): string[] {
    if (!mesh.material) return [];
    if (Array.isArray(mesh.material)) {
      return mesh.material.map(m => m.name || m.type);
    }
    return [mesh.material.name || mesh.material.type];
  }
}
