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
          <ambientLight intensity={0.6} />
          {/* Main Key Soft Spot Light */}
          <spotLight
            position={[5, 9, 5]}
            angle={0.65}
            penumbra={0.85}
            intensity={3.2}
            castShadow={showShadows}
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
            color="#FFFFFF"
          />
          {/* Fill Light (Soft Neutral Automotive Lighting) */}
          <directionalLight position={[-6, 5, -4]} intensity={1.6} color="#E2E8F0" />
          {/* Crisp Rear Rim / Shoulder Light */}
          <directionalLight position={[0, 6, -7]} intensity={2.2} color="#F1F5F9" />
          {/* Subtle Ground Bounce */}
          <directionalLight position={[0, -2, 0]} intensity={0.4} color="#334155" />
          <Environment preset="studio" />
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

