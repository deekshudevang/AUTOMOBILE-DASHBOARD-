import * as THREE from 'three';
import { MaterialDefinition } from '../types';

export class PbrMaterialFactory {
  /**
   * Builds production automotive PBR material with clearcoat, roughness, and metalness
   */
  public static createMaterial(def: MaterialDefinition, wireframe = false): THREE.Material {
    switch (def.type) {
      case 'clearcoat_paint':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(def.color),
          metalness: def.metalness ?? 0.35,
          roughness: def.roughness ?? 0.18,
          clearcoat: def.clearcoat ?? 1.0,
          clearcoatRoughness: def.clearcoatRoughness ?? 0.04,
          wireframe,
          side: THREE.DoubleSide
        });

      case 'tyre_rubber':
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color(def.color || '#1A1C1E'),
          roughness: 0.88,
          metalness: 0.05,
          wireframe
        });

      case 'alloy_metal':
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color(def.color || '#D8DEE9'),
          metalness: def.metalness ?? 0.85,
          roughness: def.roughness ?? 0.25,
          wireframe
        });

      case 'carbon_fiber':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(def.color || '#15171A'),
          roughness: 0.55,
          metalness: 0.20,
          clearcoat: 0.20,
          clearcoatRoughness: 0.25,
          wireframe,
          side: THREE.DoubleSide
        });

      case 'transmissive_glass':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(def.color || '#1A2332'),
          transmission: def.transmission ?? 0.92,
          opacity: 1,
          transparent: true,
          roughness: 0.05,
          ior: 1.52,
          wireframe,
          side: THREE.DoubleSide
        });

      case 'emissive_light':
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color(def.color || '#FFFFFF'),
          emissive: new THREE.Color(def.emissive || def.color || '#FFFFFF'),
          emissiveIntensity: def.emissiveIntensity ?? 1.8,
          roughness: 0.1,
          metalness: 0.2,
          wireframe,
          side: THREE.DoubleSide
        });

      case 'interior_leather':
      default:
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color(def.color || '#1E232A'),
          roughness: 0.75,
          metalness: 0.1,
          wireframe,
          side: THREE.DoubleSide
        });
    }
  }

  public static createDefaultMaterials(primaryPaintHex = '#B0B8C0', caliperHex = '#00F0FF'): Record<string, THREE.Material> {
    return {
      body_paint: this.createMaterial({
        type: 'clearcoat_paint',
        color: primaryPaintHex,
        roughness: 0.16,
        metalness: 0.38,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03
      }),
      carbon_aero: this.createMaterial({
        type: 'carbon_fiber',
        color: '#121417',
        roughness: 0.3,
        metalness: 0.45
      }),
      glass: this.createMaterial({
        type: 'transmissive_glass',
        color: '#0E1724',
        roughness: 0.04,
        metalness: 0.15,
        transmission: 0.60
      }),
      tyre: this.createMaterial({
        type: 'tyre_rubber',
        color: '#181A1C',
        roughness: 0.88,
        metalness: 0.04
      }),
      rim: this.createMaterial({
        type: 'alloy_metal',
        color: '#D2D7DF',
        roughness: 0.2,
        metalness: 0.88
      }),
      brake_disc: this.createMaterial({
        type: 'alloy_metal',
        color: '#656D78',
        roughness: 0.35,
        metalness: 0.82
      }),
      brake_caliper: this.createMaterial({
        type: 'clearcoat_paint',
        color: caliperHex,
        roughness: 0.2,
        metalness: 0.5,
        clearcoat: 0.8
      }),
      headlight: this.createMaterial({
        type: 'emissive_light',
        color: '#F0F8FF',
        emissive: '#FFFFFF',
        emissiveIntensity: 2.2
      }),
      taillight: this.createMaterial({
        type: 'emissive_light',
        color: '#FF1133',
        emissive: '#FF0022',
        emissiveIntensity: 2.0
      }),
      interior: this.createMaterial({
        type: 'interior_leather',
        color: '#181B20',
        roughness: 0.8,
        metalness: 0.12
      })
    };
  }
}

