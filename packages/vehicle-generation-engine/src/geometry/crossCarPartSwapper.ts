/**
 * AUTOVERSE 3D — Cross-Car Part Swapping & Kinematic Fitment Engine
 * Evaluates geometric, mechanical, and aerodynamic compatibility when swapping
 * components across different vehicles (e.g. Lamborghini SVJ wing onto Porsche GT3 RS).
 * Generates adapted Three.js geometry with custom mounting brackets and scale corrections.
 */

import * as THREE from 'three';
import { FitmentClassification, FitmentEvaluation, VehicleSchema2 } from '@autoverse/shared-types';

export interface VehicleHubSpecification {
  vehicleId: string;
  displayName: string;
  hubInterface: 'center_lock_84mm' | '5x114_3' | '5x130' | '5x112' | '5x120' | '4x100';
  boltPatternString: string;
  hubBoreMm: number;
  lugThread: string;
  minRimDiameterInches: number;
  caliperEnvelopeMm: number;
  fenderLipLimitMm: number;
}

export const VEHICLE_HUB_SPECS: Record<string, VehicleHubSpecification> = {
  porsche_911_gt3_rs: {
    vehicleId: 'porsche_911_gt3_rs',
    displayName: 'Porsche 911 GT3 RS (992)',
    hubInterface: 'center_lock_84mm',
    boltPatternString: 'Center-Lock 84mm Spline, 600 Nm Central Nut',
    hubBoreMm: 84.0,
    lugThread: 'Center Nut M34x3.0 Left/Right Handed',
    minRimDiameterInches: 20,
    caliperEnvelopeMm: 410,
    fenderLipLimitMm: 88.0
  },
  porsche_911_gt3_rs_992: {
    vehicleId: 'porsche_911_gt3_rs_992',
    displayName: 'Porsche 911 GT3 RS (992)',
    hubInterface: 'center_lock_84mm',
    boltPatternString: 'Center-Lock 84mm Spline, 600 Nm Central Nut',
    hubBoreMm: 84.0,
    lugThread: 'Center Nut M34x3.0 Left/Right Handed',
    minRimDiameterInches: 20,
    caliperEnvelopeMm: 410,
    fenderLipLimitMm: 88.0
  },
  lamborghini_aventador_svj: {
    vehicleId: 'lamborghini_aventador_svj',
    displayName: 'Lamborghini Aventador SVJ',
    hubInterface: 'center_lock_84mm',
    boltPatternString: 'Center-Lock 84mm Spline, 580 Nm Anodized Nut',
    hubBoreMm: 84.0,
    lugThread: 'Center Nut M34x3.0',
    minRimDiameterInches: 20,
    caliperEnvelopeMm: 400,
    fenderLipLimitMm: 90.0
  },
  ferrari_488_pista: {
    vehicleId: 'ferrari_488_pista',
    displayName: 'Ferrari 488 Pista',
    hubInterface: '5x114_3',
    boltPatternString: '5x114.3mm PCD, 67.1mm Hub Bore, M14x1.5 Titanium Studs',
    hubBoreMm: 67.1,
    lugThread: 'M14x1.5 Titanium Studs (100 Nm Torqued)',
    minRimDiameterInches: 19,
    caliperEnvelopeMm: 398,
    fenderLipLimitMm: 85.0
  },
  nissan_gtr_r35_nismo: {
    vehicleId: 'nissan_gtr_r35_nismo',
    displayName: 'Nissan GT-R Nismo (R35)',
    hubInterface: '5x114_3',
    boltPatternString: '5x114.3mm PCD, 66.1mm Hub Bore, M12x1.25 Studs',
    hubBoreMm: 66.1,
    lugThread: 'M12x1.25 Studs',
    minRimDiameterInches: 20,
    caliperEnvelopeMm: 410,
    fenderLipLimitMm: 86.0
  },
  bmw_m4_csl: {
    vehicleId: 'bmw_m4_csl',
    displayName: 'BMW M4 CSL (G82)',
    hubInterface: '5x112',
    boltPatternString: '5x112mm PCD, 66.6mm Hub Bore, M14x1.25 Bolts',
    hubBoreMm: 66.6,
    lugThread: 'M14x1.25 Bolts',
    minRimDiameterInches: 19,
    caliperEnvelopeMm: 400,
    fenderLipLimitMm: 82.0
  },
  chevrolet_corvette_z06: {
    vehicleId: 'chevrolet_corvette_z06',
    displayName: 'Chevrolet Corvette Z06 (C8)',
    hubInterface: '5x120',
    boltPatternString: '5x120mm PCD, 70.3mm Hub Bore, M14x1.5 Lug Nuts',
    hubBoreMm: 70.3,
    lugThread: 'M14x1.5 Lug Nuts',
    minRimDiameterInches: 20,
    caliperEnvelopeMm: 398,
    fenderLipLimitMm: 88.0
  }
};

