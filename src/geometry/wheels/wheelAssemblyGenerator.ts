import * as THREE from 'three';
import { WheelAssemblySpec } from '../types';

export interface CornerWheelOptions {
  axle: 'front' | 'rear';
  side: 'left' | 'right';
  trackWidthM: number;
  axleZM: number; // longitudinal position relative to origin
  materials: {
    tyre: THREE.Material;
    rim: THREE.Material;
    brakeDisc: THREE.Material;
    brakeCaliper: THREE.Material;
  };
}

export class WheelAssemblyGenerator {
  /**
   * Generates a fully detailed, physically integrated 4-corner wheel assembly
   */
  public static buildCornerAssembly(
    spec: WheelAssemblySpec,
    opts: CornerWheelOptions
  ): THREE.Group {
    const group = new THREE.Group();
    const cornerId = `wheel_${opts.axle === 'front' ? 'f' : 'r'}${opts.side === 'left' ? 'l' : 'r'}`;
    group.name = cornerId;

    // 1. Calculate Dimensional Geometry
    const rimRadiusM = (spec.rimDiameterInches * 0.0254) / 2;
    const rimWidthM = (spec.rimWidthInches * 0.0254);
    const sectionWidthM = spec.nominalSectionWidthMm / 1000;
    const sidewallHeightM = sectionWidthM * (spec.aspectRatio / 100);
    const outerRadiusM = rimRadiusM + sidewallHeightM;
    const offsetM = (spec.offsetMm / 1000);

    const isLeft = opts.side === 'left';
    const xPos = isLeft ? (opts.trackWidthM / 2) : -(opts.trackWidthM / 2);
    const yPos = outerRadiusM; // Ground contact: bottom of tyre touches exactly y = 0
    const zPos = opts.axleZM;

    group.position.set(xPos, yPos, zPos);
    group.rotation.y = isLeft ? 0 : Math.PI; // Face outwards

    // 2. Tyre Mesh (Lathe Profile with Sidewall Bulge & Rounded Shoulder)
    const tyreMesh = this.buildTyreMesh(rimRadiusM, outerRadiusM, sectionWidthM, opts.materials.tyre);
    tyreMesh.name = `${cornerId}_tyre`;
    group.add(tyreMesh);

    // 3. Rim Barrel & Lip
    const rimMesh = this.buildRimMesh(rimRadiusM, rimWidthM, offsetM, spec.spokeStyle, opts.materials.rim);
    rimMesh.name = `${cornerId}_rim`;
    group.add(rimMesh);

    // 4. Brake Assembly (Ventilated Rotor & Monobloc Caliper)
    const brakeGroup = this.buildBrakeAssembly(rimRadiusM, spec.brakeDiscType, opts.materials.brakeDisc, opts.materials.brakeCaliper);
    brakeGroup.name = `${cornerId}_brakes`;
    group.add(brakeGroup);

    // 5. Store Metadata
    group.userData = {
      isWheelAssembly: true,
      componentId: cornerId,
      cornerId,
      axle: opts.axle,
      side: opts.side,
      outerRadiusM,
      rollingRadiusM: outerRadiusM,
      groundContactY: 0.0,
      rimDiameterInches: spec.rimDiameterInches,
      tireSpec: `${spec.nominalSectionWidthMm}/${spec.aspectRatio} R ${spec.rimDiameterInches}`
    };

    return group;
  }

  /**
   * Generates a realistic tyre with curved sidewall and shoulder using lathe geometry
   */
  private static buildTyreMesh(
    rimR: number,
    outerR: number,
    width: number,
    material: THREE.Material
  ): THREE.Mesh {
    const halfW = width / 2;
    const points: THREE.Vector2[] = [];

    // In Three.js LatheGeometry:
    // x = distance from rotation axis (radial direction)
    // y = position along rotation axis (axial direction)
    // When rotated around Z by -PI/2:
    // x becomes axial (width along car axle)
    // y becomes radial (height from hub center)

    // Inner bead at rim edge (inner side of tyre)
    points.push(new THREE.Vector2(rimR, -halfW * 0.75));

    // Lower inner sidewall
    points.push(new THREE.Vector2(rimR + (outerR - rimR) * 0.25, -halfW * 0.95));

    // Inner sidewall bulge apex
    points.push(new THREE.Vector2(rimR + (outerR - rimR) * 0.55, -halfW * 1.05));

    // Upper inner sidewall towards shoulder
    points.push(new THREE.Vector2(rimR + (outerR - rimR) * 0.85, -halfW * 0.98));

    // Inner rounded shoulder
    points.push(new THREE.Vector2(outerR * 0.985, -halfW * 0.82));

    // Tread surface center (apex of outer radius)
    points.push(new THREE.Vector2(outerR, 0));

    // Outer rounded shoulder
    points.push(new THREE.Vector2(outerR * 0.985, halfW * 0.82));

    // Upper outer sidewall
    points.push(new THREE.Vector2(rimR + (outerR - rimR) * 0.85, halfW * 0.98));

    // Outer sidewall bulge apex
    points.push(new THREE.Vector2(rimR + (outerR - rimR) * 0.55, halfW * 1.05));

    // Lower outer sidewall
    points.push(new THREE.Vector2(rimR + (outerR - rimR) * 0.25, halfW * 0.95));

    // Outer bead at rim edge
    points.push(new THREE.Vector2(rimR, halfW * 0.75));

    const lathe = new THREE.LatheGeometry(points, 32);
    lathe.computeVertexNormals();

    // Rotate so lathe axis matches wheel axle (along X-axis)
    lathe.rotateZ(-Math.PI / 2);

    return new THREE.Mesh(lathe, material);
  }

