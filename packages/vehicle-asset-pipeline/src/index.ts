/**
 * AUTOVERSE 3D — Vehicle Asset Pipeline Package
 * Conforms to Phase 7 Asset Priority Resolution Specification
 */

export interface VehicleAssetEntry {
  modelHash: number;
  modelCode: string;
  displayName: string;
  manufacturer: string;
  assetPath: string;
  assetFormat: 'glb' | 'gltf' | 'obj' | 'fbx';
  supportedModifications?: string[];
  materialNames?: Record<string, string>;
  wheelAttachmentPoints?: {
    frontLeft: [number, number, number];
    frontRight: [number, number, number];
    rearLeft: [number, number, number];
    rearRight: [number, number, number];
  };
  cameraPresets?: Record<string, [number, number, number]>;
  lodLevels?: string[];
}

export interface AssetManifest {
  version: string;
  name: string;
  vehicles: VehicleAssetEntry[];
}

export type AssetResolutionStatus = 'AUTHENTIC_ASSET' | 'APPROXIMATE_TEMPLATE' | 'MISSING_ASSET';

export type AssetResolutionTier =
  | 'TIER_1_EXACT_GLB'
  | 'TIER_2_BASE_MESH'
  | 'TIER_3_BASE_PLUS_MODS'
  | 'TIER_4_PROCEDURAL_TEMPLATE'
  | 'TIER_5_MISSING_ASSET';

export interface AssetResolutionResult {
  status: AssetResolutionStatus;
  tier: AssetResolutionTier;
  assetId?: string;
  matchConfidence: number;
  reasonsRejected: string[];
  entry?: VehicleAssetEntry;
  assetPath?: string;
  assetFormat?: string;
  isApproximate: boolean;
  approximateNotice?: string;
}

export class AssetResolver {
  private manifest: AssetManifest | null = null;
  private hashIndex: Map<number, VehicleAssetEntry> = new Map();
  private codeIndex: Map<string, VehicleAssetEntry> = new Map();
  private importedBaseMeshes: Map<string, any> = new Map();
  private allowProceduralFallback: boolean = true;

  constructor(manifest?: AssetManifest, allowProceduralFallback = true) {
    this.allowProceduralFallback = allowProceduralFallback;
    if (manifest) {
      this.loadManifest(manifest);
    }
  }

  loadManifest(manifest: AssetManifest): void {
    this.manifest = manifest;
    this.hashIndex.clear();
    this.codeIndex.clear();

    for (const v of manifest.vehicles) {
      this.hashIndex.set(v.modelHash, v);
      // Map signed 32-bit equivalent
      const signed = v.modelHash > 0x7fffffff ? v.modelHash - 0x100000000 : v.modelHash;
      this.hashIndex.set(signed, v);
      this.codeIndex.set(v.modelCode.toLowerCase(), v);
    }
  }

  registerImportedBaseMesh(modelIdentifier: string | number, meshData: any): void {
    this.importedBaseMeshes.set(String(modelIdentifier).toLowerCase(), meshData);
  }

  /**
   * 5-Tier Asset Priority Resolution (Phase 7 Specification)
   * 1. Exact compatible vehicle GLB/GLTF
   * 2. Compatible imported base mesh
   * 3. Compatible base mesh + imported modification parts
   * 4. High-quality procedural template (with mandatory approximation label)
   * 5. Explicit missing-asset state (visible placeholder UI, no silent fallback)
   */
  resolve(modelIdentifier: number | string, hasImportedMods = false): AssetResolutionResult {
    const reasonsRejected: string[] = [];
    const idKey = String(modelIdentifier).toLowerCase();

    // --- TIER 1: Exact compatible vehicle GLB/GLTF from Manifest ---
    let entry: VehicleAssetEntry | undefined;
    if (typeof modelIdentifier === 'number') {
      entry = this.hashIndex.get(modelIdentifier);
    } else {
      const parsedNum = Number(modelIdentifier);
      if (!isNaN(parsedNum)) {
        entry = this.hashIndex.get(parsedNum);
      }
      if (!entry) {
        entry = this.codeIndex.get(idKey);
      }
    }

    if (entry && (entry.assetFormat === 'glb' || entry.assetFormat === 'gltf')) {
      return {
        status: 'AUTHENTIC_ASSET',
        tier: 'TIER_1_EXACT_GLB',
        assetId: entry.modelCode,
        matchConfidence: 1.0,
        reasonsRejected: [],
        entry,
        assetPath: entry.assetPath,
        assetFormat: entry.assetFormat,
        isApproximate: false
      };
    } else {
      reasonsRejected.push(`Tier 1: No pre-compiled GLB/GLTF asset found in manifest for model "${modelIdentifier}"`);
    }

    // --- TIER 2 & 3: Compatible Imported Base Mesh ---
    const importedMesh = this.importedBaseMeshes.get(idKey);
    if (importedMesh) {
      const tier: AssetResolutionTier = hasImportedMods ? 'TIER_3_BASE_PLUS_MODS' : 'TIER_2_BASE_MESH';
      return {
        status: 'AUTHENTIC_ASSET',
        tier,
        assetId: idKey,
        matchConfidence: 0.9,
        reasonsRejected,
        isApproximate: false,
        assetPath: `imported://${idKey}`
      };
    } else {
      reasonsRejected.push(`Tier 2 & 3: No imported custom base mesh supplied by user for "${modelIdentifier}"`);
    }

    // --- TIER 4: High-Quality Parametric Procedural Template ---
    if (this.allowProceduralFallback) {
      return {
        status: 'APPROXIMATE_TEMPLATE',
        tier: 'TIER_4_PROCEDURAL_TEMPLATE',
        matchConfidence: 0.75,
        reasonsRejected,
        isApproximate: true,
        approximateNotice: 'APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY'
      };
    } else {
      reasonsRejected.push(`Tier 4: Procedural template fallback disabled by client configuration`);
    }

    // --- TIER 5: Explicit Missing-Asset State ---
    return {
      status: 'MISSING_ASSET',
      tier: 'TIER_5_MISSING_ASSET',
      matchConfidence: 0.0,
      reasonsRejected,
      isApproximate: true,
      approximateNotice: 'MISSING 3D ASSET — No authentic mesh or procedural template available'
    };
  }
}

export interface MeshGeometryMetrics {
  vertices: number;
  triangles: number;
  materialsCount: number;
  meshCount: number;
  boundingBox?: {
    min: [number, number, number];
    max: [number, number, number];
    dimensions: [number, number, number];
  };
}

export class AssetInspector {
  static inspectObject3D(root: any): MeshGeometryMetrics {
    let vertices = 0;
    let triangles = 0;
    const materialSet = new Set<string>();
    let meshCount = 0;

    if (!root) {
      return { vertices: 0, triangles: 0, materialsCount: 0, meshCount: 0 };
    }

    if (typeof root.traverse === 'function') {
      root.traverse((child: any) => {
        if (child.isMesh && child.geometry) {
          meshCount++;
          const geom = child.geometry;
          if (geom.attributes && geom.attributes.position) {
            vertices += geom.attributes.position.count;
          }
          if (geom.index) {
            triangles += geom.index.count / 3;
          } else if (geom.attributes && geom.attributes.position) {
            triangles += geom.attributes.position.count / 3;
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m: any) => materialSet.add(m.uuid || m.name));
            } else {
              materialSet.add(child.material.uuid || child.material.name);
            }
          }
        }
      });
    }

    return {
      vertices,
      triangles: Math.floor(triangles),
      materialsCount: materialSet.size,
      meshCount
    };
  }
}