export interface DonorPartDefinition {
  id: string;
  name: string;
  category: 'Aero' | 'Body' | 'Wheels' | 'Interior' | 'Exhaust' | 'Chassis';
  semanticType: string;
  sourceVehicleId: string;
  sourceVehicleName: string;
  dimensions: {
    width: number;
    height: number;
    length: number;
  };
  massKg: number;
  downforceKgAt200Kmh: number;
  dragCdDelta: number;
  hubInterface?: 'center_lock_84mm' | '5x114_3' | '5x112' | '5x120' | '5x130' | '4x100' | 'universal';
  wheelDiameterInches?: number;
  rimWidthInches?: number;
  wheelOffsetMm?: number;
  defaultMaterialRef: string;
  previewColor?: string;
  description: string;
  generateMesh: (
    scale: [number, number, number],
    offset: [number, number, number],
    materialRef?: string,
    customColor?: string
  ) => THREE.Object3D;
}

export class CrossCarPartSwapper {
  private static donorCatalog: DonorPartDefinition[] = [];

  static {
    this.initializeCatalog();
  }

  /**
   * Evaluates fitment of a donor part onto a target vehicle
   */
  public static evaluateFitment(
    donorPart: DonorPartDefinition,
    targetVehicleSpec: any
  ): FitmentEvaluation {
    const targetDims = targetVehicleSpec?.dimensions || {
      width: 1.95,
      height: 1.25,
      length: 4.55,
      wheelbase: 2.65,
      frontTrack: 1.62,
      rearTrack: 1.60
    };

    const targetVehicleId = targetVehicleSpec?.vehicle?.id || targetVehicleSpec?.id || 'target_vehicle';
    const reasons: string[] = [];
    const warnings: string[] = [];
    let status: FitmentClassification = 'DIRECT_FIT';
    let score = 95;
    let requiresAdapterKit = false;
    let adapterKitDesc: string | undefined = undefined;

    let scaleAdjustment: [number, number, number] = [1.0, 1.0, 1.0];
    let mountingOffsetDelta: [number, number, number] = [0, 0, 0];

    // Hub check for wheels
    if (donorPart.category === 'Wheels') {
      const targetHub: VehicleHubSpecification | undefined = VEHICLE_HUB_SPECS[targetVehicleId];
      const targetInterface = targetHub?.hubInterface || (targetVehicleSpec?.wheels?.front?.hubInterface || '5x114_3');
      const donorInterface = donorPart.hubInterface || '5x114_3';

      if (donorInterface === targetInterface) {
        status = 'DIRECT_FIT';
        score = 98;
        reasons.push(`Direct bolt-on fitment: Hub interfaces match perfectly (${donorInterface}).`);
      } else if (
        (donorInterface === 'center_lock_84mm' && targetInterface.startsWith('5x')) ||
        (donorInterface.startsWith('5x') && targetInterface === 'center_lock_84mm')
      ) {
        status = 'ADAPTABLE';
        score = 80;
        requiresAdapterKit = true;
        adapterKitDesc = 'Requires Billet Aluminum Center-Lock Hub Conversion Spacer (+25mm Track Offset).';
        warnings.push('Conversion spacers add +25mm track poke per corner; check fender lip clearance.');
        mountingOffsetDelta = [0.025, 0, 0];
      } else if (donorInterface.startsWith('5x') && targetInterface.startsWith('5x')) {
        status = 'ADAPTABLE';
        score = 85;
        requiresAdapterKit = true;
        adapterKitDesc = `PCD variance: ${donorInterface} to ${targetInterface}. Requires floating conical PCD conversion bolts.`;
        warnings.push('Wheel bolt torque must be re-checked every 500 track kilometers.');
      } else {
        status = 'INCOMPATIBLE';
        score = 15;
        reasons.push(`Incompatible hub architecture: Cannot safely adapt ${donorInterface} onto ${targetInterface}.`);
      }

      return {
        status,
        passed: status !== 'INCOMPATIBLE',
        score,
        reasons,
        warnings,
        scaleAdjustment,
        mountingOffsetDelta,
        requiresAdapterKit,
        adapterKitDescription: adapterKitDesc,
        kinematics: {
          hubMatched: donorInterface === targetInterface,
          trackWidthDeltaMm: requiresAdapterKit ? 50 : 0,
          clearanceOk: status !== 'INCOMPATIBLE',
          aeroBalanceDeltaPercent: 0
        }
      };
    }

    // Aero & Body Panels Evaluation
    if (donorPart.category === 'Aero' || donorPart.category === 'Body') {
      const donorWidth = donorPart.dimensions.width;
      const targetWidth = targetDims.width;
      const widthRatio = targetWidth / Math.max(0.1, donorWidth);
      const widthDiffPercent = Math.abs(widthRatio - 1.0) * 100;

      if (widthDiffPercent <= 8) {
        status = 'DIRECT_FIT';
        score = 94;
        scaleAdjustment = [1.0, 1.0, 1.0];
        reasons.push(`Component mounting width within OEM tolerance (${widthDiffPercent.toFixed(1)}% variance). Direct mounting possible.`);
      } else if (widthDiffPercent <= 28) {
        status = 'ADAPTABLE';
        score = 78;
        requiresAdapterKit = true;
        scaleAdjustment = [widthRatio, 1.0, 1.0];
        adapterKitDesc = 'Custom CNC 6061-T6 Billet Aluminum Stanchion Brackets required.';
        warnings.push(`Donor span (${donorWidth.toFixed(2)}m) adapted to target vehicle body line (${targetWidth.toFixed(2)}m). Lateral scale factor: ${widthRatio.toFixed(3)}x.`);
      } else {
        status = 'INCOMPATIBLE';
        score = 25;
        reasons.push(`Excessive dimensional disparity (${widthDiffPercent.toFixed(1)}% width variance). Mounting on this chassis causes severe flow detachment and overhang regulations violation.`);
      }

      if (donorPart.semanticType === 'rear_wing') {
        const deckHeightOffset = (targetDims.height * 0.75) - 0.95;
        mountingOffsetDelta = [0, deckHeightOffset, 0];
      }

      return {
        status,
        passed: status !== 'INCOMPATIBLE',
        score,
        reasons,
        warnings,
        scaleAdjustment,
        mountingOffsetDelta,
        requiresAdapterKit,
        adapterKitDescription: adapterKitDesc,
        kinematics: {
          hubMatched: true,
          trackWidthDeltaMm: 0,
          clearanceOk: status !== 'INCOMPATIBLE',
          aeroBalanceDeltaPercent: donorPart.downforceKgAt200Kmh * 0.15
        }
      };
    }

    return {
      status: 'ADAPTABLE',
      passed: true,
      score: 88,
      reasons: ['Universal modular component mounting: standard DIN / FIA harness anchors.'],
      warnings: [],
      scaleAdjustment: [1, 1, 1],
      mountingOffsetDelta: [0, 0, 0],
      requiresAdapterKit: false
    };
  }

