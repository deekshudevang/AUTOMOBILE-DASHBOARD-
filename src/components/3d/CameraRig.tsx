import React, { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraPreset } from '../../types/vehicle';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { useUiStore } from '../../state/useUiStore';

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
  const startPos = useRef<THREE.Vector3>(new THREE.Vector3());
  const startLook = useRef<THREE.Vector3>(new THREE.Vector3());
  const transitionProgress = useRef<number>(1);
  const isTransitioning = useRef<boolean>(false);

  const { reducedMotion, openingState } = useVehicleStore();
  const setIsOrbitDragging = useUiStore(s => s.setIsOrbitDragging);
  const isBladeCollapsed = useUiStore(s => s.isBladeCollapsed);

  // Defect 02 Resolution: Detect if any vehicle aperture (doors, bonnet, boot) is open
  const isApertureOpen = useMemo(() => {
    if (!openingState) return false;
    return (
      (openingState.doorFrontLeft || 0) > 0.05 ||
      (openingState.doorFrontRight || 0) > 0.05 ||
      (openingState.doorRearLeft || 0) > 0.05 ||
      (openingState.doorRearRight || 0) > 0.05 ||
      (openingState.hood || 0) > 0.05 ||
      (openingState.boot || 0) > 0.05
    );
  }, [openingState]);

  // Derive dynamic camera presets from actual vehicle dimensions & bounding envelope
  const { positions, targets, minDistance, maxDistance } = useMemo(() => {
    const L = Math.max(dimensions.length, 3.2);
    const W = Math.max(dimensions.width, 1.5);
    const H = Math.max(dimensions.height, 1.0);
    const R = Math.sqrt((L / 2) ** 2 + (W / 2) ** 2 + (H / 2) ** 2);

    // Defect 02: Elevate camera center when doors/clamshell are high in the air
    const centerY = isApertureOpen ? H * 0.55 : H * 0.45;
    const apertureBuffer = isApertureOpen ? 1.15 : 1.0;
    // 50-Car Framing Pass: provide asymmetric stage clearance for 380px Atelier blade
    const stageBuffer = !isBladeCollapsed ? 1.16 : 1.05;

    // Viewport framing distances derived from FOV (45 deg) with buffer
    const distFront = Math.max(L * 0.5 + 3.0, (W * 0.5) / Math.tan(THREE.MathUtils.degToRad(22.5)) * 1.42) * apertureBuffer * stageBuffer;
    const distRear = distFront;
    const distSide = Math.max(W * 0.5 + 3.2, (L * 0.5) / Math.tan(THREE.MathUtils.degToRad(22.5)) * 1.32) * apertureBuffer * stageBuffer;
    const distTop = Math.max((L * 0.5) / Math.tan(THREE.MathUtils.degToRad(22.5)) * 1.35, 8.8) * apertureBuffer * stageBuffer;
    const distIso = Math.max(R * 2.12, 6.2) * apertureBuffer * stageBuffer;

    const pos: Record<CameraPreset, [number, number, number]> = {
      isometric: [distIso * 0.65, (H * 1.25) * apertureBuffer, distIso * 0.65],
      front: [0.0, (H * 0.65) * (isApertureOpen ? 1.2 : 1.0), distFront],
      rear: [0.0, (H * 0.65) * (isApertureOpen ? 1.2 : 1.0), -distRear],
      left: [-distSide, (H * 0.58) * (isApertureOpen ? 1.2 : 1.0), 0.0],
      right: [distSide, (H * 0.58) * (isApertureOpen ? 1.2 : 1.0), 0.0],
      top: [0.0, distTop, 0.001],
      wheel: [-W * 0.46 - 1.45, H * 0.28 + 0.35, L * 0.26 + 0.65],
      interior: [0.26, H * 0.78, 0.05],
      cockpit: [-0.02, H * 0.75, 0.05],
      dashboard: [-0.04, H * 0.72, 0.42],
      driver_seat: [-W * 0.22, H * 0.76, -0.05],
      passenger_seat: [W * 0.22, H * 0.76, -0.05],
      engine_bay: [0.0, H * 1.25, L * 0.28],
      boot: [0.0, H * 1.2, -L * 0.42],
      wing: [0.0, H * 1.45, -L * 0.44 - 1.85],
      full_inspection: [distIso * 0.85, (H * 1.75) * apertureBuffer, distIso * 0.85]
    };

    const look: Record<CameraPreset, [number, number, number]> = {
      isometric: [0, centerY, 0],
      front: [0, centerY, 0],
      rear: [0, centerY, 0],
      left: [0, centerY, 0],
      right: [0, centerY, 0],
      top: [0, 0, 0],
      wheel: [-W * 0.46, H * 0.28, L * 0.26],
      interior: [-0.08, H * 0.65, 0.25],
      cockpit: [0.0, H * 0.65, 0.35],
      dashboard: [0.0, H * 0.62, 0.65],
      driver_seat: [-W * 0.22, H * 0.60, 0.45],
      passenger_seat: [W * 0.22, H * 0.60, 0.45],
      engine_bay: [0.0, H * 0.35, L * 0.26],
      boot: [0.0, H * 0.4, -L * 0.4],
      wing: [0.0, H * 0.92, -L * 0.44],
      full_inspection: [0, centerY * 1.1, 0]
    };

    return {
      positions: pos,
      targets: look,
      minDistance: Math.max(R * 0.4, 0.8),
      maxDistance: R * 4.8
    };
  }, [dimensions.length, dimensions.width, dimensions.height, isApertureOpen, isBladeCollapsed]);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const disableMotion = reducedMotion || prefersReducedMotion;

    const targetP = positions[preset] || positions.isometric;
    const targetL = targets[preset] || targets.isometric;

    startPos.current.copy(camera.position);
    if (controlsRef.current) {
      startLook.current.copy(controlsRef.current.target);
    } else {
      startLook.current.set(0, 0, 0);
    }

    targetPos.current.set(...targetP);
    targetLook.current.set(...targetL);

    if (disableMotion) {
      camera.position.set(...targetP);
      if (controlsRef.current) {
        controlsRef.current.target.set(...targetL);
        controlsRef.current.update();
      }
      isTransitioning.current = false;
      transitionProgress.current = 1;
    } else {
      isTransitioning.current = true;
      transitionProgress.current = 0;
    }
  }, [preset, trigger, positions, targets, camera, reducedMotion]);

  // Hook orbit controls events for drag state and gesture interruption
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleStart = () => {
      isTransitioning.current = false;
      setIsOrbitDragging(true);
    };

    const handleEnd = () => {
      setIsOrbitDragging(false);
    };

    controls.addEventListener('start', handleStart);
    controls.addEventListener('end', handleEnd);

    return () => {
      controls.removeEventListener('start', handleStart);
      controls.removeEventListener('end', handleEnd);
      setIsOrbitDragging(false);
    };
  }, [setIsOrbitDragging]);

  // Defect 15 Resolution: Curved Bezier Flypath Orbit Interpolation
  useFrame((_, delta) => {
    if (!isTransitioning.current || !controlsRef.current) return;

    // Progress with ease-out cubic
    transitionProgress.current = Math.min(1, transitionProgress.current + delta * 2.2);
    const t = transitionProgress.current;
    const easeOut = 1 - Math.pow(1 - t, 3);

    // Compute curved exterior arc: intermediate waypoint arcs outward around car
    const currentT = easeOut;
    const arcHeight = Math.sin(currentT * Math.PI) * 0.45;

    // Lerp positions
    camera.position.lerpVectors(startPos.current, targetPos.current, currentT);
    camera.position.y += arcHeight; // Lift slightly on the arc to prevent roof collision

    // Lerp target focus
    controlsRef.current.target.lerpVectors(startLook.current, targetLook.current, currentT);
    controlsRef.current.update();

    if (transitionProgress.current >= 1 || camera.position.distanceTo(targetPos.current) < 0.015) {
      camera.position.copy(targetPos.current);
      controlsRef.current.target.copy(targetLook.current);
      controlsRef.current.update();
      isTransitioning.current = false;
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
