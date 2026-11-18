import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Layers,
  Maximize2,
  Minimize2,
  Compass
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';

export const ComponentEditorView: React.FC = () => {
  const { engineeringMode, selectedComponentId } = useVehicleStore();

  const [componentName, setComponentName] = useState<string>('Swan-Neck Dual-Element Rear Wing');
  const [span, setSpan] = useState<number>(1.72); // meters
  const [chord, setChord] = useState<number>(0.32); // meters
  const [aoa, setAoa] = useState<number>(10.5); // degrees
  const [endplateHeight, setEndplateHeight] = useState<number>(0.28); // meters
  const [mountHeight, setMountHeight] = useState<number>(0.35); // meters
  const [mirrorSymmetry, setMirrorSymmetry] = useState<boolean>(true);

  // Computed parameters
  const wingArea = (span * chord).toFixed(3);
  const estimatedAspect = (span / chord).toFixed(2);
  const isWithinEnvelope = span <= 1.85 && span >= 1.2 && aoa <= 18.0 && aoa >= -2.0;

  const handleReset = () => {
    setSpan(1.72);
    setChord(0.32);
    setAoa(10.5);
    setEndplateHeight(0.28);
    setMountHeight(0.35);
    setMirrorSymmetry(true);
  };

  return (
    <div className="h-full flex flex-col bg-autoverse-bg text-slate-100 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-autoverse-border shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">Component Parametric Editor</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300">
              PARAMETRIC B-REP
            </span>
            {engineeringMode === 'student' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                Student Mode Active
              </span>
            )}
          </div>
          <p className="text-xs text-autoverse-muted mt-1">
            Real-time dimension regeneration, symmetry enforcement, and mounting tolerance envelopes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-autoverse-elevated hover:bg-autoverse-overlay text-slate-300 border border-autoverse-border text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-autoverse-cyan hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Commit Modification</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Parametric Controls Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-5">
            <div className="flex items-center justify-between border-b border-autoverse-border pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-100">{componentName}</h2>
                <p className="text-xs text-autoverse-muted mt-0.5">Component ID: comp_rear_wing_gt3rs</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={mirrorSymmetry}
                  onChange={e => setMirrorSymmetry(e.target.checked)}
                  className="rounded bg-autoverse-elevated border-autoverse-border text-autoverse-cyan focus:ring-0"
                />
                <span>Mirror Across Y=0 (Chassis Centerline)</span>
              </label>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              {/* Span Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Wing Span (b)</span>
                  <span className="font-mono text-autoverse-cyan font-bold">{span.toFixed(3)} m ({Math.round(span * 1000)} mm)</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.01"
                  value={span}
                  onChange={e => setSpan(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Min: 1.00 m</span>
                  <span>FIA Max Envelope: 1.85 m</span>
                  <span>Max: 2.00 m</span>
                </div>
              </div>

              {/* Chord Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Aerofoil Chord (c)</span>
                  <span className="font-mono text-autoverse-cyan font-bold">{chord.toFixed(3)} m ({Math.round(chord * 1000)} mm)</span>
                </div>
                <input
                  type="range"
                  min="0.15"
                  max="0.50"
                  step="0.01"
                  value={chord}
                  onChange={e => setChord(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Min: 0.15 m</span>
                  <span>Max: 0.50 m</span>
                </div>
              </div>

              {/* Angle of Attack Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Angle of Attack (&alpha;)</span>
                  <span className="font-mono text-autoverse-cyan font-bold">{aoa.toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min="-2.0"
                  max="20.0"
                  step="0.5"
                  value={aoa}
                  onChange={e => setAoa(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>-2.0° (Low Drag)</span>
                  <span>14.0° (Critical Stall Threshold)</span>
                  <span>20.0° (Stalled Flow)</span>
                </div>
              </div>

              {/* Endplate Height */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Endplate Vertical Height</span>
                  <span className="font-mono text-autoverse-cyan font-bold">{endplateHeight.toFixed(3)} m</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.45"
                  step="0.01"
                  value={endplateHeight}
                  onChange={e => setEndplateHeight(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              {/* Mount Stanchion Height */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Swan-Neck Stanchion Height</span>
                  <span className="font-mono text-autoverse-cyan font-bold">{mountHeight.toFixed(3)} m</span>
                </div>
                <input
                  type="range"
                  min="0.20"
                  max="0.50"
                  step="0.01"
                  value={mountHeight}
                  onChange={e => setMountHeight(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Validation & Physics Readout Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-autoverse-muted">
              Live Geometry & Clearance Status
            </h3>

            {/* Validation Banner */}
            <div className={`p-3 rounded border flex items-start gap-2.5 ${
              isWithinEnvelope
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-amber-950/40 border-amber-800 text-amber-300'
            }`}>
              {isWithinEnvelope ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <span className="font-semibold block">
                  {isWithinEnvelope ? 'Clearance Envelope Valid' : 'Warning: Regulatory Violation'}
                </span>
                <span className="text-[11px] opacity-90 block mt-0.5">
                  {isWithinEnvelope
                    ? 'All dimensions are within vehicle envelope and FIA packaging rules.'
                    : 'Wing span exceeds maximum body width limit (1.85 m).'}
                </span>
              </div>
            </div>

            {/* Computed Aerodynamic Metrics */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Planform Area ($S$)</span>
                <span className="font-mono font-medium text-slate-200">{wingArea} m²</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Aspect Ratio ($AR$)</span>
                <span className="font-mono font-medium text-slate-200">{estimatedAspect}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Airfoil Profile</span>
                <span className="font-mono font-medium text-autoverse-cyan">Selig S1223</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Mount Datum Anchor</span>
                <span className="font-mono text-[11px] text-emerald-400">datum_rear_deck_mount</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Estimated Mass</span>
                <span className="font-mono font-medium text-slate-200">{(span * chord * 12.5).toFixed(1)} kg</span>
              </div>
            </div>

            {/* Student Explanation */}
            {engineeringMode === 'student' && (
              <div className="p-3 rounded bg-autoverse-elevated border border-autoverse-border text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-autoverse-cyan">🎓 Educational Insight</p>
                <p className="leading-relaxed">
                  Higher angles of attack increase downforce up to ~14°. Beyond that angle, flow separates from the suction side, stalling the wing and causing massive drag without downforce.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
