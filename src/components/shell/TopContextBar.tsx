import React, { useState, useEffect } from 'react';
import {
  Car,
  FolderKanban,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  Save,
  Wrench,
  GraduationCap,
  Activity,
  Cpu,
  Layers,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { ProjectManager } from '../../projects/projectManager';
import { VehicleSelectionModal } from '../gallery/VehicleSelectionModal';

export const TopContextBar: React.FC = () => {
  const {
    activeView,
    activeModel,
    activeFile,
    isDirty,
    engineeringMode,
    toggleEngineeringMode
  } = useVehicleStore();

  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [activeProjectName, setActiveProjectName] = useState<string>('Porsche GT3 RS Reference Spec');
  const [activeRevisionHash, setActiveRevisionHash] = useState<string>('c9fa4b2e');
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check if projects exist in ProjectManager
    const projects = ProjectManager.listProjects();
    if (projects.length > 0) {
      const latest = projects[projects.length - 1];
      setActiveProjectName(latest.meta.name);
      const revs = ProjectManager.getRevisions(latest.meta.id);
      if (revs.length > 0) {
        setActiveRevisionHash(revs[revs.length - 1].hash);
      }
    }
  }, [activeView]);

  // View titles map
  const viewTitles: Record<string, { title: string; category: string }> = {
    dashboard: { title: 'Engineering Workspace', category: 'Overview' },
    library: { title: 'Vehicle Library', category: 'Catalog' },
    projects: { title: 'Projects & Revisions DAG', category: 'Management' },
    studio: { title: '3D Engineering Viewport', category: 'CAD & CAE' },
    componentLibrary: { title: 'Component Library', category: 'CAD & Components' },
    componentEditor: { title: 'Parametric Component Editor', category: 'CAD & Components' },
    assembly: { title: 'Assembly & Kinematic Clearance', category: 'CAD & Components' },
    cadDesigner: { title: 'CAD Designer & STEP AP214', category: 'CAD & Components' },
    geometryEditor: { title: 'Mesh Diagnostics & Healer', category: 'CAD & Components' },
    materialStudio: { title: 'Automotive PBR Material Studio', category: 'CAD & Components' },
    aeroStudio: { title: 'Aero Studio & Wing Designer', category: 'Simulation & Aero' },
    meshGenerator: { title: 'Boundary Layer Mesh Generator', category: 'Simulation & Aero' },
    cfdLab: { title: 'CFD Wind Tunnel Laboratory', category: 'Simulation & Aero' },
    dynamics: { title: 'Vehicle Dynamics & Load Coupling', category: 'Simulation & Aero' },
    results: { title: 'Results & Simulation Polar', category: 'Simulation & Aero' },
    reports: { title: 'Engineering Reports Generator', category: 'Knowledge & System' },
    learning: { title: 'Learning Centre & Curriculum', category: 'Knowledge & System' },
    assetManager: { title: '3D Asset Pipeline Manager', category: 'Knowledge & System' },
    settings: { title: 'System & Solver Settings', category: 'Knowledge & System' }
  };

  const currentViewInfo = viewTitles[activeView] || { title: activeView, category: 'Workspace' };

  return (
    <header className="h-12 w-full bg-autoverse-surface border-b border-autoverse-border px-4 flex items-center justify-between shrink-0 select-none z-20 text-xs">
      {/* Left: Breadcrumbs & Current Workspace */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
          <span>{currentViewInfo.category}</span>
          <span className="text-slate-600">/</span>
          <span className="font-semibold text-slate-100">{currentViewInfo.title}</span>
        </div>
      </div>

      {/* Middle: Active Vehicle & Project Revision Telemetry */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Active Vehicle Badge with 1-Click Switcher */}
        <button
          onClick={() => setIsVehicleModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-autoverse-elevated border border-autoverse-border hover:border-autoverse-cyan text-slate-300 hover:text-white transition-all cursor-pointer group"
          title="Click to switch vehicle (50 models available)"
        >
          <Car className="w-3.5 h-3.5 text-autoverse-cyan group-hover:scale-110 transition-transform" />
          <span className="font-medium">
            {activeModel ? `${activeModel.manufacturer} ${activeModel.displayName}` : activeFile ? activeFile.replace('.json', '') : 'No Vehicle Loaded'}
          </span>
          <span className="text-[10px] text-autoverse-cyan px-1 rounded bg-cyan-950/60 border border-cyan-800/80 ml-1">
            Switch
          </span>
        </button>

        {/* Active Project & Revision */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-autoverse-elevated border border-autoverse-border font-mono text-[11px]">
          <GitBranch className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-300 truncate max-w-[180px]">{activeProjectName}</span>
          <span className="text-autoverse-cyan px-1 rounded bg-cyan-950/60 border border-cyan-800/80 text-[10px]">
            #{activeRevisionHash}
          </span>
        </div>

        {/* Save & Dirty State Indicator */}
        <div className="flex items-center gap-1 text-[11px]">
          {isDirty ? (
            <span className="flex items-center gap-1 text-autoverse-amber font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-autoverse-amber animate-pulse" />
              Unsaved Changes
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Right: Engineering Mode Toggle & Backend State */}
      <div className="flex items-center gap-3">
        {/* Engineering Mode Switch */}
        <button
          onClick={toggleEngineeringMode}
          title="Toggle between Student Mode (guided explanations) and Advanced CAE (raw engineering parameters)"
          className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-medium transition-all border ${
            engineeringMode === 'student'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-950/80'
              : 'bg-cyan-950/60 border-cyan-800 text-cyan-300 hover:bg-cyan-950/80'
          }`}
        >
          {engineeringMode === 'student' ? (
            <>
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">Student Mode</span>
            </>
          ) : (
            <>
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px]">Advanced CAE</span>
            </>
          )}
        </button>

        {/* Backend & Solver Diagnostics Status Pill */}
        <div
          title={backendOnline ? "FastAPI Backend & Simulation Workers Active" : "Backend Offline — Using Analytical Fallbacks"}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-autoverse-elevated border border-autoverse-border font-mono text-[10px]"
        >
          <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400' : 'bg-rose-500'}`} />
          <span className="text-slate-300 hidden sm:inline">
            {backendOnline ? 'ENGINE READY' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* 50-Vehicle Selection Modal */}
      <VehicleSelectionModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />
    </header>
  );
};
