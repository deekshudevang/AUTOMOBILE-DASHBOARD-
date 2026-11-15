import React, { useRef, useCallback, useMemo } from 'react';
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  // Derive dynamic dimensions for camera framing
  const dimensions = useMemo(() => {
    const raw = (currentConfig.parametricSpec || currentConfig) as any;
    if (raw?.dimensions) {
      return {
        length: Number(raw.dimensions.length) || 4.6,
        width: Number(raw.dimensions.width) || 2.0,
        height: Number(raw.dimensions.height) || 1.25
      };
    }
    return { length: 4.6, width: 2.0, height: 1.25 };
  }, [currentConfig]);

  const hasInterior = useMemo(() => {
    const raw = (currentConfig.parametricSpec || currentConfig) as any;
    return raw?.components ? raw.components.some((c: any) => c.group === 'interior') : true;
  }, [currentConfig]);

  // Dynamic Quality Tiers (Low, Medium, High, Ultra)
  const qualitySettings = useMemo(() => {
    switch (graphicsQuality) {
      case 'low':
        return {
          dpr: 1.0,
          shadows: false,
          contactResolution: 256,
          contactBlur: 2.5,
          antialias: false
        };
      case 'medium':
        return {
          dpr: 1.25,
          shadows: showShadows,
          contactResolution: 512,
          contactBlur: 2.0,
          antialias: true
        };
      case 'ultra':
        return {
          dpr: [1, 2.5] as any,
          shadows: showShadows,
          contactResolution: 2048,
          contactBlur: 1.5,
          antialias: true
        };
      case 'high':
      default:
        return {
          dpr: [1, 2] as any,
          shadows: showShadows,
          contactResolution: 1024,
          contactBlur: 1.8,
          antialias: true
        };
    }
  }, [graphicsQuality, showShadows]);

  return (
    <div className={`relative ${className} bg-[#0A0C10] overflow-hidden`}>
      <Canvas
        shadows={qualitySettings.shadows}
        camera={{ position: [3.8, 1.8, 4.4], fov: 42 }}
        gl={{
          antialias: qualitySettings.antialias,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          preserveDrawingBuffer: true
        }}
        dpr={qualitySettings.dpr}
      >
        {/* Studio Lighting & Environment Reflections */}
        <EnvironmentPresets preset={environmentPreset} showShadows={qualitySettings.shadows} />

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

        {/* Ambient Ground Contact Shadows */}
        {qualitySettings.shadows && (
          <ContactShadows
            position={[0, 0.005, 0]}
            opacity={0.7}
            scale={12}
            blur={qualitySettings.contactBlur}
            far={3.5}
            resolution={qualitySettings.contactResolution}
            color="#000000"
          />
        )}

        {/* Studio Grid Floor */}
        {showGrid && (
          <gridHelper
            args={[24, 48, '#00F0FF', '#1E2533']}
            position={[0, 0, 0]}
          />
        )}

        {/* Studio Mirror Floor Disk */}
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[9, 64]} />
          <meshStandardMaterial
            color="#0B0D12"
            roughness={0.65}
            metalness={0.4}
          />
        </mesh>
      </Canvas>
    </div>
  );
};

