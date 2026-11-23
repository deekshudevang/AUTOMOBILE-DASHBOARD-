import * as THREE from 'three';
import {
  VehicleSchema2,
  ComponentOverride,
  VehicleComponentDef,
  WheelComponentSpec,
  MaterialDef
} from '@autoverse/shared-types';
import { WheelGenerator } from './wheelGenerator';
import { CrossCarPartSwapper } from './crossCarPartSwapper';

export interface AssemblyOptions {
  componentOverrides?: Record<string, ComponentOverride>;
  selectedComponentId?: string | null;
  wireframe?: boolean;
  onComponentClick?: (componentId: string) => void;
}

/**
 * EditableVehicleAssembler
 * Production Three.js builder for AutoVerse Schema 2.0 vehicles.
 * Generates discrete, individually selectable and modifiable 3D components:
 * - Body Panels (bumpers, hood, roof, doors, fenders, quarter panels, skirts, grille)
 * - Aerodynamics (splitter, wing/spoiler, endplates, diffuser fins)
 * - Lighting (projector headlamps, full-width taillight bar)
 * - Glass (windshield, rear glass, side windows)
 * - Independent 4-Wheel Assemblies (tyre, rim, spokes, brake disc, caliper)
 * - Exhaust Outlets
 * - Interior (cockpit dash, steering wheel, racing bucket seats)
 */
export class EditableVehicleAssembler {
  public static build(
    spec: VehicleSchema2,
    options?: AssemblyOptions
  ): THREE.Group {
    const root = new THREE.Group();
    root.name = `vehicle_${spec.vehicle.id}`;

    const overrides = options?.componentOverrides || {};
    const selectedId = options?.selectedComponentId || null;

    // 1. Resolve PBR Materials Map
    const materialsMap = this.buildMaterialsMap(spec.materials, overrides, options?.wireframe);

    // 2. Build Monocoque Body Shell (if cross sections exist)
    const hasLoftedShell = !!(spec.bodyGeometry?.crossSections && spec.bodyGeometry.crossSections.length >= 2);
    if (hasLoftedShell) {
      const bodyShellMesh = this.buildLoftedBodyShell(spec, materialsMap, overrides);
      bodyShellMesh.name = 'component_body_shell';
      root.add(bodyShellMesh);
    }

    // 3. Build Discrete Components
    for (const compDef of spec.components) {
      const override = overrides[compDef.id];

      // If hidden by user, skip adding to scene
      if (override?.visible === false) {
        continue;
      }

      const compMesh = this.buildSingleComponent(
        compDef,
        spec,
        materialsMap,
        override,
        compDef.id === selectedId
      );

      if (compMesh) {
        root.add(compMesh);
      }
    }

    // 4. Attach Metadata
    root.userData = {
      isSchema2Vehicle: true,
      vehicleId: spec.vehicle.id,
      manufacturer: spec.vehicle.manufacturer,
      model: spec.vehicle.model,
      generation: spec.vehicle.generation,
      year: spec.vehicle.year,
      category: spec.vehicle.category,
      dimensions: spec.dimensions,
      accuracyClass: spec.validation?.accuracyClass || 'D_APPROXIMATE',
      accuracyLabel: 'APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY',
      componentCount: spec.components.length
    };

    return root;
  }

