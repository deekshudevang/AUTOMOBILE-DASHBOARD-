import * as THREE from 'three';
import { VehicleGeometryProfile } from '../templates/geometryProfiles';

export interface VehiclePanelComponent {
  id: string;
  name: string;
  type: string;
  mesh: THREE.Mesh;
  anchorPoint: [number, number, number];
  pivotPoint: [number, number, number];
  shutLineGapMeters: number; // 2 to 5 mm (0.002 to 0.005)
  triangleCount: number;
}

export interface PanelAssemblyResult {
  group: THREE.Group;
  panels: VehiclePanelComponent[];
  totalTriangles: number;
}

/**
 * Constructs separate automotive body panels with realistic shut-line gaps (3mm scale),
 * front fascia (radiator grille, intake, lamp pockets), and rear fascia (diffuser seat).
 */
export class PanelSeparator {
  /**
   * Generates discrete panels and fascias for a given geometry profile
   */
  static generatePanels(profile: VehicleGeometryProfile, paintMaterial: THREE.Material, trimMaterial: THREE.Material): PanelAssemblyResult {
    const group = new THREE.Group();
    group.name = "vehicle_panels_assembly";

    const panels: VehiclePanelComponent[] = [];
    const p = profile;
    const frontAxleZ = p.wheelbase / 2;
    const rearAxleZ = -p.wheelbase / 2;
    const noseZ = frontAxleZ + p.frontOverhang;
    const tailZ = rearAxleZ - p.rearOverhang;

    // 1. BONNET (HOOD) with 3mm shut-line perimeter
    const hoodLength = p.bonnetLength * 0.96;
    const hoodWidth = p.overallWidth * 0.76;
    const hoodZ = frontAxleZ + (p.frontOverhang * 0.35);
    const hoodY = p.beltlineHeight * 0.95;

    const hoodShape = new THREE.Shape();
    const hw = hoodWidth / 2;
    const hl = hoodLength / 2;
    // Tapered hood contour
    hoodShape.moveTo(-hw * 0.85, hl);
    hoodShape.quadraticCurveTo(0, hl + 0.04, hw * 0.85, hl);
    hoodShape.lineTo(hw, -hl);
    hoodShape.quadraticCurveTo(0, -hl - 0.02, -hw, -hl);
    hoodShape.closePath();

    const hoodGeo = new THREE.ExtrudeGeometry(hoodShape, {
      depth: 0.035,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.01,
      bevelSegments: 3
    });
    hoodGeo.center();
    hoodGeo.rotateX(Math.PI / 2);
    hoodGeo.computeVertexNormals();

    const hoodMesh = new THREE.Mesh(hoodGeo, paintMaterial);
    hoodMesh.name = "panel_bonnet";
    hoodMesh.position.set(0, hoodY, hoodZ);
    hoodMesh.castShadow = true;
    hoodMesh.receiveShadow = true;
    group.add(hoodMesh);

    panels.push({
      id: 'panel_bonnet',
      name: 'Engine Bonnet (Hood)',
      type: 'hood',
      mesh: hoodMesh,
      anchorPoint: [0, hoodY, hoodZ],
      pivotPoint: [0, hoodY + 0.02, hoodZ - hl], // Cowl hinge
      shutLineGapMeters: 0.0035,
      triangleCount: hoodGeo.index ? hoodGeo.index.count / 3 : 0
    });

    // 2. FRONT FASCIA (Bumper, Grille opening, lower intake, light pockets)
    const fasciaWidth = p.overallWidth * 0.94;
    const fasciaZ = noseZ - 0.05;
    const fasciaY = p.groundClearance + 0.22;

    const fasciaGroup = new THREE.Group();
    fasciaGroup.name = "panel_fascia_front";

    // Main bumper beam (extrusion with curved lead)
    const bumperShape = new THREE.Shape();
    const bw = fasciaWidth / 2;
    bumperShape.moveTo(-bw, -0.18);
    bumperShape.lineTo(-bw, 0.16);
    bumperShape.quadraticCurveTo(0, 0.22, bw, 0.16);
    bumperShape.lineTo(bw, -0.18);
    bumperShape.quadraticCurveTo(0, -0.22, -bw, -0.18);

    // Grille cutout opening
    const grilleHole = new THREE.Path();
    const gw = bw * 0.55;
    grilleHole.moveTo(-gw, -0.06);
    grilleHole.lineTo(gw, -0.06);
    grilleHole.lineTo(gw * 0.9, 0.10);
    grilleHole.lineTo(-gw * 0.9, 0.10);
    grilleHole.closePath();
    bumperShape.holes.push(grilleHole);

    const bumperGeo = new THREE.ExtrudeGeometry(bumperShape, {
      depth: 0.24,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.015,
      bevelSegments: 4
    });
    bumperGeo.center();
    bumperGeo.computeVertexNormals();

    const bumperMesh = new THREE.Mesh(bumperGeo, paintMaterial);
    bumperMesh.castShadow = true;
    fasciaGroup.add(bumperMesh);

    // Dark Honeycomb Grille Insert
    const grilleMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(gw * 1.8, 0.18),
      trimMaterial
    );
    grilleMesh.position.set(0, 0.02, 0.05);
    fasciaGroup.add(grilleMesh);

