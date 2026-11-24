import React, { useMemo, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { CheraxVehicleConfig, VehicleModelMetadata, VehicleAssetBinding } from '../../types/vehicle';
import { VehicleSchema2 } from '@autoverse/shared-types';
import { resolveVehicleColor } from '../../utils/colorUtils';
import { getGTAColor } from '../../data/gtaColorPalette';
import { NeonUnderglow } from './NeonUnderglow';
import { LicensePlate3D } from './LicensePlate3D';
import { ModelUnavailableDisplay } from './ModelUnavailableDisplay';
import { ProceduralChassisGenerator, ParametricGeometryBuilder, EditableVehicleAssembler, CrossCarPartSwapper } from '@autoverse/vehicle-generation-engine';
import { VehicleGeometryEngine, SchemaV2Migrator } from '../../geometry';
import { toCanonicalV2Id } from '../../geometry/components/canonicalComponentMap';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { geometryCachePool } from '../../utils/geometryCachePool';

interface VehicleRendererProps {
  config: CheraxVehicleConfig;
  modelMeta: VehicleModelMetadata | null;
  assetBinding?: VehicleAssetBinding;
  isWireframe?: boolean;
}

export const VehicleRenderer: React.FC<VehicleRendererProps> = ({
  config,
  modelMeta,
  assetBinding,
  isWireframe = false
}) => {
  const {
    selectedComponentId,
    componentOverrides,
    selectComponent,
    isMeasuring,
    setMeasurementPoint,
    showNormals,
    useGeometryEngineV2,
    openingState
  } = useVehicleStore();

  // Primary Paint material resolution
  const primaryPaint = useMemo(() => {
    return resolveVehicleColor(
      config.isPrimaryColorCustom,
      config.customPrimaryColor,
      config.primaryColor
    );
  }, [config.isPrimaryColorCustom, config.customPrimaryColor, config.primaryColor]);

  // Secondary Paint material resolution
  const secondaryPaint = useMemo(() => {
    return resolveVehicleColor(
      config.isSecondaryColorCustom,
      config.customSecondaryColor,
      config.secondaryColor
    );
  }, [config.isSecondaryColorCustom, config.customSecondaryColor, config.secondaryColor]);

  // Wheel rim color
  const wheelColor = useMemo(() => {
    return getGTAColor(config.wheelColor);
  }, [config.wheelColor]);

  // Suspension stance height offset (mod15)
  const suspensionDrop = useMemo(() => {
    const mod15 = config.mods?.mod15?.index ?? 0;
    return mod15 > 0 ? mod15 * 0.015 : 0;
  }, [config.mods]);

  // Automotive Authentic Geometry Engine (AAGE V2) - Authentic Componentized Assembly
  const v2Result = useMemo(() => {
    if (!useGeometryEngineV2) return null;
    const rawSpec = (config.parametricSpec || ((config as any).geometry?.body_shell ? (config as any) : config)) as any;
    const vehicleId = modelMeta?.codeName || (modelMeta as any)?.id || 'porsche_911_gt3_rs';
    const def = SchemaV2Migrator.migrate(rawSpec, vehicleId);

    // Apply active custom colors
    if (def.materials?.body_paint) {
      def.materials.body_paint.color = primaryPaint.hex;
    }
    if (def.materials?.rim) {
      def.materials.rim.color = wheelColor.hex;
    }

    const engine = new VehicleGeometryEngine();
    const group = engine.loadVehicle(def);
    const report = engine.getValidationReport();
    const components = engine.getComponents();

    // Attach required debug metadata to root object
    group.userData = {
      isVehicleGeometryEngineV2: true,
      generatorId: 'coachwork_generator_v2',
      version: '2.0.0',
      vehicleId: def.meta.id,
      fidelityTier: def.geometry.fidelityTier,
      archetype: def.meta.archetype,
      triangleCount: report.triangleBudget.count,
      componentCount: components.length,
      qualityReport: report
    };

    // Apply wireframe if requested
    if (isWireframe) {
      group.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          const m = (child as THREE.Mesh).material;
          if (m) {
            if (Array.isArray(m)) m.forEach(mat => { (mat as any).wireframe = true; });
            else (m as any).wireframe = true;
          }
        }
      });
    }

    // Apply component overrides if any
    if (componentOverrides) {
      Object.entries(componentOverrides).forEach(([id, override]) => {
        const v2Id = toCanonicalV2Id(id);

        // 1. Component Visibility (Part Removal / Stripped Mode)
        if (override.visible === false) {
          engine.setVisible(v2Id, false);
          engine.setVisible(id, false);
        } else if (override.visible === true) {
          engine.setVisible(v2Id, true);
          engine.setVisible(id, true);
        }

        // 2. Custom Color & Material Finish
        if (override.customColorHex || (override as any).color) {
          const colorHex = override.customColorHex || (override as any).color;
          engine.applyMaterial(v2Id, { color: colorHex });
          engine.applyMaterial(id, { color: colorHex });
        }
        if (override.materialFinish === 'carbon_fiber') {
          engine.applyMaterial(v2Id, { color: '#18181b', roughness: 0.35, metalness: 0.4 });
        } else if (override.materialFinish === 'chrome') {
          engine.applyMaterial(v2Id, { color: '#f8fafc', roughness: 0.05, metalness: 0.98 });
        }

        // 3. Cross-Car Swapped Donor Part Mesh Replacement
        if (override.donorComponentId) {
          const donorPart = CrossCarPartSwapper.getDonorPartById(override.donorComponentId);
          if (donorPart) {
            const scaleAdj: [number, number, number] = override.adapterScale || [1.0, 1.0, 1.0];
            const offsetAdj: [number, number, number] = override.adapterOffset || [0, 0, 0];
            const adaptedMesh = donorPart.generateMesh(scaleAdj, offsetAdj, override.materialRef, override.customColorHex);
            engine.replaceComponent(v2Id, adaptedMesh);
            engine.replaceComponent(id, adaptedMesh.clone());
          }
        }

        // 4. Transform Adjustments: Position X/Y/Z, Rotation Pitch/Yaw/Roll, Scale
        const targetObj = group.getObjectByName(v2Id) || group.getObjectByName(id);
        if (targetObj) {
          if (override.position) {
            targetObj.position.x += override.position[0];
            targetObj.position.y += override.position[1];
            targetObj.position.z += override.position[2];
          }
          if (override.rotation) {
            targetObj.rotation.x += override.rotation[0];
            targetObj.rotation.y += override.rotation[1];
            targetObj.rotation.z += override.rotation[2];
          }
          if (override.scale) {
            targetObj.scale.x *= override.scale[0];
            targetObj.scale.y *= override.scale[1];
            targetObj.scale.z *= override.scale[2];
          }
        }
      });
    }

    return { engine, group, report, components };
  }, [useGeometryEngineV2, config, modelMeta, primaryPaint.hex, wheelColor.hex, isWireframe, componentOverrides]);

  useEffect(() => {
    return () => {
      if (v2Result) {
        v2Result.engine.dispose();
      }
    };
  }, [v2Result]);

  // Schema 2.0 Editable Component Assembly (AutoVerse 50 Vehicle Library)
  const schema2Body = useMemo(() => {
    const rawSpec = (config.parametricSpec || config) as any;
    if (rawSpec?.schemaVersion === '2.0') {
      return EditableVehicleAssembler.build(rawSpec as VehicleSchema2, {
        componentOverrides,
        selectedComponentId,
        wireframe: isWireframe,
        openingState
      });
    }
    return null;
  }, [config.parametricSpec, config, componentOverrides, selectedComponentId, isWireframe]);

  // Apply real-time kinematic opening updates directly to existing scene graph at 60 FPS
  useEffect(() => {
    if (schema2Body) {
      const rawSpec = (config.parametricSpec || config) as any;
      if (rawSpec?.schemaVersion === '2.0') {
        EditableVehicleAssembler.applyOpenings(schema2Body, rawSpec as VehicleSchema2, openingState);
      }
    }
  }, [schema2Body, openingState, config.parametricSpec, config]);

  // Clean up GPU geometries and materials when assembly changes or unmounts
  useEffect(() => {
    return () => {
      if (schema2Body) {
        EditableVehicleAssembler.dispose(schema2Body);
      }
    };
  }, [schema2Body]);

  // Dedicated parametric specification model (e.g. Porsche 911 GT3 RS 992 or AutoVerse 50 Supercars)
  const parametricBody = useMemo(() => {
    if (useGeometryEngineV2 || schema2Body) return null;
    const spec = config.parametricSpec || ((config as any).geometry?.body_shell ? (config as any) : null);
    if (!spec || !spec.geometry?.body_shell?.longitudinal_sections) return null;
    return ParametricGeometryBuilder.build(spec, {
      customPaintHex: primaryPaint.hex,
      customWheelColorHex: wheelColor.hex,
      wireframe: isWireframe
    });
  }, [useGeometryEngineV2, schema2Body, config.parametricSpec, (config as any).geometry, primaryPaint.hex, wheelColor.hex, isWireframe]);

  useEffect(() => {
    return () => {
      if (parametricBody) {
        geometryCachePool.disposeResource(parametricBody);
      }
    };
  }, [parametricBody]);

  // Procedural sculpted chassis assembly (Rule 6 compliant: sculpted real geometry, honest label)
  const proceduralBody = useMemo(() => {
    if (useGeometryEngineV2 || schema2Body || parametricBody) return null;
    return ProceduralChassisGenerator.generateSculptedBody(
      modelMeta?.category || 'Coupe',
      primaryPaint.hex,
      secondaryPaint.hex,
      isWireframe,
      {
        wheelColor: wheelColor.hex,
        includeWheels: true,
        camberDeg: -0.035
      }
    );
  }, [useGeometryEngineV2, schema2Body, parametricBody, modelMeta?.category, primaryPaint.hex, secondaryPaint.hex, wheelColor.hex, isWireframe]);

  useEffect(() => {
    return () => {
      if (proceduralBody) {
        geometryCachePool.disposeResource(proceduralBody);
      }
    };
  }, [proceduralBody]);

  // Direct 3D Raycasting Component Click Handler
  const handlePointerDown = useCallback((e: any) => {
    e.stopPropagation();
    if (isMeasuring && e.point) {
      setMeasurementPoint([e.point.x, e.point.y, e.point.z]);
      return;
    }
    let current: THREE.Object3D | null = e.object;
    while (current) {
      if (current.userData?.componentId) {
        selectComponent(current.userData.componentId);
        return;
      }
      current = current.parent;
    }
    selectComponent(null);
  }, [isMeasuring, setMeasurementPoint, selectComponent]);

  // If a verified authentic custom mesh was uploaded, render it
  if (assetBinding?.isCustomUpload && assetBinding?.customMesh) {
    return (
      <group position={[0, -suspensionDrop, 0]}>
        <primitive object={assetBinding.customMesh} />
        <NeonUnderglow neonKits={config.neonKits} />
      </group>
    );
  }

  // Priority 1: Schema 2.0 High-Detail Interactive Component Assembly (Openings, Interiors, Engine Bays)
  if (schema2Body) {
    const rawSpec = (config.parametricSpec || config) as any;
    const dims = rawSpec.dimensions || { length: 4.6, width: 2.0, height: 1.25 };
    const frontPlateZ = (dims.length * 0.49);
    const rearPlateZ = -(dims.length * 0.49);
    const plateY = 0.22;

    return (
      <group position={[0, -suspensionDrop, 0]}>
        <primitive object={schema2Body} onPointerDown={handlePointerDown} />
        <NeonUnderglow neonKits={config.neonKits} />
        <LicensePlate3D
          text={config.plateText || 'AUTOVERSE'}
          plateIndex={config.plateTextIndex}
          position={[0, plateY, frontPlateZ]}
        />
        <LicensePlate3D
          text={config.plateText || 'AUTOVERSE'}
          plateIndex={config.plateTextIndex}
          position={[0, plateY + 0.03, rearPlateZ]}
          rotation={[0, Math.PI, 0]}
        />
      </group>
    );
  }

  // Priority 2: V2 Automotive Authentic Geometry Engine (Coachwork V2)
  if (useGeometryEngineV2 && v2Result?.group) {
    return (
      <group position={[0, -suspensionDrop, 0]}>
        <primitive object={v2Result.group} onPointerDown={handlePointerDown} />
        <NeonUnderglow neonKits={config.neonKits} />
      </group>
    );
  }

  // If high-detail parametric specification is present, render exact parametric model
  if (parametricBody) {
    const spec = config.parametricSpec || ((config as any).geometry?.body_shell ? (config as any) : null);
    const sections = spec?.geometry?.body_shell?.longitudinal_sections;
    let frontPlateZ = 2.22;
    let rearPlateZ = -2.22;
    let frontPlateY = 0.22;
    let rearPlateY = 0.24;
    if (sections && sections.length > 0) {
      const sortedSecs = [...sections].sort((a: any, b: any) => b.z_m - a.z_m);
      frontPlateZ = sortedSecs[0].z_m + 0.02;
      frontPlateY = (sortedSecs[0].lower_y_m ?? 0.14) + 0.08;
      rearPlateZ = sortedSecs[sortedSecs.length - 1].z_m - 0.02;
      rearPlateY = (sortedSecs[sortedSecs.length - 1].lower_y_m ?? 0.14) + 0.10;
    }

    return (
      <group position={[0, -suspensionDrop, 0]}>
        <primitive object={parametricBody} />
        <NeonUnderglow neonKits={config.neonKits} />
        <LicensePlate3D
          text={config.plateText || 'GT3 RS'}
          plateIndex={config.plateTextIndex}
          position={[0, frontPlateY, frontPlateZ]}
        />
        <LicensePlate3D
          text={config.plateText || 'GT3 RS'}
          plateIndex={config.plateTextIndex}
          position={[0, rearPlateY, rearPlateZ]}
          rotation={[0, Math.PI, 0]}
        />
      </group>
    );
  }

  // Fallback procedural chassis or explicit unavailable warning (prevents silent blank screen)
  if (!proceduralBody) {
    const rawSpec = (config.parametricSpec || config) as any;
    const dims = rawSpec?.dimensions || { length: 4.6, width: 2.0, height: 1.25 };
    return (
      <ModelUnavailableDisplay
        dimensions={dims}
        vehicleName={modelMeta?.displayName || 'Vehicle'}
      />
    );
  }

  // Render High-Fidelity Parametric Procedural Vehicle
  return (
    <group position={[0, -suspensionDrop, 0]}>
      {/* Sculpted parametric monocoque, separate panels, fascias, wing, & 4 radial wheels */}
      <primitive object={proceduralBody} />

      {/* Active Neon Underglow Kit */}
      <NeonUnderglow neonKits={config.neonKits} />

      {/* Front & Rear License Plates */}
      <LicensePlate3D
        text={config.plateText || 'AUTOVERSE'}
        plateIndex={config.plateTextIndex}
        position={[0, 0.22, 2.18]}
      />
      <LicensePlate3D
        text={config.plateText || 'AUTOVERSE'}
        plateIndex={config.plateTextIndex}
        position={[0, 0.24, -2.18]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
};
