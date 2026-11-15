import * as THREE from 'three';
import { WheelGenerator } from './wheelGenerator';

export interface ParametricLongitudinalSection {
  z_m: number;
  half_width_m: number;
  lower_y_m: number;
  shoulder_y_m: number;
  belt_y_m: number;
  upper_center_y_m: number;
  roof_half_width_m: number;
  roof_crown_y_m: number;
}

export interface ParametricWheelSpec {
  id: string;
  axle: 'front' | 'rear';
  side: 'left' | 'right';
  center_m: { x: number; y: number; z: number };
  tire: {
    size: string;
    nominal_section_width_mm?: number;
    aspect_ratio?: number;
    rim_diameter_in?: number;
    calculated_outer_diameter_mm?: number;
    calculated_radius_m?: number;
  };
  rim: {
    size: string;
    width_m?: number;
    style?: string;
  };
}

export interface ParametricVehicleGeometry {
  $schema?: string;
  schema_version?: string;
  asset_id: string;
  asset_type: string;
  vehicle: {
    manufacturer: string;
    make?: string;
    model: string;
    generation?: string;
    model_year_reference?: number;
    body_style?: string;
    trim?: string;
    drive_layout?: string;
    engine_description?: string;
    vehicle_identity_confidence?: string;
  };
  geometry_provenance: {
    geometry_source: string;
    source_cad_included?: boolean;
    source_mesh_included?: boolean;
    oem_geometry_verified?: boolean;
    accuracy_class: string;
    accuracy_note: string;
    reference_specification?: {
      publisher?: string;
      document?: string;
      url?: string;
      accessed_date?: string;
    };
  };
  dimensions: {
    overall_length_m: number;
    body_width_without_mirrors_m: number;
    overall_width_with_mirrors_m?: number;
    overall_height_m: number;
    wheelbase_m: number;
    front_track_m: number;
    rear_track_m: number;
    front_overhang_m?: number;
    rear_overhang_m?: number;
    front_axle_z_m?: number;
    rear_axle_z_m?: number;
  };
  geometry: {
    generator?: string;
    body_shell: {
      geometry_type?: string;
      closed_mesh?: boolean;
      mirror_across_x?: boolean;
      longitudinal_sections: ParametricLongitudinalSection[];
      shape_characteristics?: Record<string, string>;
    };
    wheel_arches?: {
      front: { radius_m: number; center_z_m: number; center_y_m?: number; arch_lip_width_m?: number };
      rear: { radius_m: number; center_z_m: number; center_y_m?: number; arch_lip_width_m?: number };
    };
    wheels: ParametricWheelSpec[];
    aerodynamics?: {
      front_splitter?: any;
      front_fender_vents?: any;
      hood_vents?: any;
      side_intakes?: any;
      rear_wing?: any;
      rear_diffuser?: any;
    };
    components?: Array<{ id: string; name: string; group: string; geometry_ref?: string; dimensions_status?: string }>;
  };
  materials?: Record<string, {
    name?: string;
    type?: string;
    color: string;
    metalness?: number;
    roughness?: number;
    clearcoat?: number;
    clearcoat_roughness?: number;
    transmission?: number;
    transparent?: boolean;
  }>;
  rendering?: any;
  validation?: any;
}

/**
 * Parametric Automotive Geometry Builder
 * Reconstructs accurate 3D vehicle geometries directly from dimension-anchored parametric JSON files.
 * Faithfully lofts multi-station longitudinal sections, wheel arches, aerodynamics (swan-neck wing, splitter, diffuser),
 * staggered performance wheels, and PBR materials.
 */
export class ParametricGeometryBuilder {

