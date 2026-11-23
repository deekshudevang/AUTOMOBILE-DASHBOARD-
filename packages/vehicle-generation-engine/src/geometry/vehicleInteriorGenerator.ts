/**
 * AUTOVERSE 3D — Vehicle-Specific Procedural Interior Generation Engine
 * Constructs authentic, manufacturer-calibrated interiors:
 * - Brand-specific dashboards and instrument clusters (Porsche 5-gauge, Ferrari F1, Lambo Hex, BMW M Curved, Audi Virtual Cockpit, JDM triple pod, etc.)
 * - Brand-specific steering wheels (rotary ALA/DRS dials, F1 yokes, Nardi/Momo 3-spoke, M1/M2 buttons)
 * - Ergonomic sports / carbon bucket / luxury seats with bolsters, headrests, and harnesses
 * - Sculpted center consoles with gear selectors, start buttons (flip-cover missile switches, gated shifters)
 * - Door cards with handles, window controls, and armrests
 * - Pedals (Throttle, Brake, Clutch, Footrest) and footwell floor pan
 */

import * as THREE from 'three';

export type InteriorDesignLanguage =
  | 'PORSCHE'
  | 'FERRARI'
  | 'LAMBORGHINI'
  | 'MCLAREN'
  | 'BMW_M'
  | 'MERCEDES_AMG'
  | 'AUDI_SPORT'
  | 'JDM_PERFORMANCE'
  | 'AMERICAN_MUSCLE'
  | 'BUGATTI_HYPERCAR'
  | 'PAGANI_ARTISAN'
  | 'KOENIGSEGG_TECH'
  | 'ELECTRIC_MINIMAL'
  | 'ROLLS_ROYCE_LUXURY'
  | 'CLASSIC_VINTAGE';

export interface VehicleInteriorSpec {
  vehicleId: string;
  manufacturer: string;
  model: string;
  year?: number;
  cabinWidthM?: number;
  cabinLengthM?: number;
  cabinHeightM?: number;
  isFourDoor?: boolean;
  isManual?: boolean;
  primaryTrimColorHex?: string;
  accentColorHex?: string;
  seatColorHex?: string;
}

export class VehicleInteriorGenerator {
  /**
   * Resolves the authentic design language based on vehicle make and model
   */
  public static resolveDesignLanguage(spec: VehicleInteriorSpec): InteriorDesignLanguage {
    const make = spec.manufacturer.toLowerCase();
    const model = spec.model.toLowerCase();
    const id = spec.vehicleId.toLowerCase();

    if (make.includes('porsche')) return 'PORSCHE';
    if (make.includes('ferrari')) return 'FERRARI';
    if (make.includes('lamborghini')) return 'LAMBORGHINI';
    if (make.includes('mclaren')) return 'MCLAREN';
    if (make.includes('bmw')) return 'BMW_M';
    if (make.includes('mercedes')) return 'MERCEDES_AMG';
    if (make.includes('audi')) return 'AUDI_SPORT';
    if (make.includes('bugatti')) return 'BUGATTI_HYPERCAR';
    if (make.includes('pagani')) return 'PAGANI_ARTISAN';
    if (make.includes('koenigsegg')) return 'KOENIGSEGG_TECH';
    if (make.includes('rolls-royce') || make.includes('bentley')) return 'ROLLS_ROYCE_LUXURY';
    if (make.includes('rimac') || id.includes('electric') || id.includes('nevera')) return 'ELECTRIC_MINIMAL';
    if (make.includes('ford') || make.includes('dodge') || make.includes('chevrolet') || id.includes('mustang') || id.includes('corvette') || id.includes('camaro') || id.includes('demon')) {
      return 'AMERICAN_MUSCLE';
    }
    if (id.includes('2000gt') || (spec.year && spec.year < 1980)) return 'CLASSIC_VINTAGE';
    if (make.includes('nissan') || make.includes('toyota') || make.includes('mazda') || make.includes('subaru') || make.includes('mitsubishi') || make.includes('honda') || make.includes('acura') || make.includes('lexus')) {
      return 'JDM_PERFORMANCE';
    }

    return 'PORSCHE';
  }

