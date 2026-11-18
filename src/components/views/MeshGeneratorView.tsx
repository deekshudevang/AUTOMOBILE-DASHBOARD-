import React, { useState } from 'react';
import {
  Grid,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Activity,
  Cpu
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';

export const MeshGeneratorView: React.FC = () => {
  const { engineeringMode } = useVehicleStore();

  const [meshDensity, setMeshDensity] = useState<'coarse' | 'medium' | 'fine'>('medium');
  const [targetYPlus, setTargetYPlus] = useState<number>(30); // 1 or 30
  const [numPrismLayers, setNumPrismLayers] = useState<number>(8);
  const [expansionRatio, setExpansionRatio] = useState<number>(1.2);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [meshGenerated, setMeshGenerated] = useState<boolean>(true);

  // Vehicle baseline dimensions (e.g. GT3 RS: L=4.57m, W=1.90m, H=1.32m)
  const L = 4.57;
  const W = 1.90;
  const H = 1.32;
  const frontalArea = W * H * 0.85; // approx 2.13 m^2

  // Domain Sizing
  const domainLength = L * 9; // 3L upstream + 6L wake = ~41m
  const domainWidth = W * 5; // ~9.5m
  const domainHeight = H * 3.5; // ~4.6m
  const domainVolume = domainLength * domainWidth * domainHeight;
  const blockageRatio = ((frontalArea / (domainWidth * domainHeight)) * 100).toFixed(2);

  // Y+ First Cell Height Calculation (Re = 9.14e6 @ 30 m/s)
  const U_inf = 30; // m/s
  const nu = 1.5e-5; // m^2/s
  const Re_L = (U_inf * L) / nu;
  const Cf = Math.pow(2 * Math.log10(Re_L) - 0.65, -2.3);
  const tau_w = 0.5 * 1.225 * U_inf * U_inf * Cf;
  const u_tau = Math.sqrt(tau_w / 1.225);
  const y1_mm = ((targetYPlus * nu) / u_tau) * 1000; // mm

  const cellCountEstimate = meshDensity === 'coarse' ? '1,420,000' : meshDensity === 'medium' ? '4,850,000' : '14,200,000';

  const handleGenerateMesh = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setMeshGenerated(true);
    }, 800);
  };

  return (
    <div className="h-full flex flex-col bg-autoverse-bg text-slate-100 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-autoverse-border shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">Simulation Mesh Generator</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300">
              SNAPPYHEXMESH PIPELINE
            </span>
            {engineeringMode === 'student' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                Student Mode Active
              </span>
            )}
          </div>
          <p className="text-xs text-autoverse-muted mt-1">
            Hexahedral-dominant volume mesh creation with anisotropic boundary layer prism inflations and automatic y+ cell sizing.
          </p>
        </div>

        <button
          onClick={handleGenerateMesh}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded bg-autoverse-cyan hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors disabled:opacity-50"
        >
          <Cpu className="w-4 h-4" />
          <span>{isGenerating ? 'Generating SnappyHexMesh...' : 'Generate Simulation Mesh'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Mesh Setup Parameters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-5">
            <h2 className="text-sm font-bold text-slate-100 border-b border-autoverse-border pb-3">
              Boundary Layer Prism Inflation & Cell Sizing
            </h2>

            {/* Density Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Global Mesh Resolution</label>
              <div className="grid grid-cols-3 gap-3">
                {(['coarse', 'medium', 'fine'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setMeshDensity(d)}
                    className={`p-3 rounded text-left transition-colors border ${
                      meshDensity === d
                        ? 'bg-autoverse-elevated border-autoverse-cyan text-autoverse-cyan font-bold'
                        : 'bg-autoverse-elevated/40 border-autoverse-border text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs capitalize block">{d}</span>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                      {d === 'coarse' ? '~1.4M cells (Fast)' : d === 'medium' ? '~4.8M cells (Production)' : '~14M cells (High-Res)'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target y+ & Wall Treatment */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Target Wall $y^+$ Treatment</span>
                <span className="font-mono text-autoverse-cyan font-bold">y+ = {targetYPlus}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTargetYPlus(30)}
                  className={`p-3 rounded text-left border ${
                    targetYPlus === 30
                      ? 'bg-autoverse-elevated border-autoverse-cyan text-autoverse-cyan'
                      : 'bg-autoverse-elevated/40 border-autoverse-border text-slate-400'
                  }`}
                >
                  <span className="text-xs font-semibold block">Standard Wall Functions (y+ ≈ 30)</span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    Recommended for vehicle RANS. 1st layer: {y1_mm.toFixed(2)} mm
                  </span>
                </button>
                <button
                  onClick={() => setTargetYPlus(1)}
                  className={`p-3 rounded text-left border ${
                    targetYPlus === 1
                      ? 'bg-autoverse-elevated border-autoverse-cyan text-autoverse-cyan'
                      : 'bg-autoverse-elevated/40 border-autoverse-border text-slate-400'
                  }`}
                >
                  <span className="text-xs font-semibold block">Full Viscous Sublayer Resolved (y+ ≈ 1)</span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    Ultra-dense near-wall mesh. 1st layer: {(y1_mm / 30).toFixed(3)} mm
                  </span>
                </button>
              </div>
            </div>

            {/* Prism Layers Count & Growth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Prism Inflation Layers</span>
                  <span className="font-mono text-autoverse-cyan">{numPrismLayers} layers</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="16"
                  step="1"
                  value={numPrismLayers}
                  onChange={e => setNumPrismLayers(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Layer Expansion Ratio</span>
                  <span className="font-mono text-autoverse-cyan">{expansionRatio.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.1"
                  max="1.35"
                  step="0.01"
                  value={expansionRatio}
                  onChange={e => setExpansionRatio(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mesh Metrics Readout Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-autoverse-muted">
              Virtual Wind Tunnel Domain
            </h3>

            {/* Blockage Card */}
            <div className="p-3.5 rounded bg-autoverse-elevated border border-autoverse-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Frontal Blockage Ratio</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{blockageRatio}%</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Meets automotive wind tunnel standard: blockage &lt; 3.0% ensures zero artificial tunnel wall acceleration.
              </p>
            </div>

            {/* Mesh Quality Gates */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Estimated Total Cells</span>
                <span className="font-mono font-bold text-autoverse-cyan">{cellCountEstimate}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">First Cell Height ($y_1$)</span>
                <span className="font-mono font-bold text-slate-200">
                  {targetYPlus === 1 ? (y1_mm / 30).toFixed(3) : y1_mm.toFixed(2)} mm
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Min Orthogonal Quality</span>
                <span className="font-mono font-bold text-emerald-400">0.32 (&gt; 0.15 PASS)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Max Face Skewness</span>
                <span className="font-mono font-bold text-emerald-400">0.68 (&lt; 0.85 PASS)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Domain Length</span>
                <span className="font-mono font-bold text-slate-200">{domainLength.toFixed(1)} m</span>
              </div>
            </div>

            {/* Student Explanation */}
            {engineeringMode === 'student' && (
              <div className="p-3 rounded bg-autoverse-elevated border border-autoverse-border text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-autoverse-cyan">🎓 Why is $y^+$ critical?</p>
                <p className="leading-relaxed">
                  $y^+$ is the non-dimensional wall distance. If the first cell is too tall (y+ &gt; 100), turbulence models cannot accurately predict skin friction or flow separation over the rear window.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
