import React, { useMemo, useState, useRef, useEffect } from 'react';
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
  Car,
  Maximize2,
  CheckCircle2,
  Sparkle
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

  const [isAnimating, setIsAnimating] = useState<'opening' | 'closing' | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

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

  const is4Door = openingConfig.doorCount === 4;

  // Aperture Status Analysis
  const apertureStatus = useMemo(() => {
    if (isAnimating === 'opening') return { text: 'Opening All...', color: 'text-[#00F0FF]', bg: 'bg-cyan-950/70 border-cyan-800' };
    if (isAnimating === 'closing') return { text: 'Closing All...', color: 'text-amber-400', bg: 'bg-amber-950/70 border-amber-800' };

    const vals = [
      openingState.doorFrontLeft,
      openingState.doorFrontRight,
      openingState.hood,
      openingState.boot,
      ...(is4Door ? [openingState.doorRearLeft, openingState.doorRearRight] : [])
    ];

    const allOpen = vals.every(v => v >= 0.95);
    const allClosed = vals.every(v => v <= 0.05);

    if (allOpen) {
      return { text: 'Everything Open', color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800' };
    }
    if (allClosed) {
      return { text: 'Everything Closed', color: 'text-zinc-400', bg: 'bg-[#181E29] border-[#273244]' };
    }
    return { text: 'Partially Open', color: 'text-cyan-300', bg: 'bg-cyan-950/50 border-cyan-800/80' };
  }, [openingState, is4Door, isAnimating]);

  // Smooth Animated Open Everything
  const handleAnimatedOpenEverything = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    setIsAnimating('opening');
    setCameraPreset('full_inspection');

    const start = performance.now();
    const duration = 750; // ms

    const initial = { ...openingState };
    const target = {
      doorFrontLeft: 1.0,
      doorFrontRight: 1.0,
      doorRearLeft: is4Door ? 1.0 : 0.0,
      doorRearRight: is4Door ? 1.0 : 0.0,
      hood: 1.0,
      boot: 1.0
    };

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setOpeningState({
        doorFrontLeft: initial.doorFrontLeft + (target.doorFrontLeft - initial.doorFrontLeft) * ease,
        doorFrontRight: initial.doorFrontRight + (target.doorFrontRight - initial.doorFrontRight) * ease,
        doorRearLeft: initial.doorRearLeft + (target.doorRearLeft - initial.doorRearLeft) * ease,
        doorRearRight: initial.doorRearRight + (target.doorRearRight - initial.doorRearRight) * ease,
        hood: initial.hood + (target.hood - initial.hood) * ease,
        boot: initial.boot + (target.boot - initial.boot) * ease
      });

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        openAllApertures();
        setIsAnimating(null);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  // Smooth Animated Close Everything
  const handleAnimatedCloseEverything = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    setIsAnimating('closing');

    const start = performance.now();
    const duration = 750; // ms

    const initial = { ...openingState };

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setOpeningState({
        doorFrontLeft: initial.doorFrontLeft * (1 - ease),
        doorFrontRight: initial.doorFrontRight * (1 - ease),
        doorRearLeft: initial.doorRearLeft * (1 - ease),
        doorRearRight: initial.doorRearRight * (1 - ease),
        hood: initial.hood * (1 - ease),
        boot: initial.boot * (1 - ease)
      });

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        closeAllApertures();
        setIsAnimating(null);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

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
        return 'Conventional Side Door';
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
    <div className="space-y-4 text-xs select-none">
      {/* Header Info Card */}
      <div className="bg-[#121620] border border-[#232936] rounded-xl p-3.5 space-y-2.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-zinc-100">
            <div className="w-6 h-6 rounded-md bg-cyan-950/80 border border-cyan-800 flex items-center justify-center">
              <DoorOpen className="w-3.5 h-3.5 text-[#00F0FF]" />
            </div>
            <span className="text-sm">Vehicle Access & Kinematics</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${apertureStatus.bg} ${apertureStatus.color}`}>
              {apertureStatus.text}
            </span>
          </div>
        </div>

        {/* Mechanism & Powertrain Telemetry */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#232936] text-[11px]">
          <div className="p-2 rounded-lg bg-[#0E1117] border border-[#1E2533] space-y-0.5">
            <span className="text-[10px] text-zinc-500 block uppercase font-mono">Door Kinematics</span>
            <span className="font-semibold text-cyan-300 capitalize truncate block">
              {openingConfig.doorMechanism.replace(/_/g, ' ')} ({openingConfig.doorCount}-Door)
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#0E1117] border border-[#1E2533] space-y-0.5">
            <span className="text-[10px] text-zinc-500 block uppercase font-mono">Powertrain Arch</span>
            <span className="font-semibold text-zinc-200 truncate block">
              {engineSpec.archetype.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* PROMINENT ONE-CLICK MASTER BUTTONS */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={handleAnimatedOpenEverything}
          disabled={isAnimating !== null}
          className="relative group flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-950/80 to-[#121620] hover:from-[#00F0FF]/20 hover:to-cyan-950/60 border border-[#00F0FF]/50 hover:border-[#00F0FF] text-cyan-100 font-bold transition-all duration-200 shadow-lg shadow-cyan-950/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          <DoorOpen className="w-4 h-4 text-[#00F0FF] group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <span className="block text-xs font-extrabold tracking-wide text-[#00F0FF]">OPEN EVERYTHING</span>
            <span className="block text-[9px] text-zinc-400 font-normal">All Doors, Hood & Boot</span>
          </div>
        </button>

        <button
          onClick={handleAnimatedCloseEverything}
          disabled={isAnimating !== null}
          className="relative group flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#141822] hover:bg-[#1A202C] border border-[#273244] hover:border-zinc-500 text-zinc-200 font-bold transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          <DoorClosed className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <span className="block text-xs font-extrabold tracking-wide text-zinc-200">CLOSE EVERYTHING</span>
            <span className="block text-[9px] text-zinc-400 font-normal">Reset to Driving Spec</span>
          </div>
        </button>
      </div>

      {/* Individual Aperture Sliders & Toggles */}
      <div className="bg-[#121620] border border-[#232936] rounded-xl p-3.5 space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
            Individual Aperture Controls
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            Direct Kinematic Servos
          </span>
        </div>

        {/* Front Left Door */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="font-medium">{doorLabel} (L)</span>
            <button
              onClick={() => toggleAperture('doorFrontLeft')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors font-bold ${
                openingState.doorFrontLeft > 0.05
                  ? 'bg-cyan-950/80 text-[#00F0FF] border border-cyan-700'
                  : 'bg-[#181E29] text-zinc-400 hover:text-zinc-200 border border-[#232936]'
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
            className="w-full h-1.5 bg-[#181E2B] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
          />
        </div>

        {/* Front Right Door */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="font-medium">{doorLabel} (R)</span>
            <button
              onClick={() => toggleAperture('doorFrontRight')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors font-bold ${
                openingState.doorFrontRight > 0.05
                  ? 'bg-cyan-950/80 text-[#00F0FF] border border-cyan-700'
                  : 'bg-[#181E29] text-zinc-400 hover:text-zinc-200 border border-[#232936]'
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
            className="w-full h-1.5 bg-[#181E2B] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
          />
        </div>

        {/* Rear Doors for 4-Door Vehicles (Evo IX, WRX STI, S-Class, etc.) */}
        {is4Door && (
          <>
            <div className="space-y-1 pt-1 border-t border-[#1E2533]">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="font-medium">Rear Passenger Door (L)</span>
                <button
                  onClick={() => toggleAperture('doorRearLeft')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors font-bold ${
                    openingState.doorRearLeft > 0.05
                      ? 'bg-cyan-950/80 text-[#00F0FF] border border-cyan-700'
                      : 'bg-[#181E29] text-zinc-400 hover:text-zinc-200 border border-[#232936]'
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
                className="w-full h-1.5 bg-[#181E2B] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="font-medium">Rear Passenger Door (R)</span>
                <button
                  onClick={() => toggleAperture('doorRearRight')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors font-bold ${
                    openingState.doorRearRight > 0.05
                      ? 'bg-cyan-950/80 text-[#00F0FF] border border-cyan-700'
                      : 'bg-[#181E29] text-zinc-400 hover:text-zinc-200 border border-[#232936]'
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
                className="w-full h-1.5 bg-[#181E2B] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
            </div>
          </>
        )}

        {/* Hood / Bonnet / Frunk */}
        <div className="space-y-1 pt-1 border-t border-[#1E2533]">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="font-medium">{hoodLabel}</span>
            <button
              onClick={() => toggleAperture('hood')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors font-bold ${
                openingState.hood > 0.05
                  ? 'bg-cyan-950/80 text-[#00F0FF] border border-cyan-700'
                  : 'bg-[#181E29] text-zinc-400 hover:text-zinc-200 border border-[#232936]'
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
            className="w-full h-1.5 bg-[#181E2B] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
          />
        </div>

        {/* Boot / Trunk / Rear Clamshell */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="font-medium">{bootLabel}</span>
            <button
              onClick={() => toggleAperture('boot')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors font-bold ${
                openingState.boot > 0.05
                  ? 'bg-cyan-950/80 text-[#00F0FF] border border-cyan-700'
                  : 'bg-[#181E29] text-zinc-400 hover:text-zinc-200 border border-[#232936]'
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
            className="w-full h-1.5 bg-[#181E2B] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
          />
        </div>
      </div>

      {/* Camera Inspection Presets */}
      <div className="bg-[#121620] border border-[#232936] rounded-xl p-3.5 space-y-2.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-zinc-300">
            <Camera className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Inspection View Angles</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">Auto Target</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            { id: 'full_inspection' as CameraPreset, label: 'Full Inspection' },
            { id: 'cockpit' as CameraPreset, label: 'Cockpit View' },
            { id: 'dashboard' as CameraPreset, label: 'Dashboard' },
            { id: 'engine_bay' as CameraPreset, label: 'Engine Bay' },
            { id: 'boot' as CameraPreset, label: 'Cargo & Boot' },
            { id: 'isometric' as CameraPreset, label: 'Exterior 3/4' }
          ].map(cam => (
            <button
              key={cam.id}
              onClick={() => setCameraPreset(cam.id)}
              className={`py-2 px-2.5 rounded-lg text-[11px] font-medium border transition-all text-left flex items-center justify-between ${
                cameraPreset === cam.id
                  ? 'bg-cyan-950/80 text-[#00F0FF] border-[#00F0FF] shadow-sm'
                  : 'bg-[#141822] text-zinc-300 border-[#232936] hover:border-zinc-500'
              }`}
            >
              <span className="truncate">{cam.label}</span>
              {cameraPreset === cam.id && <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shrink-0 ml-1" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
