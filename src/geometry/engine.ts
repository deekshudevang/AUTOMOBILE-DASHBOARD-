import * as THREE from 'three';
import {
  VehicleGeometryDefinition,
  GeometryNodeMetadata,
  GeometryQualityReport,
  MaterialDefinition,
  CoachworkDimensions
} from './types';
import { PbrMaterialFactory } from './materials/pbrMaterialFactory';
import { WheelAssemblyGenerator } from './wheels/wheelAssemblyGenerator';
import { PanelCutter } from './panelization/panelCutter';
import { QualityGates } from './validation/qualityGates';

export class VehicleGeometryEngine {
  private activeDef: VehicleGeometryDefinition | null = null;
  private activeGroup: THREE.Group | null = null;
  private nodes: GeometryNodeMetadata[] = [];
  private materialsMap: Map<string, THREE.Material> = new Map();
  private qualityReport: GeometryQualityReport | null = null;

  /**
   * Loads and constructs a complete, componentized, production-grade 3D vehicle
   */
  public loadVehicle(def: VehicleGeometryDefinition): THREE.Group {
    // 1. Dispose previous vehicle resources if present
    this.dispose();

    this.activeDef = def;
    const root = new THREE.Group();
    root.name = `vehicle_${def.meta.id}`;

    // 2. Build PBR Materials
    const defaultMats = PbrMaterialFactory.createDefaultMaterials(
      def.materials?.body_paint?.color || '#00E5FF',
      def.wheels?.front?.caliperColor || '#00F0FF'
    );
    for (const [key, mat] of Object.entries(defaultMats)) {
      this.materialsMap.set(key, mat);
    }

    // 3. Build Panelized Chassis & Body Components
    const { group: panelsGroup, nodes: panelNodes } = PanelCutter.buildComponentAssembly(
      def.geometry.dimensions,
      defaultMats,
      def.meta.archetype,
      (def.shutLineGapMm || 3) / 1000,
      def.meta.id
    );
    root.add(panelsGroup);
    this.nodes = [...panelNodes];

    // 4. Build 4-Corner Wheel Assemblies
    const WB = def.geometry.dimensions.wheelbase_m;
    const trackF = def.geometry.dimensions.front_track_m;
    const trackR = def.geometry.dimensions.rear_track_m;

    const corners: Array<{ axle: 'front' | 'rear'; side: 'left' | 'right'; track: number; z: number; spec: any }> = [
      { axle: 'front', side: 'left', track: trackF, z: WB / 2, spec: def.wheels.front },
      { axle: 'front', side: 'right', track: trackF, z: WB / 2, spec: def.wheels.front },
      { axle: 'rear', side: 'left', track: trackR, z: -WB / 2, spec: def.wheels.rear },
      { axle: 'rear', side: 'right', track: trackR, z: -WB / 2, spec: def.wheels.rear }
    ];

    corners.forEach(c => {
      const wheelGroup = WheelAssemblyGenerator.buildCornerAssembly(c.spec, {
        axle: c.axle,
        side: c.side,
        trackWidthM: c.track,
        axleZM: c.z,
        materials: {
          tyre: defaultMats.tyre,
          rim: defaultMats.rim,
          brakeDisc: defaultMats.brake_disc,
          brakeCaliper: defaultMats.brake_caliper
        }
      });
      root.add(wheelGroup);

      const box = new THREE.Box3().setFromObject(wheelGroup);
      const size = new THREE.Vector3();
      box.getSize(size);

      this.nodes.push({
        id: wheelGroup.name,
        semanticType: `wheel_${c.axle[0]}${c.side[0]}` as any,
        pivot: [wheelGroup.position.x, wheelGroup.position.y, wheelGroup.position.z],
        attachPoint: [wheelGroup.position.x, wheelGroup.position.y, wheelGroup.position.z],
        visible: true,
        triangleCount: 4200,
        boundingBox: {
          min: [box.min.x, box.min.y, box.min.z],
          max: [box.max.x, box.max.y, box.max.z],
          size: [size.x, size.y, size.z]
        },
        materialId: 'rim'
      });
    });

    // 5. Evaluate Quality Gates
    this.qualityReport = QualityGates.evaluateAssembly(root, def.geometry.dimensions, 1.0, def.geometry.fidelityTier);

    // Attach provenance metadata
    root.userData = {
      isVehicleGeometryEngineV2: true,
      generatorId: def.geometry.generatorId || 'coachwork_generator_v2',
      vehicleId: def.meta.id,
      fidelityTier: def.geometry.fidelityTier,
      archetype: def.meta.archetype,
      qualityReport: this.qualityReport
    };

    this.activeGroup = root;
    return root;
  }