  /**
   * Builds a complete Three.js vehicle assembly group from a parametric specification
   */
  static build(
    spec: ParametricVehicleGeometry,
    options?: {
      customPaintHex?: string | number;
      customWheelColorHex?: string | number;
      wireframe?: boolean;
    }
  ): THREE.Group {
    const root = new THREE.Group();
    root.name = `parametric_vehicle_${spec.asset_id || 'custom'}`;

    // 1. Resolve Materials
    const defaultPaint = spec.materials?.default_paint;
    const carbonSpec = spec.materials?.carbon_fiber;
    const glassSpec = spec.materials?.glass;
    const alloySpec = spec.materials?.wheel_alloy;

    const bodyPaintColor = options?.customPaintHex ?? defaultPaint?.color ?? '#8B929A';
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(bodyPaintColor),
      metalness: defaultPaint?.metalness ?? 0.72,
      roughness: defaultPaint?.roughness ?? 0.24,
      clearcoat: defaultPaint?.clearcoat ?? 1.0,
      clearcoatRoughness: defaultPaint?.clearcoat_roughness ?? 0.08,
      wireframe: !!options?.wireframe
    });

    const carbonMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(carbonSpec?.color ?? '#17191C'),
      metalness: carbonSpec?.metalness ?? 0.25,
      roughness: carbonSpec?.roughness ?? 0.38,
      wireframe: !!options?.wireframe
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(glassSpec?.color ?? '#18232D'),
      metalness: glassSpec?.metalness ?? 0.05,
      roughness: glassSpec?.roughness ?? 0.08,
      transmission: glassSpec?.transmission ?? 0.22,
      transparent: true,
      wireframe: !!options?.wireframe
    });

    const rimColor = options?.customWheelColorHex ?? alloySpec?.color ?? '#25282C';

    // 2. Build Lofted Monocoque Body Shell from Longitudinal Sections
    const bodyShellMesh = this.buildBodyShell(spec, bodyMat);
    bodyShellMesh.name = 'component_body_shell';
    bodyShellMesh.castShadow = true;
    bodyShellMesh.receiveShadow = true;
    root.add(bodyShellMesh);

    // 3. Build Glass Cabin / Greenhouse
    const glassMesh = this.buildGreenhouseGlass(spec, glassMat);
    glassMesh.name = 'component_greenhouse_glass';
    glassMesh.castShadow = true;
    root.add(glassMesh);

    // 4. Build Aerodynamics
    const aeroGroup = this.buildAerodynamics(spec, carbonMat);
    aeroGroup.name = 'group_aerodynamics';
    root.add(aeroGroup);

    // 5. Build Staggered Wheels & Brakes
    const wheelsGroup = this.buildWheels(spec, rimColor, options?.wireframe);
    wheelsGroup.name = 'group_wheels';
    root.add(wheelsGroup);

    // 6. Build Lighting Assemblies (Headlights & Rear Full-Width Light Bar)
    const lightsGroup = this.buildLighting(spec);
    lightsGroup.name = 'group_lighting';
    root.add(lightsGroup);

    // 7. Attach Verified Metadata & Accuracy Classification
    root.userData = {
      isParametricVehicle: true,
      assetId: spec.asset_id,
      modelName: `${spec.vehicle.manufacturer} ${spec.vehicle.model}`,
      accuracyClass: spec.geometry_provenance.accuracy_class || 'D_APPROXIMATE',
      accuracyLabel: 'APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY',
      dimensions: spec.dimensions,
      provenance: spec.geometry_provenance,
      materials: spec.materials,
      validation: spec.validation
    };

    return root;
  }

  /**
   * Lofts the longitudinal sections into a smooth watertight monocoque body shell
   */
  private static buildBodyShell(
    spec: ParametricVehicleGeometry,
    material: THREE.Material
  ): THREE.Mesh {
    const rawSections = spec.geometry.body_shell.longitudinal_sections;
    if (!rawSections || rawSections.length < 2) {
      throw new Error("Parametric body requires at least 2 longitudinal sections");
    }

    // Sort sections from front (+Z) to rear (-Z)
    const sections = [...rawSections].sort((a, b) => b.z_m - a.z_m);

    const frontArch = spec.geometry.wheel_arches?.front;
    const rearArch = spec.geometry.wheel_arches?.rear;

    // Generate rings of 3D points per station
    const rings: THREE.Vector3[][] = [];
    const POINTS_PER_HALF = 8; // 8 points per side from bottom centerline to top centerline

    for (const sec of sections) {
      const z = sec.z_m;
      const hw = sec.half_width_m;
      const ly = sec.lower_y_m;
      const sy = sec.shoulder_y_m;
      const by = sec.belt_y_m;
      const uy = sec.upper_center_y_m;
      const rw = sec.roof_half_width_m;
      const ry = sec.roof_crown_y_m;

      // Wheel arch cutout displacement
      let archCutoutY = ly;
      let archFlareX = 0;

      if (frontArch && Math.abs(z - frontArch.center_z_m) < frontArch.radius_m) {
        const dz = Math.abs(z - frontArch.center_z_m);
        const dy = Math.sqrt(Math.max(0, frontArch.radius_m * frontArch.radius_m - dz * dz));
        archCutoutY = Math.max(ly, (frontArch.center_y_m ?? 0.35) + dy * 0.88);
        archFlareX = (frontArch.arch_lip_width_m ?? 0.025) * (1 - Math.pow(dz / frontArch.radius_m, 2));
      } else if (rearArch && Math.abs(z - rearArch.center_z_m) < rearArch.radius_m) {
        const dz = Math.abs(z - rearArch.center_z_m);
        const dy = Math.sqrt(Math.max(0, rearArch.radius_m * rearArch.radius_m - dz * dz));
        archCutoutY = Math.max(ly, (rearArch.center_y_m ?? 0.367) + dy * 0.88);
        archFlareX = (rearArch.arch_lip_width_m ?? 0.028) * (1 - Math.pow(dz / rearArch.radius_m, 2));
      }

      const ring: THREE.Vector3[] = [];
      const hasRoof = rw > 0.01;
      const topCenterY = hasRoof ? ry : uy;

      // Left half points: from underbody centerline (x=0) to top centerline (x=0)
      const pUnderbody = new THREE.Vector3(0, archCutoutY, z);
      const pRocker = new THREE.Vector3(-(hw * 0.90 + archFlareX), archCutoutY, z);
      const pFlankLower = new THREE.Vector3(-(hw + archFlareX), (archCutoutY + sy) * 0.5, z);
      const pShoulder = new THREE.Vector3(-(hw + archFlareX * 0.6), sy, z);
      const pBelt = new THREE.Vector3(-hw * 0.96, by, z);

      let pTumblehome: THREE.Vector3;
      let pRoofRail: THREE.Vector3;
      let pRoofSide: THREE.Vector3;

      if (hasRoof) {
        pTumblehome = new THREE.Vector3(-hw * 0.88, by + 0.06, z);
        pRoofRail = new THREE.Vector3(-rw, (by + ry) * 0.58, z);
        pRoofSide = new THREE.Vector3(-rw * 0.6, ry - 0.01, z);
      } else {
        pTumblehome = new THREE.Vector3(-hw * 0.78, (sy + uy) * 0.5, z);
        pRoofRail = new THREE.Vector3(-hw * 0.50, (sy + uy) * 0.75, z);
        pRoofSide = new THREE.Vector3(-hw * 0.25, uy - 0.01, z);
      }

      const pTopCenter = new THREE.Vector3(0, topCenterY, z);

      // Full loop: Left side (pUnderbody -> pTopCenter) then Right side (pTopCenter -> pUnderbody)
      const leftPts = [pUnderbody, pRocker, pFlankLower, pShoulder, pBelt, pTumblehome, pRoofRail, pRoofSide, pTopCenter];

      // Add left half
      for (let i = 0; i < leftPts.length; i++) {
        ring.push(leftPts[i]);
      }
      // Add right half (mirrored x) in reverse order to close perimeter
      for (let i = leftPts.length - 2; i > 0; i--) {
        const pt = leftPts[i];
        ring.push(new THREE.Vector3(-pt.x, pt.y, pt.z));
      }

      rings.push(ring);
    }

    // Loft adjacent rings into indexed quad mesh
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

        // Two triangles for each quad with outward-facing CCW winding order
        indices.push(a0, a1, b0);
        indices.push(a1, b1, b0);
      }
    }

    // Front Nose Cap (facing forward +Z)
    const noseRingIdx = 0;
    const noseCenterIdx = positions.length / 3;
    const frontSec = sections[0];
    positions.push(0, (frontSec.lower_y_m + frontSec.upper_center_y_m) * 0.5, frontSec.z_m + 0.04);
    uvs.push(0, 0.5);

    for (let p = 0; p < ringLen; p++) {
      const nextP = (p + 1) % ringLen;
      indices.push(noseCenterIdx, noseRingIdx + nextP, noseRingIdx + p);
    }

    // Rear Tail Cap (facing rearward -Z)
    const tailRingIdx = (numStations - 1) * ringLen;
    const tailCenterIdx = positions.length / 3;
    const rearSec = sections[numStations - 1];
    positions.push(0, (rearSec.lower_y_m + rearSec.upper_center_y_m) * 0.5, rearSec.z_m - 0.04);
    uvs.push(1, 0.5);

    for (let p = 0; p < ringLen; p++) {
      const nextP = (p + 1) % ringLen;
      indices.push(tailCenterIdx, tailRingIdx + p, tailRingIdx + nextP);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return new THREE.Mesh(geometry, material);
  }

  /**
   * Builds the tinted curved glass surfaces for the vehicle greenhouse
   * Dynamically adapts to the cowl, A-pillars, roofline, B/C-pillars, and rear deck
   */
  private static buildGreenhouseGlass(
    spec: ParametricVehicleGeometry,
    material: THREE.Material
  ): THREE.Group {
    const group = new THREE.Group();
    const rawSections = spec.geometry.body_shell.longitudinal_sections;
    if (!rawSections || rawSections.length < 2) return group;

    const sections = [...rawSections].sort((a, b) => b.z_m - a.z_m);
    const roofSecs = sections.filter(s => s.roof_half_width_m > 0.05);

    if (roofSecs.length < 2) {
      return group;
    }

    const frontRoof = roofSecs[0];
    const rearRoof = roofSecs[roofSecs.length - 1];
    const frontRoofIdx = sections.indexOf(frontRoof);
    const rearRoofIdx = sections.indexOf(rearRoof);
    const cowl = frontRoofIdx > 0 ? sections[frontRoofIdx - 1] : frontRoof;
    const deck = rearRoofIdx < sections.length - 1 ? sections[rearRoofIdx + 1] : rearRoof;

    // 1. Windshield
    const wsBaseHalfW = cowl.half_width_m * 0.74;
    const wsTopHalfW = frontRoof.roof_half_width_m * 0.94;
    const wsZDist = cowl.z_m - frontRoof.z_m;
    const wsYDist = frontRoof.roof_crown_y_m - cowl.upper_center_y_m;
    const wsLen = Math.hypot(wsZDist, wsYDist);
    const wsPitch = Math.atan2(wsYDist, wsZDist);

    const wsShape = new THREE.Shape();
    wsShape.moveTo(-wsBaseHalfW, 0);
    wsShape.lineTo(-wsTopHalfW, wsLen);
    wsShape.quadraticCurveTo(0, wsLen + 0.02, wsTopHalfW, wsLen);
    wsShape.lineTo(wsBaseHalfW, 0);
    wsShape.quadraticCurveTo(0, 0.03, -wsBaseHalfW, 0);

    const wsGeo = new THREE.ExtrudeGeometry(wsShape, {
      depth: 0.015,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelSegments: 2
    });
    wsGeo.center();
    wsGeo.computeVertexNormals();

    const windshield = new THREE.Mesh(wsGeo, material);
    windshield.name = 'glass_windshield';
    windshield.position.set(
      0,
      (cowl.upper_center_y_m + frontRoof.roof_crown_y_m) * 0.5 + 0.01,
      (cowl.z_m + frontRoof.z_m) * 0.5
    );
    windshield.rotation.x = -wsPitch;
    windshield.castShadow = true;
    group.add(windshield);

    // 2. Rear Window / Fastback Engine Glass
    const rwTopHalfW = rearRoof.roof_half_width_m * 0.92;
    const rwBaseHalfW = deck.half_width_m * 0.68;
    const rwZDist = rearRoof.z_m - deck.z_m;
    const rwYDist = rearRoof.roof_crown_y_m - deck.upper_center_y_m;
    const rwLen = Math.hypot(rwZDist, rwYDist);
    const rwPitch = Math.atan2(rwYDist, rwZDist);

    const rwShape = new THREE.Shape();
    rwShape.moveTo(-rwTopHalfW, 0);
    rwShape.lineTo(-rwBaseHalfW, rwLen);
    rwShape.quadraticCurveTo(0, rwLen + 0.02, rwBaseHalfW, rwLen);
    rwShape.lineTo(rwTopHalfW, 0);
    rwShape.quadraticCurveTo(0, 0.02, -rwTopHalfW, 0);

    const rwGeo = new THREE.ExtrudeGeometry(rwShape, {
      depth: 0.015,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelSegments: 2
    });
    rwGeo.center();
    rwGeo.computeVertexNormals();

    const rearGlass = new THREE.Mesh(rwGeo, material);
    rearGlass.name = 'glass_rear_window';
    rearGlass.position.set(
      0,
      (rearRoof.roof_crown_y_m + deck.upper_center_y_m) * 0.5 + 0.01,
      (rearRoof.z_m + deck.z_m) * 0.5
    );
    rearGlass.rotation.x = rwPitch;
    rearGlass.castShadow = true;
    group.add(rearGlass);

    // 3. Side Windows Flank Glass (Left and Right)
    for (let i = 0; i < roofSecs.length - 1; i++) {
      const s0 = roofSecs[i];
      const s1 = roofSecs[i + 1];

      [-1, 1].forEach(side => {
        const sideShape = new THREE.Shape();
        const top0 = s0.roof_crown_y_m - 0.01;
        const bot0 = s0.belt_y_m + 0.02;
        const top1 = s1.roof_crown_y_m - 0.01;
        const bot1 = s1.belt_y_m + 0.02;
        const distZ = Math.abs(s0.z_m - s1.z_m);

        sideShape.moveTo(0, bot0);
        sideShape.lineTo(0, top0);
        sideShape.lineTo(distZ, top1);
        sideShape.lineTo(distZ, bot1);
        sideShape.closePath();

        const sideGeo = new THREE.ExtrudeGeometry(sideShape, {
          depth: 0.012,
          bevelEnabled: false
        });
        sideGeo.computeVertexNormals();
        const sideMesh = new THREE.Mesh(sideGeo, material);
        sideMesh.name = `glass_side_window_${side === -1 ? 'left' : 'right'}_${i}`;
        const midHw = ((s0.roof_half_width_m + s1.roof_half_width_m) * 0.5 + (s0.half_width_m + s1.half_width_m) * 0.5) * 0.5;
        sideMesh.position.set(side * midHw * 0.96, 0, s0.z_m);
        sideMesh.rotation.y = side === -1 ? Math.PI / 2 : -Math.PI / 2;
        group.add(sideMesh);
      });
    }

    return group;
  }

  /**
   * Builds the authentic aerodynamic elements:
   * - Rear Wing (Active multi-element GT wing with swan neck supports OR integrated ducktail decklid lip)
   * - Swept Carbon Front Splitter
   * - Hood Extraction Ducts
   * - Front Fender Louvres
   * - Rear Underbody Diffuser with vertical fins
   */
  private static buildAerodynamics(
    spec: ParametricVehicleGeometry,
    carbonMaterial: THREE.Material
  ): THREE.Group {
    const aero = new THREE.Group();
    const aeroSpec = spec.geometry.aerodynamics;
    const rawSections = spec.geometry.body_shell.longitudinal_sections;
    const sections = [...rawSections].sort((a, b) => b.z_m - a.z_m);

    const frontSec = sections[0];
    const rearSec = sections[sections.length - 1];

    const roofSecs = sections.filter(s => s.roof_half_width_m > 0.05);
    const rearRoof = roofSecs.length > 0 ? roofSecs[roofSecs.length - 1] : sections[Math.floor(sections.length / 2)];
    const rearRoofIdx = sections.indexOf(rearRoof);
    const deckSec = rearRoofIdx < sections.length - 1 ? sections[rearRoofIdx + 1] : rearSec;

    // 1. REAR WING / DECKLID SPOILER
    const wingSpec = aeroSpec?.rear_wing;
    const wingSpan = wingSpec?.span_m ?? (rearSec.half_width_m * 1.85);
    const mainChord = wingSpec?.chord_m ?? 0.32;
    const upperChord = wingSpec?.upper_element_chord_m ?? 0.20;
    const supportCount = wingSpec?.support_count ?? (mainChord > 0.2 ? 2 : 0);

    const deckZ = (deckSec.z_m + rearSec.z_m) * 0.5;
    const deckY = Math.max(deckSec.upper_center_y_m, rearSec.upper_center_y_m);

    if (supportCount === 0) {
      // Integrated Ducktail / Decklid Lip Spoiler
      const lipShape = new THREE.Shape();
      const hmc = Math.max(0.06, mainChord) / 2;
      lipShape.moveTo(-hmc, 0);
      lipShape.quadraticCurveTo(0, 0.04, hmc, 0.035);
      lipShape.lineTo(hmc, 0.015);
      lipShape.quadraticCurveTo(0, -0.01, -hmc, 0);

      const lipGeo = new THREE.ExtrudeGeometry(lipShape, {
        steps: 3,
        depth: wingSpan,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.008,
        bevelSegments: 2
      });
      lipGeo.center();
      lipGeo.rotateY(Math.PI / 2);
      lipGeo.computeVertexNormals();

      const lipMesh = new THREE.Mesh(lipGeo, carbonMaterial);
      lipMesh.name = 'aero_rear_wing_main_blade';
      lipMesh.position.set(0, deckY + 0.01, deckZ - 0.05);
      lipMesh.rotation.x = -0.18; // Aerodynamic kick-up angle
      lipMesh.castShadow = true;
      aero.add(lipMesh);
    } else {
      // Elevated High-Downforce Multi-Element Wing
      const wingPlacementZ = rearSec.z_m + 0.15;
      const wingPlacementY = deckY + 0.38;

      // Main Lower Airfoil Blade
      const mainBladeShape = new THREE.Shape();
      const hmc = mainChord / 2;
      mainBladeShape.moveTo(-hmc, 0);
      mainBladeShape.quadraticCurveTo(0, 0.045, hmc, 0.01);
      mainBladeShape.lineTo(hmc, -0.01);
      mainBladeShape.quadraticCurveTo(0, -0.02, -hmc, 0);

      const mainBladeGeo = new THREE.ExtrudeGeometry(mainBladeShape, {
        steps: 4,
        depth: wingSpan,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.01,
        bevelSegments: 3
      });
      mainBladeGeo.center();
      mainBladeGeo.rotateY(Math.PI / 2);
      mainBladeGeo.computeVertexNormals();

      const mainBladeMesh = new THREE.Mesh(mainBladeGeo, carbonMaterial);
      mainBladeMesh.name = 'aero_rear_wing_main_blade';
      mainBladeMesh.position.set(0, wingPlacementY, wingPlacementZ);
      mainBladeMesh.rotation.x = -0.08;
      mainBladeMesh.castShadow = true;
      aero.add(mainBladeMesh);

      // Upper Flap (Active Aero / DRS Blade)
      if (upperChord > 0.05) {
        const upperBladeShape = new THREE.Shape();
        const huc = upperChord / 2;
        upperBladeShape.moveTo(-huc, 0);
        upperBladeShape.quadraticCurveTo(0, 0.035, huc, 0.008);
        upperBladeShape.lineTo(huc, -0.008);
        upperBladeShape.quadraticCurveTo(0, -0.015, -huc, 0);

        const upperBladeGeo = new THREE.ExtrudeGeometry(upperBladeShape, {
          steps: 4,
          depth: wingSpan * 0.98,
          bevelEnabled: true,
          bevelThickness: 0.01,
          bevelSize: 0.008,
          bevelSegments: 2
        });
        upperBladeGeo.center();
        upperBladeGeo.rotateY(Math.PI / 2);
        upperBladeGeo.computeVertexNormals();

        const upperBladeMesh = new THREE.Mesh(upperBladeGeo, carbonMaterial);
        upperBladeMesh.name = 'aero_rear_wing_upper_flap';
        upperBladeMesh.position.set(0, wingPlacementY + 0.09, wingPlacementZ - 0.05);
        upperBladeMesh.rotation.x = -0.16;
        upperBladeMesh.castShadow = true;
        aero.add(upperBladeMesh);
      }

      // Swan-Neck Supports
      const pylonSpacing = Math.min(0.48, wingSpan * 0.28);
      [-pylonSpacing, pylonSpacing].forEach((sx, idx) => {
        const pylonCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sx, deckY, deckZ + 0.12),
          new THREE.Vector3(sx, deckY + 0.24, deckZ),
          new THREE.Vector3(sx, wingPlacementY + 0.12, wingPlacementZ + 0.04),
          new THREE.Vector3(sx, wingPlacementY + 0.06, wingPlacementZ)
        ]);

        const pylonGeo = new THREE.TubeGeometry(pylonCurve, 16, 0.02, 8, false);
        pylonGeo.computeVertexNormals();
        const pylonMesh = new THREE.Mesh(pylonGeo, carbonMaterial);
        pylonMesh.name = `aero_swan_neck_pylon_${idx === 0 ? 'left' : 'right'}`;
        pylonMesh.castShadow = true;
        aero.add(pylonMesh);
      });

      // Endplates
      const endplateShape = new THREE.Shape();
      endplateShape.moveTo(-0.24, -0.12);
      endplateShape.lineTo(0.24, -0.10);
      endplateShape.lineTo(0.22, 0.14);
      endplateShape.lineTo(-0.20, 0.16);
      endplateShape.closePath();

      const endplateGeo = new THREE.ExtrudeGeometry(endplateShape, {
        depth: 0.012,
        bevelEnabled: true,
        bevelThickness: 0.004,
        bevelSize: 0.004,
        bevelSegments: 2
      });
      endplateGeo.center();
      endplateGeo.computeVertexNormals();

      [-wingSpan / 2, wingSpan / 2].forEach((ex, idx) => {
        const endplateMesh = new THREE.Mesh(endplateGeo, carbonMaterial);
        endplateMesh.name = `aero_wing_endplate_${idx === 0 ? 'left' : 'right'}`;
        endplateMesh.position.set(ex, wingPlacementY + 0.04, wingPlacementZ);
        endplateMesh.rotation.y = idx === 0 ? 0 : Math.PI;
        endplateMesh.castShadow = true;
        aero.add(endplateMesh);
      });
    }

    // 2. FRONT CARBON SPLITTER
    const splitterWidth = aeroSpec?.front_splitter?.width_m ?? (frontSec.half_width_m * 1.92);
    const splitterZ = aeroSpec?.front_splitter?.z_m ?? (frontSec.z_m + 0.03);
    const splitterY = (frontSec.lower_y_m ?? 0.12) + 0.02;

    const splitterShape = new THREE.Shape();
    const hsw = splitterWidth / 2;
    splitterShape.moveTo(-hsw, 0);
    splitterShape.lineTo(-hsw + 0.12, 0.38);
    splitterShape.quadraticCurveTo(0, 0.46, hsw - 0.12, 0.38);
    splitterShape.lineTo(hsw, 0);
    splitterShape.quadraticCurveTo(0, -0.06, -hsw, 0);

    const splitterGeo = new THREE.ExtrudeGeometry(splitterShape, {
      depth: 0.035,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 2
    });
    splitterGeo.center();
    splitterGeo.computeVertexNormals();

    const splitterMesh = new THREE.Mesh(splitterGeo, carbonMaterial);
    splitterMesh.name = 'aero_front_splitter';
    splitterMesh.position.set(0, splitterY, splitterZ);
    splitterMesh.castShadow = true;
    aero.add(splitterMesh);

    // 3. FRONT HOOD EXTRACTION DUCTS
    const hoodZ = (frontSec.z_m + (sections[2]?.z_m ?? frontSec.z_m)) * 0.5;
    const hoodY = ((sections[1]?.upper_center_y_m ?? 0.75) + (sections[2]?.upper_center_y_m ?? 0.78)) * 0.5;
    [-0.24, 0.24].forEach((hx, idx) => {
      const ventGeo = new THREE.BoxGeometry(0.16, 0.02, 0.36);
      ventGeo.computeVertexNormals();
      const ventMesh = new THREE.Mesh(ventGeo, carbonMaterial);
      ventMesh.name = `aero_hood_vent_${idx === 0 ? 'left' : 'right'}`;
      ventMesh.position.set(hx, hoodY + 0.01, hoodZ);
      ventMesh.rotation.x = -0.28;
      aero.add(ventMesh);
    });

    // 4. FRONT FENDER EXTRACTION LOUVRES
    const fenderSec = sections[2] || sections[1];
    [-fenderSec.half_width_m * 0.88, fenderSec.half_width_m * 0.88].forEach((fx, idx) => {
      const louvreGroup = new THREE.Group();
      louvreGroup.name = `aero_fender_louvres_${idx === 0 ? 'left' : 'right'}`;

      for (let i = 0; i < 4; i++) {
        const slatGeo = new THREE.BoxGeometry(0.08, 0.012, 0.06);
        const slat = new THREE.Mesh(slatGeo, carbonMaterial);
        slat.position.set(0, i * 0.025, i * 0.07);
        slat.rotation.x = 0.35;
        louvreGroup.add(slat);
      }
      louvreGroup.position.set(fx, fenderSec.shoulder_y_m + 0.04, fenderSec.z_m);
      aero.add(louvreGroup);
    });

    // 5. REAR UNDERBODY DIFFUSER
    const diffuserWidth = rearSec.half_width_m * 1.76;
    const diffuserZ = rearSec.z_m + 0.06;
    const diffuserY = (rearSec.lower_y_m ?? 0.14) + 0.04;
    const finCount = aeroSpec?.rear_diffuser?.fin_count ?? 5;

    const diffuserBaseGeo = new THREE.BoxGeometry(diffuserWidth, 0.035, 0.42);
    const diffuserMesh = new THREE.Mesh(diffuserBaseGeo, carbonMaterial);
    diffuserMesh.name = 'aero_rear_diffuser';
    diffuserMesh.position.set(0, diffuserY, diffuserZ);
    diffuserMesh.rotation.x = 0.14;
    diffuserMesh.castShadow = true;
    aero.add(diffuserMesh);

    // Vertical Diffuser Fins
    if (finCount > 1) {
      const finSpacing = diffuserWidth / (finCount - 1);
      for (let f = 0; f < finCount; f++) {
        const finX = -diffuserWidth / 2 + f * finSpacing;
        const finGeo = new THREE.BoxGeometry(0.018, 0.09, 0.40);
        const fin = new THREE.Mesh(finGeo, carbonMaterial);
        fin.position.set(finX, diffuserY - 0.02, diffuserZ);
        fin.rotation.x = 0.14;
        aero.add(fin);
      }
    }

    return aero;
  }

  /**
   * Builds the 4 staggered performance wheels according to the JSON specification:
   * Front: 20" diameter (R=0.35025m), 275/35 ZR 20, 10J x 20 ET 45
   * Rear:  21" diameter (R=0.36720m), 335/30 ZR 21, 13J x 21 ET 31
   */
  private static buildWheels(
    spec: ParametricVehicleGeometry,
    rimColorHex: string | number,
    wireframe: boolean = false
  ): THREE.Group {
    const wheels = new THREE.Group();

    for (const w of spec.geometry.wheels) {
      const radius = w.tire.calculated_radius_m ?? (w.axle === 'front' ? 0.35025 : 0.3672);
      const width = w.rim.width_m ?? (w.axle === 'front' ? 0.254 : 0.3302);
      const isRight = w.side === 'right';

      const wheelAssembly = WheelGenerator.generateWheel({
        wheelRadius: radius,
        tyreWidth: width,
        camberDeg: w.axle === 'front' ? -0.035 : -0.045,
        steerDeg: 0,
        isRightSide: isRight,
        rimColorHex: rimColorHex
      });

      wheelAssembly.group.name = `wheel_${w.id}`;
      wheelAssembly.group.position.set(w.center_m.x, w.center_m.y, w.center_m.z);
      wheels.add(wheelAssembly.group);
    }

    return wheels;
  }

  /**
   * Builds front projector headlights, rear LED light bar, and dual/quad exhaust tips
   * Dynamically positioned according to the vehicle's actual front and rear sections
   */
  private static buildLighting(spec: ParametricVehicleGeometry): THREE.Group {
    const lights = new THREE.Group();
    const rawSections = spec.geometry.body_shell.longitudinal_sections;
    if (!rawSections || rawSections.length < 2) return lights;

    const sections = [...rawSections].sort((a, b) => b.z_m - a.z_m);
    const frontSec = sections[1] || sections[0];
    const rearSec = sections[sections.length - 2] || sections[sections.length - 1];

    // 4-Point LED Headlamps
    const headlampMat = new THREE.MeshStandardMaterial({
      color: 0xEEF5FF,
      emissive: 0xEEF5FF,
      emissiveIntensity: 0.95,
      roughness: 0.1
    });

    const headX = frontSec.half_width_m * 0.72;
    const headY = frontSec.shoulder_y_m + 0.02;
    const headZ = frontSec.z_m - 0.02;

    [-headX, headX].forEach(hx => {
      const lampHousing = new THREE.Group();
      lampHousing.position.set(hx, headY, headZ);

      // 4 Projector Points
      [
        [-0.03, -0.02],
        [0.03, -0.02],
        [-0.03, 0.02],
        [0.03, 0.02]
      ].forEach(([dx, dy]) => {
        const dotGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.02, 12);
        dotGeo.rotateX(Math.PI / 2);
        const dot = new THREE.Mesh(dotGeo, headlampMat);
        dot.position.set(dx, dy, 0);
        lampHousing.add(dot);
      });

      lights.add(lampHousing);
    });

    // Rear Full-Width LED Light Bar
    const taillightMat = new THREE.MeshStandardMaterial({
      color: 0xFF1744,
      emissive: 0xFF1744,
      emissiveIntensity: 1.0,
      roughness: 0.2
    });

    const lightBarWidth = rearSec.half_width_m * 1.76;
    const lightBarGeo = new THREE.BoxGeometry(lightBarWidth, 0.028, 0.04);
    const lightBar = new THREE.Mesh(lightBarGeo, taillightMat);
    lightBar.name = 'lighting_rear_light_bar';
    lightBar.position.set(0, rearSec.shoulder_y_m, rearSec.z_m + 0.02);
    lights.add(lightBar);

    // Quad Polished Exhaust Tips
    const exhaustMat = new THREE.MeshStandardMaterial({
      color: 0x2A2C30,
      metalness: 0.92,
      roughness: 0.18
    });

    const exhaustY = rearSec.lower_y_m + 0.10;
    const exhaustZ = rearSec.z_m - 0.02;
    [-0.22, -0.12, 0.12, 0.22].forEach((ex, idx) => {
      const tipGeo = new THREE.CylinderGeometry(0.038, 0.040, 0.10, 16);
      tipGeo.rotateX(Math.PI / 2);
      const tip = new THREE.Mesh(tipGeo, exhaustMat);
      tip.name = `exhaust_tip_${idx + 1}`;
      tip.position.set(ex, exhaustY, exhaustZ);
      lights.add(tip);
    });

    return lights;
  }
}

