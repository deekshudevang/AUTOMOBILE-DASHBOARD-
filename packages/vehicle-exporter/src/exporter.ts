import JSZip from 'jszip';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { VehicleSpecification } from '@autoverse/shared-types';
import { JsonPreservationService, FiveMMetadataParser } from '@autoverse/json-intelligence';

export class VehicleExporter {
  /**
   * Exports single vehicle specification as Cherax JSON
   */
  static exportCheraxJson(
    spec: VehicleSpecification,
    options: { isModified?: boolean; originalRawText?: string } = {}
  ): string {
    return JsonPreservationService.serialize(spec, options);
  }

  /**
   * Generates FiveM vehicles.meta XML resource string
   */
  static exportFiveMVehiclesMeta(spec: VehicleSpecification, spawnName?: string): string {
    const parser = new FiveMMetadataParser();
    const name = spawnName || spec.sourceFilename.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]/g, '');

    const metaObj = {
      InitDatas: {
        Item: {
          modelName: name,
          txdName: name,
          handlingId: name.toUpperCase(),
          gameName: name.toUpperCase(),
          vehicleMakeName: "AUTOVERSE",
          expressionDictName: "null",
          animGroup: "null",
          modelHash: spec.modelHashUnsigned,
          wheelType: spec.wheels.type
        }
      }
    };

    return parser.serializeToXml("CVehicleModelInfo__InitDataList", metaObj);
  }

  /**
   * Exports a 3D Three.js Object3D / Scene to binary GLB format
   */
  static async exportToGlb(object: THREE.Object3D): Promise<ArrayBuffer> {
    const exporter = new GLTFExporter();
    return new Promise((resolve, reject) => {
      exporter.parse(
        object,
        (gltf) => {
          resolve(gltf as ArrayBuffer);
        },
        (error) => {
          reject(error);
        },
        { binary: true }
      );
    });
  }

  /**
   * Generates batch ZIP archive containing all configurations
   */
  static async exportBatchZip(
    specs: VehicleSpecification[],
    rawTextMap: Record<string, string> = {}
  ): Promise<Uint8Array> {
    const zip = new JSZip();
    const folder = zip.folder("autoverse_fleet");

    for (const spec of specs) {
      const raw = rawTextMap[spec.sourceFilename];
      const json = this.exportCheraxJson(spec, { isModified: !raw, originalRawText: raw });
      folder?.file(spec.sourceFilename, json);
    }

    return await zip.generateAsync({ type: "uint8array" });
  }
}