  /**
   * Resolves PBR Material Definitions
   */
  private static buildMaterialsMap(
    materialDefs: MaterialDef[],
    overrides: Record<string, ComponentOverride>,
    wireframe: boolean = false
  ): Map<string, THREE.Material> {
    const map = new Map<string, THREE.Material>();

    for (const m of materialDefs) {
      let mat: THREE.Material;
      const color = new THREE.Color(m.color);

      switch (m.type) {
        case 'paint_metallic':
          mat = new THREE.MeshPhysicalMaterial({
            color,
            metalness: m.metalness ?? 0.75,
            roughness: m.roughness ?? 0.22,
            clearcoat: m.clearcoat ?? 1.0,
            clearcoatRoughness: m.clearcoatRoughness ?? 0.08,
            wireframe
          });
          break;
        case 'paint_gloss':
          mat = new THREE.MeshPhysicalMaterial({
            color,
            metalness: m.metalness ?? 0.45,
            roughness: m.roughness ?? 0.20,
            clearcoat: m.clearcoat ?? 0.90,
            clearcoatRoughness: 0.10,
            wireframe
          });
          break;
        case 'paint_matte':
          mat = new THREE.MeshStandardMaterial({
            color,
            metalness: m.metalness ?? 0.20,
            roughness: m.roughness ?? 0.65,
            wireframe
          });
          break;
        case 'carbon_fiber':
        case 'forged_carbon':
          mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(m.color || '#18181b'),
            metalness: m.metalness ?? 0.35,
            roughness: m.roughness ?? 0.42,
            wireframe
          });
          break;
        case 'chrome':
        case 'alloy':
          mat = new THREE.MeshStandardMaterial({
            color,
            metalness: m.metalness ?? 0.92,
            roughness: m.roughness ?? 0.15,
            wireframe
          });
          break;
        case 'glass':
          mat = new THREE.MeshPhysicalMaterial({
            color,
            metalness: 0.05,
            roughness: 0.05,
            transmission: m.transmission ?? 0.75,
            transparent: true,
            opacity: 0.85,
            wireframe
          });
          break;
        case 'emissive_led':
          mat = new THREE.MeshStandardMaterial({
            color,
            emissive: new THREE.Color(m.emissive || m.color),
            emissiveIntensity: m.emissiveIntensity ?? 1.5,
            roughness: 0.1,
            wireframe
          });
          break;
        default:
          mat = new THREE.MeshStandardMaterial({
            color,
            metalness: m.metalness ?? 0.3,
            roughness: m.roughness ?? 0.5,
            wireframe
          });
          break;
      }

