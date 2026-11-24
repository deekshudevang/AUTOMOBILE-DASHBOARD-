import React, { useState } from 'react';
import {
  Compass,
  RotateCw,
  Grid,
  Camera,
  Maximize2,
  Minimize2,
  Eye,
  Box,
  Cpu,
  CircleDot,
  Check
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { useUiStore } from '../../state/useUiStore';
import { CameraPreset } from '../../types/vehicle';
import { playCameraClick, playToggleClick } from '../../utils/audioFeedback';

interface CameraButtonDef {
  id: CameraPreset;
  label: string;
  hotkey: string;
  icon: React.FC<{ className?: string }>;
}

const CAMERA_PRESETS: CameraButtonDef[] = [
  { id: 'isometric', label: '3/4 Iso Studio', hotkey: '1', icon: Box },
  { id: 'front', label: 'Front Fascia', hotkey: '2', icon: Eye },
  { id: 'left', label: 'Side Profile', hotkey: '3', icon: Compass },
  { id: 'rear', label: 'Rear Diffuser & Aero', hotkey: '4', icon: CircleDot },
  { id: 'top', label: 'Top Aero Plane', hotkey: '5', icon: Compass },
  { id: 'cockpit', label: 'Interior Cockpit', hotkey: '6', icon: Eye },
  { id: 'engine_bay', label: 'Engine Bay Plumbing', hotkey: '7', icon: Cpu },
  { id: 'wheel', label: 'Wheel Fitment Stance', hotkey: '8', icon: CircleDot }
];

export const VerticalCameraRail: React.FC = () => {
  const {
    cameraPreset,
    setCameraPreset,
    isWireframe,
    toggleWireframe,
    isAutoRotate,
    toggleAutoRotate,
    showGrid,
    toggleGrid,
    activeModel
  } = useVehicleStore();

  const isOrbitDragging = useUiStore(s => s.isOrbitDragging);
  const [screenshotSuccess, setScreenshotSuccess] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCaptureScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `autoverse_${activeModel?.codeName || 'supercar'}_${timestamp}.png`;
      link.href = dataUrl;
      link.click();

      setScreenshotSuccess(true);
      setTimeout(() => setScreenshotSuccess(false), 2000);
    } catch (err) {
      console.error('Screenshot capture failed:', err);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  return (
    <div
      role="toolbar"
      aria-label="Camera Controls Rail"
      className={`absolute left-3 sm:left-5 phone-landscape:left-2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5 phone-landscape:gap-0.5 p-1.5 phone-landscape:p-1 rounded-2xl phone-landscape:rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-200 select-none phone-landscape-rail ${
        isOrbitDragging ? 'opacity-20 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Camera Presets Stack */}
      <div className="flex flex-col items-center gap-1 phone-landscape:gap-0.5" role="group" aria-label="Camera Presets">
        {CAMERA_PRESETS.map((btn) => {
          const isActive = cameraPreset === btn.id;
          const Icon = btn.icon;

          return (
            <div key={btn.id} className="relative group">
              <button
                role="button"
                onClick={() => {
                  setCameraPreset(btn.id);
                  playCameraClick();
                }}
                className={`w-9 h-9 sm:w-9 sm:h-9 phone-landscape:w-7 phone-landscape:h-7 rounded-xl phone-landscape:rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gt-accent text-white shadow-lg shadow-red-950/40 ring-1 ring-gt-accent'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
                title={`${btn.label} [${btn.hotkey}]`}
                aria-label={`Switch camera to ${btn.label} view (Hotkey ${btn.hotkey})`}
                aria-pressed={isActive}
              >
                <Icon className="w-4 h-4 phone-landscape:w-3.5 phone-landscape:h-3.5" />
              </button>

              {/* Tooltip on hover */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-gt-basalt border border-gt-border text-[11px] font-mono whitespace-nowrap text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-30 flex items-center gap-1.5">
                <span>{btn.label}</span>
                <kbd className="px-1 py-0.2 rounded bg-black/50 text-[10px] text-zinc-400 border border-white/10">
                  {btn.hotkey}
                </kbd>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-5 phone-landscape:w-4 h-[1px] bg-white/10 my-0.5 phone-landscape:my-0" aria-hidden="true" />

      {/* Auxiliary Studio Tools */}
      <div className="flex flex-col items-center gap-1 phone-landscape:gap-0.5" role="group" aria-label="Studio Viewport Utilities">
        {/* Turntable Rotation */}
        <div className="relative group">
          <button
            role="button"
            onClick={() => {
              toggleAutoRotate();
              playToggleClick();
            }}
            className={`w-9 h-9 sm:w-9 sm:h-9 phone-landscape:w-7 phone-landscape:h-7 rounded-xl phone-landscape:rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isAutoRotate
                ? 'bg-gt-accent text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle 360° Turntable Rotation"
            aria-label="Toggle 360-degree turntable rotation"
            aria-pressed={isAutoRotate}
          >
            <RotateCw className="w-4 h-4 phone-landscape:w-3.5 phone-landscape:h-3.5" />
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-gt-basalt border border-gt-border text-[11px] font-mono whitespace-nowrap text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-30">
            Turntable Rotation
          </div>
        </div>

        {/* Wireframe Inspection */}
        <div className="relative group">
          <button
            role="button"
            onClick={() => {
              toggleWireframe();
              playToggleClick();
            }}
            className={`w-9 h-9 sm:w-9 sm:h-9 phone-landscape:w-7 phone-landscape:h-7 rounded-xl phone-landscape:rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isWireframe
                ? 'bg-gt-accent text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Wireframe CAD Mode"
            aria-label="Toggle wireframe inspection mode"
            aria-pressed={isWireframe}
          >
            <Grid className="w-4 h-4 phone-landscape:w-3.5 phone-landscape:h-3.5" />
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-gt-basalt border border-gt-border text-[11px] font-mono whitespace-nowrap text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-30">
            Wireframe Inspection
          </div>
        </div>

        {/* Screenshot */}
        <div className="relative group">
          <button
            role="button"
            onClick={handleCaptureScreenshot}
            className={`w-9 h-9 sm:w-9 sm:h-9 phone-landscape:w-7 phone-landscape:h-7 rounded-xl phone-landscape:rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              screenshotSuccess
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title="Capture Viewport Screenshot"
            aria-label="Capture viewport screenshot"
          >
            {screenshotSuccess ? (
              <Check className="w-4 h-4 phone-landscape:w-3.5 phone-landscape:h-3.5" />
            ) : (
              <Camera className="w-4 h-4 phone-landscape:w-3.5 phone-landscape:h-3.5" />
            )}
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-gt-basalt border border-gt-border text-[11px] font-mono whitespace-nowrap text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-30">
            {screenshotSuccess ? 'Captured!' : 'Capture Screenshot'}
          </div>
        </div>

        {/* Fullscreen */}
        <div className="relative group">
          <button
            role="button"
            onClick={toggleFullscreen}
            className="w-9 h-9 sm:w-9 sm:h-9 phone-landscape:w-7 phone-landscape:h-7 rounded-xl phone-landscape:rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Toggle Fullscreen"
            aria-label={isFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'}
            aria-pressed={isFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 phone-landscape:w-3.5 phone-landscape:h-3.5" />
            ) : (
              <Maximize2 className="w-4 h-4 phone-landscape:w-3.5 phone-landscape:h-3.5" />
            )}
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-gt-basalt border border-gt-border text-[11px] font-mono whitespace-nowrap text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-30">
            Toggle Fullscreen
          </div>
        </div>
      </div>
    </div>
  );
};
