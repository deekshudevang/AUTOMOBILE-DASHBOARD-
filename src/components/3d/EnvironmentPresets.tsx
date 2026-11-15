import React from 'react';
import { Environment } from '@react-three/drei';
import { EnvironmentPreset } from '../../types/vehicle';

interface EnvironmentPresetsProps {
  preset: EnvironmentPreset;
  showShadows?: boolean;
}

export const EnvironmentPresets: React.FC<EnvironmentPresetsProps> = ({
  preset,
  showShadows = true
}) => {
  return (
    <>
      {/* Studio Lighting Setups */}
      {preset === 'studio-dark' && (
        <>
          <ambientLight intensity={0.4} />
          {/* Main Key Spot Light */}
          <spotLight
            position={[5, 8, 5]}
            angle={0.6}
            penumbra={0.8}
            intensity={2.8}
            castShadow={showShadows}
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
            color="#FFFFFF"
          />
          {/* Fill Light with slight cool tone */}
          <directionalLight position={[-6, 4, -4]} intensity={1.2} color="#94A3B8" />
          {/* Cyan Rim Accent */}
          <directionalLight position={[0, 5, -8]} intensity={1.8} color="#00F0FF" />
          {/* Ground bounce */}
          <directionalLight position={[0, -2, 0]} intensity={0.2} color="#1E293B" />
          <Environment preset="night" />
        </>
      )}

      {preset === 'cyber-neon' && (
        <>
          <ambientLight intensity={0.25} />
          <spotLight
            position={[4, 7, 4]}
            angle={0.5}
            penumbra={1}
            intensity={2.2}
            castShadow={showShadows}
            color="#00F0FF"
          />
          <directionalLight position={[-5, 4, -4]} intensity={2.4} color="#EC4899" />
          <directionalLight position={[0, 6, -6]} intensity={1.5} color="#8B5CF6" />
          <Environment preset="city" />
        </>
      )}

      {preset === 'showroom' && (
        <>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 6]} intensity={2.5} castShadow={showShadows} color="#FFFFFF" />
          <directionalLight position={[-5, 6, -5]} intensity={1.5} color="#E2E8F0" />
          <Environment preset="studio" />
        </>
      )}

      {preset === 'desert-dawn' && (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight position={[8, 4, 6]} intensity={3.0} castShadow={showShadows} color="#FBBF24" />
          <directionalLight position={[-6, 5, -5]} intensity={1.0} color="#60A5FA" />
          <Environment preset="dawn" />
        </>
      )}

      {preset === 'sunset-boulevard' && (
        <>
          <ambientLight intensity={0.4} />
          <directionalLight position={[-8, 3, 5]} intensity={3.5} castShadow={showShadows} color="#F97316" />
          <directionalLight position={[6, 4, -5]} intensity={1.2} color="#A855F7" />
          <Environment preset="sunset" />
        </>
      )}
    </>
  );
};