      mat.name = m.id;
      map.set(m.id, mat);
    }

    return map;
  }

  /**
   * Constructs an individual editable component object with transforms, dimensions, and selection metadata
   */
  private static buildSingleComponent(
    def: VehicleComponentDef,
    spec: VehicleSchema2,
    materialsMap: Map<string, THREE.Material>,
    override?: ComponentOverride,
    isSelected: boolean = false
  ): THREE.Object3D | null {
    let baseMat = materialsMap.get(override?.materialRef || def.materialRef) || materialsMap.get('body_paint');
    if (!baseMat) {
      baseMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    }

    // Clone material if custom color or finish is applied on this component
    let mat = baseMat;
    if (override?.customColorHex || override?.materialFinish) {
      mat = baseMat.clone();
      if (override.customColorHex && 'color' in mat) {
        (mat as any).color = new THREE.Color(override.customColorHex);
      }
      if (override.materialFinish) {
        if (override.materialFinish === 'carbon_fiber') {
          (mat as any).color = new THREE.Color('#18181b');
          (mat as any).roughness = 0.42;
          (mat as any).metalness = 0.35;
        } else if (override.materialFinish === 'chrome') {
          (mat as any).color = new THREE.Color('#f8fafc');
          (mat as any).roughness = 0.04;
          (mat as any).metalness = 0.98;
        }
      }
    }

    // Highlight selected component with cyan emissive glow
    if (isSelected) {
      const selectedMat = (mat as THREE.MeshStandardMaterial).clone();
      selectedMat.emissive = new THREE.Color(0x00f0ff);
      selectedMat.emissiveIntensity = 0.35;
      mat = selectedMat;
    }

    // Resolve active transform: default transform + user override
    const posX = (override?.position?.[0] ?? def.transform.position[0]);
    const posY = (override?.position?.[1] ?? def.transform.position[1]);
    const posZ = (override?.position?.[2] ?? def.transform.position[2]);

    const rotX = (override?.rotation?.[0] ?? def.transform.rotation[0]);
    const rotY = (override?.rotation?.[1] ?? def.transform.rotation[1]);
    const rotZ = (override?.rotation?.[2] ?? def.transform.rotation[2]);

    const scaleX = (override?.scale?.[0] ?? def.transform.scale[0]);
    const scaleY = (override?.scale?.[1] ?? def.transform.scale[1]);
    const scaleZ = (override?.scale?.[2] ?? def.transform.scale[2]);

    // Resolve active dimensions
    const width = override?.dimensions?.width ?? def.dimensions?.width ?? 1.0;
    const height = override?.dimensions?.height ?? def.dimensions?.height ?? 0.2;
    const length = override?.dimensions?.length ?? def.dimensions?.length ?? 0.4;
    const thickness = override?.dimensions?.thickness ?? def.dimensions?.thickness ?? 0.03;

    let obj: THREE.Object3D;

    // 0. Check for Cross-Car Swapped Donor Part Mesh
    if (override?.donorComponentId) {
      const donorPart = CrossCarPartSwapper.getDonorPartById(override.donorComponentId);
      if (donorPart) {
        const scaleAdj: [number, number, number] = override.adapterScale || [1.0, 1.0, 1.0];
        const offsetAdj: [number, number, number] = override.adapterOffset || [0, 0, 0];
        obj = donorPart.generateMesh(scaleAdj, offsetAdj, override.materialRef, override.customColorHex);
      } else {
        obj = this.buildBoxMesh(width, height, length, mat);
      }
    } else {
      // Component Geometry Dispatch
      switch (def.group) {
      case 'wheels': {
        const wheelSpec = this.resolveWheelSpec(def.id, spec.wheels);
        obj = this.buildWheelComponent(wheelSpec, mat, override);
        break;
      }
      case 'aerodynamics': {
        if (def.id === 'rear_wing') {
          obj = this.buildRearWingComponent(width, height, length, mat, override);
        } else if (def.id === 'front_splitter') {
          obj = this.buildFrontSplitterComponent(width, thickness, length, mat);
        } else if (def.id === 'rear_diffuser') {
          obj = this.buildDiffuserComponent(width, height, length, mat, override?.contextSettings?.finCount ?? 5);
        } else {
          obj = this.buildBoxMesh(width, height, length, mat);
        }
        break;
      }
      case 'lighting': {
        obj = this.buildLightingComponent(def.id, width, height, length, mat);
        break;
      }
      case 'windows': {
        obj = this.buildGlassComponent(def.id, width, height, length, mat);
        break;
      }
      case 'exhaust': {
        obj = this.buildExhaustComponent(width, height, length, mat);
        break;
      }
      case 'interior': {
        obj = this.buildInteriorComponent(def.id, width, height, length, mat);
        break;
      }
      default: {
        // Body panels (bumpers, hood, roof, doors, fenders, skirts)
        obj = this.buildBodyPanelComponent(def.id, width, height, length, mat);
        break;
      }
    }
  }

    // Apply active transform
    obj.position.set(posX, posY, posZ);
    obj.rotation.set(rotX, rotY, rotZ);
    obj.scale.set(scaleX, scaleY, scaleZ);

    // Attach Selection and Identification Metadata for 3D Raycasting
    obj.name = def.id;
    obj.userData = {
      componentId: def.id,
      componentName: def.name,
      componentGroup: def.group,
      isEditableComponent: true,
      editable: def.editable,
      originalTransform: def.transform,
      originalDimensions: def.dimensions,
      materialRef: def.materialRef,
      customizationOptions: def.customizationOptions
    };

    // Propagate userData to all children meshes for raycasting hit testing
    obj.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        child.userData.componentId = def.id;
        child.userData.componentGroup = def.group;
        child.userData.isEditableComponent = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return obj;
  }

  /**
   * Builds the Lofted Monocoque Body Shell
   */
  private static buildLoftedBodyShell(
    spec: VehicleSchema2,
    materialsMap: Map<string, THREE.Material>,
    overrides: Record<string, ComponentOverride>
  ): THREE.Mesh {
    const rawSections = spec.bodyGeometry.crossSections;
    const sections = [...rawSections].sort((a, b) => b.z_m - a.z_m);

    const rings: THREE.Vector3[][] = [];
    const POINTS_PER_HALF = 8;

    for (const sec of sections) {
      const z = sec.z_m;
      const hw = sec.half_width_m;
      const ly = sec.lower_y_m;
      const sy = sec.shoulder_y_m;
      const by = sec.belt_y_m;
      const uy = sec.upper_center_y_m;
      const rw = sec.roof_half_width_m;
      const ry = sec.roof_crown_y_m;

      const hasRoof = rw > 0.01;
      const topCenterY = hasRoof ? ry : uy;

      const pUnderbody = new THREE.Vector3(0, ly, z);
      const pRocker = new THREE.Vector3(-hw * 0.90, ly, z);
      const pFlankLower = new THREE.Vector3(-hw, (ly + sy) * 0.5, z);
      const pShoulder = new THREE.Vector3(-hw * 0.98, sy, z);
      const pBelt = new THREE.Vector3(-hw * 0.94, by, z);

      let pTumblehome: THREE.Vector3;
      let pRoofRail: THREE.Vector3;
      let pRoofSide: THREE.Vector3;

      if (hasRoof) {
        pTumblehome = new THREE.Vector3(-hw * 0.88, by + 0.05, z);
        pRoofRail = new THREE.Vector3(-rw, (by + ry) * 0.58, z);
        pRoofSide = new THREE.Vector3(-rw * 0.6, ry - 0.01, z);
      } else {
        pTumblehome = new THREE.Vector3(-hw * 0.78, (sy + uy) * 0.5, z);
        pRoofRail = new THREE.Vector3(-hw * 0.50, (sy + uy) * 0.75, z);
        pRoofSide = new THREE.Vector3(-hw * 0.25, uy - 0.01, z);
      }

      const pTopCenter = new THREE.Vector3(0, topCenterY, z);

      const leftPts = [pUnderbody, pRocker, pFlankLower, pShoulder, pBelt, pTumblehome, pRoofRail, pRoofSide, pTopCenter];
      const ring: THREE.Vector3[] = [];

      for (let i = 0; i < leftPts.length; i++) {
        ring.push(leftPts[i]);
      }
      for (let i = leftPts.length - 2; i > 0; i--) {
        const pt = leftPts[i];
        ring.push(new THREE.Vector3(-pt.x, pt.y, pt.z));
      }

      rings.push(ring);
    }

    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const numStations = rings.length;
    const ringLen = rings[0].length;

    for (let s = 0; s < numStations; s++) {
      const ring = rings[s];
      const u = s / (numStations - 1);
      for (let p = 0; p < ringLen; p++) {
        const pt = ring[p];
        positions.push(pt.x, pt.y, pt.z);
        const v = p / ringLen;
        uvs.push(u, v);
      }
    }

    for (let s = 0; s < numStations - 1; s++) {
      const rowA = s * ringLen;
      const rowB = (s + 1) * ringLen;

      for (let p = 0; p < ringLen; p++) {
        const nextP = (p + 1) % ringLen;
        const a0 = rowA + p;
        const a1 = rowA + nextP;
        const b0 = rowB + p;
        const b1 = rowB + nextP;

        indices.push(a0, a1, b0);
        indices.push(a1, b1, b0);
      }
    }

    // Front Nose Cap
    const noseRingIdx = 0;
    const noseCenterIdx = positions.length / 3;
    const frontSec = sections[0];
    positions.push(0, (frontSec.lower_y_m + frontSec.upper_center_y_m) * 0.5, frontSec.z_m + 0.04);
    uvs.push(0, 0.5);

    for (let p = 0; p < ringLen; p++) {
      const nextP = (p + 1) % ringLen;
      indices.push(noseCenterIdx, noseRingIdx + nextP, noseRingIdx + p);
    }

    // Rear Tail Cap
    const tailRingIdx = (numStations - 1) * ringLen;
    const tailCenterIdx = positions.length / 3;
    const rearSec = sections[numStations - 1];
    positions.push(0, (rearSec.lower_y_m + rearSec.upper_center_y_m) * 0.5, rearSec.z_m - 0.04);
    uvs.push(1, 0.5);

    for (let p = 0; p < ringLen; p++) {
      const nextP = (p + 1) % ringLen;
      indices.push(tailCenterIdx, tailRingIdx + p, tailRingIdx + nextP);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const mat = materialsMap.get('body_paint') || new THREE.MeshStandardMaterial({ color: 0x888888 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  // ==========================================
  // Component Builders
  // ==========================================

  private static buildRearWingComponent(
    width: number,
    height: number,
    length: number,
    material: THREE.Material,
    override?: ComponentOverride
  ): THREE.Group {
    const group = new THREE.Group();

    const wingSpan = width;
    const chord = length;
    const isLip = height < 0.10;

    if (isLip) {
      // Ducktail decklid spoiler
      const lipShape = new THREE.Shape();
      const hc = chord / 2;
      lipShape.moveTo(-hc, 0);
      lipShape.quadraticCurveTo(0, 0.04, hc, 0.035);
      lipShape.lineTo(hc, 0.015);
      lipShape.quadraticCurveTo(0, -0.01, -hc, 0);

      const lipGeo = new THREE.ExtrudeGeometry(lipShape, {
        steps: 3,
        depth: wingSpan,
        bevelEnabled: true,
        bevelThickness: 0.008,
        bevelSize: 0.008,
        bevelSegments: 2
      });
      lipGeo.center();
      lipGeo.rotateY(Math.PI / 2);
      lipGeo.computeVertexNormals();

      const lipMesh = new THREE.Mesh(lipGeo, material);
      lipMesh.name = 'rear_wing_lip_blade';
      lipMesh.castShadow = true;
      group.add(lipMesh);
    } else {
      // High-downforce dual-element wing with swan-neck pylons
      const bladeShape = new THREE.Shape();
      const hc = chord / 2;
      bladeShape.moveTo(-hc, 0);
      bladeShape.quadraticCurveTo(0, 0.045, hc, 0.01);
      bladeShape.lineTo(hc, -0.01);
      bladeShape.quadraticCurveTo(0, -0.02, -hc, 0);

      const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
        steps: 4,
        depth: wingSpan,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.01,
        bevelSegments: 2
      });
      bladeGeo.center();
      bladeGeo.rotateY(Math.PI / 2);
      bladeGeo.computeVertexNormals();

      const bladeMesh = new THREE.Mesh(bladeGeo, material);
      bladeMesh.name = 'rear_wing_main_blade';
      bladeMesh.castShadow = true;
      group.add(bladeMesh);

      // Swan-neck supports
      const pylonDist = wingSpan * 0.28;
      [-pylonDist, pylonDist].forEach((px, idx) => {
        const pylonCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(px, -0.32, 0.12),
          new THREE.Vector3(px, -0.10, 0.04),
          new THREE.Vector3(px, 0.06, 0.02),
          new THREE.Vector3(px, 0.02, 0)
        ]);
        const pylonGeo = new THREE.TubeGeometry(pylonCurve, 12, 0.018, 8, false);
        pylonGeo.computeVertexNormals();
        const pylonMesh = new THREE.Mesh(pylonGeo, material);
        pylonMesh.name = `rear_wing_pylon_${idx === 0 ? 'left' : 'right'}`;
        pylonMesh.castShadow = true;
        group.add(pylonMesh);
      });

      // Endplates
      const endplateShape = new THREE.Shape();
      endplateShape.moveTo(-0.20, -0.10);
      endplateShape.lineTo(0.20, -0.08);
      endplateShape.lineTo(0.18, 0.12);
      endplateShape.lineTo(-0.16, 0.14);
      endplateShape.closePath();

      const epGeo = new THREE.ExtrudeGeometry(endplateShape, { depth: 0.01, bevelEnabled: false });
      epGeo.center();
      epGeo.computeVertexNormals();

      [-wingSpan / 2, wingSpan / 2].forEach((ex, idx) => {
        const epMesh = new THREE.Mesh(epGeo, material);
        epMesh.name = `rear_wing_endplate_${idx === 0 ? 'left' : 'right'}`;
        epMesh.position.set(ex, 0, 0);
        epMesh.rotation.y = idx === 0 ? 0 : Math.PI;
        epMesh.castShadow = true;
        group.add(epMesh);
      });
    }

    return group;
  }

  private static buildFrontSplitterComponent(
    width: number,
    thickness: number,
    length: number,
    material: THREE.Material
  ): THREE.Mesh {
    const hw = width / 2;
    const shape = new THREE.Shape();
    shape.moveTo(-hw, 0);
    shape.lineTo(-hw + 0.12, length * 0.9);
    shape.quadraticCurveTo(0, length, hw - 0.12, length * 0.9);
    shape.lineTo(hw, 0);
    shape.quadraticCurveTo(0, -0.05, -hw, 0);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelSegments: 2
    });
    geo.center();
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, material);
    mesh.name = 'front_splitter_mesh';
    mesh.castShadow = true;
    return mesh;
  }

  private static buildDiffuserComponent(
    width: number,
    height: number,
    length: number,
    material: THREE.Material,
    finCount: number = 5
  ): THREE.Group {
    const group = new THREE.Group();

    // Base plate
    const baseGeo = new THREE.BoxGeometry(width, 0.025, length);
    baseGeo.computeVertexNormals();
    const baseMesh = new THREE.Mesh(baseGeo, material);
    baseMesh.name = 'rear_diffuser_tray';
    baseMesh.castShadow = true;
    group.add(baseMesh);

    // Vertical fins
    if (finCount > 1) {
      const finSpacing = width / (finCount - 1);
      for (let f = 0; f < finCount; f++) {
        const finX = -width / 2 + f * finSpacing;
        const finGeo = new THREE.BoxGeometry(0.016, height * 0.6, length * 0.9);
        finGeo.computeVertexNormals();
        const finMesh = new THREE.Mesh(finGeo, material);
        finMesh.position.set(finX, -height * 0.2, 0);
        finMesh.castShadow = true;
        group.add(finMesh);
      }
    }

    return group;
  }

  private static buildLightingComponent(
    id: string,
    width: number,
    height: number,
    length: number,
    material: THREE.Material
  ): THREE.Object3D {
    if (id.includes('taillight')) {
      const geo = new THREE.BoxGeometry(width, height, length);
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, material);
      mesh.name = 'taillight_light_bar';
      return mesh;
    }

    const group = new THREE.Group();
    // 4 Projector Dots
    const dotOffsets = [
      [-width * 0.25, -height * 0.2],
      [width * 0.25, -height * 0.2],
      [-width * 0.25, height * 0.2],
      [width * 0.25, height * 0.2]
    ];
    for (const [dx, dy] of dotOffsets) {
      const dotGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 12);
      dotGeo.rotateX(Math.PI / 2);
      const dot = new THREE.Mesh(dotGeo, material);
      dot.position.set(dx, dy, 0);
      group.add(dot);
    }
    return group;
  }

  private static buildGlassComponent(
    id: string,
    width: number,
    height: number,
    length: number,
    material: THREE.Material
  ): THREE.Mesh {
    const hw = width / 2;
    const shape = new THREE.Shape();
    shape.moveTo(-hw, 0);
    shape.lineTo(-hw * 0.88, height);
    shape.quadraticCurveTo(0, height + 0.03, hw * 0.88, height);
    shape.lineTo(hw, 0);
    shape.quadraticCurveTo(0, 0.02, -hw, 0);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.012,
      bevelEnabled: false
    });
    geo.center();
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, material);
    mesh.name = `${id}_mesh`;
    return mesh;
  }

  private static buildWheelComponent(
    wheelSpec: WheelComponentSpec,
    material: THREE.Material,
    override?: ComponentOverride
  ): THREE.Group {
    const isRight = wheelSpec.side === 'right';
    let radius = wheelSpec.tire.calculated_radius_m || 0.35;
    const width = wheelSpec.rim.width_m || 0.28;

    // Apply custom diameter override if specified
    if (override?.wheelDiameterInches) {
      const rimRadiusM = (override.wheelDiameterInches * 0.0254) / 2;
      const sidewallM = (wheelSpec.tire.nominal_section_width_mm * wheelSpec.tire.aspect_ratio * 0.01) / 1000;
      radius = rimRadiusM + sidewallM;
    }

    const camber = override?.wheelCamberDeg ?? override?.contextSettings?.camberDeg ?? wheelSpec.alignment.camberDeg;

    const assembly = WheelGenerator.generateWheel({
      wheelRadius: radius,
      tyreWidth: width,
      camberDeg: (camber * Math.PI) / 180,
      steerDeg: 0,
      isRightSide: isRight,
      rimColorHex: (material as any).color ? `#${(material as any).color.getHexString()}` : '#27272a'
    });

    // Apply wheel spacer (offset poke)
    if (override?.wheelSpacerMm) {
      const spacerM = override.wheelSpacerMm / 1000;
      assembly.group.position.x += spacerM * (isRight ? 1 : -1);
    }

    return assembly.group;
  }

  private static buildExhaustComponent(
    width: number,
    height: number,
    length: number,
    material: THREE.Material
  ): THREE.Group {
    const group = new THREE.Group();
    const offsets = [-width * 0.35, -width * 0.12, width * 0.12, width * 0.35];

    offsets.forEach((ox, idx) => {
      const tipGeo = new THREE.CylinderGeometry(height * 0.45, height * 0.48, length, 16);
      tipGeo.rotateX(Math.PI / 2);
      const tip = new THREE.Mesh(tipGeo, material);
      tip.name = `exhaust_tip_${idx + 1}`;
      tip.position.set(ox, 0, 0);
      tip.castShadow = true;
      group.add(tip);
    });

    return group;
  }

  private static buildInteriorComponent(
    id: string,
    width: number,
    height: number,
    length: number,
    material: THREE.Material
  ): THREE.Object3D {
    if (id.includes('steering_wheel')) {
      const torusGeo = new THREE.TorusGeometry(width * 0.45, 0.022, 12, 24);
      torusGeo.computeVertexNormals();
      const wheel = new THREE.Mesh(torusGeo, material);
      wheel.name = 'interior_steering_wheel_rim';
      return wheel;
    }

    if (id.includes('seats')) {
      const group = new THREE.Group();
      [-0.38, 0.38].forEach((sx, idx) => {
        const seatGeo = new THREE.BoxGeometry(0.42, height, length);
        seatGeo.computeVertexNormals();
        const seat = new THREE.Mesh(seatGeo, material);
        seat.name = `interior_seat_${idx === 0 ? 'left' : 'right'}`;
        seat.position.set(sx, 0, 0);
        group.add(seat);
      });
      return group;
    }

    const geo = new THREE.BoxGeometry(width, height, length);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, material);
    mesh.name = `${id}_mesh`;
    return mesh;
  }

  private static buildBodyPanelComponent(
    id: string,
    width: number,
    height: number,
    length: number,
    material: THREE.Material
  ): THREE.Mesh {
    // Generate curved aerodynamic panel geometry with double curvature (never flat BoxGeometry)
    const uSteps = 8;
    const vSteps = 8;
    const positions: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    const hw = width / 2;
    const hh = height / 2;
    const hl = length / 2;

    for (let i = 0; i <= uSteps; i++) {
      const u = i / uSteps;
      const un = u * 2 - 1;
      for (let j = 0; j <= vSteps; j++) {
        const v = j / vSteps;
        const vn = v * 2 - 1;
        const x = un * hw;
        const z = vn * hl;
        const curveY = 0.015 * (1 - un ** 2) * (1 - vn ** 2);
        const y = -hh + v * height + curveY;
        positions.push(x, y, z);
        uvs.push(u, v);
      }
    }

    for (let i = 0; i < uSteps; i++) {
      for (let j = 0; j < vSteps; j++) {
        const a = i * (vSteps + 1) + j;
        const b = (i + 1) * (vSteps + 1) + j;
        const c = (i + 1) * (vSteps + 1) + (j + 1);
        const d = i * (vSteps + 1) + (j + 1);
        indices.push(a, b, c);
        indices.push(a, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, material);
    mesh.name = `${id}_panel`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  private static buildBoxMesh(
    width: number,
    height: number,
    length: number,
    material: THREE.Material
  ): THREE.Mesh {
    const geo = new THREE.BoxGeometry(width, height, length);
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, material);
  }

  private static resolveWheelSpec(
    componentId: string,
    wheels: {
      frontLeft: WheelComponentSpec;
      frontRight: WheelComponentSpec;
      rearLeft: WheelComponentSpec;
      rearRight: WheelComponentSpec;
    }
  ): WheelComponentSpec {
    if (componentId.includes('front_left')) return wheels.frontLeft;
    if (componentId.includes('front_right')) return wheels.frontRight;
    if (componentId.includes('rear_left')) return wheels.rearLeft;
    return wheels.rearRight;
  }

  /**
   * Safely disposes all geometries and materials in an object graph
   * preventing GPU memory leaks across repeated vehicle customization cycles.
   */
  public static dispose(root: THREE.Object3D): void {
    root.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      }
    });
  }
}

