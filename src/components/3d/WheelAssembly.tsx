import React, { useMemo } from 'react';
import { WheelGenerator } from '@autoverse/vehicle-generation-engine';
import { getGTAColor } from '../../data/gtaColorPalette';

interface WheelAssemblyProps {
  position: [number, number, number];
  isRightSide?: boolean;
  wheelColorIndex: number;
  wheelType?: number;
  driftTyres?: boolean;
  bulletproofTyres?: boolean;
  camber?: number;
}

export const WheelAssembly: React.FC<WheelAssemblyProps> = ({
  position,
  isRightSide = false,
  wheelColorIndex,
  wheelType = 0,
  driftTyres = false,
  bulletproofTyres = false,
  camber = -0.04
}) => {
  const wheelColor = useMemo(() => {
    return getGTAColor(wheelColorIndex);
  }, [wheelColorIndex]);

  const wheelObject = useMemo(() => {
    const res = WheelGenerator.generateWheel({
      wheelRadius: 0.34,
      tyreWidth: 0.265,
      camberDeg: (camber * 180) / Math.PI,
      isRightSide,
      rimColorHex: wheelColor.hex,
      caliperColorHex: bulletproofTyres ? 0x10B981 : 0x00F0FF
    });
    return res.group;
  }, [wheelColor.hex, camber, isRightSide, bulletproofTyres]);

  return (
    <group position={position}>
      <primitive object={wheelObject} />
    </group>
  );
};
