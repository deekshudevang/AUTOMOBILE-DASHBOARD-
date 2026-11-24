import * as THREE from 'three';
import { CoachworkDimensions } from '../types';
import { BrandDesignLanguage } from '../../vehicles/brandDesign/types';
import {
  createNodeRegistrar,
  createCurvedPatch,
  addLicensePlates,
  addDoorMirrors,
  createExhaustAssembly
} from './sharedArchetypeUtils';

export class FrontEngineGtGenerator {
  /**
   * Generates authentic, master-grade Front-Engine Grand Tourer / Sports Coupe coachwork geometry
   * featuring long sculpted bonnet with power bulge, prominent front grille with dark mesh,
   * cab-rearward greenhouse, muscular rear haunches, and quad exhaust diffusers.
   */
  public static build(
    dims: CoachworkDimensions,
    materials: Record<string, THREE.Material>,
    shutLineGapM = 0.0025,
    brand?: BrandDesignLanguage
  ) {
    const reg = createNodeRegistrar('panelized_chassis_assembly');

    const L = dims.overall_length_m;
    const W = dims.overall_width_m;
    const H = dims.overall_height_m;
    const WB = dims.wheelbase_m;
    const halfL = L / 2;
    const halfW = W / 2;
    const frontAxleZ = WB / 2;
    const rearAxleZ = -WB / 2;
    const gcY = dims.ground_clearance_m;

    const paintMat = materials.body_paint;
    const carbonMat = materials.carbon_aero;
    const glassMat = materials.glass;
    const headlightMat = materials.headlight;
    const taillightMat = materials.taillight;
    const interiorMat = materials.interior;

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: '#121418',
      roughness: 0.85,
      metalness: 0.15
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: '#E8ECF2',
      roughness: 0.15,
      metalness: 0.95
    });

    const linerMat = new THREE.MeshStandardMaterial({
      color: '#0E1014',
      roughness: 0.95,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    // GT Proportions: Long bonnet, cab-rearward greenhouse, muscular rear deck
    const Z_NOSE_SHUT = frontAxleZ + 0.70;
    const Z_COWL_SHUT = frontAxleZ - 0.45; // Long bonnet!
    const Z_ROOF_FRONT = 0.10;
    const Z_ROOF_REAR = -0.55;
    const Z_DOOR_REAR = rearAxleZ + 0.35;
    const Z_DECK_FRONT = rearAxleZ + 0.15;
    const Z_DECK_TAIL = -halfL + 0.35;

    const frontTyreRadius = 0.350;
    const rearTyreRadius = 0.360;
    const frontArchRadius = 0.380;
    const rearArchRadius = 0.395;

    // 1. Underfloor Chassis Floor Pan
    const floorMesh = createCurvedPatch(24, 12, (u, v) => {
      const vn = v * 2 - 1;
      const z = (halfL - 0.12) - u * (L - 0.24);
      const floorHalfW = halfW * 0.85;
      const x = vn * floorHalfW;
      const y = gcY;
      return new THREE.Vector3(x, y, z);
    }, linerMat, H * 0.45);
    reg.addNode(floorMesh, 'chassis_floor_pan', 'cockpit' as any, undefined, [0, gcY, 0]);

    // 2. Long Sculpted GT Bonnet with Power Bulge & Side Heat Extractors
    const hoodMesh = createCurvedPatch(26, 22, (u, v) => {
      const z = Z_COWL_SHUT + (Z_NOSE_SHUT - Z_COWL_SHUT) * u;
      const vn = v * 2 - 1;
      const hoodHalfW = (0.700 - 0.120 * u) - shutLineGapM;
      const x = vn * hoodHalfW;
      const spineY = 0.740 - 0.140 * u;
      const powerBulge = 0.024 * Math.cos(vn * Math.PI) * Math.sin(u * Math.PI);
      const crown = 0.015 * (1 - vn ** 2);
      const y = spineY + powerBulge + crown;
      return new THREE.Vector3(x, y, z);
    }, paintMat, H * 0.45);
    reg.addNode(hoodMesh, 'hood', 'hood', undefined, [0, 0.68, (Z_COWL_SHUT + Z_NOSE_SHUT) / 2]);

    // Dual Bonnet Heat Extractors
    [-0.24, 0.24].forEach((vx, idx) => {
      const vent = createCurvedPatch(12, 8, (u, v) => {
        const vn = v * 2 - 1;
        const x = vx + vn * 0.065;
        const z = Z_COWL_SHUT + 0.30 + u * 0.35;
        const y = 0.710 - 0.040 * u - 0.015 * (1 - vn ** 2);
        return new THREE.Vector3(x, y, z);
      }, carbonMat, H * 0.45);
      const ventId = idx === 0 ? 'aero_hood_vent_l' : 'aero_hood_vent_r';
      reg.addNode(vent, ventId, 'hood' as any, 'hood', [vx, 0.69, Z_COWL_SHUT + 0.48]);
    });

    // 3. Front Fenders with Side Air Breather Gills
    const createFrontFender = (isLeft: boolean) => {
      const side = isLeft ? 1 : -1;
      return createCurvedPatch(28, 24, (u, v) => {
        const z = Z_COWL_SHUT + (Z_NOSE_SHUT - Z_COWL_SHUT) * u;
        const dz = z - frontAxleZ;
        const inArchZone = Math.abs(dz) < frontArchRadius;
        const rockerY = gcY + 0.025;

        let archCutoutY = frontTyreRadius;
        if (inArchZone) {
          const archVal = frontArchRadius * frontArchRadius - dz * dz;
          archCutoutY = frontTyreRadius + Math.sqrt(Math.max(0, archVal)) * 0.86;
        } else if (dz > 0) {
          const fProg = Math.min(1.0, (dz - frontArchRadius) / Math.max(0.01, Z_NOSE_SHUT - (frontAxleZ + frontArchRadius)));
          archCutoutY = frontTyreRadius - (frontTyreRadius - rockerY) * (fProg ** 0.85);
        } else {
          const rProg = Math.min(1.0, (-dz - frontArchRadius) / Math.max(0.01, (frontAxleZ - frontArchRadius) - Z_COWL_SHUT));
          archCutoutY = frontTyreRadius - (frontTyreRadius - rockerY) * (rProg ** 0.85);
        }

        const innerX = side * (0.700 - 0.120 * u + (isLeft ? shutLineGapM : -shutLineGapM));
        const crestX = side * (halfW * 0.88 - 0.060 * u);
        const crestY = 0.770 - 0.110 * u + 0.020 * Math.sin(u * Math.PI);

        let x = 0;
        let y = 0;
        if (v <= 0.45) {
          const t = v / 0.45;
          x = innerX + (crestX - innerX) * t;
          const innerY = 0.740 - 0.140 * u;
          y = innerY + (crestY - innerY) * (t ** 0.85);
        } else {
          const t = (v - 0.45) / 0.55;
          const wheelProgress = Math.max(0, 1 - Math.abs(dz) / frontArchRadius);
          const flare = 0.038 * Math.sin(wheelProgress * (Math.PI / 2)) * Math.sin(t * Math.PI);
          const outerX = side * (halfW * 0.90 + flare);
          x = crestX + (outerX - crestX) * t;
          y = crestY - (crestY - archCutoutY) * (t ** 0.92);
        }
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
    };
    reg.addNode(createFrontFender(true), 'fender_front_l', 'fender_front_l', undefined, [halfW * 0.86, 0.55, frontAxleZ]);
    reg.addNode(createFrontFender(false), 'fender_front_r', 'fender_front_r', undefined, [-halfW * 0.86, 0.55, frontAxleZ]);

    // Front Wheel Liners
    [-1, 1].forEach((side) => {
      const tub = createCurvedPatch(20, 10, (u, v) => {
        const theta = (u - 0.5) * Math.PI * 0.90;
        const z = frontAxleZ + Math.sin(theta) * (frontArchRadius - 0.005);
        const y = frontTyreRadius + Math.cos(theta) * (frontArchRadius - 0.005);
        const x = side * (halfW * 0.88 - v * 0.26);
        return new THREE.Vector3(x, y, z);
      }, linerMat, H * 0.45);
      const tubId = side === 1 ? 'wheel_tub_fl' : 'wheel_tub_fr';
      reg.addNode(tub, tubId, 'fender_front_l' as any, undefined, [side * halfW * 0.80, frontTyreRadius, frontAxleZ]);
    });

    // 4. Prominent Front Grille Fascia with Dark Chrome Slats & Carbon Splitter
    const fBumperMesh = createCurvedPatch(28, 24, (u, v) => {
      const un = u * 2 - 1;
      const angle = un * (Math.PI / 2.16);
      const radiusX = halfW * 0.89;
      const x = Math.sin(angle) * radiusX;
      const maxForwardProj = (halfL - Z_NOSE_SHUT) * Math.cos(angle);

      let startY = 0.600;
      let forwardZ = 0;

      if (v < 0.35) {
        // Starts flush at shut line (forwardZ=0) and arches forward over bumper bar
        const t = v / 0.35;
        startY = 0.600 - 0.080 * (t ** 0.85);
        forwardZ = maxForwardProj * Math.sin(t * Math.PI * 0.5);
      } else if (v < 0.75) {
        const t = (v - 0.35) / 0.40;
        startY = 0.520 - 0.280 * t;
        // Large central GT mouth grille recess
        const isGrille = Math.abs(un) < 0.52;
        const intakeRecess = isGrille ? 0.080 * Math.sin(t * Math.PI) : 0.020;
        forwardZ = maxForwardProj - intakeRecess;
      } else {
        const t = (v - 0.75) / 0.25;
        startY = 0.240 - (0.240 - (gcY + 0.015)) * t;
        forwardZ = maxForwardProj * (0.92 + 0.08 * t);
      }

      if (Math.abs(un) > 0.86) {
        const cProg = (Math.abs(un) - 0.86) / 0.14;
        startY = Math.max(startY, gcY + 0.015 + (0.46 - gcY) * cProg * (1 - v * 0.5));
      }

      const z = Z_NOSE_SHUT + forwardZ;
      return new THREE.Vector3(x, startY, z);
    }, paintMat, H * 0.45);
    reg.addNode(fBumperMesh, 'front_bumper', 'front_bumper', undefined, [0, 0.40, halfL - 0.12]);

    // Central GT Radiator Grille
    const centerGrille = createCurvedPatch(16, 10, (u, v) => {
      const un = u * 2 - 1;
      const x = un * 0.42;
      const y = 0.480 - v * 0.240;
      const z = halfL - 0.12 - 0.04 * (1 - un ** 2);
      return new THREE.Vector3(x, y, z);
    }, darkTrimMat, H * 0.45);
    reg.addNode(centerGrille, 'radiator_grille_center', 'front_bumper' as any, 'front_bumper', [0, 0.36, halfL - 0.14]);

    // Carbon Front Splitter
    const splitterMesh = createCurvedPatch(26, 8, (u, v) => {
      const un = u * 2 - 1;
      const angle = un * (Math.PI / 2.14);
      const radiusX = halfW * 0.92;
      const x = Math.sin(angle) * radiusX;
      const projZ = (halfL - Z_NOSE_SHUT) * Math.cos(angle) + 0.018 * (1 - v);
      const z = Z_NOSE_SHUT + projZ;
      const y = gcY + 0.010 + v * 0.018;
      return new THREE.Vector3(x, y, z);
    }, carbonMat, H * 0.45);
    reg.addNode(splitterMesh, 'front_splitter', 'front_splitter', 'front_bumper', [0, gcY + 0.015, halfL - 0.08]);

    // Front & Rear License Plates
    addLicensePlates(reg, [0, 0.34, halfL - 0.02], [0, 0.56, -halfL + 0.02]);

    // 5. Sleek Horizontal LED Headlights (Streamlined, Zero BoxGeometry)
    [-0.60, 0.60].forEach((hx, idx) => {
      const hlGroup = new THREE.Group();
      hlGroup.name = idx === 0 ? 'headlight_l' : 'headlight_r';

      const bezelGeo = new THREE.CylinderGeometry(0.045, 0.048, 0.008, 20);
      bezelGeo.scale(1.8, 1.0, 1.1);
      bezelGeo.rotateX(0.15);
      bezelGeo.computeVertexNormals();
      const bezel = new THREE.Mesh(bezelGeo, darkTrimMat);
      hlGroup.add(bezel);

      // Dual Projector Optic Spheres
      const projGeo = new THREE.SphereGeometry(0.022, 16, 14);
      projGeo.scale(1.0, 0.6, 1.0);
      projGeo.computeVertexNormals();
      [-0.038, 0.038].forEach(px => {
        const p = new THREE.Mesh(projGeo, chromeMat);
        p.position.set(px, 0.006, 0.02);
        hlGroup.add(p);
      });

      // Clear Polycarbonate Lens
      const lensGeo = new THREE.CylinderGeometry(0.044, 0.044, 0.004, 20);
      lensGeo.scale(1.75, 1.0, 1.05);
      lensGeo.rotateX(0.15);
      lensGeo.computeVertexNormals();
      const lens = new THREE.Mesh(lensGeo, glassMat);
      lens.position.set(0, 0.008, 0);
      hlGroup.add(lens);

      const hz = Z_NOSE_SHUT - 0.04;
      const hy = 0.660;
      hlGroup.position.set(hx, hy, hz);
      const hlId = idx === 0 ? 'headlight_l' : 'headlight_r';
      reg.addNode(hlGroup, hlId, hlId as any, 'fender_front_l', [hx, hy, hz]);
    });

    // 6. Cab-Rearward Greenhouse (Windshield, A-Pillars, Roof, Rear Backlight Glass, Side Windows)
    const wsMesh = createCurvedPatch(24, 20, (u, v) => {
      const z = Z_COWL_SHUT + (Z_ROOF_FRONT - Z_COWL_SHUT) * u;
      const vn = v * 2 - 1;
      const halfW_ws = (0.58 - 0.08 * u) - shutLineGapM;
      const x = vn * halfW_ws;
      const spineY = 0.740 + (H - 0.020 - 0.740) * Math.sin(u * Math.PI * 0.5);
      const crown = 0.016 * (1 - vn ** 2);
      const y = spineY + crown;
      return new THREE.Vector3(x, y, z);
    }, glassMat, H * 0.45);
    reg.addNode(wsMesh, 'windshield', 'windshield', undefined, [0, H * 0.85, (Z_COWL_SHUT + Z_ROOF_FRONT) / 2]);

    // Structural Watertight A-Pillars Bridging Windshield to Door Cant Rails
    [-1, 1].forEach((side) => {
      const aPillar = createCurvedPatch(16, 8, (u, v) => {
        const z = Z_ROOF_FRONT + (Z_COWL_SHUT - Z_ROOF_FRONT) * u;
        const innerX = side * (0.50 - 0.04 * (1 - u));
        const innerY = (H - 0.020) - ((H - 0.020) - 0.740) * (u ** 0.90);
        const tUp = u;
        const outerX = side * (0.50 + (halfW * 0.88 - 0.50) * tUp);
        const outerY = (H - 0.020) - ((H - 0.020) - 0.740) * (tUp ** 0.92);
        const x = innerX + (outerX - innerX) * v;
        const crown = 0.012 * Math.sin(v * Math.PI);
        const y = innerY + (outerY - innerY) * v + crown;
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
      const apId = side === 1 ? 'a_pillar_l' : 'a_pillar_r';
      reg.addNode(aPillar, apId, 'roof' as any, 'roof', [side * halfW * 0.65, 0.96, (Z_COWL_SHUT + Z_ROOF_FRONT) / 2]);
    });

    // Roof
    const roofMesh = createCurvedPatch(24, 22, (u, v) => {
      const z = Z_ROOF_FRONT + (Z_ROOF_REAR - Z_ROOF_FRONT) * u;
      const vn = v * 2 - 1;
      const roofHalfW = 0.50 - shutLineGapM;
      const x = vn * roofHalfW;
      const centerU = (z - (-0.20)) / 0.35;
      const longitudinal = (H - 0.020) - 0.012 * (centerU ** 2);
      const lateral = -0.012 * (vn ** 2);
      const y = longitudinal + lateral;
      return new THREE.Vector3(x, y, z);
    }, paintMat, H * 0.45);
    reg.addNode(roofMesh, 'roof', 'roof', undefined, [0, H, (Z_ROOF_FRONT + Z_ROOF_REAR) / 2]);

    // Sloping Rear Backlight Glass
    const rwMesh = createCurvedPatch(24, 20, (u, v) => {
      const z = Z_ROOF_REAR + (Z_DECK_FRONT - Z_ROOF_REAR) * u;
      const vn = v * 2 - 1;
      const rwHalfW = (0.50 + 0.06 * u) - shutLineGapM;
      const x = vn * rwHalfW;
      const spineY = (H - 0.020) - ((H - 0.020) - 0.880) * (u ** 1.15);
      const crown = 0.014 * (1 - vn ** 2);
      const y = spineY + crown;
      return new THREE.Vector3(x, y, z);
    }, glassMat, H * 0.45);
    reg.addNode(rwMesh, 'rear_glass', 'rear_glass', undefined, [0, 1.05, (Z_ROOF_REAR + Z_DECK_FRONT) / 2]);

    // Flush Side Windows (Tapering along A-pillar in front and C-pillar in rear)
    [-1, 1].forEach((side) => {
      const swMesh = createCurvedPatch(24, 18, (u, v) => {
        const z = Z_COWL_SHUT + (Z_DOOR_REAR - Z_COWL_SHUT) * u;
        const beltY = 0.740;
        let roofY = (H - 0.020) - 0.035 * Math.sin(u * Math.PI);
        let roofX = side * 0.50;

        if (z > Z_ROOF_FRONT) {
          const tUp = (z - Z_ROOF_FRONT) / (Z_COWL_SHUT - Z_ROOF_FRONT);
          roofY = (H - 0.020) - ((H - 0.020) - beltY) * (tUp ** 0.92);
          roofX = side * (0.50 + (halfW * 0.88 - 0.50) * tUp);
        } else if (z < Z_ROOF_REAR) {
          const tDown = (Z_ROOF_REAR - z) / (Z_ROOF_REAR - Z_DOOR_REAR);
          roofY = (H - 0.020) - ((H - 0.020) - beltY) * (tDown ** 0.88);
          roofX = side * (0.50 + (halfW * 0.88 - 0.50) * tDown);
        }

        const y = beltY + (roofY - beltY) * v;
        const doorX = side * (halfW * 0.88 - shutLineGapM);
        const x = doorX + (roofX - doorX) * v;
        return new THREE.Vector3(x, y, z);
      }, glassMat, H * 0.45);
      const swId = side === 1 ? 'window_glass_l' : 'window_glass_r';
      reg.addNode(swMesh, swId, 'windshield' as any, 'roof', [side * halfW * 0.75, H * 0.80, 0]);
    });

    // 7. Sculpted Doors with Waist Tumblehome & Character Creases
    const createDoor = (isLeft: boolean) => {
      const side = isLeft ? 1 : -1;
      return createCurvedPatch(24, 22, (u, v) => {
        const z = Z_COWL_SHUT + (Z_DOOR_REAR - Z_COWL_SHUT) * u;
        const beltY = 0.740;
        const rockerY = gcY + 0.050;
        const y = rockerY + (beltY - rockerY) * v;
        const waistTuck = -0.040 * Math.sin(u * Math.PI);
        const verticalTumble = 0.022 * Math.sin(v * Math.PI);
        const x = side * (halfW * 0.90 + waistTuck + verticalTumble - shutLineGapM);
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
    };
    reg.addNode(createDoor(true), 'door_l', 'door_l', undefined, [halfW * 0.88, 0.45, (Z_COWL_SHUT + Z_DOOR_REAR) / 2]);
    reg.addNode(createDoor(false), 'door_r', 'door_r', undefined, [-halfW * 0.88, 0.45, (Z_COWL_SHUT + Z_DOOR_REAR) / 2]);

    // Rocker Sills
    [-1, 1].forEach((side) => {
      const sill = createCurvedPatch(20, 8, (u, v) => {
        const z = Z_COWL_SHUT + 0.06 + (Z_DOOR_REAR - Z_COWL_SHUT - 0.12) * u;
        const x = side * (halfW * 0.89 + 0.035 * v);
        const y = gcY + 0.015 + v * 0.055;
        return new THREE.Vector3(x, y, z);
      }, carbonMat, H * 0.45);
      const sillId = side === 1 ? 'side_skirt_l' : 'side_skirt_r';
      reg.addNode(sill, sillId, 'door_l' as any, undefined, [side * halfW * 0.90, gcY + 0.04, 0]);
    });

    // Aerodynamic Door Mirrors
    addDoorMirrors(reg, {
      left: [halfW * 0.88, 0.74, Z_COWL_SHUT + 0.05],
      right: [-halfW * 0.88, 0.74, Z_COWL_SHUT + 0.05]
    }, paintMat, carbonMat);

    // 8. Muscular Rear Haunches
    const createRearQuarter = (isLeft: boolean) => {
      const side = isLeft ? 1 : -1;
      return createCurvedPatch(28, 24, (u, v) => {
        const z = Z_DOOR_REAR + (Z_DECK_TAIL - Z_DOOR_REAR) * u;
        const dz = z - rearAxleZ;
        const inArchZone = Math.abs(dz) < rearArchRadius;

        let archCutoutY = gcY + 0.18;
        if (inArchZone) {
          const archVal = rearArchRadius * rearArchRadius - dz * dz;
          if (archVal > 0) {
            archCutoutY = Math.max(gcY + 0.18, rearTyreRadius + Math.sqrt(archVal));
          }
        } else if (dz > 0) {
          archCutoutY = gcY + 0.06;
        } else {
          archCutoutY = 0.44;
        }

        const innerX = side * (halfW * 0.54);
        const crestX = side * (halfW * 0.92);
        const crestY = 0.820;

        let x = 0;
        let y = 0;
        if (v <= 0.45) {
          const t = v / 0.45;
          x = innerX + (crestX - innerX) * t;
          y = 0.720 + (crestY - 0.720) * Math.sin(t * Math.PI * 0.5);
        } else {
          const t = (v - 0.45) / 0.55;
          const outerX = side * (halfW * 0.95);
          x = crestX + (outerX - crestX) * t;
          y = crestY - (crestY - archCutoutY) * (t ** 0.92);
        }
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
    };
    reg.addNode(createRearQuarter(true), 'quarter_panel_l', 'quarter_panel_l', undefined, [halfW * 0.90, 0.62, rearAxleZ]);
    reg.addNode(createRearQuarter(false), 'quarter_panel_r', 'quarter_panel_r', undefined, [-halfW * 0.90, 0.62, rearAxleZ]);

    // Rear Wheel Tub Liners
    [-1, 1].forEach((side) => {
      const tub = createCurvedPatch(20, 10, (u, v) => {
        const theta = (u - 0.5) * Math.PI * 0.90;
        const z = rearAxleZ + Math.sin(theta) * (rearArchRadius - 0.005);
        const y = rearTyreRadius + Math.cos(theta) * (rearArchRadius - 0.005);
        const x = side * (halfW * 0.92 - v * 0.28);
        return new THREE.Vector3(x, y, z);
      }, linerMat, H * 0.45);
      const tubId = side === 1 ? 'wheel_tub_rl' : 'wheel_tub_rr';
      reg.addNode(tub, tubId, 'quarter_panel_l' as any, undefined, [side * halfW * 0.85, rearTyreRadius, rearAxleZ]);
    });

    // 9. Rear Decklid with Integrated Lip Spoiler
    const rearDeckMesh = createCurvedPatch(24, 20, (u, v) => {
      const z = Z_DECK_FRONT - (Z_DECK_FRONT - Z_DECK_TAIL) * u;
      const vn = v * 2 - 1;
      const deckHalfW = (0.54 + 0.12 * u) - shutLineGapM;
      const x = vn * deckHalfW;
      let y = 0.880 - 0.060 * u;
      if (u > 0.70) {
        const kick = (u - 0.70) / 0.30;
        y += 0.038 * (kick ** 2);
      }
      y += 0.015 * (1 - vn ** 2);
      return new THREE.Vector3(x, y, z);
    }, paintMat, H * 0.45);
    reg.addNode(rearDeckMesh, 'rear_deck', 'rear_deck', undefined, [0, 0.84, (Z_DECK_FRONT + Z_DECK_TAIL) / 2]);

    // 10. Rear Bumper Fascia, Horizontal Taillights & Diffuser with Quad Exhausts
    const rBumperMesh = createCurvedPatch(28, 24, (u, v) => {
      const un = u * 2 - 1;
      const angle = un * (Math.PI / 2.16);
      const radiusX = halfW * 0.89;
      const x = Math.sin(angle) * radiusX;
      const rearProj = (halfL - Math.abs(Z_DECK_TAIL)) * Math.cos(angle);

      let startY = 0.800;
      let zOffset = rearProj;

      if (v < 0.30) {
        startY = 0.800 - 0.100 * (v / 0.30);
      } else if (v < 0.70) {
        const t = (v - 0.30) / 0.40;
        startY = 0.700 - 0.280 * t;
        if (Math.abs(un) < 0.38) {
          zOffset -= 0.040 * Math.sin(t * Math.PI);
        }
      } else {
        const t = (v - 0.70) / 0.30;
        startY = 0.420 - (0.420 - (gcY + 0.020)) * t;
      }

      const z = Z_DECK_TAIL - zOffset;
      return new THREE.Vector3(x, startY, z);
    }, paintMat, H * 0.45);
    reg.addNode(rBumperMesh, 'rear_bumper', 'rear_bumper', undefined, [0, 0.52, -halfL + 0.10]);

    // Horizontal 3D Taillight Clusters
    [-0.56, 0.56].forEach((tx, idx) => {
      const tlMesh = createCurvedPatch(14, 6, (u, v) => {
        const un = u * 2 - 1;
        const x = tx + un * 0.18;
        const z = -halfL + 0.05 - 0.02 * (1 - un ** 2);
        const y = 0.760 + v * 0.035;
        return new THREE.Vector3(x, y, z);
      }, taillightMat, H * 0.45);
      const tlId = idx === 0 ? 'taillight_l' : 'taillight_r';
      reg.addNode(tlMesh, tlId, tlId as any, 'rear_bumper', [tx, 0.78, -halfL + 0.04]);
    });

    // Carbon Rear Diffuser with Quad Exhaust Cutouts
    const diffuserGroup = new THREE.Group();
    diffuserGroup.name = 'rear_diffuser';

    const diffTrayMesh = createCurvedPatch(22, 10, (u, v) => {
      const un = u * 2 - 1;
      const x = un * (halfW * 0.80);
      const z = -halfL + 0.45;
      const zEnd = -halfL + 0.02;
      const curZ = z + (zEnd - z) * v;
      const y = gcY + 0.015 + 0.110 * (v ** 1.8);
      return new THREE.Vector3(x, y, curZ);
    }, carbonMat, H * 0.45);
    diffuserGroup.add(diffTrayMesh);

    [-0.45, -0.15, 0.15, 0.45].forEach((fx, idx) => {
      const finMesh = createCurvedPatch(8, 6, (u, v) => {
        const curZ = -halfL + 0.35 + u * 0.30;
        const curY = gcY + 0.015 + 0.110 * (u ** 1.8) - v * 0.060;
        return new THREE.Vector3(fx, curY, curZ);
      }, carbonMat, H * 0.45);
      finMesh.name = `diffuser_fin_${idx}`;
      diffuserGroup.add(finMesh);
    });

    diffuserGroup.position.set(0, 0, 0);
    reg.addNode(diffuserGroup, 'rear_diffuser', 'rear_diffuser', 'rear_bumper', [0, gcY + 0.04, -halfL + 0.16]);

    // Quad Metallic Exhaust Outlets
    createExhaustAssembly(reg, [
      [-0.42, gcY + 0.14, -halfL + 0.02],
      [-0.30, gcY + 0.14, -halfL + 0.02],
      [0.30, gcY + 0.14, -halfL + 0.02],
      [0.42, gcY + 0.14, -halfL + 0.02]
    ], 0.042, 0.12, 'rear_diffuser');

    // 11. Cockpit Interior
    const interiorGroup = new THREE.Group();
    interiorGroup.name = 'interior';

    const dashMesh = createCurvedPatch(16, 10, (u, v) => {
      const un = u * 2 - 1;
      const x = un * (halfW * 0.58);
      const curZ = Z_COWL_SHUT - 0.08 - v * 0.24;
      const curY = 0.720 - v * 0.160;
      return new THREE.Vector3(x, curY, curZ);
    }, interiorMat, H * 0.45);
    interiorGroup.add(dashMesh);

    // Sports GT Steering Wheel
    const wheelGeo = new THREE.TorusGeometry(0.14, 0.016, 12, 24);
    wheelGeo.rotateX(Math.PI / 3.8);
    wheelGeo.computeVertexNormals();
    const steeringWheel = new THREE.Mesh(wheelGeo, interiorMat);
    steeringWheel.position.set(halfW * 0.32, 0.72, Z_COWL_SHUT - 0.22);
    interiorGroup.add(steeringWheel);

    reg.addNode(interiorGroup, 'interior', 'interior', undefined, [0, 0.65, 0]);

    return { group: reg.root, nodes: reg.nodes };
  }
}
