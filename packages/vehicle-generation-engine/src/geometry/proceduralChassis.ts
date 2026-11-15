import * as THREE from 'three';
import { VehicleSpecification, ComponentDefinition } from '@autoverse/shared-types';
import {
  VehicleGeometryProfile,
  BodyStyle,
  ARCHETYPE_TEMPLATES,
  GeometryProfileRepository
} from '../templates/geometryProfiles';
import { CrossSectionGenerator } from './crossSectionGenerator';
import { SurfaceLofter } from './surfaceLofter';
import { PanelSeparator } from './panelSeparator';
import { WheelGenerator } from './wheelGenerator';
import { AssemblyGraph } from '../assembly/assemblyGraph';

export interface ProceduralMeshResult {
  group: THREE.Group;
  profile: VehicleGeometryProfile;
  components: ComponentDefinition[];
  triangleCount: number;
  vertexCount: number;
  assemblyGraph: AssemblyGraph;
}

/**
 * Procedural Automotive Geometry Generator
 * Conforms to Non-Negotiable Rules & Phases 2-6:
 * - NEVER presents primitive boxes as car geometry.
 * - Lofts continuous curved surfaces through >= 24 cross-section stations.
 * - Integrates wheel arch cutouts and lip flares into body topology.
 * - Generates separate panels with realistic shut-line gaps (3mm scale).
 * - Generates toroidal radial tyres and stepped multi-spoke rims.
 * - Enforces mandatory approximation banner.
 */
export class ProceduralChassisGenerator {
  private static profileRepo = new GeometryProfileRepository();

  /**
   * Resolves a category string or profile into a valid VehicleGeometryProfile
   */
  static resolveProfile(input?: string | VehicleGeometryProfile): VehicleGeometryProfile {
    if (typeof input === 'object' && input.id && input.wheelbase) {
      return input;
    }

    const cat = String(input || 'coupe').toLowerCase();
    if (cat.includes('suv') || cat.includes('offroad')) return ARCHETYPE_TEMPLATES.suv;
    if (cat.includes('super') || cat.includes('hyper')) return ARCHETYPE_TEMPLATES.supercar;
    if (cat.includes('sedan') || cat.includes('saloon')) return ARCHETYPE_TEMPLATES.sedan;
    if (cat.includes('muscle')) return ARCHETYPE_TEMPLATES.muscle_car;
    if (cat.includes('truck') || cat.includes('pickup')) return ARCHETYPE_TEMPLATES.pickup;
    if (cat.includes('sport') || cat.includes('track') || cat.includes('tuner')) return ARCHETYPE_TEMPLATES.sports_car;

    return ARCHETYPE_TEMPLATES.coupe;
  }