  /**
   * Generates rim barrel, outer lip, and spoke architecture
   */
  private static buildRimMesh(
    rimR: number,
    width: number,
    offsetM: number,
    style: WheelAssemblySpec['spokeStyle'],
    material: THREE.Material
  ): THREE.Group {
    const group = new THREE.Group();

    // Outer rim barrel cylinder
    const barrelGeo = new THREE.CylinderGeometry(rimR, rimR * 0.96, width, 32, 1, true);
    barrelGeo.rotateZ(Math.PI / 2);
    barrelGeo.computeVertexNormals();
    const barrel = new THREE.Mesh(barrelGeo, material);
    group.add(barrel);

    // Outer deep-dish stepped lip
    const lipGeo = new THREE.TorusGeometry(rimR * 0.98, 0.012, 16, 32);
    lipGeo.rotateY(Math.PI / 2);
    const lip = new THREE.Mesh(lipGeo, material);
    lip.position.x = width * 0.44;
    group.add(lip);

    // Outer spoke plane position (outboard towards viewer)
    const spokePlaneX = width * 0.40 - offsetM * 0.15;

    // Central hub
    const hubR = rimR * 0.24;
    const hubGeo = new THREE.CylinderGeometry(hubR, hubR, 0.03, 24);
    hubGeo.rotateZ(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeo, material);
    hub.position.x = spokePlaneX;
    group.add(hub);

    // Center-lock nut or lug circle
    const centerNutGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.03, 6);
    centerNutGeo.rotateZ(Math.PI / 2);
    const centerNut = new THREE.Mesh(centerNutGeo, material);
    centerNut.position.x = spokePlaneX + 0.015;
    group.add(centerNut);

    // Spokes based on style
    const spokeCount = style === 'gt_mesh' ? 10 : style === '5_spoke' ? 5 : 7;
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i * 2 * Math.PI) / spokeCount;

      const spokeGeo = new THREE.BoxGeometry(0.018, rimR * 0.72, 0.022);
      const spoke = new THREE.Mesh(spokeGeo, material);

      spoke.position.x = spokePlaneX;
      spoke.position.y = Math.cos(angle) * (rimR * 0.52);
      spoke.position.z = Math.sin(angle) * (rimR * 0.52);
      spoke.rotation.x = -angle;

      group.add(spoke);

      if (style === 'center_lock_y_spoke' || style === 'gt_mesh') {
        // Y-split spoke branch
        const branchGeo = new THREE.BoxGeometry(0.014, rimR * 0.35, 0.016);
        const branchL = new THREE.Mesh(branchGeo, material);
        branchL.position.x = spokePlaneX;
        branchL.position.y = Math.cos(angle - 0.12) * (rimR * 0.75);
        branchL.position.z = Math.sin(angle - 0.12) * (rimR * 0.75);
        branchL.rotation.x = -(angle - 0.12);
        group.add(branchL);

        const branchR = new THREE.Mesh(branchGeo, material);
        branchR.position.x = spokePlaneX;
        branchR.position.y = Math.cos(angle + 0.12) * (rimR * 0.75);
        branchR.position.z = Math.sin(angle + 0.12) * (rimR * 0.75);
        branchR.rotation.x = -(angle + 0.12);
        group.add(branchR);
      }
    }

    return group;
  }

  /**
   * Generates cross-drilled ventilated rotor disc & monobloc performance brake caliper
   */
  private static buildBrakeAssembly(
    rimR: number,
    discType: 'carbon_ceramic' | 'drilled_steel',
    discMat: THREE.Material,
    caliperMat: THREE.Material
  ): THREE.Group {
    const group = new THREE.Group();

    // Brake Rotor Disc positioned behind the spokes (inboard)
    const rotorR = rimR * 0.74;
    const rotorThick = 0.022;
    const rotorGeo = new THREE.CylinderGeometry(rotorR, rotorR, rotorThick, 32);
    rotorGeo.rotateZ(Math.PI / 2);
    const rotor = new THREE.Mesh(rotorGeo, discMat);
    rotor.position.x = 0.01;
    group.add(rotor);

    // Multi-piston Monobloc Caliper (clamped to upper front quadrant)
    const caliperWidth = 0.045;
    const caliperHeight = rotorR * 0.55;
    const caliperDepth = 0.08;

    const caliperGeo = new THREE.BoxGeometry(caliperWidth, caliperHeight, caliperDepth);
    const caliper = new THREE.Mesh(caliperGeo, caliperMat);

    caliper.position.set(0.025, rotorR * 0.65, rotorR * 0.40);
    caliper.rotation.x = -Math.PI / 6;

    group.add(caliper);

    return group;
  }
}
