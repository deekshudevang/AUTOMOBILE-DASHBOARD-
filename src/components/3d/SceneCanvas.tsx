import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { EnvironmentPresets } from './EnvironmentPresets';
import { VehicleRenderer } from './VehicleRenderer';
import { MeasurementOverlay3D } from './MeasurementOverlay3D';
import { useVehicleStore } from '../../hooks/useVehicleStore';

interface SceneCanvasProps {
  customConfig?: any;
  customModelMeta?: any;
  customAssetBinding?: any;
  className?: string;
  enableControls?: boolean;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  customConfig,
  customModelMeta,
  customAssetBinding,
  className = "w-full h-full",
  enableControls = true
}) => {
  const {
    activeConfig,
    activeModel,
    assetBindings,
    cameraPreset,
    cameraTrigger,
    environmentPreset,
    isWireframe,
    isAutoRotate,
    showGrid,
    showShadows,
    graphicsQuality
  } = useVehicleStore();

  const currentConfig = customConfig || activeConfig;
  const currentModelMeta = customModelMeta || activeModel;
  const currentBinding = customAssetBinding || (currentModelMeta ? assetBindings[currentModelMeta.hash] : undefined);

  // Derive dynamic dimensions for camera framing from any vehicle schema or AAGE definition
  const dimensions = useMemo(() => {
    const raw = (currentConfig.parametricSpec || currentBinding?.parametricSpec || currentConfig) as any;
    const dims = raw?.dimensions || raw?.geometry?.dimensions || {};
    const length = Number(dims.length ?? dims.overall_length_m) || 4.6;
    const width = Number(dims.width ?? dims.overall_width_m) || 2.0;
    const height = Number(dims.height ?? dims.overall_height_m) || 1.25;
    return { length, width, height };
  }, [currentConfig, currentBinding]);

  const hasInterior = useMemo(() => {
    const raw = (currentConfig.parametricSpec || currentConfig) as any;
    return raw?.components ? raw.components.some((c: any) => c.group === 'interior') : true;
  }, [currentConfig]);

  // Defect 03: Detect whether an interior/cockpit camera preset is active
  const isCockpitActive = useMemo(() => {
    return (
      cameraPreset === 'cockpit' ||
      cameraPreset === 'interior' ||
      cameraPreset === 'dashboard' ||
      cameraPreset === 'driver_seat' ||
      cameraPreset === 'passenger_seat'
    );
  }, [cameraPreset]);

  // Dynamic Quality Tiers (Low, Medium, High, Ultra)
  const qualitySettings = useMemo(() => {
    switch (graphicsQuality) {
      case 'low':
        return {
          dpr: 1.0,
          shadows: false,
          contactResolution: 256,
          contactBlur: 2.2,
          antialias: false
        };
      case 'medium':
        return {
          dpr: 1.25,
          shadows: showShadows,
          contactResolution: 512,
          contactBlur: 1.8,
          antialias: true
        };
      case 'ultra':
        return {
          dpr: [1, 2.5] as any,
          shadows: showShadows,
          contactResolution: 2048,
          contactBlur: 1.4,
          antialias: true
        };
      case 'high':
      default:
        return {
          dpr: [1, 2] as any,
          shadows: showShadows,
          contactResolution: 1024,
          contactBlur: 1.6,
          antialias: true
        };
    }
  }, [graphicsQuality, showShadows]);

  return (
    <div className={`relative ${className} bg-gt-obsidian overflow-hidden select-none`}>
      <Canvas
        shadows={qualitySettings.shadows}
        camera={{ position: [3.8, 1.8, 4.4], fov: 42 }}
        gl={{
          antialias: qualitySettings.antialias,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          preserveDrawingBuffer: true
        }}
        dpr={qualitySettings.dpr}
      >
        {/* Studio Lighting & Environment Reflections */}
        <EnvironmentPresets preset={environmentPreset} showShadows={qualitySettings.shadows} />

        {/* Defect 03 Resolution: Dynamic Interior Warm Spot Fill Light for Cockpit View */}
        {isCockpitActive && (
          <group>
            {/* Primary Cabin Ceiling Warm Fill Light (3200K) */}
            <pointLight
              position={[0, dimensions.height * 0.72, 0.15]}
              intensity={1.8}
              color="#FFF0D4"
              distance={3.2}
              decay={2}
            />
            {/* Secondary Footwell & Dashboard Cluster Fill Light */}
            <pointLight
              position={[0, dimensions.height * 0.38, 0.45]}
              intensity={0.9}
              color="#FFE4B5"
              distance={2.0}
              decay={2}
            />
          </group>
        )}

        {/* Dynamic Bounding-Box Camera Controller & Presets */}
        {enableControls && (
          <CameraRig
            preset={cameraPreset}
            trigger={cameraTrigger}
            autoRotate={isAutoRotate}
            dimensions={dimensions}
            hasInterior={hasInterior}
          />
        )}

        {/* 3D Vehicle Automotive Assembly */}
        <VehicleRenderer
          config={currentConfig}
          modelMeta={currentModelMeta}
          assetBinding={currentBinding}
          isWireframe={isWireframe}
        />

        {/* 2-Point 3D Measurement Tool (Caliper) */}
        <MeasurementOverlay3D />

        {/* Defect 13 Resolution: Enhanced Soft Contact Shadows under Tires & Chassis */}
        {qualitySettings.shadows && (
          <ContactShadows
            position={[0, 0.005, 0]}
            opacity={0.82}
            scale={14}
            blur={qualitySettings.contactBlur}
            far={3.5}
            resolution={qualitySettings.contactResolution}
            color="#000000"
          />
        )}

        {/* Defect 13 Resolution: Polished Reflective Onyx Showroom Floor */}
        <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial
            color="#07090E"
            roughness={0.24}
            metalness={0.38}
          />
        </mesh>

        {/* Subtle Engineering Ground Calibration Grid (Toggleable, Non-Intrusive) */}
        {showGrid && (
          <gridHelper
            args={[24, 48, '#334155', '#1E293B']}
            position={[0, 0.001, 0]}
          />
        )}
      </Canvas>
    </div>
  );
};
