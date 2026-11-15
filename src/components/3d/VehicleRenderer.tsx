import React, { useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { CheraxVehicleConfig, VehicleModelMetadata, VehicleAssetBinding } from '../../types/vehicle';
import { VehicleSchema2 } from '@autoverse/shared-types';
import { resolveVehicleColor } from '../../utils/colorUtils';
import { getGTAColor } from '../../data/gtaColorPalette';
import { NeonUnderglow } from './NeonUnderglow';
import { LicensePlate3D } from './LicensePlate3D';
import { ProceduralChassisGenerator, ParametricGeometryBuilder, EditableVehicleAssembler } from '@autoverse/vehicle-generation-engine';
import { useVehicleStore } from '../../hooks/useVehicleStore';

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
  const { selectedComponentId, componentOverrides, selectComponent } = useVehicleStore();

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

  // Schema 2.0 Editable Component Assembly (AutoVerse 50 Vehicle Library)
  const schema2Body = useMemo(() => {
    const rawSpec = (config.parametricSpec || config) as any;
    if (rawSpec?.schemaVersion === '2.0') {
      return EditableVehicleAssembler.build(rawSpec as VehicleSchema2, {
        componentOverrides,
        selectedComponentId,
        wireframe: isWireframe
      });
    }
    return null;
  }, [config.parametricSpec, config, componentOverrides, selectedComponentId, isWireframe]);

  // Dedicated parametric specification model (e.g. Porsche 911 GT3 RS 992 or AutoVerse 50 Supercars)
  const parametricBody = useMemo(() => {
    if (schema2Body) return null;
    const spec = config.parametricSpec || ((config as any).geometry?.body_shell ? (config as any) : null);
    if (!spec || !spec.geometry?.body_shell?.longitudinal_sections) return null;
    return ParametricGeometryBuilder.build(spec, {
      customPaintHex: primaryPaint.hex,
      customWheelColorHex: wheelColor.hex,
      wireframe: isWireframe
    });
  }, [schema2Body, config.parametricSpec, (config as any).geometry, primaryPaint.hex, wheelColor.hex, isWireframe]);

  // Procedural sculpted chassis assembly (Rule 6 compliant: sculpted real geometry, honest label)
  const proceduralBody = useMemo(() => {
    if (schema2Body || parametricBody) return null;
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
  }, [schema2Body, parametricBody, modelMeta?.category, primaryPaint.hex, secondaryPaint.hex, wheelColor.hex, isWireframe]);

  // Direct 3D Raycasting Component Click Handler
  const handlePointerDown = useCallback((e: any) => {
    e.stopPropagation();
    let current: THREE.Object3D | null = e.object;
    while (current) {
      if (current.userData?.componentId) {
        selectComponent(current.userData.componentId);
        return;
      }
      current = current.parent;
    }
    selectComponent(null);
  }, [selectComponent]);

  // If a verified authentic custom mesh was uploaded, render it
  if (assetBinding?.isCustomUpload && assetBinding?.customMesh) {
    return (
      <group position={[0, -suspensionDrop, 0]}>
        <primitive object={assetBinding.customMesh} />
        <NeonUnderglow neonKits={config.neonKits} />
      </group>
    );
  }

  // Schema 2.0 High-Detail Interactive Assembly
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

  // Fallback procedural chassis
  if (!proceduralBody) return null;

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