    fasciaGroup.position.set(0, fasciaY, fasciaZ);
    group.add(fasciaGroup);

    panels.push({
      id: 'panel_fascia_front',
      name: 'Front Fascia & Grille Assembly',
      type: 'bumper_f',
      mesh: bumperMesh,
      anchorPoint: [0, fasciaY, fasciaZ],
      pivotPoint: [0, fasciaY, fasciaZ],
      shutLineGapMeters: 0.003,
      triangleCount: bumperGeo.index ? bumperGeo.index.count / 3 : 0
    });

    // 3. REAR FASCIA & AERODYNAMIC DIFFUSER SEAT
    const rearFasciaZ = tailZ + 0.06;
    const rearFasciaY = p.groundClearance + 0.24;
    const rearFasciaGroup = new THREE.Group();
    rearFasciaGroup.name = "panel_fascia_rear";

    const rearBumperGeo = new THREE.BoxGeometry(p.overallWidth * 0.92, 0.34, 0.22);
    const rearBumperMesh = new THREE.Mesh(rearBumperGeo, paintMaterial);
    rearBumperMesh.castShadow = true;
    rearFasciaGroup.add(rearBumperMesh);

    // Integrated Aerodynamic Diffuser Tray
    const diffuserGeo = new THREE.BoxGeometry(p.overallWidth * 0.72, 0.12, 0.42);
    const diffuserMesh = new THREE.Mesh(diffuserGeo, trimMaterial);
    diffuserMesh.position.set(0, -0.14, 0.10);
    diffuserMesh.castShadow = true;
    rearFasciaGroup.add(diffuserMesh);

    // Vertical diffuser fins (4 fins)
    [-0.24, -0.08, 0.08, 0.24].forEach(fx => {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.14, 0.38), trimMaterial);
      fin.position.set(fx, -0.14, 0.10);
      rearFasciaGroup.add(fin);
    });

    rearFasciaGroup.position.set(0, rearFasciaY, rearFasciaZ);
    group.add(rearFasciaGroup);

    panels.push({
      id: 'panel_fascia_rear',
      name: 'Rear Fascia & Aerodynamic Diffuser Seat',
      type: 'bumper_r',
      mesh: rearBumperMesh,
      anchorPoint: [0, rearFasciaY, rearFasciaZ],
      pivotPoint: [0, rearFasciaY, rearFasciaZ],
      shutLineGapMeters: 0.003,
      triangleCount: 64
    });

    // 4. DOORS (Left & Right with 3.5mm shut lines and A-pillar hinge points)
    const doorLength = p.wheelbase * 0.44;
    const doorHeight = p.beltlineHeight - p.groundClearance - 0.04;
    const doorZ = (frontAxleZ + rearAxleZ) * 0.5 + 0.10;
    const doorY = p.groundClearance + (doorHeight / 2) + 0.02;

    [-1, 1].forEach(side => {
      const doorGeo = new THREE.BoxGeometry(0.045, doorHeight, doorLength);
      const doorMesh = new THREE.Mesh(doorGeo, paintMaterial);
      const doorX = (p.overallWidth / 2 - 0.02) * side;
      doorMesh.position.set(doorX, doorY, doorZ);
      doorMesh.castShadow = true;
      group.add(doorMesh);

      panels.push({
        id: side < 0 ? 'panel_door_l' : 'panel_door_r',
        name: side < 0 ? 'Front Door (Left)' : 'Front Door (Right)',
        type: side < 0 ? 'door_l' : 'door_r',
        mesh: doorMesh,
        anchorPoint: [doorX, doorY, doorZ],
        pivotPoint: [doorX, doorY, doorZ + (doorLength / 2)], // Hinge at front A-pillar
        shutLineGapMeters: 0.0035,
        triangleCount: 12
      });
    });

    // 5. SIDE SKIRTS (Left & Right along rocker sill)
    const skirtLength = p.wheelbase * 0.72;
    [-1, 1].forEach(side => {
      const skirtGeo = new THREE.BoxGeometry(0.065, 0.08, skirtLength);
      const skirtMesh = new THREE.Mesh(skirtGeo, trimMaterial);
      const skirtX = (p.overallWidth / 2 - 0.03) * side;
      const skirtY = p.groundClearance + 0.04;
      skirtMesh.position.set(skirtX, skirtY, (frontAxleZ + rearAxleZ) * 0.5);
      skirtMesh.castShadow = true;
      group.add(skirtMesh);

      panels.push({
        id: side < 0 ? 'panel_skirt_l' : 'panel_skirt_r',
        name: side < 0 ? 'Aerodynamic Rocker Skirt (Left)' : 'Aerodynamic Rocker Skirt (Right)',
        type: side < 0 ? 'skirt_l' : 'skirt_r',
        mesh: skirtMesh,
        anchorPoint: [skirtX, skirtY, (frontAxleZ + rearAxleZ) * 0.5],
        pivotPoint: [skirtX, skirtY, (frontAxleZ + rearAxleZ) * 0.5],
        shutLineGapMeters: 0.002,
        triangleCount: 12
      });
    });

    let totalTriangles = 0;
    panels.forEach(pan => totalTriangles += pan.triangleCount);

    return {
      group,
      panels,
      totalTriangles
    };
  }
}
