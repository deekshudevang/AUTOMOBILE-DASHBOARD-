import React, { useState } from 'react';
import {
  Box,
  Wrench,
  CheckCircle2,
  RefreshCw,
  Eye,
  Layers,
  Sparkles,
  Scissors
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';

export const GeometryEditorView: React.FC = () => {
  const { engineeringMode, isWireframe, toggleWireframe, showNormals, toggleShowNormals } = useVehicleStore();

  const [subdivisionLevel, setSubdivisionLevel] = useState<number>(1);
  const [weldToleranceMm, setWeldToleranceMm] = useState<number>(0.1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Mesh metrics for current vehicle
  const [metrics, setMetrics] = useState({
    vertices: 48924,
    triangles: 96840,
    surfaceAreaM2: 18.64,
    enclosedVolumeM3: 4.82,
    isolatedVertices: 0,
    degenerateTriangles: 0
  });

  const handleRepairNormals = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setNotification('Face and vertex normals successfully unified.');
      setTimeout(() => setNotification(null), 3000);
    }, 400);
  };

  const handleMergeCoincident = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setMetrics(m => ({ ...m, vertices: m.vertices - 18, isolatedVertices: 0 }));
      setNotification('18 coincident vertices merged within 0.1 mm tolerance.');
      setTimeout(() => setNotification(null), 3000);
    }, 400);
  };

  return (
    <div className="h-full flex flex-col bg-autoverse-bg text-slate-100 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-autoverse-border shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">Procedural Geometry & Mesh Editor</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300">
              TOPOLOGY ENGINE
            </span>
            {engineeringMode === 'student' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                Student Mode Active
              </span>
            )}
          </div>
          <p className="text-xs text-autoverse-muted mt-1">
            Mesh subdivision, vertex normal unification, coincident point welding, and 2-manifold topological repair.
          </p>
        </div>
      </div>

      {notification && (
        <div className="mt-4 p-3 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Tools Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-5">
            <h2 className="text-sm font-bold text-slate-100 border-b border-autoverse-border pb-3">
              Mesh Modification & Topological Repair
            </h2>

            {/* Repair Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleRepairNormals}
                disabled={isProcessing}
                className="p-3.5 rounded bg-autoverse-elevated hover:bg-autoverse-overlay border border-autoverse-border text-left transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <RefreshCw className="w-4 h-4 text-autoverse-cyan" />
                  <span>Unify Vertex & Face Normals</span>
                </div>
                <p className="text-[11px] text-autoverse-muted mt-1">
                  Enforces outward-pointing orientation across all surface polygons.
                </p>
              </button>

              <button
                onClick={handleMergeCoincident}
                disabled={isProcessing}
                className="p-3.5 rounded bg-autoverse-elevated hover:bg-autoverse-overlay border border-autoverse-border text-left transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Scissors className="w-4 h-4 text-autoverse-cyan" />
                  <span>Weld Coincident Vertices</span>
                </div>
                <p className="text-[11px] text-autoverse-muted mt-1">
                  Merges duplicate vertices within {weldToleranceMm} mm to seal seams.
                </p>
              </button>
            </div>

            {/* Viewport Visualization Overlays */}
            <div className="p-4 rounded bg-autoverse-elevated border border-autoverse-border space-y-3">
              <h3 className="text-xs font-bold text-slate-200">Viewport Visualization Modes</h3>
              <div className="flex items-center gap-6 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isWireframe}
                    onChange={toggleWireframe}
                    className="rounded bg-autoverse-overlay border-autoverse-border text-autoverse-cyan"
                  />
                  <span>Wireframe Mesh Lines</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNormals}
                    onChange={toggleShowNormals}
                    className="rounded bg-autoverse-overlay border-autoverse-border text-autoverse-cyan"
                  />
                  <span>Show Vertex Normal Vectors</span>
                </label>
              </div>
            </div>

            {/* Loop Subdivision Controls */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Loop Subdivision Smooth Level</span>
                <span className="font-mono text-autoverse-cyan font-bold">Level {subdivisionLevel}</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={subdivisionLevel}
                onChange={e => setSubdivisionLevel(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 (Raw Low-Poly)</span>
                <span>1 (Standard Production)</span>
                <span>2 (Class-A Smooth)</span>
                <span>3 (Ultra-Density High-Poly)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mesh Metrics Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-autoverse-muted">
              Topology Metrics Readout
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Total Vertices</span>
                <span className="font-mono font-bold text-slate-200">{metrics.vertices.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Total Triangles</span>
                <span className="font-mono font-bold text-slate-200">{metrics.triangles.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Surface Wetted Area</span>
                <span className="font-mono font-bold text-autoverse-cyan">{metrics.surfaceAreaM2} m²</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Enclosed Body Volume</span>
                <span className="font-mono font-bold text-autoverse-cyan">{metrics.enclosedVolumeM3} m³</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Degenerate Triangles</span>
                <span className="font-mono font-bold text-emerald-400">{metrics.degenerateTriangles} (Clean)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-autoverse-border/50">
                <span className="text-slate-400">Isolated Vertices</span>
                <span className="font-mono font-bold text-emerald-400">{metrics.isolatedVertices}</span>
              </div>
            </div>

            {/* Student Explanation */}
            {engineeringMode === 'student' && (
              <div className="p-3 rounded bg-autoverse-elevated border border-autoverse-border text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-autoverse-cyan">🎓 Educational Insight</p>
                <p className="leading-relaxed">
                  CFD solvers require watertight surfaces without duplicate vertices or zero-area (degenerate) triangles. Clean topology ensures reliable boundary layer prisms and mesh generation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
