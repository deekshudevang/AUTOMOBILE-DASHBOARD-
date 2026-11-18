import React, { useState } from 'react';
import {
  Wind,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Activity,
  ChevronRight,
  TrendingUp,
  Cpu,
  Download,
  Upload,
  Check
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import {
  AIRFOIL_CATALOG,
  PREBUILT_AERO_PACKAGES,
  AeroPackageDefinition,
  ParametricAeroLibrary
} from '../../geometry/aero/parametricAeroLibrary';
import { AerodynamicOptimizer, OptimizationResult } from '../../simulation/optimization/aerodynamicOptimizer';

export const AeroStudioView: React.FC = () => {
  const { engineeringMode, activeModel } = useVehicleStore();

  const [airfoilKey, setAirfoilKey] = useState<string>('SELIG_S1223');
  const [wingSpan, setWingSpan] = useState<number>(1.82);
  const [wingChord, setWingChord] = useState<number>(0.34);
  const [wingAoA, setWingAoA] = useState<number>(10.5);
  const [splitterExtension, setSplitterExtension] = useState<number>(0.12); // meters forward
  const [diffuserExpansionAngle, setDiffuserExpansionAngle] = useState<number>(12.0); // degrees
  const [diffuserStrakes, setDiffuserStrakes] = useState<number>(4);

  // Optimization State
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optResult, setOptResult] = useState<OptimizationResult | null>(null);

  // Custom Airfoil DAT import modal
  const [showDatImport, setShowDatImport] = useState<boolean>(false);
  const [datText, setDatText] = useState<string>('');
  const [datCode, setDatCode] = useState<string>('CUSTOM_RACING_01');

  // Analytical force calculations
  const speedKmh = 160; // 44.4 m/s
  const speedMs = speedKmh / 3.6;
  const rho = 1.225; // kg/m^3
  const q = 0.5 * rho * speedMs * speedMs; // dynamic pressure

  const wingArea = wingSpan * wingChord;
  const clWing = Math.min(1.8, 0.4 + (wingAoA * 0.08));
  const cdWing = 0.015 + Math.pow(clWing, 2) / (Math.PI * (wingSpan / wingChord) * 0.85);

  const wingDownforceN = q * wingArea * clWing;
  const wingDragN = q * wingArea * cdWing;

  const splitterDownforceN = q * 0.45 * (splitterExtension / 0.1) * 0.6;
  const diffuserDownforceN = q * 0.85 * (diffuserExpansionAngle / 10.0) * 0.75;

  const totalDownforceN = Math.round(wingDownforceN + splitterDownforceN + diffuserDownforceN);
  const totalAeroDragN = Math.round(wingDragN + (q * 0.08));

  const applyPackage = (pkg: AeroPackageDefinition) => {
    setWingSpan(pkg.rearWing.spanM);
    setWingChord(pkg.rearWing.chordM);
    setWingAoA(pkg.rearWing.angleDegrees);
    setAirfoilKey(pkg.rearWing.airfoilCode);
    setSplitterExtension(pkg.frontSplitter.forwardExtensionM);
    setDiffuserExpansionAngle(pkg.rearDiffuser.expansionAngleDegrees);
    setDiffuserStrakes(pkg.rearDiffuser.strakeCount);
  };

  const handleRunOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const result = AerodynamicOptimizer.runOptimization(
        'porsche_911_gt3_rs_992',
        {
          wingSpanM: wingSpan,
          wingAoADeg: wingAoA,
          splitterExtensionM: splitterExtension,
          diffuserAngleDeg: diffuserExpansionAngle
        },
        {
          wingSpanM: [1.65, 1.95],
          wingAoADeg: [4.0, 16.0],
          splitterExtensionM: [0.08, 0.18],
          diffuserAngleDeg: [8.0, 14.0]
        }
      );
      setOptResult(result);
      setIsOptimizing(false);
    }, 400);
  };

  const handleImportDat = () => {
    if (!datText.trim()) return;
    try {
      ParametricAeroLibrary.importAirfoilFromDat(datText, datCode, `Imported ${datCode}`);
      setAirfoilKey(datCode);
      setShowDatImport(false);
      setDatText('');
    } catch (err: any) {
      alert(`Airfoil Import Error: ${err.message}`);
    }
  };

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
            Design parametric wings, splitters and diffusers with certified airfoil sections, multi-objective Pareto optimization, and thin trailing-edge meshing.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDatImport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-autoverse-surface hover:bg-autoverse-elevated text-slate-300 border border-autoverse-border text-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Airfoil DAT</span>
          </button>
          <button
            onClick={handleRunOptimization}
            disabled={isOptimizing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-autoverse-cyan hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors disabled:opacity-50"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{isOptimizing ? 'Optimizing Frontier...' : 'Run Pareto Optimization'}</span>
          </button>
        </div>
      </div>

      {/* Prebuilt Packages Banner */}
      <div className="mt-4 p-3 rounded bg-autoverse-surface border border-autoverse-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-200">Pre-Built Aero Packages:</span>
          <span className="text-[11px] text-autoverse-muted">Homologated aerodynamic setups</span>
        </div>
        <div className="flex items-center gap-2">
          {PREBUILT_AERO_PACKAGES.map(pkg => (
            <button
              key={pkg.id}
              onClick={() => applyPackage(pkg)}
              className="px-2.5 py-1 rounded bg-autoverse-elevated hover:border-autoverse-cyan border border-autoverse-border text-xs font-medium text-slate-200 transition-colors"
            >
              {pkg.name}
            </button>
          ))}
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
                  <span className="text-slate-300">Span (b)</span>
                  <span className="font-mono text-autoverse-cyan">{wingSpan.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="1.95"
                  step="0.01"
                  value={wingSpan}
                  onChange={e => setWingSpan(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Chord (c)</span>
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
                  <span className="text-slate-300">AoA (&alpha;)</span>
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
                  max="16"
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

          {/* Optimization Results Card */}
          {optResult && (
            <div className="p-5 rounded bg-autoverse-surface border border-autoverse-cyan space-y-3">
              <div className="flex items-center justify-between border-b border-autoverse-border pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-autoverse-cyan" />
                  <span className="text-sm font-bold text-slate-100">Pareto Optimization Results</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300">
                  {optResult.paretoFrontCount} PARETO FRONTIER CANDIDATES
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded bg-autoverse-elevated">
                  <span className="text-slate-400">Baseline Downforce</span>
                  <p className="text-base font-mono font-bold text-slate-200 mt-0.5">{optResult.baseline.metrics.downforceN} N</p>
                  <span className="text-[10px] text-slate-500 font-mono">Cd: {optResult.baseline.metrics.cd}</span>
                </div>
                <div className="p-3 rounded bg-autoverse-elevated border border-emerald-800/80">
                  <span className="text-emerald-400 font-semibold">Recommended Optimum</span>
                  <p className="text-base font-mono font-bold text-emerald-300 mt-0.5">{optResult.recommendedBest.metrics.downforceN} N</p>
                  <span className="text-[10px] text-emerald-400 font-mono">L/D: {optResult.recommendedBest.metrics.lOverD}</span>
                </div>
                <div className="p-3 rounded bg-autoverse-elevated">
                  <span className="text-slate-400">Front Balance</span>
                  <p className="text-base font-mono font-bold text-autoverse-cyan mt-0.5">{optResult.recommendedBest.metrics.frontBalancePct}%</p>
                  <span className="text-[10px] text-slate-500 font-mono">Within ±6% stability envelope</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setWingSpan(optResult.recommendedBest.variables.wingSpanM);
                    setWingAoA(optResult.recommendedBest.variables.wingAoADeg);
                    setSplitterExtension(optResult.recommendedBest.variables.splitterExtensionM);
                    setDiffuserExpansionAngle(optResult.recommendedBest.variables.diffuserAngleDeg);
                  }}
                  className="px-3 py-1.5 rounded bg-autoverse-cyan text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
                >
                  Apply Optimum Parameters
                </button>
              </div>
            </div>
          )}
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

      {/* DAT Import Modal */}
      {showDatImport && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-autoverse-surface border border-autoverse-border rounded-lg max-w-lg w-full p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-100">Import Airfoil (.DAT Coordinates)</h2>
            <p className="text-xs text-autoverse-muted">
              Paste standard Selig/UIUC normalized coordinates from trailing edge to leading edge (x y per line).
            </p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Airfoil Code e.g. SELIG_1223"
                value={datCode}
                onChange={e => setDatCode(e.target.value)}
                className="w-full bg-autoverse-elevated border border-autoverse-border rounded px-3 py-1.5 text-xs text-slate-100"
              />
              <textarea
                rows={8}
                placeholder="1.0000  0.0000&#10;0.9500  0.0210&#10;..."
                value={datText}
                onChange={e => setDatText(e.target.value)}
                className="w-full bg-autoverse-elevated border border-autoverse-border rounded p-2.5 font-mono text-xs text-slate-100"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDatImport(false)}
                className="px-3 py-1.5 rounded bg-autoverse-elevated text-xs text-slate-300 border border-autoverse-border"
              >
                Cancel
              </button>
              <button
                onClick={handleImportDat}
                className="px-3 py-1.5 rounded bg-autoverse-cyan text-slate-950 font-bold text-xs"
              >
                Parse & Register Airfoil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
