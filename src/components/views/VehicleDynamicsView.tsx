import React, { useState, useMemo } from 'react';
import {
  Activity,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Gauge,
  Wind
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { AeroDynamicsCoupler, VehicleDynamicsInput } from '../../simulation/dynamics/aeroDynamicsCoupler';

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
    <div className="h-full flex flex-col bg-autoverse-bg text-slate-100 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-autoverse-border shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">Vehicle Dynamics & Aerodynamic Coupling</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300">
              CFD COUPLED MULTIBODY
            </span>
            {engineeringMode === 'student' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                Student Mode Active
              </span>
            )}
          </div>
          <p className="text-xs text-autoverse-muted mt-1">
            Coupling CFD aero forces into 4-wheel normal load distribution, suspension deflection, dynamic rake shifts, and high-speed lateral grip.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 bg-autoverse-surface p-1 rounded border border-autoverse-border text-xs font-mono">
          <button
            onClick={() => setActiveTab('aero-coupling')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'aero-coupling'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Aero Normal Load Coupling
          </button>
          <button
            onClick={() => setActiveTab('kinematics')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'kinematics'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Suspension Kinematics
          </button>
        </div>
      </div>

      {activeTab === 'aero-coupling' ? (
        /* Aerodynamic Normal Load Coupling View */
        <div className="space-y-6 mt-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded bg-autoverse-surface border border-autoverse-border">
              <span className="text-[10px] font-mono uppercase text-slate-400">Mechanical Grip (0 km/h)</span>
              <div className="text-xl font-mono font-bold text-slate-200 mt-1">
                {couplingReport.speedSweep[0].maxCorneringLateralG.toFixed(2)} G
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Friction coefficient &mu; = {tireMu}</span>
            </div>

            <div className="p-4 rounded bg-autoverse-surface border border-autoverse-border">
              <span className="text-[10px] font-mono uppercase text-slate-400">High-Speed Grip (300 km/h)</span>
              <div className="text-xl font-mono font-bold text-cyan-400 mt-1">
                {couplingReport.topSpeedPoint.maxCorneringLateralG.toFixed(2)} G
              </div>
              <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                +{couplingReport.highSpeedGripEnhancementPct}% grip enhancement
              </span>
            </div>

            <div className="p-4 rounded bg-autoverse-surface border border-autoverse-border">
              <span className="text-[10px] font-mono uppercase text-slate-400">Total Downforce @ 280 km/h</span>
              <div className="text-xl font-mono font-bold text-slate-200 mt-1">
                {couplingReport.speedSweep[8]?.totalDownforceN.toLocaleString()} N
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {Math.round((couplingReport.speedSweep[8]?.totalDownforceN || 0) / 9.81)} kgf aerodynamic load
              </span>
            </div>

            <div className="p-4 rounded bg-autoverse-surface border border-autoverse-border">
              <span className="text-[10px] font-mono uppercase text-slate-400">High-Speed Aero Balance</span>
              <div className="text-xl font-mono font-bold text-slate-200 mt-1">
                {couplingReport.topSpeedPoint.dynamicWeightFrontPct.toFixed(1)}% Front
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Static balance: {frontWeightDistPct.toFixed(1)}% Front
              </span>
            </div>
          </div>

          {/* Configuration and Live Sweep Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Controls */}
            <div className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-4">
              <h2 className="text-sm font-bold text-slate-100 border-b border-autoverse-border pb-2">
                Aero & Chassis Coupling Parameters
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Drag Coefficient (Cd)</span>
                    <span className="font-mono text-cyan-400 font-bold">{cd.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.25"
                    max="0.55"
                    step="0.005"
                    value={cd}
                    onChange={e => setCd(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Front Lift Coeff (Cl_front)</span>
                    <span className="font-mono text-cyan-400 font-bold">{clFront.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="-0.40"
                    max="0.10"
                    step="0.005"
                    value={clFront}
                    onChange={e => setClFront(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-400">Negative indicates downforce</span>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Rear Lift Coeff (Cl_rear)</span>
                    <span className="font-mono text-cyan-400 font-bold">{clRear.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="-0.60"
                    max="0.10"
                    step="0.005"
                    value={clRear}
                    onChange={e => setClRear(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-400">Adjusted by rear wing angle & profile</span>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Tire Friction Coefficient (&mu;)</span>
                    <span className="font-mono text-cyan-400 font-bold">{tireMu.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="1.7"
                    step="0.05"
                    value={tireMu}
                    onChange={e => setTireMu(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-400">1.35 = Michelin Cup 2 R; 1.60 = Slick</span>
                </div>

                <div className="pt-2 border-t border-autoverse-border">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 font-medium">Front Coilover Spring Rate</span>
                    <span className="font-mono text-cyan-400 font-bold">{frontSpringRateNmm} N/mm</span>
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

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 font-medium">Rear Coilover Spring Rate</span>
                    <span className="font-mono text-cyan-400 font-bold">{rearSpringRateNmm} N/mm</span>
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

              {/* Student Help Box */}
              {engineeringMode === 'student' && (
                <div className="p-3 rounded bg-autoverse-elevated border border-autoverse-border text-[11px] text-slate-300 space-y-1.5">
                  <p className="font-semibold text-cyan-400">🎓 Why Aero Dynamic Coupling Matters</p>
                  <p className="leading-relaxed">
                    Aerodynamic downforce increases with velocity squared (v&sup2;). At high speeds, normal load on the tires can double, radically expanding cornering grip from 1.35G to over 1.70G. However, if front and rear downforce are unbalanced, the dynamic pitch (rake) changes and can shift vehicle handling toward severe understeer or oversteer.
                  </p>
                </div>
              )}
            </div>

            {/* Live Speed Sweep Table */}
            <div className="lg:col-span-2 p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-4">
              <div className="flex items-center justify-between border-b border-autoverse-border pb-2">
                <h2 className="text-sm font-bold text-slate-100">
                  Speed Sweep Response Envelope (0 - 300 km/h)
                </h2>
                <span className="text-[11px] font-mono text-slate-400">
                  ISO-15037 Dynamic Response
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-autoverse-border/80 text-slate-400 text-[11px]">
                      <th className="py-2 px-2">Speed (km/h)</th>
                      <th className="py-2 px-2">Downforce (N)</th>
                      <th className="py-2 px-2">Front Load (N)</th>
                      <th className="py-2 px-2">Rear Load (N)</th>
                      <th className="py-2 px-2">Front Bal (%)</th>
                      <th className="py-2 px-2 text-cyan-400">Max Grip (G)</th>
                      <th className="py-2 px-2">Defl F/R (mm)</th>
                      <th className="py-2 px-2">Rake (&deg;)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-autoverse-border/40">
                    {couplingReport.speedSweep.map((pt) => (
                      <tr
                        key={pt.velocityKmh}
                        className={`hover:bg-autoverse-elevated/40 transition-colors ${
                          pt.velocityKmh === currentSpeedPoint.velocityKmh ? 'bg-cyan-950/40 text-cyan-200' : ''
                        }`}
                      >
                        <td className="py-2 px-2 font-bold">{pt.velocityKmh}</td>
                        <td className="py-2 px-2">{pt.totalDownforceN.toLocaleString()}</td>
                        <td className="py-2 px-2">{pt.totalAxleLoadFrontN.toLocaleString()}</td>
                        <td className="py-2 px-2">{pt.totalAxleLoadRearN.toLocaleString()}</td>
                        <td className="py-2 px-2">{pt.dynamicWeightFrontPct.toFixed(1)}%</td>
                        <td className="py-2 px-2 font-bold text-cyan-400">{pt.maxCorneringLateralG.toFixed(2)}</td>
                        <td className="py-2 px-2">-{pt.suspensionCompressionFrontMm} / -{pt.suspensionCompressionRearMm}</td>
                        <td className="py-2 px-2">{pt.dynamicRakeChangeDeg > 0 ? `+${pt.dynamicRakeChangeDeg}` : pt.dynamicRakeChangeDeg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dynamic Rake & Aero Elasticity Callout */}
              <div className="p-3 rounded bg-autoverse-elevated/80 border border-autoverse-border/70 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Dynamic Aero Pitch Shift @ Top Speed:</span>{' '}
                  <span className="font-mono font-bold text-slate-200">
                    {couplingReport.topSpeedPoint.dynamicRakeChangeDeg > 0
                      ? `+${couplingReport.topSpeedPoint.dynamicRakeChangeDeg}° (Squat)`
                      : `${couplingReport.topSpeedPoint.dynamicRakeChangeDeg}° (Dive)`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Understeer Gradient Shift:</span>{' '}
                  <span className="font-mono font-bold text-cyan-400">
                    {couplingReport.highSpeedUndersteerShiftDegPerG > 0
                      ? `+${couplingReport.highSpeedUndersteerShiftDegPerG}°/G understeer`
                      : `${couplingReport.highSpeedUndersteerShiftDegPerG}°/G oversteer`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Suspension Kinematics View */
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
      )}
    </div>
  );
};
