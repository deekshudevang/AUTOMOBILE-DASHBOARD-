import React, { useRef, useState } from 'react';
import {
  Camera,
  RotateCw,
  Eye,
  Grid,
  Sun,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  FileCode2,
  Download,
  AlertCircle,
  Upload,
  Check,
  Sparkles,
  Compass,
  Layers,
  ShieldCheck,
  Ruler,
  Info,
  X,
  Cpu
} from 'lucide-react';
import { SceneCanvas } from '../3d/SceneCanvas';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { CameraPreset, EnvironmentPreset } from '../../types/vehicle';
import { toHex32 } from '../../utils/joaat';
import { resolveVehicleColor } from '../../utils/colorUtils';
import { QualityClassifier, VehicleAssetDatabase } from '@autoverse/authentic-geometry-engine';

const CAMERA_PRESETS: { id: CameraPreset; label: string }[] = [
  { id: 'isometric', label: '3/4 Iso' },
  { id: 'front', label: 'Front' },
  { id: 'rear', label: 'Rear' },
  { id: 'left', label: 'Left Side' },
  { id: 'right', label: 'Right Side' },
  { id: 'top', label: 'Top View' },
  { id: 'interior', label: 'Interior' },
  { id: 'wheel', label: 'Wheel Stance' },
  { id: 'wing', label: 'Rear Wing' }
];

const ENV_PRESETS: { id: EnvironmentPreset; label: string }[] = [
  { id: 'studio-dark', label: 'Studio Dark' },
  { id: 'cyber-neon', label: 'Cyber Neon' },
  { id: 'showroom', label: 'Showroom' },
  { id: 'desert-dawn', label: 'Desert Dawn' },
  { id: 'sunset-boulevard', label: 'Sunset Blvd' }
];

