import * as THREE from 'three';
import { CoachworkDimensions } from '../types';
import {
  createNodeRegistrar,
  createCurvedPatch,
  addLicensePlates,
  addDoorMirrors,
  createExhaustAssembly
} from './sharedArchetypeUtils';

export class MidEngineHypercarGenerator {
  /**
   * Generates authentic, master-grade Lamborghini Aventador SVJ coachwork geometry
   * featuring the extreme razor wedge monovolume profile (H = 1.136m), sharp hexagonal creases,
   * ALA 2.0 active aero front flaps, Y-signature LED DRLs, louvered central engine spine,
   * high-mounted ALA 2.0 carbon rear wing, and signature high-mounted center dual exhausts.
   */
  public static build(
    dims: CoachworkDimensions,
    materials: Record<string, THREE.Material>,
    shutLineGapM = 0.0025
  ) {
    const reg = createNodeRegistrar('panelized_chassis_assembly');

    const L = dims.overall_length_m; // 4.943m
    const W = dims.overall_width_m; // 2.098m
    const H = dims.overall_height_m; // 1.136m
    const WB = dims.wheelbase_m; // 2.700m
    const halfL = L / 2; // 2.4715m
    const halfW = W / 2; // 1.049m
    const frontAxleZ = WB / 2; // +1.350m
    const rearAxleZ = -WB / 2; // -1.350m
    const gcY = dims.ground_clearance_m; // 0.100m

    const paintMat = materials.body_paint;
    const carbonMat = materials.carbon_aero;
    const glassMat = materials.glass;
    const headlightMat = materials.headlight;
    const taillightMat = materials.taillight;
    const interiorMat = materials.interior;

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: '#101216',
      roughness: 0.85,
      metalness: 0.20
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: '#E8ECF2',
      roughness: 0.15,
      metalness: 0.95
    });

    const linerMat = new THREE.MeshStandardMaterial({
      color: '#0C0E12',
      roughness: 0.95,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    // Reference Stations
    const Z_NOSE_SHUT = frontAxleZ + 0.75; // ~2.100m
    const Z_COWL_SHUT = frontAxleZ - 0.44; // ~0.910m (cleanly behind front wheel arch)
    const Z_ROOF_FRONT = 0.20;
    const Z_ROOF_REAR = -0.48;
    const Z_DOOR_REAR = rearAxleZ + 0.48; // ~-0.870m (cleanly ahead of rear arch)
    const Z_DECK_FRONT = rearAxleZ + 0.28;
    const Z_DECK_TAIL = -halfL + 0.40; // ~-2.0715m

    const frontTyreRadius = 0.352;
    const rearTyreRadius = 0.368;
    const frontArchRadius = 0.380;
    const rearArchRadius = 0.398;

    // 1. Underfloor Chassis Floor Pan
    const floorMesh = createCurvedPatch(24, 12, (u, v) => {
      const vn = v * 2 - 1;
      const z = (halfL - 0.15) - u * (L - 0.30);
      const floorHalfW = halfW * 0.88;
      const x = vn * floorHalfW;
      const y = gcY;
      return new THREE.Vector3(x, y, z);
    }, linerMat, H * 0.45);
    reg.addNode(floorMesh, 'chassis_floor_pan', 'cockpit' as any, undefined, [0, gcY, 0]);

    // 2. Razor Wedge Front Hood with Hexagonal Creases & ALA Air Extractors
    const hoodMesh = createCurvedPatch(26, 22, (u, v) => {
      const z = Z_COWL_SHUT + (Z_NOSE_SHUT - Z_COWL_SHUT) * u;
      const vn = v * 2 - 1;
      // Sharp wedge taper towards the pointed nose
      const hoodHalfW = (0.720 - 0.180 * u) - shutLineGapM;
      const x = vn * hoodHalfW;

      // Steep continuous razor wedge slope
      const spineY = 0.650 - 0.210 * u;
      // Hexagonal sharp ridge crease lines along hood
      const hexCrease = 0.022 * Math.cos(vn * Math.PI * 1.5) * (1 - u * 0.5);
      const y = spineY + hexCrease;

      return new THREE.Vector3(x, y, z);
    }, paintMat, H * 0.45);
    reg.addNode(hoodMesh, 'hood', 'hood', undefined, [0, 0.54, (Z_COWL_SHUT + Z_NOSE_SHUT) / 2]);

    // SVJ Twin Carbon Air Extractor Ducts on Hood
    [-0.20, 0.20].forEach((vx, idx) => {
      const vent = createCurvedPatch(14, 8, (u, v) => {
        const vn = v * 2 - 1;
        const x = vx + vn * 0.075;
        const z = Z_COWL_SHUT + 0.25 + u * 0.32;
        const y = 0.560 - 0.050 * u - 0.015 * (1 - vn ** 2);
        return new THREE.Vector3(x, y, z);
      }, carbonMat, H * 0.45);
      const ventId = idx === 0 ? 'aero_hood_vent_l' : 'aero_hood_vent_r';
      reg.addNode(vent, ventId, 'hood' as any, 'hood', [vx, 0.54, Z_COWL_SHUT + 0.41]);
    });

    // 3. Sharp Angular Front Fenders with Geometric Wheel Arches
    const createFrontFender = (isLeft: boolean) => {
      const side = isLeft ? 1 : -1;
      return createCurvedPatch(28, 24, (u, v) => {
        const z = Z_COWL_SHUT + (Z_NOSE_SHUT - Z_COWL_SHUT) * u;
        const dz = z - frontAxleZ;
        const inArchZone = Math.abs(dz) < frontArchRadius;
        const wheelProgress = Math.max(0, 1 - Math.abs(dz) / frontArchRadius);
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

        const innerX = side * ((0.720 - 0.180 * u) + shutLineGapM);
        const crestX = side * (0.860 - 0.140 * u + 0.035 * Math.sin(wheelProgress * Math.PI * 0.5));
        const crestY = 0.720 - 0.120 * u + 0.040 * Math.sin(wheelProgress * Math.PI * 0.5);

        let x = 0;
        let y = 0;
        if (v <= 0.40) {
          const t = v / 0.40;
          x = innerX + (crestX - innerX) * Math.sin(t * Math.PI * 0.5);
          const innerY = 0.650 - 0.210 * u;
          y = innerY + (crestY - innerY) * Math.sin(t * Math.PI * 0.5);
        } else {
          const t = (v - 0.40) / 0.60;
          const flare = 0.040 * Math.sin(wheelProgress * Math.PI * 0.5);
          const outerX = side * (halfW * 0.90 + flare);
          x = crestX + (outerX - crestX) * Math.sin(t * Math.PI * 0.5);
          y = crestY - (crestY - archCutoutY) * (1 - Math.cos(t * Math.PI * 0.5));
        }
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
    };
    reg.addNode(createFrontFender(true), 'fender_front_l', 'fender_front_l', undefined, [halfW * 0.86, 0.48, frontAxleZ]);
    reg.addNode(createFrontFender(false), 'fender_front_r', 'fender_front_r', undefined, [-halfW * 0.86, 0.48, frontAxleZ]);

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

    // 4. Pointed Hexagonal Shark-Nose Bumper with ALA 2.0 Active Flaps
    const fBumperMesh = createCurvedPatch(28, 24, (u, v) => {
      const un = u * 2 - 1;
      const angle = un * (Math.PI / 2.12);
      const radiusX = halfW * 0.90;
      const x = Math.sin(angle) * radiusX;
      const maxForwardProj = (halfL - Z_NOSE_SHUT) * Math.cos(angle);

      const centerLeadingY = 0.451;
      const flankLeadingY = 0.440;
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
        startY = 0.360 - 0.200 * t;
        // Hexagonal intake recesses for ALA 2.0 flaps (smooth continuous modulation)
        const centerCavity = Math.abs(un) < 0.38 ? 0.075 * Math.cos((Math.abs(un) / 0.38) * (Math.PI / 2)) : 0;
        const sideCavity = (Math.abs(un) > 0.44 && Math.abs(un) < 0.86)
          ? 0.065 * Math.sin(((Math.abs(un) - 0.44) / 0.42) * Math.PI)
          : 0;
        const intakeRecess = (centerCavity + sideCavity) * Math.sin(t * Math.PI);
        forwardZ = maxForwardProj - intakeRecess;
      } else {
        const t = (v - 0.75) / 0.25;
        startY = 0.160 - (0.160 - (gcY + 0.015)) * t;
        forwardZ = maxForwardProj * (0.95 + 0.05 * t);
      }

      if (Math.abs(un) > 0.85) {
        const cProg = (Math.abs(un) - 0.85) / 0.15;
        if (v < 0.45) {
          startY = startY + (0.340 - startY) * cProg * 0.35;
        }
      }

      const z = Z_NOSE_SHUT + forwardZ;
      return new THREE.Vector3(x, startY, z);
    }, paintMat, H * 0.45);
    reg.addNode(fBumperMesh, 'front_bumper', 'front_bumper', undefined, [0, 0.32, halfL - 0.12]);

    // Front Hexagonal Radiator Grilles
    const centerGrille = createCurvedPatch(14, 8, (u, v) => {
      const un = u * 2 - 1;
      const x = un * 0.28;
      const y = 0.340 - v * 0.180;
      const z = halfL - 0.14 - 0.04 * (1 - un ** 2);
      return new THREE.Vector3(x, y, z);
    }, darkTrimMat, H * 0.45);
    reg.addNode(centerGrille, 'radiator_grille_center', 'front_bumper' as any, 'front_bumper', [0, 0.25, halfL - 0.16]);

    [-1, 1].forEach((side) => {
      const sideGrille = createCurvedPatch(10, 8, (u, v) => {
        const un = u * 2 - 1;
        const x = side * (0.58 + un * 0.18);
        const y = 0.330 - v * 0.170;
        const z = halfL - 0.20 - 0.05 * un;
        return new THREE.Vector3(x, y, z);
      }, darkTrimMat, H * 0.45);
      const sId = side === 1 ? 'radiator_grille_l' : 'radiator_grille_r';
      reg.addNode(sideGrille, sId, 'front_bumper' as any, 'front_bumper', [side * 0.58, 0.25, halfL - 0.22]);
    });

    // Carbon Front Splitter with Lateral Winglets
    const splitterMesh = createCurvedPatch(26, 8, (u, v) => {
      const un = u * 2 - 1;
      const angle = un * (Math.PI / 2.10);
      const radiusX = halfW * 0.94;
      const x = Math.sin(angle) * radiusX;
      const projZ = (halfL - Z_NOSE_SHUT) * Math.cos(angle);
      const z = Z_NOSE_SHUT + projZ;
      const y = gcY + 0.010 + v * 0.016;
      return new THREE.Vector3(x, y, z);
    }, carbonMat, H * 0.45);
    reg.addNode(splitterMesh, 'front_splitter', 'front_splitter', 'front_bumper', [0, gcY + 0.015, halfL - 0.08]);

    // Front & Rear License Plates
    addLicensePlates(reg, [0, 0.28, halfL - 0.02], [0, 0.58, -halfL + 0.02]);

    // 5. Angular Swept Headlights with Sharp Y-Signature DRLs
    // 5. Authentic Lamborghini Y-Signature Angular Headlight Clusters
    [-0.66, 0.66].forEach((hx, idx) => {
      const hlGroup = new THREE.Group();
      hlGroup.name = idx === 0 ? 'headlight_l' : 'headlight_r';

      // Faceted angular low-profile housing
      const bezelGeo = new THREE.CylinderGeometry(0.050, 0.054, 0.008, 20);
      bezelGeo.scale(0.85, 1.0, 2.6);
      bezelGeo.rotateX(0.22);
      bezelGeo.computeVertexNormals();
      const bezel = new THREE.Mesh(bezelGeo, darkTrimMat);
      hlGroup.add(bezel);

      // Dual Projectors
      const projGeo = new THREE.SphereGeometry(0.022, 16, 14);
      projGeo.scale(1.0, 0.6, 1.0);
      projGeo.computeVertexNormals();
      [-0.05, 0.05].forEach((pz) => {
        const pMesh = new THREE.Mesh(projGeo, chromeMat);
        pMesh.position.set(0, 0.004, pz);
        hlGroup.add(pMesh);
      });

      // Sharp Y-Signature Daytime Running Light Guide
      const yStemGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.12, 10);
      yStemGeo.rotateX(Math.PI / 2 + 0.22);
      yStemGeo.computeVertexNormals();
      const yStem = new THREE.Mesh(yStemGeo, headlightMat);
      yStem.position.set(idx === 0 ? 0.028 : -0.028, 0.006, -0.04);
      hlGroup.add(yStem);

      const yBranchGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.08, 10);
      yBranchGeo.rotateX(Math.PI / 2 + 0.22);
      yBranchGeo.rotateY(idx === 0 ? 0.40 : -0.40);
      yBranchGeo.computeVertexNormals();
      const yBranch = new THREE.Mesh(yBranchGeo, headlightMat);
      yBranch.position.set(idx === 0 ? 0.014 : -0.014, 0.006, 0.05);
      hlGroup.add(yBranch);

      // Flush Clear Polycarbonate Glass Cover
      const glassCoverGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.003, 20);
      glassCoverGeo.scale(0.85, 1.0, 2.6);
      glassCoverGeo.rotateX(0.22);
      glassCoverGeo.computeVertexNormals();
      const glassCover = new THREE.Mesh(glassCoverGeo, glassMat);
      glassCover.position.set(0, 0.006, 0);
      hlGroup.add(glassCover);

      const hz = Z_NOSE_SHUT - 0.18;
      const hy = 0.600;
      hlGroup.position.set(hx, hy, hz);
      const hlId = idx === 0 ? 'headlight_l' : 'headlight_r';
      reg.addNode(hlGroup, hlId, hlId as any, 'fender_front_l', [hx, hy, hz]);
    });

    // 6. Monovolume Razor Wedge Greenhouse (H = 1.136m)
    const wsMesh = createCurvedPatch(24, 20, (u, v) => {
      const z = Z_COWL_SHUT + (Z_ROOF_FRONT - Z_COWL_SHUT) * u;
      const vn = v * 2 - 1;
      const halfW_ws = (0.58 - 0.10 * u) - shutLineGapM;
      const x = vn * halfW_ws;
      // Monovolume single-arc sweep ramping directly to H = 1.136m
      const spineY = 0.650 + (H - 0.018 - 0.650) * Math.sin(u * Math.PI * 0.5);
      const crown = 0.018 * (1 - vn ** 2);
      const y = spineY + crown;
      return new THREE.Vector3(x, y, z);
    }, glassMat, H * 0.45);
    reg.addNode(wsMesh, 'windshield', 'windshield', undefined, [0, H * 0.85, (Z_COWL_SHUT + Z_ROOF_FRONT) / 2]);

    // Structural Watertight A-Pillars (Connecting Windshield to Doors & Cant Rails)
    [-1, 1].forEach((side) => {
      const aPillar = createCurvedPatch(16, 8, (u, v) => {
        const z = Z_COWL_SHUT + (Z_ROOF_FRONT - Z_COWL_SHUT) * u;
        const innerX = side * (0.58 - 0.10 * u);
        const innerY = 0.650 + (H - 0.018 - 0.650) * Math.sin(u * Math.PI * 0.5);
        const tUp = 1 - u;
        const outerX = side * (0.48 + (halfW * 0.88 - 0.48) * tUp);
        const outerY = (H - 0.018) - ((H - 0.018) - 0.680) * (tUp ** 0.92);
        const x = innerX + (outerX - innerX) * v;
        const crown = 0.012 * Math.sin(v * Math.PI);
        const y = innerY + (outerY - innerY) * v + crown;
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
      const apId = side === 1 ? 'a_pillar_l' : 'a_pillar_r';
      reg.addNode(aPillar, apId, 'roof' as any, 'roof', [side * halfW * 0.65, 0.90, (Z_COWL_SHUT + Z_ROOF_FRONT) / 2]);
    });

    // Faceted Hexagonal Roof
    const roofMesh = createCurvedPatch(24, 22, (u, v) => {
      const z = Z_ROOF_FRONT + (Z_ROOF_REAR - Z_ROOF_FRONT) * u;
      const vn = v * 2 - 1;
      const roofHalfW = 0.48 - shutLineGapM;
      const x = vn * roofHalfW;
      const centerU = (z - 0.0) / 0.34;
      const longitudinal = (H - 0.018) - 0.010 * (centerU ** 2);
      // Sharp hexagonal creases across roof
      const hexFacet = -0.016 * Math.abs(vn) + 0.008 * (1 - vn ** 2);
      const y = longitudinal + hexFacet;
      return new THREE.Vector3(x, y, z);
    }, paintMat, H * 0.45);
    reg.addNode(roofMesh, 'roof', 'roof', undefined, [0, H, (Z_ROOF_FRONT + Z_ROOF_REAR) / 2]);

    // Slatted Hexagonal Carbon Louvred Engine Cover Spine
    const engineCover = createCurvedPatch(24, 18, (u, v) => {
      const z = Z_ROOF_REAR + (Z_DECK_FRONT - Z_ROOF_REAR) * u;
      const vn = v * 2 - 1;
      const halfW_eng = (0.42 + 0.10 * u) - shutLineGapM;
      const x = vn * halfW_eng;
      const spineY = (H - 0.018) - ((H - 0.018) - 0.860) * (u ** 1.15);
      // High-mounted central carbon spine crease
      const centerSpine = 0.024 * (1 - Math.abs(vn));
      const y = spineY + centerSpine;
      return new THREE.Vector3(x, y, z);
    }, carbonMat, H * 0.45);
    reg.addNode(engineCover, 'rear_window', 'rear_window', undefined, [0, 0.95, (Z_ROOF_REAR + Z_DECK_FRONT) / 2]);

    // Hexagonal Engine Louver Slats
    for (let s = 0; s < 5; s++) {
      const uS = 0.18 + s * 0.15;
      const zS = Z_ROOF_REAR + (Z_DECK_FRONT - Z_ROOF_REAR) * uS;
      const slatGeo = new THREE.BoxGeometry(0.68, 0.010, 0.045);
      slatGeo.computeVertexNormals();
      const slat = new THREE.Mesh(slatGeo, carbonMat);
      slat.position.set(0, (H - 0.018) - ((H - 0.018) - 0.860) * (uS ** 1.15) + 0.010, zS);
      slat.rotation.x = -0.25;
      reg.addNode(slat, `engine_slat_${s}`, `engine_slat_${s}` as any, undefined, [0, slat.position.y, zS]);
    }

    // Flush Side Windows (Tapering along C-pillar)
    [-1, 1].forEach((side) => {
      const swMesh = createCurvedPatch(24, 18, (u, v) => {
        const z = Z_COWL_SHUT + (Z_DOOR_REAR - Z_COWL_SHUT) * u;
        const beltY = 0.680;
        let roofY = (H - 0.018) - 0.030 * Math.sin(u * Math.PI);
        let roofX = side * 0.48;

        if (z > Z_ROOF_FRONT) {
          // A-pillar: window tapers from roof front down to cowl shut line
          const tUp = (z - Z_ROOF_FRONT) / (Z_COWL_SHUT - Z_ROOF_FRONT);
          roofY = (H - 0.018) - ((H - 0.018) - beltY) * (tUp ** 0.92);
          roofX = side * (0.48 + (halfW * 0.88 - 0.48) * tUp);
        } else if (z < Z_ROOF_REAR) {
          const tDown = (Z_ROOF_REAR - z) / (Z_ROOF_REAR - Z_DOOR_REAR);
          roofY = (H - 0.018) - ((H - 0.018) - beltY) * (tDown ** 0.88);
          roofX = side * (0.48 + (halfW * 0.88 - 0.48) * tDown);
        }

        const y = beltY + (roofY - beltY) * v;
        const doorX = side * (halfW * 0.88 - shutLineGapM);
        const x = doorX + (roofX - doorX) * v;
        return new THREE.Vector3(x, y, z);
      }, glassMat, H * 0.45);
      const swId = side === 1 ? 'window_glass_l' : 'window_glass_r';
      reg.addNode(swMesh, swId, 'windshield' as any, 'roof', [side * halfW * 0.74, H * 0.80, 0]);
    });

    // 7. Sculpted Doors with Geometric Creases & Side Scissor Lines
    const createDoor = (isLeft: boolean) => {
      const side = isLeft ? 1 : -1;
      return createCurvedPatch(24, 22, (u, v) => {
        const z = Z_COWL_SHUT + (Z_DOOR_REAR - Z_COWL_SHUT) * u;
        const beltY = 0.680;
        const rockerY = gcY + 0.050;
        const y = rockerY + (beltY - rockerY) * v;

        // Extreme geometric angular creasing
        let waistTuck = -0.045 * Math.sin(u * Math.PI);
        if (u > 0.40) {
          const sProg = (u - 0.40) / 0.60;
          waistTuck -= 0.075 * (sProg ** 1.6) * Math.sin(v * Math.PI);
        }

        const verticalTumble = 0.022 * Math.sin(v * Math.PI);
        const x = side * (halfW * 0.90 + waistTuck + verticalTumble - shutLineGapM);
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
    };
    reg.addNode(createDoor(true), 'door_l', 'door_l', undefined, [halfW * 0.88, 0.40, (Z_COWL_SHUT + Z_DOOR_REAR) / 2]);
    reg.addNode(createDoor(false), 'door_r', 'door_r', undefined, [-halfW * 0.88, 0.40, (Z_COWL_SHUT + Z_DOOR_REAR) / 2]);

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
      left: [halfW * 0.88, 0.70, Z_COWL_SHUT + 0.05],
      right: [-halfW * 0.88, 0.70, Z_COWL_SHUT + 0.05]
    }, paintMat, carbonMat);

    // 8. Dramatic Geometric Rear Quarters with Massive Radiator Air Scoops
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

        const innerX = side * (halfW * 0.54);
        const crestX = side * (halfW * 0.92 + 0.035 * Math.sin(wheelProgress * Math.PI * 0.5));
        const crestY = 0.800 + 0.035 * Math.sin(wheelProgress * Math.PI * 0.5);

        let x = 0;
        let y = 0;
        if (v <= 0.40) {
          const t = v / 0.40;
          x = innerX + (crestX - innerX) * Math.sin(t * Math.PI * 0.5);
          y = 0.680 + (crestY - 0.680) * Math.sin(t * Math.PI * 0.5);
        } else {
          const t = (v - 0.40) / 0.60;
          const outerX = side * (halfW * 0.995); // Massive 2.098m wide stance
          x = crestX + (outerX - crestX) * Math.sin(t * Math.PI * 0.5);
          y = crestY - (crestY - archCutoutY) * (1 - Math.cos(t * Math.PI * 0.5));
        }
        return new THREE.Vector3(x, y, z);
      }, paintMat, H * 0.45);
    };
    reg.addNode(createRearQuarter(true), 'quarter_panel_l', 'quarter_panel_l', undefined, [halfW * 0.92, 0.60, rearAxleZ]);
    reg.addNode(createRearQuarter(false), 'quarter_panel_r', 'quarter_panel_r', undefined, [-halfW * 0.92, 0.60, rearAxleZ]);

    // Side Intake Grille Vents
    [-1, 1].forEach((side) => {
      const vent = createCurvedPatch(12, 8, (u, v) => {
        const z = Z_DOOR_REAR + u * 0.38;
        const x = side * (halfW * 0.89 - 0.09 * v);
        const y = 0.360 + v * 0.300;
        return new THREE.Vector3(x, y, z);
      }, darkTrimMat, H * 0.45);
      const vId = side === 1 ? 'side_intake_grille_l' : 'side_intake_grille_r';
      reg.addNode(vent, vId, vId as any, undefined, [side * halfW * 0.84, 0.50, Z_DOOR_REAR + 0.19]);
    });

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
      reg.addNode(tub, tubId, 'quarter_panel_l' as any, undefined, [side * halfW * 0.88, rearTyreRadius, rearAxleZ]);
    });

    // 9. Rear Decklid with Central Omega Wing Mount
    const rearDeckMesh = createCurvedPatch(24, 20, (u, v) => {
      const z = Z_DECK_FRONT - (Z_DECK_FRONT - Z_DECK_TAIL) * u;
      const vn = v * 2 - 1;
      const deckHalfW = (0.54 + 0.14 * u) - shutLineGapM;
      const x = vn * deckHalfW;
      let y = 0.860 - 0.060 * u;
      if (u > 0.65) {
        const kick = (u - 0.65) / 0.35;
        y += 0.040 * (kick ** 2);
      }
      y += 0.015 * (1 - vn ** 2);
      return new THREE.Vector3(x, y, z);
    }, paintMat, H * 0.45);
    reg.addNode(rearDeckMesh, 'rear_deck', 'rear_deck', undefined, [0, 0.82, (Z_DECK_FRONT + Z_DECK_TAIL) / 2]);

    // 10. Rear Bumper Fascia, Y-Signature Taillights & Carbon Diffuser
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
        if (Math.abs(un) < 0.36) {
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

    // Horizontal Y-Signature Taillight Clusters
    [-0.58, 0.58].forEach((tx, idx) => {
      const tlGroup = new THREE.Group();
      tlGroup.name = idx === 0 ? 'taillight_l' : 'taillight_r';

      const boxGeo = new THREE.BoxGeometry(0.24, 0.038, 0.04);
      boxGeo.computeVertexNormals();
      const box = new THREE.Mesh(boxGeo, darkTrimMat);
      tlGroup.add(box);

      // Y-shaped red LED guides
      const stemGeo = new THREE.BoxGeometry(0.12, 0.012, 0.010);
      stemGeo.computeVertexNormals();
      const stem = new THREE.Mesh(stemGeo, taillightMat);
      stem.position.set(idx === 0 ? 0.04 : -0.04, 0, 0.018);
      tlGroup.add(stem);

      const br1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.010), taillightMat);
      br1.position.set(idx === 0 ? -0.04 : 0.04, 0.010, 0.018);
      br1.rotation.z = idx === 0 ? 0.45 : -0.45;
      tlGroup.add(br1);

      const br2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.010), taillightMat);
      br2.position.set(idx === 0 ? -0.04 : 0.04, -0.010, 0.018);
      br2.rotation.z = idx === 0 ? -0.45 : 0.45;
      tlGroup.add(br2);

      const tz = -halfL + 0.06;
      const ty = 0.740;
      tlGroup.position.set(tx, ty, tz);
      const tlId = idx === 0 ? 'taillight_l' : 'taillight_r';
      reg.addNode(tlGroup, tlId, tlId as any, 'rear_bumper', [tx, ty, tz]);
    });

    // Massive Carbon Rear Diffuser with 6 Vertical Strakes
    const diffuserGroup = new THREE.Group();
    diffuserGroup.name = 'rear_diffuser';

    const diffTrayMesh = createCurvedPatch(22, 10, (u, v) => {
      const un = u * 2 - 1;
      const x = un * (halfW * 0.82);
      const z = -halfL + 0.48;
      const zEnd = -halfL + 0.02;
      const curZ = z + (zEnd - z) * v;
      const y = gcY + 0.015 + 0.125 * (v ** 1.8);
      return new THREE.Vector3(x, y, curZ);
    }, carbonMat, H * 0.45);
    diffuserGroup.add(diffTrayMesh);

    [-0.60, -0.36, -0.12, 0.12, 0.36, 0.60].forEach((fx, idx) => {
      const finMesh = createCurvedPatch(8, 6, (u, v) => {
        const curZ = -halfL + 0.38 + u * 0.30;
        const curY = gcY + 0.015 + 0.125 * (u ** 1.8) - v * 0.065;
        return new THREE.Vector3(fx, curY, curZ);
      }, carbonMat, H * 0.45);
      finMesh.name = `diffuser_fin_${idx}`;
      diffuserGroup.add(finMesh);
    });

    diffuserGroup.position.set(0, 0, 0);
    reg.addNode(diffuserGroup, 'rear_diffuser', 'rear_diffuser', 'rear_bumper', [0, gcY + 0.04, -halfL + 0.18]);

    // High-Mounted Center Dual Titanium Exhaust Outlets
    createExhaustAssembly(reg, [
      [-0.10, 0.620, -halfL + 0.02],
      [0.10, 0.620, -halfL + 0.02]
    ], 0.054, 0.14, 'rear_diffuser');

    // 11. High-Mounted ALA 2.0 Carbon Rear Wing with Central Aero Pylon
    const wingGroup = new THREE.Group();
    wingGroup.name = 'rear_wing';

    const wingSpan = W * 0.88; // ~1.84m span
    const wingZ = -halfL + 0.16;
    const wingY = 1.180;

    // Aerodynamic Carbon Wing Blade
    const wingBladeMesh = createCurvedPatch(26, 10, (u, v) => {
      const un = u * 2 - 1;
      const x = un * (wingSpan / 2);
      const chord = 0.280 - 0.030 * (un ** 2);
      const curZ = wingZ - (v - 0.5) * chord;
      const camber = 0.025 * Math.sin(v * Math.PI);
      const curY = wingY + camber - 0.032 * v;
      return new THREE.Vector3(x, curY, curZ);
    }, carbonMat, H * 0.45);
    wingBladeMesh.name = 'wing_blade';
    wingGroup.add(wingBladeMesh);

    // Central ALA 2.0 Aerodynamic Pylon
    const centerPylon = createCurvedPatch(14, 8, (u, v) => {
      const vn = v * 2 - 1;
      const x = vn * 0.020;
      const deckZ = Z_DECK_TAIL + 0.15;
      const curZ = deckZ + (wingZ - deckZ) * u;
      const curY = 0.860 + (wingY - 0.860) * u;
      return new THREE.Vector3(x, curY, curZ);
    }, carbonMat, H * 0.45);
    centerPylon.name = 'wing_pylon_center';
    wingGroup.add(centerPylon);

    // Outer Dual Struts
    [-wingSpan * 0.32, wingSpan * 0.32].forEach((px, idx) => {
      const strutMesh = createCurvedPatch(12, 6, (u, v) => {
        const vn = v * 2 - 1;
        const x = px + vn * 0.010;
        const deckZ = Z_DECK_TAIL + 0.12;
        const curZ = deckZ + (wingZ - deckZ) * u;
        const curY = 0.840 + (wingY - 0.840) * u;
        return new THREE.Vector3(x, curY, curZ);
      }, carbonMat, H * 0.45);
      strutMesh.name = idx === 0 ? 'wing_upright_l' : 'wing_upright_r';
      wingGroup.add(strutMesh);
    });

    // Sculpted Carbon Endplates
    [-wingSpan / 2, wingSpan / 2].forEach((ex, idx) => {
      const endplateMesh = createCurvedPatch(10, 8, (u, v) => {
        const curZ = wingZ - 0.16 + u * 0.32;
        const curY = wingY - 0.08 + v * 0.18;
        return new THREE.Vector3(ex, curY, curZ);
      }, carbonMat, H * 0.45);
      endplateMesh.name = idx === 0 ? 'wing_endplate_l' : 'wing_endplate_r';
      wingGroup.add(endplateMesh);
    });

    wingGroup.position.set(0, 0, 0);
    reg.addNode(wingGroup, 'rear_wing', 'wing_blade' as any, 'rear_deck', [0, wingY, wingZ]);

    // 12. Cockpit Interior
    const interiorGroup = new THREE.Group();
    interiorGroup.name = 'interior';

    const dashMesh = createCurvedPatch(16, 10, (u, v) => {
      const un = u * 2 - 1;
      const x = un * (halfW * 0.54);
      const curZ = Z_COWL_SHUT - 0.05 - v * 0.22;
      const curY = 0.650 - v * 0.150;
      return new THREE.Vector3(x, curY, curZ);
    }, interiorMat, H * 0.45);
    interiorGroup.add(dashMesh);

    // Racing Steering Wheel
    const wheelGeo = new THREE.TorusGeometry(0.13, 0.016, 12, 24);
    wheelGeo.rotateX(Math.PI / 3.8);
    wheelGeo.computeVertexNormals();
    const steeringWheel = new THREE.Mesh(wheelGeo, interiorMat);
    steeringWheel.position.set(halfW * 0.30, 0.65, Z_COWL_SHUT - 0.18);
    interiorGroup.add(steeringWheel);

    reg.addNode(interiorGroup, 'interior', 'interior', undefined, [0, 0.58, 0]);

    return { group: reg.root, nodes: reg.nodes };
  }
}
