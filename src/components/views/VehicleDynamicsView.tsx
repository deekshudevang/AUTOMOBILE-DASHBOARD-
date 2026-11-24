import React, { useState, useMemo } from 'react';
import {
  Activity,
  Gauge,
  TrendingUp,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { AeroDynamicsCoupler, VehicleDynamicsInput } from '../../simulation/dynamics/aeroDynamicsCoupler';
import { TechnicalSlider } from '../ui/TechnicalSlider';

export const VehicleDynamicsView: React.FC = () => {
  const { engineeringMode, activeModel } = useVehicleStore();

  // Suspension setup
  const [frontSpringRateNmm, setFrontSpringRateNmm] = useState<number>(140); // N/mm
  const [rearSpringRateNmm, setRearSpringRateNmm] = useState<number>(160); // N/mm
  const [frontArbStiffness, setFrontArbStiffness] = useState<number>(45); // N/mm
  const [rearArbStiffness, setRearArbStiffness] = useState<number>(35); // N/mm
  const [lateralG, setLateralG] = useState<number>(1.2); // G
  const [brakingG, setBrakingG] = useState<number>(1.0); // G

  // Aero coupling parameters
  const [cd, setCd] = useState<number>(0.384);
  const [clFront, setClFront] = useState<number>(-0.152);
  const [clRear, setClRear] = useState<number>(-0.276);
  const [tireMu, setTireMu] = useState<number>(1.35); // Michelin Pilot Sport Cup 2 R
  const [selectedSpeedKmh, setSelectedSpeedKmh] = useState<number>(200);

  // Active tab: 'kinematics' | 'aero-coupling'
  const [activeTab, setActiveTab] = useState<'kinematics' | 'aero-coupling'>('aero-coupling');

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

  // Aero Dynamics Coupling Calculation
  const aeroInput: VehicleDynamicsInput = useMemo(() => ({
    massKg: vehicleMassKg,
    wheelbaseM: 2.457,
    frontTrackM: frontTrackM,
    rearTrackM: rearTrackM,
    cgHeightM: cgHeightM,
    staticWeightFrontPct: frontWeightDistPct,
    tireFrictionCoeffMu: tireMu,
    frontSpringRateNPerM: frontSpringRateNmm * 1000,
    rearSpringRateNPerM: rearSpringRateNmm * 1000,
    frontalAreaM2: 2.12,
    cd: cd,
    clFront: clFront,
    clRear: clRear
  }), [frontSpringRateNmm, rearSpringRateNmm, cd, clFront, clRear, tireMu]);

  const couplingReport = useMemo(() => {
    return AeroDynamicsCoupler.evaluateDynamicsCoupling(aeroInput);
  }, [aeroInput]);

  // Interpolated point for selected speed
  const currentSpeedPoint = useMemo(() => {
    const sweep = couplingReport.speedSweep;
    const closest = sweep.reduce((prev, curr) =>
      Math.abs(curr.velocityKmh - selectedSpeedKmh) < Math.abs(prev.velocityKmh - selectedSpeedKmh) ? curr : prev
    );
    return closest;
  }, [couplingReport, selectedSpeedKmh]);

  return (
    <div className="h-full flex flex-col bg-gt-obsidian text-zinc-100 overflow-hidden select-none font-sans">
      {/* 1. Header Toolbar */}
      <header className="h-14 px-6 bg-gt-basalt/80 border-b border-gt-border backdrop-blur-xl flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gt-accent/15 border border-gt-accent/30 flex items-center justify-center text-gt-accent">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-heading font-bold text-white tracking-wide">
                VEHICLE DYNAMICS & AERO COUPLING
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 border border-gt-border text-gt-accent font-bold">
                MULTIBODY TELEMETRY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-bold">
                TIRE μ = {tireMu}
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400">
              Coupled aero downforce normal load, suspension deflection, roll-center kinematics, and high-speed grip
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-black/40 border border-gt-border rounded-lg p-0.5 text-xs font-mono">
          <button
            onClick={() => setActiveTab('aero-coupling')}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              activeTab === 'aero-coupling'
                ? 'bg-gt-accent text-white font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Aero Load Coupling
          </button>
          <button
            onClick={() => setActiveTab('kinematics')}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              activeTab === 'kinematics'
                ? 'bg-gt-accent text-white font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Suspension Kinematics
          </button>
        </div>
      </header>

      {/* 2. Main Workstation Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Parameter Adjustment Blade (320px) */}
        <div className="w-80 bg-gt-basalt/60 border-r border-gt-border p-4 space-y-5 overflow-y-auto shrink-0 font-mono">
          {activeTab === 'aero-coupling' ? (
            <>
              <div className="space-y-3">
                <h3 className="text-xs font-heading font-bold text-zinc-300 uppercase tracking-wider">
                  Coupling Parameters
                </h3>
                <TechnicalSlider
                  label="Speed Sweep Point"
                  value={selectedSpeedKmh}
                  min={50}
                  max={320}
                  step={10}
                  unit="km/h"
                  onChange={setSelectedSpeedKmh}
                />
                <TechnicalSlider
                  label="Tire Friction Coeff (μ)"
                  value={tireMu}
                  min={0.8}
                  max={1.8}
                  step={0.05}
                  unit="mu"
                  onChange={setTireMu}
                />
              </div>

              <div className="pt-2 border-t border-gt-border space-y-3">
                <h3 className="text-xs font-heading font-bold text-zinc-300 uppercase tracking-wider">
                  Aerodynamic Coefficients
                </h3>
                <TechnicalSlider
                  label="Drag Coefficient (Cd)"
                  value={cd}
                  min={0.25}
                  max={0.55}
                  step={0.01}
                  unit="Cd"
                  onChange={setCd}
                />
                <TechnicalSlider
                  label="Front Lift Coeff (Cl_F)"
                  value={Math.abs(clFront)}
                  min={0.05}
                  max={0.4}
                  step={0.01}
                  unit="Cl"
                  onChange={(v) => setClFront(-v)}
                />
                <TechnicalSlider
                  label="Rear Lift Coeff (Cl_R)"
                  value={Math.abs(clRear)}
                  min={0.1}
                  max={0.6}
                  step={0.01}
                  unit="Cl"
                  onChange={(v) => setClRear(-v)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <h3 className="text-xs font-heading font-bold text-zinc-300 uppercase tracking-wider">
                  Suspension Stiffness
                </h3>
                <TechnicalSlider
                  label="Front Spring Rate"
                  value={frontSpringRateNmm}
                  min={80}
                  max={240}
                  step={5}
                  unit="N/mm"
                  onChange={setFrontSpringRateNmm}
                />
                <TechnicalSlider
                  label="Rear Spring Rate"
                  value={rearSpringRateNmm}
                  min={100}
                  max={280}
                  step={5}
                  unit="N/mm"
                  onChange={setRearSpringRateNmm}
                />
              </div>

              <div className="pt-2 border-t border-gt-border space-y-3">
                <h3 className="text-xs font-heading font-bold text-zinc-300 uppercase tracking-wider">
                  Anti-Roll Bars & Load
                </h3>
                <TechnicalSlider
                  label="Front ARB Stiffness"
                  value={frontArbStiffness}
                  min={15}
                  max={80}
                  step={5}
                  unit="N/mm"
                  onChange={setFrontArbStiffness}
                />
                <TechnicalSlider
                  label="Rear ARB Stiffness"
                  value={rearArbStiffness}
                  min={15}
                  max={70}
                  step={5}
                  unit="N/mm"
                  onChange={setRearArbStiffness}
                />
                <TechnicalSlider
                  label="Target Lateral G"
                  value={lateralG}
                  min={0.5}
                  max={1.8}
                  step={0.05}
                  unit="G"
                  onChange={setLateralG}
                />
              </div>
            </>
          )}
        </div>

        {/* Center Stage: Multibody Telemetry HUD & Vector Diagrams */}
        <div className="flex-1 flex flex-col bg-gt-obsidian p-6 overflow-y-auto space-y-6">
          {/* Top KPI Telemetry Cards */}
          <div className="grid grid-cols-4 gap-4 font-mono">
            <div className="p-4 rounded-2xl bg-gt-basalt/60 border border-gt-border shadow-xl">
              <div className="text-[10px] text-zinc-400 uppercase">Mechanical Grip (0 km/h)</div>
              <div className="text-2xl font-bold text-white mt-1">
                {couplingReport.speedSweep[0].maxCorneringLateralG.toFixed(2)} G
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">Base mechanical grip</div>
            </div>

            <div className="p-4 rounded-2xl bg-gt-basalt/60 border border-gt-border shadow-xl">
              <div className="text-[10px] text-zinc-400 uppercase">High-Speed Grip ({selectedSpeedKmh} km/h)</div>
              <div className="text-2xl font-bold text-gt-accent mt-1">
                {currentSpeedPoint.maxCorneringLateralG.toFixed(2)} G
              </div>
              <div className="text-[10px] text-emerald-400 mt-1 font-bold">
                +{couplingReport.highSpeedGripEnhancementPct}% aero enhancement
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gt-basalt/60 border border-gt-border shadow-xl">
              <div className="text-[10px] text-zinc-400 uppercase">Total Normal Downforce</div>
              <div className="text-2xl font-bold text-white mt-1">
                {currentSpeedPoint.totalDownforceN} N
              </div>
              <div className="text-[10px] text-zinc-400 mt-1">
                {Math.round(currentSpeedPoint.totalDownforceN / 9.80665)} kgf aero load
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gt-basalt/60 border border-gt-border shadow-xl">
              <div className="text-[10px] text-zinc-400 uppercase">Dynamic Aero Balance</div>
              <div className="text-2xl font-bold text-white mt-1">
                {currentSpeedPoint.dynamicWeightFrontPct.toFixed(1)}% Front
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                Static: {frontWeightDistPct}% Front
              </div>
            </div>
          </div>

          {activeTab === 'aero-coupling' ? (
            /* Speed Sweep Multibody Table */
            <div className="p-5 rounded-2xl bg-gt-basalt/60 border border-gt-border shadow-xl space-y-4">
              <h3 className="text-xs font-heading font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Gauge className="w-4 h-4 text-gt-accent" />
                <span>Speed Sweep Telemetry Matrix</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-gt-border text-zinc-400 text-[10px] uppercase">
                      <th className="py-2 px-3">Speed (km/h)</th>
                      <th className="py-2 px-3">Total DF (N)</th>
                      <th className="py-2 px-3">Front Load (N)</th>
                      <th className="py-2 px-3">Rear Load (N)</th>
                      <th className="py-2 px-3">Front Bump (mm)</th>
                      <th className="py-2 px-3">Rear Bump (mm)</th>
                      <th className="py-2 px-3">Max Lat. G</th>
                    </tr>
                  </thead>
                  <tbody>
                    {couplingReport.speedSweep.map((pt, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-gt-border/40 hover:bg-white/5 ${
                          Math.abs(pt.velocityKmh - selectedSpeedKmh) < 15 ? 'bg-gt-accent/15 text-white font-bold' : 'text-zinc-300'
                        }`}
                      >
                        <td className="py-2 px-3">{pt.velocityKmh}</td>
                        <td className="py-2 px-3 text-gt-accent">{pt.totalDownforceN}</td>
                        <td className="py-2 px-3">{pt.totalAxleLoadFrontN}</td>
                        <td className="py-2 px-3">{pt.totalAxleLoadRearN}</td>
                        <td className="py-2 px-3">{pt.suspensionCompressionFrontMm.toFixed(1)}</td>
                        <td className="py-2 px-3">{pt.suspensionCompressionRearMm.toFixed(1)}</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">{pt.maxCorneringLateralG.toFixed(2)} G</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Kinematics Stage: Vector Roll Center Diagram & 4-Corner Telemetry */
            <div className="space-y-6">
              {/* 4-Corner Wheel Deflection Gauges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                <div className="p-4 rounded-xl bg-gt-basalt/60 border border-gt-border">
                  <div className="text-[10px] text-zinc-400 mb-1">FRONT LEFT (FL)</div>
                  <div className="text-xl font-bold text-white">{(latTransferFrontN / frontSpringRateNmm).toFixed(1)} mm</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Camber: {(frontCamberGain * 10).toFixed(2)}°</div>
                </div>
                <div className="p-4 rounded-xl bg-gt-basalt/60 border border-gt-border">
                  <div className="text-[10px] text-zinc-400 mb-1">FRONT RIGHT (FR)</div>
                  <div className="text-xl font-bold text-white">{(-latTransferFrontN / frontSpringRateNmm).toFixed(1)} mm</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Camber: {(-frontCamberGain * 10).toFixed(2)}°</div>
                </div>
                <div className="p-4 rounded-xl bg-gt-basalt/60 border border-gt-border">
                  <div className="text-[10px] text-zinc-400 mb-1">REAR LEFT (RL)</div>
                  <div className="text-xl font-bold text-white">{(latTransferRearN / rearSpringRateNmm).toFixed(1)} mm</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Camber: {(rearCamberGain * 10).toFixed(2)}°</div>
                </div>
                <div className="p-4 rounded-xl bg-gt-basalt/60 border border-gt-border">
                  <div className="text-[10px] text-zinc-400 mb-1">REAR RIGHT (RR)</div>
                  <div className="text-xl font-bold text-white">{(-latTransferRearN / rearSpringRateNmm).toFixed(1)} mm</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Camber: {(-rearCamberGain * 10).toFixed(2)}°</div>
                </div>
              </div>

              {/* Vector Roll-Center Diagram */}
              <div className="p-5 rounded-2xl bg-gt-basalt/60 border border-gt-border shadow-xl space-y-4">
                <h3 className="text-xs font-heading font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gt-accent" />
                  <span>Instantaneous Roll-Center & Roll Axis Diagram</span>
                </h3>

                <div className="relative w-full h-48 bg-black/60 rounded-xl border border-gt-border p-4 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 600 160" fill="none">
                    {/* Ground line */}
                    <line x1="50" y1="130" x2="550" y2="130" stroke="#3F3F46" strokeWidth="2" strokeDasharray="8 4" />

                    {/* Roll Axis Line connecting Front RC to Rear RC */}
                    <line x1="150" y1={130 - frontRollCenterMm} x2="450" y2={130 - rearRollCenterMm} stroke="#E53935" strokeWidth="2" />

                    {/* Front Roll Center Point */}
                    <circle cx="150" cy={130 - frontRollCenterMm} r="5" fill="#E53935" />
                    <text x="120" y={115 - frontRollCenterMm} fill="#E53935" fontSize="10" fontFamily="monospace">
                      Front RC ({frontRollCenterMm} mm)
                    </text>

                    {/* Rear Roll Center Point */}
                    <circle cx="450" cy={130 - rearRollCenterMm} r="5" fill="#E53935" />
                    <text x="420" y={115 - rearRollCenterMm} fill="#E53935" fontSize="10" fontFamily="monospace">
                      Rear RC ({rearRollCenterMm} mm)
                    </text>

                    {/* Center of Gravity (CG) */}
                    <circle cx="300" cy={130 - cgHeightM * 200} r="6" fill="#F59E0B" />
                    <text x="270" y={115 - cgHeightM * 200} fill="#F59E0B" fontSize="10" fontFamily="monospace">
                      CG (420 mm)
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