  public getComponents(): GeometryNodeMetadata[] {
    return this.nodes;
  }

  public getHierarchy(): GeometryNodeMetadata[] {
    return this.nodes;
  }

  public setVisible(id: string, visible: boolean): void {
    if (!this.activeGroup) return;
    const obj = this.activeGroup.getObjectByName(id);
    if (obj) {
      obj.visible = visible;
      const node = this.nodes.find(n => n.id === id);
      if (node) node.visible = visible;
    }
  }

  public isolate(targetId: string): void {
    if (!this.activeGroup) return;
    this.nodes.forEach(node => {
      const isTarget = node.id === targetId;
      this.setVisible(node.id, isTarget);
    });
  }

  public showAll(): void {
    if (!this.activeGroup) return;
    this.nodes.forEach(node => {
      this.setVisible(node.id, true);
    });
  }

  public applyMaterial(componentId: string, params: Partial<MaterialDefinition>): void {
    if (!this.activeGroup) return;
    const obj = this.activeGroup.getObjectByName(componentId);
    if (!obj) return;

    obj.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // Clone per-instance material so shared materials are never modified accidentally
        const existing = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as any;
        const cloned = existing.clone() as THREE.MeshStandardMaterial;

        if (params.color) cloned.color.set(params.color);
        if (params.roughness !== undefined) cloned.roughness = params.roughness;
        if (params.metalness !== undefined) cloned.metalness = params.metalness;
        if ((cloned as any).clearcoat !== undefined && params.clearcoat !== undefined) {
          (cloned as any).clearcoat = params.clearcoat;
        }

        mesh.material = cloned;
      }
    });
  }

  public replaceComponent(targetId: string, alternativeMesh: THREE.Object3D): void {
    if (!this.activeGroup) return;
    const existing = this.activeGroup.getObjectByName(targetId);
    if (existing && existing.parent) {
      alternativeMesh.name = targetId;
      alternativeMesh.position.copy(existing.position);
      alternativeMesh.rotation.copy(existing.rotation);
      alternativeMesh.scale.copy(existing.scale);

      const parent = existing.parent;
      parent.remove(existing);
      parent.add(alternativeMesh);
    }
  }

  public getMeasurements(): CoachworkDimensions & { derivedBoundingBox: any } {
    if (!this.activeGroup || !this.activeDef) {
      throw new Error('No active vehicle loaded');
    }
    const box = new THREE.Box3().setFromObject(this.activeGroup);
    const size = new THREE.Vector3();
    box.getSize(size);

    return {
      ...this.activeDef.geometry.dimensions,
      derivedBoundingBox: {
        lengthM: size.z,
        widthM: size.x,
        heightM: size.y,
        minY: box.min.y
      }
    };
  }

  public getValidationReport(): GeometryQualityReport {
    if (!this.qualityReport) {
      throw new Error('No active vehicle loaded');
    }
    return this.qualityReport;
  }

  /**
   * Safely disposes all Three.js geometries and materials in the loaded vehicle
   */
  public dispose(): void {
    if (this.activeGroup) {
      this.activeGroup.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(m => m.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        }
      });
      this.activeGroup = null;
    }
    this.materialsMap.clear();
    this.nodes = [];
    this.qualityReport = null;
  }
}

