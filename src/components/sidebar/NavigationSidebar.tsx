import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Layers,
  Box,
  SlidersHorizontal,
  FolderArchive,
  History,
  Download,
  Settings,
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
  GraduationCap,
  Search,
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useVehicleStore, ActiveView } from '../../hooks/useVehicleStore';
import { useUiStore, Workspace } from '../../state/useUiStore';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  workspace: Workspace | 'global';
  badge?: string;
}

export const NavigationSidebar: React.FC = () => {
  const { activeView, setActiveView, allFiles } = useVehicleStore();
  const { activeWorkspace, setActiveWorkspace } = useUiStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);

  // Complete registry of all 24 views classified by workspace
  const ALL_NAV_ITEMS: NavItem[] = useMemo(
    () => [
      // Atelier Workspace
      { id: 'dashboard', label: 'Showroom Home', icon: LayoutDashboard, workspace: 'atelier' },
      { id: 'studio', label: '3D Car Studio', icon: Box, workspace: 'atelier' },
      { id: 'library', label: 'Vehicle Fleet', icon: Car, workspace: 'atelier', badge: `${allFiles.length}` },
      { id: 'customizer', label: 'Studio Customizer', icon: SlidersHorizontal, workspace: 'atelier' },
      { id: 'materialStudio', label: 'Material Studio', icon: Palette, workspace: 'atelier' },

      // Telemetry Workspace
      { id: 'dynamics', label: 'Vehicle Dynamics', icon: Activity, workspace: 'telemetry' },
      { id: 'aeroStudio', label: 'Aero Wind Tunnel', icon: Wind, workspace: 'telemetry' },
      { id: 'results', label: 'Simulation Results', icon: Activity, workspace: 'telemetry' },
      { id: 'comparison', label: 'Spec Comparison', icon: Sliders, workspace: 'telemetry' },

      // Engineering Workspace
      { id: 'cadDesigner', label: 'CAD Modeler (STEP)', icon: FileCode, workspace: 'engineering' },
      { id: 'componentLibrary', label: 'CAD Components', icon: Layers, workspace: 'engineering', badge: '80+' },
      { id: 'componentEditor', label: 'Parametric Editor', icon: Sliders, workspace: 'engineering' },
      { id: 'assembly', label: 'Assembly Validation', icon: ShieldCheck, workspace: 'engineering' },
      { id: 'geometryEditor', label: 'Mesh Healer', icon: Wrench, workspace: 'engineering' },
      { id: 'cfdLab', label: 'OpenFOAM CFD Lab', icon: Cpu, workspace: 'engineering' },
      { id: 'meshGenerator', label: 'Mesh Generator', icon: Grid, workspace: 'engineering' },
      { id: 'explorer', label: 'B-Rep Explorer', icon: FileCode, workspace: 'engineering' },
      { id: 'reports', label: 'CAE Reports', icon: FileText, workspace: 'engineering' },

      // Global System Views
      { id: 'projects', label: 'Projects & Builds', icon: FolderKanban, workspace: 'global' },
      { id: 'history', label: 'Revision Timeline', icon: History, workspace: 'global' },
      { id: 'export', label: 'Export Center', icon: Download, workspace: 'global' },
      { id: 'learning', label: 'Learning Centre', icon: GraduationCap, workspace: 'global' },
      { id: 'assetManager', label: 'Asset Pipeline', icon: FolderArchive, workspace: 'global' },
      { id: 'settings', label: 'System Settings', icon: Settings, workspace: 'global' }
    ],
    [allFiles.length]
  );

  // Filter items: if searching, search all 24 views; otherwise filter by active workspace + global items
  const visibleItems = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return ALL_NAV_ITEMS.filter(
        (item) => item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
      );
    }
    return ALL_NAV_ITEMS.filter(
      (item) => item.workspace === activeWorkspace || item.workspace === 'global'
    );
  }, [ALL_NAV_ITEMS, activeWorkspace, searchQuery]);

  const handleItemClick = (item: NavItem) => {
    if (item.workspace !== 'global') {
      setActiveWorkspace(item.workspace);
    }
    setActiveView(item.id);
  };

  return (
    <aside
      onMouseEnter={() => setIsHoverExpanded(true)}
      onMouseLeave={() => setIsHoverExpanded(false)}
      className={`hidden sm:flex flex-col justify-between h-screen hud-glass border-r border-gt-border select-none z-panel shrink-0 transition-all duration-200 ease-out ${
        isHoverExpanded ? 'w-56 shadow-2xl' : 'w-16'
      }`}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header Rail Indicator */}
        <div className="h-12 px-3 flex items-center justify-between border-b border-gt-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-gt-graphite border border-gt-border flex items-center justify-center text-gt-accent shrink-0 font-display font-bold text-xs shadow-sm">
              GT
            </div>
            {isHoverExpanded && (
              <div className="truncate animate-fade-in">
                <span className="font-display font-bold tracking-wider text-xs text-gt-text-primary block">
                  WORKSTATION
                </span>
                <span className="text-[10px] font-mono text-gt-accent uppercase tracking-tight block">
                  {activeWorkspace} Mode
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Search across all 24 views */}
        {isHoverExpanded && (
          <div className="px-3 py-2 border-b border-gt-border/80 animate-fade-in">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-gt-text-secondary absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search views..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gt-obsidian border border-gt-border rounded-md pl-8 pr-7 py-1 text-xs text-gt-text-primary placeholder:text-gt-text-secondary focus:outline-none focus:border-gt-accent font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-gt-text-secondary hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation Item Rail */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                title={item.label}
                aria-label={item.label}
                className={`w-full flex items-center ${
                  isHoverExpanded ? 'justify-between px-3' : 'justify-center px-0'
                } py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-red-950/80 to-gt-graphite text-white border border-red-600/60 shadow-sm'
                    : 'text-gt-text-secondary hover:text-gt-text-primary hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-gt-accent scale-110' : 'text-gt-text-secondary'
                    }`}
                  />
                  {isHoverExpanded && <span className="truncate">{item.label}</span>}
                </div>

                {isHoverExpanded && item.badge && (
                  <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-gt-text-secondary border border-white/10 shrink-0">
                    {item.badge}
                  </span>
                )}

                {isActive && !isHoverExpanded && (
                  <span className="absolute right-1 w-1.5 h-1.5 rounded-full bg-gt-accent" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Rail Footer */}
      <div className="p-2 border-t border-gt-border shrink-0 flex items-center justify-center">
        <div className="flex items-center gap-2 text-[10px] font-mono text-gt-text-secondary">
          <div className="w-2 h-2 rounded-full bg-gt-ok" />
          {isHoverExpanded && <span>READY</span>}
        </div>
      </div>
    </aside>
  );
};
