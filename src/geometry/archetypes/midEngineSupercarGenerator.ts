import * as THREE from 'three';
import { CoachworkDimensions } from '../types';
import {
  createNodeRegistrar,
  createCurvedPatch,
  addLicensePlates,
  addDoorMirrors,
  createExhaustAssembly
} from './sharedArchetypeUtils';

export class MidEngineSupercarGenerator {
  /**
   * Generates authentic, master-grade Ferrari 488 Pista coachwork geometry
   * featuring the iconic front aerodynamic S-Duct channel, swept-back vertical LED headlights,
   * cab-forward cockpit with sculpted flying buttresses, side intercooler scoops,
   * twin circular 3D Ferrari taillights, and dual high-caliber round titanium exhausts.
   */
  public static build(
    dims: CoachworkDimensions,
    materials: Record<string, THREE.Material>,
    shutLineGapM = 0.0025
  ) {
    const reg = createNodeRegistrar('panelized_chassis_assembly');

    const L = dims.overall_length_m; // 4.605m
    const W = dims.overall_width_m; // 1.975m
    const H = dims.overall_height_m; // 1.206m
    const WB = dims.wheelbase_m; // 2.650m
    const halfL = L / 2; // 2.3025m
    const halfW = W / 2; // 0.9875m
    const frontAxleZ = WB / 2; // +1.325m
    const rearAxleZ = -WB / 2; // -1.325m
    const gcY = dims.ground_clearance_m; // 0.110m

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

    const engineRedMat = new THREE.MeshStandardMaterial({
      color: '#D41824',
      roughness: 0.40,
      metalness: 0.35
    });

    const linerMat = new THREE.MeshStandardMaterial({
      color: '#0E1014',
      roughness: 0.95,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    // Reference Stations
    const Z_NOSE_SHUT = frontAxleZ + 0.65; // ~1.975m
    const Z_COWL_SHUT = frontAxleZ - 0.45; // ~0.875m (cleanly behind front wheel arch)
    const Z_ROOF_FRONT = 0.28;
    const Z_ROOF_REAR = -0.38;
    const Z_DOOR_REAR = rearAxleZ + 0.48; // ~-0.845m (cleanly ahead of rear arch)
    const Z_DECK_FRONT = rearAxleZ + 0.24;
    const Z_DECK_TAIL = -halfL + 0.34; // ~-1.962m

    const frontTyreRadius = 0.348;
    const rearTyreRadius = 0.364;
    const frontArchRadius = 0.375;
    const rearArchRadius = 0.392;

    // 1. Underfloor Chassis Floor Pan
    const floorMesh = createCurvedPatch(24, 12, (u, v) => {
      const vn = v * 2 - 1;
      const z = (halfL - 0.15) - u * (L - 0.30);
      const floorHalfW = halfW * 0.86;
      const x = vn * floorHalfW;
      const y = gcY;
      return new THREE.Vector3(x, y, z);
    }, linerMat, H * 0.45);
    reg.addNode(floorMesh, 'chassis_floor_pan', 'cockpit' as any, undefined, [0, gcY, 0]);

    // 2. Sculpted Front Hood with Iconic Central S-Duct Downforce Channel
    const hoodMesh = createCurvedPatch(26, 22, (u, v) => {
      const z = Z_COWL_SHUT + (Z_NOSE_SHUT - Z_COWL_SHUT) * u;
      const vn = v * 2 - 1;
      const hoodHalfW = (0.680 - 0.150 * u) - shutLineGapM;
      const x = vn * hoodHalfW;

      // Base hood spine profile
      const spineY = 0.680 - 0.140 * u;
      const crown = 0.016 * (1 - vn ** 2);

      // Ferrari 488 Pista signature S-Duct channel
      // Deep aerodynamic scoop carved down in the center (u > 0.30, |vn| < 0.48)
      let sDuctDrop = 0;
      if (u > 0.25 && Math.abs(vn) < 0.50) {
        const uProg = (u - 0.25) / 0.75;
        const vProg = 1 - (Math.abs(vn) / 0.50) ** 2;
        sDuctDrop = 0.075 * Math.sin(uProg * Math.PI) * vProg;
      }

      const y = spineY + crown - sDuctDrop;
      return new THREE.Vector3(x, y, z);
    }, paintMat, H * 0.45);
    reg.addNode(hoodMesh, 'hood', 'hood', undefined, [0, 0.58, (Z_COWL_SHUT + Z_NOSE_SHUT) / 2]);

    // Carbon S-Duct Central Bridge / Aerofoil
    const sDuctBridge = createCurvedPatch(14, 8, (u, v) => {
      const un = u * 2 - 1;
      const x = un * 0.22;
      const z = Z_COWL_SHUT + 0.42 + v * 0.35;
      const y = 0.580 - 0.040 * v - 0.018 * (1 - un ** 2);
      return new THREE.Vector3(x, y, z);
    }, carbonMat, H * 0.45);
    reg.addNode(sDuctBridge, 'aero_sduct_bridge', 'hood' as any, 'hood', [0, 0.56, Z_COWL_SHUT + 0.60]);

    // 3. Swept Front Fenders with Swept Headlight Cavities
    const createFrontFender = (isLeft: boolean) => {
      const side = isLeft ? 1 : -1;
      return createCurvedPatch(28, 24, (u, v) => {
        const z = Z_COWL_SHUT + (Z_NOSE_SHUT - Z_COWL_SHUT) * u;
        const dz = z - frontAxleZ;
        const wheelProgress = Math.max(0, 1 - Math.abs(dz) / frontArchRadius);

        const inArchZone = Math.abs(dz) < frontArchRadius;
        const rockerY = gcY + 0.025;

        let archCutoutY = frontTyreRadius;
        if (inArchZone) {
          const archVal = frontArchRadius * frontArchRadius - dz * dz;
          archCutoutY = frontTyreRadius + Math.sqrt(Math.max(0, archVal)) * 0.84;
        } else if (dz > 0) {
          const fProg = Math.min(1.0, (dz - frontArchRadius) / Math.max(0.01, Z_NOSE_SHUT - (frontAxleZ + frontArchRadius)));
          archCutoutY = frontTyreRadius - (frontTyreRadius - rockerY) * (fProg ** 0.85);
        } else {
          const rProg = Math.min(1.0, (-dz - frontArchRadius) / Math.max(0.01, (frontAxleZ - frontArchRadius) - Z_COWL_SHUT));
          archCutoutY = frontTyreRadius - (frontTyreRadius - rockerY) * (rProg ** 0.85);
        }

        const innerX = side * ((0.680 - 0.150 * u) + shutLineGapM);
        const crestX = side * (0.810 - 0.120 * u + 0.035 * Math.sin(wheelProgress * Math.PI * 0.5));
        const crestY = 0.740 - 0.080 * u + 0.045 * Math.sin(wheelProgress * Math.PI * 0.5);

        let x = 0;
        let y = 0;
        if (v <= 0.40) {
          const t = v / 0.40;
          x = innerX + (crestX - innerX) * Math.sin(t * Math.PI * 0.5);
          const innerY = 0.680 - 0.140 * u;
          y = innerY + (crestY - innerY) * Math.sin(t * Math.PI * 0.5);
        } else {
          const t = (v - 0.40) / 0.60;
          const flare = 0.038 * Math.sin(wheelProgress * Math.PI * 0.5);
          const outerX = side * (halfW * 0.90 + flare);
          x = crestX + (outerX - crestX) * Math.sin(t * Math.PI * 0.5);
          y = crestY - (crestY - archCutoutY) * (1 - Math.cos(t * Math.PI * 0.5));
        }
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
    };
    reg.addNode(createFrontFender(true), 'fender_front_l', 'fender_front_l', undefined, [halfW * 0.86, 0.52, frontAxleZ]);
    reg.addNode(createFrontFender(false), 'fender_front_r', 'fender_front_r', undefined, [-halfW * 0.86, 0.52, frontAxleZ]);

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

    // 4. Pointed Shark-Nose Front Bumper with S-Duct Intake & Carbon Splitter
    const fBumperMesh = createCurvedPatch(28, 24, (u, v) => {
      const un = u * 2 - 1;
      const angle = un * (Math.PI / 2.14);
      const radiusX = halfW * 0.90;
      const x = Math.sin(angle) * radiusX;
      const maxForwardProj = (halfL - Z_NOSE_SHUT) * Math.cos(angle);

      const centerLeadingY = 0.556;
      const flankLeadingY = 0.540;
      const leadingY = flankLeadingY + (centerLeadingY - flankLeadingY) * (1 - un ** 2);

      let startY = leadingY;
      let forwardZ = 0;

      if (v < 0.35) {
        // Starts flush at shut line (forwardZ=0) and arches forward over bumper bar
        const t = v / 0.35;
        startY = leadingY - 0.080 * (t ** 0.85);
        forwardZ = maxForwardProj * Math.sin(t * Math.PI * 0.5);
      } else if (v < 0.75) {
        const t = (v - 0.35) / 0.40;
        startY = 0.460 - 0.240 * t;
        // Central S-Duct intake opening and side radiator inlets (smooth continuous modulation)
        const centerCavity = Math.abs(un) < 0.42 ? 0.075 * Math.cos((Math.abs(un) / 0.42) * (Math.PI / 2)) : 0;
        const sideCavity = (Math.abs(un) > 0.46 && Math.abs(un) < 0.86)
          ? 0.065 * Math.sin(((Math.abs(un) - 0.46) / 0.40) * Math.PI)
          : 0;
        const intakeRecess = (centerCavity + sideCavity) * Math.sin(t * Math.PI);
        forwardZ = maxForwardProj - intakeRecess;
      } else {
        const t = (v - 0.75) / 0.25;
        startY = 0.220 - (0.220 - (gcY + 0.015)) * t;
        forwardZ = maxForwardProj * (0.94 + 0.06 * t);
      }

      if (Math.abs(un) > 0.85) {
        const cProg = (Math.abs(un) - 0.85) / 0.15;
        if (v < 0.45) {
          startY = startY + (0.360 - startY) * cProg * 0.35;
        }
      }

      const z = Z_NOSE_SHUT + forwardZ;
      return new THREE.Vector3(x, startY, z);
    }, paintMat, H * 0.45);
    reg.addNode(fBumperMesh, 'front_bumper', 'front_bumper', undefined, [0, 0.38, halfL - 0.10]);

    // Front Honeycomb Intake Grilles
    const centerGrille = createCurvedPatch(14, 8, (u, v) => {
      const un = u * 2 - 1;
      const x = un * 0.30;
      const y = 0.380 - v * 0.200;
      const z = halfL - 0.14 - 0.04 * (1 - un ** 2);
      return new THREE.Vector3(x, y, z);
    }, darkTrimMat, H * 0.45);
    reg.addNode(centerGrille, 'radiator_grille_center', 'front_bumper' as any, 'front_bumper', [0, 0.28, halfL - 0.15]);

    [-1, 1].forEach((side) => {
      const sideGrille = createCurvedPatch(10, 8, (u, v) => {
        const un = u * 2 - 1;
        const x = side * (0.55 + un * 0.16);
        const y = 0.370 - v * 0.180;
        const z = halfL - 0.20 - 0.05 * un;
        return new THREE.Vector3(x, y, z);
      }, darkTrimMat, H * 0.45);
      const sId = side === 1 ? 'radiator_grille_l' : 'radiator_grille_r';
      reg.addNode(sideGrille, sId, 'front_bumper' as any, 'front_bumper', [side * 0.55, 0.28, halfL - 0.22]);
    });

    // Carbon Front Aerodynamic Splitter
    const splitterMesh = createCurvedPatch(26, 8, (u, v) => {
      const un = u * 2 - 1;
      const angle = un * (Math.PI / 2.12);
      const radiusX = halfW * 0.92;
      const x = Math.sin(angle) * radiusX;
      const projZ = (halfL - Z_NOSE_SHUT) * Math.cos(angle);
      const z = Z_NOSE_SHUT + projZ;
      const y = gcY + 0.012 + v * 0.016;
      return new THREE.Vector3(x, y, z);
    }, carbonMat, H * 0.45);
    reg.addNode(splitterMesh, 'front_splitter', 'front_splitter', 'front_bumper', [0, gcY + 0.015, halfL - 0.08]);

    // Front & Rear License Plates
    addLicensePlates(reg, [0, 0.32, halfL - 0.02], [0, 0.54, -halfL + 0.02]);

    // 5. Swept-Back Vertical LED Headlight Clusters
    [-0.64, 0.64].forEach((hx, idx) => {
      const hlGroup = new THREE.Group();
      hlGroup.name = idx === 0 ? 'headlight_l' : 'headlight_r';

      // Streamlined low-profile swept housing bezel
      const bezelGeo = new THREE.CylinderGeometry(0.045, 0.048, 0.008, 20);
      bezelGeo.scale(0.85, 1.0, 2.8);
      bezelGeo.rotateX(0.18);
      bezelGeo.computeVertexNormals();
      const bezel = new THREE.Mesh(bezelGeo, darkTrimMat);
      hlGroup.add(bezel);

      // Dual Projector Optic Spheres
      const projGeo = new THREE.SphereGeometry(0.022, 16, 14);
      projGeo.scale(1.0, 0.6, 1.0);
      projGeo.computeVertexNormals();
      [-0.05, 0.05].forEach((pz) => {
        const pMesh = new THREE.Mesh(projGeo, chromeMat);
        pMesh.position.set(0, 0.004, pz);
        hlGroup.add(pMesh);
      });

      // Swept LED Light Guide Tube
      const guideGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.20, 10);
      guideGeo.rotateX(Math.PI / 2 + 0.18);
      guideGeo.computeVertexNormals();
      const guide = new THREE.Mesh(guideGeo, headlightMat);
      guide.position.set(idx === 0 ? 0.025 : -0.025, 0.006, 0);
      hlGroup.add(guide);

      // Flush Clear Polycarbonate Lens Cover
      const glassCoverGeo = new THREE.CylinderGeometry(0.043, 0.043, 0.003, 20);
      glassCoverGeo.scale(0.85, 1.0, 2.8);
      glassCoverGeo.rotateX(0.18);
      glassCoverGeo.computeVertexNormals();
      const glassCover = new THREE.Mesh(glassCoverGeo, glassMat);
      glassCover.position.set(0, 0.006, 0);
      hlGroup.add(glassCover);

      const hz = Z_NOSE_SHUT - 0.16;
      const hy = 0.640;
      hlGroup.position.set(hx, hy, hz);
      const hlId = idx === 0 ? 'headlight_l' : 'headlight_r';
      reg.addNode(hlGroup, hlId, hlId as any, 'fender_front_l', [hx, hy, hz]);
    });

    // 6. Cab-Forward Greenhouse with Sculpted Flying Buttresses
    const wsMesh = createCurvedPatch(24, 20, (u, v) => {
      const z = Z_COWL_SHUT + (Z_ROOF_FRONT - Z_COWL_SHUT) * u;
      const vn = v * 2 - 1;
      const halfW_ws = (0.56 - 0.08 * u) - shutLineGapM;
      const x = vn * halfW_ws;
      // Low swept windscreen ramping to H = 1.206m
      const spineY = 0.680 + (H - 0.020 - 0.680) * Math.sin(u * Math.PI * 0.5);
      const crown = 0.018 * (1 - vn ** 2);
      const y = spineY + crown;
      return new THREE.Vector3(x, y, z);
    }, glassMat, H * 0.45);
    reg.addNode(wsMesh, 'windshield', 'windshield', undefined, [0, H * 0.85, (Z_COWL_SHUT + Z_ROOF_FRONT) / 2]);

    // Structural Watertight A-Pillars (Connecting Windshield to Doors & Cant Rails)
    [-1, 1].forEach((side) => {
      const aPillar = createCurvedPatch(16, 8, (u, v) => {
        const z = Z_COWL_SHUT + (Z_ROOF_FRONT - Z_COWL_SHUT) * u;
        const innerX = side * (0.56 - 0.08 * u);
        const innerY = 0.680 + (H - 0.020 - 0.680) * Math.sin(u * Math.PI * 0.5);
        const tUp = 1 - u;
        const outerX = side * (0.46 + (halfW * 0.88 - 0.46) * tUp);
        const outerY = (H - 0.020) - ((H - 0.020) - 0.700) * (tUp ** 0.92);
        const x = innerX + (outerX - innerX) * v;
        const crown = 0.012 * Math.sin(v * Math.PI);
        const y = innerY + (outerY - innerY) * v + crown;
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
      const apId = side === 1 ? 'a_pillar_l' : 'a_pillar_r';
      reg.addNode(aPillar, apId, 'roof' as any, 'roof', [side * halfW * 0.65, 0.96, (Z_COWL_SHUT + Z_ROOF_FRONT) / 2]);
    });

    // Double-Bubble Roof
    const roofMesh = createCurvedPatch(24, 22, (u, v) => {
      const z = Z_ROOF_FRONT + (Z_ROOF_REAR - Z_ROOF_FRONT) * u;
      const vn = v * 2 - 1;
      const roofHalfW = 0.46 - shutLineGapM;
      const x = vn * roofHalfW;
      const centerU = (z - 0.0) / 0.33;
      const longitudinal = (H - 0.020) - 0.012 * (centerU ** 2);
      // Double bubble channels on driver and passenger sides
      const doubleBubble = 0.018 * Math.cos(vn * Math.PI * 2.0);
      const y = longitudinal + doubleBubble;
      return new THREE.Vector3(x, y, z);
    }, paintMat, H * 0.45);
    reg.addNode(roofMesh, 'roof', 'roof', undefined, [0, H, (Z_ROOF_FRONT + Z_ROOF_REAR) / 2]);

    // Transparent Rear Engine Bay Glass Cover
    const engGlassMesh = createCurvedPatch(22, 18, (u, v) => {
      const z = Z_ROOF_REAR + (Z_DECK_FRONT - Z_ROOF_REAR) * u;
      const vn = v * 2 - 1;
      const glassHalfW = (0.34 + 0.05 * u) - shutLineGapM;
      const x = vn * glassHalfW;
      const spineY = (H - 0.020) - ((H - 0.020) - 0.860) * (u ** 1.15);
      const crown = 0.012 * (1 - vn ** 2);
      const y = spineY + crown;
      return new THREE.Vector3(x, y, z);
    }, glassMat, H * 0.45);
    reg.addNode(engGlassMesh, 'rear_window', 'rear_window', undefined, [0, 0.98, (Z_ROOF_REAR + Z_DECK_FRONT) / 2]);

    // Visible 3D Ferrari Twin-Turbo V8 Intake Manifolds (Under Glass)
    [-0.10, 0.10].forEach((ex, idx) => {
      const plenumGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.38, 16);
      plenumGeo.rotateX(Math.PI / 2);
      plenumGeo.computeVertexNormals();
      const plenum = new THREE.Mesh(plenumGeo, engineRedMat);
      plenum.position.set(ex, 0.815, (Z_ROOF_REAR + Z_DECK_FRONT) / 2);
      reg.addNode(plenum, `engine_plenum_${idx === 0 ? 'l' : 'r'}`, 'engine_plenum' as any, undefined, [ex, 0.815, (Z_ROOF_REAR + Z_DECK_FRONT) / 2]);
    });

    // Sculpted Flying Buttresses
    [-1, 1].forEach((side) => {
      const buttress = createCurvedPatch(20, 10, (u, v) => {
        const z = Z_ROOF_REAR + (Z_DECK_FRONT - Z_ROOF_REAR) * u;
        const innerX = side * (0.34 + 0.05 * u + shutLineGapM);
        const outerX = side * (0.48 + 0.14 * u);
        const x = innerX + (outerX - innerX) * v;
        const archY = (H - 0.010) - ((H - 0.010) - 0.880) * (u ** 1.10);
        return new THREE.Vector3(x, archY, z);
      }, paintMat, H * 0.45);
      const bId = side === 1 ? 'flying_buttress_l' : 'flying_buttress_r';
      reg.addNode(buttress, bId, 'roof' as any, 'roof', [side * 0.46, 1.05, (Z_ROOF_REAR + Z_DECK_FRONT) / 2]);
    });

    // Flush Side Windows (Tapering along buttress down to beltline)
    [-1, 1].forEach((side) => {
      const swMesh = createCurvedPatch(24, 18, (u, v) => {
        const z = Z_COWL_SHUT + (Z_DOOR_REAR - Z_COWL_SHUT) * u;
        const beltY = 0.700;
        let roofY = (H - 0.020) - 0.035 * Math.sin(u * Math.PI);
        let roofX = side * 0.46;

        if (z > Z_ROOF_FRONT) {
          // A-pillar: window tapers from roof front down to cowl shut line
          const tUp = (z - Z_ROOF_FRONT) / (Z_COWL_SHUT - Z_ROOF_FRONT);
          roofY = (H - 0.020) - ((H - 0.020) - beltY) * (tUp ** 0.92);
          roofX = side * (0.46 + (halfW * 0.88 - 0.46) * tUp);
        } else if (z < Z_ROOF_REAR) {
          const tDown = (Z_ROOF_REAR - z) / (Z_ROOF_REAR - Z_DOOR_REAR);
          roofY = (H - 0.020) - ((H - 0.020) - beltY) * (tDown ** 0.88);
          roofX = side * (0.46 + (halfW * 0.88 - 0.46) * tDown);
        }

        const y = beltY + (roofY - beltY) * v;
        const doorX = side * (halfW * 0.88 - shutLineGapM);
        const x = doorX + (roofX - doorX) * v;
        return new THREE.Vector3(x, y, z);
      }, glassMat, H * 0.45);
      const swId = side === 1 ? 'window_glass_l' : 'window_glass_r';
      reg.addNode(swMesh, swId, 'windshield' as any, 'roof', [side * halfW * 0.74, H * 0.80, 0]);
    });

    // 7. Sculpted Doors with Scalloped Side Air Intake Scoops
    const createDoor = (isLeft: boolean) => {
      const side = isLeft ? 1 : -1;
      return createCurvedPatch(24, 22, (u, v) => {
        const z = Z_COWL_SHUT + (Z_DOOR_REAR - Z_COWL_SHUT) * u;
        const beltY = 0.700;
        const rockerY = gcY + 0.050;
        const y = rockerY + (beltY - rockerY) * v;

        // Coke-bottle waist tuck
        let waistTuck = -0.045 * Math.sin(u * Math.PI);
        // Deep side scallop opening up towards the rear to feed intercoolers
        if (u > 0.45) {
          const sProg = (u - 0.45) / 0.55;
          waistTuck -= 0.065 * (sProg ** 1.8) * Math.sin(v * Math.PI);
        }

        const verticalTumble = 0.024 * Math.sin(v * Math.PI);
        const x = side * (halfW * 0.90 + waistTuck + verticalTumble - shutLineGapM);
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
    };
    reg.addNode(createDoor(true), 'door_l', 'door_l', undefined, [halfW * 0.88, 0.42, (Z_COWL_SHUT + Z_DOOR_REAR) / 2]);
    reg.addNode(createDoor(false), 'door_r', 'door_r', undefined, [-halfW * 0.88, 0.42, (Z_COWL_SHUT + Z_DOOR_REAR) / 2]);

    // Carbon Aerodynamic Rocker Sills
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
      left: [halfW * 0.88, 0.72, Z_COWL_SHUT + 0.05],
      right: [-halfW * 0.88, 0.72, Z_COWL_SHUT + 0.05]
    }, paintMat, carbonMat);

    // 8. Muscular Rear Quarters with Large Intercooler Intake Cavities
    const createRearQuarter = (isLeft: boolean) => {
      const side = isLeft ? 1 : -1;
      return createCurvedPatch(28, 24, (u, v) => {
        const z = Z_DOOR_REAR + (Z_DECK_TAIL - Z_DOOR_REAR) * u;
        const dz = z - rearAxleZ;
        const inArchZone = Math.abs(dz) < rearArchRadius;
        const wheelProgress = Math.max(0, 1 - Math.abs(dz) / rearArchRadius);
        const rockerY = gcY + 0.025;

        let archCutoutY = rearTyreRadius;
        if (inArchZone) {
          const archVal = rearArchRadius * rearArchRadius - dz * dz;
          archCutoutY = rearTyreRadius + Math.sqrt(Math.max(0, archVal)) * 0.82;
        } else if (dz > 0) {
          const fProg = Math.min(1.0, (dz - rearArchRadius) / Math.max(0.01, Z_DOOR_REAR - (rearAxleZ + rearArchRadius)));
          archCutoutY = rearTyreRadius - (rearTyreRadius - rockerY) * (fProg ** 0.85);
        } else {
          const rProg = Math.min(1.0, (-dz - rearArchRadius) / Math.max(0.01, (rearAxleZ - rearArchRadius) - Z_DECK_TAIL));
          archCutoutY = rearTyreRadius - (rearTyreRadius - rockerY) * (rProg ** 0.85);
        }

        const innerX = side * (halfW * 0.52);
        const crestX = side * (halfW * 0.92 + 0.035 * Math.sin(wheelProgress * Math.PI * 0.5));
        const crestY = 0.800 + 0.035 * Math.sin(wheelProgress * Math.PI * 0.5);

        let x = 0;
        let y = 0;
        if (v <= 0.40) {
          const t = v / 0.40;
          x = innerX + (crestX - innerX) * Math.sin(t * Math.PI * 0.5);
          y = 0.700 + (crestY - 0.700) * Math.sin(t * Math.PI * 0.5);
        } else {
          const t = (v - 0.40) / 0.60;
          const outerX = side * (halfW * 0.995);
          x = crestX + (outerX - crestX) * Math.sin(t * Math.PI * 0.5);
          y = crestY - (crestY - archCutoutY) * (1 - Math.cos(t * Math.PI * 0.5));
        }
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
    };
    reg.addNode(createRearQuarter(true), 'quarter_panel_l', 'quarter_panel_l', undefined, [halfW * 0.90, 0.62, rearAxleZ]);
    reg.addNode(createRearQuarter(false), 'quarter_panel_r', 'quarter_panel_r', undefined, [-halfW * 0.90, 0.62, rearAxleZ]);

    // Side Intercooler Grille Vents
    [-1, 1].forEach((side) => {
      const vent = createCurvedPatch(12, 8, (u, v) => {
        const z = Z_DOOR_REAR + u * 0.35;
        const x = side * (halfW * 0.88 - 0.08 * v);
        const y = 0.380 + v * 0.280;
        return new THREE.Vector3(x, y, z);
      }, darkTrimMat, H * 0.45);
      const vId = side === 1 ? 'side_intake_grille_l' : 'side_intake_grille_r';
      reg.addNode(vent, vId, vId as any, undefined, [side * halfW * 0.84, 0.52, Z_DOOR_REAR + 0.18]);
    });

    // Rear Wheel Tub Liners
    [-1, 1].forEach((side) => {
      const tub = createCurvedPatch(20, 10, (u, v) => {
        const theta = (u - 0.5) * Math.PI * 0.90;
        const z = rearAxleZ + Math.sin(theta) * (rearArchRadius - 0.005);
        const y = rearTyreRadius + Math.cos(theta) * (rearArchRadius - 0.005);
        const x = side * (halfW * 0.90 - v * 0.28);
        return new THREE.Vector3(x, y, z);
      }, linerMat, H * 0.45);
      const tubId = side === 1 ? 'wheel_tub_rl' : 'wheel_tub_rr';
      reg.addNode(tub, tubId, 'quarter_panel_l' as any, undefined, [side * halfW * 0.85, rearTyreRadius, rearAxleZ]);
    });

    // 9. Rear Decklid with Integrated Ducktail Spoiler
    const rearDeckMesh = createCurvedPatch(24, 20, (u, v) => {
      const z = Z_DECK_FRONT - (Z_DECK_FRONT - Z_DECK_TAIL) * u;
      const vn = v * 2 - 1;
      const deckHalfW = (0.52 + 0.12 * u) - shutLineGapM;
      const x = vn * deckHalfW;
      let y = 0.860 - 0.060 * u;
      // Integrated aerodynamic ducktail lip
      if (u > 0.65) {
        const kick = (u - 0.65) / 0.35;
        y += 0.045 * (kick ** 2);
      }
      y += 0.015 * (1 - vn ** 2);
      return new THREE.Vector3(x, y, z);
    }, paintMat, H * 0.45);
    reg.addNode(rearDeckMesh, 'rear_deck', 'rear_deck', undefined, [0, 0.82, (Z_DECK_FRONT + Z_DECK_TAIL) / 2]);

    // 10. Rear Bumper Fascia, Circular 3D Ferrari Taillights & Diffuser
    const rBumperMesh = createCurvedPatch(28, 24, (u, v) => {
      const un = u * 2 - 1;
      const angle = un * (Math.PI / 2.14);
      const radiusX = halfW * 0.89;
      const x = Math.sin(angle) * radiusX;
      const rearProj = (halfL - Math.abs(Z_DECK_TAIL)) * Math.cos(angle);

      let startY = 0.780;
      let zOffset = rearProj;

      if (v < 0.30) {
        startY = 0.780 - 0.100 * (v / 0.30);
      } else if (v < 0.70) {
        const t = (v - 0.30) / 0.40;
        startY = 0.680 - 0.280 * t;
        if (Math.abs(un) < 0.38) {
          zOffset -= 0.040 * Math.sin(t * Math.PI);
        }
      } else {
        const t = (v - 0.70) / 0.30;
        startY = 0.400 - (0.400 - (gcY + 0.020)) * t;
      }

      const z = Z_DECK_TAIL - zOffset;
      return new THREE.Vector3(x, startY, z);
    }, paintMat, H * 0.45);
    reg.addNode(rBumperMesh, 'rear_bumper', 'rear_bumper', undefined, [0, 0.50, -halfL + 0.10]);

    // Twin Circular 3D Ferrari Taillights with Illuminated Red Halo Rings
    [-0.56, 0.56].forEach((tx, idx) => {
      const tlGroup = new THREE.Group();
      tlGroup.name = idx === 0 ? 'taillight_l' : 'taillight_r';

      // Dark housing bucket
      const bucketGeo = new THREE.CylinderGeometry(0.082, 0.082, 0.035, 24);
      bucketGeo.rotateX(Math.PI / 2);
      bucketGeo.computeVertexNormals();
      const bucket = new THREE.Mesh(bucketGeo, darkTrimMat);
      tlGroup.add(bucket);

      // Red Glowing LED Halo Ring
      const ringGeo = new THREE.TorusGeometry(0.062, 0.012, 16, 28);
      ringGeo.computeVertexNormals();
      const ring = new THREE.Mesh(ringGeo, taillightMat);
      ring.position.z = 0.012;
      tlGroup.add(ring);

      // Center Chrome Core
      const coreGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.020, 20);
      coreGeo.rotateX(Math.PI / 2);
      coreGeo.computeVertexNormals();
      const core = new THREE.Mesh(coreGeo, chromeMat);
      core.position.z = 0.008;
      tlGroup.add(core);

      const tz = -halfL + 0.06;
      const ty = 0.740;
      tlGroup.position.set(tx, ty, tz);
      const tlId = idx === 0 ? 'taillight_l' : 'taillight_r';
      reg.addNode(tlGroup, tlId, tlId as any, 'rear_bumper', [tx, ty, tz]);
    });

    // Carbon Rear Diffuser with 5 Aerodynamic Fins
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

    [-0.50, -0.25, 0.0, 0.25, 0.50].forEach((fx, idx) => {
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

    // High-Mounted Round Titanium Exhaust Tips
    createExhaustAssembly(reg, [
      [-0.24, gcY + 0.26, -halfL + 0.02],
      [0.24, gcY + 0.26, -halfL + 0.02]
    ], 0.052, 0.14, 'rear_diffuser');

    // 11. Cockpit Interior
    const interiorGroup = new THREE.Group();
    interiorGroup.name = 'interior';

    const dashMesh = createCurvedPatch(16, 10, (u, v) => {
      const un = u * 2 - 1;
      const x = un * (halfW * 0.56);
      const curZ = Z_COWL_SHUT - 0.06 - v * 0.22;
      const curY = 0.680 - v * 0.150;
      return new THREE.Vector3(x, curY, curZ);
    }, interiorMat, H * 0.45);
    interiorGroup.add(dashMesh);

    // Ferrari Racing Steering Wheel with Shift Lights
    const wheelGeo = new THREE.TorusGeometry(0.13, 0.016, 12, 24);
    wheelGeo.rotateX(Math.PI / 3.8);
    wheelGeo.computeVertexNormals();
    const steeringWheel = new THREE.Mesh(wheelGeo, interiorMat);
    steeringWheel.position.set(halfW * 0.32, 0.68, Z_COWL_SHUT - 0.20);
    interiorGroup.add(steeringWheel);

    reg.addNode(interiorGroup, 'interior', 'interior', undefined, [0, 0.60, 0]);

    return { group: reg.root, nodes: reg.nodes };
  }
}
