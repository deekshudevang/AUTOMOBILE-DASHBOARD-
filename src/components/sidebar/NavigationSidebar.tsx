import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Box,
  FileCode2,
  SlidersHorizontal,
  GitCompare,
  FolderArchive,
  History,
  Download,
  Settings,
  ChevronRight,
  Car,
  FolderKanban,
  Sliders,
  ShieldCheck,
  FileCode,
  Wrench,
  Palette,
  Wind,
  Grid,
  Cpu,
  Activity,
  FileText,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { useVehicleStore, ActiveView } from '../../hooks/useVehicleStore';
import { toHex32 } from '../../utils/joaat';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'library', label: 'Vehicle Library', icon: Layers, badge: '50+' },
      { id: 'projects', label: 'Projects DAG', icon: FolderKanban },
      { id: 'studio', label: '3D Studio', icon: Box }
    ]
  },
  {
    title: 'CAD & Components',
    items: [
      { id: 'componentLibrary', label: 'Component Library', icon: Layers, badge: '80+' },
      { id: 'componentEditor', label: 'Parametric Editor', icon: Sliders },
      { id: 'assembly', label: 'Assembly Validation', icon: ShieldCheck },
      { id: 'cadDesigner', label: 'CAD Designer', icon: FileCode },
      { id: 'geometryEditor', label: 'Geometry & Mesh', icon: Wrench },
      { id: 'materialStudio', label: 'Material Studio', icon: Palette }
    ]
  },
  {
    title: 'Simulation & Aero',
    items: [
      { id: 'aeroStudio', label: 'Aero Studio', icon: Wind },
      { id: 'meshGenerator', label: 'Mesh Generator', icon: Grid },
      { id: 'cfdLab', label: 'CFD Wind Tunnel', icon: Cpu },
      { id: 'dynamics', label: 'Vehicle Dynamics', icon: Activity },
      { id: 'results', label: 'Results Analyzer', icon: Activity }
    ]
  },
  {
    title: 'Knowledge & System',
    items: [
      { id: 'reports', label: 'Engineering Reports', icon: FileText },
      { id: 'learning', label: 'Learning Centre', icon: GraduationCap },
      { id: 'assetManager', label: 'Asset Manager', icon: FolderArchive },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  }
];

