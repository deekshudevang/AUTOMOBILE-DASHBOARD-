import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface ModelUnavailableDisplayProps {
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  reason?: string;
  vehicleName?: string;
}

export const ModelUnavailableDisplay: React.FC<ModelUnavailableDisplayProps> = ({
  dimensions = { length: 4.6, width: 2.0, height: 1.25 },
  reason = 'NO VERIFIED CAD ASSET OR MODEL-SPECIFIC RECONSTRUCTION AVAILABLE',
  vehicleName = 'VEHICLE'
}) => {
  const { length, width, height } = dimensions;

  // Build engineering wireframe cage for the unfulfilled envelope
  const cageGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const halfL = length / 2;
    const halfW = width / 2;
    const minY = 0.05;
    const maxY = minY + height;

    // 12 edges of the bounding box + ground cross
    const points: number[] = [
      // Bottom rectangle
      -halfW, minY, -halfL,   halfW, minY, -halfL,
       halfW, minY, -halfL,   halfW, minY,  halfL,
       halfW, minY,  halfL,  -halfW, minY,  halfL,
      -halfW, minY,  halfL,  -halfW, minY, -halfL,

      // Top rectangle
      -halfW, maxY, -halfL,   halfW, maxY, -halfL,
       halfW, maxY, -halfL,   halfW, maxY,  halfL,
       halfW, maxY,  halfL,  -halfW, maxY,  halfL,
      -halfW, maxY,  halfL,  -halfW, maxY, -halfL,

      // 4 vertical posts
      -halfW, minY, -halfL,  -halfW, maxY, -halfL,
       halfW, minY, -halfL,   halfW, maxY, -halfL,
       halfW, minY,  halfL,   halfW, maxY,  halfL,
      -halfW, minY,  halfL,  -halfW, maxY,  halfL,

      // Ground center cross
      -halfW * 0.4, minY, 0,  halfW * 0.4, minY, 0,
      0, minY, -halfL * 0.4,  0, minY, halfL * 0.4
    ];

    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, [length, width, height]);

  return (
    <group name="model_unavailable_cage">
      {/* Red wireframe engineering bounds */}
      <lineSegments geometry={cageGeometry}>
        <lineBasicMaterial color="#EF4444" linewidth={2} transparent opacity={0.85} />
      </lineSegments>

      {/* Ground silhouette footprint */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshBasicMaterial color="#EF4444" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating Warning Placard */}
      <group position={[0, height * 0.55 + 0.1, 0]}>
        {/* Background plate */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[Math.min(width * 0.9, 1.8), 0.42]} />
          <meshBasicMaterial color="#0A0C10" transparent opacity={0.92} side={THREE.DoubleSide} />
        </mesh>

        {/* Text Headers */}
        <Text
          position={[0, 0.1, 0.01]}
          fontSize={0.07}
          color="#EF4444"
          anchorX="center"
          anchorY="middle"
        >
          MODEL GEOMETRY UNAVAILABLE
        </Text>
        <Text
          position={[0, 0.02, 0.01]}
          fontSize={0.045}
          color="#FCA5A5"
          anchorX="center"
          anchorY="middle"
        >
          {vehicleName.toUpperCase()}
        </Text>
        <Text
          position={[0, -0.07, 0.01]}
          fontSize={0.03}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
        >
          {reason}
        </Text>
      </group>
    </group>
  );
};
