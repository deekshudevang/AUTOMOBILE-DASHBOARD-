import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PLATE_STYLES } from '../../data/wheelCatalog';

interface LicensePlate3DProps {
  text: string;
  plateIndex: number;
  position: [number, number, number];
  rotation?: [number, number, number];
}

export const LicensePlate3D: React.FC<LicensePlate3DProps> = ({
  text,
  plateIndex,
  position,
  rotation = [0, 0, 0]
}) => {
  const plateTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const style = PLATE_STYLES.find(s => s.id === plateIndex) || PLATE_STYLES[0];

    // Background
    ctx.fillStyle = style.bgColor;
    ctx.fillRect(0, 0, 512, 256);

    // Bezel border
    ctx.lineWidth = 16;
    ctx.strokeStyle = style.textColor;
    ctx.strokeRect(8, 8, 496, 240);

    // Header State Name
    ctx.fillStyle = style.textColor;
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    const stateName = plateIndex === 5 ? 'NORTH YANKTON' : 'SAN ANDREAS';
    ctx.fillText(stateName, 256, 52);

    // Main License Plate Characters
    ctx.font = '900 110px "JetBrains Mono", "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '8px';
    ctx.fillText(text || 'AUTOVERSE', 256, 145);

    // Footer Tag
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('OCT', 64, 215);
    ctx.fillText('2026', 448, 215);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }, [text, plateIndex]);

  if (!plateTexture) return null;

  return (
    <group position={position} rotation={rotation}>
      {/* Plate Frame Mounting Bracket */}
      <mesh position={[0, 0, -0.005]}>
        <boxGeometry args={[0.54, 0.28, 0.015]} />
        <meshStandardMaterial color="#1A1C20" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* License Plate Face */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[0.52, 0.26]} />
        <meshStandardMaterial
          map={plateTexture}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};

