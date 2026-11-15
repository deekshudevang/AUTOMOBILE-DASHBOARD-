import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraPreset } from '../../types/vehicle';

interface CameraRigProps {
  preset: CameraPreset;
  trigger: number;
  autoRotate: boolean;
}

const PRESET_POSITIONS: Record<CameraPreset, [number, number, number]> = {
  isometric: [3.8, 1.8, 4.4],
  front: [0.0, 1.2, 5.2],
  rear: [0.0, 1.2, -5.2],
  left: [-5.2, 1.2, 0.0],
  right: [5.2, 1.2, 0.0],
  top: [0.0, 6.8, 0.1],
  interior: [0.35, 1.05, 0.1],
  wheel: [-1.9, 0.45, 1.4]
};

const PRESET_TARGETS: Record<CameraPreset, [number, number, number]> = {
  isometric: [0, 0.5, 0],
  front: [0, 0.6, 0.5],
  rear: [0, 0.6, -0.5],
  left: [0, 0.6, 0],
  right: [0, 0.6, 0],
  top: [0, 0, 0],
  interior: [-0.05, 0.85, 0.1],
  wheel: [-0.9, 0.35, 1.4]
};

export const CameraRig: React.FC<CameraRigProps> = ({ preset, trigger, autoRotate }) => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3(...PRESET_POSITIONS.isometric));
  const targetLook = useRef<THREE.Vector3>(new THREE.Vector3(...PRESET_TARGETS.isometric));
  const isTransitioning = useRef<boolean>(true);

  useEffect(() => {
    const pos = PRESET_POSITIONS[preset] || PRESET_POSITIONS.isometric;
    const look = PRESET_TARGETS[preset] || PRESET_TARGETS.isometric;
    targetPos.current.set(pos[0], pos[1], pos[2]);
    targetLook.current.set(look[0], look[1], look[2]);
    isTransitioning.current = true;
  }, [preset, trigger]);

  useFrame((_, delta) => {
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
      minDistance={1.2}
      maxDistance={14}
      maxPolarAngle={Math.PI / 2 - 0.02} // Prevent camera going below floor
      autoRotate={autoRotate}
      autoRotateSpeed={1.2}
    />
  );
};

