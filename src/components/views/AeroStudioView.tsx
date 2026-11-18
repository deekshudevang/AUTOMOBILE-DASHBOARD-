import React, { useState } from 'react';
import {
  Wind,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Activity,
  ChevronRight
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { AIRFOIL_CATALOG } from '../../geometry/aero/parametricAeroLibrary';

export const AeroStudioView: React.FC = () => {
  const { engineeringMode } = useVehicleStore();

  const [airfoilKey, setAirfoilKey] = useState<string>('SELIG_S1223');
  const [wingSpan, setWingSpan] = useState<number>(1.72);
  const [wingChord, setWingChord] = useState<number>(0.32);
  const [wingAoA, setWingAoA] = useState<number>(10.5);
  const [splitterExtension, setSplitterExtension] = useState<number>(0.12); // meters forward
  const [diffuserExpansionAngle, setDiffuserExpansionAngle] = useState<number>(8.5); // degrees
  const [diffuserStrakes, setDiffuserStrakes] = useState<number>(4);

  // Analytical approximations (Explicitly tagged as ANALYTIC)
  const speedKmh = 160; // 44.4 m/s
  const speedMs = speedKmh / 3.6;
  const rho = 1.225; // kg/m^3
  const q = 0.5 * rho * speedMs * speedMs; // dynamic pressure

  const wingArea = wingSpan * wingChord;
  const airfoil = AIRFOIL_CATALOG[airfoilKey] || AIRFOIL_CATALOG['SELIG_S1223'];
  const clWing = Math.min(1.8, 0.4 + (wingAoA * 0.08));
  const cdWing = 0.015 + Math.pow(clWing, 2) / (Math.PI * (wingSpan / wingChord) * 0.85);

  const wingDownforceN = q * wingArea * clWing;
  const wingDragN = q * wingArea * cdWing;

  const splitterDownforceN = q * 0.45 * (splitterExtension / 0.1) * 0.6;
  const diffuserDownforceN = q * 0.85 * (diffuserExpansionAngle / 10.0) * 0.75;

  const totalDownforceN = Math.round(wingDownforceN + splitterDownforceN + diffuserDownforceN);
  const totalAeroDragN = Math.round(wingDragN + (q * 0.08));

  return (
    <div className="h-full flex flex-col bg-autoverse-bg text-slate-100 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-autoverse-border shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">Aerodynamics Studio</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300">
              PARAMETRIC AERO PACK
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300">
              PROVENANCE: ANALYTIC
            </span>
            {engineeringMode === 'student' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                Student Mode Active
              </span>
            )}
          </div>
          <p className="text-xs text-autoverse-muted mt-1">
            Design parametric wings, splitters and diffusers with certified airfoil sections and thin trailing-edge meshing.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Controls Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Rear Wing Section */}
          <div className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-4">
            <div className="flex items-center justify-between border-b border-autoverse-border pb-3">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Wind className="w-4 h-4 text-autoverse-cyan" />
                <span>Rear Aerofoil Assembly</span>
              </h2>
              <div className="text-xs text-slate-400">
                Profile: <span className="text-autoverse-cyan font-mono font-medium">{airfoilKey}</span>
              </div>
            </div>

            {/* Airfoil Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Airfoil Profile Family</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.keys(AIRFOIL_CATALOG).map(name => (
                  <button
                    key={name}
                    onClick={() => setAirfoilKey(name)}
                    className={`p-2 rounded text-xs text-left transition-colors border ${
                      airfoilKey === name
                        ? 'bg-autoverse-elevated border-autoverse-cyan text-autoverse-cyan font-bold'
                        : 'bg-autoverse-elevated/50 border-autoverse-border text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="block truncate">{AIRFOIL_CATALOG[name].name}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      t/c = {Math.round(AIRFOIL_CATALOG[name].thicknessRatio * 100)}%
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Span ($b$)</span>
                  <span className="font-mono text-autoverse-cyan">{wingSpan.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="1.85"
                  step="0.01"
                  value={wingSpan}
                  onChange={e => setWingSpan(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Chord ($c$)</span>
                  <span className="font-mono text-autoverse-cyan">{wingChord.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.45"
                  step="0.01"
                  value={wingChord}
                  onChange={e => setWingChord(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">AoA ($\alpha$)</span>
                  <span className="font-mono text-autoverse-cyan">{wingAoA.toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="16"
                  step="0.5"
                  value={wingAoA}
                  onChange={e => setWingAoA(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Underbody & Splitter Section */}
          <div className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-4">
            <h2 className="text-sm font-bold text-slate-100 border-b border-autoverse-border pb-3">
              Front Splitter & Underbody Venturi Diffuser
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Splitter Extension</span>
                  <span className="font-mono text-autoverse-cyan">{(splitterExtension * 1000).toFixed(0)} mm</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.20"
                  step="0.01"
                  value={splitterExtension}
                  onChange={e => setSplitterExtension(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Diffuser Angle</span>
                  <span className="font-mono text-autoverse-cyan">{diffuserExpansionAngle.toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="14"
                  step="0.5"
                  value={diffuserExpansionAngle}
                  onChange={e => setDiffuserExpansionAngle(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Diffuser Strakes</span>
                  <span className="font-mono text-autoverse-cyan">{diffuserStrakes} strakes</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="1"
                  value={diffuserStrakes}
                  onChange={e => setDiffuserStrakes(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Analytic Aero Readout Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-autoverse-muted">
                Analytic Forces @ {speedKmh} km/h
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800">
                ANALYTIC
              </span>
            </div>

            {/* Total Downforce Card */}
            <div className="p-4 rounded bg-autoverse-elevated border border-autoverse-border space-y-2">
              <span className="text-xs text-slate-400">Total Aerodynamic Downforce (-L)</span>
              <div className="text-2xl font-mono font-bold text-autoverse-cyan">
                {totalDownforceN.toLocaleString()} N
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Equivalent to {(totalDownforceN / 9.81).toFixed(1)} kg of vertical load
              </p>
            </div>

            {/* Drag & Efficiency */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Estimated Induced Drag</span>
                <span className="font-mono font-bold text-slate-200">{totalAeroDragN} N</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Aero Efficiency (-L/D)</span>
                <span className="font-mono font-bold text-emerald-400">
                  {(totalDownforceN / Math.max(1, totalAeroDragN)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Front Aero Balance</span>
                <span className="font-mono font-bold text-slate-200">
                  {Math.round((splitterDownforceN / totalDownforceN) * 100)}% Front
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Rear Aero Balance</span>
                <span className="font-mono font-bold text-slate-200">
                  {100 - Math.round((splitterDownforceN / totalDownforceN) * 100)}% Rear
                </span>
              </div>
            </div>

            {/* Student Explanation */}
            {engineeringMode === 'student' && (
              <div className="p-3 rounded bg-autoverse-elevated border border-autoverse-border text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-autoverse-cyan">🎓 Educational Note</p>
                <p className="leading-relaxed">
                  These force estimations are analytical thin-airfoil approximations. For accurate pressure fields, wake separation, and ground-effect vortices, run a full OpenFOAM CFD simulation in the CFD Lab.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
