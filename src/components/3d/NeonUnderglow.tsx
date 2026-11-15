import React, { useMemo } from 'react';
import * as THREE from 'three';
import { NeonKitsConfig } from '../../types/vehicle';
import { rgbToHex } from '../../utils/colorUtils';

interface NeonUnderglowProps {
  neonKits: NeonKitsConfig;
}

export const NeonUnderglow: React.FC<NeonUnderglowProps> = ({ neonKits }) => {
  const { left, right, front, back, color } = neonKits;
  const hex = useMemo(() => rgbToHex(color), [color]);
  const hasAnyNeon = left || right || front || back;

  if (!hasAnyNeon) return null;

  return (
    <group position={[0, 0.08, 0]}>
      {/* Front Neon */}
      {front && (
        <group position={[0, 0, 1.8]}>
          <pointLight color={hex} intensity={2.8} distance={2.4} decay={2} />
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 1.4, 16]} />
            <meshStandardMaterial
              color={hex}
              emissive={hex}
              emissiveIntensity={3.5}
              toneMapped={false}
            />
          </mesh>
        </group>
      )}

      {/* Back Neon */}
      {back && (
        <group position={[0, 0, -1.8]}>
          <pointLight color={hex} intensity={2.8} distance={2.4} decay={2} />
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 1.4, 16]} />
            <meshStandardMaterial
              color={hex}
              emissive={hex}
              emissiveIntensity={3.5}
              toneMapped={false}
            />
          </mesh>
        </group>
      )}

      {/* Left Neon */}
      {left && (
        <group position={[-0.85, 0, 0]}>
          <pointLight color={hex} intensity={3.2} distance={2.6} decay={2} />
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 2.6, 16]} />
            <meshStandardMaterial
              color={hex}
              emissive={hex}
              emissiveIntensity={3.5}
              toneMapped={false}
            />
          </mesh>
        </group>
      )}

      {/* Right Neon */}
      {right && (
        <group position={[0.85, 0, 0]}>
          <pointLight color={hex} intensity={3.2} distance={2.6} decay={2} />
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 2.6, 16]} />
            <meshStandardMaterial
              color={hex}
              emissive={hex}
              emissiveIntensity={3.5}
              toneMapped={false}
            />
          </mesh>
        </group>
      )}

      {/* Ground soft glow puddle */}
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.4, 4.4]} />
        <meshBasicMaterial
          color={hex}
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

