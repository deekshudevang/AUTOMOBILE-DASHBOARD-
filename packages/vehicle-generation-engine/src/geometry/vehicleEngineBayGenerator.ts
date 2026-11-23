import * as THREE from 'three';
import { VehicleSchema2 } from '@autoverse/shared-types';

export type EngineArchetype =
  | 'W16_MID'
  | 'V12_MID'
  | 'V10_MID'
  | 'V8_MID'
  | 'V6_MID'
  | 'BOXER_REAR'
  | 'BOXER_MID'
  | 'V8_FRONT'
  | 'INLINE_FRONT'
  | 'ROTARY_FRONT'
  | 'ELECTRIC_EV';

export interface EngineBaySpec {
  archetype: EngineArchetype;
  displacementCc: number;
  engineCode: string;
  isForcedInduction: boolean;
  inductionType: 'twin_turbo' | 'quad_turbo' | 'single_turbo' | 'supercharged' | 'naturally_aspirated' | 'dual_motor' | 'quad_motor';
  isHybrid: boolean;
  isMidRear: boolean;
  cylinderCount: number;
  camCoverColor: string;
  intakeColor: string;
}

export class VehicleEngineBayGenerator {
  /**
   * Resolves engine archetype from vehicle metadata, ID, and manufacturer specifications
   */
  public static resolveEngineSpec(spec: VehicleSchema2): EngineBaySpec {
    const id = (spec.vehicle.id || '').toLowerCase();
    const model = (spec.vehicle.model || '').toLowerCase();
    const mfr = (spec.vehicle.manufacturer || '').toLowerCase();

    // 1. Bugatti W16
    if (mfr.includes('bugatti') || id.includes('chiron')) {
      return {
        archetype: 'W16_MID',
        displacementCc: 7993,
        engineCode: '8.0 W16 Quad-Turbo',
        isForcedInduction: true,
        inductionType: 'quad_turbo',
        isHybrid: false,
        isMidRear: true,
        cylinderCount: 16,
        camCoverColor: '#1e293b',
        intakeColor: '#38bdf8'
      };
    }

    // 2. Electric EVs (Rimac, Spectre)
    if (id.includes('nevera') || id.includes('spectre')) {
      return {
        archetype: 'ELECTRIC_EV',
        displacementCc: 0,
        engineCode: id.includes('nevera') ? 'Quad PM-E-Motors' : 'Dual Synchronous E-Motors',
        isForcedInduction: false,
        inductionType: id.includes('nevera') ? 'quad_motor' : 'dual_motor',
        isHybrid: false,
        isMidRear: id.includes('nevera'),
        cylinderCount: 0,
        camCoverColor: '#f97316', // High-voltage orange
        intakeColor: '#0ea5e9'
      };
    }

    // 3. Rotary (RX-7)
    if (id.includes('rx7') || id.includes('rx-7') || model.includes('rx-7')) {
      return {
        archetype: 'ROTARY_FRONT',
        displacementCc: 1308,
        engineCode: '13B-REW Sequential Twin-Turbo',
        isForcedInduction: true,
        inductionType: 'twin_turbo',
        isHybrid: false,
        isMidRear: false,
        cylinderCount: 2,
        camCoverColor: '#27272a',
        intakeColor: '#94a3b8'
      };
    }

    // 4. Porsche Boxers
    if (mfr.includes('porsche')) {
      if (id.includes('718') || id.includes('cayman')) {
        return {
          archetype: 'BOXER_MID',
          displacementCc: 3996,
          engineCode: '4.0 Flat-6 GT3-Cup',
          isForcedInduction: false,
          inductionType: 'naturally_aspirated',
          isHybrid: false,
          isMidRear: true,
          cylinderCount: 6,
          camCoverColor: '#18181b',
          intakeColor: '#e2e8f0'
        };
      }
      return {
        archetype: 'BOXER_REAR',
        displacementCc: id.includes('turbo') || id.includes('935') ? 3745 : 3996,
        engineCode: id.includes('turbo') ? '3.8 Boxer-6 VTG' : '4.0 Boxer-6 DOHC',
        isForcedInduction: id.includes('turbo') || id.includes('935') || id.includes('dakar'),
        inductionType: id.includes('gt3') ? 'naturally_aspirated' : 'twin_turbo',
        isHybrid: id.includes('918'),
        isMidRear: true,
        cylinderCount: 6,
        camCoverColor: '#27272a',
        intakeColor: '#dc2626'
      };
    }

    // 5. V12 Mid/Rear (Aventador, Revuelto, Essenza, LaFerrari, FXX-K, Valkyrie, Huayra)
    if (
      id.includes('aventador') ||
      id.includes('revuelto') ||
      id.includes('essenza') ||
      id.includes('laferrari') ||
      id.includes('fxx') ||
      id.includes('valkyrie') ||
      id.includes('huayra')
    ) {
      return {
        archetype: 'V12_MID',
        displacementCc: 6498,
        engineCode: '6.5L 60° V12 High-Rev',
        isForcedInduction: id.includes('huayra'),
        inductionType: id.includes('huayra') ? 'twin_turbo' : 'naturally_aspirated',
        isHybrid: id.includes('laferrari') || id.includes('fxx') || id.includes('revuelto') || id.includes('valkyrie'),
        isMidRear: true,
        cylinderCount: 12,
        camCoverColor: '#b91c1c', // Rosso Corsa crackle
        intakeColor: '#18181b' // Raw weave carbon
      };
    }

    // 6. V10 Mid (Huracan STO, Audi R8, Lexus LFA)
    if (id.includes('huracan') || id.includes('r8') || id.includes('lfa')) {
      return {
        archetype: 'V10_MID',
        displacementCc: id.includes('lfa') ? 4805 : 5204,
        engineCode: id.includes('lfa') ? '4.8L 1LR-GUE 72° V10' : '5.2L FSI 90° V10',
        isForcedInduction: false,
        inductionType: 'naturally_aspirated',
        isHybrid: false,
        isMidRear: !id.includes('lfa'),
        cylinderCount: 10,
        camCoverColor: '#92400e', // Bronze / Mag anodized
        intakeColor: '#475569'
      };
    }

    // 7. V8 Mid (Jesko, P1, 488 Pista, F8, 720S, 765LT, Senna, C8 Z06, 918 Spyder)
    if (
      id.includes('jesko') ||
      id.includes('p1') ||
      id.includes('488') ||
      id.includes('f8') ||
      id.includes('720s') ||
      id.includes('765lt') ||
      id.includes('senna') ||
      id.includes('corvette_z06') ||
      id.includes('c8') ||
      id.includes('918')
    ) {
      return {
        archetype: 'V8_MID',
        displacementCc: id.includes('corvette') ? 5463 : id.includes('jesko') ? 5065 : 3994,
        engineCode: '4.0L Twin-Turbo Flat-Plane V8',
        isForcedInduction: !id.includes('corvette') && !id.includes('918'),
        inductionType: id.includes('corvette') || id.includes('918') ? 'naturally_aspirated' : 'twin_turbo',
        isHybrid: id.includes('p1') || id.includes('918'),
        isMidRear: true,
        cylinderCount: 8,
        camCoverColor: '#dc2626',
        intakeColor: '#18181b'
      };
    }

    // 8. V6 Mid (296 GTB, AMG ONE, Ford GT, NSX Type S, MC20, Lotus Emira)
    if (
      id.includes('296') ||
      id.includes('amg_one') ||
      id.includes('ford_gt') ||
      (id.includes('nsx') && !id.includes('na2')) ||
      id.includes('mc20') ||
      id.includes('emira')
    ) {
      return {
        archetype: 'V6_MID',
        displacementCc: id.includes('amg_one') ? 1599 : id.includes('emira') ? 3456 : 2992,
        engineCode: 'Hot-V Twin-Turbocharged V6',
        isForcedInduction: true,
        inductionType: id.includes('emira') ? 'supercharged' : 'twin_turbo',
        isHybrid: id.includes('296') || id.includes('amg_one') || id.includes('nsx'),
        isMidRear: true,
        cylinderCount: 6,
        camCoverColor: '#991b1b',
        intakeColor: '#334155'
      };
    }

    // 9. Front V8 Supercharged / Muscle / AMG
    if (
      id.includes('gt500') ||
      id.includes('demon') ||
      id.includes('zl1') ||
      id.includes('zr1') ||
      id.includes('amg_gt') ||
      id.includes('f-type') ||
      id.includes('ftype') ||
      model.includes('challenger') ||
      model.includes('mustang') ||
      model.includes('camaro')
    ) {
      return {
        archetype: 'V8_FRONT',
        displacementCc: 6162,
        engineCode: '6.2L Supercharged Cross-Plane V8',
        isForcedInduction: true,
        inductionType: 'supercharged',
        isHybrid: false,
        isMidRear: false,
        cylinderCount: 8,
        camCoverColor: id.includes('demon') ? '#eab308' : '#dc2626',
        intakeColor: '#0f172a'
      };
    }

    // 10. Default / JDM / European Inline (I6, I4, Boxer-4)
    return {
      archetype: 'INLINE_FRONT',
      displacementCc: id.includes('evo') || id.includes('sti') || id.includes('miata') ? 1998 : 2998,
      engineCode: id.includes('sti') ? 'EJ257 Turbo Boxer-4' : id.includes('evo') ? '4G63T MIVEC I4' : '3.0L TwinPower Turbo I6',
      isForcedInduction: !id.includes('miata') && !id.includes('2000gt'),
      inductionType: id.includes('miata') || id.includes('2000gt') ? 'naturally_aspirated' : 'twin_turbo',
      isHybrid: false,
      isMidRear: false,
      cylinderCount: id.includes('evo') || id.includes('sti') || id.includes('miata') || id.includes('a110') ? 4 : 6,
      camCoverColor: id.includes('r34') || id.includes('evo') ? '#dc2626' : '#1e293b',
      intakeColor: '#cbd5e1'
    };
  }