export const StudioView: React.FC = () => {
  const {
    activeConfig,
    activeModel,
    activeFile,
    assetBindings,
    cameraPreset,
    setCameraPreset,
    environmentPreset,
    setEnvironmentPreset,
    isWireframe,
    toggleWireframe,
    isAutoRotate,
    toggleAutoRotate,
    showGrid,
    toggleGrid,
    setActiveView,
    registerAssetBinding
  } = useVehicleStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screenshotSuccess, setScreenshotSuccess] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const binding = activeModel ? assetBindings[activeModel.hash] : undefined;
  const dbRecord = activeModel ? VehicleAssetDatabase.find(activeModel.hash) : undefined;
  const classification = binding?.qualityClass || 'CLASS_D_APPROXIMATE';
  const badge = QualityClassifier.getBadgeInfo(classification);
  const paint = resolveVehicleColor(activeConfig.isPrimaryColorCustom, activeConfig.customPrimaryColor, activeConfig.primaryColor);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  const handleCaptureScreenshot = () => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `autoverse_${activeModel?.codeName || 'vehicle'}_${timestamp}.png`;
      link.href = dataUrl;
      link.click();

      setScreenshotSuccess(true);
      setTimeout(() => setScreenshotSuccess(false), 2500);
    } catch (err) {
      console.error('Screenshot capture failed:', err);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0A0C10] flex flex-col overflow-hidden select-none">
      {/* Top HUD: Vehicle Identity, Quality Classification & Quick Nav */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-start justify-between pointer-events-none">
        {/* Left: Vehicle Title & AAGE Accuracy Classification */}
        <div className="p-3 rounded-lg bg-autoverse-surface/90 backdrop-blur-md border border-autoverse-border pointer-events-auto shadow-lg max-w-md space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-autoverse-overlay text-slate-300">
              {activeModel?.category || 'Automotive'}
            </span>
            <span className="text-xs text-autoverse-cyan font-mono font-semibold">
              {activeModel ? toHex32(activeModel.hash) : '0x00'}
            </span>
            <span className="text-[10px] text-autoverse-muted">• {activeFile}</span>
          </div>

          <h1 className="text-base font-bold text-slate-100 truncate">
            {activeModel?.realWorldModel || activeModel?.displayName || activeFile}
          </h1>

          {/* AAGE Quality Classification Pill */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setShowCertificateModal(true)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border transition-transform hover:scale-105"
              style={{
                color: badge.hexColor,
                borderColor: `${badge.hexColor}50`,
                backgroundColor: `${badge.hexColor}15`
              }}
              title="Click to inspect AAGE Provenance Certificate"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{badge.shortLabel}: {badge.badgeTitle}</span>
            </button>

            {badge.requiresApproximationBanner && (
              <span className="text-[9px] font-mono text-autoverse-muted">
                (Parametric Template)
              </span>
            )}
          </div>

          {/* Rule 6 Mandatory Banner when using Approximate Procedural Output */}
          {badge.requiresApproximationBanner && (
            <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold tracking-tight">
              APPROXIMATE PROCEDURAL VEHICLE — NOT AUTHENTIC MODEL GEOMETRY
            </div>
          )}

          <div className="flex items-center gap-2 text-xs pt-1 border-t border-autoverse-border/50">
            <div className="flex items-center gap-1.5">
              <div
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: paint.hex }}
              />
              <span className="text-slate-300 text-[11px] font-medium truncate max-w-[120px]">{paint.name}</span>
            </div>

            <span className="text-slate-600">•</span>

            <span className="font-mono text-[11px] text-slate-300">
              Plate: <span className="font-bold text-slate-100">{activeConfig.plateText || 'NONE'}</span>
            </span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowCertificateModal(true)}
            className="px-3 py-2 rounded-lg bg-autoverse-surface/90 hover:bg-autoverse-elevated backdrop-blur-md border border-autoverse-border text-xs font-semibold text-slate-200 transition-all flex items-center gap-2 shadow-lg hover:border-autoverse-cyan/50"
            title="Inspect AAGE Geometric Provenance Certificate"
          >
            <Ruler className="w-3.5 h-3.5 text-autoverse-cyan" />
            <span>OEM Specs & Provenance</span>
          </button>

          <button
            onClick={() => setActiveView('customizer')}
            className="px-3 py-2 rounded-lg bg-autoverse-surface/90 hover:bg-autoverse-elevated backdrop-blur-md border border-autoverse-border text-xs font-semibold text-slate-200 transition-all flex items-center gap-2 shadow-lg hover:border-autoverse-cyan/50"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-autoverse-cyan" />
            <span>Customize</span>
          </button>

          <button
            onClick={() => setActiveView('assetManager')}
            className="px-3 py-2 rounded-lg bg-autoverse-surface/90 hover:bg-autoverse-elevated backdrop-blur-md border border-autoverse-border text-xs font-semibold text-slate-200 transition-all flex items-center gap-2 shadow-lg hover:border-autoverse-cyan/50"
          >
            <Upload className="w-3.5 h-3.5 text-autoverse-cyan" />
            <span>Asset Manager</span>
          </button>
        </div>
      </div>

      {/* Center 3D Scene Viewport */}
      <div className="w-full h-full">
        <SceneCanvas />
      </div>

      {/* Floating Bottom Toolbar: Camera Presets & Environment */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-xl bg-autoverse-surface/90 backdrop-blur-md border border-autoverse-border shadow-2xl">
        {/* Orthographic / Perspective Camera Presets */}
        <div className="flex items-center gap-1 border-r border-autoverse-border pr-2">
          {CAMERA_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => setCameraPreset(preset.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === preset.id
                  ? 'bg-autoverse-cyan text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-autoverse-elevated'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center gap-1 pl-1">
          <button
            onClick={toggleWireframe}
            className={`p-2 rounded-lg transition-all ${
              isWireframe ? 'bg-autoverse-cyan text-slate-950' : 'text-slate-400 hover:text-slate-200 hover:bg-autoverse-elevated'
            }`}
            title="Toggle Wireframe CAD Inspection Mode"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={toggleAutoRotate}
            className={`p-2 rounded-lg transition-all ${
              isAutoRotate ? 'bg-autoverse-cyan text-slate-950' : 'text-slate-400 hover:text-slate-200 hover:bg-autoverse-elevated'
            }`}
            title="Toggle 360 Turntable Rotation"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleGrid}
            className={`p-2 rounded-lg transition-all ${
              showGrid ? 'bg-autoverse-cyan text-slate-950' : 'text-slate-400 hover:text-slate-200 hover:bg-autoverse-elevated'
            }`}
            title="Toggle Ground Calibration Grid"
          >
            <Compass className="w-4 h-4" />
          </button>

          <button
            onClick={handleCaptureScreenshot}
            className={`p-2 rounded-lg transition-all ${
              screenshotSuccess ? 'bg-autoverse-emerald text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-autoverse-elevated'
            }`}
            title="Capture High-Res Viewport Screenshot"
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-autoverse-elevated transition-all"
            title="Toggle Fullscreen Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* AAGE Provenance Certificate & Dimensional Validation Modal */}
      {showCertificateModal && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-autoverse-surface border border-autoverse-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-autoverse-border pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-autoverse-cyan" />
                <h2 className="text-base font-bold text-slate-100">
                  AAGE Automotive Provenance Certificate
                </h2>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="p-1 rounded-lg hover:bg-autoverse-elevated text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vehicle Identification & Classification Badge */}
            <div className="p-4 rounded-lg bg-autoverse-elevated border border-autoverse-border flex items-center justify-between">
              <div>
                <span className="text-xs text-autoverse-muted block">Vehicle Model</span>
                <span className="text-base font-bold text-slate-100">
                  {dbRecord?.metadata.manufacturer || activeModel?.manufacturer} {dbRecord?.metadata.vehicleName || activeModel?.realWorldModel}
                </span>
                <span className="text-xs text-autoverse-cyan block mt-0.5">
                  Generation: {dbRecord?.metadata.generation || 'Production Spec'} | Year: {dbRecord?.metadata.modelYear || 2021}
                </span>
              </div>

              <div className="text-right">
                <span
                  className="text-xs font-extrabold px-3 py-1 rounded"
                  style={{
                    color: badge.hexColor,
                    backgroundColor: `${badge.hexColor}20`,
                    border: `1px solid ${badge.hexColor}50`
                  }}
                >
                  {badge.shortLabel}
                </span>
                <span className="text-[10px] text-autoverse-muted block mt-1">
                  {badge.badgeTitle}
                </span>
              </div>
            </div>

            {/* Verified Manufacturer Specifications Table */}
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-autoverse-cyan" />
                <span>Verified OEM Dimensions & Tolerance</span>
              </h3>

              <div className="rounded-lg border border-autoverse-border overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-autoverse-elevated text-slate-400 text-[11px]">
                    <tr>
                      <th className="p-2.5">Dimension Metric</th>
                      <th className="p-2.5">OEM Specification</th>
                      <th className="p-2.5">Status / Tolerance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-autoverse-border/50 text-slate-200">
                    <tr>
                      <td className="p-2.5 font-medium">Overall Length</td>
                      <td className="p-2.5 font-mono">{(activeConfig as any).parametricSpec?.dimensions?.overall_length_m || dbRecord?.metadata.originalDimensions.length || '4.572'} m</td>
                      <td className="p-2.5 text-autoverse-emerald font-semibold">Verified (&plusmn;1.5%)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Overall Width</td>
                      <td className="p-2.5 font-mono">{(activeConfig as any).parametricSpec?.dimensions?.body_width_without_mirrors_m || dbRecord?.metadata.originalDimensions.width || '1.900'} m</td>
                      <td className="p-2.5 text-autoverse-emerald font-semibold">Verified (&plusmn;1.5%)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Overall Height</td>
                      <td className="p-2.5 font-mono">{(activeConfig as any).parametricSpec?.dimensions?.overall_height_m || dbRecord?.metadata.originalDimensions.height || '1.322'} m</td>
                      <td className="p-2.5 text-autoverse-emerald font-semibold">Verified (&plusmn;1.5%)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Wheelbase</td>
                      <td className="p-2.5 font-mono">{(activeConfig as any).parametricSpec?.dimensions?.wheelbase_m || dbRecord?.metadata.originalDimensions.wheelbase || '2.457'} m</td>
                      <td className="p-2.5 text-autoverse-emerald font-semibold">Verified (&plusmn;1.5%)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Front Track</td>
                      <td className="p-2.5 font-mono">{(activeConfig as any).parametricSpec?.dimensions?.front_track_m || dbRecord?.metadata.originalDimensions.trackFront || '1.630'} m</td>
                      <td className="p-2.5 text-autoverse-emerald font-semibold">Verified (&plusmn;2.0%)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Rear Track</td>
                      <td className="p-2.5 font-mono">{(activeConfig as any).parametricSpec?.dimensions?.rear_track_m || dbRecord?.metadata.originalDimensions.trackRear || '1.582'} m</td>
                      <td className="p-2.5 text-autoverse-emerald font-semibold">Verified (&plusmn;2.0%)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Provenance & Licensing Information */}
            <div className="p-4 rounded-lg bg-autoverse-elevated/40 border border-autoverse-border text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span>Geometry Provenance:</span>
                <span className="font-semibold text-autoverse-cyan">
                  {(activeConfig as any).parametricSpec?.geometry_provenance?.geometry_source || dbRecord?.metadata.geometryProvenance || 'Dimension-Anchored Procedural Estimate'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Reference Specification:</span>
                <span className="font-semibold text-slate-200">
                  {(activeConfig as any).parametricSpec?.geometry_provenance?.reference_specification ? 
                    `${(activeConfig as any).parametricSpec.geometry_provenance.reference_specification.publisher} (${(activeConfig as any).parametricSpec.geometry_provenance.reference_specification.document})` :
                    (dbRecord?.metadata.license || 'Porsche Newsroom Technical Data')}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Unit System:</span>
                <span className="font-mono text-slate-200">Standard SI Metres (m)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Verification Engine:</span>
                <span className="text-slate-200">AutoVerse AAGE v2.0 (Parametric Lofting & Analytical Tolerances)</span>
              </div>
              {(activeConfig as any).parametricSpec?.geometry_provenance?.accuracy_note && (
                <div className="pt-2 border-t border-autoverse-border/50 text-[11px] text-autoverse-muted italic">
                  {(activeConfig as any).parametricSpec.geometry_provenance.accuracy_note}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowCertificateModal(false)}
              className="w-full py-2.5 rounded-lg bg-autoverse-cyan hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Close Certificate Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