  /**
   * Generates a stepped multi-piece alloy rim using THREE.LatheGeometry
   */
  static generateLatheRim(radius: number = 0.26, width: number = 0.14, segments: number = 32): THREE.BufferGeometry {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.04, -width / 2));
    points.push(new THREE.Vector2(0.08, -width / 2 + 0.02));
    points.push(new THREE.Vector2(0.12, -width / 4));
    points.push(new THREE.Vector2(0.18, 0));
    points.push(new THREE.Vector2(radius * 0.75, width / 4));
    points.push(new THREE.Vector2(radius * 0.9, width / 2 - 0.015));
    points.push(new THREE.Vector2(radius, width / 2));
    points.push(new THREE.Vector2(radius + 0.01, width / 2 - 0.01));

    const geometry = new THREE.LatheGeometry(points, segments);
    geometry.computeVertexNormals();
    return geometry;
  }

  /**
   * Generates an aerodynamic front splitter using beveled THREE.ExtrudeGeometry
   */
  static generateAeroSplitter(width: number = 1.78, depth: number = 0.45, thickness: number = 0.04): THREE.BufferGeometry {
    const shape = new THREE.Shape();
    const hw = width / 2;
    shape.moveTo(-hw, 0);
    shape.lineTo(-hw + 0.08, depth * 0.6);
    shape.quadraticCurveTo(0, depth, hw - 0.08, depth * 0.6);
    shape.lineTo(hw, 0);
    shape.quadraticCurveTo(0, -0.05, -hw, 0);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      steps: 2,
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 3
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.computeVertexNormals();
    return geometry;
  }

  /**
   * Generates a curved GT Downforce Wing blade using beveled extrusion
   */
  static generateWingBlade(span: number = 1.72, chord: number = 0.32, camber: number = 0.04): THREE.BufferGeometry {
    const shape = new THREE.Shape();
    const hc = chord / 2;
    shape.moveTo(-hc, 0);
    shape.quadraticCurveTo(0, camber, hc, 0.01);
    shape.lineTo(hc, -0.01);
    shape.quadraticCurveTo(0, -camber * 0.3, -hc, 0);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      steps: 4,
      depth: span,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.015,
      bevelSegments: 4
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.rotateY(Math.PI / 2);
    geometry.computeVertexNormals();
    return geometry;
  }

  /**
   * Generates full parametric vehicle assembly (Lofted monocoque, separate panels, 4 wheels, fascias)
   */
  static generateSculptedBody(
    categoryOrProfile: string | VehicleGeometryProfile = 'coupe',
    bodyColor: string | number = 0x00EAFF,
    secondaryColor: string | number = 0x111317,
    wireframe: boolean = false,
    options?: {
      wheelColor?: string | number;
      includeWheels?: boolean;
      camberDeg?: number;
      steerDeg?: number;
    }
  ): THREE.Group {
    const profile = this.resolveProfile(categoryOrProfile);
    const root = new THREE.Group();
    root.name = `parametric_chassis_${profile.bodyStyle}`;

    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: typeof bodyColor === 'string' ? new THREE.Color(bodyColor) : bodyColor,
      roughness: 0.18,
      metalness: 0.88,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      wireframe
    });

    const trimMat = new THREE.MeshStandardMaterial({
      color: typeof secondaryColor === 'string' ? new THREE.Color(secondaryColor) : secondaryColor,
      roughness: 0.35,
      metalness: 0.85,
      wireframe
    });

    // 1. LOFTED MONOCOQUE BODY SHELL (>= 28 cross-section stations with wheel arches)
    const csGen = new CrossSectionGenerator(profile);
    const stations = csGen.generateAllStations(28);
    const loftResult = SurfaceLofter.loftStations(stations);

    const mainBodyMesh = new THREE.Mesh(loftResult.geometry, bodyMat);
    mainBodyMesh.name = "mesh_lofted_monocoque";
    mainBodyMesh.castShadow = true;
    mainBodyMesh.receiveShadow = true;
    root.add(mainBodyMesh);

    // 2. DISCRETE BODY PANELS & FASCIAS (Bonnet, Grille, Bumper, Diffuser, Doors, Skirts)
    const panelResult = PanelSeparator.generatePanels(profile, bodyMat, trimMat);
    root.add(panelResult.group);

    // 3. AERODYNAMIC GT DOWNFORCE WING
    const wingGeo = this.generateWingBlade(profile.overallWidth * 0.88, 0.28, 0.035);
    const wingMesh = new THREE.Mesh(wingGeo, trimMat);
    wingMesh.name = "mesh_gt_wing";
    const tailZ = -profile.wheelbase / 2 - profile.rearOverhang;
    wingMesh.position.set(0, profile.beltlineHeight + 0.18, tailZ + 0.22);
    wingMesh.castShadow = true;
    root.add(wingMesh);

    // Wing Uprights
    [-0.42, 0.42].forEach(wx => {
      const pGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.28, 12);
      const pMesh = new THREE.Mesh(pGeo, trimMat);
      pMesh.position.set(wx, profile.beltlineHeight + 0.06, tailZ + 0.20);
      root.add(pMesh);
    });

    // 4. FOUR RADIAL WHEELS WITH TOROIDAL TYRES & VENTED BRAKES
    if (options?.includeWheels !== false) {
      const frontAxleZ = profile.wheelbase / 2;
      const rearAxleZ = -profile.wheelbase / 2;
      const tf = profile.trackFront / 2;
      const tr = profile.trackRear / 2;
      const rimColor = options?.wheelColor ?? 0xE2E8F0;
      const frontCamber = options?.camberDeg ?? -0.03;
      const rearCamber = (options?.camberDeg ?? -0.03) - 0.01;

      // Front-Left Wheel
      const wheelFL = WheelGenerator.generateWheel({
        wheelRadius: profile.wheelRadiusFront,
        tyreWidth: profile.tyreSectionWidth,
        camberDeg: frontCamber,
        steerDeg: options?.steerDeg ?? 0,
        isRightSide: false,
        rimColorHex: rimColor
      });
      wheelFL.group.position.set(-tf, profile.wheelRadiusFront, frontAxleZ);
      root.add(wheelFL.group);

      // Front-Right Wheel
      const wheelFR = WheelGenerator.generateWheel({
        wheelRadius: profile.wheelRadiusFront,
        tyreWidth: profile.tyreSectionWidth,
        camberDeg: frontCamber,
        steerDeg: options?.steerDeg ?? 0,
        isRightSide: true,
        rimColorHex: rimColor
      });
      wheelFR.group.position.set(tf, profile.wheelRadiusFront, frontAxleZ);
      root.add(wheelFR.group);

      // Rear-Left Wheel
      const wheelRL = WheelGenerator.generateWheel({
        wheelRadius: profile.wheelRadiusRear,
        tyreWidth: profile.tyreSectionWidth * 1.08, // Wider rear track tyres
        camberDeg: rearCamber,
        isRightSide: false,
        rimColorHex: rimColor
      });
      wheelRL.group.position.set(-tr, profile.wheelRadiusRear, rearAxleZ);
      root.add(wheelRL.group);

      // Rear-Right Wheel
      const wheelRR = WheelGenerator.generateWheel({
        wheelRadius: profile.wheelRadiusRear,
        tyreWidth: profile.tyreSectionWidth * 1.08,
        camberDeg: rearCamber,
        isRightSide: true,
        rimColorHex: rimColor
      });
      wheelRR.group.position.set(tr, profile.wheelRadiusRear, rearAxleZ);
      root.add(wheelRR.group);
    }

    // 5. MANDATORY NON-NEGOTIABLE APPROXIMATION USER DATA TAG
    root.userData = {
      isApproximateProcedural: true,
      approximationLabel: 'APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY',
      bodyStyle: profile.bodyStyle,
      profileId: profile.id,
      dimensions: {
        length: profile.overallLength,
        width: profile.overallWidth,
        height: profile.overallHeight,
        wheelbase: profile.wheelbase
      }
    };

    return root;
  }
}