  /**
   * Generates a complete, authentic 3D interior assembly
   */
  public static generateInterior(spec: VehicleInteriorSpec): THREE.Group {
    const root = new THREE.Group();
    root.name = `interior_${spec.vehicleId}`;

    const language = this.resolveDesignLanguage(spec);
    const W = spec.cabinWidthM || 1.48;
    const L = spec.cabinLengthM || 1.65;
    const H = spec.cabinHeightM || 0.85;

    // Materials
    const darkCharcoal = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7, metalness: 0.1 }); // Soft-touch plastic/leather
    const alcantara = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.95, metalness: 0.05 });
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x111113, roughness: 0.35, metalness: 0.4 });
    const aluminumMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.85, roughness: 0.2 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1, metalness: 0.8, emissive: new THREE.Color(0x0e7490), emissiveIntensity: 0.4 });
    const gaugeGlassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, roughness: 0.05, metalness: 0.1 });

    const seatColor = spec.seatColorHex ? new THREE.Color(spec.seatColorHex) : new THREE.Color(0x18181b);
    const seatMat = new THREE.MeshStandardMaterial({ color: seatColor, roughness: 0.6, metalness: 0.1 });

    // 1. Cockpit Tub & Floorpan
    const floorGeo = new THREE.BoxGeometry(W * 0.96, 0.04, L);
    const floor = new THREE.Mesh(floorGeo, darkCharcoal);
    floor.position.set(0, -0.05, 0.05);
    floor.name = 'interior_floor_tub';
    root.add(floor);

    // 2. Pedals (Throttle, Brake, Footrest)
    const pedalGroup = this.buildPedals(aluminumMat, spec.isManual);
    pedalGroup.position.set(-W * 0.24, -0.02, 0.68);
    root.add(pedalGroup);

    // 3. Center Console with Gear Selector & Switchgear
    const consoleGroup = this.buildCenterConsole(language, W, L, carbonMat, aluminumMat, alcantara);
    consoleGroup.position.set(0, 0.08, 0.08);
    root.add(consoleGroup);

    // 4. Dashboard Assembly & Instrument Cluster
    const dashGroup = this.buildDashboard(language, W, H, darkCharcoal, carbonMat, aluminumMat, screenMat, gaugeGlassMat);
    dashGroup.position.set(0, 0.32, 0.62);
    dashGroup.name = 'interior_dashboard';
    root.add(dashGroup);

    // 5. Steering Column & Brand-Specific Steering Wheel
    const steeringGroup = this.buildSteeringWheel(language, W, alcantara, carbonMat, aluminumMat);
    steeringGroup.position.set(-W * 0.24, 0.30, 0.45);
    steeringGroup.rotation.x = -0.32; // Driver tilt angle
    steeringGroup.name = 'interior_steering_wheel';
    root.add(steeringGroup);

    // 6. Seats (Front Left, Front Right, and optional Rear)
    const seatsGroup = this.buildSeats(language, W, L, seatMat, carbonMat, alcantara, spec.isFourDoor);
    seatsGroup.name = 'interior_seats';
    root.add(seatsGroup);

    // 7. Door Cards (Left & Right interior door panels)
    const doorCards = this.buildDoorCards(language, W, L, darkCharcoal, seatMat, aluminumMat);
    root.add(doorCards);

    // 8. Frameless Rearview Mirror
    const mirrorGeo = new THREE.BoxGeometry(0.22, 0.055, 0.02);
    const mirror = new THREE.Mesh(mirrorGeo, aluminumMat);
    mirror.position.set(0, H * 0.78, 0.45);
    mirror.name = 'interior_rearview_mirror';
    root.add(mirror);

    root.userData = {
      isVehicleInterior: true,
      designLanguage: language,
      vehicleId: spec.vehicleId,
      componentCount: root.children.length
    };

    return root;
  }

  /**
   * Builds the pedals assembly (Throttle, Brake, Clutch, Footrest)
   */
  public static buildPedals(mat: THREE.Material, isManual: boolean = false): THREE.Group {
    const group = new THREE.Group();
    group.name = 'interior_pedals_assembly';

    // Throttle pedal (tapered tall rectangle)
    const throttle = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.14, 0.015), mat);
    throttle.position.set(0.07, 0.05, 0);
    throttle.rotation.x = -0.4;
    group.add(throttle);

    // Brake pedal (wide sport rectangle)
    const brakeWidth = isManual ? 0.055 : 0.085;
    const brake = new THREE.Mesh(new THREE.BoxGeometry(brakeWidth, 0.08, 0.02), mat);
    brake.position.set(-0.02, 0.06, 0);
    brake.rotation.x = -0.4;
    group.add(brake);

    // Clutch pedal if manual
    if (isManual) {
      const clutch = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.08, 0.02), mat);
      clutch.position.set(-0.09, 0.06, 0);
      clutch.rotation.x = -0.4;
      group.add(clutch);
    }

    // Dead pedal / footrest
    const deadPedal = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.16, 0.015), mat);
    deadPedal.position.set(-0.16, 0.06, 0.02);
    deadPedal.rotation.x = -0.4;
    group.add(deadPedal);

    return group;
  }

  /**
   * Constructs center console according to brand design language
   */
  public static buildCenterConsole(
    language: InteriorDesignLanguage,
    W: number,
    L: number,
    carbonMat: THREE.Material,
    aluminumMat: THREE.Material,
    alcantaraMat: THREE.Material
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = 'interior_center_console';

    const consoleWidth = W * 0.24;
    const consoleLength = L * 0.72;

    // Base tunnel bridge
    const tunnelGeo = new THREE.BoxGeometry(consoleWidth, 0.16, consoleLength);
    const tunnel = new THREE.Mesh(tunnelGeo, carbonMat);
    tunnel.position.set(0, 0, -0.05);
    group.add(tunnel);

    // Armrest top cushion
    const armrestGeo = new THREE.BoxGeometry(consoleWidth * 0.92, 0.05, 0.32);
    const armrest = new THREE.Mesh(armrestGeo, alcantaraMat);
    armrest.position.set(0, 0.10, -0.25);
    group.add(armrest);

    // Brand-specific gear selector & start buttons
    switch (language) {
      case 'LAMBORGHINI': {
        // Red flip-cover missile start button
        const startBase = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.05), carbonMat);
        startBase.position.set(0, 0.09, 0.10);
        group.add(startBase);

        const redCoverMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.8, roughness: 0.2 });
        const flipCover = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.025, 0.04), redCoverMat);
        flipCover.position.set(0, 0.11, 0.10);
        flipCover.rotation.x = 0.35;
        group.add(flipCover);

        // Reverse pull lever (Anima / Ego style)
        const animaLever = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.02), aluminumMat);
        animaLever.position.set(0, 0.10, 0.02);
        group.add(animaLever);
        break;
      }

      case 'FERRARI': {
        // F1 gear bridge with Reverse, Launch, and Auto buttons
        const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.18), carbonMat);
        bridge.position.set(0, 0.11, 0.06);
        group.add(bridge);

        [-0.04, 0, 0.04].forEach(z => {
          const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.01, 16), aluminumMat);
          btn.position.set(0, 0.14, 0.06 + z);
          group.add(btn);
        });
        break;
      }

      case 'PORSCHE': {
        // Compact modern toggle shifter (Braun shaver-style)
        const toggleShifter = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.045, 0.02), aluminumMat);
        toggleShifter.position.set(0, 0.11, 0.08);
        group.add(toggleShifter);

        // Dual cupholders
        [-0.04, 0.04].forEach(x => {
          const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.04, 16), carbonMat);
          cup.position.set(x, 0.09, -0.04);
          group.add(cup);
        });
        break;
      }

      case 'PAGANI_ARTISAN': {
        // Exposed mechanical shifter linkage with visible springs and titanium rod
        const shiftRod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.14), aluminumMat);
        shiftRod.position.set(0, 0.14, 0.05);
        shiftRod.rotation.x = -0.15;
        group.add(shiftRod);

        const shiftKnob = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), aluminumMat);
        shiftKnob.position.set(0, 0.20, 0.03);
        group.add(shiftKnob);
        break;
      }

      case 'JDM_PERFORMANCE': {
        // Classic short-throw manual shifter with round shift knob and leather boot
        const bootGeo = new THREE.ConeGeometry(0.05, 0.07, 16);
        const boot = new THREE.Mesh(bootGeo, alcantaraMat);
        boot.position.set(0, 0.11, 0.08);
        group.add(boot);

        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), aluminumMat);
        knob.position.set(0, 0.16, 0.08);
        group.add(knob);

        // Handbrake lever with release button
        const hBrake = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.18), alcantaraMat);
        hBrake.rotation.x = Math.PI / 4;
        hBrake.position.set(0.06, 0.12, -0.08);
        group.add(hBrake);
        break;
      }

      default: {
        // Modern rotary / electronic drive selector
        const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.025, 24), aluminumMat);
        dial.position.set(0, 0.10, 0.06);
        group.add(dial);
        break;
      }
    }

    return group;
  }

  /**
   * Constructs dashboard and instrument cluster according to brand design language
   */
  public static buildDashboard(
    language: InteriorDesignLanguage,
    W: number,
    H: number,
    dashMat: THREE.Material,
    carbonMat: THREE.Material,
    trimMat: THREE.Material,
    screenMat: THREE.Material,
    gaugeGlassMat: THREE.Material
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = 'interior_dashboard_assembly';

    const dashWidth = W * 0.94;
    const dashDepth = 0.42;

    // Main sculpted dashboard cowl
    const cowlGeo = new THREE.BoxGeometry(dashWidth, 0.18, dashDepth);
    const cowl = new THREE.Mesh(cowlGeo, dashMat);
    cowl.position.set(0, 0, 0);
    group.add(cowl);

    // Decorative lower trim strip
    const trimStrip = new THREE.Mesh(new THREE.BoxGeometry(dashWidth * 0.98, 0.02, 0.02), trimMat);
    trimStrip.position.set(0, -0.07, -dashDepth * 0.48);
    group.add(trimStrip);

    // Brand-specific instrument cluster & infotainment
    switch (language) {
      case 'PORSCHE': {
        // Iconic 5-gauge / 3-gauge instrument binnacle
        const binnacleGeo = new THREE.BoxGeometry(0.36, 0.10, 0.12);
        const binnacle = new THREE.Mesh(binnacleGeo, carbonMat);
        binnacle.position.set(-W * 0.24, 0.10, -0.05);
        group.add(binnacle);

        // Center round analog tachometer with white needle
        const tachRing = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.005, 12, 32), trimMat);
        tachRing.position.set(-W * 0.24, 0.10, -0.11);
        group.add(tachRing);

        // Flanking curved digital displays
        [-0.09, 0.09].forEach(dx => {
          const sideScreen = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.055, 0.005), screenMat);
          sideScreen.position.set(-W * 0.24 + dx, 0.10, -0.10);
          group.add(sideScreen);
        });

        // 10.9" Central PCM Touchscreen
        const pcmScreen = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.09, 0.01), screenMat);
        pcmScreen.position.set(0, 0.02, -dashDepth * 0.48);
        group.add(pcmScreen);

        // Sport Chrono stopwatch on top of dashboard
        const chronoPod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.03, 24), carbonMat);
        chronoPod.position.set(0, 0.10, -0.02);
        group.add(chronoPod);
        break;
      }

      case 'FERRARI': {
        // Driver-centric dual pods + central yellow tachometer
        const clusterBinnacle = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.11, 0.14), carbonMat);
        clusterBinnacle.position.set(-W * 0.24, 0.10, -0.06);
        group.add(clusterBinnacle);

        // Yellow face tachometer
        const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
        const yellowTach = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.01, 24), yellowMat);
        yellowTach.rotation.x = Math.PI / 2;
        yellowTach.position.set(-W * 0.24, 0.10, -0.12);
        group.add(yellowTach);

        // Round turbine AC vents
        [-W * 0.40, -W * 0.08, W * 0.08, W * 0.40].forEach(x => {
          const vent = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.02, 16), trimMat);
          vent.rotation.x = Math.PI / 2;
          vent.position.set(x, 0.02, -dashDepth * 0.49);
          group.add(vent);
        });

        // Passenger touch display
        const passDisplay = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.045, 0.01), screenMat);
        passDisplay.position.set(W * 0.24, 0.02, -dashDepth * 0.48);
        group.add(passDisplay);
        break;
      }

      case 'LAMBORGHINI': {
        // Hexagonal / polygonal binnacle hood
        const hexBinnacle = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.10, 0.14), carbonMat);
        hexBinnacle.position.set(-W * 0.24, 0.10, -0.06);
        group.add(hexBinnacle);

        // Hexagonal digital cluster
        const clusterScreen = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 0.01), screenMat);
        clusterScreen.position.set(-W * 0.24, 0.10, -0.12);
        group.add(clusterScreen);

        // Central vertical touchscreen
        const centerScreen = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.01), screenMat);
        centerScreen.position.set(0, -0.03, -dashDepth * 0.48);
        centerScreen.rotation.x = -0.22;
        group.add(centerScreen);

        // Hexagonal AC vents
        [-W * 0.40, -0.12, 0.12, W * 0.40].forEach(x => {
          const hexVent = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.02, 6), carbonMat);
          hexVent.rotation.x = Math.PI / 2;
          hexVent.position.set(x, 0.05, -dashDepth * 0.48);
          group.add(hexVent);
        });
        break;
      }

      case 'BMW_M': {
        // BMW Curved Display (wide continuous dual screen)
        const curvedScreen = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.13, 0.02), screenMat);
        curvedScreen.position.set(-W * 0.12, 0.11, -0.08);
        curvedScreen.rotation.y = 0.08; // angled slightly toward driver
        group.add(curvedScreen);
        break;
      }

      case 'MERCEDES_AMG': {
        // Dual freestanding screens + 4 round illuminated turbine vents
        const amgScreen = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 0.02), screenMat);
        amgScreen.position.set(-W * 0.10, 0.10, -0.08);
        group.add(amgScreen);

        [-0.15, -0.05, 0.05, 0.15].forEach(x => {
          const turbine = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.02, 16), trimMat);
          turbine.rotation.x = Math.PI / 2;
          turbine.position.set(x, -0.02, -dashDepth * 0.48);
          group.add(turbine);
        });
        break;
      }

      case 'JDM_PERFORMANCE': {
        // Dual circular analog speedometer & tachometer with aluminum bezels
        [-0.06, 0.06].forEach((dx, i) => {
          const gaugeRing = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.005, 12, 24), trimMat);
          gaugeRing.position.set(-W * 0.24 + dx, 0.09, -0.11);
          group.add(gaugeRing);
        });

        // Triple auxiliary dashboard-top gauge pods (Boost, Oil Temp, Oil Pressure)
        [-0.08, 0, 0.08].forEach(dx => {
          const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.03, 0.04, 16), carbonMat);
          pod.rotation.x = -Math.PI / 3;
          pod.position.set(dx, 0.11, -0.02);
          group.add(pod);
        });
        break;
      }

      default: {
        // Universal clean modern digital cluster + center screen
        const cluster = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.09, 0.01), screenMat);
        cluster.position.set(-W * 0.24, 0.09, -0.10);
        group.add(cluster);

        const centerScreen = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.12, 0.01), screenMat);
        centerScreen.position.set(0, 0.04, -dashDepth * 0.48);
        group.add(centerScreen);
        break;
      }
    }

    return group;
  }

  /**
   * Constructs brand-specific steering wheel with authentic controls
   */
  public static buildSteeringWheel(
    language: InteriorDesignLanguage,
    W: number,
    alcantaraMat: THREE.Material,
    carbonMat: THREE.Material,
    aluminumMat: THREE.Material
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = 'interior_steering_wheel_assembly';

    const wheelRadius = 0.175; // 350mm diameter

    switch (language) {
      case 'FERRARI': {
        // Flat-bottomed F1-style carbon wheel with LED shift lights & red Manettino dial
        const rimGeo = new THREE.TorusGeometry(wheelRadius, 0.016, 12, 32);
        const rim = new THREE.Mesh(rimGeo, alcantaraMat);
        group.add(rim);

        // Center hub
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.025, 24), carbonMat);
        hub.rotation.x = Math.PI / 2;
        group.add(hub);

        // Top LED rev bar (5 shift lights)
        const ledBar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.015), carbonMat);
        ledBar.position.set(0, wheelRadius * 0.92, 0.01);
        group.add(ledBar);

        // Red Manettino dial
        const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.8, roughness: 0.2 });
        const manettino = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.015, 16), redMat);
        manettino.rotation.x = Math.PI / 2;
        manettino.position.set(0.065, -0.04, 0.015);
        group.add(manettino);

        // Column-mounted long carbon paddle shifters
        [-0.10, 0.10].forEach((x, idx) => {
          const paddle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.005), carbonMat);
          paddle.position.set(x, 0.02, -0.035);
          group.add(paddle);
        });
        break;
      }

      case 'PORSCHE': {
        // Round motorsport wheel with yellow 12 o'clock marker and 4 rotary dials
        const rimGeo = new THREE.TorusGeometry(wheelRadius, 0.016, 12, 32);
        const rim = new THREE.Mesh(rimGeo, alcantaraMat);
        group.add(rim);

        // Yellow 12 o'clock stripe
        const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2 });
        const marker = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.03, 16), yellowMat);
        marker.position.set(0, wheelRadius, 0);
        group.add(marker);

        // Center Hub with Porsche crest badge
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.025, 24), carbonMat);
        hub.rotation.x = Math.PI / 2;
        group.add(hub);

        // 4 Rotary Dials (ESC/TC, PASM, PTV+, Drive Mode)
        [
          [-0.06, -0.06],
          [-0.06, 0.02],
          [0.06, -0.06],
          [0.06, 0.02]
        ].forEach(([x, y]) => {
          const rotary = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.015, 12), aluminumMat);
          rotary.rotation.x = Math.PI / 2;
          rotary.position.set(x, y, 0.015);
          group.add(rotary);
        });

        // DRS thumb switch
        const drsBtn = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.012, 0.01), new THREE.MeshStandardMaterial({ color: 0x2563eb }));
        drsBtn.position.set(-0.04, 0.07, 0.015);
        group.add(drsBtn);
        break;
      }

      case 'BMW_M': {
        // Flat-bottomed M wheel with red M1 and M2 buttons
        const rimGeo = new THREE.TorusGeometry(wheelRadius, 0.017, 12, 32);
        const rim = new THREE.Mesh(rimGeo, alcantaraMat);
        group.add(rim);

        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.025, 24), carbonMat);
        hub.rotation.x = Math.PI / 2;
        group.add(hub);

        // Red M1 and M2 buttons
        const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
        [-0.055, 0.055].forEach(x => {
          const mBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.015, 12), redMat);
          mBtn.rotation.x = Math.PI / 2;
          mBtn.position.set(x, 0.035, 0.015);
          group.add(mBtn);
        });
        break;
      }

      case 'PAGANI_ARTISAN':
      case 'CLASSIC_VINTAGE': {
        // Retro 3-spoke wood / polished aluminum wheel
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.25 });
        const rimGeo = new THREE.TorusGeometry(wheelRadius * 1.05, 0.014, 12, 32);
        const rim = new THREE.Mesh(rimGeo, woodMat);
        group.add(rim);

        // 3 Polished aluminum drilled spokes
        for (let i = 0; i < 3; i++) {
          const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
          const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.025, wheelRadius * 0.95, 0.005), aluminumMat);
          spoke.position.set(Math.cos(angle) * wheelRadius * 0.45, Math.sin(angle) * wheelRadius * 0.45, 0);
          spoke.rotation.z = angle - Math.PI / 2;
          group.add(spoke);
        }
        break;
      }

      default: {
        // Universal 3-spoke motorsport sport wheel with aluminum spokes and shift paddles
        const rimGeo = new THREE.TorusGeometry(wheelRadius, 0.016, 12, 32);
        const rim = new THREE.Mesh(rimGeo, alcantaraMat);
        group.add(rim);

        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.025, 24), carbonMat);
        hub.rotation.x = Math.PI / 2;
        group.add(hub);

        // 3 Spokes (left, right, bottom)
        const leftSpoke = new THREE.Mesh(new THREE.BoxGeometry(wheelRadius * 0.75, 0.025, 0.008), aluminumMat);
        leftSpoke.position.set(-wheelRadius * 0.42, 0, 0);
        group.add(leftSpoke);

        const rightSpoke = new THREE.Mesh(new THREE.BoxGeometry(wheelRadius * 0.75, 0.025, 0.008), aluminumMat);
        rightSpoke.position.set(wheelRadius * 0.42, 0, 0);
        group.add(rightSpoke);

        const bottomSpoke = new THREE.Mesh(new THREE.BoxGeometry(0.025, wheelRadius * 0.75, 0.008), aluminumMat);
        bottomSpoke.position.set(0, -wheelRadius * 0.42, 0);
        group.add(bottomSpoke);

        // Shift paddles
        [-0.10, 0.10].forEach(x => {
          const paddle = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.10, 0.005), aluminumMat);
          paddle.position.set(x, 0.02, -0.03);
          group.add(paddle);
        });
        break;
      }
    }

    return group;
  }

  /**
   * Constructs ergonomic front sports/bucket seats and optional rear seats
   */
  public static buildSeats(
    language: InteriorDesignLanguage,
    W: number,
    L: number,
    seatMat: THREE.Material,
    carbonMat: THREE.Material,
    accentMat: THREE.Material,
    isFourDoor: boolean = false
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = 'interior_seats_assembly';

    const seatSpacingX = W * 0.26;
    const frontSeatZ = -0.08;

    // Front Driver and Passenger Seats
    [-seatSpacingX, seatSpacingX].forEach((sx, idx) => {
      const singleSeat = new THREE.Group();
      singleSeat.name = `interior_seat_${idx === 0 ? 'driver' : 'passenger'}`;

      // Seat Cushion Base
      const cushionGeo = new THREE.BoxGeometry(0.46, 0.12, 0.48);
      const cushion = new THREE.Mesh(cushionGeo, seatMat);
      cushion.position.set(0, 0.06, 0);
      singleSeat.add(cushion);

      // Ergonomic Backrest with lateral bolsters
      const backrestGeo = new THREE.BoxGeometry(0.44, 0.58, 0.10);
      const backrest = new THREE.Mesh(backrestGeo, seatMat);
      backrest.position.set(0, 0.38, -0.22);
      backrest.rotation.x = 0.22; // natural driving recline
      singleSeat.add(backrest);

      // Carbon fiber shell backing (for supercars/track cars)
      const carbonShell = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.60, 0.03), carbonMat);
      carbonShell.position.set(0, 0.38, -0.25);
      carbonShell.rotation.x = 0.22;
      singleSeat.add(carbonShell);

      // Integrated Headrest
      const headrestGeo = new THREE.BoxGeometry(0.24, 0.18, 0.08);
      const headrest = new THREE.Mesh(headrestGeo, seatMat);
      headrest.position.set(0, 0.72, -0.29);
      headrest.rotation.x = 0.22;
      singleSeat.add(headrest);

      // High lateral thigh bolsters
      [-0.22, 0.22].forEach(bx => {
        const bolster = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 0.44), accentMat);
        bolster.position.set(bx, 0.10, 0);
        singleSeat.add(bolster);
      });

      singleSeat.position.set(sx, 0, frontSeatZ);
      group.add(singleSeat);
    });

    // Rear Seats (if 4-door vehicle, e.g. Mitsubishi Evo IX or Subaru WRX STI)
    if (isFourDoor) {
      const rearBenchGroup = new THREE.Group();
      rearBenchGroup.name = 'interior_rear_bench';

      // Rear seat bottom bench
      const rearCushion = new THREE.Mesh(new THREE.BoxGeometry(W * 0.88, 0.12, 0.46), seatMat);
      rearCushion.position.set(0, 0.10, -0.65);
      rearBenchGroup.add(rearCushion);

      // Rear seat backrest
      const rearBackrest = new THREE.Mesh(new THREE.BoxGeometry(W * 0.86, 0.52, 0.10), seatMat);
      rearBackrest.position.set(0, 0.40, -0.86);
      rearBackrest.rotation.x = 0.20;
      rearBenchGroup.add(rearBackrest);

      // Rear headrests
      [-0.28, 0.28].forEach(rx => {
        const rHeadrest = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.16, 0.08), seatMat);
        rHeadrest.position.set(rx, 0.70, -0.92);
        rearBenchGroup.add(rHeadrest);
      });

      group.add(rearBenchGroup);
    }

    return group;
  }

  /**
   * Constructs door cards (inner door panels with handles and switches)
   */
  public static buildDoorCards(
    language: InteriorDesignLanguage,
    W: number,
    L: number,
    baseMat: THREE.Material,
    leatherMat: THREE.Material,
    aluminumMat: THREE.Material
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = 'interior_door_cards';

    const doorCardWidth = 0.05;
    const doorCardHeight = 0.52;
    const doorCardLength = L * 0.65;

    // Left & Right Door Cards
    [-W * 0.48, W * 0.48].forEach((x, idx) => {
      const card = new THREE.Group();
      card.name = `interior_door_card_${idx === 0 ? 'left' : 'right'}`;

      // Main inner panel
      const panel = new THREE.Mesh(new THREE.BoxGeometry(doorCardWidth, doorCardHeight, doorCardLength), baseMat);
      panel.position.set(0, 0.22, 0);
      card.add(panel);

      // Armrest ledge
      const armrest = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.36), leatherMat);
      armrest.position.set(idx === 0 ? 0.025 : -0.025, 0.24, -0.02);
      card.add(armrest);

      // Door release handle / pull strap
      if (language === 'PORSCHE' || language === 'MCLAREN') {
        // Red RS pull strap
        const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.08, 0.025), redMat);
        strap.position.set(idx === 0 ? 0.03 : -0.03, 0.32, 0.08);
        card.add(strap);
      } else {
        // Chrome/aluminum door handle
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.03, 0.08), aluminumMat);
        handle.position.set(idx === 0 ? 0.03 : -0.03, 0.34, 0.10);
        card.add(handle);
      }

      card.position.set(x, 0, 0);
      group.add(card);
    });

    return group;
  }
}
