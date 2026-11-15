import React, { useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCw,
  X,
  Camera,
  Compass,
  Sparkles
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { CameraPreset } from '../../types/vehicle';

const SHOWROOM_CAMERAS: { id: CameraPreset; label: string }[] = [
  { id: 'isometric', label: '3/4 Iso' },
  { id: 'front', label: 'Front' },
  { id: 'left', label: 'Side Profile' },
  { id: 'rear', label: 'Rear Stance' },
  { id: 'wheel', label: 'Wheels' }
];

export const ShowroomOverlay: React.FC = () => {
  const {
    activeConfig,
    activeModel,
    isAutoRotate,
    toggleAutoRotate,
    cameraPreset,
    setCameraPreset,
    setPresentationMode
  } = useVehicleStore();

  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-pause rotation when user interacts with mouse/touch, then resume after 3.5s
  useEffect(() => {
    const handleUserInteraction = () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };

    window.addEventListener('pointerdown', handleUserInteraction);
    return () => {
      window.removeEventListener('pointerdown', handleUserInteraction);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-6">
      {/* Top Left Minimal Identity Pill */}
      <div className="pointer-events-auto flex items-center gap-3 bg-[#0A0C10]/85 backdrop-blur-md border border-[#222A38] rounded-full px-4 py-2 shadow-xl w-fit">
        <div className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse" />
        <div className="text-xs font-semibold text-slate-100 tracking-wide">
          {activeModel?.realWorldModel || activeConfig.modelName || 'Porsche 911 GT3 RS'}
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#12161F] text-[#00F0FF] border border-[#222A38]">
          SHOWROOM CINEMATIC
        </span>
      </div>

      {/* Top Right Exit Showroom Button */}
      <div className="pointer-events-auto self-end">
        <button
          onClick={() => setPresentationMode('studio')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0A0C10]/85 hover:bg-[#1A202C] backdrop-blur-md border border-[#222A38] hover:border-[#00F0FF]/50 text-xs font-semibold text-slate-200 transition-all shadow-xl"
        >
          <X className="w-4 h-4 text-slate-400" />
          <span>Exit Showroom</span>
        </button>
      </div>

      {/* Floating Bottom Center Control Dock */}
      <div className="pointer-events-auto self-center flex items-center gap-3 p-1.5 rounded-2xl bg-[#0A0C10]/90 backdrop-blur-md border border-[#222A38] shadow-2xl">
        {/* Turntable Auto-Rotate Toggle */}
        <button
          onClick={toggleAutoRotate}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isAutoRotate
              ? 'bg-[#00F0FF] text-slate-950 font-bold shadow-sm'
              : 'bg-[#12161F] text-slate-300 hover:text-white'
          }`}
          title={isAutoRotate ? 'Pause 360 Turntable' : 'Resume 360 Turntable'}
        >
          {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isAutoRotate ? 'Turntable Active' : 'Turntable Paused'}</span>
        </button>

        {/* Camera Angles */}
        <div className="flex items-center gap-1 border-l border-[#222A38] pl-2">
          {SHOWROOM_CAMERAS.map(cam => (
            <button
              key={cam.id}
              onClick={() => setCameraPreset(cam.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === cam.id
                  ? 'bg-[#1A202C] text-[#00F0FF] border border-[#00F0FF]/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#12161F]'
              }`}
            >
              {cam.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
