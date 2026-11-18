import React, { useState } from 'react';
import {
  Activity,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Gauge
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';

export const VehicleDynamicsView: React.FC = () => {
  const { engineeringMode } = useVehicleStore();

  const [frontSpringRateNmm, setFrontSpringRateNmm] = useState<number>(140); // N/mm
  const [rearSpringRateNmm, setRearSpringRateNmm] = useState<number>(160); // N/mm
  const [frontArbStiffness, setFrontArbStiffness] = useState<number>(45); // N/mm
  const [rearArbStiffness, setRearArbStiffness] = useState<number>(35); // N/mm
  const [lateralG, setLateralG] = useState<number>(1.2); // G
  const [brakingG, setBrakingG] = useState<number>(1.0); // G

  // Vehicle Kinematic Metrics
  const vehicleMassKg = 1450;
  const frontWeightDistPct = 42; // Rear-engine GT3 RS: 42/58
  const rearWeightDistPct = 58;

  // Kinematic calculations
  const frontCamberGain = -0.045; // deg/mm bump
  const rearCamberGain = -0.052; // deg/mm bump
  const frontScrubRadiusMm = 8.5; // mm (positive scrub for steering feel)
  const frontRollCenterMm = 65; // mm above ground
  const rearRollCenterMm = 92; // mm above ground

  // Dynamic wheel load transfer during 1.2G cornering
  const frontTrackM = 1.63;
  const rearTrackM = 1.60;
  const cgHeightM = 0.42;

  const latTransferFrontN = (vehicleMassKg * (frontWeightDistPct / 100) * 9.81 * lateralG * cgHeightM) / frontTrackM;
  const latTransferRearN = (vehicleMassKg * (rearWeightDistPct / 100) * 9.81 * lateralG * cgHeightM) / rearTrackM;

  return (
    <div className="h-full flex flex-col bg-autoverse-bg text-slate-100 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-autoverse-border shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">Vehicle Dynamics & Kinematics</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300">
              MULTIBODY KINEMATICS
            </span>
            {engineeringMode === 'student' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                Student Mode Active
              </span>
            )}
          </div>
          <p className="text-xs text-autoverse-muted mt-1">
            Suspension geometry articulation, roll center migration, camber recovery curves, and dynamic contact patch load transfer.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Suspension Setup Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-5">
            <h2 className="text-sm font-bold text-slate-100 border-b border-autoverse-border pb-3">
              Spring & Anti-Roll Bar Stiffness Setup
            </h2>

            {/* Front & Rear Springs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Front Coilover Spring Rate</span>
                  <span className="font-mono text-autoverse-cyan font-bold">{frontSpringRateNmm} N/mm</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="220"
                  step="5"
                  value={frontSpringRateNmm}
                  onChange={e => setFrontSpringRateNmm(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Rear Coilover Spring Rate</span>
                  <span className="font-mono text-autoverse-cyan font-bold">{rearSpringRateNmm} N/mm</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="260"
                  step="5"
                  value={rearSpringRateNmm}
                  onChange={e => setRearSpringRateNmm(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            {/* Anti-Roll Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Front Anti-Roll Bar Stiffness</span>
                  <span className="font-mono text-autoverse-cyan font-bold">{frontArbStiffness} N/mm</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="80"
                  step="5"
                  value={frontArbStiffness}
                  onChange={e => setFrontArbStiffness(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Rear Anti-Roll Bar Stiffness</span>
                  <span className="font-mono text-autoverse-cyan font-bold">{rearArbStiffness} N/mm</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="70"
                  step="5"
                  value={rearArbStiffness}
                  onChange={e => setRearArbStiffness(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            {/* Acceleration G-Force Sliders */}
            <div className="pt-2 border-t border-autoverse-border">
              <h3 className="text-xs font-bold text-slate-200 mb-3">Cornering & Braking Acceleration Test</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Lateral Cornering Acceleration</span>
                    <span className="font-mono text-autoverse-cyan font-bold">{lateralG.toFixed(1)} G</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.8"
                    step="0.1"
                    value={lateralG}
                    onChange={e => setLateralG(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Straight-Line Deceleration</span>
                    <span className="font-mono text-autoverse-cyan font-bold">{brakingG.toFixed(1)} G</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.6"
                    step="0.1"
                    value={brakingG}
                    onChange={e => setBrakingG(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamics Readout Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-autoverse-muted">
              Suspension Kinematic Metrics
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Front Scrub Radius</span>
                <span className="font-mono font-bold text-autoverse-cyan">+{frontScrubRadiusMm} mm</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Front Camber Gain</span>
                <span className="font-mono font-bold text-slate-200">{frontCamberGain} deg/mm</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Rear Camber Gain</span>
                <span className="font-mono font-bold text-slate-200">{rearCamberGain} deg/mm</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Front Roll Center Height</span>
                <span className="font-mono font-bold text-slate-200">{frontRollCenterMm} mm</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Rear Roll Center Height</span>
                <span className="font-mono font-bold text-slate-200">{rearRollCenterMm} mm</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Front Lateral Load Transfer</span>
                <span className="font-mono font-bold text-slate-200">{Math.round(latTransferFrontN)} N</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Rear Lateral Load Transfer</span>
                <span className="font-mono font-bold text-slate-200">{Math.round(latTransferRearN)} N</span>
              </div>
            </div>

            {/* Student Explanation */}
            {engineeringMode === 'student' && (
              <div className="p-3 rounded bg-autoverse-elevated border border-autoverse-border text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-autoverse-cyan">🎓 Scrub Radius & Camber Gain</p>
                <p className="leading-relaxed">
                  Negative camber gain counters body roll during cornering, keeping the tire tread flat against the asphalt. A small positive scrub radius provides clear mechanical feedback through the steering wheel.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
