import React, { useMemo } from 'react';
import {
  DoorClosed,
  DoorOpen,
  Eye,
  Sliders,
  RotateCcw,
  Sparkles,
  Layers,
  Camera,
  Gauge,
  Cpu,
  Car
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { VehicleSchema2 } from '@autoverse/shared-types';
import {
  VehicleOpeningController,
  VehicleEngineBayGenerator,
  VehicleOpeningConfig,
  EngineBaySpec
} from '@autoverse/vehicle-generation-engine';
import { CameraPreset } from '../../types/vehicle';

export const VehicleAccessPanel: React.FC = () => {
  const {
    activeConfig,
    openingState,
    setOpeningState,
    openAllApertures,
    closeAllApertures,
    setCameraPreset,
    cameraPreset
  } = useVehicleStore();

  const rawSpec = (activeConfig.parametricSpec || activeConfig) as any;
  const isSchema2 = rawSpec?.schemaVersion === '2.0';

  // Resolve Vehicle-Specific Kinematics & Engine Configuration
  const { openingConfig, engineSpec } = useMemo<{
    openingConfig: VehicleOpeningConfig;
    engineSpec: EngineBaySpec;
  }>(() => {
    if (isSchema2) {
      const spec = rawSpec as VehicleSchema2;
      return {
        openingConfig: VehicleOpeningController.resolveOpeningConfig(spec),
        engineSpec: VehicleEngineBayGenerator.resolveEngineSpec(spec)
      };
    }
    // Fallback defaults for legacy vehicles
    return {
      openingConfig: {
        doorCount: 2,
        doorMechanism: 'conventional',
        hoodMechanism: 'rear_hinged',
        bootMechanism: 'trunk_lid',
        doorHingeOffsetFrontM: [-0.9, 0, 0.8],
        hoodHingeOffsetM: [0, 0.5, 0.6],
        bootHingeOffsetM: [0, 0.5, -0.8]
      },
      engineSpec: {
        archetype: 'INLINE_FRONT',
        displacementCc: 2998,
        engineCode: '3.0L TwinPower Turbo',
        isForcedInduction: true,
        inductionType: 'twin_turbo',
        isHybrid: false,
        isMidRear: false,
        cylinderCount: 6,
        camCoverColor: '#dc2626',
        intakeColor: '#cbd5e1'
      }
    };
  }, [isSchema2, rawSpec]);

  // Descriptive Mechanism Labels
  const doorLabel = useMemo(() => {
    switch (openingConfig.doorMechanism) {
      case 'scissor':
        return 'Scissor Vertical Door';
      case 'butterfly':
        return 'Dihedral Butterfly Door';
      case 'dihedral_synchro_helix':
        return 'Dihedral Synchro-Helix Door';
      case 'gullwing':
        return 'Roof Gullwing Door';
      case 'coach':
        return 'Coach Suicide Door';
      case 'conventional':
      default:
        return 'Conventional Door';
    }
  }, [openingConfig.doorMechanism]);

  const hoodLabel = useMemo(() => {
    switch (openingConfig.hoodMechanism) {
      case 'clamshell_forward':
        return 'Forward-Tilting Clamshell Hood';
      case 'frunk':
        return 'Front Luggage Frunk Lid';
      case 'rear_hinged':
      default:
        return 'Front Engine Hood / Bonnet';
    }
  }, [openingConfig.hoodMechanism]);

  const bootLabel = useMemo(() => {
    switch (openingConfig.bootMechanism) {
      case 'rear_clamshell':
        return 'Full Rear Clamshell Engine Bay';
      case 'liftback_hatch':
        return 'Rear Glass Liftback Hatch';
      case 'trunk_lid':
      default:
        return 'Rear Cargo Trunk Lid';
    }
  }, [openingConfig.bootMechanism]);

  const handleSliderChange = (key: keyof typeof openingState, val: number) => {
    setOpeningState({ [key]: val });
  };

  const toggleAperture = (key: keyof typeof openingState) => {
    setOpeningState(prev => ({
      ...prev,
      [key]: prev[key] > 0.1 ? 0 : 1.0
    }));
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Header Info Card */}
      <div className="bg-[#12141A] border border-[#27272A] rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-zinc-100">
            <DoorOpen className="w-4 h-4 text-[#00F0FF]" />
            <span>Kinematic Apertures & Access</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#18181B] text-[#00F0FF] border border-[#27272A]">
            {openingConfig.doorMechanism.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Powertrain Specifications Pill */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#27272A] text-zinc-400">
          <Cpu className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-mono text-[11px] text-zinc-200">{engineSpec.engineCode}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
            {engineSpec.isMidRear ? 'Mid-Engine' : 'Front-Engine'}
          </span>
        </div>
      </div>

      {/* Global Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={openAllApertures}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-[#18181B] hover:bg-[#27272A] text-zinc-200 border border-[#27272A] hover:border-[#00F0FF] transition-all duration-150 font-medium"
        >
          <DoorOpen className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>Open All</span>
        </button>
        <button
          onClick={closeAllApertures}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-[#18181B] hover:bg-[#27272A] text-zinc-200 border border-[#27272A] hover:border-zinc-500 transition-all duration-150 font-medium"
        >
          <DoorClosed className="w-3.5 h-3.5 text-zinc-400" />
          <span>Close All</span>
        </button>
      </div>

      {/* Individual Aperture Sliders & Toggles */}
      <div className="bg-[#12141A] border border-[#27272A] rounded-lg p-3 space-y-3">
        <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Individual Aperture Controls
        </div>

        {/* Front Left Door */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-1.5">
              <span>{doorLabel} (L)</span>
            </span>
            <button
              onClick={() => toggleAperture('doorFrontLeft')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                openingState.doorFrontLeft > 0.05
                  ? 'bg-cyan-950/60 text-[#00F0FF] border border-cyan-800'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {Math.round(openingState.doorFrontLeft * 100)}%
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={openingState.doorFrontLeft}
            onChange={e => handleSliderChange('doorFrontLeft', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
          />
        </div>

        {/* Front Right Door */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-1.5">
              <span>{doorLabel} (R)</span>
            </span>
            <button
              onClick={() => toggleAperture('doorFrontRight')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                openingState.doorFrontRight > 0.05
                  ? 'bg-cyan-950/60 text-[#00F0FF] border border-cyan-800'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {Math.round(openingState.doorFrontRight * 100)}%
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={openingState.doorFrontRight}
            onChange={e => handleSliderChange('doorFrontRight', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
          />
        </div>

        {/* Rear Doors for 4-Door Vehicles (Evo IX & WRX STI) */}
        {openingConfig.doorCount === 4 && (
          <>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Rear Passenger Door (L)</span>
                <button
                  onClick={() => toggleAperture('doorRearLeft')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    openingState.doorRearLeft > 0.05
                      ? 'bg-cyan-950/60 text-[#00F0FF] border border-cyan-800'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {Math.round(openingState.doorRearLeft * 100)}%
                </button>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={openingState.doorRearLeft}
                onChange={e => handleSliderChange('doorRearLeft', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Rear Passenger Door (R)</span>
                <button
                  onClick={() => toggleAperture('doorRearRight')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    openingState.doorRearRight > 0.05
                      ? 'bg-cyan-950/60 text-[#00F0FF] border border-cyan-800'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {Math.round(openingState.doorRearRight * 100)}%
                </button>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={openingState.doorRearRight}
                onChange={e => handleSliderChange('doorRearRight', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
            </div>
          </>
        )}

        {/* Hood / Bonnet / Frunk */}
        <div className="space-y-1 pt-1 border-t border-[#27272A]">
          <div className="flex items-center justify-between text-zinc-300">
            <span>{hoodLabel}</span>
            <button
              onClick={() => toggleAperture('hood')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                openingState.hood > 0.05
                  ? 'bg-cyan-950/60 text-[#00F0FF] border border-cyan-800'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {Math.round(openingState.hood * 100)}%
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={openingState.hood}
            onChange={e => handleSliderChange('hood', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
          />
        </div>

        {/* Boot / Trunk / Rear Clamshell */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-zinc-300">
            <span>{bootLabel}</span>
            <button
              onClick={() => toggleAperture('boot')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                openingState.boot > 0.05
                  ? 'bg-cyan-950/60 text-[#00F0FF] border border-cyan-800'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {Math.round(openingState.boot * 100)}%
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={openingState.boot}
            onChange={e => handleSliderChange('boot', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
          />
        </div>
      </div>

      {/* Interior & Component Camera Focus Shortcuts */}
      <div className="bg-[#12141A] border border-[#27272A] rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
          <Camera className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>Interior & Engine View Focus</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {[
            { id: 'cockpit' as CameraPreset, label: 'Cockpit View' },
            { id: 'driver_seat' as CameraPreset, label: 'Driver Seat' },
            { id: 'dashboard' as CameraPreset, label: 'Dashboard & Cluster' },
            { id: 'engine_bay' as CameraPreset, label: 'Engine Bay' },
            { id: 'boot' as CameraPreset, label: 'Cargo & Trunk' },
            { id: 'isometric' as CameraPreset, label: 'Exterior 3/4' }
          ].map(cam => (
            <button
              key={cam.id}
              onClick={() => setCameraPreset(cam.id)}
              className={`py-1.5 px-2 rounded text-[11px] font-medium border transition-all text-left flex items-center justify-between ${
                cameraPreset === cam.id
                  ? 'bg-cyan-950/60 text-[#00F0FF] border-[#00F0FF]'
                  : 'bg-[#18181B] text-zinc-300 border-[#27272A] hover:border-zinc-500'
              }`}
            >
              <span>{cam.label}</span>
              {cameraPreset === cam.id && <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
