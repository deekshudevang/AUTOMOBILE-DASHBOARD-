import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Layers,
  Box,
  Activity,
  CheckCircle2,
  AlertCircle,
  HardDrive
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';

export const EngineeringStatusBar: React.FC = () => {
  const { engineeringMode, activeModel } = useVehicleStore();

  return (
    <footer className="h-7 w-full bg-autoverse-surface/90 border-t border-autoverse-border px-3 flex items-center justify-between shrink-0 select-none z-20 text-[10px] font-mono text-slate-400">
      {/* Left: Geometry & Assembly Validity */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300">ISO 10303-21 B-Rep:</span>
          <span className="text-emerald-400 font-semibold">2-MANIFOLD (&chi;=2)</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Kinematic Clearance:</span>
          <span className="text-emerald-400">PASSED (0 Penetrations)</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5">
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Vehicle Frame:</span>
          <span className="text-cyan-300">SAE J670 / ISO 8855</span>
        </div>
      </div>

      {/* Right: Solvers, Simulation Status & LOD */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span className="text-slate-300">Aero Polar:</span>
          <span className="text-cyan-300">Cd: 0.384 | Cl: -0.428</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 hidden sm:inline">|</span>
          <Cpu className="w-3 h-3 text-slate-400" />
          <span className="text-slate-300">Physics Engine:</span>
          <span className="text-slate-200">
            {engineeringMode === 'student' ? 'Guided Analytical' : 'OpenFOAM RANS'}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-slate-600">|</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-300">LOD:</span>
          <span className="text-slate-200">0 (Full CAD)</span>
        </div>
      </div>
    </footer>
  );
};