  public static getDonorParts(category?: string, excludeVehicleId?: string): DonorPartDefinition[] {
    let parts = this.donorCatalog;
    if (category && category !== 'All') {
      parts = parts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (excludeVehicleId) {
      parts = parts.filter(p => p.sourceVehicleId !== excludeVehicleId);
    }
    return parts;
  }

  public static getDonorPartById(id: string): DonorPartDefinition | undefined {
    return this.donorCatalog.find(p => p.id === id);
  }

  private static initializeCatalog(): void {
    this.donorCatalog = [
      // 1. LAMBORGHINI AVENTADOR SVJ
      {
        id: 'donor_svj_ala_wing',
        name: 'Aventador SVJ Active ALA 2.0 Carbon Wing',
        category: 'Aero',
        semanticType: 'rear_wing',
        sourceVehicleId: 'lamborghini_aventador_svj',
        sourceVehicleName: 'Lamborghini Aventador SVJ',
        dimensions: { width: 1.84, height: 0.38, length: 0.45 },
        massKg: 6.8,
        downforceKgAt200Kmh: 490,
        dragCdDelta: 0.042,
        defaultMaterialRef: 'carbon_twill',
        description: 'Aerodinamica Lamborghini Attiva (ALA 2.0) hollow carbon wing with motorized internal micro-flaps for aero-vectoring.',
        generateMesh: (scale, offset, _matRef, customColor) => {
          const group = new THREE.Group();
          group.name = 'donor_svj_ala_wing';

          const wingMat = new THREE.MeshStandardMaterial({
            color: customColor ? new THREE.Color(customColor) : new THREE.Color(0x18181b),
            roughness: 0.3,
            metalness: 0.4
          });
          const bracketMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8, roughness: 0.2 });

          const blade = new THREE.Mesh(new THREE.BoxGeometry(1.84 * scale[0], 0.035 * scale[1], 0.32 * scale[2]), wingMat);
          blade.position.set(0, 0.35 + offset[1], offset[2]);
          blade.rotation.x = -0.06;
          group.add(blade);

          const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.36, 0.24), bracketMat);
          pylon.position.set(0, 0.18 + offset[1], -0.04 + offset[2]);
          group.add(pylon);

          [-0.92 * scale[0], 0.92 * scale[0]].forEach(x => {
            const endplate = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.22, 0.38), wingMat);
            endplate.position.set(x, 0.35 + offset[1], offset[2]);
            group.add(endplate);
          });

          return group;
        }
      },
      {
        id: 'donor_svj_leirion_wheels',
        name: 'SVJ Leirion Forged 20"/21" Center-Lock Wheels',
        category: 'Wheels',
        semanticType: 'wheel_fl',
        sourceVehicleId: 'lamborghini_aventador_svj',
        sourceVehicleName: 'Lamborghini Aventador SVJ',
        dimensions: { width: 0.35, height: 0.72, length: 0.72 },
        massKg: 9.4,
        downforceKgAt200Kmh: 0,
        dragCdDelta: 0.005,
        hubInterface: 'center_lock_84mm',
        wheelDiameterInches: 21,
        rimWidthInches: 13,
        wheelOffsetMm: 35,
        defaultMaterialRef: 'rim',
        description: 'Directional Y-spoke lightweight forged alloy wheels with bronze/titanium finish and anodized center nut.',
        generateMesh: (scale, offset, _matRef, customColor) => {
          const group = new THREE.Group();
          group.name = 'donor_svj_leirion_wheels';

          const rimMat = new THREE.MeshStandardMaterial({
            color: customColor ? new THREE.Color(customColor) : new THREE.Color(0xb45309),
            metalness: 0.85,
            roughness: 0.25
          });
          const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 });

          const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.32, 32), tireMat);
          tire.rotation.z = Math.PI / 2;
          group.add(tire);

          const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.33, 24), rimMat);
          rim.rotation.z = Math.PI / 2;
          group.add(rim);

          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.24, 0.04), rimMat);
            spoke.rotation.x = angle;
            spoke.position.set(0.12 + offset[0], 0, 0);
            group.add(spoke);
          }

          const nutMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.1 });
          const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.05, 12), nutMat);
          nut.rotation.z = Math.PI / 2;
          nut.position.x = 0.17 + offset[0];
          group.add(nut);

          return group;
        }
      },
      {
        id: 'donor_svj_high_exhaust',
        name: 'SVJ Inconel Top-Mounted High Exhaust Outlets',
        category: 'Exhaust',
        semanticType: 'exhaust_system',
        sourceVehicleId: 'lamborghini_aventador_svj',
        sourceVehicleName: 'Lamborghini Aventador SVJ',
        dimensions: { width: 0.55, height: 0.18, length: 0.30 },
        massKg: 5.2,
        downforceKgAt200Kmh: 15,
        dragCdDelta: 0.002,
        defaultMaterialRef: 'alloy',
        description: 'Exposed dual top-center titanium/Inconel flame-spitting exhaust tips positioned between the taillights.',
        generateMesh: (scale, offset) => {
          const group = new THREE.Group();
          group.name = 'donor_svj_high_exhaust';
          const pipeMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.9, roughness: 0.15 });

          [-0.14, 0.14].forEach(x => {
            const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.22, 24), pipeMat);
            pipe.rotation.x = Math.PI / 2;
            pipe.position.set(x, 0.45 + offset[1], -2.15 + offset[2]);
            group.add(pipe);
          });

          return group;
        }
      },

      // 2. FERRARI 488 PISTA
      {
        id: 'donor_pista_s_duct_hood',
        name: '488 Pista S-Duct Carbon Aerodynamic Hood',
        category: 'Body',
        semanticType: 'hood',
        sourceVehicleId: 'ferrari_488_pista',
        sourceVehicleName: 'Ferrari 488 Pista',
        dimensions: { width: 1.45, height: 0.28, length: 1.25 },
        massKg: 5.4,
        downforceKgAt200Kmh: 240,
        dragCdDelta: -0.012,
        defaultMaterialRef: 'carbon_twill',
        description: 'Patented F1-derived S-Duct front hood channel creating massive front axle downforce by routing under-bumper air out.',
        generateMesh: (scale, offset) => {
          const group = new THREE.Group();
          group.name = 'donor_pista_s_duct_hood';
          const hoodMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.2, roughness: 0.3 });
          const ductMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.5, roughness: 0.3 });

          const hood = new THREE.Mesh(new THREE.BoxGeometry(1.42 * scale[0], 0.04, 1.2 * scale[2]), hoodMat);
          hood.position.set(0, 0.62 + offset[1], 1.2 + offset[2]);
          hood.rotation.x = 0.09;
          group.add(hood);

          const duct = new THREE.Mesh(new THREE.BoxGeometry(0.48 * scale[0], 0.08, 0.75 * scale[2]), ductMat);
          duct.position.set(0, 0.60 + offset[1], 1.15 + offset[2]);
          duct.rotation.x = 0.14;
          group.add(duct);

          return group;
        }
      },
      {
        id: 'donor_pista_blown_spoiler',
        name: '488 Pista Integrated Blown Rear Spoiler',
        category: 'Aero',
        semanticType: 'rear_wing',
        sourceVehicleId: 'ferrari_488_pista',
        sourceVehicleName: 'Ferrari 488 Pista',
        dimensions: { width: 1.72, height: 0.18, length: 0.35 },
        massKg: 4.1,
        downforceKgAt200Kmh: 310,
        dragCdDelta: 0.018,
        defaultMaterialRef: 'carbon_twill',
        description: 'Suspended blown rear spoiler with continuous airflow channel underneath, extending 30mm beyond rear fascia.',
        generateMesh: (scale, offset) => {
          const group = new THREE.Group();
          group.name = 'donor_pista_blown_spoiler';
          const spoilerMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.4, roughness: 0.25 });

          const lip = new THREE.Mesh(new THREE.BoxGeometry(1.72 * scale[0], 0.06 * scale[1], 0.30 * scale[2]), spoilerMat);
          lip.position.set(0, 0.72 + offset[1], -1.95 + offset[2]);
          lip.rotation.x = -0.12;
          group.add(lip);

          return group;
        }
      },
      {
        id: 'donor_pista_carbon_wheels',
        name: '488 Pista Carbon Fiber 1-Piece Monobloc Wheels',
        category: 'Wheels',
        semanticType: 'wheel_fl',
        sourceVehicleId: 'ferrari_488_pista',
        sourceVehicleName: 'Ferrari 488 Pista',
        dimensions: { width: 0.32, height: 0.70, length: 0.70 },
        massKg: 6.9,
        downforceKgAt200Kmh: 0,
        dragCdDelta: 0.003,
        hubInterface: '5x114_3',
        wheelDiameterInches: 20,
        rimWidthInches: 11,
        wheelOffsetMm: 40,
        defaultMaterialRef: 'carbon_twill',
        description: 'Ultralight full carbon fiber barrel and face (-40% unsprung mass compared to forged aluminum).',
        generateMesh: (scale, offset) => {
          const group = new THREE.Group();
          group.name = 'donor_pista_carbon_wheels';
          const carbonMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2, metalness: 0.1 });
          const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 });

          const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.30, 32), tireMat);
          tire.rotation.z = Math.PI / 2;
          group.add(tire);

          const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.31, 24), carbonMat);
          rim.rotation.z = Math.PI / 2;
          group.add(rim);

          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.23, 0.03), carbonMat);
            spoke.rotation.x = angle;
            spoke.position.set(0.12 + offset[0], 0, 0);
            group.add(spoke);
          }

          return group;
        }
      },

      // 3. PORSCHE 911 GT3 RS
      {
        id: 'donor_gt3rs_swan_drs_wing',
        name: '911 GT3 RS Swan-Neck Active DRS High Wing',
        category: 'Aero',
        semanticType: 'rear_wing',
        sourceVehicleId: 'porsche_911_gt3_rs',
        sourceVehicleName: 'Porsche 911 GT3 RS (992)',
        dimensions: { width: 1.82, height: 0.52, length: 0.42 },
        massKg: 7.2,
        downforceKgAt200Kmh: 860,
        dragCdDelta: 0.058,
        defaultMaterialRef: 'carbon_twill',
        description: 'Motorsport roof-line swan-neck rear wing with hydraulic Drag Reduction System (DRS) actuator creating 860kg downforce.',
        generateMesh: (scale, offset, _matRef, customColor) => {
          const group = new THREE.Group();
          group.name = 'donor_gt3rs_swan_drs_wing';

          const wingMat = new THREE.MeshStandardMaterial({
            color: customColor ? new THREE.Color(customColor) : new THREE.Color(0x18181b),
            roughness: 0.28,
            metalness: 0.35
          });
          const bracketMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.85, roughness: 0.15 });

          [-0.42 * scale[0], 0.42 * scale[0]].forEach(x => {
            const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.52 * scale[1], 0.28 * scale[2]), bracketMat);
            pylon.position.set(x, 0.32 + offset[1], -0.05 + offset[2]);
            pylon.rotation.x = 0.22;
            group.add(pylon);
          });

          const blade = new THREE.Mesh(new THREE.BoxGeometry(1.82 * scale[0], 0.035 * scale[1], 0.34 * scale[2]), wingMat);
          blade.position.set(0, 0.55 + offset[1], offset[2]);
          blade.rotation.x = -0.15;
          group.add(blade);

          const flap = new THREE.Mesh(new THREE.BoxGeometry(1.78 * scale[0], 0.02 * scale[1], 0.14 * scale[2]), wingMat);
          flap.position.set(0, 0.58 + offset[1], -0.12 + offset[2]);
          flap.rotation.x = -0.22;
          group.add(flap);

          [-0.91 * scale[0], 0.91 * scale[0]].forEach(x => {
            const ep = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.38, 0.42), wingMat);
            ep.position.set(x, 0.52 + offset[1], offset[2]);
            group.add(ep);
          });

          return group;
        }
      },
      {
        id: 'donor_gt3rs_louvred_fenders',
        name: '911 GT3 RS Carbon Louvred Front Fenders',
        category: 'Body',
        semanticType: 'front_left_fender',
        sourceVehicleId: 'porsche_911_gt3_rs',
        sourceVehicleName: 'Porsche 911 GT3 RS (992)',
        dimensions: { width: 0.45, height: 0.55, length: 1.15 },
        massKg: 3.8,
        downforceKgAt200Kmh: 180,
        dragCdDelta: -0.008,
        defaultMaterialRef: 'carbon_twill',
        description: 'Extruded carbon front wheel arch louvers with cutaway relief channels preventing high-speed aerodynamic lift.',
        generateMesh: (scale, offset) => {
          const group = new THREE.Group();
          group.name = 'donor_gt3rs_louvred_fenders';
          const fenderMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.4, roughness: 0.3 });

          const fender = new THREE.Mesh(new THREE.BoxGeometry(0.35 * scale[0], 0.48 * scale[1], 1.1 * scale[2]), fenderMat);
          fender.position.set(-0.78, 0.48 + offset[1], 1.25 + offset[2]);
          group.add(fender);

          for (let i = 0; i < 5; i++) {
            const slat = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.01, 0.06), fenderMat);
            slat.position.set(-0.78, 0.72 + offset[1], 1.1 + i * 0.07 + offset[2]);
            slat.rotation.x = 0.35;
            group.add(slat);
          }

          return group;
        }
      },
      {
        id: 'donor_gt3rs_centerlock_wheels',
        name: '911 GT3 RS Center-Lock Lightweight Forged Wheels',
        category: 'Wheels',
        semanticType: 'wheel_fl',
        sourceVehicleId: 'porsche_911_gt3_rs',
        sourceVehicleName: 'Porsche 911 GT3 RS (992)',
        dimensions: { width: 0.34, height: 0.71, length: 0.71 },
        massKg: 8.8,
        downforceKgAt200Kmh: 0,
        dragCdDelta: 0.004,
        hubInterface: 'center_lock_84mm',
        wheelDiameterInches: 20,
        rimWidthInches: 10,
        wheelOffsetMm: 45,
        defaultMaterialRef: 'rim',
        description: 'Forged magnesium-aluminum alloy lightweight racing wheels with motorsport center-lock nut.',
        generateMesh: (scale, offset, _matRef, customColor) => {
          const group = new THREE.Group();
          group.name = 'donor_gt3rs_centerlock_wheels';

          const rimMat = new THREE.MeshStandardMaterial({
            color: customColor ? new THREE.Color(customColor) : new THREE.Color(0xd4d4d8),
            metalness: 0.9,
            roughness: 0.2
          });
          const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 });

          const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.30, 32), tireMat);
          tire.rotation.z = Math.PI / 2;
          group.add(tire);

          const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.31, 24), rimMat);
          rim.rotation.z = Math.PI / 2;
          group.add(rim);

          for (let i = 0; i < 7; i++) {
            const angle = (i * Math.PI * 2) / 7;
            const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.24, 0.035), rimMat);
            spoke.rotation.x = angle;
            spoke.position.set(0.12 + offset[0], 0, 0);
            group.add(spoke);
          }

          const nutMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.9, roughness: 0.1 });
          const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.05, 12), nutMat);
          nut.rotation.z = Math.PI / 2;
          nut.position.x = 0.16 + offset[0];
          group.add(nut);

          return group;
        }
      },

      // 4. AFTERMARKET & MOTORSPORT TUNING
      {
        id: 'donor_bbs_fi_r_wheels',
        name: 'BBS FI-R Ultralight Monobloc Forged Wheels',
        category: 'Wheels',
        semanticType: 'wheel_fl',
        sourceVehicleId: 'aftermarket_bbs',
        sourceVehicleName: 'BBS Motorsport Catalog',
        dimensions: { width: 0.32, height: 0.69, length: 0.69 },
        massKg: 7.9,
        downforceKgAt200Kmh: 0,
        dragCdDelta: 0.002,
        hubInterface: '5x112',
        wheelDiameterInches: 20,
        rimWidthInches: 9.5,
        wheelOffsetMm: 42,
        defaultMaterialRef: 'rim',
        description: 'Patented weight-relief holes machined directly into each spoke; ultimate strength-to-weight ratio.',
        generateMesh: (scale, offset) => {
          const group = new THREE.Group();
          group.name = 'donor_bbs_fi_r_wheels';
          const rimMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8, roughness: 0.25 });
          const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 });

          const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.28, 32), tireMat);
          tire.rotation.z = Math.PI / 2;
          group.add(tire);

          const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.29, 24), rimMat);
          rim.rotation.z = Math.PI / 2;
          group.add(rim);

          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.24, 0.04), rimMat);
            spoke.rotation.x = angle;
            spoke.position.set(0.11 + offset[0], 0, 0);
            group.add(spoke);
          }

          return group;
        }
      },
      {
        id: 'donor_gt3_carbon_front_splitter',
        name: 'Endurance GT3 Triple-Plane Carbon Front Splitter',
        category: 'Aero',
        semanticType: 'front_splitter',
        sourceVehicleId: 'aftermarket_aero',
        sourceVehicleName: 'AutoVerse Performance Lab',
        dimensions: { width: 1.95, height: 0.08, length: 0.65 },
        massKg: 4.8,
        downforceKgAt200Kmh: 380,
        dragCdDelta: 0.024,
        defaultMaterialRef: 'carbon_twill',
        description: 'Full carbon underbody splitter with twin underfloor Venturi diffuser tunnels and tie-rod support struts.',
        generateMesh: (scale, offset) => {
          const group = new THREE.Group();
          group.name = 'donor_gt3_carbon_front_splitter';
          const carbonMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.4, roughness: 0.3 });
          const strutMat = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.9, roughness: 0.1 });

          const tray = new THREE.Mesh(new THREE.BoxGeometry(1.95 * scale[0], 0.03 * scale[1], 0.62 * scale[2]), carbonMat);
          tray.position.set(0, 0.08 + offset[1], 2.15 + offset[2]);
          group.add(tray);

          [-0.97 * scale[0], 0.97 * scale[0]].forEach(x => {
            const fence = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.12, 0.45), carbonMat);
            fence.position.set(x, 0.13 + offset[1], 2.15 + offset[2]);
            group.add(fence);
          });

          [-0.35, 0.35].forEach(x => {
            const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.28), strutMat);
            strut.position.set(x, 0.22 + offset[1], 2.32 + offset[2]);
            strut.rotation.x = -0.35;
            group.add(strut);
          });

          return group;
        }
      },
      {
        id: 'donor_venturi_rear_diffuser',
        name: 'Pro-Race 6-Channel Venturi Carbon Diffuser',
        category: 'Aero',
        semanticType: 'rear_diffuser',
        sourceVehicleId: 'aftermarket_aero',
        sourceVehicleName: 'AutoVerse Performance Lab',
        dimensions: { width: 1.88, height: 0.28, length: 0.95 },
        massKg: 6.2,
        downforceKgAt200Kmh: 420,
        dragCdDelta: -0.015,
        defaultMaterialRef: 'carbon_twill',
        description: 'Full-length underbody expansion tunnel with 6 vertical aerodynamic strakes for ground-effect suction.',
        generateMesh: (scale, offset) => {
          const group = new THREE.Group();
          group.name = 'donor_venturi_rear_diffuser';
          const carbonMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.35, roughness: 0.3 });

          const ramp = new THREE.Mesh(new THREE.BoxGeometry(1.85 * scale[0], 0.03, 0.9 * scale[2]), carbonMat);
          ramp.position.set(0, 0.14 + offset[1], -2.05 + offset[2]);
          ramp.rotation.x = -0.18;
          group.add(ramp);

          const count = 6;
          for (let i = 0; i < count; i++) {
            const x = -0.8 + (i * 1.6) / (count - 1);
            const strake = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.18, 0.85), carbonMat);
            strake.position.set(x * scale[0], 0.14 + offset[1], -2.05 + offset[2]);
            strake.rotation.x = -0.18;
            group.add(strake);
          }

          return group;
        }
      }
    ];
  }
}
