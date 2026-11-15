import { VehicleSpecification, CheraxVehicleConfig } from '@autoverse/shared-types';
import { denormalizeCheraxConfig } from './normalizer';

export class JsonPreservationService {
  /**
   * Serializes a VehicleSpecification to JSON string.
   * If original raw text exists and no edits were made, returns original raw text byte-for-byte.
   * Otherwise serializes with strict lossless preservation of unknown fields.
   */
  static serialize(
    spec: VehicleSpecification,
    options: { indent?: number; isModified?: boolean; originalRawText?: string } = {}
  ): string {
    const { indent = 2, isModified = false, originalRawText } = options;

    if (!isModified && originalRawText) {
      return originalRawText; // Exact byte retention
    }

    const denormalized = denormalizeCheraxConfig(spec);
    return JSON.stringify(denormalized, null, indent);
  }
}