export const NavigationSidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    activeFile,
    activeModel,
    isDirty,
    allFiles,
    engineeringMode,
    toggleEngineeringMode
  } = useVehicleStore();

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden sm:flex flex-col justify-between w-16 md:w-64 h-screen bg-autoverse-surface border-r border-autoverse-border select-none z-30 shrink-0">
        {/* Top Header & Navigation */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Brand Header */}
          <div className="h-14 md:h-16 px-3 md:px-5 flex items-center justify-between border-b border-autoverse-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-autoverse-elevated border border-autoverse-border flex items-center justify-center text-autoverse-cyan shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-wider text-sm text-slate-100">AUTOVERSE</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-autoverse-elevated border border-autoverse-border text-autoverse-cyan">
                    3D
                  </span>
                </div>
                <p className="text-[11px] text-autoverse-muted tracking-tight">Automotive CAD & Aero</p>
              </div>
            </div>
          </div>

          {/* Student Mode / Advanced Mode Toggle Pill */}
          <div className="p-2 md:p-3 border-b border-autoverse-border shrink-0">
            <button
              onClick={toggleEngineeringMode}
              title={`Switch to ${engineeringMode === 'student' ? 'Advanced' : 'Student'} Mode`}
              className={`w-full flex items-center justify-between p-2 rounded transition-all border ${
                engineeringMode === 'student'
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300 hover:bg-emerald-950/60'
                  : 'bg-cyan-950/40 border-cyan-800/80 text-cyan-300 hover:bg-cyan-950/60'
              }`}
            >
              <div className="flex items-center gap-2">
                {engineeringMode === 'student' ? (
                  <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Wrench className="w-4 h-4 text-cyan-400 shrink-0" />
                )}
                <div className="hidden md:block text-left">
                  <span className="text-[11px] font-bold block uppercase tracking-wider">
                    {engineeringMode === 'student' ? 'Student Mode' : 'Advanced CAE'}
                  </span>
                  <span className="text-[9px] text-slate-400 block -mt-0.5">
                    {engineeringMode === 'student' ? 'Guided with guardrails' : 'Raw CAD & Solvers'}
                  </span>
                </div>
              </div>
              <span className="hidden md:inline text-[9px] font-mono px-1.5 py-0.5 rounded bg-autoverse-overlay text-slate-300">
                TOGGLE
              </span>
            </button>
          </div>

          {/* Scrollable Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-2 md:p-3 space-y-4">
            {NAV_SECTIONS.map(section => (
              <div key={section.title} className="space-y-1">
                <h3 className="hidden md:block px-2 text-[10px] font-mono uppercase tracking-wider text-autoverse-muted">
                  {section.title}
                </h3>
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      title={item.label}
                      aria-label={item.label}
                      className={`w-full flex items-center justify-center md:justify-between px-2 md:px-2.5 py-1.5 rounded text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-autoverse-elevated text-slate-100 border border-autoverse-borderLight shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-autoverse-elevated/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`${isActive ? 'text-autoverse-cyan' : 'text-slate-400'}`}>
                          <Icon className="w-4 h-4 shrink-0" />
                        </span>
                        <span className="hidden md:inline truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="hidden md:inline text-[10px] font-mono px-1.5 py-0.2 rounded bg-autoverse-overlay text-slate-400">
                          {item.badge}
                        </span>
                      )}
                      {isActive && !item.badge && (
                        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-autoverse-cyan" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Active Vehicle Status Footer */}
        <div className="hidden md:block p-3 border-t border-autoverse-border bg-autoverse-elevated/40 shrink-0">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Active Spec</span>
            {isDirty && (
              <span className="text-autoverse-amber font-mono font-medium flex items-center gap-1">
                ● Modified
              </span>
            )}
          </div>
          <div className="p-2.5 rounded bg-autoverse-elevated border border-autoverse-border">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-200 truncate" title={activeModel?.displayName || activeFile}>
                {activeModel?.displayName || activeFile.replace('.json', '')}
              </h4>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
              <span className="truncate">{activeModel?.manufacturer || 'Vehicle'}</span>
              <span className="font-mono text-[10px] text-autoverse-cyan shrink-0">
                {activeModel ? toHex32(activeModel.hash) : '0x00'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navigation Bar (<640px) */}
      <nav className="sm:hidden fixed top-0 left-0 right-0 h-12 bg-autoverse-surface/95 backdrop-blur-md border-b border-autoverse-border z-40 flex items-center justify-around px-2 text-slate-400">
        <button
          onClick={() => setActiveView('studio')}
          aria-label="3D Studio"
          className={`p-2 rounded-lg transition-colors ${activeView === 'studio' ? 'text-autoverse-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          <Box className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveView('componentEditor')}
          aria-label="Parametric Editor"
          className={`p-2 rounded-lg transition-colors ${activeView === 'componentEditor' ? 'text-autoverse-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          <Sliders className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveView('aeroStudio')}
          aria-label="Aero Studio"
          className={`p-2 rounded-lg transition-colors ${activeView === 'aeroStudio' ? 'text-autoverse-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          <Wind className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveView('cfdLab')}
          aria-label="CFD Lab"
          className={`p-2 rounded-lg transition-colors ${activeView === 'cfdLab' ? 'text-autoverse-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          <Cpu className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveView('dashboard')}
          aria-label="Dashboard"
          className={`p-2 rounded-lg transition-colors ${activeView === 'dashboard' ? 'text-autoverse-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
        </button>
      </nav>
    </>
  );
};
