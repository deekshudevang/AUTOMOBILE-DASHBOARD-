import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { StepCadLoader } from './stepLoader';
import { MeshTopologyAnalyzer } from '../analysis/meshTopologyAnalyzer';
import { SupportedGeometryFormat } from '../types';
import { ParametricGeometryBuilder, EditableVehicleAssembler } from '@autoverse/vehicle-generation-engine';

export interface ModelLoadResult {
  root: THREE.Group;
  format: SupportedGeometryFormat;
  triangleCount: number;
  vertexCount: number;
  detectedUnit: string;
  appliedScaleFactor: number;
  materialsCount: number;
}

/**
 * Universal Automotive 3D Asset Loader
 * Supports GLB, GLTF, OBJ, STL, PLY, STEP, and JSON formats.
 * Automatically normalizes scale to meters and verifies surface normals.
 */
export class UniversalLoader {
  private static gltfLoader = new GLTFLoader();
  private static objLoader = new OBJLoader();
  private static stlLoader = new STLLoader();
  private static plyLoader = new PLYLoader();

  /**
   * Loads a vehicle model from raw data (ArrayBuffer or string) or URL
   */
  static async load(
    source: ArrayBuffer | string,
    formatHint?: SupportedGeometryFormat,
    options: { autoScaleToMeters?: boolean } = { autoScaleToMeters: true }
  ): Promise<ModelLoadResult> {
    const format = formatHint || this.detectFormat(source);
    let rootGroup = new THREE.Group();

    if (format === 'glb' || format === 'gltf') {
      rootGroup = await this.loadGLTF(source);
    } else if (format === 'obj') {
      rootGroup = this.loadOBJ(source);
    } else if (format === 'stl') {
      rootGroup = this.loadSTL(source);
    } else if (format === 'ply') {
      rootGroup = this.loadPLY(source);
    } else if (format === 'step' || format === 'stp') {
      const stepRes = StepCadLoader.parse(source);
      rootGroup = stepRes.group;
    } else if (format === 'json') {
      rootGroup = this.loadJSON(source);
    } else {
      throw new Error(`Unsupported automotive 3D format: "${format}"`);
    }

    // Measure bounding box and auto-normalize scale to meters
    let appliedScaleFactor = 1.0;
    let detectedUnit = 'm';

    if (options.autoScaleToMeters) {
      const box = new THREE.Box3().setFromObject(rootGroup);
      const size = new THREE.Vector3();
      box.getSize(size);

      const scaleInfo = MeshTopologyAnalyzer.detectUnitScale(size);
      appliedScaleFactor = scaleInfo.scaleFactorToMeters;
      detectedUnit = scaleInfo.detectedUnit;

      if (Math.abs(appliedScaleFactor - 1.0) > 1e-5) {
        rootGroup.scale.multiplyScalar(appliedScaleFactor);
        rootGroup.updateMatrixWorld(true);
      }
    }

    // Ensure valid vertex normals
    MeshTopologyAnalyzer.normalizeNormals(rootGroup);

    // Count triangles, vertices, and materials
    let triangleCount = 0;
    let vertexCount = 0;
    const materialSet = new Set<string>();

    rootGroup.traverse(child => {
      if ((child as any).isMesh) {
        const mesh = child as THREE.Mesh;
        const geom = mesh.geometry;
        if (geom) {
          const pos = geom.getAttribute('position');
          const index = geom.getIndex();
          if (pos) {
            vertexCount += pos.count;
            triangleCount += index ? index.count / 3 : pos.count / 3;
          }
        }
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => materialSet.add(m.uuid));
          } else {
            materialSet.add(mesh.material.uuid);
          }
        }
      }
    });

    return {
      root: rootGroup,
      format,
      triangleCount: Math.round(triangleCount),
      vertexCount,
      detectedUnit,
      appliedScaleFactor,
      materialsCount: materialSet.size
    };
  }

  private static detectFormat(source: ArrayBuffer | string): SupportedGeometryFormat {
    if (typeof source === 'string') {
      const trimmed = source.trim();
      if (trimmed.startsWith('{')) return 'json';
      if (trimmed.includes('ISO-10303-21')) return 'step';
      if (trimmed.startsWith('solid') || trimmed.includes('facet normal')) return 'stl';
      if (trimmed.startsWith('ply')) return 'ply';
      if (trimmed.includes('v ') && trimmed.includes('f ')) return 'obj';
      return 'glb';
    } else {
      const header = new Uint8Array(source.slice(0, 16));
      const magic = String.fromCharCode(...header);

      if (magic.includes('glTF')) return 'glb';
      if (magic.includes('ISO-10303')) return 'step';
      if (magic.includes('ply')) return 'ply';
      if (magic.includes('solid')) return 'stl';
      return 'glb';
    }
  }

  private static async loadGLTF(source: ArrayBuffer | string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      if (typeof source === 'string' && (source.startsWith('http') || source.startsWith('blob:') || source.startsWith('/'))) {
        this.gltfLoader.load(source, gltf => resolve(gltf.scene as THREE.Group), undefined, reject);
      } else {
        const buffer = typeof source === 'string' ? new TextEncoder().encode(source).buffer : source;
        this.gltfLoader.parse(buffer, '', gltf => resolve(gltf.scene as THREE.Group), reject);
      }
    });
  }

  private static loadOBJ(source: ArrayBuffer | string): THREE.Group {
    const text = typeof source === 'string' ? source : new TextDecoder('utf-8').decode(source);
    return this.objLoader.parse(text);
  }

  private static loadSTL(source: ArrayBuffer | string): THREE.Group {
    const buffer = typeof source === 'string' ? new TextEncoder().encode(source).buffer : source;
    const geometry = this.stlLoader.parse(buffer);
    geometry.computeVertexNormals();

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x94A3B8,
      metalness: 0.85,
      roughness: 0.25,
      clearcoat: 1.0
    });
    const mesh = new THREE.Mesh(geometry, mat);
    const group = new THREE.Group();
    group.add(mesh);
    return group;
  }

  private static loadPLY(source: ArrayBuffer | string): THREE.Group {
    const buffer = typeof source === 'string' ? new TextEncoder().encode(source).buffer : source;
    const geometry = this.plyLoader.parse(buffer);
    geometry.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({ color: 0x64748B, roughness: 0.4, metalness: 0.6 });
    const mesh = new THREE.Mesh(geometry, mat);
    const group = new THREE.Group();
    group.add(mesh);
    return group;
  }

  private static loadJSON(source: ArrayBuffer | string): THREE.Group {
    const text = typeof source === 'string' ? source : new TextDecoder('utf-8').decode(source);
    const data = JSON.parse(text);

    // If standard Three.js ObjectLoader format
    if (data.metadata?.type === 'Object' || data.geometries) {
      const loader = new THREE.ObjectLoader();
      const obj = loader.parse(data);
      const group = new THREE.Group();
      group.add(obj);
      return group;
    }

    // AutoVerse Schema 2.0 Vehicle Specification with Discrete Components
    if (data.schemaVersion === '2.0' || (data.components && data.bodyGeometry)) {
      return EditableVehicleAssembler.build(data);
    }

    // Parametric Vehicle Geometry Specification (Schema 1.0)
    if (data.asset_type === 'parametric_vehicle_geometry' || data.geometry?.body_shell?.longitudinal_sections) {
      return ParametricGeometryBuilder.build(data);
    }

    // Generic fallback group
    const group = new THREE.Group();
    group.userData = { originalJson: data };
    return group;
  }
}

