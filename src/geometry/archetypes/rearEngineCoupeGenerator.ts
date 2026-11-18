import * as THREE from 'three';
import { CoachworkDimensions } from '../types';
import {
  createNodeRegistrar,
  createCurvedPatch,
  addLicensePlates,
  addDoorMirrors,
  createExhaustAssembly
} from './sharedArchetypeUtils';

export class RearEngineCoupeGenerator {
  /**
   * Generates authentic, master-grade Porsche 911 GT3 RS (992) coachwork geometry
   * with iconic teardrop flyline, raised torpedo fender crests, 3D oval headlights,
   * 3-bay front air dam with recessed grilles, swan-neck carbon wing, and dual center titanium exhausts.
   */
  public static build(
    dims: CoachworkDimensions,
    materials: Record<string, THREE.Material>,
    shutLineGapM = 0.0025
  ) {
    const reg = createNodeRegistrar('panelized_chassis_assembly');

    const L = dims.overall_length_m; // 4.572m
    const W = dims.overall_width_m; // 1.900m
    const H = dims.overall_height_m; // 1.322m
    const WB = dims.wheelbase_m; // 2.457m
    const halfL = L / 2; // 2.286m
    const halfW = W / 2; // 0.950m
    const frontAxleZ = WB / 2; // +1.2285m
    const rearAxleZ = -WB / 2; // -1.2285m
    const gcY = dims.ground_clearance_m; // 0.100m

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

    // Reference Stations
    const Z_NOSE_SHUT = frontAxleZ + 0.63; // ~1.858m
    const Z_COWL_SHUT = frontAxleZ - 0.43; // ~0.798m (cleanly behind front wheel arch)
    const Z_ROOF_FRONT = 0.22;
    const Z_ROOF_REAR = -0.42;
    const Z_DOOR_REAR = rearAxleZ + 0.45; // ~-0.778m (cleanly ahead of rear arch)
    const Z_DECK_FRONT = rearAxleZ + 0.15;
    const Z_DECK_TAIL = -halfL + 0.38; // ~-1.906m

    const frontTyreRadius = 0.352;
    const rearTyreRadius = 0.368;
    const frontArchRadius = 0.380;
    const rearArchRadius = 0.398;

    // Helper: Seam coordinates for Porsche 911 torpedo crests
    const getHoodSeam = (u: number, isLeft: boolean) => {
      const z = Z_COWL_SHUT + (Z_NOSE_SHUT - Z_COWL_SHUT) * u;
      const t = u;
      const x = (isLeft ? 1 : -1) * (0.640 - 0.160 * t);
      const y = 0.740 - 0.120 * t - 0.012 * (t ** 2);
      return { x, y, z };
    };

    const getFenderCrest = (u: number, isLeft: boolean) => {
      const z = Z_COWL_SHUT + (Z_NOSE_SHUT - Z_COWL_SHUT) * u;
      const t = u;
      const x = (isLeft ? 1 : -1) * (0.760 - 0.120 * t);
      // Prominent Porsche 911 torpedo crest peaking gracefully over the front axle (t ~ 0.3)
      const crestRise = 0.055 * Math.sin(Math.min(1.0, t * 1.6) * Math.PI);
      const y = 0.770 - 0.090 * t + crestRise;
      return { x, y, z };
    };

    const getDeckSeam = (t: number, isLeft: boolean) => {
      const z = Z_DECK_FRONT - (Z_DECK_FRONT - Z_DECK_TAIL) * t;
      const x = (isLeft ? 1 : -1) * (0.540 + 0.130 * t);
      const y = 0.940 - 0.130 * t;
      return { x, y, z };
    };

    // 1. Underfloor Chassis Floor Pan
    const floorMesh = createCurvedPatch(24, 12, (u, v) => {
      const vn = v * 2 - 1;
      const z = (halfL - 0.15) - u * (L - 0.30);
      const wProgress = Math.sin(u * Math.PI);
      const floorHalfW = halfW * 0.82 + 0.08 * wProgress;
      const x = vn * floorHalfW;
      const y = gcY;
      return new THREE.Vector3(x, y, z);
    }, linerMat, H * 0.45);
    reg.addNode(floorMesh, 'chassis_floor_pan', 'cockpit' as any, undefined, [0, gcY, 0]);

    // 2. Curved Hood (Bonnet) with authentic double curvature & GT3 RS nostrils
    const hoodMesh = createCurvedPatch(24, 22, (u, v) => {
      const z = Z_COWL_SHUT + (Z_NOSE_SHUT - Z_COWL_SHUT) * u;
      const seamL = getHoodSeam(u, true);
      const vn = v * 2 - 1;
      const halfW_hood = Math.abs(seamL.x) - shutLineGapM;
      const x = vn * halfW_hood;
      const spineY = 0.740 - 0.120 * u - 0.015 * (u ** 2);
      // Double curvature: lateral crowning of 18mm
      const crown = 0.018 * (1 - vn ** 2);
      const y = spineY + crown;
      return new THREE.Vector3(x, y, z);
    }, paintMat, H * 0.45);
    reg.addNode(hoodMesh, 'hood', 'hood', undefined, [0, 0.68, (Z_COWL_SHUT + Z_NOSE_SHUT) / 2]);

    // Dual Hood Carbon Extraction Nostrils
    [-0.22, 0.22].forEach((vx, idx) => {
      const vent = createCurvedPatch(14, 10, (u, v) => {
        const vn = v * 2 - 1;
        const x = vx + vn * 0.080;
        const z = Z_COWL_SHUT + 0.22 + u * 0.38;
        const y = 0.720 - 0.045 * u - 0.022 * (1 - vn ** 2);
        return new THREE.Vector3(x, y, z);
      }, carbonMat, H * 0.45);
      const ventId = idx === 0 ? 'aero_hood_vent_l' : 'aero_hood_vent_r';
      reg.addNode(vent, ventId, 'hood' as any, 'hood', [vx, 0.70, Z_COWL_SHUT + 0.41]);
    });

    // 3. Front Fenders with raised torpedo crests & wheel arch cutouts
    const createFrontFender = (isLeft: boolean) => {
      const side = isLeft ? 1 : -1;
      return createCurvedPatch(28, 24, (u, v) => {
        const z = Z_COWL_SHUT + (Z_NOSE_SHUT - Z_COWL_SHUT) * u;
        const seam = getHoodSeam(u, isLeft);
        const crest = getFenderCrest(u, isLeft);

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

        const wheelProgress = Math.max(0, 1 - Math.abs(dz) / frontArchRadius);
        const crestX = side * (0.750 - 0.100 * u + 0.040 * Math.sin(wheelProgress * Math.PI * 0.5));
        const crestY = 0.770 - 0.080 * u + 0.045 * Math.sin(wheelProgress * Math.PI * 0.5);

        let x = 0;
        let y = 0;
        if (v <= 0.40) {
          // From inner hood shut line up to raised torpedo crest
          const t = v / 0.40;
          const innerX = seam.x + (isLeft ? shutLineGapM : -shutLineGapM);
          x = innerX + (crestX - innerX) * Math.sin(t * Math.PI * 0.5);
          y = seam.y + (crestY - seam.y) * Math.sin(t * Math.PI * 0.5);
        } else {
          // From torpedo crest down to wheel arch flare / lower shut line
          const t = (v - 0.40) / 0.60;
          const flare = 0.040 * Math.sin(wheelProgress * Math.PI * 0.5);
          const outerX = side * (halfW * 0.90 + flare);
          x = crestX + (outerX - crestX) * Math.sin(t * Math.PI * 0.5);
          y = crestY - (crestY - archCutoutY) * (1 - Math.cos(t * Math.PI * 0.5));
        }
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
    };
    reg.addNode(createFrontFender(true), 'fender_front_l', 'fender_front_l', undefined, [halfW * 0.85, 0.55, frontAxleZ]);
    reg.addNode(createFrontFender(false), 'fender_front_r', 'fender_front_r', undefined, [-halfW * 0.85, 0.55, frontAxleZ]);

    // Front Fender Top Aero Louvres (GT3 RS Slats)
    [-1, 1].forEach((side) => {
      const louvreGroup = new THREE.Group();
      louvreGroup.name = side === 1 ? 'fender_louvres_l' : 'fender_louvres_r';
      for (let s = 0; s < 4; s++) {
        const slatGeo = new THREE.BoxGeometry(0.085, 0.008, 0.028);
        slatGeo.computeVertexNormals();
        const slat = new THREE.Mesh(slatGeo, carbonMat);
        slat.position.set(0, s * 0.008, s * 0.042 - 0.06);
        slat.rotation.x = -0.32;
        louvreGroup.add(slat);
      }
      louvreGroup.position.set(side * (halfW * 0.74), 0.775, frontAxleZ + 0.05);
      reg.addNode(louvreGroup, louvreGroup.name, (side === 1 ? 'fender_front_l' : 'fender_front_r') as any, undefined, [side * halfW * 0.74, 0.775, frontAxleZ]);
    });

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

    // 4. Front Bumper Fascia with Sculpted 3-Bay Air Dam & Splitter
    const fBumperMesh = createCurvedPatch(28, 24, (u, v) => {
      const un = u * 2 - 1;
      const angle = un * (Math.PI / 2.18);
      const radiusX = halfW * 0.89;
      const x = Math.sin(angle) * radiusX;
      const maxForwardProj = (halfL - Z_NOSE_SHUT) * Math.cos(angle);

      // Smooth nose profile matching hood leading edge at shut line (v=0)
      const centerLeadingY = 0.618;
      const flankLeadingY = 0.610;
      const leadingY = flankLeadingY + (centerLeadingY - flankLeadingY) * (1 - un ** 2);

      let startY = leadingY;
      let forwardZ = 0;

      if (v < 0.35) {
        // Upper nose curve: starts flush at shut line (forwardZ=0) and arches forward over bumper bar
        const t = v / 0.35;
        startY = leadingY - 0.080 * (t ** 0.85);
        forwardZ = maxForwardProj * Math.sin(t * Math.PI * 0.5);
      } else if (v < 0.75) {
        // Central and side intake cavity recess (smooth continuous aerodynamic modulation)
        const t = (v - 0.35) / 0.40;
        startY = (leadingY - 0.080) - 0.280 * t;
        const centerCavity = Math.abs(un) < 0.45 ? 0.065 * Math.cos((Math.abs(un) / 0.45) * (Math.PI / 2)) : 0;
        const sideCavity = (Math.abs(un) > 0.48 && Math.abs(un) < 0.88)
          ? 0.055 * Math.sin(((Math.abs(un) - 0.48) / 0.40) * Math.PI)
          : 0;
        const intakeRecess = (centerCavity + sideCavity) * Math.sin(t * Math.PI);
        forwardZ = maxForwardProj - intakeRecess;
      } else {
        // Lower bumper chin & splitter mounting flange
        const t = (v - 0.75) / 0.25;
        startY = 0.240 - (0.240 - (gcY + 0.015)) * t;
        forwardZ = maxForwardProj * (0.92 + 0.08 * t);
      }

      // Smooth corner blend to wheel arches
      if (Math.abs(un) > 0.85) {
        const cProg = (Math.abs(un) - 0.85) / 0.15;
        if (v < 0.45) {
          startY = startY + (0.380 - startY) * cProg * 0.35;
        }
      }

      const z = Z_NOSE_SHUT + forwardZ;
      return new THREE.Vector3(x, startY, z);
    }, paintMat, H * 0.45);
    reg.addNode(fBumperMesh, 'front_bumper', 'front_bumper', undefined, [0, 0.42, halfL - 0.12]);

    // Dark Honeycomb Radiator Grille Inserts (Center and Sides)
    const centerGrille = createCurvedPatch(14, 8, (u, v) => {
      const un = u * 2 - 1;
      const x = un * 0.32;
      const y = 0.420 - v * 0.220;
      const z = halfL - 0.12 - 0.04 * (1 - un ** 2);
      return new THREE.Vector3(x, y, z);
    }, darkTrimMat, H * 0.45);
    reg.addNode(centerGrille, 'radiator_grille_center', 'front_bumper' as any, 'front_bumper', [0, 0.31, halfL - 0.14]);

    [-1, 1].forEach((side) => {
      const sideGrille = createCurvedPatch(10, 8, (u, v) => {
        const un = u * 2 - 1;
        const x = side * (0.54 + un * 0.16);
        const y = 0.410 - v * 0.200;
        const z = halfL - 0.18 - 0.05 * un;
        return new THREE.Vector3(x, y, z);
      }, darkTrimMat, H * 0.45);
      const sId = side === 1 ? 'radiator_grille_l' : 'radiator_grille_r';
      reg.addNode(sideGrille, sId, 'front_bumper' as any, 'front_bumper', [side * 0.54, 0.31, halfL - 0.20]);
    });

    // Carbon Front Aerodynamic Splitter Lip
    const splitterMesh = createCurvedPatch(26, 8, (u, v) => {
      const un = u * 2 - 1;
      const angle = un * (Math.PI / 2.15);
      const radiusX = halfW * 0.92;
      const x = Math.sin(angle) * radiusX;
      const projZ = (halfL - Z_NOSE_SHUT) * Math.cos(angle);
      const z = Z_NOSE_SHUT + projZ;
      const y = gcY + 0.010 + v * 0.018;
      return new THREE.Vector3(x, y, z);
    }, carbonMat, H * 0.45);
    reg.addNode(splitterMesh, 'front_splitter', 'front_splitter', 'front_bumper', [0, gcY + 0.015, halfL - 0.08]);

    // Front License Plate
    addLicensePlates(reg, [0, 0.36, halfL - 0.02], [0, 0.58, -halfL + 0.03]);

    // 5. Authentic Porsche 3D Oval Headlights with 4-Point LED DRLs
    [-0.65, 0.65].forEach((hx, idx) => {
      const hlGroup = new THREE.Group();
      hlGroup.name = idx === 0 ? 'headlight_l' : 'headlight_r';

      // Low-profile oval housing bezel recessed flush into torpedo crest
      const bezelGeo = new THREE.CylinderGeometry(0.085, 0.088, 0.008, 24);
      bezelGeo.rotateX(Math.PI / 4.8);
      bezelGeo.scale(0.85, 1.0, 1.25);
      bezelGeo.computeVertexNormals();
      const bezel = new THREE.Mesh(bezelGeo, darkTrimMat);
      hlGroup.add(bezel);

      // Center Chrome Projector Optic
      const projGeo = new THREE.SphereGeometry(0.035, 18, 16);
      projGeo.scale(1.0, 0.5, 1.0);
      projGeo.computeVertexNormals();
      const projector = new THREE.Mesh(projGeo, chromeMat);
      projector.position.set(0, 0.004, 0);
      hlGroup.add(projector);

      // 4-Point Signature LED DRL Points (Curved micro-cylinders, Zero BoxGeometry)
      const ledGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.004, 10);
      ledGeo.rotateX(Math.PI / 4.8);
      ledGeo.computeVertexNormals();
      [[-0.032, 0.035], [0.032, 0.035], [-0.032, -0.035], [0.032, -0.035]].forEach(([lx, lz]) => {
        const led = new THREE.Mesh(ledGeo, headlightMat);
        led.position.set(lx, 0.006, lz);
        hlGroup.add(led);
      });

      // Clear Flush Polycarbonate Outer Lens Cover
      const lensGeo = new THREE.CylinderGeometry(0.082, 0.082, 0.003, 24);
      lensGeo.rotateX(Math.PI / 4.8);
      lensGeo.scale(0.85, 1.0, 1.25);
      lensGeo.computeVertexNormals();
      const lens = new THREE.Mesh(lensGeo, glassMat);
      lens.position.set(0, 0.006, 0);
      hlGroup.add(lens);

      const hz = Z_NOSE_SHUT - 0.14;
      const hy = 0.700;
      hlGroup.position.set(hx, hy, hz);
      const hlId = idx === 0 ? 'headlight_l' : 'headlight_r';
      reg.addNode(hlGroup, hlId, hlId as any, 'fender_front_l', [hx, hy, hz]);
    });

    // 6. Greenhouse (Windshield, Roof, Cant Rails, Rear Backlight Glass, Side Windows)
    const wsMesh = createCurvedPatch(24, 20, (u, v) => {
      const z = Z_COWL_SHUT + (Z_ROOF_FRONT - Z_COWL_SHUT) * u;
      const vn = v * 2 - 1;
      const halfW_ws = (0.54 - 0.06 * u) - shutLineGapM;
      const x = vn * halfW_ws;
      const spineY = 0.740 + (1.310 - 0.740) * Math.sin(u * Math.PI * 0.5);
      const crown = 0.018 * (1 - vn ** 2);
      const y = spineY + crown;
      return new THREE.Vector3(x, y, z);
    }, glassMat, H * 0.45);
    reg.addNode(wsMesh, 'windshield', 'windshield', undefined, [0, H * 0.85, (Z_COWL_SHUT + Z_ROOF_FRONT) / 2]);

    // Structural Watertight A-Pillars (Connecting Windshield to Doors & Cant Rails)
    [-1, 1].forEach((side) => {
      const aPillar = createCurvedPatch(16, 8, (u, v) => {
        const z = Z_COWL_SHUT + (Z_ROOF_FRONT - Z_COWL_SHUT) * u;
        const innerX = side * (0.54 - 0.06 * u);
        const innerY = 0.740 + (1.310 - 0.740) * Math.sin(u * Math.PI * 0.5);
        const tUp = 1 - u;
        const outerX = side * (0.48 + (halfW * 0.88 - 0.48) * tUp);
        const outerY = 1.310 - (1.310 - 0.740) * (tUp ** 0.92);
        const x = innerX + (outerX - innerX) * v;
        const crown = 0.012 * Math.sin(v * Math.PI);
        const y = innerY + (outerY - innerY) * v + crown;
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
      const apId = side === 1 ? 'a_pillar_l' : 'a_pillar_r';
      reg.addNode(aPillar, apId, 'roof' as any, 'roof', [side * halfW * 0.65, 1.02, (Z_COWL_SHUT + Z_ROOF_FRONT) / 2]);
    });

    // Roof with Double-Bubble Aerodynamic Recess
    const roofMesh = createCurvedPatch(24, 22, (u, v) => {
      const z = Z_ROOF_FRONT + (Z_ROOF_REAR - Z_ROOF_FRONT) * u;
      const vn = v * 2 - 1;
      const roofHalfW = 0.48 - shutLineGapM;
      const x = vn * roofHalfW;
      const centerU = (z - 0.0) / 0.35;
      const longitudinal = 1.322 - 0.012 * (centerU ** 2);
      // Double curvature: lateral crowning with center aerodynamic recess
      const lateral = -0.010 * (vn ** 2) - 0.006 * (1 - Math.cos(vn * Math.PI));
      const y = longitudinal + lateral;
      return new THREE.Vector3(x, y, z);
    }, paintMat, H * 0.45);
    reg.addNode(roofMesh, 'roof', 'roof', undefined, [0, H, (Z_ROOF_FRONT + Z_ROOF_REAR) / 2]);

    // Rear Teardrop Window Glass
    const rwMesh = createCurvedPatch(24, 20, (u, v) => {
      const z = Z_ROOF_REAR + (Z_DECK_FRONT - Z_ROOF_REAR) * u;
      const vn = v * 2 - 1;
      const rwHalfW = (0.48 + 0.06 * u) - shutLineGapM;
      const x = vn * rwHalfW;
      const spineY = 1.310 - (1.310 - 0.940) * (u ** 1.12);
      const crown = 0.015 * (1 - vn ** 2);
      const y = spineY + crown;
      return new THREE.Vector3(x, y, z);
    }, glassMat, H * 0.45);
    reg.addNode(rwMesh, 'rear_window', 'rear_window', undefined, [0, 1.12, (Z_ROOF_REAR + Z_DECK_FRONT) / 2]);

    // Flush Side Windows (Tapering along A-pillar in front and C-pillar flyline in rear)
    [-1, 1].forEach((side) => {
      const swMesh = createCurvedPatch(24, 18, (u, v) => {
        const z = Z_COWL_SHUT + (Z_DOOR_REAR - Z_COWL_SHUT) * u;
        const beltY = 0.740;
        let roofY = 1.310 - 0.020 * Math.sin(u * Math.PI);
        let roofX = side * 0.48;

        if (z > Z_ROOF_FRONT) {
          // A-pillar: window tapers from roof front down to cowl shut line
          const tUp = (z - Z_ROOF_FRONT) / (Z_COWL_SHUT - Z_ROOF_FRONT);
          roofY = 1.310 - (1.310 - beltY) * (tUp ** 0.92);
          roofX = side * (0.48 + (halfW * 0.88 - 0.48) * tUp);
        } else if (z < Z_ROOF_REAR) {
          // C-pillar: window follows the sloping flyline down to the beltline
          const tDown = (Z_ROOF_REAR - z) / (Z_ROOF_REAR - Z_DOOR_REAR);
          roofY = 1.310 - (1.310 - beltY) * (tDown ** 0.88);
          roofX = side * (0.48 + (halfW * 0.88 - 0.48) * tDown);
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
        // Sculpted Coke-bottle waist tuck
        const waistTuck = -0.040 * Math.sin(u * Math.PI);
        // Convex tumblehome crowning
        const verticalTumble = 0.024 * Math.sin(v * Math.PI);
        const x = side * (halfW * 0.90 + waistTuck + verticalTumble - shutLineGapM);
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
    };
    reg.addNode(createDoor(true), 'door_l', 'door_l', undefined, [halfW * 0.88, 0.45, (Z_COWL_SHUT + Z_DOOR_REAR) / 2]);
    reg.addNode(createDoor(false), 'door_r', 'door_r', undefined, [-halfW * 0.88, 0.45, (Z_COWL_SHUT + Z_DOOR_REAR) / 2]);

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
      left: [halfW * 0.88, 0.76, Z_COWL_SHUT + 0.05],
      right: [-halfW * 0.88, 0.76, Z_COWL_SHUT + 0.05]
    }, paintMat, carbonMat);

    // 8. Muscular Wide Rear Quarters (1.90m Width)
    const createRearQuarter = (isLeft: boolean) => {
      const side = isLeft ? 1 : -1;
      return createCurvedPatch(28, 24, (u, v) => {
        const z = Z_DOOR_REAR + (Z_DECK_TAIL - Z_DOOR_REAR) * u;
        const dz = z - rearAxleZ;
        const inArchZone = Math.abs(dz) < rearArchRadius;
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

        let seamX = side * (halfW * 0.54);
        let seamY = 0.760;
        if (z <= Z_DECK_FRONT) {
          const tDeck = (Z_DECK_FRONT - z) / (Z_DECK_FRONT - Z_DECK_TAIL);
          const s = getDeckSeam(tDeck, isLeft);
          seamX = s.x;
          seamY = s.y;
        }

        const wheelProgress = Math.max(0, 1 - Math.abs(dz) / rearArchRadius);
        const crestX = side * (halfW * 0.93 + 0.035 * Math.sin(wheelProgress * Math.PI * 0.5));
        const crestY = seamY + 0.075 + 0.035 * Math.sin(wheelProgress * Math.PI * 0.5);

        let x = 0;
        let y = 0;
        if (v <= 0.40) {
          const t = v / 0.40;
          x = seamX + (crestX - seamX) * Math.sin(t * Math.PI * 0.5);
          y = seamY + (crestY - seamY) * Math.sin(t * Math.PI * 0.5);
        } else {
          const t = (v - 0.40) / 0.60;
          const outerX = side * (halfW * 0.995); // Full 1.90m haunch flare
          x = crestX + (outerX - crestX) * Math.sin(t * Math.PI * 0.5);
          y = crestY - (crestY - archCutoutY) * (1 - Math.cos(t * Math.PI * 0.5));
        }
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
    };
    reg.addNode(createRearQuarter(true), 'quarter_panel_l', 'quarter_panel_l', undefined, [halfW * 0.90, 0.65, rearAxleZ]);
    reg.addNode(createRearQuarter(false), 'quarter_panel_r', 'quarter_panel_r', undefined, [-halfW * 0.90, 0.65, rearAxleZ]);

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

    // 9. Rear Decklid with Ducktail & Engine Cooling Louvres
    const rearDeckMesh = createCurvedPatch(24, 20, (u, v) => {
      const z = Z_DECK_FRONT - (Z_DECK_FRONT - Z_DECK_TAIL) * u;
      const seamL = getDeckSeam(u, true);
      const vn = v * 2 - 1;
      const deckHalfW = Math.abs(seamL.x) - shutLineGapM;
      const x = vn * deckHalfW;
      let y = seamL.y;
      if (u > 0.70) {
        const kick = (u - 0.70) / 0.30;
        y += 0.035 * (kick ** 2);
      }
      y += 0.015 * (1 - vn ** 2);
      return new THREE.Vector3(x, y, z);
    }, paintMat, H * 0.45);
    reg.addNode(rearDeckMesh, 'rear_deck', 'rear_deck', undefined, [0, 0.82, (Z_DECK_FRONT + Z_DECK_TAIL) / 2]);

    // Engine Ventilation Louvers on Decklid
    [-0.20, 0.20].forEach((lx, idx) => {
      const louver = createCurvedPatch(14, 8, (u, v) => {
        const vn = v * 2 - 1;
        const x = lx + vn * 0.075;
        const z = Z_DECK_FRONT - 0.10 - u * 0.32;
        const y = 0.920 - 0.080 * u - 0.014 * (1 - vn ** 2);
        return new THREE.Vector3(x, y, z);
      }, carbonMat, H * 0.45);
      const louverId = idx === 0 ? 'engine_louver_l' : 'engine_louver_r';
      reg.addNode(louver, louverId, 'rear_deck' as any, 'rear_deck', [lx, 0.88, Z_DECK_FRONT - 0.26]);
    });

    // 10. Rear Bumper Fascia, Full-Width 3D Taillight Bar & Diffuser
    const rBumperMesh = createCurvedPatch(28, 24, (u, v) => {
      const un = u * 2 - 1;
      const angle = un * (Math.PI / 2.18);
      const radiusX = halfW * 0.89;
      const x = Math.sin(angle) * radiusX;
      const rearProj = (halfL - Math.abs(Z_DECK_TAIL)) * Math.cos(angle);

      let startY = 0.810;
      if (Math.abs(un) < 0.45) {
        startY = 0.810 + 0.012 * (1 - (un / 0.45) ** 2);
      } else {
        startY = 0.810 - 0.030 * (Math.abs(un) - 0.45);
      }

      // Vertical station profile: Taillight shelf -> Plate recess -> Lower diffuser
      let y = startY;
      let zOffset = rearProj;

      if (v < 0.30) {
        y = startY - 0.120 * (v / 0.30);
      } else if (v < 0.70) {
        const t = (v - 0.30) / 0.40;
        y = 0.690 - 0.280 * t;
        // Inset license plate recess in center
        if (Math.abs(un) < 0.40) {
          zOffset -= 0.045 * Math.sin(t * Math.PI);
        }
      } else {
        const t = (v - 0.70) / 0.30;
        y = 0.410 - (0.410 - (gcY + 0.020)) * t;
      }

      const z = Z_DECK_TAIL - zOffset;
      return new THREE.Vector3(x, y, z);
    }, paintMat, H * 0.45);
    reg.addNode(rBumperMesh, 'rear_bumper', 'rear_bumper', undefined, [0, 0.52, -halfL + 0.12]);

    // Full-Width 3D Red LED Taillight Bar
    const taillightMesh = createCurvedPatch(24, 6, (u, v) => {
      const un = u * 2 - 1;
      const angle = un * (Math.PI / 2.22);
      const x = Math.sin(angle) * (halfW * 0.88);
      const z = Z_DECK_TAIL - (halfL - Math.abs(Z_DECK_TAIL)) * Math.cos(angle) - 0.008;
      const y = 0.795 + v * 0.026;
      return new THREE.Vector3(x, y, z);
    }, taillightMat, H * 0.45);
    reg.addNode(taillightMesh, 'taillight_l', 'taillight_l', 'rear_bumper', [0, 0.81, -halfL + 0.02]);

    // Carbon Rear Aerodynamic Diffuser with 6 Vertical Strakes
    const diffuserGroup = new THREE.Group();
    diffuserGroup.name = 'rear_diffuser';

    const diffTrayMesh = createCurvedPatch(22, 10, (u, v) => {
      const un = u * 2 - 1;
      const x = un * (halfW * 0.78);
      const z = -halfL + 0.45 - u * 0.0;
      const zEnd = -halfL + 0.02;
      const curZ = z + (zEnd - z) * v;
      // Diffuser kicks upward at rear for ground effect
      const y = gcY + 0.015 + 0.120 * (v ** 1.8);
      return new THREE.Vector3(x, y, curZ);
    }, carbonMat, H * 0.45);
    diffuserGroup.add(diffTrayMesh);

    // 6 Vertical Carbon Aerodynamic Fins / Strakes
    [-0.55, -0.33, -0.12, 0.12, 0.33, 0.55].forEach((fx, idx) => {
      const finMesh = createCurvedPatch(8, 6, (u, v) => {
        const curZ = -halfL + 0.35 + u * 0.30;
        const curY = gcY + 0.015 + 0.120 * (u ** 1.8) - v * 0.065;
        return new THREE.Vector3(fx, curY, curZ);
      }, carbonMat, H * 0.45);
      finMesh.name = `diffuser_fin_${idx}`;
      diffuserGroup.add(finMesh);
    });

    diffuserGroup.position.set(0, 0, 0);
    reg.addNode(diffuserGroup, 'rear_diffuser', 'rear_diffuser', 'rear_bumper', [0, gcY + 0.04, -halfL + 0.18]);

    // Center Dual Round Titanium Exhaust Outlets
    createExhaustAssembly(reg, [
      [-0.08, gcY + 0.14, -halfL + 0.02],
      [0.08, gcY + 0.14, -halfL + 0.02]
    ], 0.048, 0.14, 'rear_diffuser');

    // 11. High-Downforce Swan-Neck Carbon Rear Wing
    const wingGroup = new THREE.Group();
    wingGroup.name = 'rear_wing';

    const wingSpan = W * 0.86; // ~1.63m span
    const wingZ = -halfL + 0.18;
    const wingY = 1.280;

    // Dual-element aerodynamic carbon wing blade
    const wingBladeMesh = createCurvedPatch(26, 10, (u, v) => {
      const un = u * 2 - 1;
      const x = un * (wingSpan / 2);
      const chord = 0.280 - 0.030 * (un ** 2);
      const curZ = wingZ - (v - 0.5) * chord;
      // Cambered aerofoil cross section
      const camber = 0.026 * Math.sin(v * Math.PI);
      const curY = wingY + camber - 0.035 * v;
      return new THREE.Vector3(x, curY, curZ);
    }, carbonMat, H * 0.45);
    wingBladeMesh.name = 'wing_blade';
    wingGroup.add(wingBladeMesh);

    // Swan-Neck Top-Mount Pylons (Mounting from ABOVE the wing)
    [-wingSpan * 0.26, wingSpan * 0.26].forEach((px, idx) => {
      const pylonMesh = createCurvedPatch(14, 8, (u, v) => {
        const vn = v * 2 - 1;
        const x = px + vn * 0.012;
        // Swan-neck curve: arches up from decklid and loops forward over the wing
        const deckZ = Z_DECK_TAIL + 0.12;
        const curZ = deckZ + (wingZ - 0.06 - deckZ) * u;
        const archY = 0.880 + (wingY + 0.06 - 0.880) * (u ** 1.3);
        return new THREE.Vector3(x, archY, curZ);
      }, carbonMat, H * 0.45);
      const uId = idx === 0 ? 'wing_upright_l' : 'wing_upright_r';
      pylonMesh.name = uId;
      reg.addNode(pylonMesh, uId, uId as any, 'rear_deck', [px, wingY, wingZ]);
    });

    // Sculpted Carbon Endplates
    [-wingSpan / 2, wingSpan / 2].forEach((ex, idx) => {
      const endplateMesh = createCurvedPatch(10, 8, (u, v) => {
        const curZ = wingZ - 0.16 + u * 0.32;
        const curY = wingY - 0.10 + v * 0.20;
        return new THREE.Vector3(ex, curY, curZ);
      }, carbonMat, H * 0.45);
      endplateMesh.name = idx === 0 ? 'wing_endplate_l' : 'wing_endplate_r';
      wingGroup.add(endplateMesh);
    });

    wingGroup.position.set(0, 0, 0);
    reg.addNode(wingGroup, 'rear_wing', 'wing_blade' as any, 'rear_deck', [0, wingY, wingZ]);

    // 12. Simplified Cockpit Interior
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

    // Sports Steering Wheel
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
