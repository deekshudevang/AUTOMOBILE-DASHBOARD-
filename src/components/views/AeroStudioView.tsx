import React, { useState } from 'react';
import {
  Wind,
  TrendingUp,
  Cpu,
  Upload,
  Gauge,
  Activity,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import {
  AIRFOIL_CATALOG,
  PREBUILT_AERO_PACKAGES,
  AeroPackageDefinition,
  ParametricAeroLibrary
} from '../../geometry/aero/parametricAeroLibrary';
import { AerodynamicOptimizer, OptimizationResult } from '../../simulation/optimization/aerodynamicOptimizer';
import { TechnicalSlider } from '../ui/TechnicalSlider';

export const AeroStudioView: React.FC = () => {
  const { engineeringMode, activeModel } = useVehicleStore();

  const [airfoilKey, setAirfoilKey] = useState<string>('SELIG_S1223');
  const [wingSpan, setWingSpan] = useState<number>(1.82);
  const [wingChord, setWingChord] = useState<number>(0.34);
  const [wingAoA, setWingAoA] = useState<number>(10.5);
  const [splitterExtension, setSplitterExtension] = useState<number>(0.12); // meters forward
  const [diffuserExpansionAngle, setDiffuserExpansionAngle] = useState<number>(12.0); // degrees
  const [diffuserStrakes, setDiffuserStrakes] = useState<number>(4);
  const [speedKmh, setSpeedKmh] = useState<number>(160);

  // Optimization State
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optResult, setOptResult] = useState<OptimizationResult | null>(null);

  // Custom Airfoil DAT import modal
  const [showDatImport, setShowDatImport] = useState<boolean>(false);
  const [datText, setDatText] = useState<string>('');
  const [datCode, setDatCode] = useState<string>('CUSTOM_RACING_01');

  // Analytical force calculations
  const speedMs = speedKmh / 3.6;
  const rho = 1.225; // kg/m^3 (Standard sea level air density)
  const q = 0.5 * rho * speedMs * speedMs; // dynamic pressure (Pa)

  const wingArea = wingSpan * wingChord;
  const clWing = Math.min(1.8, 0.4 + (wingAoA * 0.08));
  const cdWing = 0.015 + Math.pow(clWing, 2) / (Math.PI * (wingSpan / wingChord) * 0.85);

  const wingDownforceN = q * wingArea * clWing;
  const wingDragN = q * wingArea * cdWing;

  const splitterDownforceN = q * 0.45 * (splitterExtension / 0.1) * 0.6;
  const diffuserDownforceN = q * 0.85 * (diffuserExpansionAngle / 10.0) * 0.75;

  const totalDownforceN = Math.round(wingDownforceN + splitterDownforceN + diffuserDownforceN);
  const totalDownforceKg = Math.round(totalDownforceN / 9.80665);
  const totalAeroDragN = Math.round(wingDragN + (q * 0.08));
  const liftToDragRatio = totalAeroDragN > 0 ? (totalDownforceN / totalAeroDragN).toFixed(2) : '0.00';

  // Front / Rear aero balance
  const frontDownforceN = splitterDownforceN;
  const rearDownforceN = wingDownforceN + diffuserDownforceN;
  const frontBalancePct = totalDownforceN > 0 ? Math.round((frontDownforceN / totalDownforceN) * 100) : 40;
  const rearBalancePct = 100 - frontBalancePct;

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
    <div className="h-full flex flex-col bg-gt-obsidian text-zinc-100 overflow-hidden select-none font-sans">
      {/* 1. Header Toolbar */}
      <header className="h-14 px-6 bg-gt-basalt/80 border-b border-gt-border backdrop-blur-xl flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gt-accent/15 border border-gt-accent/30 flex items-center justify-center text-gt-accent">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-heading font-bold text-white tracking-wide">
                AERODYNAMICS STUDIO
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 border border-gt-border text-gt-accent font-bold">
                WIND TUNNEL TELEMETRY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-bold">
                ρ = 1.225 kg/m³
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400">
              Parametric wings, splitters, diffusers, surface pressure gradient, and Pareto downforce optimization
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDatImport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gt-basalt hover:bg-gt-graphite border border-gt-border text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Airfoil DAT</span>
          </button>
          <button
            onClick={handleRunOptimization}
            disabled={isOptimizing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gt-accent hover:bg-gt-accent/90 text-white text-xs font-mono font-bold shadow-lg shadow-gt-accent/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{isOptimizing ? 'Optimizing...' : 'RUN PARETO OPTIMIZER'}</span>
          </button>
        </div>
      </header>

      {/* 2. Homologated Packages Banner */}
      <div className="px-6 py-2 bg-gt-basalt/40 border-b border-gt-border flex items-center justify-between gap-4 text-xs font-mono shrink-0">
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="font-heading font-bold text-white">HOMOLOGATED AERO PACKAGES:</span>
          <span>Certified race aerodynamic presets</span>
        </div>
        <div className="flex items-center gap-2">
          {PREBUILT_AERO_PACKAGES.map(pkg => (
            <button
              key={pkg.id}
              onClick={() => applyPackage(pkg)}
              className="px-2.5 py-1 rounded bg-black/40 hover:bg-gt-accent hover:text-white border border-gt-border text-[11px] font-mono text-zinc-300 transition-colors cursor-pointer"
            >
              {pkg.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Workstation Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Aerodynamic Controls Blade (320px) */}
        <div className="w-80 bg-gt-basalt/60 border-r border-gt-border p-4 space-y-5 overflow-y-auto shrink-0 font-mono">
          {/* Wind Tunnel Speed */}
          <div className="space-y-2">
            <h3 className="text-xs font-heading font-bold text-zinc-300 uppercase tracking-wider">
              Wind Tunnel Airspeed
            </h3>
            <TechnicalSlider
              label="Test Velocity"
              value={speedKmh}
              min={80}
              max={320}
              step={10}
              unit="km/h"
              onChange={setSpeedKmh}
            />
            <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
              <span>Velocity: {speedMs.toFixed(1)} m/s</span>
              <span>Dyn. Press (q): {Math.round(q)} Pa</span>
            </div>
          </div>

          {/* Rear Aerofoil Wing Controls */}
          <div className="pt-2 border-t border-gt-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-heading font-bold text-zinc-300 uppercase tracking-wider">
                Rear Wing Assembly
              </h3>
              <span className="text-[10px] text-gt-accent font-bold">{airfoilKey}</span>
            </div>

            {/* Airfoil Profiles */}
            <div className="grid grid-cols-2 gap-1.5">
              {Object.keys(AIRFOIL_CATALOG).map(code => (
                <button
                  key={code}
                  onClick={() => setAirfoilKey(code)}
                  className={`p-1.5 rounded text-[10px] border transition-colors truncate cursor-pointer ${
                    airfoilKey === code
                      ? 'bg-gt-accent text-white font-bold border-gt-accent'
                      : 'bg-black/30 border-gt-border text-zinc-400 hover:text-white'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <TechnicalSlider
              label="Wing Span"
              value={wingSpan}
              min={1.2}
              max={2.1}
              step={0.02}
              unit="m"
              onChange={setWingSpan}
            />
            <TechnicalSlider
              label="Wing Chord"
              value={wingChord}
              min={0.2}
              max={0.5}
              step={0.01}
              unit="m"
              onChange={setWingChord}
            />
            <TechnicalSlider
              label="Angle of Attack"
              value={wingAoA}
              min={0}
              max={25}
              step={0.5}
              unit="deg"
              onChange={setWingAoA}
            />
          </div>

          {/* Underbody Ground Effect Controls */}
          <div className="pt-2 border-t border-gt-border space-y-3">
            <h3 className="text-xs font-heading font-bold text-zinc-300 uppercase tracking-wider">
              Underbody & Diffuser
            </h3>
            <TechnicalSlider
              label="Splitter Extension"
              value={splitterExtension * 1000}
              min={20}
              max={250}
              step={5}
              unit="mm"
              onChange={(v) => setSplitterExtension(v / 1000)}
            />
            <TechnicalSlider
              label="Diffuser Ramp Angle"
              value={diffuserExpansionAngle}
              min={4}
              max={20}
              step={0.5}
              unit="deg"
              onChange={setDiffuserExpansionAngle}
            />
            <TechnicalSlider
              label="Diffuser Strakes"
              value={diffuserStrakes}
              min={2}
              max={8}
              step={1}
              unit="fins"
              onChange={setDiffuserStrakes}
            />
          </div>
        </div>

        {/* Center Stage: Interactive Wind Tunnel Streamline Simulation & Telemetry HUD */}
        <div className="flex-1 flex flex-col bg-gt-obsidian p-6 overflow-y-auto space-y-6">
          {/* Real-Time Aerodynamic Force Readouts */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-gt-basalt/60 border border-gt-border shadow-xl">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
                <span>TOTAL DOWNFORCE</span>
                <Wind className="w-4 h-4 text-gt-accent" />
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {totalDownforceKg} <span className="text-xs text-zinc-500">kg</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1">
                {totalDownforceN} N @ {speedKmh} km/h
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gt-basalt/60 border border-gt-border shadow-xl">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
                <span>TOTAL AERO DRAG</span>
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {totalAeroDragN} <span className="text-xs text-zinc-500">N</span>
              </div>
              <div className="text-[10px] font-mono text-amber-400 mt-1">
                Induced + Parasitic Drag
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gt-basalt/60 border border-gt-border shadow-xl">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
                <span>L / D EFFICIENCY</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-mono font-bold text-emerald-400">
                {liftToDragRatio} <span className="text-xs text-zinc-500">ratio</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1">
                Aerodynamic polar efficiency
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gt-basalt/60 border border-gt-border shadow-xl">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
                <span>AERO BALANCE</span>
                <Gauge className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {frontBalancePct}% <span className="text-xs text-zinc-500">F</span> / {rearBalancePct}% <span className="text-xs text-zinc-500">R</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1">
                Center of Pressure distribution
              </div>
            </div>
          </div>

          {/* Interactive Wind Tunnel Streamline Simulation Diagram */}
          <div className="p-5 rounded-2xl bg-gt-basalt/60 border border-gt-border shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-heading font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Wind className="w-4 h-4 text-gt-accent" />
                <span>Virtual Wind Tunnel Streamline Visualization</span>
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-zinc-500">Cp Scale:</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">Suction (-2.0)</span>
                <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">Stagnation (+1.0)</span>
              </div>
            </div>

            {/* SVG Streamline Flow Stage */}
            <div className="relative w-full h-64 bg-black/60 rounded-xl border border-gt-border overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 800 300" fill="none">
                {/* Wind Tunnel Streamlines */}
                {[40, 70, 100, 130, 160, 190, 220, 250].map((y, idx) => (
                  <path
                    key={idx}
                    d={`M 0 ${y} C 250 ${y - 15}, 350 ${y < 150 ? y - 35 : y + 25}, 800 ${y + (idx % 2 === 0 ? 10 : -10)}`}
                    stroke="rgba(229, 57, 53, 0.45)"
                    strokeWidth="1.5"
                    strokeDasharray="8 4"
                    className="animate-pulse"
                  />
                ))}

                {/* Car Aerodynamic Silhouette */}
                <path
                  d="M 120 230 C 150 230, 180 200, 240 180 C 310 155, 410 135, 520 145 C 580 150, 640 180, 680 230 Z"
                  fill="rgba(30, 37, 51, 0.9)"
                  stroke="#E53935"
                  strokeWidth="2"
                />

                {/* Rear Wing Foil */}
                <rect x="640" y="110" width="45" height="6" rx="2" fill="#E53935" transform={`rotate(${-wingAoA}, 640, 110)`} />
                <line x1="655" y1="116" x2="655" y2="155" stroke="#71717A" strokeWidth="2" />

                {/* Front Splitter Extension */}
                <rect x={120 - splitterExtension * 300} y="228" width={splitterExtension * 300 + 10} height="4" fill="#E53935" rx="1" />

                {/* Wheels */}
                <circle cx="210" cy="230" r="28" fill="#18181B" stroke="#52525B" strokeWidth="3" />
                <circle cx="590" cy="230" r="30" fill="#18181B" stroke="#52525B" strokeWidth="3" />

                {/* Ground plane */}
                <line x1="0" y1="260" x2="800" y2="260" stroke="#3F3F46" strokeWidth="2" strokeDasharray="12 6" />
              </svg>
            </div>
          </div>

          {/* Pareto Optimization Results */}
          {optResult && (
            <div className="p-4 rounded-2xl bg-gt-basalt/60 border border-gt-border shadow-xl space-y-3 font-mono text-xs">
              <h3 className="font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Pareto Multi-Objective Optimization Results</span>
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-black/40 border border-gt-border">
                  <div className="text-zinc-500 mb-1">OPTIMIZED DOWNFORCE</div>
                  <div className="text-base font-bold text-emerald-400">
                    {Math.round((optResult.recommendedBest?.metrics.downforceN || 0) / 9.80665)} kg
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-gt-border">
                  <div className="text-zinc-500 mb-1">OPTIMAL L/D EFFICIENCY</div>
                  <div className="text-base font-bold text-white">
                    {optResult.recommendedBest?.metrics.lOverD.toFixed(2) || '3.20'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-gt-border">
                  <div className="text-zinc-500 mb-1">EVALUATED DESIGNS</div>
                  <div className="text-base font-bold text-gt-accent">{optResult.totalEvaluated} designs</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Airfoil DAT Import Modal */}
      {showDatImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gt-basalt border border-gt-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs font-mono">
            <div className="flex items-center justify-between border-b border-gt-border pb-3">
              <h3 className="text-sm font-heading font-bold text-white">Import Custom Airfoil (.DAT Coordinates)</h3>
              <button onClick={() => setShowDatImport(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={datCode}
              onChange={(e) => setDatCode(e.target.value)}
              placeholder="AIRFOIL_CODE"
              className="w-full p-2.5 rounded-lg bg-black/50 border border-gt-border text-white font-mono"
            />
            <textarea
              rows={8}
              value={datText}
              onChange={(e) => setDatText(e.target.value)}
              placeholder="Paste Selig-format airfoil (x y) coordinates..."
              className="w-full p-2.5 rounded-lg bg-black/50 border border-gt-border text-white font-mono text-[11px]"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-gt-border">
              <button
                onClick={() => setShowDatImport(false)}
                className="px-4 py-2 rounded-lg bg-gt-graphite text-zinc-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleImportDat}
                className="px-4 py-2 rounded-lg bg-gt-accent text-white font-bold cursor-pointer"
              >
                Parse & Import Airfoil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
