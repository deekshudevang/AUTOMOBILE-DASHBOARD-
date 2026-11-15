import React, { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraPreset } from '../../types/vehicle';
import { useVehicleStore } from '../../hooks/useVehicleStore';

interface CameraRigProps {
  preset: CameraPreset;
  trigger: number;
  autoRotate: boolean;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  hasInterior?: boolean;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  preset,
  trigger,
  autoRotate,
  dimensions = { length: 4.6, width: 2.0, height: 1.25 },
  hasInterior = true
}) => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3());
  const targetLook = useRef<THREE.Vector3>(new THREE.Vector3());
  const isTransitioning = useRef<boolean>(true);

  // Derive dynamic camera presets from actual vehicle dimensions
  const { positions, targets, minDistance, maxDistance } = useMemo(() => {
    const L = Math.max(dimensions.length, 3.0);
    const W = Math.max(dimensions.width, 1.4);
    const H = Math.max(dimensions.height, 1.0);
    const R = Math.sqrt((L / 2) ** 2 + (W / 2) ** 2 + (H / 2) ** 2);
    const D = R * 1.85;

    const centerY = H * 0.42;

    const pos: Record<CameraPreset, [number, number, number]> = {
      isometric: [D * 0.72, H * 1.35, D * 0.72],
      front: [0.0, H * 0.88, D * 1.08],
      rear: [0.0, H * 0.88, -D * 1.08],
      left: [-D * 1.08, H * 0.88, 0.0],
      right: [D * 1.08, H * 0.88, 0.0],
      top: [0.0, D * 1.45, 0.01],
      wheel: [-W * 0.75, H * 0.4, L * 0.28],
      interior: [0.28, H * 0.78, 0.08]
    };

    const look: Record<CameraPreset, [number, number, number]> = {
      isometric: [0, centerY, 0],
      front: [0, centerY, L * 0.15],
      rear: [0, centerY, -L * 0.15],
      left: [0, centerY, 0],
      right: [0, centerY, 0],
      top: [0, 0, 0],
      wheel: [-W * 0.5, H * 0.25, L * 0.28],
      interior: [-0.08, H * 0.65, 0.25]
    };

    return {
      positions: pos,
      targets: look,
      minDistance: Math.max(R * 0.6, 1.2),
      maxDistance: R * 4.2
    };
  }, [dimensions.length, dimensions.width, dimensions.height]);

  const { reducedMotion } = useVehicleStore();

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const disableMotion = reducedMotion || prefersReducedMotion;

    const targetP = positions[preset] || positions.isometric;
    const targetL = targets[preset] || targets.isometric;

    targetPos.current.set(...targetP);
    targetLook.current.set(...targetL);

    if (disableMotion) {
      camera.position.set(...targetP);
      if (controlsRef.current) {
        controlsRef.current.target.set(...targetL);
        controlsRef.current.update();
      }
      isTransitioning.current = false;
    } else {
      isTransitioning.current = true;
    }
  }, [preset, trigger, positions, targets, camera, reducedMotion]);

  // Interrupt camera lerp upon direct user interaction
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const handleStart = () => {
      isTransitioning.current = false;
    };
    controls.addEventListener('start', handleStart);
    return () => {
      controls.removeEventListener('start', handleStart);
    };
  }, []);

  useFrame(() => {
    if (isTransitioning.current && controlsRef.current) {
      camera.position.lerp(targetPos.current, 0.08);
      controlsRef.current.target.lerp(targetLook.current, 0.08);
      controlsRef.current.update();

      if (camera.position.distanceTo(targetPos.current) < 0.02) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={minDistance}
      maxDistance={maxDistance}
      maxPolarAngle={Math.PI / 2 - 0.02}
      autoRotate={autoRotate}
      autoRotateSpeed={1.0}
      enablePan={true}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      }}
    />
  );
};