  /**
   * Generates complete 3D engine compartment assembly
   */
  public static generateEngineBay(spec: VehicleSchema2): THREE.Group {
    const engineSpec = this.resolveEngineSpec(spec);
    const dims = spec.dimensions || { length: 4.6, width: 2.0, height: 1.25 };
    const group = new THREE.Group();
    group.name = `engine_bay_${spec.vehicle.id}`;

    // Common PBR Materials
    const carbonMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#18181b'),
      roughness: 0.35,
      metalness: 0.25
    });
    const blockMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#27272a'),
      roughness: 0.55,
      metalness: 0.8
    });
    const camMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(engineSpec.camCoverColor),
      roughness: 0.45,
      metalness: 0.65
    });
    const intakeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(engineSpec.intakeColor),
      roughness: 0.4,
      metalness: 0.7
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e2e8f0'),
      roughness: 0.1,
      metalness: 0.95
    });
    const orangeHvMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ea580c'),
      roughness: 0.3,
      metalness: 0.2
    });

    // 1. Structural Engine Bay Tub & Firewall
    const bayTub = this.buildEngineBayTub(engineSpec.isMidRear, dims, carbonMat);
    group.add(bayTub);

    // 2. Cooling Package (Radiator core + dual electric cooling fans)
    const coolingPack = this.buildCoolingRadiator(engineSpec.isMidRear, dims, blockMat, chromeMat);
    group.add(coolingPack);

    // 3. Fluid Reservoirs & 12V Auxiliary Battery
    const auxiliaryGear = this.buildAuxiliaryGear(engineSpec.isMidRear, dims);
    group.add(auxiliaryGear);

    // 4. Engine Core Block & Induction System
    let coreEngine: THREE.Group;
    switch (engineSpec.archetype) {
      case 'W16_MID':
        coreEngine = this.buildW16QuadTurbo(blockMat, camMat, intakeMat, chromeMat);
        break;
      case 'V12_MID':
        coreEngine = this.buildV12Engine(blockMat, camMat, intakeMat, carbonMat, chromeMat);
        break;
      case 'V10_MID':
        coreEngine = this.buildV10Engine(blockMat, camMat, intakeMat, carbonMat);
        break;
      case 'V8_MID':
        coreEngine = this.buildV8MidEngine(blockMat, camMat, intakeMat, chromeMat);
        break;
      case 'V6_MID':
        coreEngine = this.buildV6MidEngine(blockMat, camMat, intakeMat, chromeMat);
        break;
      case 'BOXER_REAR':
      case 'BOXER_MID':
        coreEngine = this.buildBoxerEngine(engineSpec.archetype === 'BOXER_REAR', blockMat, camMat, intakeMat, carbonMat);
        break;
      case 'V8_FRONT':
        coreEngine = this.buildV8FrontSupercharged(blockMat, camMat, intakeMat, chromeMat);
        break;
      case 'ROTARY_FRONT':
        coreEngine = this.buildRotaryEngine(blockMat, camMat, intakeMat, chromeMat);
        break;
      case 'ELECTRIC_EV':
        coreEngine = this.buildElectricDriveUnits(dims, blockMat, orangeHvMat, carbonMat);
        break;
      case 'INLINE_FRONT':
      default:
        coreEngine = this.buildInlineEngine(engineSpec.cylinderCount, blockMat, camMat, intakeMat, chromeMat);
        break;
    }

    // Position Core Engine in Chassis (Front vs Mid/Rear)
    const engineZ = engineSpec.isMidRear ? -dims.length * 0.16 : dims.length * 0.28;
    const engineY = dims.height * 0.26;
    coreEngine.position.set(0, engineY, engineZ);
    group.add(coreEngine);

    // 5. Chassis Strut Bracing (Cross-Tower Bar / X-Brace)
    const strutBrace = this.buildStrutBracing(engineSpec.isMidRear, dims, chromeMat, carbonMat);
    group.add(strutBrace);

    group.userData = {
      isEngineBay: true,
      archetype: engineSpec.archetype,
      engineCode: engineSpec.engineCode,
      displacementCc: engineSpec.displacementCc,
      induction: engineSpec.inductionType
    };

    return group;
  }

  // =========================================================================
  // ARCHETYPE IMPLEMENTATIONS
  // =========================================================================

  private static buildW16QuadTurbo(
    blockMat: THREE.Material,
    camMat: THREE.Material,
    intakeMat: THREE.Material,
    chromeMat: THREE.Material
  ): THREE.Group {
    const root = new THREE.Group();
    root.name = 'powertrain_w16_quad_turbo';

    // Massive 4-bank VR-offset Crankcase
    const crankcaseGeo = new THREE.BoxGeometry(0.72, 0.42, 0.85);
    const crankcase = new THREE.Mesh(crankcaseGeo, blockMat);
    root.add(crankcase);

    // Quad Cam Covers (2 banks per side, stepped)
    [-0.24, -0.09, 0.09, 0.24].forEach((cx, idx) => {
      const bankGeo = new THREE.BoxGeometry(0.12, 0.14, 0.82);
      const bank = new THREE.Mesh(bankGeo, camMat);
      bank.position.set(cx, 0.24, 0);
      root.add(bank);
    });

    // Dual Twin-Turbochargers on outer flanks (4 turbos total)
    [
      [-0.42, 0.05, 0.2],
      [-0.42, 0.05, -0.2],
      [0.42, 0.05, 0.2],
      [0.42, 0.05, -0.2]
    ].forEach(([tx, ty, tz]) => {
      const turboGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16);
      turboGeo.rotateZ(Math.PI / 2);
      const turbo = new THREE.Mesh(turboGeo, chromeMat);
      turbo.position.set(tx, ty, tz);
      root.add(turbo);
    });

    // Massive Dual Air-Water Charge Air Coolers
    [-0.22, 0.22].forEach(ix => {
      const icGeo = new THREE.BoxGeometry(0.18, 0.14, 0.65);
      const ic = new THREE.Mesh(icGeo, intakeMat);
      ic.position.set(ix, 0.35, 0);
      root.add(ic);
    });

    return root;
  }

  private static buildV12Engine(
    blockMat: THREE.Material,
    camMat: THREE.Material,
    intakeMat: THREE.Material,
    carbonMat: THREE.Material,
    chromeMat: THREE.Material
  ): THREE.Group {
    const root = new THREE.Group();
    root.name = 'powertrain_v12_longitudinal';

    // 60-degree V12 Monobloc
    const blockGeo = new THREE.BoxGeometry(0.58, 0.38, 0.95);
    const block = new THREE.Mesh(blockGeo, blockMat);
    root.add(block);

    // Dual Long Camshaft Valve Covers (Rosso crackle or gold)
    [-0.22, 0.22].forEach((vx, idx) => {
      const camGeo = new THREE.BoxGeometry(0.18, 0.15, 0.92);
      const cam = new THREE.Mesh(camGeo, camMat);
      cam.position.set(vx, 0.22, 0);
      cam.rotation.z = idx === 0 ? 0.3 : -0.3;
      root.add(cam);
    });

    // 12 Velocity Stack Intake Runners / Carbon Plenums
    const plenumGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.88, 16);
    plenumGeo.rotateX(Math.PI / 2);
    [-0.1, 0.1].forEach(px => {
      const plenum = new THREE.Mesh(plenumGeo, carbonMat);
      plenum.position.set(px, 0.35, 0);
      root.add(plenum);
    });

    // Stainless Braided Dry-Sump Oil Reservoir
    const tankGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.28, 16);
    const tank = new THREE.Mesh(tankGeo, chromeMat);
    tank.position.set(0.32, 0.12, -0.42);
    root.add(tank);

    return root;
  }

  private static buildV10Engine(
    blockMat: THREE.Material,
    camMat: THREE.Material,
    intakeMat: THREE.Material,
    carbonMat: THREE.Material
  ): THREE.Group {
    const root = new THREE.Group();
    root.name = 'powertrain_v10_atmospheric';

    // 90° V10 Crankcase
    const blockGeo = new THREE.BoxGeometry(0.54, 0.35, 0.82);
    const block = new THREE.Mesh(blockGeo, blockMat);
    root.add(block);

    // Angled Magnesium Valve Covers
    [-0.2, 0.2].forEach((vx, idx) => {
      const camGeo = new THREE.BoxGeometry(0.16, 0.14, 0.78);
      const cam = new THREE.Mesh(camGeo, camMat);
      cam.position.set(vx, 0.2, 0);
      cam.rotation.z = idx === 0 ? 0.35 : -0.35;
      root.add(cam);
    });

    // Ten individual intake runner horns feeding central acoustic box
    const manifoldGeo = new THREE.BoxGeometry(0.28, 0.16, 0.76);
    const manifold = new THREE.Mesh(manifoldGeo, intakeMat);
    manifold.position.set(0, 0.32, 0);
    root.add(manifold);

    // Carbon Cold-Air Snorkels
    [-0.24, 0.24].forEach(sx => {
      const pipeGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.45, 12);
      pipeGeo.rotateZ(sx < 0 ? -0.4 : 0.4);
      const pipe = new THREE.Mesh(pipeGeo, carbonMat);
      pipe.position.set(sx, 0.26, 0.32);
      root.add(pipe);
    });

    return root;
  }

  private static buildV8MidEngine(
    blockMat: THREE.Material,
    camMat: THREE.Material,
    intakeMat: THREE.Material,
    chromeMat: THREE.Material
  ): THREE.Group {
    const root = new THREE.Group();
    root.name = 'powertrain_v8_mid_twinturbo';

    // Compact Flat-plane V8 Block
    const blockGeo = new THREE.BoxGeometry(0.56, 0.36, 0.68);
    const block = new THREE.Mesh(blockGeo, blockMat);
    root.add(block);

    // Cam Covers
    [-0.21, 0.21].forEach((vx, idx) => {
      const camGeo = new THREE.BoxGeometry(0.17, 0.13, 0.65);
      const cam = new THREE.Mesh(camGeo, camMat);
      cam.position.set(vx, 0.2, 0);
      cam.rotation.z = idx === 0 ? 0.35 : -0.35;
      root.add(cam);
    });

    // Central Intake Plenum with Throttle Bodies
    const plenumGeo = new THREE.BoxGeometry(0.26, 0.15, 0.62);
    const plenum = new THREE.Mesh(plenumGeo, intakeMat);
    plenum.position.set(0, 0.31, 0);
    root.add(plenum);

    // Twin Symmetrical Turbochargers
    [-0.34, 0.34].forEach(tx => {
      const turboGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.14, 16);
      turboGeo.rotateZ(Math.PI / 2);
      const turbo = new THREE.Mesh(turboGeo, chromeMat);
      turbo.position.set(tx, 0.08, -0.22);
      root.add(turbo);
    });

    return root;
  }

  private static buildV6MidEngine(
    blockMat: THREE.Material,
    camMat: THREE.Material,
    intakeMat: THREE.Material,
    chromeMat: THREE.Material
  ): THREE.Group {
    const root = new THREE.Group();
    root.name = 'powertrain_v6_mid_hot_v';

    // 120-degree Hot-V Block
    const blockGeo = new THREE.BoxGeometry(0.62, 0.28, 0.58);
    const block = new THREE.Mesh(blockGeo, blockMat);
    root.add(block);

    // Cam Covers laid low
    [-0.24, 0.24].forEach((vx, idx) => {
      const camGeo = new THREE.BoxGeometry(0.16, 0.12, 0.54);
      const cam = new THREE.Mesh(camGeo, camMat);
      cam.position.set(vx, 0.14, 0);
      cam.rotation.z = idx === 0 ? 0.45 : -0.45;
      root.add(cam);
    });

    // Twin Turbos nestled right inside the "Hot V" valley
    const valleyTurboGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.18, 16);
    valleyTurboGeo.rotateX(Math.PI / 2);
    const turbo = new THREE.Mesh(valleyTurboGeo, chromeMat);
    turbo.position.set(0, 0.24, 0.05);
    root.add(turbo);

    // Carbon Plenum Surround
    const intakeGeo = new THREE.BoxGeometry(0.22, 0.12, 0.52);
    const intake = new THREE.Mesh(intakeGeo, intakeMat);
    intake.position.set(0, 0.32, -0.05);
    root.add(intake);

    return root;
  }

  private static buildBoxerEngine(
    isRear: boolean,
    blockMat: THREE.Material,
    camMat: THREE.Material,
    intakeMat: THREE.Material,
    carbonMat: THREE.Material
  ): THREE.Group {
    const root = new THREE.Group();
    root.name = isRear ? 'powertrain_boxer6_rear' : 'powertrain_boxer6_mid';

    // Horizontally Opposed Low Flat-6 Crankcase
    const blockGeo = new THREE.BoxGeometry(0.78, 0.22, 0.62);
    const block = new THREE.Mesh(blockGeo, blockMat);
    root.add(block);

    // Left and Right Horizontal Cylinder Heads
    [-0.38, 0.38].forEach(hx => {
      const headGeo = new THREE.BoxGeometry(0.14, 0.18, 0.58);
      const head = new THREE.Mesh(headGeo, camMat);
      head.position.set(hx, 0.02, 0);
      root.add(head);
    });

    // Variable Resonance Intake Plenum perched atop
    const plenumGeo = new THREE.BoxGeometry(0.38, 0.16, 0.48);
    const plenum = new THREE.Mesh(plenumGeo, intakeMat);
    plenum.position.set(0, 0.22, 0);
    root.add(plenum);

    // Twin Carbon High-Flow Cooling Fan Shrouds (Iconic Porsche 911 rear decklid cooling)
    [-0.18, 0.18].forEach(fx => {
      const fanGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.04, 20);
      const fan = new THREE.Mesh(fanGeo, carbonMat);
      fan.position.set(fx, 0.32, -0.12);
      root.add(fan);
    });

    return root;
  }

  private static buildV8FrontSupercharged(
    blockMat: THREE.Material,
    camMat: THREE.Material,
    intakeMat: THREE.Material,
    chromeMat: THREE.Material
  ): THREE.Group {
    const root = new THREE.Group();
    root.name = 'powertrain_v8_supercharged_front';

    // Big American V8 Block
    const blockGeo = new THREE.BoxGeometry(0.58, 0.42, 0.72);
    const block = new THREE.Mesh(blockGeo, blockMat);
    root.add(block);

    // Hemi / Cross-plane Valve Covers
    [-0.22, 0.22].forEach((vx, idx) => {
      const camGeo = new THREE.BoxGeometry(0.18, 0.15, 0.68);
      const cam = new THREE.Mesh(camGeo, camMat);
      cam.position.set(vx, 0.24, 0);
      cam.rotation.z = idx === 0 ? 0.4 : -0.4;
      root.add(cam);
    });

    // Massive 2.65L Eaton TVS Roots-type Supercharger Housing
    const blowerGeo = new THREE.BoxGeometry(0.32, 0.22, 0.56);
    const blower = new THREE.Mesh(blowerGeo, intakeMat);
    blower.position.set(0, 0.38, -0.04);
    root.add(blower);

    // Front Blower Pulley & Serpentine Belt Drive
    const pulleyGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 16);
    pulleyGeo.rotateX(Math.PI / 2);
    const pulley = new THREE.Mesh(pulleyGeo, chromeMat);
    pulley.position.set(0, 0.38, 0.26);
    root.add(pulley);

    // High-Flow Conical Air Intake Filter
    const coneGeo = new THREE.ConeGeometry(0.09, 0.22, 16);
    coneGeo.rotateZ(Math.PI / 2);
    const cone = new THREE.Mesh(coneGeo, camMat);
    cone.position.set(-0.32, 0.28, 0.26);
    root.add(cone);

    return root;
  }

  private static buildInlineEngine(
    cylinders: number,
    blockMat: THREE.Material,
    camMat: THREE.Material,
    intakeMat: THREE.Material,
    chromeMat: THREE.Material
  ): THREE.Group {
    const root = new THREE.Group();
    root.name = `powertrain_inline_${cylinders}`;

    const length = cylinders === 6 ? 0.78 : 0.54;

    // Narrow Longitudinal Crankcase
    const blockGeo = new THREE.BoxGeometry(0.32, 0.38, length);
    const block = new THREE.Mesh(blockGeo, blockMat);
    root.add(block);

    // Twin-Cam Cover (Red crackle or metallic)
    const camGeo = new THREE.BoxGeometry(0.26, 0.14, length * 0.96);
    const cam = new THREE.Mesh(camGeo, camMat);
    cam.position.set(0, 0.24, 0);
    root.add(cam);

    // Cold Side: Long-runner Intake Manifold (Driver/Left side)
    const intakeGeo = new THREE.BoxGeometry(0.18, 0.16, length * 0.85);
    const intake = new THREE.Mesh(intakeGeo, intakeMat);
    intake.position.set(-0.24, 0.15, 0);
    root.add(intake);

    // Hot Side: Tubular Exhaust Header / Turbocharger (Right side)
    const turboGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.16, 16);
    turboGeo.rotateZ(Math.PI / 2);
    const turbo = new THREE.Mesh(turboGeo, chromeMat);
    turbo.position.set(0.24, 0.08, -0.05);
    root.add(turbo);

    return root;
  }

  private static buildRotaryEngine(
    blockMat: THREE.Material,
    camMat: THREE.Material,
    intakeMat: THREE.Material,
    chromeMat: THREE.Material
  ): THREE.Group {
    const root = new THREE.Group();
    root.name = 'powertrain_wankel_rotary_twin_turbo';

    // Compact Twin-Rotor Housing Block
    const rotorGeo = new THREE.BoxGeometry(0.34, 0.32, 0.44);
    const rotor = new THREE.Mesh(rotorGeo, blockMat);
    root.add(rotor);

    // Dynamic curved intake piping
    const curvePipeGeo = new THREE.TorusGeometry(0.14, 0.035, 8, 16, Math.PI);
    curvePipeGeo.rotateY(Math.PI / 2);
    const pipe = new THREE.Mesh(curvePipeGeo, intakeMat);
    pipe.position.set(-0.16, 0.22, 0);
    root.add(pipe);

    // Sequential Twin Turbochargers (Primary & Secondary)
    [-0.1, 0.1].forEach(tz => {
      const turboGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.12, 14);
      turboGeo.rotateZ(Math.PI / 2);
      const turbo = new THREE.Mesh(turboGeo, chromeMat);
      turbo.position.set(0.22, 0.05, tz);
      root.add(turbo);
    });

    return root;
  }

  private static buildElectricDriveUnits(
    dims: { length: number; width: number; height: number },
    motorMat: THREE.Material,
    hvMat: THREE.Material,
    carbonMat: THREE.Material
  ): THREE.Group {
    const root = new THREE.Group();
    root.name = 'powertrain_electric_drive_system';

    // Front Dual-Motor Axle Assembly
    const frontMotorGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.52, 16);
    frontMotorGeo.rotateZ(Math.PI / 2);
    const frontMotor = new THREE.Mesh(frontMotorGeo, motorMat);
    frontMotor.position.set(0, -0.08, dims.length * 0.24);
    root.add(frontMotor);

    // Front Frunk Cargo Tub
    const frunkGeo = new THREE.BoxGeometry(0.85, 0.26, 0.65);
    const frunk = new THREE.Mesh(frunkGeo, carbonMat);
    frunk.position.set(0, 0.14, dims.length * 0.26);
    root.add(frunk);

    // Rear Dual-Motor Unit with Inverter
    const rearMotorGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.62, 16);
    rearMotorGeo.rotateZ(Math.PI / 2);
    const rearMotor = new THREE.Mesh(rearMotorGeo, motorMat);
    rearMotor.position.set(0, -0.08, -dims.length * 0.22);
    root.add(rearMotor);

    // High Voltage Power Inverter Box
    const inverterGeo = new THREE.BoxGeometry(0.48, 0.16, 0.38);
    const inverter = new THREE.Mesh(inverterGeo, motorMat);
    inverter.position.set(0, 0.15, -dims.length * 0.2);
    root.add(inverter);

    // Thick Ribbed Orange High-Voltage Busbar Cables
    [-0.12, 0.12].forEach(cx => {
      const cableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(cx, 0.12, dims.length * 0.2),
        new THREE.Vector3(cx, -0.02, 0),
        new THREE.Vector3(cx, 0.14, -dims.length * 0.18)
      ]);
      const cableGeo = new THREE.TubeGeometry(cableCurve, 16, 0.022, 8, false);
      const cable = new THREE.Mesh(cableGeo, hvMat);
      root.add(cable);
    });

    return root;
  }

  // =========================================================================
  // STRUCTURAL CHASSIS COMPONENTS
  // =========================================================================

  private static buildEngineBayTub(
    isMidRear: boolean,
    dims: { length: number; width: number; height: number },
    material: THREE.Material
  ): THREE.Group {
    const tubGroup = new THREE.Group();
    tubGroup.name = 'engine_bay_structural_tub';

    const zCenter = isMidRear ? -dims.length * 0.16 : dims.length * 0.28;
    const tubLength = dims.length * 0.24;
    const tubWidth = dims.width * 0.58;
    const tubHeight = dims.height * 0.45;
    const yCenter = dims.height * 0.28;

    // Firewall Bulkhead
    const firewallZ = isMidRear ? zCenter + tubLength * 0.5 : zCenter - tubLength * 0.5;
    const firewallGeo = new THREE.BoxGeometry(tubWidth, tubHeight, 0.025);
    const firewall = new THREE.Mesh(firewallGeo, material);
    firewall.position.set(0, yCenter, firewallZ);
    tubGroup.add(firewall);

    // Inner Wheelhouse / Flank Bulkheads (Left & Right)
    [-tubWidth * 0.5, tubWidth * 0.5].forEach(wx => {
      const flankGeo = new THREE.BoxGeometry(0.025, tubHeight, tubLength);
      const flank = new THREE.Mesh(flankGeo, material);
      flank.position.set(wx, yCenter, zCenter);
      tubGroup.add(flank);
    });

    // Floor Tray / Undertray Pan
    const floorGeo = new THREE.BoxGeometry(tubWidth, 0.025, tubLength);
    const floor = new THREE.Mesh(floorGeo, material);
    floor.position.set(0, yCenter - tubHeight * 0.5, zCenter);
    tubGroup.add(floor);

    return tubGroup;
  }

  private static buildCoolingRadiator(
    isMidRear: boolean,
    dims: { length: number; width: number; height: number },
    blockMat: THREE.Material,
    fanMat: THREE.Material
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = 'cooling_radiator_assembly';

    // Front-mounted or rear-mounted heat exchanger core
    const radZ = isMidRear ? -dims.length * 0.32 : dims.length * 0.42;
    const radY = dims.height * 0.26;
    const radWidth = dims.width * 0.52;

    const coreGeo = new THREE.BoxGeometry(radWidth, 0.32, 0.045);
    const core = new THREE.Mesh(coreGeo, blockMat);
    core.position.set(0, radY, radZ);
    group.add(core);

    // Dual Electric Fan Shrouds
    [-radWidth * 0.24, radWidth * 0.24].forEach(fx => {
      const fanGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.03, 16);
      fanGeo.rotateX(Math.PI / 2);
      const fan = new THREE.Mesh(fanGeo, fanMat);
      fan.position.set(fx, radY, isMidRear ? radZ + 0.04 : radZ - 0.04);
      group.add(fan);
    });

    return group;
  }

  private static buildAuxiliaryGear(
    isMidRear: boolean,
    dims: { length: number; width: number; height: number }
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = 'engine_bay_auxiliary_gear';

    const zBase = isMidRear ? -dims.length * 0.08 : dims.length * 0.38;
    const yBase = dims.height * 0.42;

    // 12V AGM Lightweight Battery
    const batGeo = new THREE.BoxGeometry(0.18, 0.16, 0.14);
    const batMat = new THREE.MeshStandardMaterial({ color: '#09090b', roughness: 0.8 });
    const battery = new THREE.Mesh(batGeo, batMat);
    battery.position.set(dims.width * 0.24, yBase, zBase);
    group.add(battery);

    // Translucent Brake Fluid Reservoir
    const brakeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.09, 12);
    const fluidMat = new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.2, transparent: true, opacity: 0.85 });
    const brakeTank = new THREE.Mesh(brakeGeo, fluidMat);
    brakeTank.position.set(-dims.width * 0.24, yBase + 0.04, zBase);
    group.add(brakeTank);

    // Coolant Expansion Reservoir
    const coolantGeo = new THREE.SphereGeometry(0.065, 12, 12);
    const coolantMat = new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.3, transparent: true, opacity: 0.75 });
    const coolantTank = new THREE.Mesh(coolantGeo, coolantMat);
    coolantTank.position.set(-dims.width * 0.24, yBase + 0.03, zBase - 0.14);
    group.add(coolantTank);

    return group;
  }

  private static buildStrutBracing(
    isMidRear: boolean,
    dims: { length: number; width: number; height: number },
    chromeMat: THREE.Material,
    carbonMat: THREE.Material
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = 'chassis_strut_brace';

    const zCenter = isMidRear ? -dims.length * 0.16 : dims.length * 0.28;
    const yPos = dims.height * 0.46;
    const span = dims.width * 0.48;

    if (isMidRear) {
      // Supercar Carbon X-Brace
      const bar1Curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-span * 0.5, yPos - 0.05, zCenter - 0.25),
        new THREE.Vector3(0, yPos, zCenter),
        new THREE.Vector3(span * 0.5, yPos - 0.05, zCenter + 0.25)
      ]);
      const bar2Curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-span * 0.5, yPos - 0.05, zCenter + 0.25),
        new THREE.Vector3(0, yPos, zCenter),
        new THREE.Vector3(span * 0.5, yPos - 0.05, zCenter - 0.25)
      ]);

      [bar1Curve, bar2Curve].forEach(c => {
        const geo = new THREE.TubeGeometry(c, 12, 0.016, 8, false);
        const mesh = new THREE.Mesh(geo, carbonMat);
        group.add(mesh);
      });
    } else {
      // Front Aluminum Strut Tower Tie Bar
      const tieCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-span * 0.5, yPos - 0.08, zCenter),
        new THREE.Vector3(-span * 0.25, yPos, zCenter),
        new THREE.Vector3(span * 0.25, yPos, zCenter),
        new THREE.Vector3(span * 0.5, yPos - 0.08, zCenter)
      ]);
      const geo = new THREE.TubeGeometry(tieCurve, 16, 0.018, 8, false);
      const mesh = new THREE.Mesh(geo, chromeMat);
      group.add(mesh);
    }

    return group;
  }
}
