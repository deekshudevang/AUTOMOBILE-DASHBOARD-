import {
  GeometryQualityClass,
  GeometryProvenance,
  AuthenticVehicleMetadata,
  GeometryValidationReport
} from '../types';

export interface QualityBadgeInfo {
  classification: GeometryQualityClass;
  grade: 'A' | 'B' | 'C' | 'D';
  shortLabel: string;
  badgeTitle: string;
  badgeDescription: string;
  hexColor: string;
  isAuthentic: boolean;
  requiresApproximationBanner: boolean;
}

export interface ProvenanceCertificate {
  certificateId: string;
  vehicleId: string;
  vehicleName: string;
  classification: GeometryQualityClass;
  badge: QualityBadgeInfo;
  provenance: GeometryProvenance;
  license: string;
  maxDimensionalDeviationPercent: number;
  issuedAt: string;
  verifiedBy: string;
  disclaimer?: string;
}

/**
 * Phase 7: Geometry Quality Classification & Provenance Engine
 * Enforces strict 4-class accuracy grading (Class A OEM, Class B Production, Class C Reconstructed, Class D Approximate).
 * Guarantees that approximate or reconstructed models are never advertised as OEM geometry.
 */
export class QualityClassifier {
  /**
   * Resolves the official quality classification based on provenance, license, and dimensional tolerance
   */
  static classify(
    provenance: GeometryProvenance,
    maxDeviationPercent: number,
    license: string
  ): GeometryQualityClass {
    const isOemLicensed = license.toLowerCase().includes('oem') || license.toLowerCase().includes('manufacturer');
    const isProcedural = provenance.includes('Procedural') || provenance.includes('Parametric');

    if (isProcedural) {
      return 'CLASS_D_APPROXIMATE';
    }

    if (provenance.includes('Manufacturer CAD') && isOemLicensed && maxDeviationPercent <= 1.5) {
      return 'CLASS_A_VERIFIED_OEM';
    }

    if ((provenance.includes('Licensed 3D Studio') || provenance.includes('Manufacturer CAD')) && maxDeviationPercent <= 3.5) {
      return 'CLASS_B_VERIFIED_PRODUCTION';
    }

    if (provenance.includes('Laser Scan') || provenance.includes('Photogrammetric') || maxDeviationPercent <= 5.0) {
      return 'CLASS_C_RECONSTRUCTED';
    }

    return 'CLASS_D_APPROXIMATE';
  }

  /**
   * Retrieves user-facing UI badge styling and metadata for the classification
   */
  static getBadgeInfo(classification: GeometryQualityClass): QualityBadgeInfo {
    switch (classification) {
      case 'CLASS_A_VERIFIED_OEM':
        return {
          classification,
          grade: 'A',
          shortLabel: 'CLASS A',
          badgeTitle: 'VERIFIED OEM GEOMETRY',
          badgeDescription: 'Direct manufacturer-authorized CAD / engineering B-rep geometry. Maximum authentic fidelity.',
          hexColor: '#10B981', // Emerald Green
          isAuthentic: true,
          requiresApproximationBanner: false
        };

      case 'CLASS_B_VERIFIED_PRODUCTION':
        return {
          classification,
          grade: 'B',
          shortLabel: 'CLASS B',
          badgeTitle: 'VERIFIED PRODUCTION MODEL',
          badgeDescription: 'High-precision production vehicle mesh with documented model year, generation, and < 3.5% dimensional tolerance.',
          hexColor: '#00F0FF', // Cyan Apex
          isAuthentic: true,
          requiresApproximationBanner: false
        };

      case 'CLASS_C_RECONSTRUCTED':
        return {
          classification,
          grade: 'C',
          shortLabel: 'CLASS C',
          badgeTitle: 'RECONSTRUCTED GEOMETRY',
          badgeDescription: 'Geometry reconstructed from documented 3D laser scans or verified multiview photogrammetry.',
          hexColor: '#F59E0B', // Amber
          isAuthentic: false,
          requiresApproximationBanner: false
        };

      case 'CLASS_D_APPROXIMATE':
      default:
        return {
          classification: 'CLASS_D_APPROXIMATE',
          grade: 'D',
          shortLabel: 'CLASS D',
          badgeTitle: 'APPROXIMATE TEMPLATE',
          badgeDescription: 'Procedural or approximate generic vehicle geometry. Not an authentic manufacturer model.',
          hexColor: '#94A3B8', // Slate / Gray
          isAuthentic: false,
          requiresApproximationBanner: true
        };
    }
  }

  /**
   * Issues an immutable Automotive Provenance Certificate
   */
  static issueCertificate(
    metadata: AuthenticVehicleMetadata,
    validationReport?: GeometryValidationReport
  ): ProvenanceCertificate {
    const deviation = validationReport ? validationReport.maxDeviationPercent : 0.0;
    const classification = metadata.accuracyClassification;
    const badge = this.getBadgeInfo(classification);

    let disclaimer: string | undefined = undefined;
    if (badge.requiresApproximationBanner) {
      disclaimer = 'APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY';
    }

    return {
      certificateId: `AAGE-CERT-${metadata.modelHash}-${Date.now().toString(36).toUpperCase()}`,
      vehicleId: metadata.id,
      vehicleName: `${metadata.manufacturer} ${metadata.vehicleName} (${metadata.generation || metadata.modelYear})`,
      classification,
      badge,
      provenance: metadata.geometryProvenance,
      license: metadata.license,
      maxDimensionalDeviationPercent: deviation,
      issuedAt: new Date().toISOString(),
      verifiedBy: 'AutoVerse 3D AAGE Engineering Authority',
      disclaimer
    };
  }
}

